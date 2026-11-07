import { useState } from 'react';
import { ArrowUpRight, Heart, Search } from 'lucide-react';
import { exercises } from '../data/catalog';
import { muscles, type Level, type Muscle } from '../domain/schema';
import { normalize } from '../domain/engine';
import { ExerciseArt } from './EquipmentDrawing';
import { Empty } from './ui';

export function Library({favorites,detail}: {favorites:string[];detail:(id:string)=>void}) {
  const [search,setSearch]=useState('');const [level,setLevel]=useState('');const [muscle,setMuscle]=useState('');const [onlyFav,setOnlyFav]=useState(false);const [english,setEnglish]=useState(false);
  const results=exercises.filter(e=>(!search||normalize([e.name,e.en,...e.aliases].join(' ')).includes(normalize(search)))&&(!level||e.level===level as Level)&&(!muscle||e.primary.includes(muscle as Muscle)||e.secondary.includes(muscle as Muscle))&&(!onlyFav||favorites.includes(e.id)));
  return <section className="library"><div className="page-heading"><div><p className="section-label">Biblioteca de movimiento</p><h1>Entiende cada ejercicio.</h1><p>Técnica, intención y ajustes que puedes revisar.</p></div><label className="check-field"><input type="checkbox" checked={english} onChange={e=>setEnglish(e.target.checked)}/><span>Nombres en inglés</span></label></div>
    <div className="library-filters"><label className="search-field"><Search size={19}/><input aria-label="Buscar ejercicio" placeholder="Busca un movimiento…" value={search} onChange={e=>setSearch(e.target.value)}/></label><select aria-label="Filtrar por nivel" value={level} onChange={e=>setLevel(e.target.value)}><option value="">Todos los niveles</option>{['principiante','intermedio','avanzado'].map(l=><option key={l}>{l}</option>)}</select><select aria-label="Filtrar por grupo muscular" value={muscle} onChange={e=>setMuscle(e.target.value)}><option value="">Todos los grupos</option>{muscles.map(m=><option key={m}>{m}</option>)}</select><button aria-pressed={onlyFav} className={`icon-button ${onlyFav?'selected':''}`} aria-label="Mostrar solo favoritos" onClick={()=>setOnlyFav(!onlyFav)}><Heart fill={onlyFav?'currentColor':'none'} size={20}/></button></div>
    <p className="muted result-count" role="status">{results.length} ejercicios · Catálogo inicial documentado; revisión profesional independiente pendiente.</p>
    {results.length?<div className="exercise-grid">{results.map((e,i)=><button className="exercise-card" key={e.id} onClick={()=>detail(e.id)}><div className={`exercise-card-image tone-${i%3}`}><ExerciseArt position={e.position} small/>{favorites.includes(e.id)&&<Heart size={18} fill="currentColor" className="favorite-mark"/>}</div><div className="exercise-card-copy"><div className="row spread"><span className="tag">{e.level}</span><ArrowUpRight size={18}/></div><h2>{english?e.en:e.name}</h2><p>{e.primary.join(' · ')}</p><small>{e.position}{e.accessories.length?` · ${e.accessories.join(', ')}`:''}</small></div></button>)}</div>:<Empty title="Prueba otra búsqueda">No hay ejercicios con esta combinación de filtros.</Empty>}
  </section>;
}
