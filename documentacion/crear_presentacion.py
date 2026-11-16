from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.section import WD_SECTION_START
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT=Path(__file__).resolve().parent
CAP=ROOT/'capturas'
OUT=ROOT/'ODANC_Arequipa_Presentacion_Modulos_1_y_2_Propuesta.docx'
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

def annotated(src,name,box,points):
    image=Image.open(CAP/src).convert('RGB')
    if box:image=image.crop(box)
    w,h=image.size
    canvas=Image.new('RGB',(w+104,h+16),'white');canvas.paste(image,(104,8))
    d=ImageDraw.Draw(canvas);font=ImageFont.truetype(FONT,24)
    for num,(x,y) in enumerate(points,1):
        cx,cy=47,y+8;target=(x+104,y+8)
        d.line((cx+23,cy,target[0]-9,target[1]),fill='#2449a5',width=4)
        d.polygon([(target[0],target[1]),(target[0]-13,target[1]-7),(target[0]-13,target[1]+7)],fill='#2449a5')
        d.ellipse((cx-21,cy-21,cx+21,cy+21),fill='#2449a5')
        t=str(num);bbox=d.textbbox((0,0),t,font=font);d.text((cx-(bbox[2]-bbox[0])/2,cy-(bbox[3]-bbox[1])/2-4),t,font=font,fill='white')
    path=CAP/(name+'.png');canvas.save(path);return path

figs={
 'm1':annotated('01-modulo1.png','fig01-modulo1',None,[(305,193),(350,380),(720,458)]),
 'sel':annotated('02-seleccion.png','fig02-seleccion',(0,0,918,840),[(330,286),(365,375),(485,525)]),
 'sel2':annotated('02-seleccion.png','fig03-catalogo',(0,830,918,1522),[(480,142),(480,406),(780,650)]),
 'exp':annotated('03-expediente.png','fig04-expediente',None,[(320,289),(310,385),(310,462)]),
 'cont1':annotated('04-contenido.png','fig05-contenido-superior',(0,0,667,590),[(260,245),(260,325),(390,515)]),
 'cont2':annotated('04-contenido.png','fig06-contenido-inferior',(0,590,667,1103),[(300,95),(315,250),(325,370)]),
 'rev':annotated('05-revision.png','fig07-revision',None,[(330,314),(345,530),(930,266),(972,625)]),
 'hist':annotated('06-historial.png','fig08-historial',None,[(360,145),(320,245)]),
 'jef':annotated('07-jefatura.png','fig09-jefatura',None,[(380,285),(385,360),(445,548)]),
}

d=Document()
s=d.sections[0];s.page_width=Inches(8.5);s.page_height=Inches(11);s.top_margin=Inches(.78);s.bottom_margin=Inches(.72);s.left_margin=Inches(.98);s.right_margin=Inches(.98)
normal=d.styles['Normal'];normal.font.name='Arial Narrow';normal.font.size=Pt(12);normal.paragraph_format.space_after=Pt(5)
for key,size in [('Title',20),('Heading 1',15),('Heading 2',13)]:
 st=d.styles[key];st.font.name='Arial Narrow';st.font.size=Pt(size);st.font.bold=True;st.font.color.rgb=RGBColor(0,0,0);st.paragraph_format.space_before=Pt(10);st.paragraph_format.space_after=Pt(5);st.paragraph_format.keep_with_next=True

def para(text='',style=None,bold_start=None):
 p=d.add_paragraph(style=style)
 if bold_start and text.startswith(bold_start):p.add_run(bold_start).bold=True;p.add_run(text[len(bold_start):])
 else:p.add_run(text)
 return p

def h(text,level=1):return d.add_paragraph(text,style=f'Heading {level}')
def bullet(text):return para(text,style='List Bullet')
def num(text):return para(text,style='List Number')
def page():d.add_page_break()
def table(rows,widths=None):
 t=d.add_table(rows=0,cols=len(rows[0]));t.alignment=WD_TABLE_ALIGNMENT.CENTER;t.style='Table Grid'
 for ri,row in enumerate(rows):
  cells=t.add_row().cells
  for j,val in enumerate(row):
   cells[j].text=val;cells[j].vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
   for p in cells[j].paragraphs:
    for run in p.runs:run.font.name='Arial Narrow';run.font.size=Pt(10.5);run.bold=(ri==0)
   if ri==0:
    tcPr=cells[j]._tc.get_or_add_tcPr();sh=OxmlElement('w:shd');sh.set(qn('w:fill'),'E6E6E6');tcPr.append(sh)
 return t

def figure(key,caption,width=6.35):
 p=d.add_paragraph();p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.space_after=Pt(3)
 im=Image.open(figs[key]);maxh=8.0;w=min(width,maxh*im.width/im.height)
 p.add_run().add_picture(str(figs[key]),width=Inches(w))
 c=d.add_paragraph('Figura '+caption);c.alignment=WD_ALIGN_PARAGRAPH.CENTER;c.paragraph_format.keep_with_next=True
 for r in c.runs:r.italic=True;r.font.size=Pt(10)
 return c

def explain(items):
 for i,text in enumerate(items,1):
  p=d.add_paragraph();r=p.add_run(f'{i}. ');r.bold=True;p.add_run(text)

footer=s.footer.paragraphs[0];footer.alignment=WD_ALIGN_PARAGRAPH.CENTER;footer.add_run('Sistema de Apoyo Procesal · ODANC Arequipa · Propuesta para revisión').font.size=Pt(9)

# Portada y visión general
p=d.add_paragraph();p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.add_run('AUTORIDAD NACIONAL DE CONTROL DEL PODER JUDICIAL\nODANC AREQUIPA').bold=True
p=d.add_paragraph();p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.space_before=Pt(24);r=p.add_run('SISTEMA DE APOYO PROCESAL\nMÓDULOS DE PLAZOS Y DOCUMENTOS');r.bold=True;r.font.size=Pt(19)
p=d.add_paragraph();p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.add_run('Presentación ilustrada de la propuesta y sus funciones').font.size=Pt(14)
table([['PROPÓSITO','Mostrar el funcionamiento actual y recoger observaciones para orientar las siguientes versiones.'],['ALCANCE','Cómputo de plazos y propuesta de preparación de borradores documentales.'],['ESTADO','Prototipo visual sujeto a revisión de formatos, campos y textos por la ODANC.']])
h('1. PRESENTACIÓN GENERAL')
para('El sistema reúne dos tareas frecuentes: calcular fechas de vencimiento y preparar borradores a partir de datos del expediente. El Módulo 1 permite revisar el cómputo de días hábiles. El Módulo 2 propone un recorrido para elegir el documento, completar sus datos, revisar una vista previa y conservar el borrador para continuarlo después.')
para('El Módulo 1 recibirá un ajuste de apariencia. Su función de cálculo se mantiene. El Módulo 2 se presenta para conocer la forma de trabajo de las unidades y confirmar qué formatos, datos y textos corresponde utilizar. Los documentos generados en esta etapa son borradores de demostración.')
h('2. RECORRIDO GENERAL')
table([['Paso','Qué permite hacer'],['1. Cálculo','Ingresar fecha, modalidad de notificación y plazo para obtener un vencimiento.'],['2. Documento','Elegir área, tipo de documento y formato disponible.'],['3. Preparación','Completar expediente, resolución anterior y datos propios del trámite.'],['4. Revisión','Examinar el borrador, corregir datos y guardarlo o descargarlo.']])

page();h('3. MÓDULO 1: CÓMPUTO DE PLAZOS')
para('La pantalla del Módulo 1 recibe la fecha de notificación, el número de días hábiles y la modalidad de notificación. El resultado muestra el vencimiento calculado. El personal verifica que el plazo y el calendario correspondan al expediente.')
figure('m1','1. Pantalla de cómputo de plazos.')
explain(['Fecha de notificación y plazo: son los datos con los que se inicia el cómputo.','Calendario: permite registrar feriados y días inhábiles que afectan la cuenta.','Resultado: muestra la fecha de vencimiento y permite llevarla al trabajo documental.'])
para('El cambio previsto para este módulo es visual. La revisión del resultado y de los días inhábiles aplicables continúa a cargo del personal responsable.')

page();h('4. MÓDULO 2: PREPARACIÓN DE BORRADORES')
para('El panel guía el trabajo en cuatro pasos: Documento, Expediente, Contenido y Revisión. La elección en el primer paso determina los campos y el formato que se presentarán después. El avance ocurre al pulsar «Continuar», lo que permite revisar la selección antes de ingresar datos.')
h('4.1 Elegir área, documento y formato',2)
figure('sel','2. Selección inicial del documento.',6.25)
explain(['Área: identifica la unidad de trabajo que se desea consultar.','Formato: muestra el modelo disponible para la combinación elegida; también informa si falta recibirlo.','Tarjetas de documento: permiten elegir visualmente el tipo de actuación. Las opciones dependen del área.'])

page();h('4.2 Catálogo y avance',2)
figure('sel2','3. Otros tipos y control de avance.',6.0)
explain(['Cada tarjeta explica brevemente para qué sirve el documento.','El aviso «Formato pendiente de recibir» identifica las propuestas que aún necesitan un modelo.','«Continuar» abre el expediente únicamente después de que el usuario lo pulsa.'])
para('La lista orienta el levantamiento de formatos. Contar con una tarjeta en la pantalla no significa que el modelo o su asignación a una unidad ya hayan recibido conformidad.')
h('4.3 Modelos de Consentida recibidos',2)
figure('jef','4. Selección del modelo de Jefatura.',5.8)
explain(['Al elegir Jefatura, se restringe la lista a los documentos registrados para esa área.','La Consentida muestra el modelo recibido para Juez de Paz.','La combinación elegida se conserva durante la preparación del borrador.'])

page();h('5. DATOS DEL EXPEDIENTE')
para('El segundo paso concentra la información que identifica el asunto y el documento por preparar. Los campos se muestran según el tipo elegido. En los ejemplos disponibles de Consentida se revisan, entre otros, el número de expediente, el origen de la queja, las personas involucradas y el número de resolución.')
figure('exp','5. Campos de identificación del expediente.',6.1)
explain(['EXPEDIENTE: identifica el asunto; debe conservar su número y forma de registro.','Origen de queja y personas: permiten individualizar el caso cuando el formato los requiera.','Resolución N.°: corresponde al nuevo borrador; la resolución anterior se registra en el paso siguiente.'])
para('Los ejemplos recibidos no presentan siempre las mismas casillas impresas. Se solicita confirmar qué datos deben aparecer en cada formato y cuáles solo se necesitan para preparar el borrador.')

page();h('6. CONTENIDO DE LA RESOLUCIÓN CONSENTIDA')
para('El tercer paso distingue la resolución anterior de la nueva resolución. Esta separación evita confundir la fecha del acto que se pretende declarar consentido con la fecha de emisión del documento que se está preparando.')
figure('cont1','6. Resolución anterior y personas notificadas.',5.6)
explain(['Resolución anterior: número y fecha del acto cuya firmeza se examina.','Nueva resolución: fecha del documento que se está preparando.','Persona notificada: se registra por separado, con su participación, fecha, medio, constancia y vencimiento. Se pueden agregar otras personas cuando el caso lo requiera.'])

page();h('6.1 Plazo, recursos y texto variable',2)
figure('cont2','7. Vencimiento y revisión de recursos.',5.6)
explain(['Vencimiento del plazo: puede incorporarse desde un cálculo previo del Módulo 1 a la persona correspondiente.','Revisión de recursos: deja constancia de si se verificó la presentación de un recurso.','Contenido de la resolución anterior: permite redactar y cotejar el extremo que se describirá en el borrador.'])
para('«Vistos», «Considerando» y la parte resolutiva pueden variar según el caso y la unidad. Los dos modelos de Consentida recibidos muestran diferencias de encabezado, fundamento, decisiones y firma. La selección de párrafos frecuentes y sus condiciones de uso requieren revisión de casos y conformidad del área responsable.')

page();h('7. REVISIÓN DEL BORRADOR')
figure('rev','8. Comprobación y vista previa.',6.3)
explain(['Datos de firma: identifican a quien correspondería revisar o suscribir el documento; el modelo debe confirmarse por unidad.','Cálculo de referencia: muestra notificación, vencimiento y días hábiles del Módulo 1.','Vista previa: permite leer el texto compuesto antes de guardarlo o descargarlo.','Acciones: el borrador puede guardarse para continuar después o descargarse para revisión.'])
para('La pantalla señala datos pendientes y fechas incoherentes. La vista previa y el archivo deben cotejarse con el expediente, la notificación, la ausencia de recursos y el texto aprobado para el formato correspondiente.')

page();h('8. MIS DOCUMENTOS')
figure('hist','9. Biblioteca de borradores.',6.3)
explain(['La búsqueda y los filtros ayudan a encontrar los borradores por tipo y estado.','Cada borrador puede abrirse para continuar, duplicarse como punto de partida o eliminarse.'])
para('Este historial conserva el trabajo realizado en el prototipo. Será necesario confirmar con la ODANC cómo debe relacionarse con el registro institucional del expediente y quiénes necesitan acceder a cada documento.')
h('9. ASPECTOS QUE REQUIEREN REVISIÓN')
table([['Tema','Confirmación solicitada'],['Áreas y formatos','Qué unidad emite cada tipo; cuáles son sus modelos vigentes.'],['Identificación','Qué datos son obligatorios y cuáles deben imprimirse en cada formato.'],['Consentida','Destinatarios, constancias, plazo aplicable, revisión de recursos y extremos de la resolución anterior.'],['Texto y firma','Párrafos que pueden reutilizarse, variantes, responsables de revisión y firma.']])

page();h('10. FORMATOS Y OBSERVACIONES SOLICITADOS')
para('Para ajustar la propuesta a la práctica de la ODANC, se agradecerá indicar qué modelos y casos pueden facilitarse para su estudio, de preferencia con datos personales retirados o autorizados. En particular, resulta útil contar con versiones vigentes de las resoluciones consentidas de las unidades que las emitan; informes de calificación; decisiones de rechazo liminar e improcedencia; concesorios de apelación; decretos, autos y resoluciones de inicio o conclusión del procedimiento, según su uso efectivo.')
para('También se solicita señalar qué documentos deben añadirse o retirarse de la lista propuesta, qué campos o textos requieren modificación y si los modelos recibidos de Calificación y Jefatura reflejan la práctica actual. Las observaciones permitirán corregir los formularios, la vista previa y el orden de trabajo antes de considerar aprobada una plantilla.')
para('Se propone revisar la selección de área, documento y formato; después, contrastar con casos autorizados los datos y párrafos variables de cada modelo prioritario. El resultado de esa revisión servirá para acordar qué partes del borrador pueden prepararse de manera uniforme y cuáles requieren redacción o comprobación particular.')
h('11. CIERRE')
para('El prototipo muestra el recorrido propuesto para reducir la transcripción repetida y facilitar la preparación de borradores. Su utilidad dependerá de que las áreas confirmen los formatos, las reglas de plazo, la información exigida y el circuito de revisión. Se recibirán las observaciones para ajustar la siguiente versión.')

d.save(OUT);print(OUT)
