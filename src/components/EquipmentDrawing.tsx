import type { Configuration, Machine } from '../domain/schema';

export function EquipmentDrawing({machine, config, compact=false}: {machine?: Machine; config?: Configuration|null; compact?: boolean}) {
  const springs = machine?.springs.flatMap(s=>Array.from({length:s.count},(_,i)=>({...s,active:(config?.springs[s.id]||0)>i}))).slice(0,10) || [];
  return <svg className={`equipment-drawing ${compact?'compact':''}`} viewBox="0 0 620 390" role="img" aria-label={machine ? `Esquema de ${machine.name}; ${springs.filter(s=>s.active).length} resortes seleccionados.`:'Esquema de un Reformer. Registra tu equipo para ver su inventario.'}>
    <defs><pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".1"/></pattern></defs>
    <rect width="620" height="390" fill="url(#grid)"/>
    <g className="reformer-frame" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="m60 229 343-149 156 79-343 151Z" opacity=".3"/>
      <path d="m60 210 343-149 156 79-343 151Z" strokeWidth="3"/>
      <path d="m60 210 0 19m343-168v19m156 60v19m-343 132v19"/>
      <path d="m74 216 328-143m-171 201 311-135"/>
      <path d="m72 230-8 53 20 9 9-53m435-86 2 57 18 8 1-58m-338 143-2 52 20 8 11-61" strokeWidth="3"/>
      <path d="m72 186 0-67 84-38 43 22v67M72 119l43 22 84-38m-84 38v64" strokeWidth="6" strokeLinecap="round"/>
      <path d="m469 91 0-59 22-9 12 6v75m-72-30V18l23-10 11 6v69"/>
      <path d="m453 19 20 8m17 6 18 9" opacity=".4"/>
    </g>
    <g className="carriage-group" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path className="carriage-pad" d="m209 172 175-76 113 58-175 76Z"/>
      <path d="m209 172v13l113 58 175-76v-13M322 230v13" fill="none"/>
      <path className="shoulder-pad" d="m364 102 10-23 25-10 18 9v29l-23 11Z"/>
      <path className="shoulder-pad" d="m426 133 9-24 24-9 19 9v30l-24 11Z"/>
      <path d="m473 30-81 86m41-98-65 88" fill="none" strokeWidth="1" strokeDasharray="4 4" opacity=".6"/>
      <path d="m106 221 93 47m-68-88 92 47" fill="none" opacity=".6"/>
    </g>
    {springs.map((s,i)=>{
      const x=132+i*8,y=202+i*4;
      return <g key={`${s.id}-${i}`} stroke={s.color} fill="none" strokeWidth={s.active?3:1.5} opacity={s.active?1:.38}><path d={`M${x} ${y}l8-4 5 1 1-5 7 1 1-5 7 1 1-5 7 1 1-5 7 1 10-5`}/><circle cx={x} cy={y} r="3"/></g>;
    })}
    <g fill="currentColor" className="drawing-labels"><text x="67" y="332">Barra de pies</text><path d="m107 311 0-64" stroke="currentColor" strokeWidth=".7" opacity=".4"/><text x="401" y="317">Carro móvil</text><path d="m425 297-55-63" stroke="currentColor" strokeWidth=".7" opacity=".4"/></g>
  </svg>;
}
export function ExerciseArt({position, muscle, small=false}: {position:string; muscle?:string; small?:boolean}) {
  const seated=position==='Sentado';
  return <svg viewBox="0 0 400 240" className={`exercise-art ${small?'small':''}`} role="img" aria-label={`Esquema orientativo: posición ${position.toLowerCase()}${muscle?`, foco en ${muscle.toLowerCase()}`:''}. Consulta las instrucciones para la técnica.`}>
    <path d="M30 195h340M55 170h285M70 172v23m255-23v23" stroke="currentColor" fill="none" opacity=".3" strokeWidth="3"/>
    <rect x="107" y="157" width="187" height="15" rx="7" fill="currentColor" opacity=".15"/>
    {seated ? <g className="exercise-person" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"><circle cx="218" cy="52" r="15" fill="currentColor" stroke="none"/><path d="m218 80-6 57 42 16 47 0m-87-61-42 15-26-8m72 40-37 14-39 0"/></g> : <g className="exercise-person" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"><circle cx="275" cy="137" r="16" fill="currentColor" stroke="none"/><path d={position==='Boca abajo'?'M248 143h-70l-54-15-45 19M244 144l45-29 37 24':'M248 143h-63l-42-50-37 51M239 141l-24-48-40-6'}/></g>}
    <path d="M80 154v-51h29" stroke="currentColor" fill="none" strokeWidth="5" opacity=".45" strokeLinecap="round"/>
  </svg>;
}
