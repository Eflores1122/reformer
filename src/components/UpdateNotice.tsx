import { useRegisterSW } from 'virtual:pwa-register/react';
import { useState } from 'react';

export function UpdateNotice({beforeUpdate}:{beforeUpdate:()=>Promise<void>}) {
  const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  const {needRefresh:[needRefresh],updateServiceWorker}=useRegisterSW({
    onRegisteredSW(_url,registration){
      const check=()=>{if(navigator.onLine)registration?.update().catch(()=>undefined);};
      check();setInterval(check,15*60*1000);
      document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
    }
  });
  if(!needRefresh)return null;
  return <div className="update-banner" role="status"><span>Hay una versión nueva de REFORMER. Conservaremos tu equipo y tu borrador.</span><button disabled={busy} onClick={async()=>{setBusy(true);try{await beforeUpdate();await updateServiceWorker(true);}catch{setError('No se pudo conservar el estado. Descarga un respaldo antes de actualizar.');setBusy(false);}}}>{busy?'Actualizando…':'Actualizar aplicación'}</button>{error&&<span>{error}</span>}</div>;
}
