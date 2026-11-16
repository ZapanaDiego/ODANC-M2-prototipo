from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from docx import Document
from docx.shared import Inches,Pt,RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT=Path(__file__).resolve().parent; CAP=ROOT/'capturas'
OUT=ROOT/'ODANC_Arequipa_Presentacion_Modulo_2_Revision.docx'
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

def mark(src,name,box,targets):
 im=Image.open(CAP/src).convert('RGB'); im=im.crop(box) if box else im
 w,h=im.size; pad=74; out=Image.new('RGB',(w+pad,h),'white');out.paste(im,(pad,0))
 dr=ImageDraw.Draw(out);font=ImageFont.truetype(FONT,22)
 for n,(x,y) in enumerate(targets,1):
  cx,cy=33,y; tx=x+pad
  dr.line((cx+20,cy,tx-13,cy),fill='#1849ad',width=3)
  dr.polygon([(tx,cy),(tx-14,cy-7),(tx-14,cy+7)],fill='#1849ad')
  dr.ellipse((cx-20,cy-20,cx+20,cy+20),fill='#1849ad')
  bb=dr.textbbox((0,0),str(n),font=font);dr.text((cx-(bb[2]-bb[0])/2,cy-(bb[3]-bb[1])/2-4),str(n),font=font,fill='white')
 p=CAP/name;out.save(p);return p

F={
 'nav':mark('11-pantalla-completa-modulo2.png','rev-01-navegacion.png',(0,0,1440,390),[(57,70),(74,209),(74,270),(470,110),(780,110),(1125,110)]),
 'doc':mark('12-documento-completo.png','rev-02-documento.png',(340,140,1270,1737),[(250,280),(250,360),(250,560),(855,1530)]),
 'templates':mark('13-plantillas-completa.png','rev-03-plantillas.png',(200,75,1415,720),[(440,110),(350,270),(990,280),(600,540)]),
 'exp':mark('14-expediente-completa.png','rev-04-expediente.png',(195,75,920,705),[(390,195),(300,355),(300,465),(625,580)]),
 'content':mark('15-contenido-completa.png','rev-05-contenido.png',(200,135,875,1170),[(290,270),(290,370),(560,490),(300,660),(300,830),(500,1010)]),
 'review':mark('16-revision-completa.png','rev-06-revision.png',(200,75,1420,1110),[(355,250),(310,550),(310,760),(1020,420),(1050,960)]),
 'library':mark('17-mis-documentos-completa.png','rev-07-mis-documentos.png',(200,75,1415,380),[(380,105),(1000,107),(450,180),(1140,255)]),
}

d=Document(); sec=d.sections[0];sec.page_width=Inches(8.5);sec.page_height=Inches(11);sec.top_margin=Inches(.72);sec.bottom_margin=Inches(.7);sec.left_margin=Inches(.9);sec.right_margin=Inches(.9)
normal=d.styles['Normal'];normal.font.name='Arial Narrow';normal.font.size=Pt(11.5);normal.paragraph_format.space_after=Pt(5)
for key,size in [('Title',19),('Heading 1',14.5),('Heading 2',12.5)]:
 s=d.styles[key];s.font.name='Arial Narrow';s.font.size=Pt(size);s.font.bold=True;s.font.color.rgb=RGBColor(0,0,0);s.paragraph_format.space_before=Pt(9);s.paragraph_format.space_after=Pt(5);s.paragraph_format.keep_with_next=True
def p(t='',style=None):return d.add_paragraph(t,style)
def h(t,level=1):return p(t,f'Heading {level}')
def page():d.add_page_break()
def pic(path,width=6.55):
 im=Image.open(path);w=min(width,7.8*im.width/im.height)
 q=d.add_paragraph();q.alignment=WD_ALIGN_PARAGRAPH.CENTER;q.add_run().add_picture(str(path),width=Inches(w))
def fig(key,caption,width=6.55):
 pic(F[key],width);q=p('Figura '+caption);q.alignment=WD_ALIGN_PARAGRAPH.CENTER
 for r in q.runs:r.italic=True;r.font.size=Pt(9)
def points(items):
 for i,t in enumerate(items,1):
  q=d.add_paragraph();q.add_run(f'{i}. ').bold=True;q.add_run(t)
def tab(rows):
 t=d.add_table(rows=0,cols=len(rows[0]));t.style='Table Grid';t.alignment=WD_TABLE_ALIGNMENT.CENTER
 for k,row in enumerate(rows):
  cells=t.add_row().cells
  for j,v in enumerate(row):
   cells[j].text=v
   for pp in cells[j].paragraphs:
    for rr in pp.runs:rr.font.name='Arial Narrow';rr.font.size=Pt(10);rr.bold=k==0
   if k==0:
    sh=OxmlElement('w:shd');sh.set(qn('w:fill'),'E8E8E8');cells[j]._tc.get_or_add_tcPr().append(sh)
footer=sec.footer.paragraphs[0];footer.alignment=WD_ALIGN_PARAGRAPH.CENTER;footer.add_run('ODANC Arequipa · Propuesta de trabajo para revisión').font.size=Pt(9)

q=p();q.alignment=1;q.add_run('AUTORIDAD NACIONAL DE CONTROL DEL PODER JUDICIAL\nODANC AREQUIPA').bold=True
pic(ROOT.parent/'assets/logo-anc.jpg',1.1)
q=d.add_paragraph();q.alignment=1;r=q.add_run('Presentación de la propuesta del Módulo 2');r.bold=True;r.font.name='Arial Narrow';r.font.size=Pt(19)
q=p('Recorrido visual, funciones y puntos que requieren conformidad');q.alignment=1
h('1. Propósito de esta revisión')
p('Se presenta el recorrido actual del prototipo para preparar borradores documentales. El objetivo de esta revisión es confirmar con las áreas qué documentos se necesitan, qué información debe solicitar cada formato y qué texto puede reutilizarse. Las pantallas, campos y borradores mostrados son ejemplos de trabajo sujetos a modificación.')
p('El Módulo 1 tendrá un ajuste de apariencia. Su función de cómputo de plazos se mantiene y puede aportar fechas al Módulo 2. Este documento se concentra en el Módulo 2, porque sus formatos y reglas requieren revisión detallada de las unidades.')
tab([['Qué se solicita decidir','Resultado esperado'],['Áreas y documentos','Confirmar qué unidad prepara cada tipo de documento.'],['Formatos y campos','Identificar los modelos vigentes y la información obligatoria.'],['Textos y control','Definir variantes, revisión del expediente y responsables.']])

page();h('2. Vista completa del sistema')
pic(CAP/'11-pantalla-completa-modulo2.png',6.65)
p('Figura 1. Pantalla completa del prototipo: logotipo, navegación lateral y Módulo 2.').alignment=1
p('La barra lateral permite pasar del cómputo de plazos al trabajo documental. En el área principal aparecen Nuevo Documento, Mis Documentos y Plantillas. La fecha de trabajo figura en la parte superior. La imagen muestra la pantalla tal como se presenta al abrir el Módulo 2.')
page();h('2.1 Módulo 1',2)
pic(CAP/'10-pantalla-completa-modulo1.png',6.65)
p('Figura 2. Pantalla completa del Módulo 1. Su presentación visual recibirá un ajuste.').alignment=1
p('El Módulo 1 conserva el cálculo de días hábiles y la revisión de fechas. No se replantea aquí cada control: su funcionamiento ya fue explicado en la presentación anterior. La fecha calculada podrá incorporarse al borrador, vinculándola con la persona notificada que corresponda.')

page();h('3. Navegación del Módulo 2')
fig('nav','3. Accesos principales de la pantalla.',6.65)
points(['Identidad institucional: logotipo de la ANC y referencia a la ODANC Arequipa.','Módulo 1: abre el cómputo de plazos.','Módulo 2: abre el autogenerador documental.','Nuevo Documento: inicia o retoma el formulario del borrador.','Mis Documentos: muestra los borradores guardados en este equipo.','Plantillas: presenta el catálogo de tipos y su estado de validación.'])
p('Estos tres accesos son distintas vistas del mismo panel. La organización propuesta necesita confirmación: se solicita indicar si las denominaciones y el orden coinciden con la forma de trabajo de las unidades.')

page();h('4. Plantillas y documentos propuestos')
fig('templates','4. Catálogo visual de tipos de documento.',6.55)
points(['Plantillas abre un catálogo para explorar los tipos de actuación.','Consentida señala los dos modelos recibidos hasta ahora: Calificación y Jefatura. Ambos siguen pendientes de validación.','Los demás tipos se muestran como propuestas; sus formatos oficiales están por recibir o validar.','Las tarjetas permiten elegir visualmente el documento y volver al formulario.'])
p('Esta vista no acredita que el catálogo esté completo ni que cada tipo corresponda a todas las áreas. Se solicita confirmar nombres, alcance y unidad responsable. La incorporación de modelos oficiales se definirá con las áreas después de estudiar sus documentos autorizados.')

page();h('5. Nuevo Documento: elección inicial')
fig('doc','5. Selección de área, documento y formato, con avance manual.',4.0)
points(['Área: acota los documentos que se pueden elegir según la unidad seleccionada.','Formato: muestra el modelo disponible para la combinación elegida o indica que falta recibirlo.','Documento: las tarjetas permiten elegir el tipo de actuación y ver su descripción.','Continuar: lleva al expediente solo cuando la persona pulsa el botón; cambiar la selección no avanza por sí solo.'])
p('La relación entre área, tipo de documento y formato funciona como una selección encadenada. La matriz actual es una propuesta. Debe revisarse con cada unidad para retirar combinaciones improcedentes y añadir las que falten.')
p('El botón «Cargar ejemplo» llena datos ficticios para recorrer las pantallas y examinar la vista previa. «Anterior» permite volver a una etapa sin cambiar automáticamente de documento. Ninguno de esos ejemplos debe tomarse como contenido aprobado.')

page();h('6. Áreas, tipos y formatos por confirmar')
tab([['Elemento de la selección','Qué debe confirmar la ODANC'],['Área','Denominación oficial de cada unidad y sus competencias documentales.'],['Tipo de documento','Qué actuaciones se producen realmente en cada área y qué nombres se usan.'],['Formato','Qué modelo vigente corresponde a cada combinación de área y documento.'],['Variantes','Si hay modelos distintos por supuesto, destinatario, instancia o tipo de expediente.']])
p('La pantalla reúne Calificación e Investigación Preliminar, Prevención, Procedimiento Administrativo Disciplinario, Sanción y Apelación, y Jefatura. La mención de Juez de Paz aparece en el modelo de Consentida recibido para Jefatura. Esta distribución debe ser revisada por las personas responsables: el prototipo no fija competencias ni sustituye el inventario institucional.')
p('Los tipos visibles incluyen Resolución Consentida, Informe de Calificación, Improcedencia o Rechazo Liminar, Concesorio de Apelación, Decreto de Mero Trámite, Auto Interlocutorio, Inicio de PAD y Resolución de Fondo o Abstención. Se solicita indicar cuáles deben separarse, renombrarse, añadirse o retirarse.')
h('6.1 Estado de los modelos disponibles',2)
p('Solo se han usado como referencia dos modelos de Resolución Consentida: uno de Calificación y otro de Jefatura relacionado con Juez de Paz. Su presencia en la pantalla significa “modelo recibido para estudio”, no “formato aprobado”. Para las otras tarjetas se necesita identificar y revisar el formato que corresponda antes de automatizar su contenido.')

page();h('7. Paso Expediente')
fig('exp','6. Datos generales del expediente.',6.2)
points(['La barra de pasos muestra que se está en Expediente y permite ubicar el avance.','EXPEDIENTE identifica el asunto; se debe confirmar su denominación y forma de escritura en cada modelo.','Origen de queja, quejoso y quejado individualizan el caso cuando corresponda.','Resolución N.° identifica el nuevo documento; “Continuar” lleva al contenido.'])
p('Estos campos son una primera propuesta. Algunos documentos pueden requerir personas, cargos u otros datos distintos. Se solicita indicar qué información se imprime en el membrete, cuál se usa solo para elaborar el borrador y qué campos son obligatorios en cada formato.')

page();h('8. Paso Contenido: Consentida')
fig('content','7. Datos y comprobaciones del ejemplo de Consentida.',4.2)
points(['Resolución anterior: número y fecha del acto cuya firmeza se examina.','Fecha de la nueva resolución: corresponde al borrador en preparación.','Personas notificadas: se pueden añadir por separado con participación, fecha, constancia, vencimiento y medio.','Usar cálculo del Módulo 1: traslada el vencimiento a la persona correspondiente; debe comprobarse antes de usarlo.','Revisión de recursos y sustento: registran qué se verificó para decidir si procede declarar la consentida.','Textos legales: permiten incorporar el contenido relevante de la resolución anterior.'])
p('Los apartados Vistos, Considerando y Resuelve varían según el caso. Los párrafos predeterminados solo podrán definirse después de revisar ejemplos autorizados y obtener conformidad del área. El prototipo muestra una redacción ilustrativa, no una conclusión jurídica automática.')

page();h('9. Contenido de otros documentos')
p('El paso Contenido cambia según el tipo elegido. Para el Informe de Calificación, la propuesta pide fecha, antecedentes, análisis, conclusión y recomendación. Para otros documentos aparecen datos del trámite, fecha, considerando y parte resolutiva. Estas casillas son una hipótesis de trabajo y deben cotejarse con el formato oficial de cada unidad.')
tab([['Grupo','Revisión necesaria'],['Informe de Calificación','Estructura vigente, campos obligatorios, criterios y responsables.'],['Rechazo Liminar e Improcedencia','Si son documentos distintos, supuestos de uso, fundamentos y decisiones.'],['Concesorio de Apelación','Requisitos, destinatario, plazos y datos del recurso.'],['Decretos y Autos','Variantes frecuentes, datos mínimos y fórmulas de trámite.'],['Inicio de PAD y Fondo o Abstención','Estructura, partes, motivación, decisiones y firma según la unidad.']])
p('Se propone comenzar por el documento prioritario aprobado por las áreas, contrastar varios casos reales autorizados y recién entonces definir campos y párrafos reutilizables. Cada cambio deberá volver a revisarse con quienes elaboran y firman el documento.')

page();h('10. Paso Revisión')
fig('review','8. Datos de firma, fechas, vista previa y salida del borrador.',5.8)
points(['Firmante, cargo e iniciales: identifican la firma prevista; deben confirmarse por formato y unidad.','Fechas del Módulo 1: muestran notificación, vencimiento y plazo usados como referencia.','Salida del borrador: permite elegir Word o impresión para PDF, además de Guardar y Nuevo.','Vista previa: muestra el texto compuesto antes de descargarlo o conservarlo.','Pantalla completa y accesos Word/PDF: facilitan leer o sacar una copia de revisión.'])
p('La pantalla debe ayudar a detectar datos pendientes o fechas incoherentes. La persona responsable todavía debe cotejar el expediente, el plazo aplicable, las constancias, los recursos y el texto final. El borrador de demostración no equivale a una resolución aprobada o firmada.')

page();h('11. Mis Documentos')
fig('library','9. Búsqueda, borradores y acciones disponibles.',6.55)
points(['Mis Documentos abre la lista de borradores guardados.','Nuevo documento inicia otro borrador desde el formulario.','Buscar y filtrar por tipo o estado ayudan a encontrar un trabajo anterior.','Abrir continúa el borrador; Duplicar crea una copia; Eliminar retira el registro de esta lista.'])
p('En el prototipo los borradores se conservan en el equipo utilizado. Para su uso institucional se necesita definir quién accede, cómo se vinculan al expediente, cuánto tiempo se conservan y qué acciones deben permitirse. El historial actual sirve para probar el recorrido, no representa aún el registro oficial.')

page();h('12. Documentos y decisiones solicitados')
p('Se solicita indicar qué modelos vigentes y casos de ejemplo pueden facilitarse para estudio, con datos personales retirados o con la autorización correspondiente. Son prioritarios los modelos de Consentida de Calificación y Jefatura ya recibidos, sus variantes y casos de notificación, vencimiento y recursos. Para los demás tipos visibles se necesita al menos un modelo vigente de cada unidad que los utilice y casos que permitan reconocer sus variaciones.')
tab([['Solicitud','Para qué se utilizará'],['Inventario de formatos por unidad','Confirmar la matriz área, documento y formato.'],['Modelos oficiales y casos autorizados','Determinar campos, textos fijos, variantes y supuestos.'],['Reglas de plazo y constancias','Revisar el traslado de fechas desde el Módulo 1.'],['Flujo de revisión y firma','Definir responsables y controles antes de usar un borrador.'],['Observaciones sobre pantallas','Indicar qué añadir, modificar o eliminar.']])
p('Se agradecerá marcar expresamente qué elementos de esta propuesta son correctos, cuáles deben cambiar y cuáles no deben incluirse. También se solicita decidir qué documento conviene trabajar primero. Con esa respuesta se ajustará el prototipo y se presentará una siguiente versión para revisión.')
h('13. Cierre')
p('La propuesta visual permite recorrer la preparación de un borrador, reutilizar datos y revisar el resultado antes de guardarlo o descargarlo. La definición institucional de documentos, formatos, textos, plazos y responsables sigue pendiente. Ninguna pantalla ni ejemplo de esta presentación se considera aprobado sin la conformidad del área competente.')

d.save(OUT);print(OUT)
