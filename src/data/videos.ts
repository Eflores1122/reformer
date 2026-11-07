import type { Exercise } from '../domain/schema';

type Demo = Exercise['video'];
const checkedAt='2026-11-07';
const align=(start:number,end:number,title:string):Demo=>({
  status:'enlace verificado',youtubeId:'ciR7LA23ooY',start,end,title,
  attribution:'Official Align-Pilates HQ · Pilates Reformers Australia',checkedAt,
  url:`https://www.youtube.com/watch?v=ciR7LA23ooY&t=${start}s`,
  note:'Fragmento de una clase en un Align-Pilates. Los colores y cargas que menciona pertenecen a ese equipo.'
});
const tutorial=(youtubeId:string,title:string,attribution:string,start=0,end?:number):Demo=>({
  status:'enlace verificado',youtubeId,title,attribution,start,end,checkedAt,
  url:`https://www.youtube.com/watch?v=${youtubeId}${start?`&t=${start}s`:''}`,
  note:'Tutorial en otro modelo de Reformer. Revisa la técnica y conserva los ajustes propios de tu máquina.'
});
// Public videos published by their creators. Native embeds only; no media is copied.
// Chapters are taken from the publisher's public description, not invented timestamps.
export const exerciseVideos:Record<string,Demo>={
  'footwork-heels':align(107,330,'Serie de Footwork · incluye variaciones de apoyo'),
  'footwork-toes':align(107,330,'Serie de Footwork · incluye variaciones de apoyo'),
  'running':tutorial('NpJYV2iVfZA','Running','Pilates Anytime'),
  'leg-circles':tutorial('xmWbq-pcSc4','Leg circles · feet in straps','Official Align-Pilates HQ · Mbodies'),
  'leg-lowers':align(631,673,'Double leg lowers · descenso de piernas'),
  'pelvic-lift':tutorial('FLVpQ2P_9QA','Pelvic lift','Pilates Anytime'),
  'bridging':align(443,516,'Pelvic bridge · puente con carro estable'),
  'hug-tree':align(1160,1198,'Hugs · abrazo al árbol'),
  'serve-tray':align(1198,1231,'Offerings · servir la bandeja'),
  'biceps':tutorial('v9JWrH-5H9c','Bicep curls · sentado erguido','Official Align-Pilates HQ · Mbodies',9,79),
  'pulling-straps':tutorial('Zic_h-K3gSI','Pulling straps 1 y 2','Pilates Anytime')
};
