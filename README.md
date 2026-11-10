# REFORMER

Una aplicación abierta para crear, editar y seguir una práctica de Pilates Reformer. Funciona en el navegador, sin servidor propio, anuncios, claves de IA ni suscripción.

**Aplicación:** https://eflores1122.github.io/reformer/
**Código:** https://github.com/Eflores1122/reformer

## Estado de esta versión

Versión funcional 0.1.3. La primera pantalla es el creador de rutinas, con el esquema del Footwork y una fila de los 13 movimientos. Puedes explorar, generar propuestas, editar y entrenar sin cuenta. El análisis de solicitudes se ejecuta localmente mediante reglas en español.

- Generador sensible a nivel, grupos, tiempo, equipo, accesorios y exclusiones; preparación y vuelta a la calma.
- Editor con series, repeticiones, tiempos, descansos, transiciones, orden, notas, sustitución, deshacer, rehacer e impresión/PDF del navegador.
- Trece movimientos de Reformer documentados, cinco preparaciones suaves, instrucciones y fuentes. Cada ficha tiene un dibujo original del inicio y del final, y un video público de Align-Pilates, Balanced Body o Pilates Anytime. El reproductor se carga solo al elegir reproducir. La carátula es la miniatura de ese video.
- Múltiples máquinas con inventarios separados. Perfiles de IRONSIDE Reformer Madera Oak, Allegro 2 con Signature Springs y modelos personalizados. Allegro 2 parte de 3 rojos, 1 azul y 1 amarillo (ficha del modelo) y de los nombres cualitativos de la ficha Signature Springs. El inventario del IRONSIDE se registra con datos del usuario porque el fabricante no publica cantidades ni fuerzas por color.
- Configuraciones por máquina y ejercicio, cantidades físicas, confirmación del usuario e invalidación al cambiar el equipo. No hay prescripción automática de colores ni equivalencias en kg.
- Entrenamiento con reloj por marcas temporales, pausa, series reales, repeticiones, esfuerzo, control, configuración efectiva, omisiones y reanudación.
- Historial, actividad semanal, distribución muscular y una regla transparente de progresión sin cambios automáticos de resortes.
- IndexedDB, exportación de rutina JSON, respaldo completo JSON, historial CSV y restauración validada.
- PWA, modo claro/oscuro, responsive, navegación por teclado y movimiento reducido.

El borrador y los registros son locales. Siguiendo la directiva guest-first, “Guardar rutina” explica que la biblioteca de cuenta y la sincronización **aún no están configuradas** y permite exportar. No hay un registro simulado ni proveedores OAuth sin configurar. Se pueden exportar tantas rutinas como se desee; esta versión conserva un borrador de trabajo a la vez.

La documentación del movimiento no equivale a validación individual. Puedes entrar al entrenamiento y comenzar la preparación sin completar todos los ajustes. Antes de iniciar cada movimiento en el Reformer debes confirmar su inventario y ajustes aprendidos con un instructor. Las necesidades de modificación se filtran conservadoramente, sin diagnosticar ni prescribir rehabilitación.

## Medios

Los dibujos de posición son SVG originales de este repositorio, con la misma figura y la misma vista en las 13 fichas. Van dentro de la aplicación, así que el service worker los guarda con el shell. No hay fotos de stock ni archivos WebP propios: un trazado no gana nada al rasterizarse.

Los videos no se descargan. Se abren en `youtube-nocookie`, sin reproducción automática, después de pulsar el botón. La lista de canales, identificadores y la comprobación oEmbed está en [CREDITS.md](CREDITS.md). Esas carátulas y esos reproductores necesitan red. Sin conexión siguen el dibujo, el texto, el temporizador y los datos locales.

## Desarrollo

Requiere Node.js 24 o superior y npm.

```sh
npm ci
npm run dev
```

Abre `http://127.0.0.1:5173/reformer/`.

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
```

En macOS, Playwright usa Google Chrome instalado en su ruta estándar. En Linux/CI utiliza Chromium instalado por Playwright. No se necesita `.env` ni credencial para ejecutar la aplicación.

## Publicación

GitHub → Settings → Pages → Source: **GitHub Actions**. El workflow `pages.yml` verifica tipos, pruebas y compilación antes de publicar `dist/`. En pull requests solo verifica. Los permisos de publicación se limitan al job de despliegue y las acciones están fijadas a commits comprobados.

Vite, manifest y service worker usan `/reformer/`. Las rutas internas son fragmentos (`#crear`, `#rutina`, etc.), por lo que funcionan con recarga y enlaces directos en GitHub Pages. Si cambias el nombre del repositorio, actualiza el base path en `vite.config.ts` y los recursos de `index.html`.

Tras una primera visita completa en línea, el shell, fuentes, biblioteca e instrucciones se precargan. Los recursos externos no se prometen offline. Una actualización del service worker no recarga una práctica en curso.

## Documentación

- [Investigación funcional y matriz](docs/INVESTIGACION.md)
- [Arquitectura y diccionario de datos](docs/ARQUITECTURA.md)
- [Diseño y movimiento](docs/DISENO.md)
- [Fuentes y revisión](docs/FUENTES.md)
- [Validación y casos de aceptación](docs/PRUEBAS.md)
- [Limitaciones y hoja de ruta](docs/HOJA-DE-RUTA.md)
- [Privacidad](PRIVACY.md), [contribución](CONTRIBUTING.md), [cambios](CHANGELOG.md), [medios](CREDITS.md), [atribuciones](THIRD_PARTY_NOTICES.md)

El nombre REFORMER es descriptivo y provisional para este proyecto independiente. No se ha realizado una búsqueda exhaustiva de anterioridades de marca ni se afirma exclusividad. No hay afiliación con los fabricantes o aplicaciones investigados.

Código e ilustraciones originales bajo MIT. Fuentes tipográficas bajo OFL y dependencias bajo sus propias licencias. Los manuales enlazados no se redistribuyen.
