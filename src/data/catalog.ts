import type { Exercise, Machine } from '../domain/schema';
import { exerciseVideos } from './videos';

export const sources = {
  allegro: { title: 'Balanced Body · Manual Allegro, edición 2024-05', url: 'https://s3.amazonaws.com/s3.pilates.com/resources/10896_AllegroA1b_CE_CompleteManual_web_5_9_24.pdf', checked: '2026-11-10' },
  arms: { title: 'Balanced Body · Studio Reformer con torre, trabajo de brazos', url: 'https://s3.amazonaws.com/s3.pilates.com/resources/instructions/400-350_CE_StudioReformerWithTower_SPTB_English.pdf', checked: '2026-11-10' },
  safety: { title: 'Balanced Body · Reformer Usage Safety Guide', url: 'https://s3.amazonaws.com/s3.pilates.com/resources/instructions/Reformer%20Usage%20Safety%20Guide%2012-20-23pdf.pdf', checked: '2026-11-10' },
  allegro2: { title: 'Balanced Body · Allegro 2, ficha del fabricante', url: 'https://www.pilates.com/products/allegro-2-pilates-reformer', checked: '2026-11-10' },
  springs: { title: 'Balanced Body · Signature Springs, resistencia por color', url: 'https://www.pilates.com/products/pilates-reformer-signature-springs/', checked: '2026-11-10' }
};
export type SourceId = keyof typeof sources;
const base: Pick<Exercise, 'aliases' | 'bilateral' | 'review' | 'video' | 'accessories' | 'avoidTags'> = {
  aliases: [], bilateral: false, review: 'documentado', video: {status: 'sin demostración'}, accessories: [], avoidTags: []
};
const reformer = { ...base, equipment: 'reformer' as const, breath: 'Respira de forma continua, sin contener el aire.',
  cues: ['Mantén un movimiento lento y un retorno controlado.'], errors: ['Dejar que el carro golpee al regresar.'],
  easier: 'Acorta el recorrido con tu instructor.', harder: 'Mejora el control antes de aumentar la dificultad.',
  precautions: ['Aprende la entrada, la salida y los ajustes con un instructor.', 'Detente si aparece dolor agudo.']
};
export const exercises: Exercise[] = [
  { ...reformer, id: 'footwork-heels', name: 'Footwork en talones', en: 'Footwork · heels', level: 'principiante',
    primary: ['Cuádriceps', 'Glúteos'], secondary: ['Isquiotibiales', 'Core'], pattern: 'Empuje de piernas', position: 'Boca arriba',
    description: 'Extensión bilateral de piernas con apoyo de talones.', setup: 'Talones en la barra, pies paralelos y pelvis estable. Verifica barra, cabecera y resortes.',
    steps: ['Extiende las piernas sin bloquear las rodillas.', 'Regresa sin perder la alineación.'], breath: 'Exhala al extender e inhala al regresar, sin forzar.',
    precautions: [...reformer.precautions, 'Revisa molestias en tobillos, rodillas, cadera o espalda.'], avoidTags: ['rodilla', 'cadera', 'espalda'], sourceId: 'allegro', sourcePage: 35 },
  { ...reformer, id: 'footwork-toes', name: 'Footwork en metatarsos', en: 'Footwork · toes', level: 'principiante',
    primary: ['Cuádriceps', 'Pantorrillas'], secondary: ['Glúteos', 'Core'], pattern: 'Empuje de piernas', position: 'Boca arriba',
    description: 'Trabajo de piernas con apoyo en la parte anterior del pie.', setup: 'Metatarsos en la barra y talones ligeramente elevados.',
    steps: ['Aleja el carro con ambos pies.', 'Regresa manteniendo los talones estables.'], avoidTags: ['tobillo', 'rodilla', 'cadera', 'espalda'], sourceId: 'allegro', sourcePage: 35 },
  { ...reformer, id: 'running', name: 'Running alternado', en: 'Running', level: 'principiante',
    primary: ['Pantorrillas'], secondary: ['Cuádriceps', 'Core'], pattern: 'Movilidad de tobillo', position: 'Boca arriba',
    description: 'Alternancia de tobillos con apoyo en la barra. Una repetición cuenta un ciclo de ambos lados.',
    setup: 'Apoya metatarsos y extiende las piernas con control.', steps: ['Alterna el descenso de un talón y la flexión contraria.', 'Mantén quieta la pelvis.'],
    avoidTags: ['tobillo', 'rodilla', 'espalda'], sourceId: 'allegro', sourcePage: 35 },
  { ...reformer, id: 'leg-circles', name: 'Círculos de piernas', en: 'Leg circles', level: 'intermedio', accessories: ['Correas'],
    primary: ['Cadera', 'Glúteos'], secondary: ['Core', 'Isquiotibiales'], pattern: 'Circunducción de cadera', position: 'Boca arriba',
    description: 'Círculos pequeños con ambas piernas en las correas.', setup: 'Correas en los arcos de los pies; pelvis apoyada.',
    steps: ['Dibuja un círculo pequeño sin mover la pelvis.', 'Cambia de dirección a mitad de la serie.'],
    avoidTags: ['cadera', 'espalda'], sourceId: 'allegro', sourcePage: 41 },
  { ...reformer, id: 'leg-lowers', name: 'Descenso de piernas', en: 'Feet in straps · leg lowers', level: 'intermedio', accessories: ['Correas'],
    primary: ['Glúteos', 'Isquiotibiales'], secondary: ['Core', 'Cadera'], pattern: 'Extensión de cadera', position: 'Boca arriba',
    description: 'Descenso bilateral de piernas dentro de un recorrido controlable.', setup: 'Pies en correas, piernas juntas y espalda estable.',
    steps: ['Baja ambas piernas sin arquear la espalda.', 'Vuelve a la altura inicial.'], avoidTags: ['cadera', 'espalda'], sourceId: 'allegro', sourcePage: 41 },
  { ...reformer, id: 'pelvic-lift', name: 'Elevación pélvica', en: 'Pelvic lift', level: 'intermedio',
    primary: ['Glúteos', 'Isquiotibiales'], secondary: ['Core'], pattern: 'Extensión de cadera', position: 'Boca arriba',
    description: 'Elevación pélvica con desplazamiento controlado del carro.', setup: 'Cabecera plana. Pies apoyados en la barra; revisa el ajuste con tu instructor.',
    steps: ['Eleva la pelvis sin cargar el cuello.', 'Desplaza y regresa el carro; apoya la pelvis.'],
    precautions: [...reformer.precautions, 'Cabecera plana; requiere aprender primero el puente en suelo.'], avoidTags: ['cuello', 'cervical', 'espalda', 'rodilla'], sourceId: 'allegro', sourcePage: 44 },
  { ...reformer, id: 'bridging', name: 'Puente con carro estable', en: 'Bridging', level: 'principiante',
    primary: ['Glúteos', 'Isquiotibiales'], secondary: ['Core', 'Estabilidad'], pattern: 'Extensión de cadera', position: 'Boca arriba',
    description: 'Puente bilateral, manteniendo el carro estable.', setup: 'Cabecera plana y pies apoyados. Confirma cómo estabilizar el carro en tu modelo.',
    steps: ['Eleva la pelvis a un recorrido cómodo.', 'Baja de forma suave sin mover el carro.'],
    precautions: [...reformer.precautions, 'No cargues el peso sobre el cuello.'], avoidTags: ['cuello', 'cervical', 'espalda', 'rodilla'], sourceId: 'safety', sourcePage: 6, review: 'pendiente de revisión profesional' },
  { ...reformer, id: 'hug-tree', name: 'Abrazo al árbol', en: 'Hug a tree', level: 'principiante', accessories: ['Correas'],
    primary: ['Pecho'], secondary: ['Hombros', 'Core'], pattern: 'Aducción horizontal de hombro', position: 'Sentado',
    description: 'Aproximación de brazos frente al cuerpo con codos suaves.', setup: 'Siéntate hacia la barra de pies, con correas en las manos.',
    steps: ['Acerca los brazos al frente como un abrazo.', 'Abre lentamente dentro de tu recorrido cómodo.'],
    avoidTags: ['hombro', 'brazo', 'muneca', 'espalda'], sourceId: 'arms', sourcePage: 22 },
  { ...reformer, id: 'serve-tray', name: 'Servir la bandeja', en: 'Serve a tray', level: 'principiante', accessories: ['Correas'],
    primary: ['Hombros'], secondary: ['Pecho', 'Bíceps', 'Core'], pattern: 'Alcance de brazos', position: 'Sentado',
    description: 'Alcance de ambos brazos con palmas hacia arriba.', setup: 'Sentado hacia la barra, codos flexionados y correas en manos.',
    steps: ['Alcanza al frente con ambos brazos.', 'Abre sin elevar los hombros y regresa.'],
    avoidTags: ['hombro', 'brazo', 'muneca', 'espalda'], sourceId: 'arms', sourcePage: 22 },
  { ...reformer, id: 'biceps', name: 'Flexión de bíceps sentado', en: 'Seated biceps', level: 'principiante', accessories: ['Correas'],
    primary: ['Bíceps'], secondary: ['Core', 'Estabilidad'], pattern: 'Flexión de codo', position: 'Sentado',
    description: 'Flexión bilateral de codos frente a las poleas.', setup: 'Sentado hacia las correas, espalda erguida.',
    steps: ['Acerca las manos hacia los hombros.', 'Extiende los codos sin perder postura.'],
    avoidTags: ['hombro', 'brazo', 'codo', 'muneca', 'espalda'], sourceId: 'allegro', sourcePage: 45 },
  { ...reformer, id: 'triceps', name: 'Extensión de brazos sentado', en: 'Seated posterior arm press', level: 'principiante', accessories: ['Correas'],
    primary: ['Tríceps', 'Hombros'], secondary: ['Espalda', 'Core'], pattern: 'Extensión de hombro', position: 'Sentado',
    description: 'Alcance hacia atrás con brazos junto al cuerpo.', setup: 'Sentado frente a las correas, manos junto a caderas.',
    steps: ['Lleva los brazos suavemente hacia atrás.', 'Regresa sin balancear el tronco.'],
    avoidTags: ['hombro', 'brazo', 'codo', 'muneca', 'espalda'], sourceId: 'allegro', sourcePage: 45 },
  { ...reformer, id: 'pulling-straps', name: 'Tracción de correas en caja', en: 'Pulling straps', level: 'intermedio', accessories: ['Correas', 'Caja'],
    primary: ['Espalda'], secondary: ['Tríceps', 'Hombros'], pattern: 'Extensión de hombro', position: 'Boca abajo',
    description: 'Tracción de brazos sobre caja larga.', setup: 'Caja larga estable, cuerpo boca abajo y cabeza alineada.',
    steps: ['Lleva las manos hacia las caderas.', 'Regresa manteniendo el torso estable.'],
    avoidTags: ['hombro', 'brazo', 'codo', 'muneca', 'espalda'], sourceId: 'allegro', sourcePage: 42 },
  { ...reformer, id: 'hundred', name: 'Hundred con rodillas flexionadas', en: 'Hundred · bent knees', level: 'intermedio', accessories: ['Correas'],
    primary: ['Abdomen', 'Core'], secondary: ['Hombros'], pattern: 'Estabilidad del tronco', position: 'Boca arriba',
    description: 'Pulsaciones de brazos con respiración rítmica. Requiere dominar la variante de suelo.', setup: 'Rodillas flexionadas y manos en correas; posición cervical revisada.',
    steps: ['Alcanza con los brazos y mantén el tronco controlado.', 'Haz pulsos pequeños sin tensar el cuello.'],
    avoidTags: ['cuello', 'cervical', 'espalda', 'cadera', 'osteoporosis'], sourceId: 'allegro', sourcePage: 37 }
];

const floorBase = { ...base, equipment: 'suelo' as const, level: 'principiante' as const,
  secondary: [] as Exercise['secondary'], pattern: 'Preparación', position: 'Suelo o silla estable',
  description: 'Preparación suave fuera de la máquina.', setup: 'Busca una superficie estable y un recorrido cómodo.',
  breath: 'Respira con naturalidad.', cues: ['Muévete sin dolor.'], errors: ['Forzar el recorrido.'],
  easier: 'Reduce el recorrido o permanece sentado.', harder: 'Conserva la suavidad; no necesita una progresión.',
  precautions: ['Detente ante dolor, mareo o dificultad para respirar.'], sourceId: 'safety', review: 'pendiente de revisión profesional' as const
};
export const preparation: Exercise[] = [
  { ...floorBase, id: 'breath', name: 'Respiración y postura', en: 'Breath and posture', primary: ['Core'], steps: ['Siéntate con apoyo cómodo.', 'Respira con naturalidad y relaja los hombros.'] },
  { ...floorBase, id: 'shoulders', name: 'Movilidad de hombros', en: 'Shoulder preparation', primary: ['Hombros', 'Movilidad'], steps: ['Haz círculos pequeños con los hombros.', 'Añade alcances suaves al frente.'], avoidTags: ['hombro'] },
  { ...floorBase, id: 'hips', name: 'Movilidad de cadera', en: 'Hip preparation', primary: ['Cadera', 'Movilidad'], bilateral: true, steps: ['Sentado, eleva suavemente una rodilla.', 'Apoya y repite al otro lado.'], avoidTags: ['cadera'] },
  { ...floorBase, id: 'ankles', name: 'Movilidad de tobillos', en: 'Ankle preparation', primary: ['Pantorrillas', 'Movilidad'], bilateral: true, steps: ['Sentado, alterna punta y talón.', 'Repite con el otro pie sin forzar.'], avoidTags: ['tobillo'] },
  { ...floorBase, id: 'release', name: 'Vuelta a la calma', en: 'Cool down', primary: ['Movilidad'], steps: ['Regresa a una postura estable fuera del equipo.', 'Deja que la respiración recupere su ritmo.'] }
];
for(const exercise of exercises)if(exerciseVideos[exercise.id])exercise.video=exerciseVideos[exercise.id];
export const allExercises = [...exercises, ...preparation];
export function exerciseById(id: string) { const exercise = allExercises.find(e => e.id === id); if (!exercise) throw new Error(`Ejercicio desconocido: ${id}`); return exercise; }
export const manufacturers = ['IRONSIDE', 'Balanced Body', 'Merrithew / STOTT Pilates', 'Peak Pilates', 'Align-Pilates', 'BASI Systems', 'Gratz', 'Flexia', 'Elina Pilates', 'AeroPilates', 'Clásico', 'Otro'];
export const accessories = ['Correas', 'Caja', 'Aro', 'Pelota', 'Jumpboard', 'Banda'];
export function allegro2Machine(): Machine {
  return { id: crypto.randomUUID(), revision: crypto.randomUUID(), name: 'Mi Allegro 2', manufacturer: 'Balanced Body', model: 'Allegro 2 · Signature Springs',
    generation: '', type: 'Reformer',
    springs: [
      { id: 'bb-red', label: 'Rojo', color: '#b24d52', count: 3, relative: 'media', initialN: null, stiffnessNm: null },
      { id: 'bb-blue', label: 'Azul', color: '#5675a1', count: 1, relative: 'ligera', initialN: null, stiffnessNm: null },
      { id: 'bb-yellow', label: 'Amarillo', color: '#b48a25', count: 1, relative: 'muy ligera', initialN: null, stiffnessNm: null }
    ], accessories: ['Correas'], springbar: '', pulleys: '', footbar: '',
    source: sources.allegro2.url, checkedAt: '2026-11-10', inventoryConfirmed: false, validation: 'inventario documentado', settings: {},
    notes: 'Cantidades en la ficha Allegro 2: 3 rojos, 1 azul y 1 amarillo. La ficha Signature Springs nombra el rojo como media, el azul como ligera y el amarillo como muy ligera. Esas fichas no publican newtons.' };
}
export function customMachine(): Machine {
  return { ...allegro2Machine(), name: 'Mi Reformer', manufacturer: 'Otro', model: 'Personalizado', source: '', validation: 'usuario',
    springs: [{ id: crypto.randomUUID(), label: 'Resorte 1', color: '#7b818c', count: 1, relative: 'sin verificar', initialN: null, stiffnessNm: null }], accessories: [], notes: '' };
}
export function ironsideOakMachine(): Machine {
  return { ...customMachine(), name:'Mi IRONSIDE Oak', manufacturer:'IRONSIDE', model:'Reformer Madera Oak',
    springs:[], accessories:['Correas','Caja','Jumpboard'],
    source:'https://www.ironside.com.mx/products/reformer-madera-oak-ironside-pilates',
    notes:'Modelo identificado en la ficha del fabricante. Marco de roble, 227 × 67 × 38 cm. La ficha no publica cantidades ni resistencia de resortes por color; el inventario debe aportarlo el usuario.',
    validation:'usuario', inventoryConfirmed:false, settings:{} };
}
