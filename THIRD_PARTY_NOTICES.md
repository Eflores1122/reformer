# Dependencias y materiales

El código original y los SVG de REFORMER son MIT. Los manuales enlazados conservan derechos de sus autores y no se redistribuyen. Los nombres comerciales identifican equipos o fuentes; no implican afiliación.

| Componente | Licencia |
| --- | --- |
| React y React DOM | MIT |
| Vite, Vitest y plugin React | MIT |
| TypeScript, Playwright y Workbox | Apache-2.0 |
| Dexie | Apache-2.0 |
| Zod y vite-plugin-pwa | MIT |
| Lucide | ISC, con atribuciones heredadas según su licencia |
| DM Sans y Manrope | SIL Open Font License 1.1 |
| axe-core | MPL-2.0; solo utilizado para pruebas, sin distribuirse en el frontend |
| fake-indexeddb | Apache-2.0; solo pruebas |

Las licencias de cada versión se conservan en sus paquetes y en el lockfile de dependencias. OFL se aplica a las fuentes, no cambia la licencia del código. MPL se limita a la herramienta de análisis de pruebas. No se modificó código de dependencias con copyleft.

Las versiones se fijan mediante `package-lock.json`. Se actualizan `glob` y `minimatch` transitivos para evitar avisos moderados de herramientas de compilación. La revisión de dependencias puede identificar avisos bajos sin corrección compatible en herramientas de desarrollo; consultar `docs/PRUEBAS.md` para el estado verificado en este checkpoint.
