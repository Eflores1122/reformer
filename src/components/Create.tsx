import { ArrowUpRight, Check, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { exercises } from '../data/catalog';
import type { Machine, Muscle, Profile } from '../domain/schema';
import { EquipmentDrawing } from './EquipmentDrawing';
import { ExerciseFigure } from './ExerciseFigure';
import { Field, Reveal } from './ui';

const starters = [
  { name: 'Generar 25 min de pecho y glúteos', meta: '25 min', request: 'Pecho y glúteos durante 25 minutos para principiantes' },
  { name: 'Generar 10 min de movilidad suave', meta: '10 min', request: 'Movilidad suave durante 10 minutos' },
  { name: 'Generar 30 min de cuerpo completo', meta: '30 min', request: 'Cuerpo completo durante 30 minutos' }
];

export function Create({profile,machine,generate,openEquipment,updateProfile,openExercise}: {profile:Profile;machine?:Machine;generate:(input:string,targets:Muscle[])=>void;openEquipment:()=>void;updateProfile:(p:Profile)=>void;openExercise:(id:string)=>void}) {
  const [input,setInput]=useState(''); const [targets,setTargets]=useState<Muscle[]>(profile.priorities); const [more,setMore]=useState(false);
  const groups:Muscle[]=['Glúteos','Pecho','Espalda','Core','Cuádriceps','Hombros','Bíceps','Tríceps'];
  const toggle=(m:Muscle)=>setTargets(v=>v.includes(m)?v.filter(x=>x!==m):[...v,m]);
  return <div className="create-layout">
    <section className="studio-band">
      <div className="page-intro"><h1>Tu sesión</h1><p>Describe el foco y los minutos. El generador local usa 13 movimientos documentados, el nivel del perfil y el tiempo que elijas.</p></div>
      <Reveal className="studio-stage">
        <div className="studio-cycle" aria-hidden="true">
          <ExerciseFigure id="footwork-heels" phase="start" decorative />
          <ExerciseFigure id="footwork-heels" phase="end" decorative className="phase-end" />
        </div>
        <p className="studio-caption">Footwork en talones, inicio y final. Dibujo original.</p>
      </Reveal>
    </section>
    <section className="create-workspace">
      <form onSubmit={e=>{e.preventDefault();generate(input,targets);}}>
        <label className="request-label" htmlFor="request">Tu intención de hoy</label>
        <div className="request-box"><textarea id="request" maxLength={1000} value={input} onChange={e=>setInput(e.target.value)} placeholder="Quiero trabajar pecho y glúteos durante 25 minutos."/><span>Se interpreta en tu dispositivo</span></div>
        <div className="controls-row">
          <Field label="Tu nivel"><select value={profile.level} onChange={e=>updateProfile({...profile,level:e.target.value as Profile['level']})}><option value="principiante">Principiante</option><option value="intermedio">Intermedio</option><option value="avanzado">Avanzado</option></select></Field>
          <Field label="Tiempo disponible"><select value={profile.duration} onChange={e=>updateProfile({...profile,duration:Number(e.target.value)})}>{[10,15,20,25,30,45,60].map(n=><option key={n} value={n}>{n} minutos</option>)}</select></Field>
          <Field label="Intensidad"><select value={profile.intensity} onChange={e=>updateProfile({...profile,intensity:e.target.value as Profile['intensity']})}><option>suave</option><option>moderada</option><option>intensa</option></select></Field>
        </div>
        <div className="focus-heading"><span>Elige tu foco</span><span className="muted">Opcional</span></div>
        <div className="focus-chips">{groups.map(m=><button key={m} type="button" aria-pressed={targets.includes(m)} className={`chip ${targets.includes(m)?'active':''}`} onClick={()=>toggle(m)}>{targets.includes(m)&&<Check size={14}/>} {m}</button>)}</div>
        <button className="text-button advanced-toggle" type="button" aria-expanded={more} onClick={()=>setMore(!more)}><SlidersHorizontal size={16}/>Preferencias de la sesión<ChevronDown size={14} className={more?'rotated':''}/></button>
        {more&&<div className="advanced-options"><Field label="Evitar grupos musculares" hint="Se excluyen también los ejercicios que los usan como músculos secundarios."><select value="" onChange={e=>{if(e.target.value)updateProfile({...profile,avoid:[...new Set([...profile.avoid,e.target.value as Muscle])]});}}><option value="">Añadir un grupo.</option>{groups.map(m=><option key={m}>{m}</option>)}</select></Field><div className="focus-chips">{profile.avoid.map(m=><button type="button" className="chip active" key={m} onClick={()=>updateProfile({...profile,avoid:profile.avoid.filter(x=>x!==m)})}>{m} ×</button>)}</div></div>}
        <button className="primary create-button" type="submit">Crear mi rutina<ArrowUpRight size={22}/></button>
        <p className="under-button">Sin cuenta para crear, editar o entrenar.</p>
      </form>
    </section>
    <aside className="equipment-preview">
      <div className="equipment-heading"><span className="tag">{machine?'En este navegador':'Sin inventario'}</span></div>
      <div className="machine-title"><h2>{machine?.name || 'Sin Reformer registrado'}</h2><p>{machine?`${machine.manufacturer}. ${machine.model}`:'Puedes generar la rutina ahora. El inventario se confirma antes de asignar resortes.'}</p></div>
      <EquipmentDrawing machine={machine}/>
      <div className="equipment-caption"><span>Vista de configuración</span><span>Esquema orientativo</span></div>
      {machine?<div className="spring-inventory">{machine.springs.map(s=><span key={s.id}><i style={{background:s.color}}/>{s.count} {s.label.toLowerCase()}</span>)}</div>:<p className="equipment-explanation">El dibujo muestra carro, barra y resortes del equipo activo. Sin máquina registrada no hay colores que copiar.</p>}
      <button className="secondary full" onClick={openEquipment}>{machine?'Revisar mi equipo':'Configurar mi Reformer'}<ArrowUpRight size={17}/></button>
      <div className="practice-note"><div><strong>El color no se transfiere entre marcas.</strong><p>Un rojo de Balanced Body no equivale al de otro fabricante. El inventario parte de tu máquina.</p></div></div>
    </aside>
    <section className="movement-rail">
      <div className="row spread"><h2>Los 13 movimientos</h2><span className="muted">Abre la ficha para ver inicio, final y video</span></div>
      <div className="movement-rail-track">{exercises.map(e => <button type="button" key={e.id} onClick={() => openExercise(e.id)}><ExerciseFigure id={e.id} phase="start" decorative /><span>{e.name}</span></button>)}</div>
    </section>
    <section className="quick-practices"><h2>Textos de ejemplo</h2><ul className="quick-list">{starters.map(p=><li key={p.name}><button type="button" onClick={()=>{setInput(p.request);generate(p.request,[]);}}>{p.name}<span>{p.meta}</span></button></li>)}</ul></section>
  </div>;
}
