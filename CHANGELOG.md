# Cambios

## v0.6.0-prototipo — 2026-11-04

- Módulo 2 guiado en cuatro pasos, conservando la identidad visual.
- Catálogo de ocho tipos, selección por área, galería de plantillas y ejemplos explícitos.
- Consentida con personas notificadas variables, medios, constancias, vencimientos y revisión de recursos.
- Copia explícita del cálculo a cada destinatario y controles cronológicos del borrador.
- Campos propios para las otras seis propuestas, vista previa y descarga editable.
- Persistencia de tipo y datos específicos; reapertura compatible con borradores anteriores.
- Mensajes de revisión que llevan al campo pendiente; firma indicada como pendiente.
- Pruebas de navegación, persistencia, descarga y móvil.


## v0.5.0-alpha2 — 2026-11-03

Iteración 2 (MVP): “Mis Documentos”.

### Biblioteca

- Nueva vista **Mis Documentos** con listado de borradores.
- Guardado manual y autoguardado de documentos existentes.
- Reapertura de documentos con restauración de todos los campos del formulario.
- Duplicado y eliminación con confirmación.
- Búsqueda por título, grupo o unidad; filtros por grupo y estado.
- Estado vacío y estado sin resultados.
- Cada documento guarda una copia del cálculo utilizado y de la versión de plantilla.
- Si el cálculo del Módulo 1 cambia, el documento conserva su cálculo guardado.
- La fecha del Módulo 1 se aplica de forma explícita a Notificación 1 o Notificación 2.
- “Limpiar” conserva firmante, cargo e iniciales y prepara un documento nuevo.

### Ajustes

- La biblioteca oculta la vista previa y usa una sola columna.
- Se agregaron estados de almacenamiento y avisos de respaldo en memoria.
- Se actualizó la versión visible a `v0.5.0-alpha2`.

## v0.5.0-alpha1 — 2026-11-03

Iteración 1: almacenamiento local.

- Nuevo módulo `js/storage/document-store.js`.
- Persistencia en IndexedDB con respaldo en memoria.
- CRUD de documentos, listado ordenado y exportación de respaldo.
- Esquema inicial de documento: grupo, unidad, plantilla, estado, datos, cálculo, fechas y versión.

## v0.5.0-alpha0 — 2026-11-03

Iteración 0: base limpia antes de “Mis Documentos” y “Plantillas”.

### Correcciones

- Se eliminó la sobrescritura automática de **Notificación 2** con la fecha del Módulo 1.
- Se agregó el control explícito **“Aplicar fecha del Módulo 1”** para copiar la fecha de notificación a Notificación 1 o Notificación 2.
- Si el cálculo se invalida, la fecha aplicada se limpia y el vínculo se restablece.
- Se alinearon los estados documentales con la matriz: Base, Propuesta, Estructura y Pendiente.
- La Resolución General para Prevención, Sanción y Apelación ahora se muestra como **Estructura por validar**, no como propuesta aprobada.
- La validación de formularios ahora respeta los atributos `min` y `max` de los campos numéricos y de fecha.
- Se corrigió la numeración de secciones: General e Informe ya no saltan de 3 a 5.
- El campo **Investigación** ahora se muestra en General e Informe cuando tiene valor.
- Se agregó `aria-invalid` a los campos marcados como inválidos.
- Se eliminaron funciones muertas de la etapa “solo consentida”.

### Versión

- `index.html`, `css/styles.css`, `js/app.js` y `js/plantillas.js` pasan a `v0.5.0-alpha0`.

## v0.4.2 — 2026-11-02

- Mejora de párrafos en los documentos General e Informe.
- La Resolución General muestra Notificación y Vencimiento en la tabla inicial.
- El Informe muestra la fecha en la tabla inicial.
- Se agregaron secciones I/II/III al General.
- Se actualizaron los textos de muestra de General.

## v0.4.1 — 2026-11-02

- Paquete documental de validación: Resolución General Calificación, Informe Calificación, Consentida Jefatura.
- Fichas de validación, matriz CSV, LEEME y ZIP.

## v0.4.0 — 2026-11-02

- Integración del Módulo 2: catálogo, plantillas, vista previa y exportación.

## v0.3.0 — 2026-11-02

- Recursos institucionales e iconografía.

## v0.2.x — 2026-11-01

- Módulo 1 funcional, feriados, reloj manual y persistencia.

## v0.1 — 2026-11-01

- Primera maqueta visual completa.
