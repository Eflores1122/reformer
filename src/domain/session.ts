import { exerciseById } from '../data/catalog';
import type { Machine, Routine, Session, SetLog } from './schema';

export const clockSeconds = (elapsed: number, tick: number | null, now = Date.now()) => elapsed + (tick === null ? 0 : Math.max(0, now - tick) / 1000);
export function createSession(routine: Routine, machine?:Machine): Session {
  return { id: crypto.randomUUID(), routine: structuredClone(routine), machineId: routine.machineId, machineSnapshot:machine?structuredClone(machine):null, startedAt: new Date().toISOString(), finishedAt: null,
    status: 'activa', index: 0, set: 1, side: 1, phase: 'ejercicio', running: false, elapsed: 0, startedTick: null,
    segmentElapsed: 0, segmentTick: null, logs: [], skipped: [], notes: '' };
}
export function pauseSession(s: Session, now = Date.now()): Session {
  return { ...s, running: false, elapsed: clockSeconds(s.elapsed, s.startedTick, now), startedTick: null,
    segmentElapsed: clockSeconds(s.segmentElapsed, s.segmentTick, now), segmentTick: null };
}
export function runSession(s: Session, now = Date.now()): Session {
  if (s.running) return s;
  return { ...s, status: 'activa', running: true, startedTick: now, segmentTick: now };
}
function nextSegment(s: Session, phase: Session['phase'], now: number): Session {
  return { ...s, phase, segmentElapsed: 0, segmentTick: s.running ? now : null };
}
export function finishSession(s: Session): Session {
  const paused = pauseSession(s);
  const planned = s.routine.items.reduce((sum,i) => sum+i.sets*i.sides,0);
  return { ...paused, status: s.logs.length === planned && !s.skipped.length ? 'completa' : 'incompleta', finishedAt: new Date().toISOString() };
}
export function completeSet(s: Session, values: Pick<SetLog, 'repsActual' | 'rpe' | 'technique' | 'notes'>, now = Date.now()): Session {
  const item = s.routine.items[s.index];
  if (!item || s.phase !== 'ejercicio' || !s.running) return s;
  // Exactly once for the planned item/set/side, even on a rapid double click.
  if (s.logs.some(l => l.itemId === item.id && l.set === s.set && l.side === s.side)) return s;
  const log: SetLog = { id: crypto.randomUUID(), itemId: item.id, exerciseId: item.exerciseId, set: s.set, side: s.side,
    completedAt: new Date(now).toISOString(), repsPlanned: item.reps, secondsPlanned: item.seconds,
    secondsActual: clockSeconds(s.segmentElapsed, s.segmentTick, now), restActual: s.phase === 'ejercicio' ? 0 : clockSeconds(s.segmentElapsed,s.segmentTick,now),
    configuration: structuredClone(item.configuration), ...values };
  const updated = { ...s, logs: [...s.logs, log] };
  if (s.set < item.sets || s.side < item.sides) return nextSegment(updated, item.rest ? 'descanso' : 'transición', now);
  if (s.index === s.routine.items.length - 1) return finishSession(updated);
  return nextSegment(updated, 'transición', now);
}
export function advanceSegment(s: Session, now = Date.now()): Session {
  const item = s.routine.items[s.index]; if (!item || s.phase === 'ejercicio' || !s.running) return s;
  let updated = { ...s };
  if (s.phase === 'descanso') {
    const logs = [...s.logs]; const last = logs[logs.length-1];
    if (last) logs[logs.length-1] = { ...last, restActual: clockSeconds(s.segmentElapsed, s.segmentTick, now) };
    updated = { ...updated, logs };
  }
  if (s.set < item.sets) updated.set++;
  else if (s.side < item.sides) { updated.side++; updated.set=1; }
  else { updated.index++; updated.set=1; updated.side=1; }
  return nextSegment(updated,'ejercicio',now);
}
export function skipExercise(s: Session, now = Date.now()): Session {
  const item = s.routine.items[s.index]; if (!item) return s;
  const updated = { ...s, skipped: [...new Set([...s.skipped,item.id])], index: s.index + 1, set: 1, side: 1 };
  if (updated.index >= s.routine.items.length) return finishSession(updated);
  return nextSegment(updated,'ejercicio',now);
}
export function completedExercises(s: Session): number {
  return s.routine.items.filter(i => !s.skipped.includes(i.id) && s.logs.filter(l=>l.itemId===i.id).length === i.sets*i.sides).length;
}
export function progression(history: Session[]): string {
  const logs = history.flatMap(s => s.logs.map(l => ({ ...l, machineId: s.machineId, sessionId: s.id })));
  if (logs.some(l => l.technique === 'molestia') || history.some(s=>s.notes.includes('Molestia registrada'))) return 'Registraste molestias. Revisa el movimiento con un profesional antes de progresar.';
  for (const last of [...logs].reverse()) {
    const comparable = logs.filter(l => l.machineId === last.machineId && l.exerciseId === last.exerciseId && JSON.stringify(l.configuration) === JSON.stringify(last.configuration));
    if (new Set(comparable.map(l=>l.sessionId)).size >= 2 && comparable.slice(-4).every(l=>l.rpe<=5&&l.technique==='controlada'&&l.repsActual>=l.repsPlanned)) {
      return `${exerciseById(last.exerciseId).name}: registraste buen control y bajo esfuerzo en sesiones comparables. Puedes revisar una repetición adicional con tu instructor. Los resortes no cambian automáticamente.`;
    }
  }
  return logs.length ? 'Sigue registrando esfuerzo y control. La progresión se compara dentro de una misma máquina y configuración.' : 'Tu progreso comienza con la primera serie registrada.';
}
