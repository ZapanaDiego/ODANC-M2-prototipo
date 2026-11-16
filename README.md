# ODANC Arequipa — Prototipo de diseño

Prototipo web, offline y sin dependencias de ejecución para el **Sistema de Apoyo Procesal de la ODANC Arequipa**. Esta carpeta es el laboratorio de diseño; la aplicación de escritorio (.NET + Photino) vive en el repositorio `ODANC_Proyect`.

## Estado actual

Versión de trabajo: **v0.6.0-prototipo**.

El Módulo 2 se reorganizó en cuatro pasos: Documento → Expediente → Contenido → Revisión. Incluye un catálogo de ocho propuestas, ejemplos ficticios, notificaciones variables por destinatario, revisión de campos y cronología y guardado local. Los formatos y la asignación a unidades siguen sujetos a validación.

La v0.5 está orientada a convertir el prototipo en una biblioteca documental local:

- **Módulo 1:** cálculo de días hábiles, feriados y fecha de trabajo.
- **Módulo 2:** autogenerador documental.
- **Mis Documentos:** biblioteca de borradores con guardado, reapertura, duplicado, eliminación, búsqueda y filtros.
- **Plantillas:** catálogo de formatos y estados (siguiente iteración).

Las iteraciones 0, 1 y el MVP de la 2 ya están aplicadas. Las iteraciones siguientes se describen en el plan de trabajo acordado.

## Cómo abrir

No requiere servidor ni instalación:

1. Abrir `index.html` en un navegador moderno.
2. Para ver el panel de pruebas del motor: `index.html?debug=1`.

La app funciona desde `file://`. Si en el futuro se introducen módulos ES, será necesario abrirla con un servidor local.

## Módulos

### Módulo 1

- Cálculo desde el día hábil siguiente a la notificación.
- Feriados oficiales y contingencias.
- Notificación por casilla electrónica: dos días hábiles previos.
- Carga de feriados base por año.
- Proyección de feriados pasados.
- Fecha de trabajo manual.
- Persistencia en `localStorage`.

El reloj de trabajo no interviene en la aritmética del plazo: solo se usa para proyecciones y valores por defecto.

### Módulo 2

- Catálogo: Consentida, Informe de Calificación, Improcedencia/Rechazo, Concesorio, Decreto, Auto, Inicio de PAD y Fondo/Abstención.
- Formularios de demostración con datos específicos y texto editable.
- Filtro por área de trabajo.
- Consentida: modelo base de Juez de Paz y propuestas por unidad. Notificaciones de cantidad variable, medio, constancia y vencimiento.
- Informe de Calificación: Calificación.
- Vista previa viva.
- Exportación a Word (`.doc` HTML) e impresión/PDF.
- Catálogo de formatos con estados: Base, Propuesta, Estructura y Pendiente.
- **Mis Documentos:** guardado de borradores, reapertura, autoguardado, duplicado, eliminación, búsqueda y filtros.
- Cada documento guarda una copia del cálculo utilizado; si el cálculo del Módulo 1 cambia, el documento conserva su snapshot.
- “Usar cálculo del Módulo 1” copia explícitamente notificación y vencimiento a la persona seleccionada y conserva su cálculo como referencia. El vencimiento también puede registrarse manualmente; el prototipo no certifica su regla jurídica.

## Estados documentales

| Estado | Significado |
|---|---|
| Base proporcionada | Documento entregado por la ODANC, sin cambios |
| Propuesta por validar | Estructura completa, pendiente de revisión |
| Estructura por validar | Variante genérica sin formato oficial |
| Pendiente | Documento aún no generado |

## Datos y privacidad

- No usar datos reales en este prototipo.
- Los documentos generados llevan la marca **BORRADOR** y no tienen validez oficial.
- La firma electrónica no está implementada; el texto de firma es una representación visual.
- El Módulo 1 guarda calendario, reloj y último cálculo en `localStorage`.
- “Mis Documentos” usa IndexedDB con respaldo en memoria. Si IndexedDB no está disponible, los borradores viven solo durante la sesión.
- Los borradores se guardan en el navegador; no se envían a ningún servidor.

## Archivos principales

| Archivo | Contenido |
|---|---|
| `index.html` | Estructura de la aplicación |
| `css/styles.css` | Diseño y responsive |
| `js/app.js` | Lógica de los dos módulos |
| `js/modulo2-panel.js` | Catálogo de ocho tipos y sus campos específicos |
| `js/plantillas.js` | Catálogo y textos de plantillas |
| `js/storage/document-store.js` | Almacenamiento local de documentos en IndexedDB |
| `prototipos/generar-prototipos.py` | Generador del paquete documental v0.4.1 |
| `entregas/` | Paquetes históricos |

## Pruebas

- Abrir `index.html?debug=1` para ejecutar los casos del motor de cálculo.
- Los casos cubren días hábiles, casilla electrónica, feriados, contingencias, cruce de año y límites.
- Probar el flujo de “Mis Documentos”: Guardar → recargar → abrir → editar → autoguardar → duplicar → eliminar.
- Antes de empaquetar una versión, revisar también la exportación Word/PDF en un equipo con Word real.

## Documento base

`Consentidas Juez de Paz 1 (1)-1.docx` y su PDF son el documento proporcionado por la ODANC. Se conservan sin modificaciones y se usan como referencia de la plantilla Consentida.

## Alcance pendiente de la v0.5

1. Validación institucional de formatos y de su asignación por unidad.
2. Plantillas data-driven y versionado.
3. Validaciones legales y de orden cronológico.
4. Accesibilidad y pruebas de exportación.
5. Copia de seguridad/importación de documentos.
6. Cierre y paquete v0.5.0.

## Comprobación del nuevo panel

`pruebas/modulo2.cjs` recorre el prototipo en un Chromium local con depuración en el puerto 9223. Usa un perfil de pruebas, datos ficticios y una pestaña nueva. Comprueba notificaciones, guardado/reapertura, cronología, duplicado, ocho ejemplos y descargas, y ancho móvil. Las capturas y descargas de prueba se guardan en `pruebas/`.

Las salidas Word son HTML con extensión `.doc`; aún requieren comprobación en Word real. PDF usa la impresión del navegador. No hay envío, aprobación ni firma dentro del prototipo. La meta de tres minutos sigue pendiente de medición.
