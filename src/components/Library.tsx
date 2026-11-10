import { useState } from 'react';
import { ArrowUpRight, Heart, Search } from 'lucide-react';
import { exercises } from '../data/catalog';
import { exerciseVideos } from '../data/videos';
import { muscles, type Level, type Machine, type Muscle } from '../domain/schema';
import { normalize } from '../domain/engine';
import { ExerciseFigure } from './ExerciseFigure';
import { Empty } from './ui';

const zones: Record<string, Muscle[]> = {
  Piernas: ['Cuádriceps', 'Pantorrillas', 'Isquiotibiales', 'Glúteos'],
  Cadera: ['Cadera', 'Glúteos'],
  Core: ['Abdomen', 'Core', 'Estabilidad'],
  Brazos: ['Bíceps', 'Tríceps', 'Hombros', 'Pecho'],
  Espalda: ['Espalda']
};

export function Library({ favorites, detail, machine }: { favorites: string[]; detail: (id: string) => void; machine?: Machine }) {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [zone, setZone] = useState('');
  const [muscle, setMuscle] = useState('');
  const [drive, setDrive] = useState('');
  const [onlyFav, setOnlyFav] = useState(false);
  const [english, setEnglish] = useState(false);
  const zoneMuscles = zone ? zones[zone] : null;
  const results = exercises.filter(e => (!search || normalize([e.name, e.en, ...e.aliases].join(' ')).includes(normalize(search))) && (!level || e.level === level as Level) && (!zoneMuscles || [...e.primary, ...e.secondary].some(m => zoneMuscles.includes(m))) && (!muscle || e.primary.includes(muscle as Muscle) || e.secondary.includes(muscle as Muscle)) && (!drive || e.drive === drive) && (!onlyFav || favorites.includes(e.id)));
  return <section className="library">
    <div className="page-heading"><div><h1>13 movimientos</h1><p>Inicio, final y video en cada ficha. Los dibujos son de esta aplicación. Los videos se cargan solo si eliges verlos.</p></div><label className="check-field"><input type="checkbox" checked={english} onChange={e => setEnglish(e.target.checked)} /><span>Nombres en inglés</span></label></div>
    <div className="library-filters">
      <label className="search-field"><Search size={19} /><input aria-label="Buscar ejercicio" placeholder="Busca un movimiento…" value={search} onChange={e => setSearch(e.target.value)} /></label>
      <select aria-label="Filtrar por nivel" value={level} onChange={e => setLevel(e.target.value)}><option value="">Todos los niveles</option>{['principiante', 'intermedio', 'avanzado'].map(l => <option key={l}>{l}</option>)}</select>
      <select aria-label="Filtrar por zona del cuerpo" value={zone} onChange={e => setZone(e.target.value)}><option value="">Toda la zona</option>{Object.keys(zones).map(name => <option key={name}>{name}</option>)}</select>
      <select aria-label="Filtrar por grupo muscular" value={muscle} onChange={e => setMuscle(e.target.value)}><option value="">Todos los grupos</option>{muscles.map(m => <option key={m}>{m}</option>)}</select>
      <select aria-label="Filtrar por resorte" value={drive} onChange={e => setDrive(e.target.value)}><option value="">Carro y correas</option><option value="carro">Resorte en el carro</option><option value="correas">Resorte en las correas</option></select>
      <button aria-pressed={onlyFav} className={`icon-button ${onlyFav ? 'selected' : ''}`} aria-label="Mostrar solo favoritos" onClick={() => setOnlyFav(!onlyFav)}><Heart fill={onlyFav ? 'currentColor' : 'none'} size={20} /></button>
    </div>
    <p className="muted result-count" role="status">{results.length} ejercicios · Catálogo inicial documentado; revisión profesional independiente pendiente.{machine ? ` Inventario activo: ${machine.name}.` : ''}</p>
    {results.length ? <div className="exercise-grid">{results.map(e => <button className="exercise-card" data-exercise-id={e.id} data-video-id={exerciseVideos[e.id]?.youtubeId || ''} key={e.id} onClick={() => detail(e.id)}>
      <div className="exercise-card-image">
        <ExerciseFigure id={e.id} phase="start" decorative />
        <div className="end-inset" aria-hidden="true"><ExerciseFigure id={e.id} phase="end" decorative /><span>Final</span></div>
        {favorites.includes(e.id) && <Heart size={18} fill="currentColor" className="favorite-mark" />}
      </div>
      <div className="exercise-card-copy">
        <div className="row spread"><span className="tag">{e.level}</span><ArrowUpRight size={18} /></div>
        <h2>{english ? e.en : e.name}</h2>
        <p>{e.primary.join(' · ')}</p>
        <small>{e.position} · {e.drive === 'correas' ? 'Correas' : 'Carro'}{e.accessories.length ? ` · ${e.accessories.join(', ')}` : ''}</small>
      </div>
    </button>)}</div> : <Empty title="Prueba otra búsqueda">No hay ejercicios con esta combinación de filtros.</Empty>}
  </section>;
}
