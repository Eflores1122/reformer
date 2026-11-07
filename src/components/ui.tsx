import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function Field({ label, children, hint }: {label: string; children: ReactNode; hint?: string}) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}
export function Modal({ title, children, close, wide=false }: {title: string; children: ReactNode; close: ()=>void; wide?: boolean}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef=useRef(close); closeRef.current=close;
  useEffect(()=>{const d=ref.current; const previous=document.activeElement as HTMLElement|null; d?.showModal(); const cancel=(e:Event)=>{e.preventDefault();closeRef.current();}; d?.addEventListener('cancel',cancel); return ()=>{d?.removeEventListener('cancel',cancel);d?.close();previous?.focus();};},[]);
  return <dialog ref={ref} className={`modal ${wide?'wide':''}`} aria-labelledby="dialog-title" onClick={e=>{if(e.target===e.currentTarget) close();}}>
    <div className="modal-head"><h2 id="dialog-title">{title}</h2><button className="icon-button" onClick={close} aria-label="Cerrar ventana"><X size={22}/></button></div>
    <div className="modal-body">{children}</div>
  </dialog>;
}
export function Empty({title, children, action}: {title: string; children: ReactNode; action?: ReactNode}) {
  return <div className="empty"><div className="empty-mark" aria-hidden="true"><span/><span/><span/></div><h2>{title}</h2><p>{children}</p>{action}</div>;
}
export const formatTime = (seconds: number) => `${Math.floor(Math.max(0,seconds)/60).toString().padStart(2,'0')}:${Math.floor(Math.max(0,seconds)%60).toString().padStart(2,'0')}`;
export const minutes = (seconds:number) => Math.round(seconds/60*10)/10;
export function Mark() { return <svg width="32" height="32" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M8 5v30M32 5v30M8 11h24M8 29h24" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/><rect x="12" y="15" width="16" height="10" rx="3" fill="currentColor"/><path d="m14 9 3-4m5 4 3-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }
