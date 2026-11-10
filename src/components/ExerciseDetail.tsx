import { ExternalLink, Heart, Plus } from 'lucide-react';
import { sources, type SourceId } from '../data/catalog';
import type { Exercise, Machine } from '../domain/schema';
import { PosePair } from './ExerciseFigure';
import { ExerciseVideo } from './ExerciseVideo';

export function ExerciseDetail({ exercise: e, favorite, toggleFavorite, add, machine }: { exercise: Exercise; favorite: boolean; toggleFavorite: () => void; add?: () => void; machine?: Machine }) {
  const source = sources[e.sourceId as SourceId];
  const saved = machine?.settings[e.id];
  return <div className="exercise-detail">
    <PosePair id={e.id} />
    <p className="figure-credit">Dibujo original de esta aplicación. Muestra el inicio y el final. No sustituye la demostración ni un ajuste de instructor.</p>
    {e.equipment === 'reformer' && <ExerciseVideo key={e.id} exercise={e} />}
    <div className="row spread"><div><p className="muted">{e.en}</p><span className="tag">{e.level}</span></div><button className={`icon-button ${favorite ? 'selected' : ''}`} aria-label={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'} aria-pressed={favorite} onClick={toggleFavorite}><Heart fill={favorite ? 'currentColor' : 'none'} size={20} /></button></div>
    <p>{e.description}</p>
    <div className="muscle-tags">{e.primary.map(m => <span className="tag teal" key={m}>{m} · principal</span>)}{e.secondary.map(m => <span className="tag" key={m}>{m} · secundario</span>)}</div>
    <h3>Preparación</h3><p>{e.setup}</p>
    <h3>Movimiento</h3><ol>{e.steps.map(s => <li key={s}>{s}</li>)}</ol><p className="note">{e.breath}</p>
    <div className="detail-columns"><div><h3>Cuida la técnica</h3><ul>{e.cues.map(x => <li key={x}>{x}</li>)}</ul></div><div><h3>Errores frecuentes</h3><ul>{e.errors.map(x => <li key={x}>{x}</li>)}</ul></div></div>
    {e.equipment === 'reformer' && <section className="spring-setup">
      <h3>Resortes</h3>
      <p>{e.drive === 'correas' ? 'El resorte carga las correas. El carro puede quedarse quieto.' : 'El resorte frena el carro mientras empujas la barra.'} El color y la cantidad salen de tu inventario, no de una receta de esta ficha.</p>
      {machine && machine.springs.length > 0 ? <ul className="swatch-list">{machine.springs.map(s => {
        const used = saved?.springs[s.id];
        return <li key={s.id}><i style={{ background: s.color }} aria-hidden="true" /><span>{s.label}</span><strong>{typeof used === 'number' ? `${used} en tu ajuste` : `${s.count} en el equipo`}</strong><small>{s.relative}</small></li>;
      })}</ul> : <p className="muted">Registra tu Reformer para ver aquí los colores que tú cargaste.</p>}
      {saved?.confirmed && <p className="muted">Último ajuste confirmado en {machine?.name}: barra {saved.footbar || 'sin nota'}, cabecera {saved.headrest || 'sin nota'}.</p>}
    </section>}
    <h3>Adapta el movimiento</h3><p><strong>Más sencillo:</strong> {e.easier}</p><p><strong>Progresión:</strong> {e.harder}</p>
    <details><summary>Precauciones y revisión técnica</summary><ul>{e.precautions.map(s => <li key={s}>{s}</li>)}</ul><p>Estado: {e.review}. La documentación de un movimiento no valida su adecuación individual. La configuración se confirma por máquina.</p></details>
    <a className="source-link" href={source.url} target="_blank" rel="noreferrer">{source.title}{e.sourcePage ? ` · página PDF ${e.sourcePage}` : ''}<ExternalLink size={15} /></a>
    {add && <button className="primary full" onClick={add}><Plus size={18} />Añadir a mi rutina</button>}
  </div>;
}
