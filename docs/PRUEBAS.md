# Validación

Checkpoint inicial: 2026-11-07. Node 26.8.2 en macOS; CI configurado en Node 24. Compilación estricta TypeScript + Vite realizada. Vitest: **31 pruebas pasadas**. Playwright/Chromium: **16 escenarios pasados**, ocho flujos en escritorio y ocho con emulación iPhone 13. El workflow ejecuta ambas suites antes de publicar.

Los escenarios de configuración usan datos de prueba para comprobar controles; no son recomendaciones de resistencia.

| Caso del brief | Cobertura y resultado |
| --- | --- |
| 1. Principiante, pecho/glúteos, 25 minutos | Generación con preparación, foco, descansos, transición y enfriamiento; test de duración y edición UI |
| 2. 3 rojos con inventario de 2 | Rechazo unitario con cantidades explícitas |
| 3. Merrithew sin configuración Balanced Body | Rechazo por identidad de máquina; no hay traducción de colores |
| 4. Cambiar series | Duración recalculada; UI verifica cambio, deshacer y recarga |
| 5. 20 rutinas persistentes | La directiva posterior exige cuenta para biblioteca. Se prueban 20 borradores sucesivos persistidos y 20 archivos exportables. Una biblioteca de 20 rutinas de cuenta no se afirma implementada |
| 6. Completar 8 de 10 | Unidad registra 8 completados y 2 omitidos; UI conserva una sesión parcial tras recarga |
| 7. Cambiar resistencia | Unidad conserva configuración distinta en cada serie, sin mutar el registro anterior; UI confirma e invalida configuración tras cambio de inventario |
| 8. Video no disponible | Todas las fichas tienen estado sin demostración, instrucciones conservadas y fuente. No se simula un reproductor ni una URL de video |
| 9. Sin conexión | PWA precargada, recarga offline y apertura de ficha comprobadas en ambos proyectos |
| 10. Exportar, borrar, restaurar | Round trip de IndexedDB en unidad y flujo de descarga/importación/borrado UI en ambos proyectos |
| 11. Dos máquinas | Persistencia de inventarios y selección independientes; configuración incompatible cruzada |
| 12. Ambos lados | Tiempo de series, lados, descansos y transición comprobado; cursor de sesión conserva lado y serie |
| 13. Datos físicos faltantes | Devuelve null; ninguna equivalencia de kg inventada |
| 14. Móvil, tableta, escritorio | Flujos en desktop y iPhone; sin overflow a 375×812, 768×1024 y 1024×768; controles principales accesibles |
| 15. Subdirectorio Pages/PWA | Base `/reformer/`, hash routes, build y precarga comprobados. Verificación pública adicional al concluir el despliegue |

Otras coberturas: objetivos distintos, negaciones, límite de nivel, accesorios, músculos secundarios, preparación específica, restricciones conservadoras, sustitución aislada, reloj en segundo plano/pausa, doble registro, descanso real, imports inválidos, fechas inválidas, IDs duplicados y protección de CSV ante fórmulas.

## Accesibilidad y revisión visual

axe-core no detectó infracciones WCAG 2 A/AA y 2.1 AA en el creador en claro/oscuro, tanto desktop como móvil. Se comprobó movimiento reducido. Se revisaron capturas completas de escritorio y móvil. Los dialogs nativos permiten Escape y devolución de foco. Esto no constituye una certificación completa de accesibilidad ni sustituye una revisión manual con VoiceOver.

## Dependencias

`npm audit --omit=dev`: cero avisos en dependencias de producción. La auditoría completa conserva cuatro avisos bajos de la cadena de compilación Workbox → node-resolve → deepmerge. El registro consultado ofrece deepmerge 4.3.1 como última versión; la corrección propuesta por npm degrada el plugin PWA a una versión antigua e incompatible. No se aplicó ese cambio. No hay avisos moderados/altos/críticos tras actualizar glob/minimatch transitivos.

## Límites de validación

No se practicaron ejercicios en una máquina real ni se simula revisión profesional. No hay pruebas de OAuth, videos, sincronización o calendario porque esas capacidades no están implementadas. Las pruebas de navegador no certifican avisos por voz con pantalla bloqueada o instalación PWA en todas las plataformas.
