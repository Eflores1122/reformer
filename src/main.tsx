import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './style.css';

registerSW({ onRegisteredSW(_url,registration){setInterval(()=>registration?.update(),3600000);}, onNeedRefresh(){
  // Do not reload while a user edits or trains. New worker activates on the next visit.
  console.info('REFORMER: actualización disponible para la próxima apertura.');
}});
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
