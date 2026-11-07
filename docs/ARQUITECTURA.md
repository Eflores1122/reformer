# Arquitectura y datos

React + TypeScript estricto + Vite. Dexie encapsula IndexedDB; Zod valida respaldos; Workbox precarga la PWA. No existe backend ni llamada a IA. Las fuentes tipográficas se empaquetan localmente.

```text
src/data/catalog.ts        ejercicios, fabricantes, fuentes, preset por modelo
src/domain/schema.ts       entidades y validación externa
src/domain/springs.ts      inventario, compatibilidad, diferencias, tensión opcional
src/domain/engine.ts       interpretación, selección, preparación, orden y duración
src/domain/session.ts      reloj y registro de ejecución
src/domain/storage.ts      IndexedDB, respaldos y exportación
src/components/            pantallas y controles accesibles
src/App.tsx                navegación y coordinación de estado
```

## Diccionario de entidades

| Entidad | Identidad y relaciones | Contenido |
| --- | --- | --- |
| Profile | Un perfil local por navegador | Alias opcional, experiencia, objetivo, días, tiempo, prioridades, exclusiones y modificaciones |
| Source | Clave estable en catálogo | Título, URL, fecha consultada; no incluye archivos de terceros |
| Machine | UUID y revisión UUID | Fabricante/modelo concretos, inventario, accesorios, ajustes técnicos, fuente y verificación del usuario |
| Spring | ID específico dentro del equipo | Nombre, color con etiqueta, cantidad y nivel cualitativo; constantes físicas opcionales nulas |
| Configuration | machineId + machineRevision | Conteos por springId, barra de pies, cabecera, anclaje, notas, procedencia y confirmación |
| Exercise | ID estable | ES/EN, nivel, músculos principales/secundarios, posición, material, técnica, precauciones y fuente |
| Routine | UUID y referencia al equipo | Solicitud, grupos, duración pedida y lista ordenada de items; es un borrador programado |
| RoutineItem | UUID y exerciseId | Fase, series, repeticiones, tiempo de serie, lados, descanso, transición, configuración y notas |
| Session | UUID y snapshot de Routine | Máquina, snapshot del inventario, tiempos, estado, cursor, registros, omisiones y diario |
| SetLog | UUID + itemId/serie/lado | Valores previstos y reales, RPE, técnica, notas, descanso real y configuración realmente utilizada |
| AppState | schemaVersion=1 | Perfil, máquinas, selección, borrador, sesiones, sesión abierta y favoritos |

Las estadísticas se derivan de Session/SetLog. No hay métricas simuladas ni datos de demostración presentados como actividad del usuario.

## Generación

1. Normaliza tildes e interpreta minutos, nivel, grupos, intensidad, peticiones suaves y negaciones.
2. Limita el nivel al perfil. Excluye material ausente y grupos evitados, incluidos secundarios. Las modificaciones registradas y solicitudes médicas excluyen automáticamente el Reformer.
3. Selecciona movimientos principales para cada foco y completa por relevancia. El esfuerzo reciente reduce su prioridad; no se considera un diagnóstico de recuperación.
4. Añade preparación específica de tren superior/inferior y cierre. Agrupa posiciones; la preferencia de menos cambios agrupa configuraciones confirmadas dentro de esas posiciones.
5. Ajusta series dentro de límites explícitos y calcula tiempo con ambos lados, descansos y transiciones. Si el catálogo es insuficiente, muestra la duración real y una advertencia.
6. Cada ajuste físico específico debe estar confirmado para la máquina seleccionada. No se inventa al generar.

Duración por item: `segundos × series × lados + descanso × (series × lados − 1) + transición`. La estimación es de planificación; los registros conservan el tiempo realmente transcurrido.

## Resortes

Inventario documentado no significa prescripción documentada. El preset Allegro 2 contiene únicamente el inventario estándar publicado por Balanced Body. Otros modelos se registran manualmente, sin equivalencias automáticas. La validación exige existencia de la máquina, inventario confirmado, revisión vigente, resortes disponibles, al menos un resorte y barra/cabecera/anclaje explícitos.

La función de tensión devuelve `null` si falta un dato físico. Solo con datos suficientes usa `Σ cantidad × (tensión inicial + constante × elongación)`, en newtons. No se expone como fuerza efectiva sobre la persona ni como kg de mancuerna. No se utiliza en prescripciones de esta versión.

## Persistencia, tiempo y respaldo

IndexedDB `reformer-local`, tabla `snapshots`, esquema Dexie 1. Los cambios se encolan al realizar una acción, antes del efecto de render, para evitar carreras al recargar. La UI expone estado de conservación. Una falla de lectura no sobrescribe el estado anterior; permite uso temporal y exportación. Una falla de escritura se informa con un aviso visible.

El reloj usa tiempo acumulado + diferencia entre `Date.now()` y la marca de reanudación, no conteo de intervalos. El intervalo solo repinta. Recargar o cambiar de pantalla no reinicia la sesión. Pausar excluye el tiempo detenido. Terminar conserva las series reales y el cursor para continuar.

La importación valida versión, forma, límites, ejercicios conocidos, IDs únicos y relaciones serie/item. Se valida todo antes de sustituir datos. Un respaldo restaura la sesión abierta pausada. Una rutina importada conserva referencias para revisión, sin crear configuraciones compatibles artificialmente. Añadir una versión futura requiere `db.version(n).upgrade(...)` y migración del formato de respaldo.

## Extensión futura

Una capa Repository puede reemplazar o complementar el snapshot Dexie con repositorios por entidad y sincronización opcional. Autenticación requiere proveedor real configurado, políticas por usuario, pruebas de aislamiento y conservación del borrador durante el flujo. Nunca guardar un secreto en Vite ni en el repositorio.
