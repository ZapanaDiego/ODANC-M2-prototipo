# Investigación documental: resolución consentida de Juez de Paz

**Proyecto:** Sistema de Apoyo Procesal ODANC Arequipa  
**Documento base revisado:** `Consentidas Juez de Paz 1 (1)-1.docx` y PDF adjunto  
**Fecha de investigación:** 4 de noviembre de 2026  
**Estado:** análisis inicial del formato y del prototipo; requiere validación jurídica y operativa de la ODANC antes de automatizar emisión final.

## 1. Propósito del documento

El documento registra que una resolución anterior quedó consentida porque, luego de su notificación, transcurrió el plazo para impugnar sin que se presentara recurso. El documento de muestra declara consentida la Resolución 8, emitida el 30 de junio de 2026, a través de una Resolución 9 fechada el 25 de agosto de 2026.

La generación del texto puede automatizarse parcialmente. La constatación del vencimiento, la ausencia de recursos, la regularidad de las notificaciones y la competencia/firma son verificaciones del expediente y no deben inferirse solo de los campos introducidos.

## 2. Estructura observada en el documento fuente

1. **Membrete:** Corte Superior de Justicia de Arequipa, ODANC, Jefatura.
2. **Identificación:** queja, investigación, quejado y origen.
3. **Identificación del acto:** número de la nueva resolución y lugar/fecha.
4. **Vistos y considerando:**
   - fecha y número de la resolución que se busca consentir;
   - resumen del contenido decisorio;
   - relación de notificaciones a las partes, fechas y fojas de sustento;
   - afirmación de que no se interpuso recurso y referencia al plazo legal.
5. **Parte resolutiva:** declaración de consentimiento, identificación del acto y resumen del extremo decidido; cierre de registro y comunicación.
6. **Firma:** indicación de firma electrónica, nombre, cargo y corte.

El PDF fuente tiene una segunda página que solo repite el membrete, aparentemente una página sobrante o un problema de exportación. La primera página contiene el texto completo.

## 3. Datos que aparecen en el caso de muestra

| Dato | Valor de muestra | Tratamiento para automatización |
|---|---|---|
| Queja | 01442-2025 | Identificador, preservar ceros iniciales y formato institucional |
| Investigación | Vacío | Confirmar si aplica y cuándo se exige |
| Quejado | Vacío | Confirmar si aplica; evaluar dato personal y fuente |
| Origen | Segundo Juzgado de Paz de Paucarpata | Texto variable; catálogo/autocompletado podría reducir errores |
| Resolución nueva | 9 | Número del documento que se está generando |
| Resolución materia de consentimiento | 8 | Número y fecha deben corresponder al expediente fuente |
| Fecha de resolución materia | 30/06/2026 | Generar versión en letras y conservar fecha numérica para validación |
| Notificaciones | 01/07/2026 y 27/07/2026 | Una fila por destinatario, no asumir que siempre son exactamente dos |
| Fojas de notificación | 113 y 114 | Asociar cada constancia a destinatario, tipo y fecha de notificación |
| Fecha de la nueva resolución | 25/08/2026 | Fecha separada de la fecha del acto que queda consentido |
| Contenido decisorio | Prescripción/no mérito | Resumen editable, sujeto a control humano y al texto resolutivo fuente |
| Iniciales/firma/cargo | MMDRD / Jefe de ODANC – PJ | Datos institucionales configurables y versionados, no valores fijos en el código |

## 4. Lógica actual del prototipo

La función `construirContenidoConsentida()` de `js/app.js` genera un texto fijo de tres considerandos y una parte resolutiva. Convierte el número y las fechas a letras. El segundo considerando concatena dos notificaciones y dos fojas; el tercero afirma que no hubo recurso y menciona el artículo 35 numeral 2 de la R.A. 297-2015-CE-PJ.

La validación actual exige que existan queja, origen, números/fechas, ambas notificaciones y fojas, fecha de la resolución que se genera, firmante, cargo, iniciales y textos de considerando/parte resolutiva. No se observa una regla que compruebe:

- que la fecha/constancia de notificación sea válida para cada parte;
- que el plazo aplicable haya empezado y terminado correctamente;
- que la fecha de emisión sea posterior al vencimiento;
- que haya transcurrido el plazo respecto de todas las partes notificadas;
- que el expediente confirme la inexistencia de recursos;
- que haya una incidencia que suspenda, altere o impida declarar el consentimiento;
- que la norma o el plazo ingresado correspondan a la etapa y tipo de decisión.

Por tanto, el prototipo sirve como maqueta de composición, pero no como decisión automatizada de consentimiento. La etiqueta “Base proporcionada” describe la procedencia del formato, no acredita que las reglas de cálculo o los datos estén jurídicamente validados.

## 5. Hallazgos y riesgos de diseño

### Hallazgos

- La muestra usa plural “partes procesales” y dos notificaciones, pero el formulario parece modelar exactamente dos registros. Se necesita una colección de notificaciones de tamaño variable.
- Cada notificación debe ligarse a una persona/parte y a su constancia, no solo a una fecha y foja. La secuencia actual puede producir una afirmación genérica difícil de auditar.
- La fecha “consentida” no es una fecha que deba copiarse sin más desde Módulo 1. Debe derivarse del plazo aplicable luego de verificar notificaciones y calendario; el resumen del prototipo indica que hoy no se usa cálculo automático para la fecha consentida.
- La frase “notificada correctamente” es una conclusión que requiere revisar las constancias y el tipo de notificación; no debe insertarse automáticamente si no existe esa revisión.
- El resumen de la decisión en considerandos y resolutivo se introduce manualmente. Conviene traer/importar el texto de la resolución previa y exigir cotejo, para evitar que la resolución de consentimiento altere su sentido.
- Números en letras, meses, puntuación, siglas, denominación del órgano y tratamiento de ceros/formato requieren pruebas editoriales. El formulario debe poder mostrar juntos el valor original y su representación generada.
- La firma mostrada por el prototipo es una representación textual; el README aclara que no implementa firma electrónica real.

### Controles recomendados antes de permitir exportación

1. **Expediente completo:** identificar a todas las partes destinatarias y cargar una constancia verificable para cada una.
2. **Control cronológico:** fecha de emisión de la resolución previa ≤ fecha(s) de notificación ≤ vencimiento(s) calculado(s) < fecha de la nueva resolución.
3. **Regla normativa versionada:** el plazo, unidad de cómputo, inicio del cómputo, días no laborables y eventos excepcionales deben estar asociados a la norma/versión validada.
4. **Control de recursos:** campo obligatorio de verificación manual con fecha, fuente/registro consultado y responsable; bloquear el borrador final si hay recurso pendiente o hallazgo no resuelto.
5. **Resultado explicable:** conservar fechas originales, reglas usadas, feriados y resultado por destinatario para que el cálculo pueda revisarse.
6. **Revisión humana:** marcar el resultado como borrador hasta revisión del expediente y aprobación/firma de autoridad competente.
7. **Trazabilidad:** registrar quién completó/verificó cada dato y cuándo; conservar la versión de plantilla y norma usada.

## 6. Verificación normativa: estado y cuestiones abiertas

La fuente institucional del Poder Judicial identifica la R.A. 297-2015-CE-PJ como aprobación del **Reglamento del Régimen Disciplinario del Juez de Paz**, de fecha 23/09/2015. El portal de ONAJUP mantiene ese reglamento entre los reglamentos de Justicia de Paz.

La disposición séptima del Reglamento de la ANC-PJ aprobado en 2023 señala expresamente que el régimen disciplinario de Jueces de Paz se rige por la Ley 29824, su Reglamento (D.S. 007-2013-JUS) y la R.A. 297-2015-CE-PJ, considerando la nueva estructura de los órganos de control. Esto confirma que no corresponde aplicar sin análisis el reglamento general ANC a esta plantilla.

**No se da por validado aún el plazo de 15 días hábiles ni la cita “artículo 35 numeral 2”.** El PDF de la R.A. 297-2015-CE-PJ enlazado por el portal oficial es voluminoso y no se pudo extraer/contrastar aquí el texto completo del numeral. Antes de fijar reglas de cálculo, Asesoría/Unidad competente debe confirmar por escrito: (a) texto y alcance exactos de la disposición que sustenta el consentimiento; (b) plazo y forma de cómputo; (c) cómputo por cada notificación y destinatario; (d) efecto de días inhábiles, notificación electrónica y término de distancia, si corresponde; (e) recurso procedente y autoridad que verifica su inexistencia; (f) competencia y fórmula de firma actuales.

## 7. Propuesta de flujo funcional

1. Seleccionar “Resolución consentida – Juez de Paz” y la variante/unidad competente.
2. Identificar el expediente y la resolución que se pretende declarar consentida.
3. Registrar partes destinatarias y para cada una: fecha/tipo de notificación, constancia, foja/documento y observaciones.
4. Seleccionar la regla normativa aprobada que aplica; el sistema calcula el vencimiento individual y presenta el detalle del cómputo.
5. Registrar la comprobación de recursos por el personal responsable. Si hay recurso, fecha dudosa, destinatario sin notificar o dato faltante, bloquear la salida de resolución consentida y mostrar la causa.
6. Generar borrador con campos y fundamentos ligados a los datos verificados, junto con resumen de validación no incorporado al documento oficial.
7. Revisión y aprobación humanas; exportación/firma conforme al procedimiento vigente.

## 8. Decisiones que debe tomar el área usuaria

- Confirmar si “Consentida” corresponde únicamente a la Jefatura/Unidad para Jueces de Paz o si hay variantes por unidad o resultado de la resolución previa.
- Definir el catálogo de tipos de decisión anterior (prescripción, no mérito, archivo u otros) y qué resumen puede producirse sin afectar el sentido de la decisión.
- Confirmar los campos obligatorios/opcionales y la cantidad variable de partes y notificaciones.
- Validar el texto estándar, la norma vigente, el plazo y la regla de cómputo.
- Confirmar el circuito de elaboración, revisión, aprobación, firma y notificación, así como nombres/cargos institucionales configurables.

## 9. Fuentes revisadas

- Documento base local: `Consentidas Juez de Paz 1 (1)-1.docx` y `Consentidas Juez de Paz 1 (1)-1.pdf`.
- Prototipo: `js/app.js`, especialmente `leerConsentida()`, `construirContenidoConsentida()` y `validarConsentida()`; ficha histórica `entregas/prototipos-v0.4.1/Fichas/Ficha-Validacion-Consentida-Jefatura.doc`.
- [Poder Judicial: Resolución Administrativa N.° 297-2015-CE-PJ](https://www.pj.gob.pe/wps/wcm/connect/CorteSuprema/s_cortes_suprema_home/as_poder_judicial/as_corte_suprema/as_consejo_ejecutivo/as_directiva_reglamentos/as_2015/), listado oficial, documento del 23/09/2015.
- [ONAJUP: reglamentos de Justicia de Paz](https://www.pj.gob.pe/wps/wcm/connect/onajup/s_onajup/as_normas/as_justicia_paz/as_documentos/as_reglamentos), incluye el Reglamento del Régimen Disciplinario del Juez de Paz.
- [El Peruano / ANC-PJ: Reglamento del Procedimiento Administrativo Disciplinario de la ANC-PJ (2023)](https://anc.pj.gob.pe/contenido/boletin/2023/gaceta_18042024115911.pdf), revisar especialmente disposición séptima sobre competencia/régimen de Jueces de Paz.

---

**Conclusión provisional:** se puede avanzar en una plantilla de borrador, pero no debe automatizarse la conclusión legal de consentimiento hasta resolver las cuestiones normativas y de expediente del apartado 6. El primer paso de validación funcional debería ser una revisión del formato con el área usuaria usando el caso de muestra, acompañada de confirmación jurídica escrita del plazo y del artículo aplicable.
