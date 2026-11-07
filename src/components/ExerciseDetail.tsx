import { ExternalLink, Heart, Plus } from 'lucide-react';
import { sources, type SourceId } from '../data/catalog';
import type { Exercise } from '../domain/schema';
import { ExerciseArt } from './EquipmentDrawing';
import { ExerciseVideo } from './ExerciseVideo';

export function ExerciseDetail({exercise:e, favorite, toggleFavorite, add}: {exercise:Exercise;favorite:boolean;toggleFavorite:()=>void;add?:()=>void}) {
  const source=sources[e.sourceId as SourceId];
  return <div className="exercise-detail">
    <ExerciseVideo key={e.id} exercise={e}/>
    <details className="position-reference"><summary>Ver esquema de posición</summary><div className="detail-visual"><ExerciseArt position={e.position} muscle={e.primary[0]}/><span>Esquema de posición, no demostración del movimiento</span></div></details>
    <div className="row spread"><div><p className="muted">{e.en}</p><span className="tag">{e.level}</span></div><button className={`icon-button ${favorite?'selected':''}`} aria-label={favorite?'Quitar de favoritos':'Añadir a favoritos'} aria-pressed={favorite} onClick={toggleFavorite}><Heart fill={favorite?'currentColor':'none'} size={20}/></button></div>
    <p>{e.description}</p><div className="muscle-tags">{e.primary.map(m=><span className="tag teal" key={m}>{m} · principal</span>)}{e.secondary.map(m=><span className="tag" key={m}>{m} · secundario</span>)}</div>
    <h3>Preparación</h3><p>{e.setup}</p><h3>Movimiento</h3><ol>{e.steps.map(s=><li key={s}>{s}</li>)}</ol><p className="note">{e.breath}</p>
    <div className="detail-columns"><div><h3>Cuida la técnica</h3><ul>{e.cues.map(x=><li key={x}>{x}</li>)}</ul></div><div><h3>Evita</h3><ul>{e.errors.map(x=><li key={x}>{x}</li>)}</ul></div></div>
    <h3>Adapta el movimiento</h3><p><strong>Más sencillo:</strong> {e.easier}</p><p><strong>Progresión:</strong> {e.harder}</p>
    <details><summary>Precauciones y revisión técnica</summary><ul>{e.precautions.map(s=><li key={s}>{s}</li>)}</ul><p>Estado: {e.review}. La documentación de un movimiento no valida su adecuación individual. La configuración se confirma por máquina.</p></details>
    <a className="source-link" href={source.url} target="_blank" rel="noreferrer">{source.title}{e.sourcePage?` · página PDF ${e.sourcePage}`:''}<ExternalLink size={15}/></a>
    {add&&<button className="primary full" onClick={add}><Plus size={18}/>Añadir a mi rutina</button>}
  </div>;
}
