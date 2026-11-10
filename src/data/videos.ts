import type { Exercise } from '../domain/schema';

type Demo = Exercise['video'];
const checkedAt = '2026-11-10';
const align = (start: number, end: number, title: string): Demo => ({
  status: 'enlace verificado', youtubeId: 'ciR7LA23ooY', start, end, title,
  attribution: 'Official Align-Pilates HQ · Pilates Reformers Australia', checkedAt,
  url: `https://www.youtube.com/watch?v=ciR7LA23ooY&t=${start}s`,
  note: 'Fragmento de una clase en un Align-Pilates. Los colores y cargas que menciona pertenecen a ese equipo.'
});
const tutorial = (youtubeId: string, title: string, attribution: string, start = 0, end?: number, note?: string): Demo => ({
  status: 'enlace verificado', youtubeId, title, attribution, start, end, checkedAt,
  url: `https://www.youtube.com/watch?v=${youtubeId}${start ? `&t=${start}s` : ''}`,
  note: note ?? 'Tutorial en otro modelo de Reformer. Revisa la técnica y conserva los ajustes propios de tu máquina.'
});

// Videos públicos de sus autores. Solo embed; no se copia el archivo.
// Los cortes salen de la descripción pública del autor, no de marcas inventadas.
// oEmbed comprobado el 2026-11-10 (HTTP 200) para cada id.
export const exerciseVideos: Record<string, Demo> = {
  'footwork-heels': align(107, 330, 'Serie de Footwork · incluye variaciones de apoyo'),
  'footwork-toes': align(107, 330, 'Serie de Footwork · incluye variaciones de apoyo'),
  running: tutorial('NpJYV2iVfZA', 'Running', 'Pilates Anytime'),
  'leg-circles': tutorial('xmWbq-pcSc4', 'Leg circles · feet in straps', 'Official Align-Pilates HQ · Mbodies'),
  'leg-lowers': align(631, 673, 'Double leg lowers · descenso de piernas'),
  'pelvic-lift': tutorial('FLVpQ2P_9QA', 'Pelvic lift', 'Pilates Anytime'),
  bridging: align(443, 516, 'Pelvic bridge · puente con carro estable'),
  'hug-tree': align(1160, 1198, 'Hugs · abrazo al árbol'),
  'serve-tray': align(1198, 1231, 'Offerings · servir la bandeja'),
  biceps: tutorial('v9JWrH-5H9c', 'Bicep curls · sentado erguido', 'Official Align-Pilates HQ · Mbodies', 9, 79),
  triceps: tutorial(
    'Erl0o3VseOU',
    'Seated arm work · serie de brazos sentados en Allegro',
    'Balanced Body',
    0,
    undefined,
    'Serie de brazos sentados en un Allegro, publicada por Balanced Body. El autor incluye chest expansion, círculos de hombro, press de tríceps y jalones. El press de tríceps y el alcance de brazos hacia atrás corresponden a esta ficha. No hay capítulos con marca de tiempo en la descripción, así que el video se abre desde el inicio. Las cargas que menciona no se copian a tu máquina.'
  ),
  'pulling-straps': tutorial('Zic_h-K3gSI', 'Pulling straps 1 y 2', 'Pilates Anytime'),
  hundred: tutorial(
    'akFkx5vzXgs',
    'The Hundred, con preparaciones de rodillas flexionadas',
    'Official Align-Pilates HQ · Mbodies',
    9,
    173,
    'Capítulos del autor: Prep 1 (0:09), Prep 2 (0:58) y The Hundred (1:51). La variación con piernas en rotación lateral queda fuera de este fragmento. Las cargas son las de ese Align-Pilates.'
  )
};
