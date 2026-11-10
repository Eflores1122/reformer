import type { CSSProperties } from 'react';
import { exerciseById } from '../data/catalog';

type Pt = [number, number];
type Pose = {
  carriage: number;
  box?: boolean;
  floor?: boolean;
  straps?: [Pt, Pt][];
  head: Pt;
  shoulder: Pt;
  hip: Pt;
  knee: Pt;
  foot: Pt;
  elbow: Pt;
  hand: Pt;
  kneeB?: Pt;
  footB?: Pt;
  elbowB?: Pt;
  handB?: Pt;
};

const shift = (p: Pt, x = 14, y = 8): Pt => [p[0] + x, p[1] + y];

const poses: Record<string, { start: Pose; end: Pose }> = {
  'footwork-heels': {
    start: { carriage: 176, head: [348, 156], shoulder: [330, 176], hip: [262, 186], knee: [196, 124], foot: [86, 146], elbow: [300, 190], hand: [258, 198] },
    end: { carriage: 292, head: [464, 156], shoulder: [446, 176], hip: [372, 186], knee: [230, 170], foot: [86, 168], elbow: [416, 190], hand: [368, 198] }
  },
  'footwork-toes': {
    start: { carriage: 168, head: [340, 156], shoulder: [322, 176], hip: [254, 186], knee: [188, 116], foot: [84, 118], elbow: [292, 190], hand: [250, 198] },
    end: { carriage: 286, head: [458, 156], shoulder: [440, 176], hip: [366, 186], knee: [214, 148], foot: [84, 122], elbow: [410, 190], hand: [362, 198] }
  },
  running: {
    start: { carriage: 248, head: [420, 156], shoulder: [402, 176], hip: [334, 186], knee: [214, 172], foot: [88, 168], kneeB: [176, 112], footB: [88, 132], elbow: [372, 190], hand: [330, 198] },
    end: { carriage: 248, head: [420, 156], shoulder: [402, 176], hip: [334, 186], knee: [176, 112], foot: [88, 132], kneeB: [214, 172], footB: [88, 168], elbow: [372, 190], hand: [330, 198] }
  },
  'leg-circles': {
    start: { carriage: 210, head: [392, 156], shoulder: [374, 176], hip: [304, 186], knee: [300, 112], foot: [298, 62], elbow: [344, 190], hand: [304, 198], straps: [[[298, 62], [150, 48]], [[312, 70], [168, 48]]] },
    end: { carriage: 210, head: [392, 156], shoulder: [374, 176], hip: [304, 186], knee: [250, 108], foot: [206, 78], kneeB: [286, 128], footB: [246, 108], elbow: [344, 190], hand: [304, 198], straps: [[[206, 78], [140, 52]], [[246, 108], [160, 58]]] }
  },
  'leg-lowers': {
    start: { carriage: 206, head: [388, 156], shoulder: [370, 176], hip: [300, 186], knee: [296, 114], foot: [294, 64], elbow: [340, 190], hand: [300, 198], straps: [[[294, 64], [148, 48]], [[308, 72], [166, 48]]] },
    end: { carriage: 236, head: [418, 156], shoulder: [400, 176], hip: [328, 186], knee: [250, 150], foot: [176, 132], kneeB: [268, 162], footB: [190, 146], elbow: [370, 190], hand: [328, 198], straps: [[[176, 132], [120, 96]], [[190, 146], [132, 108]]] }
  },
  'pelvic-lift': {
    start: { carriage: 188, head: [360, 160], shoulder: [342, 180], hip: [276, 190], knee: [198, 136], foot: [88, 156], elbow: [314, 194], hand: [274, 202] },
    end: { carriage: 214, head: [392, 148], shoulder: [368, 162], hip: [292, 118], knee: [206, 132], foot: [88, 158], elbow: [340, 168], hand: [300, 176] }
  },
  bridging: {
    start: { carriage: 196, head: [368, 160], shoulder: [350, 180], hip: [284, 190], knee: [204, 138], foot: [88, 156], elbow: [322, 194], hand: [282, 202] },
    end: { carriage: 196, head: [376, 146], shoulder: [354, 158], hip: [286, 116], knee: [204, 134], foot: [88, 156], elbow: [326, 164], hand: [286, 172] }
  },
  'hug-tree': {
    start: { carriage: 214, head: [392, 78], shoulder: [386, 112], hip: [372, 184], knee: [286, 184], foot: [196, 190], elbow: [430, 128], hand: [478, 154], elbowB: [348, 124], handB: [300, 100], straps: [[[478, 154], [120, 88]], [[300, 100], [108, 78]]] },
    end: { carriage: 214, head: [392, 78], shoulder: [386, 112], hip: [372, 184], knee: [286, 184], foot: [196, 190], elbow: [360, 128], hand: [286, 118], elbowB: [372, 142], handB: [298, 136], straps: [[[286, 118], [120, 96]], [[298, 136], [128, 112]]] }
  },
  'serve-tray': {
    start: { carriage: 214, head: [392, 78], shoulder: [386, 114], hip: [372, 184], knee: [286, 184], foot: [196, 190], elbow: [360, 148], hand: [412, 122], elbowB: [372, 160], handB: [424, 142], straps: [[[412, 122], [150, 78]], [[424, 142], [160, 92]]] },
    end: { carriage: 214, head: [392, 78], shoulder: [386, 114], hip: [372, 184], knee: [286, 184], foot: [196, 190], elbow: [340, 132], hand: [236, 116], elbowB: [352, 148], handB: [248, 134], straps: [[[236, 116], [120, 92]], [[248, 134], [132, 108]]] }
  },
  biceps: {
    start: { carriage: 214, head: [396, 76], shoulder: [390, 112], hip: [376, 184], knee: [290, 184], foot: [198, 190], elbow: [352, 156], hand: [268, 164], elbowB: [366, 168], handB: [280, 178], straps: [[[268, 164], [118, 140]], [[280, 178], [128, 154]]] },
    end: { carriage: 214, head: [396, 76], shoulder: [390, 112], hip: [376, 184], knee: [290, 184], foot: [198, 190], elbow: [360, 146], hand: [404, 112], elbowB: [374, 158], handB: [418, 128], straps: [[[404, 112], [150, 78]], [[418, 128], [162, 94]]] }
  },
  triceps: {
    start: { carriage: 220, head: [400, 76], shoulder: [394, 114], hip: [380, 184], knee: [294, 184], foot: [202, 190], elbow: [360, 148], hand: [300, 168], elbowB: [372, 162], handB: [312, 182], straps: [[[300, 168], [130, 140]], [[312, 182], [142, 156]]] },
    end: { carriage: 220, head: [400, 76], shoulder: [394, 114], hip: [380, 184], knee: [294, 184], foot: [202, 190], elbow: [420, 150], hand: [468, 172], elbowB: [428, 164], handB: [476, 186], straps: [[[468, 172], [150, 148]], [[476, 186], [158, 162]]] }
  },
  'pulling-straps': {
    start: { carriage: 168, box: true, head: [236, 132], shoulder: [268, 146], hip: [360, 152], knee: [430, 152], foot: [492, 146], elbow: [214, 124], hand: [156, 104], elbowB: [228, 138], handB: [168, 122], straps: [[[156, 104], [96, 78]], [[168, 122], [104, 96]]] },
    end: { carriage: 168, box: true, head: [248, 118], shoulder: [286, 132], hip: [366, 150], knee: [434, 152], foot: [494, 146], elbow: [318, 124], hand: [372, 146], elbowB: [330, 140], handB: [384, 158], straps: [[[372, 146], [120, 110]], [[384, 158], [132, 124]]] }
  },
  hundred: {
    start: { carriage: 198, head: [386, 164], shoulder: [366, 180], hip: [292, 188], knee: [286, 118], foot: [236, 108], elbow: [334, 196], hand: [286, 206], straps: [[[286, 206], [470, 86]], [[274, 198], [456, 78]]] },
    end: { carriage: 198, head: [360, 124], shoulder: [348, 150], hip: [292, 188], knee: [286, 118], foot: [236, 108], elbow: [318, 172], hand: [262, 186], straps: [[[262, 186], [450, 96]], [[250, 178], [438, 88]]] }
  },
  breath: {
    start: { carriage: 0, floor: true, head: [286, 78], shoulder: [280, 112], hip: [268, 196], knee: [196, 196], foot: [128, 204], elbow: [250, 150], hand: [214, 176], elbowB: [310, 150], handB: [344, 176] },
    end: { carriage: 0, floor: true, head: [286, 70], shoulder: [280, 106], hip: [268, 196], knee: [196, 196], foot: [128, 204], elbow: [236, 128], hand: [196, 108], elbowB: [324, 128], handB: [364, 108] }
  },
  shoulders: {
    start: { carriage: 0, floor: true, head: [286, 78], shoulder: [280, 114], hip: [268, 196], knee: [196, 196], foot: [128, 204], elbow: [248, 146], hand: [214, 168], elbowB: [314, 146], handB: [350, 168] },
    end: { carriage: 0, floor: true, head: [286, 78], shoulder: [280, 114], hip: [268, 196], knee: [196, 196], foot: [128, 204], elbow: [236, 86], hand: [200, 64], elbowB: [330, 92], handB: [378, 78] }
  },
  hips: {
    start: { carriage: 0, floor: true, head: [300, 78], shoulder: [294, 114], hip: [280, 196], knee: [200, 196], foot: [132, 204], kneeB: [250, 150], footB: [214, 132], elbow: [262, 150], hand: [230, 176], elbowB: [326, 150], handB: [358, 176] },
    end: { carriage: 0, floor: true, head: [300, 78], shoulder: [294, 114], hip: [280, 196], knee: [250, 150], foot: [214, 132], kneeB: [200, 196], footB: [132, 204], elbow: [262, 150], hand: [230, 176], elbowB: [326, 150], handB: [358, 176] }
  },
  ankles: {
    start: { carriage: 0, floor: true, head: [250, 86], shoulder: [246, 120], hip: [236, 196], knee: [168, 196], foot: [112, 214], elbow: [220, 156], hand: [188, 180], elbowB: [274, 156], handB: [306, 180] },
    end: { carriage: 0, floor: true, head: [250, 86], shoulder: [246, 120], hip: [236, 196], knee: [168, 196], foot: [118, 176], elbow: [220, 156], hand: [188, 180], elbowB: [274, 156], handB: [306, 180] }
  },
  release: {
    start: { carriage: 0, floor: true, head: [392, 150], shoulder: [370, 168], hip: [292, 186], knee: [220, 176], foot: [150, 186], elbow: [340, 186], hand: [300, 196], elbowB: [352, 194], handB: [312, 204] },
    end: { carriage: 0, floor: true, head: [300, 92], shoulder: [294, 126], hip: [280, 200], knee: [206, 200], foot: [140, 208], elbow: [262, 164], hand: [228, 188], elbowB: [326, 164], handB: [360, 188] }
  }
};

function line(a: Pt, b: Pt) {
  return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />;
}

function Reformer({ pose }: { pose: Pose }) {
  const x = pose.carriage;
  const springs = [0, 1, 2].map(i => {
    const y = 206 + i * 7;
    const mid = (92 + x) / 2;
    return <path key={i} d={`M92 ${y} Q ${mid} ${y + 10} ${x + 6} ${198 + i * 2}`} strokeWidth="1.5" opacity={0.55 - i * 0.12} />;
  });
  return <g fill="none" stroke="currentColor" strokeLinejoin="round">
    <path d="M40 252h480" strokeWidth="1.5" opacity=".28" />
    <path d="M96 236v16M464 236v16" strokeWidth="3" strokeLinecap="round" />
    <path d="M68 236h424" strokeWidth="8" strokeLinecap="round" />
    <path d="M68 216h424" strokeWidth="1.4" opacity=".35" />
    <path d="M82 216V128" strokeWidth="5" strokeLinecap="round" />
    <path d="M66 128h32" strokeWidth="6" strokeLinecap="round" />
    {springs}
    <g transform={`translate(${x} 0)`}>
      <rect x="0" y="184" width="206" height="32" rx="3" fill="currentColor" fillOpacity=".1" strokeWidth="2" />
      <path d="M148 184v-30h16v30M170 184v-30h18v30" strokeWidth="2.4" />
      <path d="M136 176h64" strokeWidth="3.5" strokeLinecap="round" opacity=".65" />
      {pose.box && <rect x="16" y="150" width="164" height="34" rx="2" fill="currentColor" fillOpacity=".08" strokeWidth="2" />}
    </g>
  </g>;
}

function Mat() {
  return <g fill="none" stroke="currentColor" strokeLinecap="round">
    <path d="M78 236h404" strokeWidth="8" opacity=".35" />
    <path d="M96 220h368" strokeWidth="1.4" opacity=".35" />
  </g>;
}

function Body({ pose }: { pose: Pose }) {
  const kneeB = pose.kneeB ?? shift(pose.knee);
  const footB = pose.footB ?? shift(pose.foot);
  return <g className="figure-person" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <g strokeWidth="8" opacity=".38">
      {line(pose.hip, kneeB)}
      {line(kneeB, footB)}
      {pose.elbowB && pose.handB && <>{line(pose.shoulder, pose.elbowB)}{line(pose.elbowB, pose.handB)}</>}
    </g>
    <g strokeWidth="8">
      {line(pose.head, pose.shoulder)}
      {line(pose.shoulder, pose.hip)}
      {line(pose.hip, pose.knee)}
      {line(pose.knee, pose.foot)}
      {line(pose.shoulder, pose.elbow)}
      {line(pose.elbow, pose.hand)}
    </g>
    <circle cx={pose.head[0]} cy={pose.head[1]} r="12" fill="currentColor" stroke="none" />
  </g>;
}

function Straps({ pose }: { pose: Pose }) {
  if (!pose.straps?.length) return null;
  return <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".7">
    {pose.straps.map(([a, b], i) => <g key={i}>{line(a, b)}<circle cx={b[0]} cy={b[1]} r="3" fill="currentColor" stroke="none" /></g>)}
  </g>;
}

export function ExerciseFigure({ id, phase = 'start', decorative = false, className = '', style }: { id: string; phase?: 'start' | 'end'; decorative?: boolean; className?: string; style?: CSSProperties }) {
  const pair = poses[id] ?? poses.breath;
  const pose = pair[phase];
  let label = 'Dibujo original, orientativo';
  try {
    const exercise = exerciseById(id);
    label = `${phase === 'start' ? 'Inicio' : 'Final'} de ${exercise.name}. Dibujo original, orientativo.`;
  } catch { /* preparación fuera del catálogo de ids conocidos */ }
  return <svg className={`exercise-figure ${className}`.trim()} style={style} viewBox="40 52 496 214" role={decorative ? undefined : 'img'} aria-hidden={decorative ? true : undefined} aria-label={decorative ? undefined : label}>
    {pose.floor ? <Mat /> : <Reformer pose={pose} />}
    <Straps pose={pose} />
    <Body pose={pose} />
  </svg>;
}

export function PosePair({ id }: { id: string }) {
  return <div className="pose-pair">
    <figure><ExerciseFigure id={id} phase="start" /><figcaption>Inicio</figcaption></figure>
    <figure><ExerciseFigure id={id} phase="end" /><figcaption>Final</figcaption></figure>
  </div>;
}
