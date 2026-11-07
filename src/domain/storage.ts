import Dexie, { type EntityTable } from 'dexie';
import { initialState, stateSchema, routineSchema, type AppState, type Routine } from './schema';
import { ensureKnownExercises } from './engine';
import { pauseSession } from './session';

const db = new Dexie('reformer-local') as Dexie & { snapshots: EntityTable<{ id: string; value: AppState }, 'id'> };
db.version(1).stores({ snapshots: 'id' });
// Add future versions with upgrade() here. Import schemaVersion is independently validated.
let writing: Promise<unknown> = Promise.resolve();
export async function loadState(): Promise<AppState> { const saved = await db.snapshots.get('current'); return saved ? validateState(saved.value) : structuredClone(initialState); }
export function saveState(value: AppState): Promise<unknown> {
  const snapshot = structuredClone(value);
  writing = writing.catch(() => undefined).then(() => db.snapshots.put({id: 'current', value: snapshot}));
  return writing;
}
function unique(ids: string[]) { return new Set(ids).size === ids.length; }
export function validateRoutine(value: unknown): Routine {
  const r = routineSchema.parse(value);
  if (!ensureKnownExercises(r) || !unique(r.items.map(i=>i.id))) throw new Error('El archivo contiene ejercicios desconocidos o identificadores duplicados.');
  return r;
}
export function validateState(value: unknown): AppState {
  const s = stateSchema.parse(value);
  if (!unique(s.machines.map(m=>m.id)) || !unique(s.sessions.map(x=>x.id))) throw new Error('Hay identificadores duplicados en el respaldo.');
  if (!s.machines.some(m=>m.id===s.activeMachineId)) s.activeMachineId=s.machines[0]?.id||null;
  for (const m of s.machines) if (!unique(m.springs.map(x=>x.id))) throw new Error('Inventario duplicado.');
  if (s.draft) validateRoutine(s.draft);
  for (const session of [...s.sessions, ...(s.activeSession ? [s.activeSession] : [])]) {
    validateRoutine(session.routine);
    if (session.index > session.routine.items.length || !unique(session.logs.map(l=>`${l.itemId}/${l.set}/${l.side}`))) throw new Error('Registro de sesión inválido.');
    for (const log of session.logs) {
      const item = session.routine.items.find(i=>i.id===log.itemId);
      if (!item || item.exerciseId!==log.exerciseId || log.set>item.sets || log.side>item.sides) throw new Error('Serie sin relación válida.');
    }
  }
  return s;
}
export function parseImport(raw: string): {type: 'respaldo'; state: AppState} | {type: 'rutina'; routine: Routine} {
  if (raw.length > 20_000_000) throw new Error('El archivo supera 20 MB.');
  const value = JSON.parse(raw);
  if (value?.format === 'reformer-routine' && value.version === 1) return {type:'rutina', routine:validateRoutine(value.routine)};
  if (value?.format !== 'reformer-backup' || value.version !== 1) throw new Error('No es un archivo REFORMER compatible.');
  const state = validateState(value.state);
  if (state.activeSession) state.activeSession = pauseSession(state.activeSession);
  return {type:'respaldo',state};
}
export const backupJSON = (state: AppState) => JSON.stringify({format:'reformer-backup',version:1,exportedAt:new Date().toISOString(),state},null,2);
export const routineJSON = (routine: Routine) => JSON.stringify({format:'reformer-routine',version:1,routine},null,2);
export function download(content: string, filename: string, type='application/json') {
  const url = URL.createObjectURL(new Blob([content],{type})); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function historyCSV(state: AppState) {
  const escape = (v: unknown) => { const value=String(v??''); return `"${/^[=+@\-\t\r]/.test(value) ? "'" : ''}${value.replaceAll('"','""')}"`; };
  return '\uFEFF'+[['sesion','fecha','estado','maquina','ejercicio','serie','lado','repeticiones_previstas','repeticiones_reales','segundos_previstos','segundos_reales','descanso_real','esfuerzo','tecnica','resortes','notas'],
    ...state.sessions.flatMap(s=>s.logs.map(l=>[s.id,l.completedAt,s.status,s.machineId,l.exerciseId,l.set,l.side,l.repsPlanned,l.repsActual,l.secondsPlanned,l.secondsActual.toFixed(1),l.restActual.toFixed(1),l.rpe,l.technique,JSON.stringify(l.configuration?.springs||{}),l.notes]))].map(row=>row.map(escape).join(',')).join('\r\n');
}
