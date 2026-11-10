import { z } from 'zod';

export const levelSchema = z.enum(['principiante', 'intermedio', 'avanzado']);
export type Level = z.infer<typeof levelSchema>;
export const muscles = ['Pecho', 'Glúteos', 'Cuádriceps', 'Isquiotibiales', 'Pantorrillas', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 'Abdomen', 'Core', 'Cadera', 'Cuerpo completo', 'Estabilidad', 'Movilidad', 'Flexibilidad'] as const;
export const muscleSchema = z.enum(muscles);
export type Muscle = z.infer<typeof muscleSchema>;
const id = z.string().min(1).max(160);
const timestamp = z.iso.datetime({offset:true});
const text = z.string().max(3000);
export const springSchema = z.object({
  id, label: z.string().min(1).max(80), color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  count: z.number().int().min(0).max(10), relative: z.enum(['muy ligera', 'ligera', 'media', 'fuerte', 'sin verificar']),
  initialN: z.number().nonnegative().max(10000).nullable().default(null),
  stiffnessNm: z.number().nonnegative().max(100000).nullable().default(null)
});
export const configurationSchema = z.object({
  machineId: id, machineRevision: z.string().default(''), springs: z.record(z.string(), z.number().int().min(0).max(10)),
  footbar: text, headrest: text, anchor: text, notes: text,
  confirmed: z.boolean(), provenance: z.enum(['usuario', 'fabricante']).default('usuario')
});
export type Configuration = z.infer<typeof configurationSchema>;
export const machineSchema = z.object({
  id, revision: z.string().min(1), name: z.string().min(1).max(80), manufacturer: z.string().min(1).max(80), model: z.string().min(1).max(120),
  generation: text, type: text, springs: z.array(springSchema).max(12), accessories: z.array(z.string().max(80)).max(20),
  springbar: text, pulleys: text, footbar: text, notes: text, source: text,
  checkedAt: z.iso.date(), inventoryConfirmed: z.boolean(), validation: z.enum(['inventario documentado', 'usuario']),
  settings: z.record(z.string(), configurationSchema)
});
export type Machine = z.infer<typeof machineSchema>;
export type Spring = z.infer<typeof springSchema>;
export const profileSchema = z.object({
  alias: z.string().max(80), level: levelSchema, goal: text, secondaryGoals: z.array(z.string().max(80)).max(15),
  days: z.number().int().min(1).max(7), duration: z.number().int().min(10).max(60),
  priorities: z.array(muscleSchema).max(16), avoid: z.array(muscleSchema).max(16),
  restrictions: text, guidance: z.enum(['texto', 'voz']), intensity: z.enum(['suave', 'moderada', 'intensa']),
  theme: z.enum(['claro', 'oscuro']), locale: z.enum(['es', 'en']), voice: z.boolean()
});
export type Profile = z.infer<typeof profileSchema>;
export const defaultProfile: Profile = {
  alias: '', level: 'principiante', goal: 'Fortalecimiento general', secondaryGoals: [], days: 3, duration: 25,
  priorities: [], avoid: [], restrictions: '', guidance: 'texto', intensity: 'moderada', theme: 'claro', locale: 'es', voice: false
};
export const itemSchema = z.object({
  id, exerciseId: id, phase: z.enum(['Preparación', 'Práctica', 'Vuelta a la calma']),
  sets: z.number().int().min(1).max(6), reps: z.number().int().min(0).max(50),
  seconds: z.number().int().min(10).max(180), rest: z.number().int().min(0).max(180),
  transition: z.number().int().min(0).max(180), sides: z.number().int().min(1).max(2),
  configuration: configurationSchema.nullable(), notes: text
});
export type RoutineItem = z.infer<typeof itemSchema>;
export const routineSchema = z.object({
  id, title: z.string().min(1).max(160), request: text, createdAt: timestamp,
  machineId: id.nullable(), level: levelSchema, targets: z.array(muscleSchema).max(16),
  minutesRequested: z.number().min(10).max(60), warnings: z.array(text).max(30), items: z.array(itemSchema).max(100)
});
export type Routine = z.infer<typeof routineSchema>;
export const setLogSchema = z.object({
  id, itemId: id, exerciseId: id, set: z.number().int().min(1).max(6), side: z.number().int().min(1).max(2),
  completedAt: timestamp, repsPlanned: z.number().int().nonnegative(), repsActual: z.number().int().min(0).max(100),
  secondsPlanned: z.number().nonnegative(), secondsActual: z.number().nonnegative(), restActual: z.number().nonnegative(),
  rpe: z.number().int().min(1).max(10), technique: z.enum(['controlada', 'difícil', 'molestia']), notes: text,
  configuration: configurationSchema.nullable()
});
export type SetLog = z.infer<typeof setLogSchema>;
export const sessionSchema = z.object({
  id, routine: routineSchema, machineId: id.nullable(), machineSnapshot: machineSchema.nullable().default(null), startedAt: timestamp, finishedAt: timestamp.nullable(),
  status: z.enum(['activa', 'incompleta', 'completa']), index: z.number().int().nonnegative(),
  set: z.number().int().min(1).max(6), side: z.number().int().min(1).max(2), phase: z.enum(['ejercicio', 'descanso', 'transición']),
  running: z.boolean(), elapsed: z.number().nonnegative(), startedTick: z.number().nullable(),
  segmentElapsed: z.number().nonnegative(), segmentTick: z.number().nullable(),
  logs: z.array(setLogSchema).max(1000), skipped: z.array(id).max(100), notes: text
});
export type Session = z.infer<typeof sessionSchema>;
export const stateSchema = z.object({
  schemaVersion: z.literal(1), profile: profileSchema, machines: z.array(machineSchema).max(100),
  activeMachineId: id.nullable(), draft: routineSchema.nullable(),
  sessions: z.array(sessionSchema).max(10000), activeSession: sessionSchema.nullable(),
  favorites: z.array(id).max(1000)
});
export type AppState = z.infer<typeof stateSchema>;
export const initialState: AppState = { schemaVersion: 1, profile: defaultProfile, machines: [], activeMachineId: null, draft: null, sessions: [], activeSession: null, favorites: [] };
export type Exercise = {
  id: string; name: string; en: string; aliases: string[]; level: Level;
  primary: Muscle[]; secondary: Muscle[]; pattern: string; position: string;
  equipment: 'suelo' | 'reformer'; drive?: 'carro' | 'correas'; accessories: string[]; bilateral: boolean;
  description: string; setup: string; steps: string[]; breath: string;
  cues: string[]; errors: string[]; easier: string; harder: string;
  precautions: string[]; avoidTags: string[]; sourceId: string; sourcePage?: number;
  review: 'documentado' | 'pendiente de revisión profesional';
  video: { status: 'sin demostración' | 'enlace verificado'; url?: string; attribution?: string; youtubeId?: string; start?: number; end?: number; title?: string; checkedAt?: string; note?: string };
};
