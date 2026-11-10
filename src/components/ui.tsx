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
  return <div className="empty"><h2>{title}</h2><p>{children}</p>{action}</div>;
}
export const formatTime = (seconds: number) => `${Math.floor(Math.max(0,seconds)/60).toString().padStart(2,'0')}:${Math.floor(Math.max(0,seconds)%60).toString().padStart(2,'0')}`;
export const minutes = (seconds:number) => Math.round(seconds/60*10)/10;
