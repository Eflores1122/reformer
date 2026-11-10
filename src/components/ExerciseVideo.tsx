import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Play, WifiOff } from 'lucide-react';
import type { Exercise } from '../domain/schema';
import { exerciseVideos } from '../data/videos';
import { ExerciseFigure } from './ExerciseFigure';

export function ExerciseVideo({ exercise, compact = false }: { exercise: Exercise; compact?: boolean }) {
  const video = exerciseVideos[exercise.id] || exercise.video;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [seen, setSeen] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const poster = useRef<HTMLDivElement>(null);
  useEffect(() => { const on = () => setOnline(navigator.onLine); window.addEventListener('online', on); window.addEventListener('offline', on); return () => { window.removeEventListener('online', on); window.removeEventListener('offline', on); }; }, []);
  useEffect(() => { setLoaded(false); setFailed(false); }, [exercise.id]);
  useEffect(() => {
    const el = poster.current;
    if (!el || seen) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setSeen(true); observer.disconnect(); } }, { rootMargin: '160px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [seen, exercise.id]);
  useEffect(() => {
    if (!loaded) return;
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || !['https://www.youtube-nocookie.com', 'https://www.youtube.com'].includes(event.origin)) return;
      let data; try { data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data; } catch { return; }
      if (data?.event === 'onError') setFailed(true);
    };
    window.addEventListener('message', onMessage); return () => window.removeEventListener('message', onMessage);
  }, [loaded]);
  if (!video.youtubeId || video.status !== 'enlace verificado') return <div className="video-missing"><strong>Demostración de este movimiento</strong><p>Tutorial específico pendiente. Las instrucciones siguen disponibles; puedes consultar los videos de los demás movimientos en tu rutina.</p></div>;
  const params = new URLSearchParams({ rel: '0', playsinline: '1', enablejsapi: '1', origin: location.origin, start: String(video.start || 0), ...(video.end ? { end: String(video.end) } : {}) });
  const thumb = (file: string, ext: string) => `https://i.ytimg.com/vi${ext === 'webp' ? '_webp' : ''}/${video.youtubeId}/${file}.${ext}`;
  const open = () => { setFailed(false); setLoaded(true); };
  return <section className={`exercise-video ${compact ? 'video-compact' : ''}`} aria-label={`Video de ${exercise.name}`}>
    {loaded && online && !failed ? <div className="video-frame"><iframe ref={frame} title={`Demostración: ${exercise.name}`} src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?${params}`} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen onError={() => setFailed(true)} onLoad={() => frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: exercise.id, channel: 'reformer' }), 'https://www.youtube-nocookie.com')} /></div> : <div className="video-cover">
      <div className="video-poster" ref={poster}>
        <ExerciseFigure id={exercise.id} phase="start" decorative />
        {seen && online && <picture>
          <source type="image/webp" srcSet={`${thumb('mqdefault', 'webp')} 320w, ${thumb('hqdefault', 'webp')} 480w`} sizes="(max-width: 760px) 100vw, 680px" />
          <img className="video-thumb" alt="" width="480" height="360" loading="lazy" decoding="async" src={thumb('hqdefault', 'jpg')} srcSet={`${thumb('mqdefault', 'jpg')} 320w, ${thumb('hqdefault', 'jpg')} 480w`} sizes="(max-width: 760px) 100vw, 680px" onError={event => { event.currentTarget.style.display = 'none'; }} />
        </picture>}
      </div>
      <div className="video-facade-copy"><strong>{video.title}</strong><p>{video.attribution}</p></div>
      <button className="primary" disabled={!online} onClick={open}>{online ? <><Play size={17} />{failed ? 'Volver a intentar' : 'Ver demostración'}</> : <><WifiOff size={17} />Video sin conexión</>}</button>
    </div>}
    <div className="video-caption"><span>{video.attribution} · Audio en inglés</span>{video.url && <a href={video.url} target="_blank" rel="noreferrer">Abrir en YouTube<ExternalLink size={13} /></a>}</div>
    {failed && <p className="note" role="status">El reproductor no pudo abrir este video. Puedes verlo con el enlace de YouTube o seguir las instrucciones escritas.</p>}
    {!online && <p className="note">Los videos necesitan internet. Tu rutina, instrucciones y temporizador siguen disponibles sin conexión.</p>}
    <p className="video-context">{video.note} La configuración de tu equipo se muestra por separado.</p>
    {!loaded && online && <small className="video-consent">Al reproducir te conectas con YouTube. La carátula también sale de YouTube y se pide al mostrar esta ficha. El video no arranca solo. Los subtítulos dependen del autor.</small>}
  </section>;
}
