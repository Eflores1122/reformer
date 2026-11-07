import { ArrowUpRight, Check, ChevronDown, Clock3, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import type { Machine, Muscle, Profile } from '../domain/schema';
import { EquipmentDrawing } from './EquipmentDrawing';
import { Field } from './ui';

export function Create({profile,machine,generate,openEquipment,updateProfile}: {profile:Profile;machine?:Machine;generate:(input:string,targets:Muscle[])=>void;openEquipment:()=>void;updateProfile:(p:Profile)=>void}) {
  const [input,setInput]=useState(''); const [targets,setTargets]=useState<Muscle[]>(profile.priorities); const [more,setMore]=useState(false);
  const groups:Muscle[]=['Glúteos','Pecho','Espalda','Core','Cuádriceps','Hombros','Bíceps','Tríceps'];
  const toggle=(m:Muscle)=>setTargets(v=>v.includes(m)?v.filter(x=>x!==m):[...v,m]);
  return <div className="create-layout">
    <section className="create-workspace">
      <div className="page-intro"><p className="section-label">Tu sesión empieza aquí</p><h1>¿Qué quieres<br className="desktop-break"/> entrenar hoy?</h1><p>Cuéntanos cómo te quieres mover.<br/>La práctica se adapta a ti y a tu equipo.</p></div>
      <form onSubmit={e=>{e.preventDefault();generate(input,targets);}}>
        <label className="request-label" htmlFor="request">Tu intención de hoy</label>
        <div className="request-box"><textarea id="request" maxLength={1000} value={input} onChange={e=>setInput(e.target.value)} placeholder="Quiero trabajar pecho y glúteos durante 25 minutos…"/><span><span className="tiny-signal"/> Se interpreta en tu dispositivo</span></div>
        <div className="controls-row">
          <Field label="Tu nivel"><select value={profile.level} onChange={e=>updateProfile({...profile,level:e.target.value as Profile['level']})}><option value="principiante">Principiante</option><option value="intermedio">Intermedio</option><option value="avanzado">Avanzado</option></select></Field>
          <Field label="Tiempo disponible"><select value={profile.duration} onChange={e=>updateProfile({...profile,duration:Number(e.target.value)})}>{[10,15,20,25,30,45,60].map(n=><option key={n} value={n}>{n} minutos</option>)}</select></Field>
          <Field label="Intensidad"><select value={profile.intensity} onChange={e=>updateProfile({...profile,intensity:e.target.value as Profile['intensity']})}><option>suave</option><option>moderada</option><option>intensa</option></select></Field>
        </div>
        <div className="focus-heading"><span>Elige tu foco</span><span className="muted">Opcional</span></div>
        <div className="focus-chips">{groups.map(m=><button key={m} type="button" aria-pressed={targets.includes(m)} className={`chip ${targets.includes(m)?'active':''}`} onClick={()=>toggle(m)}>{targets.includes(m)&&<Check size={14}/>} {m}</button>)}</div>
        <button className="text-button advanced-toggle" type="button" aria-expanded={more} onClick={()=>setMore(!more)}><SlidersHorizontal size={16}/>Preferencias de la sesión<ChevronDown size={14} className={more?'rotated':''}/></button>
        {more&&<div className="advanced-options"><Field label="Evitar grupos musculares" hint="Se excluyen también los ejercicios que los usan como músculos secundarios."><select value="" onChange={e=>{if(e.target.value)updateProfile({...profile,avoid:[...new Set([...profile.avoid,e.target.value as Muscle])]});}}><option value="">Añadir un grupo…</option>{groups.map(m=><option key={m}>{m}</option>)}</select></Field><div className="focus-chips">{profile.avoid.map(m=><button type="button" className="chip active" key={m} onClick={()=>updateProfile({...profile,avoid:profile.avoid.filter(x=>x!==m)})}>{m} ×</button>)}</div></div>}
        <button className="primary create-button" type="submit">Crear mi rutina<ArrowUpRight size={22}/></button>
        <p className="under-button">Sin cuenta para crear, editar o entrenar.</p>
      </form>
    </section>
    <aside className="equipment-preview">
      <div className="equipment-heading"><span className="section-label">Tu equipo</span><span className={`tag ${machine?'teal':''}`}>{machine?'Perfil local':'Sin configurar'}</span></div>
      <div className="machine-title"><h2>{machine?.name || 'Conoce tu Reformer'}</h2><p>{machine?`${machine.manufacturer} · ${machine.model}`:'Cada máquina tiene su propia forma de moverse.'}</p></div>
      <EquipmentDrawing machine={machine}/>
      <div className="equipment-caption"><span>Vista de configuración</span><span>Esquema orientativo</span></div>
      {machine?<div className="spring-inventory">{machine.springs.map(s=><span key={s.id}><i style={{background:s.color}}/>{s.count} {s.label.toLowerCase()}</span>)}</div>:<p className="equipment-explanation">Puedes crear una propuesta ahora. Antes de entrenar, confirmaremos el inventario y los ajustes de tu máquina.</p>}
      <button className="secondary full" onClick={openEquipment}>{machine?'Revisar mi equipo':'Configurar mi Reformer'}<ArrowUpRight size={17}/></button>
      <div className="practice-note"><span className="line-motif" aria-hidden="true"/><div><strong>Precisión antes que resistencia.</strong><p>El color de un resorte cambia entre fabricantes. Tu equipo es el punto de partida.</p></div></div>
    </aside>
    <section className="quick-practices"><div className="row spread"><h2>Un punto de partida</h2><span className="muted">Hazlo tuyo</span></div><div className="quick-grid">{[{name:'Pecho y glúteos',meta:'25 min',request:'Pecho y glúteos durante 25 minutos para principiantes',className:'peach'},{name:'Movilidad suave',meta:'10 min',request:'Movilidad suave durante 10 minutos',className:'sage'},{name:'Cuerpo completo',meta:'30 min',request:'Cuerpo completo durante 30 minutos',className:'lavender'}].map(p=><button className={`quick-practice ${p.className}`} key={p.name} onClick={()=>{setInput(p.request);generate(p.request,[]);}}><span>{p.name}</span><div><span><Clock3 size={14}/>{p.meta}</span><ArrowUpRight size={19}/></div></button>)}</div></section>
  </div>;
}
