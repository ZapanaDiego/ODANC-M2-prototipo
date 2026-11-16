from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from zipfile import ZipFile
import hashlib

ROOT=Path(__file__).resolve().parent
CAP=ROOT/'capturas'
REF=ROOT/'ODANC_Arequipa_Proyeccion_Modulos_2_y_3.docx'
OUT=ROOT/'ODANC_Arequipa_Presentacion_Modulo_2_Revision_Formal.docx'
LOGO=ROOT.parent/'assets'/'logo-anc.jpg'
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

def arrow(draw,start,end,color='#191919',width=3):
    draw.line((start[0],start[1],end[0]-10,end[1]),fill=color,width=width)
    draw.polygon([(end[0],end[1]),(end[0]-12,end[1]-7),(end[0]-12,end[1]+7)],fill=color)

def badge(draw,center,n,r=17):
    x,y=center
    draw.ellipse((x-r,y-r,x+r,y+r),fill='white',outline='#191919',width=3)
    f=ImageFont.truetype(FONT,18)
    box=draw.textbbox((0,0),str(n),font=f)
    draw.text((x-(box[2]-box[0])/2,y-(box[3]-box[1])/2-3),str(n),font=f,fill='#191919')

def annotate_left(src,name,box,points):
    im=Image.open(CAP/src).convert('RGB').crop(box)
    pad=62; out=Image.new('RGB',(im.width+pad,im.height),'white');out.paste(im,(pad,0))
    dr=ImageDraw.Draw(out)
    for n,(x,y) in enumerate(points,1):
        cy=y
        badge(dr,(28,cy),n)
        arrow(dr,(47,cy),(pad+x-2,y))
    path=CAP/name;out.save(path);return path

def annotate_right(src,name,box,points):
    im=Image.open(CAP/src).convert('RGB').crop(box)
    pad=62;out=Image.new('RGB',(im.width+pad,im.height),'white');out.paste(im,(0,0))
    dr=ImageDraw.Draw(out)
    for n,(x,y) in enumerate(points,1):
        cy=y;badge(dr,(im.width+34,cy),n)
        dr.line((im.width+15,cy,x+13,y),fill='#191919',width=3)
        dr.polygon([(x,y),(x+12,y-7),(x+12,y+7)],fill='#191919')
    path=CAP/name;out.save(path);return path

def annotate_top(src,name,box,targets):
    im=Image.open(CAP/src).convert('RGB').crop(box)
    top=48;out=Image.new('RGB',(im.width,im.height+top),'white');out.paste(im,(0,top))
    dr=ImageDraw.Draw(out)
    for n,(x,y) in enumerate(targets,1):
        badge(dr,(x,20),n)
        dr.line((x,38,x,y+top-10),fill='#191919',width=3)
        dr.polygon([(x,y+top),(x-7,y+top-12),(x+7,y+top-12)],fill='#191919')
    path=CAP/name;out.save(path);return path

def annotate_sides(src,name,box,left_target,right_target):
    im=Image.open(CAP/src).convert('RGB').crop(box)
    pad=62;out=Image.new('RGB',(im.width+2*pad,im.height),'white');out.paste(im,(pad,0))
    dr=ImageDraw.Draw(out)
    y=left_target[1];badge(dr,(28,y),1);arrow(dr,(47,y),(pad+left_target[0],y))
    y=right_target[1];badge(dr,(im.width+pad+34,y),2)
    dr.line((im.width+pad+15,y,pad+right_target[0]+12,y),fill='#191919',width=3)
    dr.polygon([(pad+right_target[0],y),(pad+right_target[0]+12,y-7),(pad+right_target[0]+12,y+7)],fill='#191919')
    path=CAP/name;out.save(path);return path

# Annotation assets: preserve every source capture pixel; add only numbered leaders.
FIG={
 'sidebar':annotate_left('11-pantalla-completa-modulo2.png','formal-01-barra-lateral.png',(0,0,176,305),[(30,67),(30,207),(30,269)]),
 'tabs':annotate_top('11-pantalla-completa-modulo2.png','formal-02-pestanas.png',(350,88,1260,140),[(170,2),(470,2),(760,2)]),
 'catalog':annotate_sides('13-plantillas-completa.png','formal-03-modelos.png',(215,210,1415,700),(12,90),(1188,90)),
 'selection':annotate_left('12-documento-completo.png','formal-04-seleccion.png',(350,320,1270,820),[(44,107),(44,183),(55,363)]),
 'expediente':annotate_left('03-expediente.png','formal-05-expediente.png',(0,0,670,546),[(40,265),(40,339),(40,412)]),
 'expcontinue':annotate_right('03-expediente.png','formal-06-expediente-continuar.png',(0,445,670,546),[(647,64)]),
 'content_top':annotate_left('04-contenido.png','formal-07-contenido-superior.png',(0,0,667,700),[(38,263),(38,344),(38,505)]),
 'content_lower':annotate_left('04-contenido.png','formal-08-contenido-inferior.png',(0,700,667,1103),[(38,103),(38,176),(38,267)]),
 'review_left':annotate_left('16-revision-completa.png','formal-09-revision.png',(200,75,1420,1110),[(35,305),(35,445),(35,980)]),
 'review_right':annotate_right('16-revision-completa.png','formal-10-vista-previa.png',(200,75,1420,1110),[(1190,150),(1190,610)]),
 'library_filters':annotate_top('17-mis-documentos-completa.png','formal-11-filtros.png',(215,205,1415,285),[(100,45),(675,45),(1015,45)]),
 'library_row':annotate_left('17-mis-documentos-completa.png','formal-12-borrador.png',(215,285,1415,365),[(25,43)]),
}

# Confirm that the retained reference still matches the inspected file.
expected='44791996d17bceb9f84639087f7b9bbf6d00be65e9aa789701193ab032b086fd'
actual=hashlib.sha256(REF.read_bytes()).hexdigest()
if actual!=expected: raise RuntimeError('El documento de referencia cambió desde su revisión.')

# Start with a copy of the reference: retain page geometry, style definitions and header/footer.
d=Document(REF)
body=d._element.body
for child in list(body):
    if child.tag!=qn('w:sectPr'):
        body.remove(child)
s=d.sections[0]
normal=d.styles['Normal'];normal.font.name='Arial Narrow';normal.font.size=Pt(12)
normal.font.color.rgb=RGBColor(0,0,0)
normal.paragraph_format.space_after=Pt(4)

def para(text='',bold=False,align=None,before=0,after=4,size=12,italic=False,keep=False):
    p=d.add_paragraph(style='Normal')
    p.paragraph_format.space_before=Pt(before);p.paragraph_format.space_after=Pt(after)
    p.paragraph_format.keep_with_next=keep
    if align is not None:p.alignment=align
    r=p.add_run(text);r.font.name='Arial Narrow';r.font.size=Pt(size);r.bold=bold;r.italic=italic
    r.font.color.rgb=RGBColor(0,0,0)
    return p

def rich(segments,align=None,before=0,after=4):
    p=d.add_paragraph(style='Normal');p.paragraph_format.space_before=Pt(before);p.paragraph_format.space_after=Pt(after)
    if align is not None:p.alignment=align
    for text,bold in segments:
        r=p.add_run(text);r.font.name='Arial Narrow';r.font.size=Pt(12);r.bold=bold;r.font.color.rgb=RGBColor(0,0,0)
    return p

def heading(text,level=1):
    p=para(text,bold=True,before=7 if level==1 else 5,after=4,size=12,keep=True)
    p.paragraph_format.keep_with_next=True
    return p

def newpage():d.add_page_break()

def add_table(rows,cover=False):
    t=d.add_table(rows=0,cols=len(rows[0]));t.alignment=WD_TABLE_ALIGNMENT.CENTER;t.style='Table Grid'
    for ri,row in enumerate(rows):
        cells=t.add_row().cells
        for j,val in enumerate(row):
            cells[j].text=val;cells[j].vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
            for p in cells[j].paragraphs:
                p.paragraph_format.space_after=Pt(1)
                for r in p.runs:
                    r.font.name='Arial Narrow';r.font.size=Pt(11 if cover else 10.5)
                    r.bold=(j==0 or ri==0 and not cover)
            tcPr=cells[j]._tc.get_or_add_tcPr()
            if cover and j==0 or not cover and ri==0:
                sh=OxmlElement('w:shd');sh.set(qn('w:fill'),'E5E5E5');tcPr.append(sh)
            mar=OxmlElement('w:tcMar')
            for side,val2 in [('top','75'),('start','100'),('bottom','75'),('end','100')]:
                node=OxmlElement('w:'+side);node.set(qn('w:w'),val2);node.set(qn('w:type'),'dxa');mar.append(node)
            tcPr.append(mar)
    return t

def callout(title,text):
    t=d.add_table(rows=1,cols=1);t.alignment=WD_TABLE_ALIGNMENT.CENTER
    c=t.cell(0,0);c.text='';tcPr=c._tc.get_or_add_tcPr()
    sh=OxmlElement('w:shd');sh.set(qn('w:fill'),'F1F1F1');tcPr.append(sh)
    borders=OxmlElement('w:tcBorders');left=OxmlElement('w:left');left.set(qn('w:val'),'single');left.set(qn('w:sz'),'24');left.set(qn('w:color'),'238447');borders.append(left);tcPr.append(borders)
    mar=OxmlElement('w:tcMar')
    for side,val in [('top','140'),('start','200'),('bottom','140'),('end','160')]:
        el=OxmlElement('w:'+side);el.set(qn('w:w'),val);el.set(qn('w:type'),'dxa');mar.append(el)
    tcPr.append(mar)
    p=c.paragraphs[0];p.paragraph_format.space_after=Pt(1)
    a=p.add_run(title+'\n');a.bold=True;a.font.name='Arial Narrow';a.font.size=Pt(12)
    b=p.add_run(text);b.font.name='Arial Narrow';b.font.size=Pt(11.5)
    return t

def figure(path,caption,width=6.35,top=0):
    p=d.add_paragraph();p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.space_before=Pt(top);p.paragraph_format.space_after=Pt(2)
    im=Image.open(path);maxh=7.7;w=min(width,maxh*im.width/im.height)
    p.add_run().add_picture(str(path),width=Inches(w))
    c=para(caption,align=WD_ALIGN_PARAGRAPH.CENTER,after=4,size=10,italic=True,keep=True)
    return c

def legend(items):
    for i,text in enumerate(items,1):
        p=d.add_paragraph(style='Normal');p.paragraph_format.left_indent=Inches(.1);p.paragraph_format.first_line_indent=Inches(0);p.paragraph_format.space_after=Pt(2)
        r=p.add_run(f'{i}. ');r.bold=True;r.font.name='Arial Narrow';r.font.size=Pt(11.5)
        r=p.add_run(text);r.font.name='Arial Narrow';r.font.size=Pt(11.5)

# Cover: follow the institutional sequence and components shown in the retained reference.
p=d.add_paragraph(style='Normal');p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.space_after=Pt(1)
p.add_run().add_picture(str(LOGO),width=Inches(2.8))
para('OFICINA DESCENTRALIZADA DE LA AUTORIDAD NACIONAL DE CONTROL\nDEL PODER JUDICIAL (ODANC – AREQUIPA)',bold=True,align=WD_ALIGN_PARAGRAPH.CENTER,after=8,size=12)
para('SISTEMA DE APOYO PROCESAL Y CÓMPUTO DE PLAZOS\nADMINISTRATIVOS DISCIPLINARIOS',bold=True,align=WD_ALIGN_PARAGRAPH.CENTER,after=8,size=12)
para('Propuesta de revisión del Módulo 2\nRecorrido visual para preparar borradores documentales',bold=True,align=WD_ALIGN_PARAGRAPH.CENTER,after=10,size=12)
add_table([
 ['DIRIGIDO A:','Jefatura de la ODANC Arequipa, autoridades de la ANC y responsables de las unidades'],
 ['PROPÓSITO:','Presentar el recorrido visual del Módulo 2 y recoger observaciones para definir sus formatos y datos'],
 ['ALCANCE:','Selección de área y documento, preparación de datos, revisión de borrador y conservación del trabajo'],
 ['LUGAR Y FECHA:','Arequipa — Noviembre de 2026'],
],cover=True)
heading('1. RESUMEN EJECUTIVO')
para('El Módulo 2 se encuentra en definición. Esta propuesta muestra cómo se podría elegir un área, seleccionar un documento y su formato, completar los datos del expediente y revisar el borrador antes de guardarlo o descargarlo. Los campos y textos son ejemplos sujetos a observaciones y aprobación de las áreas.',after=4)
rich([('El Módulo 1 recibirá un ajuste visual; ',True),('su función de cómputo de plazos se mantiene. La fecha calculada podrá usarse como referencia en el borrador, una vez que se confirme la forma de incorporarla.',False)],after=5)
callout('OBJETIVO DE ESTA PROPUESTA','Explicar el panel y solicitar validación de las áreas, los tipos de documento, los formatos, los datos necesarios y el recorrido de revisión.')

# 2. Full-screen context and concise Module 1 note.
newpage();heading('2. VISTA GENERAL DEL MÓDULO 2')
para('Para ingresar al autogenerador, se selecciona «Módulo 2» en la barra lateral. Dentro del panel, las pestañas superiores permiten abrir Nuevo Documento, Mis Documentos o Plantillas.',after=4)
figure(CAP/'11-pantalla-completa-modulo2.png','Figura 1. Pantalla completa del Módulo 2, con logotipo, menú lateral y panel principal.',6.3)
para('La imagen presenta el panel completo y su navegación. Los ejemplos que siguen describen el contenido visible del prototipo; las opciones y su relación con las unidades deben confirmarse con la ODANC.',after=2)

newpage();heading('2.1 MÓDULO 1')
para('El Módulo 1 conserva su función de cómputo de plazos. En la nueva presentación recibirá un cambio visual. En esta propuesta se muestra solo como referencia de cómo se accede a ambos módulos y de dónde podrá tomarse una fecha calculada.',after=4)
figure(CAP/'10-pantalla-completa-modulo1.png','Figura 2. Pantalla completa del Módulo 1; el ajuste previsto corresponde a su presentación visual.',6.3)

# 3. Separate navigation panels, preventing the former 4/5/6 arrow collision.
newpage();heading('3. NAVEGACIÓN DEL MÓDULO 2')
para('La navegación se organiza en dos lugares: el menú lateral cambia de módulo y las pestañas superiores cambian la vista dentro del Módulo 2.',after=4)
figure(FIG['sidebar'],'Figura 3. Accesos del menú lateral.',3.8)
legend(['Identificación institucional de la ANC y la ODANC Arequipa.','Abre el Módulo 1, dedicado al cómputo de plazos.','Abre el Módulo 2, dedicado a la preparación de borradores.'])
figure(FIG['tabs'],'Figura 4. Pestañas disponibles dentro del Módulo 2.',6.25,top=5)
legend(['Nuevo Documento abre el formulario de preparación.','Mis Documentos muestra los borradores guardados en este equipo.','Plantillas presenta el catálogo de tipos y el estado de sus modelos.'])

newpage();heading('4. PLANTILLAS Y DOCUMENTOS PROPUESTOS')
para('Para consultar el catálogo, se selecciona la pestaña «Plantillas» en la parte superior del Módulo 2. Las tarjetas describen tipos de actuación y el estado del modelo asociado.',after=4)
figure(CAP/'13-plantillas-completa.png','Figura 5. Pantalla completa de la vista Plantillas.',6.2)
figure(FIG['catalog'],'Figura 6. Ejemplos del estado mostrado en las tarjetas.',5.9)
legend(['Resolución Consentida indica dos modelos recibidos: Calificación y Jefatura; ambos deben validarse.','Informe de Calificación figura como formato pendiente de validar o recibir.'])
para('Las tarjetas restantes también son propuestas de catálogo. Su presencia no confirma que la lista esté completa ni que cada documento corresponda a todas las áreas. La ODANC debe indicar qué tipos se conservan, se renombran, se separan o se retiran.',after=2)

newpage();heading('5. NUEVO DOCUMENTO: ÁREA, DOCUMENTO Y FORMATO')
para('Para iniciar un borrador, se abre la pestaña «Nuevo Documento». El recorrido propuesto es Área → Documento → Formato. Finalmente, se pulsa «Continuar» para pasar a los datos del expediente.',after=4)
figure(FIG['selection'],'Figura 7. Selección inicial; cada flecha señala un control concreto.',5.95)
legend(['Área de trabajo seleccionada.','Formato que se ofrece para esa combinación.','Tipo de documento que se ha elegido.'])
para('La selección funciona por niveles: el área limita los documentos disponibles y cada documento ofrece sus formatos. Como el ejemplo muestra el selector de Formato antes de las tarjetas, se debe validar si conviene moverlo después de elegir el documento para que la pantalla siga el mismo orden.',after=2)
para('Como en una lista de departamentos y ciudades, cada elección reduce las opciones siguientes. «Continuar» se mantiene como paso explícito para revisar la combinación antes de avanzar.',after=2)
para('«Cargar ejemplo» coloca datos ficticios para recorrer el formulario. «Anterior» permite regresar a la etapa previa. Los ejemplos solo sirven para revisar la interacción y el aspecto del borrador.',after=2)

newpage();heading('6. ÁREAS, DOCUMENTOS Y FORMATOS POR VALIDAR')
add_table([
 ['Parte de la selección','Confirmación que se requiere'],
 ['Área','Nombre oficial de la unidad y documentos que prepara.'],
 ['Documento','Qué tipos de actuación se utilizan en cada unidad y cómo se denominan.'],
 ['Formato','Qué modelo vigente corresponde a cada combinación de área y documento.'],
 ['Variantes','Si hay modelos distintos según supuesto, persona destinataria, instancia o expediente.'],
])
para('La pantalla contempla Calificación e Investigación Preliminar, Prevención, Procedimiento Administrativo Disciplinario, Sanción y Apelación, y Jefatura. La referencia a Juez de Paz aparece en el modelo de Consentida recibido para Jefatura. Esta matriz requiere revisión de las personas responsables; no determina competencias institucionales.',after=4)
para('Los documentos visibles son Resolución Consentida, Informe de Calificación, Improcedencia o Rechazo Liminar, Concesorio de Apelación, Decreto de Mero Trámite, Auto Interlocutorio, Inicio de PAD y Resolución de Fondo o Abstención. Se solicita indicar si alguno debe añadirse, cambiar de nombre, dividirse o retirarse.',after=4)
heading('6.1 MODELOS RECIBIDOS',2)
para('Como referencia para Consentida se dispone de un modelo de Calificación y otro de Jefatura relacionado con Juez de Paz. Su inclusión en el prototipo significa que se recibieron para estudio; ambos siguen pendientes de validación. Para los otros tipos se requieren modelos oficiales autorizados antes de definir sus campos y textos.')

newpage();heading('7. PASO EXPEDIENTE')
para('Después de pulsar «Continuar» en la selección inicial, se abre el paso Expediente. Esta pantalla reúne los datos para identificar el asunto y la nueva resolución.',after=4)
figure(FIG['expediente'],'Figura 8. Campos generales propuestos para identificar el expediente.',6.15)
legend(['Número de expediente, que deberá escribirse según el modelo correspondiente.','Quejoso, cuando esa persona conste en el expediente.','Número de la nueva resolución.'])
callout('AJUSTE PROPUESTO PARA DATOS GENERALES','Cambiar «Queja N°» por «EXPEDIENTE N°», incorporar «INVESTIGACIÓN N°» como dato opcional y mantener Quejoso seguido de Quejado. Validar con el área qué campos son obligatorios.')
figure(FIG['expcontinue'],'Figura 9. Botón para avanzar al contenido.',4.5,top=3)
para('También se muestran Origen de queja y Quejado. La ODANC debe confirmar qué datos se imprimen en el encabezado, cuáles se usan solo para preparar el documento y cuáles son obligatorios en cada formato.',after=2)

newpage();heading('8. PASO CONTENIDO: RESOLUCIÓN CONSENTIDA')
para('Al pulsar «Continuar» desde Expediente, se abre Contenido. En Consentida, la propuesta separa los datos de la resolución anterior de los datos de la nueva resolución que se está preparando.',after=4)
figure(FIG['content_top'],'Figura 10. Resolución anterior, fecha del nuevo documento y personas notificadas.',5.6)
legend(['Número de la resolución anterior.','Fecha de la nueva resolución en preparación.','Personas notificadas: se pueden registrar por separado.'])
para('Cada persona puede llevar nombre, participación, fecha de notificación, constancia, vencimiento y medio. La información debe contrastarse con el expediente antes de usarse.',after=2)

newpage();heading('8.1 PLAZOS, RECURSOS Y TEXTO')
figure(FIG['content_lower'],'Figura 11. Revisión de recursos y contenido variable.',5.8)
legend(['Revisión de recursos: indica si se verificó la presentación de un recurso.','Sustento de la revisión: permite anotar qué registro o fuente se consultó.','Contenido de la resolución anterior que se usará al preparar el borrador.'])
para('El enlace «Usar cálculo del Módulo 1» permite trasladar el vencimiento a la persona notificada correspondiente. La fecha requiere cotejo con la constancia, el plazo aplicable y el calendario que corresponda.',after=4)
para('Los apartados Vistos, Considerando y Resuelve pueden variar. Los textos predeterminados solo se propondrán después de revisar ejemplos autorizados y recibir conformidad del área. El texto visible es ilustrativo y no constituye una decisión jurídica automatizada.',after=3)

newpage();heading('9. CONTENIDO DE OTROS DOCUMENTOS')
para('El paso Contenido cambia según el tipo seleccionado. Por ejemplo, para un Informe de Calificación la propuesta considera fecha, antecedentes, análisis, conclusión y recomendación. En otros documentos se presentan datos del trámite, considerando y parte resolutiva. La estructura debe cotejarse con el modelo oficial de cada unidad.',after=4)
add_table([
 ['Tipo propuesto','Aspectos que se deben revisar'],
 ['Informe de Calificación','Estructura vigente, datos requeridos, variantes y responsables.'],
 ['Rechazo Liminar e Improcedencia','Si son documentos distintos, supuestos de uso, fundamentos y decisión.'],
 ['Concesorio de Apelación','Datos del recurso, destinatario, plazos y forma de elevar los actuados.'],
 ['Decretos y Autos','Actuaciones frecuentes, información mínima y fórmulas de trámite.'],
 ['Inicio de PAD y Fondo o Abstención','Estructura, motivación, decisión, unidad y firma que correspondan.'],
])
para('Se propone priorizar un documento acordado por las áreas, revisar varios casos autorizados y determinar qué partes se repiten y cuáles cambian. Cada propuesta de texto se validará con quienes elaboran y revisan ese tipo de documento.',before=5)

newpage();heading('10. PASO REVISIÓN')
para('Después de completar Contenido, se pulsa «Continuar» para llegar a Revisión. Aquí se comprueban los datos, se consulta la vista previa y se decide si se guarda el borrador o se obtiene una copia para revisión.',after=4)
figure(FIG['review_left'],'Figura 12. Datos de firma, fecha de referencia y acciones del borrador.',5.9)
legend(['Firmante, cargo e iniciales que deben confirmarse para el modelo.','Fechas calculadas en el Módulo 1, como referencia del caso.','Acciones para descargar el borrador, guardarlo o iniciar uno nuevo.'])
figure(FIG['review_right'],'Figura 13. Vista previa y opciones para consultar o descargar.',5.9)
legend(['Vista previa del texto antes de guardarlo o descargarlo.','Opciones Word y PDF para obtener una copia de revisión.'])
para('La persona responsable debe revisar el expediente, las constancias, los plazos, la existencia de recursos, los nombres y el texto. La vista previa ayuda a detectar datos pendientes; no reemplaza la revisión ni la firma institucional.',after=2)

newpage();heading('11. MIS DOCUMENTOS')
para('Para consultar trabajos guardados, se selecciona «Mis Documentos» en la fila de pestañas del Módulo 2. La pantalla permite buscar borradores, filtrar por tipo y estado, y abrir un documento para continuarlo.',after=4)
figure(CAP/'17-mis-documentos-completa.png','Figura 14. Pantalla completa de Mis Documentos.',6.25)
figure(FIG['library_filters'],'Figura 15. Campos para buscar y filtrar borradores.',5.95)
legend(['Buscar por título, expediente o unidad.','Filtrar por tipo de documento.','Filtrar por estado.'])
figure(FIG['library_row'],'Figura 16. Registro de un borrador guardado.',5.9,top=3)
para('En cada registro, Abrir permite continuar; Duplicar crea una copia para usar como punto de partida; Eliminar retira ese registro de la lista. En el prototipo los borradores se conservan en el equipo utilizado. Su relación con el expediente oficial, las personas autorizadas y el tiempo de conservación requiere definición institucional.',after=2)

newpage();heading('12. FORMATOS Y OBSERVACIONES SOLICITADOS')
para('Para ajustar la propuesta al trabajo de la ODANC, se solicita indicar qué modelos vigentes y casos de ejemplo pueden facilitarse para estudio, con los datos personales retirados o con la autorización que corresponda.',after=4)
add_table([
 ['Documento o información','Uso durante la revisión'],
 ['Inventario por unidad','Confirmar qué área prepara cada tipo de documento.'],
 ['Modelos oficiales y casos autorizados','Identificar datos, textos fijos, variantes y supuestos.'],
 ['Resoluciones Consentidas de Calificación y Jefatura','Validar diferencias, notificaciones, vencimientos, recursos y textos.'],
 ['Selección y datos generales','Confirmar el orden Área → Documento → Formato, el rótulo «EXPEDIENTE N°», el dato opcional «INVESTIGACIÓN N°» y el orden Quejoso/Quejado.'],
 ['Reglas de plazo y constancias','Revisar el traslado de las fechas del Módulo 1 al borrador.'],
 ['Circuito de revisión y firma','Definir responsables y comprobaciones previas.'],
])
para('También se solicita señalar qué partes del panel deben conservarse, modificarse o retirarse; qué tipos faltan; qué campos sobran; y qué documento conviene trabajar primero. Con esas observaciones se preparará una versión corregida para revisión de las áreas.',before=5)
heading('13. CIERRE')
para('Esta propuesta presenta un recorrido visual para preparar, revisar y conservar borradores. Los formatos, campos, textos, reglas de plazo y responsables siguen sujetos a validación. La conformidad de las autoridades y del personal de las unidades permitirá determinar qué debe hacer el Módulo 2 y qué modelos se pueden priorizar.')

d.save(OUT)
print(OUT)
