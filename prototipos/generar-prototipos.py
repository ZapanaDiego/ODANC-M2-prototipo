#!/usr/bin/env python3
"""
Generador de prototipos documentales ODANC Arequipa v0.4.1.
Produce documentos .doc y .pdf con el mismo molde visual de la consentida.
Sin dependencias externas: usa Chromium para exportar el PDF.
"""

from __future__ import annotations

import base64
import csv
import html
import shutil
import subprocess
import zipfile
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
OUT = BASE / "entregas" / "prototipos-v0.4.1"
HTML_TMP = Path("/tmp/opencode/prototipos-html-v041")
CHROME = Path.home() / ".cache/ms-playwright/chromium-1248/chrome-linux64/chrome"

if not CHROME.exists():
    chrome_alt = shutil.which("chromium") or shutil.which("chromium-browser") or shutil.which("google-chrome")
    if not chrome_alt:
        raise SystemExit("No se encontró Chromium para generar los PDF.")
    CHROME = Path(chrome_alt)


def b64(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode("ascii")


IMG_ESCUDO = b64(BASE / "assets" / "escudo-peru.jpeg")
IMG_PJ = b64(BASE / "assets" / "poder-judicial.jpeg")


DOC_CSS = r"""
@page { size: 21cm 29.7cm; margin: 1.0cm 2.75cm 1.2cm; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: Garamond, "Times New Roman", "Liberation Serif", serif;
  color: #000;
  font-size: 11pt;
  line-height: 1.35;
  background: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.doc-page { position: relative; z-index: 1; }
.doc-head { width: 100%; border-collapse: collapse; margin-bottom: 2pt; }
.doc-head td { padding: 0; vertical-align: middle; text-align: center; }
.doc-head td:nth-child(1) { width: 28%; text-align: left; }
.doc-head td:nth-child(2) { width: 30%; }
.doc-head td:nth-child(3) { width: 42%; text-align: center; }
.doc-escudo { width: 1.4cm; height: auto; }
.doc-pj { width: 2.55cm; height: auto; }
.doc-odanc { font-family: "Times New Roman", Times, serif; line-height: 1.1; text-align: center; }
.doc-odanc strong { display: block; font-size: 15pt; font-weight: bold; letter-spacing: 0.5pt; }
.doc-odanc span { display: block; font-size: 4.5pt; font-weight: bold; line-height: 1.2; }
.doc-title { margin-top: 2pt; font-family: "Times New Roman", Times, serif; font-size: 10pt; font-weight: bold; line-height: 1.2; text-align: center; }
.doc-title span { display: block; }
.doc-rule { margin: 8pt 0 16pt; border-top: 1.5pt solid #000; }
.doc-fields { width: 100%; margin-left: 8pt; border-collapse: collapse; font-size: 11pt; font-weight: bold; }
.doc-fields td { padding: 1pt 0; vertical-align: top; }
.doc-fields .label { width: 27%; white-space: nowrap; }
.doc-fields .colon { width: 3%; }
.doc-fields .value { text-transform: uppercase; }
.doc-resolution { margin: 14pt 0 8pt 8pt; font-size: 11pt; font-weight: bold; text-decoration: underline; }
.doc-date { margin: 0 0 12pt 8pt; font-size: 11pt; line-height: 1.15; }
.doc-section { margin: 10pt 0 6pt; font-size: 11pt; font-weight: bold; text-decoration: underline; }
.doc-para { margin: 0 0 8pt; font-size: 11pt; line-height: 1.5; text-align: justify; }
.doc-signature { margin-top: 30pt; text-align: center; font-size: 10pt; line-height: 1.3; }
.doc-signed { margin-bottom: 5pt; font-style: italic; }
.doc-signature-line { width: 55%; margin: 0 auto 3pt; border-top: 0.75pt solid #000; }
.doc-signature strong, .doc-signature span { display: block; font-weight: bold; }
.doc-footer { margin-top: 14pt; padding-top: 3pt; border-top: 0.5pt solid #999; text-align: center; font-family: Arial, sans-serif; font-size: 6pt; color: #666; }
.doc-watermark { position: fixed; top: 45%; left: 0; width: 100%; z-index: 0; text-align: center; font-family: Arial, sans-serif; font-size: 80pt; font-weight: bold; color: rgba(0,0,0,0.055); transform: rotate(-25deg); pointer-events: none; }
.pending { background: #fff2a8; color: #000; padding: 0 2px; border-bottom: 1px solid #d6b800; }
.nota-prototipo { margin-top: 14pt; padding: 6pt 8pt; border: 0.75pt dashed #888; font-family: Arial, sans-serif; font-size: 7.5pt; line-height: 1.35; color: #444; }
"""

FICHA_CSS = r"""
@page { size: 21cm 29.7cm; margin: 0.9cm 1.25cm 0.9cm; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 8.8pt; line-height: 1.28; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.ficha-page { position: relative; z-index: 1; }
.ficha-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2pt solid #0b2f6b; padding-bottom: 5pt; margin-bottom: 7pt; }
.ficha-brand { color: #0b2f6b; font-weight: bold; font-size: 10.5pt; letter-spacing: 0.04em; }
.ficha-head h1 { margin: 2pt 0 1pt; color: #0b2f6b; font-size: 14pt; line-height: 1.12; }
.ficha-head p { margin: 0; color: #555; font-size: 8.5pt; }
.ficha-stamp { border: 1pt solid #0b2f6b; color: #0b2f6b; padding: 4pt 7pt; text-align: center; font-size: 7pt; font-weight: bold; line-height: 1.4; letter-spacing: 0.06em; }
.ficha-meta { width: 100%; border-collapse: collapse; margin-bottom: 8pt; }
.ficha-meta td { border: 0.5pt solid #cbd5e1; padding: 2pt 4pt; vertical-align: top; }
.ficha-meta .label { background: #eef3fb; font-weight: bold; width: 17%; }
h2 { font-size: 9.6pt; color: #0b2f6b; border-bottom: 0.75pt solid #cbd5e1; padding-bottom: 1.5pt; margin: 7pt 0 3pt; page-break-after: avoid; }
table.grid { width: 100%; border-collapse: collapse; font-size: 8.2pt; page-break-inside: avoid; }
table.grid th, table.grid td { border: 0.5pt solid #cbd5e1; padding: 2pt 4pt; vertical-align: top; }
table.grid th { background: #eef3fb; text-align: left; font-weight: bold; }
table.grid td.center { text-align: center; }
.lines { margin-top: 4pt; }
.line { border-bottom: 0.5pt solid #8a96a8; height: 13pt; }
.line.short { width: 55%; }
.check { font-family: Arial, Helvetica, sans-serif; letter-spacing: 0.04em; }
.small { font-size: 7.6pt; color: #555; }
.ficha-footer { margin-top: 8pt; padding-top: 3pt; border-top: 0.5pt solid #999; text-align: center; font-size: 7pt; color: #666; }
.page-break { page-break-before: always; }
.firma-ficha { width: 100%; margin-top: 12pt; border-collapse: collapse; page-break-inside: avoid; }
.firma-ficha td { padding: 2pt 4pt; vertical-align: bottom; }
.firma-ficha .linea { border-bottom: 0.5pt solid #333; height: 24pt; }
.ficha-watermark { position: fixed; top: 45%; left: 0; width: 100%; z-index: 0; text-align: center; font-family: Arial, sans-serif; font-size: 76pt; font-weight: bold; color: rgba(11,47,107,0.045); transform: rotate(-25deg); pointer-events: none; }
"""


def header_institucional() -> str:
    return f"""
      <table class="doc-head">
        <tr>
          <td><img class="doc-escudo" src="data:image/jpeg;base64,{IMG_ESCUDO}" alt="Escudo del Perú"></td>
          <td><img class="doc-pj" src="data:image/jpeg;base64,{IMG_PJ}" alt="Poder Judicial del Perú"></td>
          <td class="doc-odanc">
            <strong>ODANC</strong>
            <span>Oficina Descentralizada de la Autoridad Nacional de Control de Arequipa</span>
            <span>PODER JUDICIAL</span>
          </td>
        </tr>
      </table>
      <div class="doc-title">
        <span>CORTE SUPERIOR DE JUSTICIA DE AREQUIPA</span>
        <span>OFICINA DESCENTRALIZADA DE LA AUTORIDAD NACIONAL DE CONTROL</span>
        <span>JEFATURA</span>
      </div>
      <div class="doc-rule"></div>
    """


def firma_documento() -> str:
    return """
      <div class="doc-signature">
        <p class="doc-signed">(Firmado electrónicamente)</p>
        <div class="doc-signature-line"></div>
        <strong>MAX MARCO DELFIN RIVERA DUEÑAS</strong>
        <span>Jefe de la ODANC – PJ</span>
        <span>Corte Superior de Justicia de Arequipa</span>
      </div>
    """


def pie_documento() -> str:
    return """
      <div class="nota-prototipo">
        <strong>Nota de prototipo:</strong> los campos resaltados en amarillo deben ser completados o validados por la unidad responsable. Este documento es una propuesta y no un formato oficial.
      </div>
      <div class="doc-footer">BORRADOR — PROPUESTA POR VALIDAR — SIN VALIDEZ OFICIAL</div>
    """


def documento_general() -> str:
    return f"""
    <div class="doc-page">
      {header_institucional()}
      <div class="doc-resolution">RESOLUCIÓN N° 10</div>
      <p class="doc-date">Arequipa, dos mil veintiséis,<br>Noviembre, dos.-</p>

      <table class="doc-fields">
        <tr><td class="label">EXPEDIENTE</td><td class="colon">:</td><td class="value">01442-2025</td></tr>
        <tr><td class="label">PARTES</td><td class="colon">:</td><td class="value">JUAN PÉREZ</td></tr>
        <tr><td class="label">UNIDAD</td><td class="colon">:</td><td class="value">CALIFICACIÓN</td></tr>
        <tr><td class="label">REFERENCIA</td><td class="colon">:</td><td class="value">RESOLUCIÓN N.° 8-2026-ODANC</td></tr>
        <tr><td class="label">NOTIFICACIÓN</td><td class="colon">:</td><td class="value">02/11/2026</td></tr>
        <tr><td class="label">VENCIMIENTO</td><td class="colon">:</td><td class="value">23/11/2026</td></tr>
      </table>

      <div class="doc-section">I. VISTOS:</div>
      <p class="doc-para">El expediente N.° 01442-2025, la Resolución N.° 8-2026-ODANC y los actuados remitidos por el Segundo Juzgado de Paz de Paucarpata.</p>

      <div class="doc-section">II. CONSIDERANDO:</div>
      <p class="doc-para"><strong>PRIMERO:</strong> <mark class="pending">[HECHOS Y ANTECEDENTES POR VALIDAR]</mark>.</p>
      <p class="doc-para"><strong>SEGUNDO:</strong> <mark class="pending">[FUNDAMENTO LEGAL POR VALIDAR]</mark>. La notificación se realizó el 02/11/2026 y el plazo venció el 23/11/2026.</p>
      <p class="doc-para"><strong>TERCERO:</strong> <mark class="pending">[PROCEDENCIA Y COMPETENCIA POR VALIDAR]</mark>.</p>

      <div class="doc-section">III. SE RESUELVE:</div>
      <p class="doc-para"><strong>Artículo 1.-</strong> <mark class="pending">[DECISIÓN POR VALIDAR]</mark>.</p>
      <p class="doc-para"><strong>Artículo 2.-</strong> Notificar a JUAN PÉREZ y remitir copia a <mark class="pending">[ÓRGANO COMPETENTE]</mark>.</p>
      <p class="doc-para">Regístrese, comuníquese y cúmplase.</p>

      {firma_documento()}
      {pie_documento()}
    </div>
    """


def documento_informe() -> str:
    return f"""
    <div class="doc-page">
      {header_institucional()}
      <div class="doc-resolution">INFORME N° 12</div>
      <p class="doc-date">Arequipa, dos mil veintiséis,<br>Noviembre, dos.-</p>

      <table class="doc-fields">
        <tr><td class="label">EXPEDIENTE</td><td class="colon">:</td><td class="value">01442-2025</td></tr>
        <tr><td class="label">INVESTIGADO</td><td class="colon">:</td><td class="value">JUAN PÉREZ</td></tr>
        <tr><td class="label">UNIDAD</td><td class="colon">:</td><td class="value">CALIFICACIÓN</td></tr>
        <tr><td class="label">ORIGEN</td><td class="colon">:</td><td class="value">SEGUNDO JUZGADO DE PAZ DE PAUCARPATA</td></tr>
        <tr><td class="label">REFERENCIA</td><td class="colon">:</td><td class="value">RESOLUCIÓN N.° 8-2026-ODANC</td></tr>
        <tr><td class="label">FECHA</td><td class="colon">:</td><td class="value">02/11/2026</td></tr>
      </table>

      <div class="doc-section">I. ANTECEDENTES:</div>
      <p class="doc-para">Se deja constancia de los actuados del expediente 01442-2025, remitidos por el Segundo Juzgado de Paz de Paucarpata. <mark class="pending">[HECHOS RELEVANTES POR VALIDAR]</mark>.</p>

      <div class="doc-section">II. ANÁLISIS:</div>
      <p class="doc-para"><mark class="pending">[ANÁLISIS JURÍDICO POR VALIDAR]</mark>. La notificación se produjo el 02/11/2026 y el plazo venció el 23/11/2026, con 15 días hábiles computados.</p>

      <div class="doc-section">III. CONCLUSIÓN:</div>
      <p class="doc-para"><mark class="pending">[CONCLUSIÓN POR VALIDAR]</mark>.</p>

      <div class="doc-section">IV. RECOMENDACIÓN:</div>
      <p class="doc-para"><mark class="pending">[RECOMENDACIÓN POR VALIDAR]</mark>.</p>

      {firma_documento()}
      {pie_documento()}
    </div>
    """


def ficha_documento(
    titulo: str,
    grupo: str,
    unidad: str,
    estado: str,
    campos: list[tuple[str, str, str, str]],
    base_legal: str,
    plazo: str,
    competencia: str,
    observaciones: str = "",
    pagina_dos: bool = False,
) -> str:
    filas = "\n".join(
        f"<tr><td>{html.escape(c)}</td><td>{html.escape(e)}</td><td class=\"center\">{html.escape(o)}</td><td>{html.escape(obs)}</td></tr>"
        for c, e, o, obs in campos
    )
    return f"""
    <div class="ficha-page">
      <div class="ficha-head">
        <div>
          <div class="ficha-brand">ODANC AREQUIPA</div>
          <h1>Ficha de validación</h1>
          <p>{html.escape(titulo)}</p>
        </div>
        <div class="ficha-stamp">PROTOTIPO<br>v0.4.1</div>
      </div>

      <table class="ficha-meta">
        <tr><td class="label">Grupo documental</td><td>{html.escape(grupo)}</td><td class="label">Unidad</td><td>{html.escape(unidad)}</td></tr>
        <tr><td class="label">Documento</td><td>{html.escape(titulo)}</td><td class="label">Estado</td><td>{html.escape(estado)}</td></tr>
        <tr><td class="label">Versión</td><td>Prototipo v0.4.1</td><td class="label">Fecha</td><td>02/11/2026</td></tr>
      </table>

      <h2>1. Datos del documento</h2>
      <table class="grid">
        <thead><tr><th style="width:22%">Campo</th><th style="width:31%">Dato de ejemplo</th><th style="width:12%">¿Obligatorio?</th><th>Observación</th></tr></thead>
        <tbody>{filas}</tbody>
      </table>

      <h2>2. Contenido por validar</h2>
      <p><strong>Base legal:</strong> {html.escape(base_legal) if base_legal else ""}</p>
      <div class="lines"><div class="line"></div></div>
      <p><strong>Plazo:</strong> {html.escape(plazo) if plazo else ""}</p>
      <div class="lines"><div class="line short"></div></div>
      <p><strong>Competencia:</strong> {html.escape(competencia) if competencia else ""}</p>
      <div class="lines"><div class="line"></div></div>

      <h2>3. Flujo de revisión</h2>
      <table class="grid">
        <thead><tr><th style="width:18%">Etapa</th><th style="width:42%">Área / cargo</th><th>Observación</th></tr></thead>
        <tbody>
          <tr><td>Elabora</td><td></td><td></td></tr>
          <tr><td>Revisa</td><td></td><td></td></tr>
          <tr><td>Aprueba</td><td></td><td></td></tr>
          <tr><td>Firma</td><td></td><td></td></tr>
          <tr><td>Notifica</td><td></td><td></td></tr>
        </tbody>
      </table>

      {'<div class="page-break"></div>' if pagina_dos else ''}
      <h2>4. Observaciones</h2>
      <p class="small">{html.escape(observaciones) if observaciones else "Registre aquí los campos que deben cambiarse, eliminarse o agregarse."}</p>
      <div class="lines"><div class="line"></div><div class="line"></div></div>

      <h2>5. Conformidad</h2>
      <p><span class="check">[ ]</span> Conforme &nbsp;&nbsp; <span class="check">[ ]</span> Conforme con observaciones &nbsp;&nbsp; <span class="check">[ ]</span> Requiere nuevo prototipo &nbsp;&nbsp; <span class="check">[ ]</span> No corresponde</p>

      <table class="firma-ficha">
        <tr><td style="width:18%">Nombre:</td><td class="linea" style="width:42%"></td><td style="width:12%">Cargo:</td><td class="linea"></td></tr>
        <tr><td>Fecha:</td><td class="linea"></td><td>Firma:</td><td class="linea"></td></tr>
      </table>

      <div class="ficha-footer">Documento de trabajo — Prototipo v0.4.1 — Sin validez oficial</div>
    </div>
    """


def ficha_general() -> str:
    return ficha_documento(
        "Resolución General – Calificación",
        "Resolución General",
        "Calificación",
        "Propuesta por validar",
        [
            ("Expediente", "01442-2025", "Sí", ""),
            ("Partes", "Juan Pérez", "Sí", ""),
            ("Unidad", "Calificación", "Sí", ""),
            ("Referencia", "Resolución N.° 8-2026-ODANC", "Sí", ""),
            ("Notificación", "02/11/2026", "Sí", "Viene del Módulo 1"),
            ("Vencimiento", "23/11/2026", "Sí", "Viene del Módulo 1"),
            ("Decisión", "[por validar]", "Sí", ""),
            ("Órgano destinatario", "[por validar]", "Sí", ""),
            ("Firmante", "Max Marco Delfín Rivera Dueñas", "Sí", ""),
            ("Cargo", "Jefe de la ODANC – PJ", "Sí", ""),
            ("Iniciales", "MMDRD", "Sí", ""),
        ],
        "",
        "",
        "",
        pagina_dos=False,
    )


def ficha_informe() -> str:
    return ficha_documento(
        "Informe – Calificación",
        "Informe",
        "Calificación",
        "Propuesta por validar",
        [
            ("Expediente", "01442-2025", "Sí", ""),
            ("Investigado", "Juan Pérez", "Sí", ""),
            ("Unidad", "Calificación", "Sí", ""),
            ("Origen", "Segundo Juzgado de Paz de Paucarpata", "Sí", ""),
            ("Referencia", "Resolución N.° 8-2026-ODANC", "Sí", ""),
            ("Fecha", "02/11/2026", "Sí", ""),
            ("Antecedentes", "[por validar]", "Sí", ""),
            ("Análisis", "[por validar]", "Sí", ""),
            ("Conclusión", "[por validar]", "Sí", ""),
            ("Recomendación", "[por validar]", "Sí", ""),
            ("Firmante", "Max Marco Delfín Rivera Dueñas", "Sí", ""),
            ("Cargo", "Jefe de la ODANC – PJ", "Sí", ""),
            ("Iniciales", "MMDRD", "Sí", ""),
        ],
        "",
        "",
        "",
        pagina_dos=True,
    )


def ficha_consentida() -> str:
    return ficha_documento(
        "Consentida – Jefatura / Juez de Paz",
        "Resolución Consentida",
        "Jefatura / Juez de Paz",
        "Base proporcionada",
        [
            ("Queja N°", "01442-2025", "Sí", ""),
            ("Investigación", "Opcional", "No", ""),
            ("Quejado", "Opcional", "No", ""),
            ("Origen", "Segundo Juzgado de Paz de Paucarpata", "Sí", ""),
            ("Resolución N°", "9", "Sí", ""),
            ("Resolución consentida N°", "8", "Sí", ""),
            ("Fecha de resolución consentida", "30/06/2026", "Sí", ""),
            ("Notificación 1", "01/07/2026", "Sí", ""),
            ("Foja 1", "113", "Sí", ""),
            ("Notificación 2", "27/07/2026", "Sí", ""),
            ("Foja 2", "114", "Sí", ""),
            ("Fecha de la resolución", "25/08/2026", "Sí", ""),
            ("Considerando", "Texto base proporcionado", "Sí", "Validar vigencia"),
            ("Parte resolutiva", "Texto base proporcionado", "Sí", "Validar alcance"),
            ("Firmante", "Max Marco Delfín Rivera Dueñas", "Sí", ""),
            ("Cargo", "Jefe de la ODANC – PJ", "Sí", ""),
            ("Iniciales", "MMDRD", "Sí", ""),
        ],
        "Artículo 35 numeral 2 del Reglamento del Procedimiento Disciplinario de Juez de Paz, aprobado por Resolución Administrativa N° 297-2015-CE-PJ.",
        "15 días hábiles, según el cálculo del Módulo 1.",
        "Jefatura de la ODANC – Juez de Paz.",
        "Este formato es la base proporcionada. Validar si el texto y los plazos siguen vigentes.",
        pagina_dos=True,
    )


def wrap_doc(title: str, body: str, css: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>{html.escape(title)}</title>
<style>{css}</style>
</head>
<body>
{body}
<div class="doc-watermark" aria-hidden="true">BORRADOR</div>
</body>
</html>"""


def wrap_ficha(title: str, body: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>{html.escape(title)}</title>
<style>{FICHA_CSS}</style>
</head>
<body>
{body}
</body>
</html>"""


def word_wrap(title: str, body: str, css: str) -> str:
    return f"""<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>{html.escape(title)}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>{css}</style>
</head>
<body>
{body}
</body>
</html>"""


def exportar_pdf(html_path: Path, pdf_path: Path) -> None:
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    result = subprocess.run(
        [
            str(CHROME),
            "--headless=new",
            "--no-sandbox",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={pdf_path}",
            html_path.as_uri(),
        ],
        capture_output=True,
        text=True,
        timeout=90,
    )
    if result.returncode != 0 or not pdf_path.exists():
        raise RuntimeError(f"No se pudo generar {pdf_path.name}: {result.stderr[-800:]}")


def escribir_documento(nombre: str, titulo: str, body: str, subdir: str, es_ficha: bool = False) -> None:
    css = FICHA_CSS if es_ficha else DOC_CSS
    full_html = wrap_ficha(titulo, body) if es_ficha else wrap_doc(titulo, body, css)
    html_path = HTML_TMP / f"{nombre}.html"
    html_path.write_text(full_html, encoding="utf-8")

    destino = OUT / subdir
    destino.mkdir(parents=True, exist_ok=True)
    pdf_path = destino / f"{nombre}.pdf"
    exportar_pdf(html_path, pdf_path)

    word = word_wrap(titulo, body, css)
    (destino / f"{nombre}.doc").write_text("\ufeff" + word, encoding="utf-8")


def escribir_leeme() -> None:
    texto = """ODANC AREQUIPA — PROTOTIPOS DOCUMENTALES v0.4.1
============================================================

Contenido
---------
Documentos/
  Resolucion-General-Calificacion.doc / .pdf
  Informe-Calificacion.doc / .pdf

Referencia/
  Consentida-Jefatura-Juez-de-Paz.docx / .pdf
  Documento base proporcionado por la ODANC. No se modificó.

Fichas/
  Ficha-Validacion-Resolucion-General-Calificacion.doc / .pdf
  Ficha-Validacion-Informe-Calificacion.doc / .pdf
  Ficha-Validacion-Consentida-Jefatura.doc / .pdf

Matriz-validacion.csv
  Lista de los 13 documentos previstos y su estado.

Cómo revisar
------------
1. Abra el PDF para ver el diseño final.
2. Use el .doc si necesita editar el texto o completar campos.
3. Los campos resaltados en amarillo deben ser completados o validados.
4. Registre las observaciones en la ficha correspondiente.
5. Marque la conformidad en la ficha.

Estados
-------
Propuesta por validar : documento completo en su estructura, pendiente de revisión.
Base proporcionada    : documento entregado por la ODANC, sin cambios.
Estructura por validar: variante sin formato oficial; solo referencia.

Importante
----------
- Los documentos son prototipos y no tienen validez oficial.
- La marca de agua BORRADOR debe mantenerse hasta la aprobación.
- La firma sigue siendo responsabilidad del personal.
- El .doc es editable y compatible con Word, pero no es un .docx nativo.
- Word puede mostrar un aviso de formato al abrir el .doc; confirme que desea abrirlo.
- Los PDF se generaron en A4 con las imágenes embebidas.

Siguiente paso
--------------
Revisar los tres documentos base. Si se aprueban, se generan las diez
variantes restantes: General para Prevención, Sanción y Apelación; Informe
para esas mismas unidades; y Consentida para las cuatro unidades.
"""
    (OUT / "LEEME.txt").write_text(texto, encoding="utf-8")


def escribir_matriz() -> None:
    filas = [
        ("General", "Calificación", "Resolución General – Calificación", "Propuesta por validar", "Sí", "", ""),
        ("General", "Prevención", "Resolución General – Prevención", "Estructura por validar", "No", "", "Siguiente entrega"),
        ("General", "Sanción", "Resolución General – Sanción", "Estructura por validar", "No", "", "Siguiente entrega"),
        ("General", "Apelación", "Resolución General – Apelación", "Estructura por validar", "No", "", "Siguiente entrega"),
        ("Informe", "Calificación", "Informe – Calificación", "Propuesta por validar", "Sí", "", ""),
        ("Informe", "Prevención", "Informe de la unidad – Prevención", "Estructura por validar", "No", "", "Siguiente entrega"),
        ("Informe", "Sanción", "Informe de la unidad – Sanción", "Estructura por validar", "No", "", "Siguiente entrega"),
        ("Informe", "Apelación", "Informe de la unidad – Apelación", "Estructura por validar", "No", "", "Siguiente entrega"),
        ("Consentida", "Jefatura / Juez de Paz", "Consentida – Jefatura / Juez de Paz", "Base proporcionada", "Sí (referencia)", "", "No modificar sin validación"),
        ("Consentida", "Calificación", "Consentida – Calificación", "Estructura por validar", "No", "", "Siguiente entrega; verificar si aplica"),
        ("Consentida", "Prevención", "Consentida – Prevención", "Estructura por validar", "No", "", "Siguiente entrega; verificar si aplica"),
        ("Consentida", "Sanción", "Consentida – Sanción", "Estructura por validar", "No", "", "Siguiente entrega; verificar si aplica"),
        ("Consentida", "Apelación", "Consentida – Apelación", "Estructura por validar", "No", "", "Siguiente entrega; verificar si aplica"),
    ]
    with (OUT / "Matriz-validacion.csv").open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Grupo", "Unidad", "Documento", "Estado", "Incluido en esta entrega", "Responsable", "Observaciones"])
        writer.writerows(filas)


def main() -> None:
    shutil.rmtree(OUT, ignore_errors=True)
    shutil.rmtree(HTML_TMP, ignore_errors=True)
    OUT.mkdir(parents=True, exist_ok=True)
    HTML_TMP.mkdir(parents=True, exist_ok=True)

    escribir_documento(
        "Resolucion-General-Calificacion",
        "Resolución General – Calificación",
        documento_general(),
        "Documentos",
    )
    escribir_documento(
        "Informe-Calificacion",
        "Informe – Calificación",
        documento_informe(),
        "Documentos",
    )

    referencia = OUT / "Referencia"
    referencia.mkdir(parents=True, exist_ok=True)
    shutil.copy2(BASE / "Consentidas Juez de Paz 1 (1)-1.pdf", referencia / "Consentida-Jefatura-Juez-de-Paz.pdf")
    shutil.copy2(BASE / "Consentidas Juez de Paz 1 (1)-1.docx", referencia / "Consentida-Jefatura-Juez-de-Paz.docx")

    escribir_documento(
        "Ficha-Validacion-Resolucion-General-Calificacion",
        "Ficha de validación – Resolución General – Calificación",
        ficha_general(),
        "Fichas",
        es_ficha=True,
    )
    escribir_documento(
        "Ficha-Validacion-Informe-Calificacion",
        "Ficha de validación – Informe – Calificación",
        ficha_informe(),
        "Fichas",
        es_ficha=True,
    )
    escribir_documento(
        "Ficha-Validacion-Consentida-Jefatura",
        "Ficha de validación – Consentida – Jefatura / Juez de Paz",
        ficha_consentida(),
        "Fichas",
        es_ficha=True,
    )

    escribir_leeme()
    escribir_matriz()

    zip_path = BASE / "entregas" / "ODANC-prototipos-v0.4.1.zip"
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for path in sorted(OUT.rglob("*")):
            if path.is_file():
                z.write(path, path.relative_to(OUT))

    print(f"Paquete generado: {OUT}")
    print(f"ZIP: {zip_path}")


if __name__ == "__main__":
    main()
