import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Play, WifiOff } from 'lucide-react';
import type { Exercise } from '../domain/schema';
import { exerciseVideos } from '../data/videos';

export function ExerciseVideo({exercise,compact=false}: {exercise:Exercise;compact?:boolean}) {
  const video=exerciseVideos[exercise.id]||exercise.video;
  const [loaded,setLoaded]=useState(false);const [failed,setFailed]=useState(false);const [online,setOnline]=useState(navigator.onLine);const frame=useRef<HTMLIFrameElement>(null);
  useEffect(()=>{const on=()=>setOnline(navigator.onLine);window.addEventListener('online',on);window.addEventListener('offline',on);return()=>{window.removeEventListener('online',on);window.removeEventListener('offline',on);};},[]);
  useEffect(()=>{setLoaded(false);setFailed(false);},[exercise.id]);
  useEffect(()=>{
    if(!loaded)return;
    const onMessage=(event:MessageEvent)=>{
      if(event.source!==frame.current?.contentWindow||!['https://www.youtube-nocookie.com','https://www.youtube.com'].includes(event.origin))return;
      let data;try{data=typeof event.data==='string'?JSON.parse(event.data):event.data;}catch{return;}
      if(data?.event==='onError')setFailed(true);
    };
    window.addEventListener('message',onMessage);return()=>window.removeEventListener('message',onMessage);
  },[loaded]);
  if(!video.youtubeId||video.status!=='enlace verificado')return <div className="video-missing"><strong>Demostración de este movimiento</strong><p>Tutorial específico pendiente. Las instrucciones siguen disponibles; puedes consultar los videos de los demás movimientos en tu rutina.</p></div>;
  const params=new URLSearchParams({rel:'0',playsinline:'1',enablejsapi:'1',origin:location.origin,start:String(video.start||0),...(video.end?{end:String(video.end)}:{})});
  return <section className={`exercise-video ${compact?'video-compact':''}`} aria-label={`Video de ${exercise.name}`}>
    {loaded&&online&&!failed?<div className="video-frame"><iframe ref={frame} title={`Demostración: ${exercise.name}`} src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?${params}`} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen onError={()=>setFailed(true)} onLoad={()=>frame.current?.contentWindow?.postMessage(JSON.stringify({event:'listening',id:exercise.id,channel:'reformer'}),'https://www.youtube-nocookie.com')}/></div>:<div className="video-cover"><div className="video-mark"><Play size={24}/></div><div><strong>{video.title}</strong><p>{video.attribution}</p></div><button className="primary" disabled={!online} onClick={()=>{setFailed(false);setLoaded(true);}}>{online?<><Play size={17}/>{failed?'Volver a intentar':'Ver demostración'}</>:<><WifiOff size={17}/>Video sin conexión</>}</button></div>}
    <div className="video-caption"><span>{video.attribution} · Audio en inglés</span>{video.url&&<a href={video.url} target="_blank" rel="noreferrer">Abrir en YouTube<ExternalLink size={13}/></a>}</div>
    {failed&&<p className="note" role="status">El reproductor no pudo abrir este video. Puedes verlo con el enlace de YouTube o seguir las instrucciones escritas.</p>}
    {!online&&<p className="note">Los videos necesitan internet. Tu rutina, instrucciones y temporizador siguen disponibles sin conexión.</p>}
    <p className="video-context">{video.note} La configuración de tu equipo se muestra por separado.</p>
    {!loaded&&online&&<small className="video-consent">Al reproducir o abrir el video te conectas con YouTube. Los controles del reproductor incluyen pausa, pantalla completa y velocidad; los subtítulos dependen del video.</small>}
  </section>;
}
