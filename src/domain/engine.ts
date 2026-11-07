import { allExercises, exercises, exerciseById } from '../data/catalog';
import type { Exercise, Level, Machine, Muscle, Profile, Routine, RoutineItem, Session } from './schema';
import { validateConfiguration } from './springs';

export const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const levelRank: Record<Level, number> = { principiante: 0, intermedio: 1, avanzado: 2 };
const words: [RegExp, Muscle[]][] = [
  [/pecho|pectoral/, ['Pecho']], [/glute|nalgas/, ['Glúteos']], [/piernas|tren inferior/, ['Cuádriceps', 'Glúteos', 'Isquiotibiales']],
  [/cuadriceps/, ['Cuádriceps']], [/isquio/, ['Isquiotibiales']], [/pantorrilla|gemelo/, ['Pantorrillas']],
  [/espalda/, ['Espalda']], [/hombro/, ['Hombros']], [/biceps/, ['Bíceps']], [/triceps/, ['Tríceps']],
  [/brazos|tren superior/, ['Bíceps', 'Tríceps', 'Hombros']], [/abdomen|abdominal/, ['Abdomen', 'Core']],
  [/core/, ['Core']], [/cadera/, ['Cadera']], [/cuerpo completo|integral|full body/, ['Cuerpo completo']],
  [/movilidad/, ['Movilidad']], [/flexibilidad/, ['Flexibilidad']], [/estabilidad|equilibrio/, ['Estabilidad']]
];
export type Request = { duration: number; level: Level; targets: Muscle[]; avoid: Muscle[]; gentle: boolean; intensity: Profile['intensity']; fewerChanges: boolean; warnings: string[] };
export function parseRequest(input: string, profile: Profile, targets: Muscle[] = []): Request {
  const n = normalize(input);
  const negative = [...n.matchAll(/(?:sin|evita(?:r)?|no trabajar)\s+([^.,;]+)/g)].map(m => m[1]).join(' ');
  const positive = n.replace(/(?:sin|evita(?:r)?|no trabajar)\s+[^.,;]+/g, '');
  const detected = words.filter(([re]) => re.test(positive)).flatMap(([, ms]) => ms);
  const avoid = [...new Set([...profile.avoid, ...words.filter(([re]) => re.test(negative)).flatMap(([, ms]) => ms)])];
  const requestedLevel: Level = /principiante|basico|sin ejercicios avanzados/.test(n) ? 'principiante' : /avanzado/.test(positive) ? 'avanzado' : /intermedio/.test(positive) ? 'intermedio' : profile.level;
  const level = levelRank[requestedLevel] <= levelRank[profile.level] ? requestedLevel : profile.level;
  const requestedMinutes = Number(n.match(/(\d{1,3})\s*(?:min|minutos)/)?.[1] || (/una hora/.test(n) ? 60 : /media hora/.test(n) ? 30 : profile.duration));
  const duration = Math.min(60, Math.max(10, requestedMinutes));
  const gentle = /suave|recuperacion|movilidad|flexibilidad/.test(positive || normalize(profile.goal));
  return {
    duration, level, targets: [...new Set(detected.length ? detected : targets.length ? targets : profile.priorities.length ? profile.priorities : ['Cuerpo completo'] as Muscle[])].filter(m => !avoid.includes(m)),
    avoid, gentle, intensity: gentle ? 'suave' : /intens[oa]|fuerza/.test(positive) ? 'intensa' : profile.intensity,
    fewerChanges: /sin cambiar|pocos cambios|menos cambios|sin.*demasiad/.test(n),
    warnings: [...(duration !== requestedMinutes ? ['Esta versión genera sesiones de 10 a 60 minutos.'] : []), ...(requestedLevel !== level ? ['Se mantiene el nivel de tu perfil. Actualízalo si tu experiencia cambió.'] : [])]
  };
}
export const itemDuration = (i: RoutineItem) => i.seconds * i.sets * i.sides + i.rest * Math.max(0, i.sets * i.sides - 1) + i.transition;
export const routineDuration = (r: Routine) => r.items.reduce((sum, i) => sum + itemDuration(i), 0);
const uid = () => crypto.randomUUID();
function makeItem(exerciseId: string, phase: RoutineItem['phase'], machine?: Machine): RoutineItem {
  const e = exerciseById(exerciseId);
  return { id: uid(), exerciseId, phase, sets: phase === 'Práctica' ? 2 : 1, reps: phase === 'Práctica' ? 8 : 0,
    seconds: phase === 'Práctica' ? 45 : 40, rest: phase === 'Práctica' ? 20 : 0, transition: e.equipment === 'reformer' ? 30 : 10,
    sides: e.bilateral ? 2 : 1, configuration: e.equipment === 'reformer' && machine ? structuredClone(machine.settings[e.id] || null) : null, notes: '' };
}
export function compatibleExercises(profile: Profile, request: Request, machine?: Machine): Exercise[] {
  const restrictions = normalize(profile.restrictions);
  // Conservative: limitations are not diagnoses and must not produce a medical clearance.
  if (restrictions.trim()) return [];
  return exercises.filter(e => levelRank[e.level] <= levelRank[request.level] &&
    ![...e.primary, ...e.secondary].some(m => request.avoid.includes(m)) &&
    (!machine || e.accessories.every(a => machine.accessories.includes(a))));
}
export function generateRoutine(input: string, profile: Profile, machine?: Machine, targets: Muscle[] = [], history: Session[] = []): Routine {
  const request = parseRequest(input, profile, targets);
  const warnings = [...request.warnings];
  const recent = history.filter(s => Date.now() - Date.parse(s.startedAt) < 48 * 3600000).flatMap(s => s.logs.filter(l => l.rpe >= 8).map(l => l.exerciseId));
  const pool = compatibleExercises(profile, request, machine);
  if (profile.restrictions.trim()) warnings.push('Registraste una necesidad de modificación. Esta propuesta usa preparación suave; revisa la selección de Reformer con un profesional.');
  if (/dolor|lesion|rehabilit|embaraz|osteopor/.test(normalize(input))) {
    warnings.push('Esta solicitud requiere valoración profesional. No se genera una prescripción de Reformer.');
    pool.length = 0;
  }
  const targeted = !request.targets.includes('Cuerpo completo');
  const score = (e: Exercise) => (targeted ? e.primary.filter(m => request.targets.includes(m)).length * 5 + e.secondary.filter(m => request.targets.includes(m)).length : 2) - (recent.includes(e.id) ? 2 : 0);
  const relevant = pool.filter(e => !targeted || score(e) > 0).sort((a,b) => score(b) - score(a) || a.id.localeCompare(b.id));
  const wanted = request.duration <= 15 ? 3 : request.duration <= 30 ? 5 : 7;
  const chosen: Exercise[] = [];
  // Give each requested group its primary movement before filling by rank.
  for (const m of request.targets) {
    const e = relevant.find(e => e.primary.includes(m) && !chosen.includes(e));
    if (e) chosen.push(e);
  }
  for (const e of relevant) if (chosen.length < wanted && !chosen.includes(e)) chosen.push(e);
  const ordered = chosen.slice(0, wanted).sort((a,b) => {
    const positions = ['Boca arriba', 'Sentado', 'Boca abajo'];
    return positions.indexOf(a.position) - positions.indexOf(b.position) || (request.fewerChanges ? JSON.stringify(machine?.settings[a.id]?.springs || {}).localeCompare(JSON.stringify(machine?.settings[b.id]?.springs || {})) : 0);
  });
  const upper = request.gentle || request.targets.some(m => ['Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 'Cuerpo completo'].includes(m));
  const lower = request.gentle || request.targets.some(m => ['Glúteos', 'Cuádriceps', 'Isquiotibiales', 'Pantorrillas', 'Cadera', 'Cuerpo completo'].includes(m));
  const warmIds = ['breath', ...(upper ? ['shoulders'] : []), ...(lower ? ['hips', 'ankles'] : [])];
  const prepIds = warmIds.filter(id => !exerciseById(id).primary.some(m => request.avoid.includes(m)) && !exerciseById(id).avoidTags.some(t => normalize(profile.restrictions).includes(t)));
  if (!prepIds.length) prepIds.push('breath');
  const items = [...prepIds.map(id => makeItem(id, 'Preparación')), ...(request.gentle ? [] : ordered.map(e => makeItem(e.id, 'Práctica', machine))), makeItem('release', 'Vuelta a la calma')];
  if (request.gentle) {
    for (const i of items) { i.seconds = 60; i.sets = 1; }
    warnings.push('Sesión suave fuera del equipo. La duración se limita al contenido disponible.');
  }
  const routine: Routine = { id: uid(), title: request.gentle ? 'Movilidad y control' : request.targets.join(' + ') || 'Mi práctica', request: input,
    createdAt: new Date().toISOString(), machineId: machine?.id || null, level: request.level, targets: request.targets, minutesRequested: request.duration, warnings, items };
  const main = items.filter(i => i.phase === 'Práctica');
  // Fit duration using sensible ceilings instead of padding with invented movements.
  while (main.length && routineDuration(routine) < request.duration * 60 - 60 && main.some(i => i.sets < (request.intensity === 'suave' ? 2 : 4))) {
    const i = main.find(i => i.sets < (request.intensity === 'suave' ? 2 : 4)); if (i) i.sets++;
  }
  while (main.length && routineDuration(routine) > request.duration * 60 + 30 && main.some(i => i.sets > 1)) {
    const i = [...main].reverse().find(i => i.sets > 1); if (i) i.sets--;
  }
  if (recent.some(id => ordered.some(e => e.id === id))) warnings.push('Hay movimientos con esfuerzo alto registrado en las últimas 48 horas. Considera reducir la exigencia o elegir movilidad.');
  if (targeted && !request.gentle) for (const m of request.targets) if (!ordered.some(e => e.primary.includes(m))) warnings.push(`No hay un ejercicio principal compatible para ${m.toLowerCase()}; no se inventó una alternativa.`);
  if (!request.gentle && !main.length) warnings.push('No hay ejercicios de Reformer compatibles con estos filtros. Ajusta el equipo o consulta a un instructor.');
  if (Math.abs(routineDuration(routine) - request.duration * 60) > 90) warnings.push('La duración disponible difiere de lo solicitado. Puedes editar series y tiempos.');
  if (main.some(i => validateConfiguration(machine, i.configuration).length)) warnings.push('Propuesta preliminar: configura tu equipo y confirma los ajustes de cada ejercicio antes de entrenar.');
  return routine;
}
export function replaceExercise(routine: Routine, itemId: string, profile: Profile, machine?: Machine): Routine {
  const item = routine.items.find(i => i.id === itemId); if (!item || item.phase !== 'Práctica') return routine;
  const request = parseRequest('', { ...profile, level: routine.level }, routine.targets);
  const current = exerciseById(item.exerciseId);
  const alternatives = compatibleExercises(profile, request, machine).filter(e => e.id !== current.id && !routine.items.some(i => i.exerciseId === e.id));
  const e = alternatives.sort((a,b) => Number(b.primary.some(m => current.primary.includes(m))) - Number(a.primary.some(m => current.primary.includes(m))))[0];
  if (!e) throw new Error('No hay otra variante compatible. Prueba en la biblioteca o modifica los filtros.');
  return { ...routine, items: routine.items.map(i => i.id === itemId ? { ...i, exerciseId: e.id, sides: e.bilateral ? 2 : 1, configuration: structuredClone(machine?.settings[e.id] || null) } : i) };
}
export function trainingIssues(routine: Routine, machine?: Machine): string[] {
  return [...new Set(routine.items.flatMap(i => exerciseTrainingIssues(i,machine)))];
}
export function exerciseTrainingIssues(i:RoutineItem,machine?:Machine):string[] {
    const e = exerciseById(i.exerciseId);
    if (e.equipment === 'suelo') return [];
    return [...validateConfiguration(machine, i.configuration), ...e.accessories.filter(a => !machine?.accessories.includes(a)).map(a => `Falta accesorio: ${a}.`)];
}
export function assignMachine(routine:Routine,machine:Machine):Routine {
  return {...routine,machineId:machine.id,items:routine.items.map(item=>{
    if(exerciseById(item.exerciseId).equipment==='suelo')return item;
    const current=item.configuration;
    const configuration=current?.machineId===machine.id&&current.machineRevision===machine.revision?current:machine.settings[item.exerciseId]||null;
    return {...item,configuration:structuredClone(configuration)};
  })};
}
export function addExercise(routine: Routine, exerciseId: string, machine?: Machine) {
  const e = exerciseById(exerciseId);
  const item = makeItem(e.id, e.equipment === 'reformer' ? 'Práctica' : 'Preparación', machine);
  const end = routine.items.findIndex(i => i.phase === 'Vuelta a la calma');
  const items = [...routine.items]; items.splice(end < 0 ? items.length : end, 0, item);
  return { ...routine, items };
}
export function ensureKnownExercises(routine: Routine) { return routine.items.every(i => allExercises.some(e => e.id === i.exerciseId)); }
