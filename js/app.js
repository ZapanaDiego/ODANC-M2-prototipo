/* ==========================================================================
   ODANC Arequipa · Prototipo v0.5.0-alpha2
   Módulo 1 funcional: cálculo de días hábiles, feriados, reloj y persistencia.
   Sin dependencias externas.
   ========================================================================== */

(() => {
  'use strict';

  const APP_VERSION = '0.6.0-prototipo';
  const IMG_ESCUDO = 'data:image/jpeg;base64,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';
  const IMG_PJ = 'data:image/jpeg;base64,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';
  const MAX_DIAS_HABILES = 5000;
  const STORAGE = {
    feriados: 'odanc.proto.feriados.v1',
    reloj: 'odanc.proto.reloj.v1',
    calculo: 'odanc.proto.calculo.v1'
  };

  const ROUTES = {
    plazos: {
      title: 'Módulo 1 · Calculadora de Plazos'
    },
    documentos: {
      title: 'Módulo 2 · Autogenerador Documental'
    }
  };

  const DEFAULT_ROUTE = 'plazos';
  const FERIADOS_FIJOS = [
    [1, 1, 'Año Nuevo'],
    [5, 1, 'Día del Trabajo'],
    [6, 7, 'Batalla de Arica y Día de la Bandera'],
    [6, 29, 'San Pedro y San Pablo'],
    [7, 23, 'Día de la Fuerza Aérea del Perú'],
    [7, 28, 'Fiestas Patrias'],
    [7, 29, 'Fiestas Patrias (Desfile Militar)'],
    [8, 4, 'Día del Juez y la Jueza'],
    [8, 6, 'Batalla de Junín'],
    [8, 15, 'Aniversario de Arequipa (Ley N.° 24875)'],
    [8, 30, 'Santa Rosa de Lima'],
    [10, 8, 'Combate de Angamos'],
    [11, 1, 'Día de Todos los Santos'],
    [12, 8, 'Inmaculada Concepción'],
    [12, 9, 'Batalla de Ayacucho'],
    [12, 25, 'Navidad']
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const estado = {
    reloj: { manual: false, fecha: '' },
    feriados: [],
    calculo: null
  };

  let toastTimer = null;
  let focoAnteriorModal = null;
  let calculoDescartado = false;
  let almacenamientoDisponible = true;
  let avisoAlmacenamientoMostrado = false;

  /* ------------------------------------------------------------------ */
  /* Fechas                                                              */
  /* ------------------------------------------------------------------ */

  const pad2 = (value) => String(value).padStart(2, '0');

  function fechaISO(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function hoyISO() {
    return fechaISO(new Date());
  }

  function esFechaISO(valor) {
    if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
    const [anio, mes, dia] = valor.split('-').map(Number);
    const fecha = new Date(anio, mes - 1, dia, 12, 0, 0, 0);
    return fecha.getFullYear() === anio
      && fecha.getMonth() === mes - 1
      && fecha.getDate() === dia;
  }

  function aFecha(iso) {
    if (!esFechaISO(iso)) return null;
    const [anio, mes, dia] = iso.split('-').map(Number);
    return new Date(anio, mes - 1, dia, 12, 0, 0, 0);
  }

  function sumarDias(fecha, dias) {
    return new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate() + dias,
      12,
      0,
      0,
      0
    );
  }

  function diferenciaDias(desde, hasta) {
    const a = Date.UTC(desde.getFullYear(), desde.getMonth(), desde.getDate());
    const b = Date.UTC(hasta.getFullYear(), hasta.getMonth(), hasta.getDate());
    return Math.round((b - a) / 86_400_000);
  }

  function esFinDeSemana(fecha) {
    const dia = fecha.getDay();
    return dia === 0 || dia === 6;
  }

  function fechaVisible(iso) {
    if (!esFechaISO(iso)) return iso || '';
    const [anio, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${anio}`;
  }

  function fechaLarga(fecha) {
    const texto = new Intl.DateTimeFormat('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(fecha);
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  function fechaDocumento(fecha) {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  }

  function calcularPascua(anio) {
    const a = anio % 19;
    const b = Math.floor(anio / 100);
    const c = anio % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(anio, mes - 1, dia, 12, 0, 0, 0);
  }

  /* ------------------------------------------------------------------ */
  /* Almacenamiento                                                      */
  /* ------------------------------------------------------------------ */

  function probarAlmacenamiento() {
    try {
      const clave = '__odanc_proto_test__';
      window.localStorage.setItem(clave, '1');
      window.localStorage.removeItem(clave);
      return true;
    } catch {
      return false;
    }
  }

  function leerJSON(clave, respaldo) {
    try {
      const valor = window.localStorage.getItem(clave);
      return valor === null ? respaldo : JSON.parse(valor);
    } catch {
      return respaldo;
    }
  }

  function guardarJSON(clave, valor) {
    try {
      window.localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch {
      almacenamientoDisponible = false;
      return false;
    }
  }

  function borrarJSON(clave) {
    try {
      window.localStorage.removeItem(clave);
    } catch {
      almacenamientoDisponible = false;
    }
  }

  function hashFeriados() {
    return estado.feriados
      .map((feriado) => `${feriado.fecha}|${feriado.categoria}`)
      .sort()
      .join('||');
  }

  function normalizarFeriado(valor) {
    if (!valor || !esFechaISO(valor.fecha)) return null;
    if (valor.categoria !== 'oficial' && valor.categoria !== 'contingencia') return null;

    return {
      id: typeof valor.id === 'string' && valor.id
        ? valor.id
        : `${valor.categoria}:${valor.fecha}`,
      fecha: valor.fecha,
      motivo: typeof valor.motivo === 'string' ? valor.motivo : '',
      categoria: valor.categoria,
      esPredeterminado: valor.esPredeterminado === true,
      movil: valor.movil === true,
      offsetPascua: Number.isInteger(valor.offsetPascua) ? valor.offsetPascua : null
    };
  }

  function esCalculoValido(calculo) {
    return Boolean(
      calculo
      && esFechaISO(calculo.fechaNotificacion)
      && esFechaISO(calculo.fechaVencimiento)
      && Number.isInteger(calculo.diasHabiles)
      && calculo.diasHabiles >= 1
      && calculo.diasHabiles <= MAX_DIAS_HABILES
      && Number.isFinite(calculo.diasNaturales)
      && typeof calculo.notificacionElectronica === 'boolean'
      && typeof calculo.feriadosHash === 'string'
    );
  }

  function cargarEstado() {
    estado.reloj = { manual: false, fecha: hoyISO() };

    const reloj = leerJSON(STORAGE.reloj, null);
    if (reloj && typeof reloj.manual === 'boolean' && esFechaISO(reloj.fecha)) {
      estado.reloj = {
        manual: reloj.manual,
        fecha: reloj.manual ? reloj.fecha : hoyISO()
      };
    }

    const feriados = leerJSON(STORAGE.feriados, []);
    if (Array.isArray(feriados)) {
      estado.feriados = feriados.map(normalizarFeriado).filter(Boolean);
    }

    const calculo = leerJSON(STORAGE.calculo, null);
    if (calculo) {
      if (esCalculoValido(calculo) && calculo.feriadosHash === hashFeriados()) {
        estado.calculo = calculo;
      } else {
        calculoDescartado = true;
        borrarJSON(STORAGE.calculo);
      }
    }
  }

  function guardarFeriados() {
    guardarJSON(STORAGE.feriados, estado.feriados);
  }

  function guardarReloj() {
    guardarJSON(STORAGE.reloj, estado.reloj);
  }

  function guardarCalculo() {
    if (estado.calculo) {
      guardarJSON(STORAGE.calculo, estado.calculo);
    } else {
      borrarJSON(STORAGE.calculo);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Feriados base                                                       */
  /* ------------------------------------------------------------------ */

  function generarFeriadosBase(anio) {
    const lista = FERIADOS_FIJOS.map(([mes, dia, motivo]) => {
      const fecha = fechaISO(new Date(anio, mes - 1, dia, 12, 0, 0, 0));
      return {
        id: `base:${fecha}`,
        fecha,
        motivo,
        categoria: 'oficial',
        esPredeterminado: true,
        movil: false,
        offsetPascua: null
      };
    });

    const pascua = calcularPascua(anio);
    [[-3, 'Jueves Santo'], [-2, 'Viernes Santo']].forEach(([offset, motivo]) => {
      const fecha = fechaISO(sumarDias(pascua, offset));
      lista.push({
        id: `base:${fecha}`,
        fecha,
        motivo,
        categoria: 'oficial',
        esPredeterminado: true,
        movil: true,
        offsetPascua: offset
      });
    });

    return lista;
  }

  function agregarBaseSilencioso(anio, feriados = estado.feriados) {
    let agregados = 0;
    generarFeriadosBase(anio).forEach((feriado) => {
      if (!feriados.some((existente) => existente.fecha === feriado.fecha)) {
        feriados.push(feriado);
        agregados += 1;
      }
    });
    return agregados;
  }

  /* ------------------------------------------------------------------ */
  /* Motor de cálculo                                                    */
  /* ------------------------------------------------------------------ */

  function construirInhabiles(feriados) {
    const inhabiles = new Set();

    feriados.forEach((feriado) => {
      const fecha = aFecha(feriado.fecha);
      if (!fecha) return;

      // Un feriado oficial que cae en fin de semana no se traslada.
      if (feriado.categoria === 'oficial' && esFinDeSemana(fecha)) return;
      inhabiles.add(feriado.fecha);
    });

    return inhabiles;
  }

  function calcularPlazo(fechaNotificacion, diasHabiles, notificacionElectronica, feriados) {
    if (!esFechaISO(fechaNotificacion)) {
      throw new Error('La fecha de notificación no es válida.');
    }
    if (!Number.isInteger(diasHabiles) || diasHabiles < 1) {
      throw new Error('El plazo debe ser un número entero de días hábiles mayor a cero.');
    }
    if (diasHabiles > MAX_DIAS_HABILES) {
      throw new Error(`El plazo no puede superar los ${MAX_DIAS_HABILES} días hábiles.`);
    }

    const inicio = aFecha(fechaNotificacion);
    const inhabiles = construirInhabiles(feriados || []);
    const diasPrevios = notificacionElectronica ? 2 : 0;

    let previosPendientes = diasPrevios;
    let fechaEfectos = null;
    let fechaInicioPlazo = null;
    let habilesTranscurridos = 0;
    let cursor = inicio;
    let iteraciones = 0;

    while (habilesTranscurridos < diasHabiles) {
      iteraciones += 1;
      if (iteraciones > 250_000) {
        throw new Error('No se pudo calcular el plazo con el calendario actual.');
      }

      cursor = sumarDias(cursor, 1);
      const clave = fechaISO(cursor);

      if (esFinDeSemana(cursor) || inhabiles.has(clave)) continue;

      if (previosPendientes > 0) {
        previosPendientes -= 1;
        if (previosPendientes === 0) fechaEfectos = clave;
        continue;
      }

      if (fechaInicioPlazo === null) fechaInicioPlazo = clave;
      habilesTranscurridos += 1;
    }

    const diasNaturales = diferenciaDias(inicio, cursor);
    const semanas = Math.round((diasNaturales / 7) * 10) / 10;

    return {
      fechaVencimiento: fechaISO(cursor),
      diasNaturales,
      semanas,
      diasHabilesPrevios: diasPrevios,
      fechaEfectos,
      fechaInicioPlazo
    };
  }

  function calcularConCalendario(fechaNotificacion, diasHabiles, notificacionElectronica) {
    let resultado = calcularPlazo(
      fechaNotificacion,
      diasHabiles,
      notificacionElectronica,
      estado.feriados
    );

    const aniosAgregados = [];
    const hayBase = () => estado.feriados.some((feriado) => feriado.esPredeterminado);

    if (hayBase()) {
      for (let intento = 0; intento < 10; intento += 1) {
        const anioInicio = Number(fechaNotificacion.slice(0, 4));
        const anioVencimiento = Number(resultado.fechaVencimiento.slice(0, 4));
        let agregoAlguno = false;

        for (let anio = anioInicio; anio <= anioVencimiento; anio += 1) {
          const tieneBase = estado.feriados.some(
            (feriado) => feriado.esPredeterminado && Number(feriado.fecha.slice(0, 4)) === anio
          );
          if (tieneBase) continue;

          const agregados = agregarBaseSilencioso(anio);
          if (agregados > 0) {
            aniosAgregados.push(anio);
            agregoAlguno = true;
          }
        }

        if (!agregoAlguno) break;

        resultado = calcularPlazo(
          fechaNotificacion,
          diasHabiles,
          notificacionElectronica,
          estado.feriados
        );
      }
    }

    resultado.aniosAgregados = [...new Set(aniosAgregados)];

    const oficiales = estado.feriados.filter((feriado) => feriado.categoria === 'oficial').length;
    if (estado.feriados.length === 0) {
      resultado.aviso = 'Sin feriados cargados: solo se excluyen fines de semana.';
    } else if (oficiales === 0) {
      resultado.aviso = 'Sin feriados oficiales: solo se descuentan contingencias.';
    } else {
      resultado.aviso = null;
    }

    return resultado;
  }

  /* ------------------------------------------------------------------ */
  /* Render: reloj                                                       */
  /* ------------------------------------------------------------------ */

  function pintarReloj() {
    const fecha = aFecha(estado.reloj.fecha) || new Date();
    const visible = fechaVisible(estado.reloj.fecha);
    const larga = fechaLarga(fecha);

    const chipFecha = $('#chip-fecha');
    if (chipFecha) {
      chipFecha.textContent = visible;
      const chip = chipFecha.closest('.chip');
      if (chip) chip.title = larga;
    }

    const badge = $('#badge-modo-manual');
    if (badge) badge.hidden = !estado.reloj.manual;

    const banner = $('#banner-fecha-manual');
    if (banner) banner.hidden = !estado.reloj.manual;

    document.body.classList.toggle('manual-activo', estado.reloj.manual);

    const textoFechaManual = $('#texto-fecha-manual');
    if (textoFechaManual) textoFechaManual.textContent = visible;

    const alertaModal = $('#modal-alerta-manual');
    if (alertaModal) alertaModal.hidden = !estado.reloj.manual;

    const btnDesactivarModal = $('#btn-desactivar-manual');
    if (btnDesactivarModal) btnDesactivarModal.hidden = !estado.reloj.manual;

    const textoBase = $('#texto-feriados-base');
    if (textoBase) textoBase.textContent = `Cargar feriados base ${fecha.getFullYear()}`;

    $$('[data-fecha-documento]').forEach((elemento) => {
      elemento.textContent = `Arequipa, ${fechaDocumento(fecha)}`;
    });
  }

  /* ------------------------------------------------------------------ */
  /* Render: feriados                                                    */
  /* ------------------------------------------------------------------ */

  function crearTituloGrupo(contenedor, texto) {
    const titulo = document.createElement('div');
    titulo.className = 'holiday-group-title';
    titulo.textContent = texto;
    contenedor.appendChild(titulo);
  }

  function crearListaVacia(contenedor, texto) {
    const vacio = document.createElement('div');
    vacio.className = 'holiday-empty';
    vacio.textContent = texto;
    contenedor.appendChild(vacio);
  }

  function crearChipFeriado(feriado, esProyectado = false) {
    const chip = document.createElement('div');
    chip.className = `holiday-chip${esProyectado ? ' is-projected' : ''}`;

    const fecha = document.createElement('span');
    fecha.className = 'holiday-chip-date';
    fecha.textContent = fechaVisible(feriado.fecha);

    const motivo = document.createElement('span');
    motivo.className = 'holiday-chip-reason';
    motivo.textContent = feriado.motivo || 'Sin descripción';

    const idEliminar = esProyectado ? feriado.idOriginal : feriado.id;
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'holiday-chip-remove';
    boton.setAttribute(
      'aria-label',
      esProyectado
        ? `Eliminar el feriado original del ${fechaVisible(feriado.fechaOriginal)}`
        : `Eliminar el registro del ${fechaVisible(feriado.fecha)}`
    );
    boton.title = esProyectado
      ? `Eliminar el feriado original del ${fechaVisible(feriado.fechaOriginal)}`
      : 'Eliminar registro';
    boton.innerHTML = '<svg class="i" aria-hidden="true"><use href="#xmark"></use></svg>';
    boton.addEventListener('click', () => eliminarFeriado(idEliminar));

    if (esProyectado) {
      chip.title = `Proyección ${feriado.fecha.slice(0, 4)} del feriado original del ${fechaVisible(feriado.fechaOriginal)}`;
    }

    chip.append(fecha, motivo, boton);
    return chip;
  }

  function proximaOcurrencia(feriado, referencia) {
    const anio = referencia.getFullYear();
    let candidato;

    if (feriado.movil && Number.isInteger(feriado.offsetPascua)) {
      candidato = sumarDias(calcularPascua(anio), feriado.offsetPascua);
    } else {
      const original = aFecha(feriado.fecha);
      if (!original) return null;
      candidato = new Date(anio, original.getMonth(), original.getDate(), 12, 0, 0, 0);
    }

    if (candidato < referencia) {
      // Siguiente ocurrencia anual exacta, sin desfase por años bisiestos.
      if (feriado.movil && Number.isInteger(feriado.offsetPascua)) {
        candidato = sumarDias(calcularPascua(anio + 1), feriado.offsetPascua);
      } else {
        const original = aFecha(feriado.fecha);
        candidato = new Date(anio + 1, original.getMonth(), original.getDate(), 12, 0, 0, 0);
      }
    }

    return fechaISO(candidato);
  }

  function pintarFeriados() {
    const contOficiales = $('#lista-feriados-oficiales');
    const contContingencias = $('#lista-feriados-contingencias');
    const badgeOficial = $('#badge-count-oficial');
    const badgeContingencia = $('#badge-count-contingencia');

    if (!contOficiales || !contContingencias) return;

    const referencia = aFecha(estado.reloj.fecha) || new Date();
    const oficiales = estado.feriados.filter((feriado) => feriado.categoria === 'oficial');
    const contingencias = estado.feriados.filter((feriado) => feriado.categoria === 'contingencia');

    if (badgeOficial) badgeOficial.textContent = String(oficiales.length);
    if (badgeContingencia) badgeContingencia.textContent = String(contingencias.length);

    contOficiales.replaceChildren();
    contContingencias.replaceChildren();

    const fechasOficiales = new Set(oficiales.map((feriado) => feriado.fecha));
    const actuales = oficiales
      .filter((feriado) => (aFecha(feriado.fecha) || referencia) >= referencia)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
    const pasados = oficiales
      .filter((feriado) => (aFecha(feriado.fecha) || referencia) < referencia)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    const proyectados = new Map();
    const fechasProyectadas = new Set();
    const idsProyectados = new Set();

    pasados.forEach((feriado) => {
      const fechaProyectada = proximaOcurrencia(feriado, referencia);
      if (!fechaProyectada) return;
      if (fechasOficiales.has(fechaProyectada)) return;
      if (fechasProyectadas.has(fechaProyectada)) return;

      fechasProyectadas.add(fechaProyectada);
      idsProyectados.add(feriado.id);

      const anioProyeccion = fechaProyectada.slice(0, 4);
      if (!proyectados.has(anioProyeccion)) proyectados.set(anioProyeccion, []);

      proyectados.get(anioProyeccion).push({
        ...feriado,
        fecha: fechaProyectada,
        fechaOriginal: feriado.fecha,
        idOriginal: feriado.id,
        esProyectado: true
      });
    });

    if (actuales.length > 0) {
      crearTituloGrupo(contOficiales, 'Próximos feriados');
      actuales.forEach((feriado) => contOficiales.appendChild(crearChipFeriado(feriado)));
    }

    [...proyectados.keys()].sort().forEach((anio) => {
      crearTituloGrupo(contOficiales, `Proyección ${anio}`);
      proyectados.get(anio)
        .sort((a, b) => a.fecha.localeCompare(b.fecha))
        .forEach((feriado) => contOficiales.appendChild(crearChipFeriado(feriado, true)));
    });

    const transcurridos = pasados.filter((feriado) => !idsProyectados.has(feriado.id));
    if (transcurridos.length > 0) {
      crearTituloGrupo(contOficiales, 'Transcurridos');
      transcurridos
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
        .forEach((feriado) => contOficiales.appendChild(crearChipFeriado(feriado)));
    }

    if (actuales.length === 0 && proyectados.size === 0 && transcurridos.length === 0) {
      crearListaVacia(
        contOficiales,
        'Sin feriados cargados.'
      );
    }

    const proximas = contingencias
      .filter((feriado) => (aFecha(feriado.fecha) || referencia) >= referencia)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
    const pasadas = contingencias
      .filter((feriado) => (aFecha(feriado.fecha) || referencia) < referencia)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));

    if (proximas.length > 0) {
      crearTituloGrupo(contContingencias, 'Próximas');
      proximas.forEach((feriado) => contContingencias.appendChild(crearChipFeriado(feriado)));
    }

    if (pasadas.length > 0) {
      crearTituloGrupo(contContingencias, 'Transcurridas');
      pasadas.forEach((feriado) => contContingencias.appendChild(crearChipFeriado(feriado)));
    }

    if (contingencias.length === 0) {
      crearListaVacia(contContingencias, 'Sin contingencias.');
    }

    pintarAvisoCalendario();
  }

  function pintarAvisoCalendario() {
    const aviso = $('#aviso-calendario');
    if (!aviso) return;

    const oficiales = estado.feriados.filter((feriado) => feriado.categoria === 'oficial').length;

    if (estado.feriados.length === 0) {
      aviso.textContent = 'Sin feriados cargados: solo se excluyen fines de semana.';
      aviso.hidden = false;
    } else if (oficiales === 0) {
      aviso.textContent = 'Sin feriados oficiales: solo se descuentan contingencias.';
      aviso.hidden = false;
    } else {
      aviso.hidden = true;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Render: resultado y Módulo 2                                        */
  /* ------------------------------------------------------------------ */

  function pintarResultado(calculo) {
    const fechaEl = $('#resultado-fecha');
    const detalleEl = $('#resultado-detalle');
    const notificacionEl = $('#resultado-notificacion');
    const avisoEl = $('#resultado-aviso');

    if (!fechaEl || !detalleEl) return;

    if (!calculo) {
      fechaEl.textContent = '--/--/----';
      detalleEl.textContent = 'Pulse «Calcular plazo».';
      if (notificacionEl) notificacionEl.hidden = true;
      if (avisoEl) avisoEl.hidden = true;
      return;
    }

    const fecha = aFecha(calculo.fechaVencimiento);
    if (!fecha) {
      pintarResultado(null);
      return;
    }

    const semanas = Number.isFinite(calculo.semanas)
      ? calculo.semanas
      : Math.round((calculo.diasNaturales / 7) * 10) / 10;

    fechaEl.textContent = fechaLarga(fecha);
    detalleEl.textContent = `+${calculo.diasNaturales} días naturales (~${Number(semanas).toFixed(1)} semanas)`;

    if (notificacionEl) {
      notificacionEl.hidden = !(calculo.notificacionElectronica && calculo.diasHabilesPrevios === 2);
    }

    if (avisoEl) {
      const avisos = [];
      if (Array.isArray(calculo.aniosAgregados) && calculo.aniosAgregados.length > 0) {
        avisos.push(`Se agregaron los feriados base ${calculo.aniosAgregados.join(', ')} para completar el cálculo.`);
      }
      if (calculo.aviso) avisos.push(calculo.aviso);

      if (avisos.length > 0) {
        avisoEl.textContent = avisos.join(' ');
        avisoEl.hidden = false;
      } else {
        avisoEl.hidden = true;
      }
    }
  }

  function pintarModulo2Fechas() {
    const notificacion = $('#doc-fecha-notificacion');
    const vencimiento = $('#doc-fecha-vencimiento');
    const dias = $('#doc-dias');
    const pill = $('#doc-fechas-pill');
    const ayudaFechas = $('#texto-fechas-ayuda');

    if (!notificacion || !vencimiento || !dias) return;

    const calculo = calculoVigente();
    const esDocumento = Boolean(documentoActualId);

    if (ayudaFechas) {
      if (esDocumento) {
        ayudaFechas.textContent = calculo
          ? 'Los marcadores usan el cálculo guardado con este documento.'
          : 'Este documento no tiene un cálculo vinculado.';
      } else if (calculo) {
        ayudaFechas.textContent = 'Cálculo de referencia. Aplíquelo a la persona correspondiente en Contenido.';
      } else {
        ayudaFechas.textContent = 'No hay un cálculo reciente. Calcule en el Módulo 1 o complete las fechas manualmente.';
      }
    }

    if (!calculo) {
      notificacion.textContent = '--/--/----';
      vencimiento.textContent = '--/--/----';
      dias.textContent = '15';
      if (pill) {
        pill.className = 'status-pill pending';
        pill.textContent = 'Sin cálculo';
      }
    } else {
      notificacion.textContent = fechaVisible(calculo.fechaNotificacion);
      vencimiento.textContent = fechaVisible(calculo.fechaVencimiento);
      dias.textContent = String(calculo.diasHabiles);

      if (pill) {
        pill.className = 'status-pill ok';
        pill.textContent = esDocumento ? 'Calculado · documento' : 'Calculado';
      }
    }

    actualizarDocumento();
  }

  function aplicarVinculoNotificacion() {
    const select = $('#vincular-notificacion');
    if (!select) return;

    const destinoId = select.value;
    if (!destinoId) return;

    let calculo = calculoVigente();
    let usarCalculoGlobal = false;

    if (!calculo && estado.calculo) {
      calculo = estado.calculo;
      usarCalculoGlobal = true;
    }

    if (!calculo) {
      select.value = '';
      showToast('Calcule un plazo en el Módulo 1 antes de vincular la fecha.');
      return;
    }

    const destino = document.getElementById(destinoId);
    if (!destino) {
      select.value = '';
      return;
    }

    if (usarCalculoGlobal) {
      calculoDocumento = { ...calculo };
    }

    destino.value = calculo.fechaNotificacion;
    marcarInvalido(destino, false);
    pintarModulo2Fechas();
    actualizarDocumento();
    programarGuardado();
    showToast(
      `Fecha del Módulo 1 aplicada a ${destinoId === 'sol-notif1' ? 'Notificación 1' : 'Notificación 2'}.`
    );
  }

  /* ------------------------------------------------------------------ */
  /* Módulo 2: resolución consentida                                     */
  /* ------------------------------------------------------------------ */

  const MESES_CONSENTIDA = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  function escaparHtml(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, (caracter) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[caracter]));
  }

  function textoAHtml(valor) {
    return escaparHtml(valor).replace(/\r?\n/g, '<br>');
  }

  function parrafosDocumento(valor) {
    const limpio = String(valor ?? '').trim();
    if (!limpio) return '<p class="doc-para">—</p>';
    return limpio
      .split(/\n\s*\n/)
      .map((parrafo) => `<p class="doc-para">${textoAHtml(parrafo.trim())}</p>`)
      .join('');
  }

  function numeroALetras(valor) {
    if (valor === null || valor === undefined || String(valor).trim() === '') return '—';

    const numero = Math.trunc(Number(valor));
    if (!Number.isFinite(numero) || numero < 0 || numero > 9999) return '—';
    if (numero === 0) return 'cero';

    const unidades = [
      '', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
      'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete',
      'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés',
      'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'
    ];
    const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    const tramo = (n) => {
      if (n < 30) return unidades[n];
      if (n < 100) {
        const decena = Math.floor(n / 10);
        const unidad = n % 10;
        return decenas[decena] + (unidad ? ` y ${unidades[unidad]}` : '');
      }
      if (n === 100) return 'cien';
      const centena = Math.floor(n / 100);
      const resto = n % 100;
      return centenas[centena] + (resto ? ` ${tramo(resto)}` : '');
    };

    const miles = Math.floor(numero / 1000);
    const resto = numero % 1000;
    let texto = '';

    if (miles === 1) texto = 'mil';
    else if (miles > 1) texto = `${tramo(miles)} mil`;
    if (resto) texto += `${texto ? ' ' : ''}${tramo(resto)}`;

    return texto;
  }

  function capitalizarTexto(texto) {
    return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;
  }

  function fechaEnLetras(iso, usarDel = false) {
    const fecha = aFecha(iso);
    if (!fecha) return '—';
    const dia = numeroALetras(fecha.getDate());
    const mes = MESES_CONSENTIDA[fecha.getMonth()];
    const anio = numeroALetras(fecha.getFullYear());
    return `${dia} de ${mes} ${usarDel ? 'del' : 'de'} ${anio}`;
  }

  function fechaLineaLetras(iso) {
    const fecha = aFecha(iso);
    if (!fecha) return '—';
    const anio = numeroALetras(fecha.getFullYear());
    const mes = capitalizarTexto(MESES_CONSENTIDA[fecha.getMonth()]);
    const dia = numeroALetras(fecha.getDate());
    return `Arequipa, ${anio},<br>${mes}, ${dia}.-`;
  }

  function fechasNotificacionLetras(iso1, iso2) {
    const fecha1 = aFecha(iso1);
    const fecha2 = aFecha(iso2);
    if (!fecha1 || !fecha2) return '—';

    if (fecha1.getFullYear() === fecha2.getFullYear() && fecha1.getMonth() === fecha2.getMonth()) {
      return `${numeroALetras(fecha1.getDate())} y ${numeroALetras(fecha2.getDate())} de ${MESES_CONSENTIDA[fecha1.getMonth()]} del ${numeroALetras(fecha1.getFullYear())}`;
    }

    return `${fechaEnLetras(iso1)} y ${fechaEnLetras(iso2)}`;
  }

  function leerConsentida() {
    const valor = (id) => ($(id)?.value ?? '').trim();
    return {
      queja: valor('#sol-queja'),
      investigacion: valor('#sol-investigacion'),
      formato: valor('#doc-formato-consentida'),
      quejado: valor('#sol-quejado'),
      origen: valor('#sol-origen'),
      resolucionActual: valor('#sol-resolucion-actual'),
      resolucionConsentida: valor('#sol-resolucion-consentida'),
      fechaConsentida: valor('#sol-fecha-consentida'),
      notif1: valor('#sol-notif1'),
      foja1: valor('#sol-foja1'),
      notif2: valor('#sol-notif2'),
      foja2: valor('#sol-foja2'),
      fechaActual: valor('#sol-fecha-actual'),
      firmante: valor('#sol-firmante'),
      cargo: valor('#sol-cargo'),
      iniciales: valor('#sol-iniciales'),
      considerando: valor('#sol-considerando'),
      parte: valor('#sol-parte')
    };
  }

  function construirContenidoConsentida() {
    const datos = leerConsentida();
    if (datos.formato === 'pendiente') return '<div class="doc-section">Formato pendiente</div><p class="doc-para">La ODANC aún debe proporcionar o validar el modelo para esta combinación de área y documento.</p>';
    if (datos.formato === 'calificacion') return construirConsentidaCalificacion(datos);
    const numeroConsentida = Math.trunc(Number(datos.resolucionConsentida));

    const resolucionConsentida = Number.isFinite(numeroConsentida) && numeroConsentida > 0
      ? numeroALetras(numeroConsentida)
      : escaparHtml(datos.resolucionConsentida) || '—';

    const fechaConsentidaDe = fechaEnLetras(datos.fechaConsentida, false);
    const fechaConsentidaDel = fechaEnLetras(datos.fechaConsentida, true);
    const fechaLinea = fechaLineaLetras(datos.fechaActual);
    const iniciales = escaparHtml(datos.iniciales) || '—';
    const considerando = textoAHtml(datos.considerando) || '—';
    const parte = textoAHtml(datos.parte) || '—';

    return `
      <table class="doc-head">
        <tr>
          <td><img class="doc-escudo" src="${IMG_ESCUDO}" alt="Escudo del Perú"></td>
          <td><img class="doc-pj" src="${IMG_PJ}" alt="Poder Judicial del Perú"></td>
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
        <span>${escaparHtml(unidadSeleccionada().toUpperCase())}</span>
      </div>
      <div class="doc-rule"></div>

      <table class="doc-fields">
        <tr><td class="label">QUEJA N°</td><td class="colon">:</td><td class="value">${escaparHtml(datos.queja)}</td></tr>
        <tr><td class="label">INVESTIGACIÓN</td><td class="colon">:</td><td class="value">${escaparHtml(datos.investigacion)}</td></tr>
        <tr><td class="label">QUEJADO</td><td class="colon">:</td><td class="value">${escaparHtml(datos.quejado)}</td></tr>
        <tr><td class="label">ORIGEN</td><td class="colon">:</td><td class="value">${escaparHtml(datos.origen)}</td></tr>
      </table>

      <div class="doc-resolution">RESOLUCIÓN N° ${escaparHtml(datos.resolucionActual) || '—'}</div>
      <p class="doc-date">${fechaLinea}</p>

      <div class="doc-section">I. VISTOS Y CONSIDERANDO:</div>
      <p class="doc-para"><strong>PRIMERO:</strong> En fecha ${fechaConsentidaDe}, se emitió la <em>Resolución ${resolucionConsentida}</em>, mediante la cual ${considerando}</p>
      <p class="doc-para"><strong>SEGUNDO:</strong> Se registran las siguientes notificaciones:</p>
      ${notificaciones().map(n=>`<p class="doc-para">${escaparHtml(n.nombre||'[Destinatario pendiente]')} (${escaparHtml(n.rol||'participación por precisar')}): ${fechaVisible(n.fecha)}, por ${escaparHtml(n.medio||'medio por confirmar')}; constancia o foja ${escaparHtml(n.foja||'—')}. Vencimiento registrado: ${fechaVisible(n.vence)}.</p>`).join('') || '<p class="doc-para">[Notificaciones pendientes]</p>'}
      <p class="doc-para"><strong>TERCERO:</strong> ${$('#sol-recursos')?.value==='sin' ? 'Según la revisión registrada, no se presentó recurso impugnatorio. Sustento: '+escaparHtml($('#sol-verificacion').value||'[pendiente]')+'.' : '[Pendiente de verificar la existencia de recursos.]'} El fundamento normativo y la procedencia del consentimiento deben cotejarse con el expediente y el formato validado.</p>

      <div class="doc-section">II. PARTE RESOLUTIVA:</div>
      <p class="doc-para"><strong>1. SE DECLARA CONSENTIDA</strong> la Resolución ${resolucionConsentida}, de fecha ${fechaConsentidaDel}, que resolvió ${parte} <strong>Regístrese y Comuníquese. ${iniciales}</strong></p>

      <div class="doc-signature">
        <p class="doc-signed">Firma pendiente · borrador</p>
        <div class="doc-signature-line"></div>
        <strong>${escaparHtml(datos.firmante) || '—'}</strong>
        <span>${escaparHtml(datos.cargo) || '—'}</span>
        <span>Corte Superior de Justicia de Arequipa</span>
      </div>
    `;
  }

  function construirConsentidaCalificacion(datos) {
    const ns = notificaciones();
    const anterior = escaparHtml(datos.resolucionConsentida) || '—';
    const acto = escaparHtml(datos.considerando) || '[Describir lo resuelto]';
    const decision = escaparHtml(datos.parte) || '[Precisar el extremo]';
    const sinRecurso = $('#sol-recursos')?.value === 'sin';
    return `<div class="doc-title"><span>OFICINA DESCENTRALIZADA DE LA AUTORIDAD NACIONAL DE CONTROL DE AREQUIPA</span><span>UNIDAD DE CALIFICACIÓN E INVESTIGACIÓN PRELIMINAR</span><span>UNIDAD DE PREVENCIÓN · MEMBRETE POR CONFIRMAR</span></div>
      <div class="doc-fields"><strong>EXPEDIENTE N°:</strong> ${escaparHtml(datos.queja)||'—'}</div>
      <div class="doc-resolution">RESOLUCIÓN N° ${escaparHtml(datos.resolucionActual)||'—'}</div>
      <p class="doc-date">${fechaLineaLetras(datos.fechaActual)}</p>
      <div class="doc-section">VISTOS:</div><p class="doc-para">Los actuados del presente expediente.</p>
      <div class="doc-section">CONSIDERANDO:</div>
      <p class="doc-para"><strong>PRIMERO:</strong> La procedencia y el plazo aplicable deben cotejarse con la norma vigente y el expediente. Texto para revisión del área.</p>
      <p class="doc-para"><strong>SEGUNDO:</strong> Mediante Resolución ${anterior}, de fecha ${fechaEnLetras(datos.fechaConsentida)}, se resolvió ${acto}.</p>
      ${ns.map(n=>`<p class="doc-para">Notificación a ${escaparHtml(n.nombre||'—')}: ${fechaVisible(n.fecha)}; constancia ${escaparHtml(n.foja||'—')}; vencimiento registrado ${fechaVisible(n.vence)}.</p>`).join('')}
      <p class="doc-para">${sinRecurso?'Según la revisión registrada, no se presentó recurso.':'[Verificación de recursos pendiente.]'}</p>
      <div class="doc-section">RESUELVE:</div>
      <p class="doc-para"><strong>PRIMERO: DECLARAR CONSENTIDA</strong> la Resolución ${anterior}, en el extremo que ${decision}</p>
      <p class="doc-para"><strong>SEGUNDO:</strong> [Precisar si corresponde archivo, remisión u otra disposición.]</p>
      <p class="doc-para"><strong>REGÍSTRESE Y COMUNÍQUESE.</strong></p>${firmaDocumento(datos)}`;
  }

  function validarConsentida() {
    const reglas = [
      ['#sol-queja', 'Ingrese la queja N°.'],
      ['#sol-origen', 'Ingrese el origen.'],
      ['#sol-resolucion-actual', 'Ingrese la resolución N°.'],
      ['#sol-resolucion-consentida', 'Ingrese la resolución consentida.'],
      ['#sol-fecha-consentida', 'Seleccione la fecha de la resolución consentida.'],
      ['#sol-fecha-actual', 'Seleccione la fecha de la resolución.'],
      ['#sol-firmante', 'Ingrese el firmante.'],
      ['#sol-cargo', 'Ingrese el cargo.'],
      ['#sol-iniciales', 'Ingrese las iniciales.'],
      ['#sol-considerando', 'Ingrese el considerando.'],
      ['#sol-parte', 'Ingrese la parte resolutiva.']
    ];

    return validarCamposDocumento(reglas);
  }

  function togglePantallaCompleta() {
    const panel = $('.preview-panel');
    const boton = $('#btn-pantalla-completa');
    const texto = $('#texto-pantalla-completa');
    if (!panel) return;

    const activo = panel.classList.toggle('is-fullscreen');
    document.body.classList.toggle('doc-fullscreen', activo);
    if (boton) boton.setAttribute('aria-expanded', String(activo));
    if (texto) texto.textContent = activo ? 'Cerrar' : 'Pantalla completa';
  }

  function cerrarPantallaCompleta() {
    const panel = $('.preview-panel');
    if (!panel || !panel.classList.contains('is-fullscreen')) return;
    panel.classList.remove('is-fullscreen');
    document.body.classList.remove('doc-fullscreen');
    const boton = $('#btn-pantalla-completa');
    const texto = $('#texto-pantalla-completa');
    if (boton) boton.setAttribute('aria-expanded', 'false');
    if (texto) texto.textContent = 'Pantalla completa';
  }


  /* ------------------------------------------------------------------ */
  /* Módulo 2: catálogo, grupos y plantillas                             */
  /* ------------------------------------------------------------------ */

  const PLANTILLAS = window.ODANC_PLANTILLAS || null;
  const DOCS = window.ODANC_DOCS || null;
  let grupoDocumento = 'consentida';
  let documentoActualId = null;
  let calculoDocumento = null;
  let guardadoTimer = null;
  let vistaDocumentos = 'nuevo';

  function calculoVigente() {
    if (documentoActualId) return calculoDocumento;
    return estado.calculo;
  }

  function unidadSeleccionada() {
    return $('#doc-unidad')?.value || 'Jefatura / Juez de Paz';
  }

  function grupoActualInfo() {
    if (!PLANTILLAS) {
      return { nombre: 'Resolución Consentida', estado: 'Base proporcionada', descripcion: '' };
    }
    return PLANTILLAS.grupos[grupoDocumento] || PLANTILLAS.grupos.consentida;
  }

  function grupoDisponible(grupo, unidad = unidadSeleccionada()) {
    if (!PLANTILLAS) return grupo === 'consentida';
    const info = PLANTILLAS.grupos[grupo];
    return Boolean(info && info.unidades.includes(unidad));
  }

  function estadoCortoGrupo(grupo, disponible) {
    const unidad = unidadSeleccionada();
    const guion = unidad === 'Jefatura / Juez de Paz' && (grupo === 'general' || grupo === 'informe');
    if (!disponible) {
      return guion
        ? { texto: '—', clase: 'is-none' }
        : { texto: 'Pendiente', clase: 'is-pending' };
    }
    if (grupo === 'consentida') return { texto: 'Base', clase: 'is-base' };
    if (grupo === 'general' && unidad !== 'Calificación') {
      return { texto: 'Estructura', clase: 'is-structure' };
    }
    return { texto: 'Propuesta', clase: 'is-proposal' };
  }

  function estadoLargoGrupo(grupo, unidad) {
    if (grupo === 'consentida') {
      return 'Base proporcionada · pendiente de validación con la Jefatura.';
    }
    if (grupo === 'general' && unidad !== 'Calificación') {
      return `Estructura por validar · pendiente de validación con ${unidad}.`;
    }
    return `Propuesta por validar · pendiente de validación con ${unidad}.`;
  }

  function renderCatalogo() {
    const contenedor = $('#catalogo-matriz');
    if (!contenedor || !PLANTILLAS) return;

    const filas = PLANTILLAS.matriz.map((fila) => {
      const clase = (valor) => {
        if (valor === 'Base') return 'is-base';
        if (valor === 'Propuesta') return 'is-proposal';
        if (valor === 'Estructura') return 'is-structure';
        if (valor === 'Pendiente') return 'is-pending';
        return 'is-none';
      };

      return `<tr>
        <td>${escaparHtml(fila.unidad)}</td>
        <td class="${clase(fila.general)}">${escaparHtml(fila.general)}</td>
        <td class="${clase(fila.consentida)}">${escaparHtml(fila.consentida)}</td>
        <td class="${clase(fila.informe)}">${escaparHtml(fila.informe)}</td>
      </tr>`;
    }).join('');

    contenedor.innerHTML = `<table>
      <thead><tr><th>Unidad</th><th>General</th><th>Consentida</th><th>Informe</th></tr></thead>
      <tbody>${filas}</tbody>
    </table>`;
  }

  function asegurarTextosPlantilla() {
    if (!PLANTILLAS) return;
    const fecha = estado.reloj.fecha || hoyISO();

    if (grupoDocumento === 'general') {
      const considerando = $('#gen-considerando');
      const resuelve = $('#gen-resuelve');
      const fechaInput = $('#gen-fecha');
      if (considerando && !considerando.value.trim()) {
        considerando.value = PLANTILLAS.textos.general.considerando;
      }
      if (resuelve && !resuelve.value.trim()) {
        resuelve.value = PLANTILLAS.textos.general.resuelve;
      }
      if (fechaInput && !fechaInput.value) fechaInput.value = fecha;
    }

    if (grupoDocumento === 'informe') {
      const fechaInput = $('#inf-fecha');
      if (fechaInput && !fechaInput.value) fechaInput.value = fecha;
      const textos = PLANTILLAS.textos.informe;
      [
        ['#inf-antecedentes', 'antecedentes'],
        ['#inf-analisis', 'analisis'],
        ['#inf-conclusion', 'conclusion'],
        ['#inf-recomendacion', 'recomendacion']
      ].forEach(([selector, clave]) => {
        const campo = $(selector);
        if (campo && !campo.value.trim()) campo.value = textos[clave];
      });
    }
  }

  function actualizarSelectorDocumento() {
    const unidad = unidadSeleccionada();

    if (!TIPOS.some(t => t.grupo === grupoDocumento && t.unidades.includes(unidad))) {
      const alternativa = ['general', 'informe', 'consentida'].find((grupo) => grupoDisponible(grupo, unidad));
      if (alternativa) grupoDocumento = alternativa;
    }

    $$('[data-grupo]').forEach((boton) => {
      const grupo = boton.dataset.grupo;
      const disponible = grupoDisponible(grupo, unidad);
      boton.disabled = !disponible;
      boton.classList.toggle('is-selected', grupo === grupoDocumento);
      boton.setAttribute('aria-checked', String(grupo === grupoDocumento));

      const estado = estadoCortoGrupo(grupo, disponible);
      const span = $(`#status-${grupo}`);
      if (span) {
        span.textContent = estado.texto;
        span.className = `type-status ${estado.clase}`;
      }
    });

    const formConsentida = $('#form-consentida');
    const formGeneral = $('#form-general');
    const formInforme = $('#form-informe');
    if (formConsentida) formConsentida.hidden = grupoDocumento !== 'consentida';
    if (formGeneral) formGeneral.hidden = grupoDocumento !== 'general';
    if (formInforme) formInforme.hidden = grupoDocumento !== 'informe';

    const etiquetaQueja = $('#label-sol-queja');
    const etiquetaQuejado = $('#label-sol-quejado');
    const etiquetaNumero = $('#label-sol-resolucion-actual');
    if (etiquetaQueja) etiquetaQueja.textContent = grupoDocumento === 'consentida' ? 'Queja N°' : 'Expediente';
    if (etiquetaQuejado) {
      etiquetaQuejado.textContent = grupoDocumento === 'consentida'
        ? 'Quejado'
        : (grupoDocumento === 'informe' ? 'Investigado' : 'Partes');
    }
    if (etiquetaNumero) etiquetaNumero.textContent = grupoDocumento === 'informe' ? 'Informe N°' : 'Resolución N°';
    const campoQuejado = $('#sol-quejado');
    if (campoQuejado) {
      campoQuejado.placeholder = grupoDocumento === 'consentida'
        ? 'Opcional'
        : (grupoDocumento === 'informe' ? 'Nombre del investigado' : 'Nombres de las partes');
    }

    const campoReferencia = $('#field-sol-referencia');
    if (campoReferencia) campoReferencia.hidden = grupoDocumento === 'consentida';

    const info = grupoActualInfo();
    const infoEl = $('#doc-plantilla-info');
    if (infoEl) {
      infoEl.textContent = `${tipoActual().nombre} · ${unidad === 'Jefatura / Juez de Paz' ? 'Juez de Paz' : unidad}`;
    }

    const estadoEl = $('#doc-estado');
    if (estadoEl) {
      estadoEl.textContent = grupoDocumento==='consentida' && unidad==='Jefatura / Juez de Paz'?'Modelo base proporcionado · por validar.':'Propuesta de formato · por validar con el área.';
    }

    asegurarTextosPlantilla();
    renumerarSecciones();
    actualizarDocumento();
  }

  function renumerarSecciones() {
    const secciones = $$('.doc-form-body .form-section')
      .filter((seccion) => !seccion.closest('[hidden]'));

    secciones.forEach((seccion, indice) => {
      const numero = $('.num', seccion);
      if (numero) numero.textContent = String(indice + 1);
    });
  }

  function leerGeneral() {
    const valor = (id) => ($(id)?.value ?? '').trim();
    return {
      expediente: valor('#sol-queja'),
      partes: valor('#sol-quejado'),
      investigacion: valor('#sol-investigacion'),
      origen: valor('#sol-origen'),
      unidad: unidadSeleccionada(),
      referencia: valor('#sol-referencia'),
      numero: valor('#sol-resolucion-actual'),
      fecha: valor('#gen-fecha'),
      considerando: valor('#gen-considerando'),
      resuelve: valor('#gen-resuelve'),
      firmante: valor('#sol-firmante'),
      cargo: valor('#sol-cargo'),
      iniciales: valor('#sol-iniciales')
    };
  }

  function leerInforme() {
    const valor = (id) => ($(id)?.value ?? '').trim();
    return {
      expediente: valor('#sol-queja'),
      partes: valor('#sol-quejado'),
      investigacion: valor('#sol-investigacion'),
      origen: valor('#sol-origen'),
      unidad: unidadSeleccionada(),
      referencia: valor('#sol-referencia'),
      numero: valor('#sol-resolucion-actual'),
      fecha: valor('#inf-fecha'),
      antecedentes: valor('#inf-antecedentes'),
      analisis: valor('#inf-analisis'),
      conclusion: valor('#inf-conclusion'),
      recomendacion: valor('#inf-recomendacion'),
      firmante: valor('#sol-firmante'),
      cargo: valor('#sol-cargo'),
      iniciales: valor('#sol-iniciales')
    };
  }

  function resolverPlaceholders(texto, fechaResolucion = '') {
    const valor = (id) => ($(id)?.value ?? '').trim();
    const calculo = calculoVigente();

    const mapa = {
      EXPEDIENTE: valor('#sol-queja'),
      QUEJA: valor('#sol-queja'),
      PARTES: valor('#sol-quejado'),
      QUEJADO: valor('#sol-quejado'),
      INVESTIGACION: valor('#sol-investigacion'),
      ORIGEN: valor('#sol-origen'),
      UNIDAD: valor('#doc-unidad'),
      RESOLUCION_REFERENCIA: valor('#sol-referencia'),
      RESOLUCION_NUMERO: valor('#sol-resolucion-actual'),
      FECHA_RESOLUCION: fechaResolucion ? fechaEnLetras(fechaResolucion) : '',
      FIRMANTE: valor('#sol-firmante'),
      CARGO: valor('#sol-cargo'),
      INICIALES: valor('#sol-iniciales')
    };

    if (calculo) {
      mapa.FECHA_NOTIFICACION = fechaEnLetras(calculo.fechaNotificacion);
      mapa.FECHA_VENCIMIENTO = fechaEnLetras(calculo.fechaVencimiento);
      // Fecha consentida requiere definición propia del formato validado.
      mapa.DIAS_HABILES = String(calculo.diasHabiles);
    }

    return String(texto ?? '').replace(/\{([A-Z_]+)\}/g, (original, token) => {
      const reemplazo = mapa[token];
      return reemplazo !== undefined && reemplazo !== null && String(reemplazo).trim() !== ''
        ? String(reemplazo)
        : original;
    });
  }

  function placeholdersPendientes(texto) {
    return [...new Set(String(texto ?? '').match(/\{[A-Z_]+\}/g) || [])];
  }

  function encabezadoInstitucional() {
    return `
      <table class="doc-head">
        <tr>
          <td><img class="doc-escudo" src="${IMG_ESCUDO}" alt="Escudo del Perú"></td>
          <td><img class="doc-pj" src="${IMG_PJ}" alt="Poder Judicial del Perú"></td>
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
        <span>${escaparHtml(unidadSeleccionada().toUpperCase())}</span>
      </div>
      <div class="doc-rule"></div>
    `;
  }

  function firmaDocumento(datos) {
    return `
      <div class="doc-signature">
        <p class="doc-signed">Firma pendiente · borrador</p>
        <div class="doc-signature-line"></div>
        <strong>${escaparHtml(datos.firmante) || '—'}</strong>
        <span>${escaparHtml(datos.cargo) || '—'}</span>
        <span>Corte Superior de Justicia de Arequipa</span>
      </div>
    `;
  }

  function construirContenidoGeneral() {
    const datos = leerGeneral();
    const calculo = calculoVigente();
    const notificacion = calculo ? fechaVisible(calculo.fechaNotificacion) : '—';
    const vencimiento = calculo ? fechaVisible(calculo.fechaVencimiento) : '—';
    const considerando = parrafosDocumento(resolverPlaceholders(datos.considerando, datos.fecha));
    const resuelve = parrafosDocumento(resolverPlaceholders(datos.resuelve, datos.fecha));
    const investigacion = datos.investigacion
      ? `<tr><td class="label">INVESTIGACIÓN</td><td class="colon">:</td><td class="value">${escaparHtml(datos.investigacion)}</td></tr>`
      : '';

    return `
      ${encabezadoInstitucional()}
      <div class="doc-resolution">${escaparHtml(tipoActual().nombre.toUpperCase())} N° ${escaparHtml(datos.numero) || '—'}</div>
      <p class="doc-date">${fechaLineaLetras(datos.fecha)}</p>
      <table class="doc-fields">
        <tr><td class="label">EXPEDIENTE</td><td class="colon">:</td><td class="value">${escaparHtml(datos.expediente)}</td></tr>
        ${investigacion}
        <tr><td class="label">PARTES</td><td class="colon">:</td><td class="value">${escaparHtml(datos.partes)}</td></tr>
        <tr><td class="label">UNIDAD</td><td class="colon">:</td><td class="value">${escaparHtml(datos.unidad)}</td></tr>
        <tr><td class="label">REFERENCIA</td><td class="colon">:</td><td class="value">${escaparHtml(datos.referencia)}</td></tr>

      </table>
      <div class="doc-section">I. VISTOS:</div>
      <p class="doc-para">El expediente N.° ${escaparHtml(datos.expediente) || '—'}, la ${escaparHtml(datos.referencia) || '—'} y los actuados remitidos por ${escaparHtml(datos.origen) || 'la unidad de origen'}.</p>
      <div class="doc-section">II. CONSIDERANDO:</div>
      ${tipoActual().campos.map(([id,label])=>`<p class="doc-para"><strong>${escaparHtml(label)}:</strong> ${escaparHtml($('#sol-extra-'+id)?.value || '—')}</p>`).join('')}
      ${considerando}
      <div class="doc-section">III. SE RESUELVE:</div>
      ${resuelve}
      ${firmaDocumento(datos)}
    `;
  }

  function construirContenidoInforme() {
    const datos = leerInforme();
    const fecha = datos.fecha ? fechaVisible(datos.fecha) : '—';
    const antecedentes = parrafosDocumento(resolverPlaceholders(datos.antecedentes, datos.fecha));
    const analisis = parrafosDocumento(resolverPlaceholders(datos.analisis, datos.fecha));
    const conclusion = parrafosDocumento(resolverPlaceholders(datos.conclusion, datos.fecha));
    const recomendacion = parrafosDocumento(resolverPlaceholders(datos.recomendacion, datos.fecha));
    const investigacion = datos.investigacion
      ? `<tr><td class="label">INVESTIGACIÓN</td><td class="colon">:</td><td class="value">${escaparHtml(datos.investigacion)}</td></tr>`
      : '';

    return `
      ${encabezadoInstitucional()}
      <div class="doc-resolution">INFORME N° ${escaparHtml(datos.numero) || '—'}</div>
      <p class="doc-date">${fechaLineaLetras(datos.fecha)}</p>
      <table class="doc-fields">
        <tr><td class="label">EXPEDIENTE</td><td class="colon">:</td><td class="value">${escaparHtml(datos.expediente)}</td></tr>
        ${investigacion}
        <tr><td class="label">INVESTIGADO</td><td class="colon">:</td><td class="value">${escaparHtml(datos.partes)}</td></tr>
        <tr><td class="label">UNIDAD</td><td class="colon">:</td><td class="value">${escaparHtml(datos.unidad)}</td></tr>
        <tr><td class="label">ORIGEN</td><td class="colon">:</td><td class="value">${escaparHtml(datos.origen)}</td></tr>
        <tr><td class="label">REFERENCIA</td><td class="colon">:</td><td class="value">${escaparHtml(datos.referencia)}</td></tr>
        <tr><td class="label">FECHA</td><td class="colon">:</td><td class="value">${escaparHtml(fecha)}</td></tr>
      </table>
      <div class="doc-section">I. ANTECEDENTES:</div>
      ${antecedentes}
      <div class="doc-section">II. ANÁLISIS:</div>
      ${analisis}
      <div class="doc-section">III. CONCLUSIÓN:</div>
      ${conclusion}
      <div class="doc-section">IV. RECOMENDACIÓN:</div>
      ${recomendacion}
      ${firmaDocumento(datos)}
    `;
  }

  function construirContenidoDocumento() {
    if (grupoDocumento === 'general') return construirContenidoGeneral();
    if (grupoDocumento === 'informe') return construirContenidoInforme();
    return construirContenidoConsentida();
  }

  function actualizarDocumento() {
    const contenedor = $('#doc-contenido');
    if (!contenedor) return;
    const papel = $('.paper-doc');
    const posicion = papel ? papel.scrollTop : 0;
    contenedor.innerHTML = construirContenidoDocumento();
    if (papel) papel.scrollTop = posicion;
  }

  function datosExportacion() {
    if (grupoDocumento === 'general') {
      const datos = leerGeneral();
      return {
        titulo: `${tipoActual().nombre}${datos.expediente ? ` - ${datos.expediente}` : ''}`,
        nombre: `${tipoActual().id}-${(datos.expediente || 'documento').replace(/[^a-z0-9_-]+/gi, '-')}`
      };
    }
    if (grupoDocumento === 'informe') {
      const datos = leerInforme();
      return {
        titulo: `Informe de Calificación${datos.expediente ? ` - ${datos.expediente}` : ''}`,
        nombre: `Informe-${(datos.expediente || 'documento').replace(/[^a-z0-9_-]+/gi, '-')}`
      };
    }
    const datos = leerConsentida();
    return {
      titulo: `Resolución Consentida ${datos.formato==='jefatura'?'Jefatura':datos.formato==='calificacion'?'Calificación':'Por validar'}${datos.queja ? ` - ${datos.queja}` : ''}`,
      nombre: `Consentida-${(datos.queja || 'documento').replace(/[^a-z0-9_-]+/gi, '-')}`
    };
  }

  /* ------------------------------------------------------------------ */
  /* Módulo 2: biblioteca de documentos                                  */
  /* ------------------------------------------------------------------ */

  const ETIQUETAS_GRUPO = {
    general: 'Resolución General',
    consentida: 'Resolución Consentida',
    informe: 'Informe de Calificación'
  };

  const ETIQUETAS_ESTADO = {
    borrador: 'Borrador',
    listo: 'Listo',
    exportado: 'Exportado',
    archivado: 'Archivado'
  };

  function formatearFechaHora(marca) {
    if (!Number.isFinite(marca)) return '—';
    return new Intl.DateTimeFormat('es-PE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(marca));
  }

  function capturarFormulario() {
    const datos = {};
    $$('.doc-form-body input, .doc-form-body select, .doc-form-body textarea').forEach((campo) => {
      if (campo.id) datos[campo.id] = campo.value;
    });
    datos['doc-formato-consentida']=$('#doc-formato-consentida')?.value || 'calificacion';
    return datos;
  }

  function restaurarFormulario(datos) {
    const tipo=datos?.['sol-tipo'] || (grupoDocumento==='general'?'auto':grupoDocumento);
    $('#sol-tipo').value=tipo; renderCamposTramite();
    if(!datos?.['sol-notificaciones']) {
      $('#sol-notificaciones').value=JSON.stringify([1,2].filter(i=>datos?.['sol-notif'+i]).map(i=>({fecha:datos['sol-notif'+i],foja:datos['sol-foja'+i]})));
    }
    Object.entries(datos || {}).forEach(([id, valor]) => {
      const campo = document.getElementById(id);
      if (!campo || !('value' in campo)) return;
      campo.value = valor ?? '';
      marcarInvalido(campo, false);
    });
    renderNotificaciones(); renderCatalogoTipos(); mostrarPaso(1);
  }

  function programarGuardado() {
    if (!DOCS || !documentoActualId) return;
    window.clearTimeout(guardadoTimer);
    guardadoTimer = window.setTimeout(() => {
      guardadoTimer = null;
      guardarDocumento({ silencioso: true });
    }, 1200);
  }

  async function guardarDocumento({ silencioso = false } = {}) {
    if (!DOCS) {
      showToast('El almacenamiento local no está disponible.');
      return;
    }

    if (silencioso && !documentoActualId) return;

    const datos = capturarFormulario();
    const info = datosExportacion();
    const ahora = Date.now();
    let existente = null;

    try {
      existente = documentoActualId ? await DOCS.obtener(documentoActualId) : null;
    } catch {
      existente = null;
    }

    const calculo = calculoVigente();
    const documento = {
      id: documentoActualId || DOCS.nuevoId(),
      schemaVersion: 1,
      titulo: info.titulo,
      grupo: grupoDocumento,
      unidad: unidadSeleccionada(),
      plantillaId: `${tipoActual().id}:${unidadSeleccionada()}`,
      plantillaVersion: '1',
      appVersion: APP_VERSION,
      estado: existente?.estado || 'borrador',
      datos,
      calculo: calculo ? { ...calculo } : null,
      creadoEn: existente?.creadoEn || ahora,
      actualizadoEn: ahora
    };

    try {
      await DOCS.guardar(documento);
      documentoActualId = documento.id;
      calculoDocumento = documento.calculo;
      pintarModulo2Fechas();
      if (!silencioso) {
        showToast(DOCS.disponible
          ? 'Borrador guardado.'
          : 'Borrador guardado solo durante esta sesión.');
      }
      if (vistaDocumentos === 'lista') await renderDocumentos();
    } catch {
      showToast('No se pudo guardar el borrador.');
    }
  }

  function actualizarNotaAlmacenamiento() {
    const nota = $('#library-storage-note');
    if (!nota) return;

    if (!DOCS) {
      nota.hidden = false;
      nota.textContent = 'El almacenamiento local no está disponible en este navegador.';
      return;
    }

    if (!DOCS.disponible) {
      nota.hidden = false;
      nota.textContent = 'El almacenamiento del navegador no está disponible: los borradores se conservarán solo durante esta sesión.';
      return;
    }

    nota.hidden = true;
    nota.textContent = '';
  }

  function crearTarjetaDocumento(documento) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'doc-card';

    const principal = document.createElement('div');
    principal.className = 'doc-card-main';

    const titulo = document.createElement('h4');
    titulo.textContent = documento.titulo || 'Documento sin título';
    titulo.title = documento.titulo || 'Documento sin título';

    const meta = document.createElement('div');
    meta.className = 'doc-card-meta';

    const grupo = document.createElement('span');
    grupo.textContent = `${TIPOS.find(t=>t.id===documento.datos?.['sol-tipo'])?.nombre || ETIQUETAS_GRUPO[documento.grupo] || documento.grupo || 'Documento'} · ${documento.unidad || 'Sin unidad'}`;

    const fecha = document.createElement('span');
    fecha.textContent = `Editado ${formatearFechaHora(documento.actualizadoEn)}`;

    meta.append(grupo, fecha);
    principal.append(titulo, meta);

    const estado = document.createElement('span');
    estado.className = 'doc-card-status';
    estado.textContent = ETIQUETAS_ESTADO[documento.estado] || documento.estado || 'Borrador';

    const acciones = document.createElement('div');
    acciones.className = 'doc-card-actions';

    [
      ['abrir', 'Abrir', 'btn btn-outline btn-small'],
      ['duplicar', 'Duplicar', 'btn btn-ghost btn-small'],
      ['eliminar', 'Eliminar', 'btn btn-ghost btn-small btn-danger']
    ].forEach(([accion, texto, clase]) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = clase;
      boton.dataset.accion = accion;
      boton.dataset.id = documento.id;
      boton.textContent = texto;
      acciones.appendChild(boton);
    });

    tarjeta.append(principal, estado, acciones);
    return tarjeta;
  }

  async function renderDocumentos() {
    const contenedor = $('#lista-documentos');
    const vacio = $('#library-empty');
    if (!contenedor || !vacio) return;

    actualizarNotaAlmacenamiento();

    if (!DOCS) {
      contenedor.replaceChildren();
      vacio.hidden = false;
      return;
    }

    let documentos = [];
    try {
      documentos = await DOCS.listar();
    } catch {
      documentos = [];
    }

    const texto = ($('#filtro-documentos')?.value || '').trim().toLowerCase();
    const grupo = $('#filtro-grupo')?.value || '';
    const estado = $('#filtro-estado')?.value || '';

    const visibles = documentos.filter((documento) => {
      const contenido = `${documento.titulo || ''} ${ETIQUETAS_GRUPO[documento.grupo] || documento.grupo || ''} ${documento.unidad || ''}`.toLowerCase();
      const coincideTexto = !texto || contenido.includes(texto);
      const coincideGrupo = !grupo || (documento.datos?.['sol-tipo'] || (documento.grupo==='general'?'auto':documento.grupo)) === grupo;
      const coincideEstado = !estado || documento.estado === estado;
      return coincideTexto && coincideGrupo && coincideEstado;
    });

    contenedor.replaceChildren();
    visibles.forEach((documento) => contenedor.appendChild(crearTarjetaDocumento(documento)));

    vacio.hidden = visibles.length > 0;
    if (visibles.length === 0) {
      const titulo = vacio.querySelector('strong');
      const detalle = vacio.querySelector('span');
      if (documentos.length === 0) {
        if (titulo) titulo.textContent = 'No hay documentos guardados.';
        if (detalle) detalle.textContent = 'Cree un documento y pulse «Guardar».';
      } else {
        if (titulo) titulo.textContent = 'No hay documentos que coincidan.';
        if (detalle) detalle.textContent = 'Cambie la búsqueda o los filtros.';
      }
    }

    actualizarNotaAlmacenamiento();
  }

  function mostrarVista(vista) {
    vistaDocumentos = vista;
    const esLista = vista === 'lista';
    const esPlantillas=vista==='plantillas';
    $('#vista-plantillas').hidden=!esPlantillas;
    $('#tab-plantillas').classList.toggle('is-active',esPlantillas);
    $('#tab-plantillas').setAttribute('aria-selected',String(esPlantillas));
    const tabNuevo = $('#tab-nuevo');
    const tabDocumentos = $('#tab-documentos');
    const vistaNuevo = $('#vista-nuevo-documento');
    const vistaLista = $('#vista-mis-documentos');
    const layout = $('.doc-layout');

    tabNuevo?.classList.toggle('is-active', !esLista && !esPlantillas);
    tabDocumentos?.classList.toggle('is-active', esLista);
    tabNuevo?.setAttribute('aria-selected', String(!esLista && !esPlantillas));
    tabDocumentos?.setAttribute('aria-selected', String(esLista));

    if (vistaNuevo) vistaNuevo.hidden = esLista || esPlantillas;
    if (vistaLista) vistaLista.hidden = !esLista;
    layout?.classList.toggle('is-library', esLista || esPlantillas);

    if (esLista) {
      renderDocumentos();
    }
  }

  function irAlFormulario() {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }

  function nuevoDocumento() {
    window.clearTimeout(guardadoTimer);
    documentoActualId = null;
    calculoDocumento = null;
    limpiarDocumento({ conservarFirma: true, silencioso: true });
    mostrarVista('nuevo');
    irAlFormulario();
    pintarModulo2Fechas();
    showToast('Nuevo documento. Complete los datos y guarde.');
  }

  async function abrirDocumento(id) {
    if (!DOCS) return;

    try {
      const documento = await DOCS.obtener(id);
      if (!documento) {
        showToast('No se encontró el documento.');
        await renderDocumentos();
        return;
      }

      window.clearTimeout(guardadoTimer);
      documentoActualId = documento.id;
      calculoDocumento = documento.calculo || null;
      grupoDocumento = documento.grupo || 'consentida';

      const unidad = $('#doc-unidad');
      if (unidad && documento.unidad) unidad.value = documento.unidad;

      actualizarSelectorDocumento();
      restaurarFormulario(documento.datos || {});
      pintarModulo2Fechas();
      mostrarVista('nuevo');
      irAlFormulario();
      showToast('Documento abierto.');
    } catch {
      showToast('No se pudo abrir el documento.');
    }
  }

  async function duplicarDocumento(id) {
    if (!DOCS) return;

    try {
      const documento = await DOCS.obtener(id);
      if (!documento) {
        showToast('No se encontró el documento.');
        return;
      }

      const ahora = Date.now();
      const copia = {
        ...documento,
        id: DOCS.nuevoId(),
        titulo: `${documento.titulo || 'Documento'} (copia)`,
        estado: 'borrador',
        creadoEn: ahora,
        actualizadoEn: ahora,
        datos: { ...(documento.datos || {}) },
        calculo: documento.calculo ? { ...documento.calculo } : null
      };

      await DOCS.guardar(copia);
      await renderDocumentos();
      showToast('Documento duplicado.');
    } catch {
      showToast('No se pudo duplicar el documento.');
    }
  }

  async function eliminarDocumento(id) {
    if (!DOCS) return;

    const documento = await DOCS.obtener(id).catch(() => null);
    const titulo = documento?.titulo || 'este documento';
    if (!window.confirm(`¿Eliminar «${titulo}»? Esta acción no se puede deshacer.`)) return;

    try {
      await DOCS.eliminar(id);
      if (documentoActualId === id) {
        documentoActualId = null;
        calculoDocumento = null;
      }
      await renderDocumentos();
      showToast('Documento eliminado.');
    } catch {
      showToast('No se pudo eliminar el documento.');
    }
  }

  function manejarAccionDocumento(evento) {
    const boton = evento.target.closest('button[data-accion]');
    if (!boton) return;

    const { accion, id } = boton.dataset;
    if (accion === 'abrir') abrirDocumento(id);
    if (accion === 'duplicar') duplicarDocumento(id);
    if (accion === 'eliminar') eliminarDocumento(id);
  }

  function validarCampoDocumento(campo, mensaje) {
    const valor = campo.value.trim();
    let invalido = valor === '';
    let detalle = '';

    if (!invalido && campo.type === 'date') {
      invalido = !esFechaISO(valor);
      if (!invalido && campo.min && valor < campo.min) {
        invalido = true;
        detalle = `La fecha mínima es ${fechaVisible(campo.min)}.`;
      }
      if (!invalido && campo.max && valor > campo.max) {
        invalido = true;
        detalle = `La fecha máxima es ${fechaVisible(campo.max)}.`;
      }
    }

    if (!invalido && campo.type === 'number') {
      const numero = Number(valor);
      invalido = !Number.isInteger(numero);
      if (!invalido && campo.min !== '' && numero < Number(campo.min)) {
        invalido = true;
        detalle = `El valor mínimo es ${campo.min}.`;
      }
      if (!invalido && campo.max !== '' && numero > Number(campo.max)) {
        invalido = true;
        detalle = `El valor máximo es ${campo.max}.`;
      }
    }

    return {
      invalido,
      mensaje: invalido ? [mensaje, detalle].filter(Boolean).join(' ') : ''
    };
  }

  function validarCamposDocumento(reglas) {
    let primerInvalido = null;

    reglas.forEach(([selector, mensaje]) => {
      const campo = $(selector);
      if (!campo) return;

      const resultado = validarCampoDocumento(campo, mensaje);
      marcarInvalido(campo, resultado.invalido);

      if (resultado.invalido && !primerInvalido) {
        primerInvalido = campo;
        showToast(resultado.mensaje);
      }
    });

    if (primerInvalido) {
      primerInvalido.focus();
      return false;
    }
    return true;
  }

  function validarGeneral() {
    const reglas = [
      ['#sol-queja', 'Ingrese el expediente.'],
      ['#sol-quejado', 'Ingrese las partes.'],
      ['#sol-referencia', 'Ingrese la resolución de referencia.'],
      ['#sol-resolucion-actual', 'Ingrese el número de resolución.'],
      ['#gen-fecha', 'Seleccione la fecha de la resolución.'],
      ['#gen-considerando', 'Ingrese el considerando.'],
      ['#gen-resuelve', 'Ingrese la parte resolutiva.'],
      ['#sol-firmante', 'Ingrese el firmante.'],
      ['#sol-cargo', 'Ingrese el cargo.'],
      ['#sol-iniciales', 'Ingrese las iniciales.']
    ];

    if (!validarCamposDocumento(reglas)) return false;

    const fechaGeneral = $('#gen-fecha')?.value || '';
    const pendientes = [
      ...placeholdersPendientes(resolverPlaceholders($('#gen-considerando')?.value, fechaGeneral)),
      ...placeholdersPendientes(resolverPlaceholders($('#gen-resuelve')?.value, fechaGeneral))
    ];

    if (pendientes.length > 0) {
      marcarInvalido($('#gen-considerando'), true);
      marcarInvalido($('#gen-resuelve'), true);
      $('#gen-considerando')?.focus();
      showToast(`Faltan datos para los marcadores: ${pendientes.join(', ')}. Calcule en el Módulo 1 o ajuste el texto.`);
      return false;
    }

    return true;
  }

  function validarInforme() {
    const reglas = [
      ['#sol-queja', 'Ingrese el expediente.'],
      ['#sol-quejado', 'Ingrese el investigado.'],
      ['#sol-origen', 'Ingrese el origen.'],
      ['#sol-referencia', 'Ingrese la referencia.'],
      ['#sol-resolucion-actual', 'Ingrese el número de informe.'],
      ['#inf-fecha', 'Seleccione la fecha del informe.'],
      ['#inf-antecedentes', 'Ingrese los antecedentes.'],
      ['#inf-analisis', 'Ingrese el análisis.'],
      ['#inf-conclusion', 'Ingrese la conclusión.'],
      ['#inf-recomendacion', 'Ingrese la recomendación.'],
      ['#sol-firmante', 'Ingrese el firmante.'],
      ['#sol-cargo', 'Ingrese el cargo.'],
      ['#sol-iniciales', 'Ingrese las iniciales.']
    ];

    if (!validarCamposDocumento(reglas)) return false;

    const campos = ['#inf-antecedentes', '#inf-analisis', '#inf-conclusion', '#inf-recomendacion'];
    const fechaInforme = $('#inf-fecha')?.value || '';
    const pendientes = campos.flatMap((selector) => placeholdersPendientes(resolverPlaceholders($(selector)?.value, fechaInforme)));

    if (pendientes.length > 0) {
      campos.forEach((selector) => marcarInvalido($(selector), true));
      $(campos[0])?.focus();
      showToast(`Faltan datos para los marcadores: ${[...new Set(pendientes)].join(', ')}. Calcule en el Módulo 1 o ajuste el texto.`);
      return false;
    }

    return true;
  }

  function validarDocumento() {
    if ($('#doc-formato-consentida')?.value==='pendiente') { mostrarPaso(0); showToast('Este formato aún está pendiente de recibir o validar.'); return false; }
    const pendientes=problemasDocumento();
    if(pendientes.length){mostrarPaso(3);showToast('Revise los datos pendientes.');return false;}
    if (grupoDocumento === 'general') return validarGeneral();
    if (grupoDocumento === 'informe') return validarInforme();
    return validarConsentida();
  }

  function limpiarDocumento({ conservarFirma = true, silencioso = false } = {}) {
    const camposFirma = new Set(['sol-firmante', 'sol-cargo', 'sol-iniciales']);

    $$('[id^="sol-"], [id^="gen-"], [id^="inf-"]').forEach((campo) => {
      if (conservarFirma && camposFirma.has(campo.id)) {
        marcarInvalido(campo, false);
        return;
      }
      campo.value = '';
      marcarInvalido(campo, false);
    });

    const vinculo = $('#vincular-notificacion');
    if (vinculo) vinculo.value = '';

    documentoActualId = null;
    calculoDocumento = null;
    window.clearTimeout(guardadoTimer);
    pintarModulo2Fechas();
    $('#sol-tipo').value=grupoDocumento==='general'?'auto':grupoDocumento;
    $('#sol-notificaciones').value='[]';renderNotificaciones();renderCamposTramite();renderCatalogoTipos();mostrarPaso(0);
    actualizarDocumento();

    if (!silencioso) showToast('Formulario limpio. Se guardará como documento nuevo.');
  }

  function construirDocumentoCompleto() {
    const contenido = construirContenidoDocumento();
    const datos = datosExportacion();
    const css = `
      @page { size: 21cm 29.7cm; margin: 1.0cm 2.75cm 1.2cm; }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body { font-family: Garamond, "Times New Roman", "Liberation Serif", serif; color: #000; font-size: 11pt; }
      .doc-page { position: relative; }
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
      .doc-para strong { font-weight: bold; }
      .doc-para em { font-style: italic; }
      .doc-signature { margin-top: 30pt; text-align: center; font-size: 10pt; line-height: 1.3; }
      .doc-signed { margin-bottom: 5pt; font-style: italic; }
      .doc-signature-line { width: 55%; margin: 0 auto 3pt; border-top: 0.75pt solid #000; }
      .doc-signature strong, .doc-signature span { display: block; font-weight: bold; }
      .doc-footer { margin-top: 14pt; padding-top: 3pt; border-top: 0.5pt solid #999; text-align: center; font-family: Arial, sans-serif; font-size: 6pt; color: #666; }
      .doc-watermark { position: fixed; top: 45%; left: 0; width: 100%; z-index: -1; text-align: center; font-family: Arial, sans-serif; font-size: 60pt; font-weight: bold; color: rgba(0,0,0,0.05); transform: rotate(-25deg); }
    `;
    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${escaparHtml(datos.titulo)}</title>
<style>${css}</style>
</head>
<body>
<div class="doc-page">
${contenido}
<div class="doc-footer">BORRADOR — Documento de muestra, sin validez oficial.</div>
</div>
<div class="doc-watermark" aria-hidden="true">BORRADOR</div>
</body>
</html>`;
  }

  function descargarWordDocumento() {
    if (!validarDocumento()) return;
    actualizarDocumento();
    const html = construirDocumentoCompleto();
    const datos = datosExportacion();
    const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `${datos.nombre}.doc`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    showToast('Word generado.');
  }

  function imprimirDocumento() {
    if (!validarDocumento()) return;
    actualizarDocumento();
    const html = construirDocumentoCompleto();
    const marco = document.createElement('iframe');
    marco.setAttribute('aria-hidden', 'true');
    marco.style.position = 'fixed';
    marco.style.left = '-10000px';
    marco.style.top = '0';
    marco.style.width = '21cm';
    marco.style.height = '29.7cm';
    marco.style.border = '0';
    marco.srcdoc = html;
    marco.onload = () => {
      try {
        marco.contentWindow.focus();
        marco.contentWindow.print();
      } finally {
        window.setTimeout(() => marco.remove(), 60000);
      }
    };
    document.body.appendChild(marco);
    showToast('Abriendo impresión.');
  }

  function generarDocumento() {
    if (!validarDocumento()) return;
    actualizarDocumento();
    const formato = $('#ref-formato')?.value || 'word';
    if (formato === 'pdf') imprimirDocumento();
    else descargarWordDocumento();
  }

  // Interacción guiada del Módulo 2. Los datos se conservan en el mismo borrador.
  let pasoDocumento = 0;
  const TIPOS = window.ODANC_TIPOS;
  const tipoActual = () => TIPOS.find(t => t.id === $('#sol-tipo')?.value) || TIPOS[0];
  function notificaciones() {
    try { return JSON.parse($('#sol-notificaciones').value || '[]'); } catch { return []; }
  }
  function renderNotificaciones() {
    $('#notificaciones-lista').innerHTML = notificaciones().map((n,i) => `<div class="notification-card">
      <div class="notification-heading"><strong>Persona ${i+1}</strong><button type="button" class="btn btn-ghost btn-small" data-quitar="${i}" aria-label="Quitar persona ${i+1}">Quitar</button></div>
      <div class="field-grid">${[['nombre','Nombre y apellidos','text'],['rol','Participación','text'],['fecha','Fecha de notificación','date'],['foja','Foja o constancia','text'],['vence','Vencimiento del plazo','date']].map(([k,l,t]) => `<div class="field"><label for="notif-${i}-${k}">${l}</label><input class="input" id="notif-${i}-${k}" data-notif="${i}" data-key="${k}" type="${t}" value="${escaparHtml(n[k] || '')}"></div>`).join('')}
      <div class="field"><label for="notif-${i}-medio">Medio</label><select class="input" id="notif-${i}-medio" data-notif="${i}" data-key="medio">${['Por confirmar','Casilla electrónica','Cédula','Otro'].map(m=>`<option ${n.medio===m?'selected':''}>${m}</option>`).join('')}</select></div></div>
      <button type="button" class="link-inline" data-calculo="${i}">Usar cálculo del Módulo 1</button></div>`).join('');
  }
  function renderCamposTramite() {
    $('#campos-tramite').innerHTML = tipoActual().campos.map(([id,label,type,options]) => `<div class="field"><label for="sol-extra-${id}">${label}</label>${type==='select' ? `<select class="input" id="sol-extra-${id}"><option value="">Seleccionar</option>${options.split('|').map(o=>`<option>${o}</option>`).join('')}</select>` : `<input class="input" id="sol-extra-${id}" type="${type || 'text'}">`}</div>`).join('');
  }
  function seleccionarTipo(id) {
    const t = TIPOS.find(t=>t.id===id); if (!t) return;
    if (tipoActual().id !== id && documentoActualId) { showToast('Guarde sus cambios y pulse Nuevo para cambiar de tipo.'); return; }
    if(tipoActual().id===id){ mostrarPaso(0); return; }
    if($('#sol-queja').value && !window.confirm('Se cambiará el tipo y su contenido específico. Los datos del expediente se conservarán. ¿Continuar?')) return;
    $('#sol-tipo').value=id;
    grupoDocumento=t.grupo;
    if (!t.unidades.includes(unidadSeleccionada())) $('#doc-unidad').value=t.unidades[0];
    renderCamposTramite();
    if (t.grupo==='general') {
      $('#gen-considerando').value=''; $('#gen-resuelve').value='';
    }
    actualizarSelectorDocumento(); renderCatalogoTipos(); mostrarPaso(0);
  }
  function renderCatalogoTipos() {
    const area=unidadSeleccionada();
    const disponibles=TIPOS.filter(t=>t.unidades.includes(area));
    const formato=$('#doc-formato-consentida');
    const anterior=formato.value;
    const modelos=tipoActual().id==='consentida'
      ? area==='Calificación'?[['calificacion','Calificación · expediente 335-2026']]
        :area==='Jefatura / Juez de Paz'?[['jefatura','Jefatura · Juez de Paz']]:[]
      :[];
    formato.innerHTML=modelos.length?modelos.map(([id,nombre])=>`<option value="${id}">${nombre}</option>`).join('')
      :'<option value="pendiente">Formato pendiente de recibir</option>';
    if(modelos.some(([id])=>id===anterior))formato.value=anterior;
    const gallery=TIPOS.map(t=>`<button type="button" class="document-choice ${tipoActual().id===t.id?'is-selected':''}" data-tipo="${t.id}"><svg class="i" aria-hidden="true"><use href="#${t.icono}"></use></svg><span><strong>${t.nombre}</strong><small>${t.descripcion}</small><em>${t.id==='consentida'?'Modelos recibidos: Calificación y Jefatura':'Formato por validar'}</em></span><span aria-hidden="true">→</span></button>`).join('');
    $('#plantillas-lista').innerHTML=gallery;
    $('#catalogo-tipos').innerHTML=disponibles.map(t=>`<button type="button" class="document-choice ${tipoActual().id===t.id?'is-selected':''}" data-tipo="${t.id}" aria-pressed="${tipoActual().id===t.id}"><svg class="i" aria-hidden="true"><use href="#${t.icono}"></use></svg><span><strong>${t.nombre}</strong><small>${t.descripcion}</small><em>${t.id==='consentida' && (area==='Calificación'||area==='Jefatura / Juez de Paz')?'Modelo recibido · por validar':'Formato pendiente de recibir'}</em></span><span aria-hidden="true">→</span></button>`).join('');
    $('#wizard-title').textContent=tipoActual().nombre;
    $('.wizard-eyebrow').textContent=area.toUpperCase()+' · BORRADOR';
    $('#doc-estado').textContent=modelos.length?'Modelo recibido · pendiente de validación por el área.':'Formato de esta combinación pendiente de recibir o validar.';
  }
  function mostrarPaso(paso) {
    pasoDocumento=Math.max(0,Math.min(3,paso));
    const sections=$$('.doc-form-body > .form-section');
    sections.forEach((section,i)=>section.classList.toggle('wizard-off', (i===0?0:i===1?1:3)!==pasoDocumento));
    $('#form-consentida').classList.toggle('wizard-off',pasoDocumento!==2);
    $('#form-general').classList.toggle('wizard-off',pasoDocumento!==2);
    $('#form-informe').classList.toggle('wizard-off',pasoDocumento!==2);
    $('.wizard-steps').innerHTML=['Documento','Expediente','Contenido','Revisión'].map((label,i)=>`<span class="wizard-step ${i===pasoDocumento?'is-current':''}" ${i===pasoDocumento?'aria-current="step"':''}><b>${i+1}</b><span>${label}</span></span>`).join('');
    $('#paso-contador').textContent=`Paso ${pasoDocumento+1} de 4`;
    $('#paso-anterior').disabled=pasoDocumento===0;
    $('#paso-siguiente').hidden=pasoDocumento===3;
    $('.doc-actions').classList.toggle('wizard-off',pasoDocumento!==3);
    $('.doc-layout').classList.toggle('is-choosing',pasoDocumento===0);
    if(pasoDocumento===3) actualizarRevision();
    $('#revision-resumen').hidden=pasoDocumento!==3;
    $('#doc-fecha-notificacion').closest('.form-section').classList.toggle('wizard-off',pasoDocumento!==3 || grupoDocumento!=='consentida');
    $('#wizard-title').textContent=tipoActual().nombre;
    $('.wizard-eyebrow').textContent=unidadSeleccionada().toUpperCase()+' · BORRADOR';
    renumerarSecciones();
  }
  function problemasDocumento() {
    const faltan=[];
    const requiere=(id,label)=>{if(!$(id)?.value.trim()) faltan.push({id,label});};
    requiere('#sol-queja','Número de expediente'); requiere('#sol-resolucion-actual','Número del nuevo documento');
    requiere('#sol-firmante','Firmante'); requiere('#sol-cargo','Cargo'); requiere('#sol-iniciales','Iniciales');
    if(grupoDocumento!=='consentida'){requiere('#sol-quejado',grupoDocumento==='informe'?'Investigado':'Partes');requiere('#sol-referencia','Documento de referencia');}
    if(grupoDocumento==='informe')requiere('#sol-origen','Órgano de origen');
    if(grupoDocumento==='consentida') {
      [['#sol-origen','Órgano de origen'],['#sol-resolucion-consentida','Número de la resolución anterior'],['#sol-fecha-consentida','Fecha de la resolución anterior'],['#sol-fecha-actual','Fecha de la nueva resolución'],['#sol-considerando','Resumen de lo decidido'],['#sol-parte','Extremo que se declara consentido']].forEach(([id,l])=>requiere(id,l));
      const ns=notificaciones(); if(!ns.length) faltan.push({id:'#agregar-notificacion',label:'Agregue al menos una persona notificada'});
      ns.forEach((n,i)=>{
        if(!n.nombre||!n.fecha||!n.foja||!n.vence||!n.medio||n.medio==='Por confirmar') faltan.push({id:`#notif-${i}-nombre`,label:`Complete la notificación de la persona ${i+1}`});
        if(n.fecha && n.fecha<$('#sol-fecha-consentida').value) faltan.push({id:`#notif-${i}-fecha`,label:`Persona ${i+1}: notificación anterior a la resolución`});
        if(n.vence&&n.fecha&&n.vence<n.fecha) faltan.push({id:`#notif-${i}-vence`,label:`Persona ${i+1}: vencimiento anterior a la notificación`});
        if(n.vence&&$('#sol-fecha-actual').value&&n.vence>=$('#sol-fecha-actual').value) faltan.push({id:'#sol-fecha-actual',label:'La nueva resolución debe ser posterior a los vencimientos registrados'});
      });
      if($('#sol-recursos').value!=='sin') faltan.push({id:'#sol-recursos',label:$('#sol-recursos').value==='con'?'Existe un recurso: revise la procedencia del documento':'Verifique si se presentó algún recurso'});
      requiere('#sol-verificacion','Sustento de la revisión de recursos');
    } else {
      requiere(grupoDocumento==='informe'?'#inf-fecha':'#gen-fecha','Fecha del documento');
      const campos=grupoDocumento==='informe'?['inf-antecedentes','inf-analisis','inf-conclusion','inf-recomendacion']:['gen-considerando','gen-resuelve'];
      campos.forEach(id=>requiere('#'+id,$(`label[for="${id}"]`).textContent));
      tipoActual().campos.forEach(([id,label])=>requiere('#sol-extra-'+id,label));
    }
    return faltan;
  }
  function actualizarRevision() {
    const items=problemasDocumento();
    $('#revision-resumen').innerHTML=`<h3>${items.length?'Por completar':'Borrador preparado'}</h3><p class="field-help">${items.length?`${items.length} dato(s) requieren atención.`:'Revise el contenido antes de descargar.'}</p>${items.map(p=>`<button class="review-issue" type="button" data-correccion="${p.id}">${escaparHtml(p.label)} <span>→</span></button>`).join('')}<details><summary>Después del borrador</summary><p class="field-help">Revisión del personal → aprobación → firma. Estas etapas se realizan fuera del prototipo.</p></details>`;
  }
  function cargarEjemplo() {
    if(!window.confirm('Se reemplazarán los datos del formulario actual por un ejemplo ficticio. ¿Continuar?')) return;
    const valores={'sol-queja':'DEMO-0142-2026','sol-origen':'JUZGADO DE EJEMPLO','sol-quejado':'Persona de ejemplo','sol-resolucion-actual':'9','sol-resolucion-consentida':'8','sol-fecha-consentida':'2026-06-30','sol-fecha-actual':'2026-08-25','sol-considerando':'se dispuso el archivo de los actuados, según el extremo que debe cotejarse con la resolución anterior.','sol-parte':'disponer el archivo de los actuados.','sol-firmante':'NOMBRE DEL FIRMANTE DE EJEMPLO','sol-cargo':'Cargo de ejemplo','sol-iniciales':'DEMO','sol-recursos':'sin','sol-verificacion':'Registro de ejemplo · revisión ficticia','sol-referencia':'Resolución N.° 8 (ejemplo)','gen-fecha':'2026-08-25','inf-fecha':'2026-08-25'};
    Object.entries(valores).forEach(([id,v])=>{if(document.getElementById(id)) document.getElementById(id).value=v;});
    $('#sol-notificaciones').value=JSON.stringify([{nombre:'Persona de ejemplo',rol:'Quejoso',fecha:'2026-07-01',foja:'113',medio:'Cédula',vence:'2026-07-22'}]);
    tipoActual().campos.forEach(([id,,type,opts])=>$('#sol-extra-'+id).value=type==='select'?opts.split('|')[0]:type==='date'?'2026-07-10':'Dato de ejemplo para revisión');
    $('#gen-considerando').value='De la revisión de los actuados, corresponde evaluar la solicitud descrita. Texto de ejemplo sujeto a revisión.';
    $('#gen-resuelve').value='Disponer lo pertinente respecto de la solicitud, conforme al análisis y al formato que valide el área responsable.';
    ['antecedentes','analisis','conclusion','recomendacion'].forEach(k=>$('#inf-'+k).value='Contenido de ejemplo para '+k+'. Debe revisarse con el área responsable.');
    renderNotificaciones(); actualizarDocumento(); programarGuardado(); showToast('Ejemplo ficticio cargado.');
  }
  function inicializarPanelNuevo() {
    $('#filtro-grupo').innerHTML='<option value="">Todos</option>'+TIPOS.map(t=>`<option value="${t.id}">${t.nombre}</option>`).join('');
    const review=document.createElement('div'); review.id='revision-resumen'; review.className='review-summary'; $('.doc-form-body').append(review);
    $('.doc-form').addEventListener('click',e=>{
      const tipo=e.target.closest('[data-tipo]'); if(tipo){ mostrarVista('nuevo'); seleccionarTipo(tipo.dataset.tipo); }
      const quitar=e.target.closest('[data-quitar]'); if(quitar){const ns=notificaciones();ns.splice(Number(quitar.dataset.quitar),1);$('#sol-notificaciones').value=JSON.stringify(ns);renderNotificaciones();actualizarDocumento();programarGuardado();}
      const calc=e.target.closest('[data-calculo]'); if(calc){
        const c=estado.calculo; if(!c){showToast('Primero calcule el plazo en el Módulo 1.');return;}
        const ns=notificaciones(),n=ns[Number(calc.dataset.calculo)];
        n.fecha=c.fechaNotificacion;n.vence=c.fechaVencimiento;n.calculo={...c};
        n.medio=c.notificacionElectronica?'Casilla electrónica':(n.medio==='Casilla electrónica'?'Por confirmar':n.medio);
        $('#sol-notificaciones').value=JSON.stringify(ns);renderNotificaciones();actualizarDocumento();programarGuardado();showToast('Notificación y vencimiento copiados.');
      }
      const correction=e.target.closest('[data-correccion]');if(correction){const el=$(correction.dataset.correccion);mostrarPaso(el?.closest('#form-consentida,#form-general,#form-informe')?2:el?.closest('.form-section')?.querySelector('#sol-queja')?1:3);el?.closest('details')?.setAttribute('open','');el?.focus();}
    });
    $('.doc-form').addEventListener('input',e=>{if(e.target.matches('[data-notif]')){const ns=notificaciones();ns[Number(e.target.dataset.notif)][e.target.dataset.key]=e.target.value; delete ns[Number(e.target.dataset.notif)].calculo;$('#sol-notificaciones').value=JSON.stringify(ns);actualizarDocumento();programarGuardado();}});
    $('.doc-form').addEventListener('change',e=>{if(e.target.matches('[data-notif]')) e.target.dispatchEvent(new Event('input',{bubbles:true}));});
    $('#agregar-notificacion').onclick=()=>{const ns=notificaciones();ns.push({});$('#sol-notificaciones').value=JSON.stringify(ns);renderNotificaciones();actualizarDocumento();programarGuardado();};
    $('#paso-anterior').onclick=()=>mostrarPaso(pasoDocumento-1);$('#paso-siguiente').onclick=()=>mostrarPaso(pasoDocumento+1);
    $('#cargar-ejemplo').onclick=cargarEjemplo;
    $('#doc-formato-consentida').addEventListener('change',()=>{actualizarDocumento();programarGuardado();});
    $('#tab-plantillas').onclick=()=>{mostrarVista('plantillas');renderCatalogoTipos();};
    renderNotificaciones();renderCamposTramite();renderCatalogoTipos();mostrarPaso(0);
  }

  function inicializarDocumento() {
    const formulario = $('.doc-form');
    if (!formulario) return;

    inicializarPanelNuevo();

    const alCambiar = (evento) => {
      const campo = evento.target.closest('[id^="sol-"], [id^="gen-"], [id^="inf-"]');
      if (!campo) return;
      if (campo.id === 'sol-notif1' || campo.id === 'sol-notif2') {
        const vinculo = $('#vincular-notificacion');
        if (vinculo) vinculo.value = '';
      }
      marcarInvalido(campo, false);
      actualizarDocumento();
      programarGuardado();
    };

    formulario.addEventListener('input', alCambiar);
    formulario.addEventListener('change', alCambiar);

    $('#vincular-notificacion')?.addEventListener('change', aplicarVinculoNotificacion);

    $$('[data-grupo]').forEach((boton) => {
      boton.addEventListener('click', () => {
        const grupo = boton.dataset.grupo;
        if (!grupoDisponible(grupo)) return;
        grupoDocumento = grupo;
        actualizarSelectorDocumento();
        programarGuardado();
      });
    });

    $('#doc-unidad')?.addEventListener('change', () => {
      const disponibles=TIPOS.filter(t=>t.unidades.includes(unidadSeleccionada()));
      if(!disponibles.some(t=>t.id===tipoActual().id)){
        $('#sol-tipo').value=disponibles[0].id;
        grupoDocumento=disponibles[0].grupo;
        renderCamposTramite();
      }
      actualizarSelectorDocumento();renderCatalogoTipos();programarGuardado();
    });

    $('#tab-nuevo')?.addEventListener('click', () => {
      mostrarVista('nuevo');
      irAlFormulario();
    });
    $('#tab-documentos')?.addEventListener('click', () => mostrarVista('lista'));
    $('#btn-nuevo-documento')?.addEventListener('click', nuevoDocumento);
    $('#btn-guardar-documento')?.addEventListener('click', () => guardarDocumento());
    $('#lista-documentos')?.addEventListener('click', manejarAccionDocumento);

    ['#filtro-documentos', '#filtro-grupo', '#filtro-estado'].forEach((selector) => {
      const campo = $(selector);
      if (!campo) return;
      campo.addEventListener('input', renderDocumentos);
      campo.addEventListener('change', renderDocumentos);
    });

    $('#btn-generar')?.addEventListener('click', generarDocumento);
    $('#btn-descargar-word')?.addEventListener('click', descargarWordDocumento);
    $('#btn-imprimir')?.addEventListener('click', imprimirDocumento);
    $('#btn-limpiar')?.addEventListener('click', () => limpiarDocumento());
    $('#btn-pantalla-completa')?.addEventListener('click', togglePantallaCompleta);

    actualizarSelectorDocumento();
    actualizarNotaAlmacenamiento();
    mostrarVista('nuevo');
    mostrarPaso(0);
  }

  function actualizarModalidadNotificacion() {
    const checkbox = $('#notificacion-electronica');
    if (!checkbox) return;

    const electronica = checkbox.checked;
    const label = $('#label-fecha-inicio');
    const ayuda = $('#ayuda-notificacion-electronica');
    const ayudaFecha = $('#ayuda-fecha-inicio');

    if (label) {
      label.textContent = electronica ? 'Fecha de casilla' : 'Notificación';
    }
    if (ayuda) {
      ayuda.textContent = electronica
        ? 'Fecha de depósito; suma dos días previos.'
        : 'Suma dos días hábiles previos.';
    }
    if (ayudaFecha) {
      ayudaFecha.textContent = electronica
        ? 'Fecha de depósito en casilla.'
        : 'Cómputo desde el día hábil siguiente.';
    }
  }

  function invalidarResultado() {
    const calculoAnterior = estado.calculo;
    estado.calculo = null;

    const vinculo = $('#vincular-notificacion');
    if (!documentoActualId && vinculo && vinculo.value) {
      const destino = document.getElementById(vinculo.value);
      if (destino && calculoAnterior && destino.value === calculoAnterior.fechaNotificacion) {
        destino.value = '';
        marcarInvalido(destino, false);
      }
      vinculo.value = '';
    }

    guardarCalculo();
    pintarResultado(null);
    pintarModulo2Fechas();
  }

  function marcarInvalido(input, invalido) {
    if (!input) return;
    input.classList.toggle('is-invalid', invalido);
    input.setAttribute('aria-invalid', invalido ? 'true' : 'false');
  }

  function manejarCalcular() {
    const fechaInput = $('#fecha-inicio');
    const diasInput = $('#dias-plazo');
    const checkbox = $('#notificacion-electronica');

    if (!fechaInput || !diasInput || !checkbox) return;

    marcarInvalido(fechaInput, false);
    marcarInvalido(diasInput, false);

    const fechaNotificacion = fechaInput.value;
    const diasTexto = diasInput.value.trim();
    const diasHabiles = Number(diasTexto);
    let primerInvalido = null;

    if (!fechaNotificacion || !esFechaISO(fechaNotificacion)) {
      marcarInvalido(fechaInput, true);
      primerInvalido = primerInvalido || fechaInput;
      showToast('Seleccione una fecha de notificación válida.');
    }

    if (diasTexto === '' || !Number.isInteger(diasHabiles) || diasHabiles < 1 || diasHabiles > MAX_DIAS_HABILES) {
      marcarInvalido(diasInput, true);
      primerInvalido = primerInvalido || diasInput;
      showToast(`Ingrese un número entero de días hábiles entre 1 y ${MAX_DIAS_HABILES}.`);
    }

    if (primerInvalido) {
      invalidarResultado();
      primerInvalido.focus();
      return;
    }

    try {
      const resultado = calcularConCalendario(
        fechaNotificacion,
        diasHabiles,
        checkbox.checked
      );

      if (resultado.aniosAgregados.length > 0) {
        guardarFeriados();
        pintarFeriados();
      }

      estado.calculo = {
        fechaNotificacion,
        diasHabiles,
        notificacionElectronica: checkbox.checked,
        fechaVencimiento: resultado.fechaVencimiento,
        diasNaturales: resultado.diasNaturales,
        semanas: resultado.semanas,
        diasHabilesPrevios: resultado.diasHabilesPrevios,
        fechaInicioPlazo: resultado.fechaInicioPlazo,
        fechaEfectos: resultado.fechaEfectos,
        aniosAgregados: resultado.aniosAgregados,
        aviso: resultado.aviso,
        feriadosHash: hashFeriados(),
        creadoEn: Date.now()
      };

      guardarCalculo();
      pintarResultado(estado.calculo);
      pintarModulo2Fechas();
      pintarAvisoCalendario();

      showToast(
        resultado.aniosAgregados.length > 0
          ? `Plazo calculado. Se agregaron los feriados base ${resultado.aniosAgregados.join(', ')}.`
          : 'Plazo calculado.'
      );
    } catch (error) {
      invalidarResultado();
      showToast(error instanceof Error ? error.message : 'No se pudo calcular el plazo.');
    }
  }

  function agregarFeriado() {
    const fechaInput = $('#fecha-inhabil');
    const tipoSelect = $('#tipo-inhabil');
    const motivoInput = $('#motivo-inhabil');

    if (!fechaInput || !tipoSelect || !motivoInput) return;

    const fecha = fechaInput.value;
    const categoria = tipoSelect.value === 'contingencia' ? 'contingencia' : 'oficial';
    const motivo = motivoInput.value.trim()
      || (categoria === 'contingencia' ? 'Corte de red / Suspensión' : 'Feriado Oficial');

    marcarInvalido(fechaInput, false);

    if (!fecha || !esFechaISO(fecha)) {
      marcarInvalido(fechaInput, true);
      fechaInput.focus();
      showToast('Seleccione una fecha válida.');
      return;
    }

    if (estado.feriados.some((feriado) => feriado.fecha === fecha)) {
      showToast('Ya existe un feriado o contingencia registrado para esa fecha.');
      return;
    }

    estado.feriados.push({
      id: `${categoria}:${fecha}`,
      fecha,
      motivo,
      categoria,
      esPredeterminado: false,
      movil: false,
      offsetPascua: null
    });

    guardarFeriados();
    invalidarResultado();
    pintarFeriados();
    fechaInput.value = '';
    motivoInput.value = '';
    fechaInput.focus();

    const dia = aFecha(fecha);
    const finDeSemana = dia && esFinDeSemana(dia);
    showToast(
      categoria === 'oficial' && finDeSemana
        ? 'Registro agregado. El feriado cae en fin de semana y no altera el cómputo.'
        : 'Día inhábil agregado.'
    );
  }

  function eliminarFeriado(id) {
    const indice = estado.feriados.findIndex((feriado) => feriado.id === id);
    if (indice < 0) return;

    const [eliminado] = estado.feriados.splice(indice, 1);
    guardarFeriados();
    invalidarResultado();
    pintarFeriados();
    showToast(`Registro eliminado: ${fechaVisible(eliminado.fecha)}.`);
  }

  function cargarFeriadosBase() {
    const fecha = aFecha(estado.reloj.fecha) || new Date();
    const anio = fecha.getFullYear();
    const agregados = agregarBaseSilencioso(anio);

    if (agregados === 0) {
      showToast(`Los feriados base ${anio} ya están cargados o sus fechas ya están registradas.`);
      return;
    }

    guardarFeriados();
    invalidarResultado();
    pintarFeriados();
    showToast(`Feriados base ${anio}: ${agregados} nuevo(s).`);
  }

  function copiarFecha() {
    if (!estado.calculo) {
      showToast('Calcule un plazo antes de copiar la fecha.');
      return;
    }

    const texto = ($('#resultado-fecha')?.textContent || '').trim();
    if (!texto || texto.includes('--')) return;

    const confirmar = () => showToast('Fecha copiada al portapapeles.');

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(texto).then(confirmar).catch(() => copiarConSeleccion(texto, confirmar));
    } else {
      copiarConSeleccion(texto, confirmar);
    }
  }

  function copiarConSeleccion(texto, confirmar) {
    const area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();

    try {
      if (document.execCommand('copy')) confirmar();
      else showToast('No se pudo copiar automáticamente.');
    } catch {
      showToast('No se pudo copiar automáticamente.');
    } finally {
      area.remove();
    }
  }

  function usarEnModulo2() {
    if (!estado.calculo) {
      showToast('Calcule un plazo antes de enviarlo al Módulo 2.');
      return;
    }
    window.location.hash = '#/documentos';
  }

  /* ------------------------------------------------------------------ */
  /* Reloj manual                                                        */
  /* ------------------------------------------------------------------ */

  function abrirModalReloj() {
    const modal = $('#modal-reloj');
    const input = $('#input-fecha-manual');
    if (!modal || !input) return;

    focoAnteriorModal = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    input.value = estado.reloj.fecha;
    marcarInvalido(input, false);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    pintarReloj();

    window.requestAnimationFrame(() => {
      input.focus();
    });
  }

  function cerrarModalReloj() {
    const modal = $('#modal-reloj');
    if (!modal) return;

    modal.hidden = true;
    document.body.style.overflow = '';

    if (focoAnteriorModal && typeof focoAnteriorModal.focus === 'function') {
      focoAnteriorModal.focus();
    }
    focoAnteriorModal = null;
  }

  function activarFechaManual() {
    const input = $('#input-fecha-manual');
    if (!input) return;

    const fecha = input.value;
    if (!fecha || !esFechaISO(fecha)) {
      marcarInvalido(input, true);
      input.focus();
      showToast('Seleccione una fecha manual válida.');
      return;
    }

    marcarInvalido(input, false);
    estado.reloj = { manual: true, fecha };
    guardarReloj();

    const fechaInicio = $('#fecha-inicio');
    if (fechaInicio) {
      fechaInicio.value = fecha;
      marcarInvalido(fechaInicio, false);
    }

    invalidarResultado();
    pintarReloj();
    pintarFeriados();
    cerrarModalReloj();
    showToast(`Fecha manual: ${fechaVisible(fecha)}.`);
  }

  function desactivarFechaManual() {
    estado.reloj = { manual: false, fecha: hoyISO() };
    guardarReloj();

    const fechaInicio = $('#fecha-inicio');
    if (fechaInicio) {
      fechaInicio.value = estado.reloj.fecha;
      marcarInvalido(fechaInicio, false);
    }

    invalidarResultado();
    pintarReloj();
    pintarFeriados();
    cerrarModalReloj();
    showToast(`Fecha del equipo: ${fechaVisible(estado.reloj.fecha)}.`);
  }

  function revisarCambioDeDia() {
    if (estado.reloj.manual) return;

    const hoy = hoyISO();
    if (hoy === estado.reloj.fecha) return;

    estado.reloj.fecha = hoy;
    pintarReloj();
    pintarFeriados();
    pintarAvisoCalendario();
    showToast(`La fecha del equipo cambió a ${fechaVisible(hoy)}.`);
  }

  /* ------------------------------------------------------------------ */
  /* Navegación                                                          */
  /* ------------------------------------------------------------------ */

  function rutaDesdeHash() {
    return window.location.hash.replace(/^#\/?/, '').split('?')[0];
  }

  function reemplazarHash(hash) {
    try {
      window.history.replaceState(null, '', hash);
    } catch {
      window.location.hash = hash;
    }
  }

  function normalizarRuta() {
    const ruta = rutaDesdeHash();
    if (Object.prototype.hasOwnProperty.call(ROUTES, ruta)) return ruta;

    const hash = `#/${DEFAULT_ROUTE}`;
    if (window.location.hash !== hash) reemplazarHash(hash);
    return DEFAULT_ROUTE;
  }

  function actualizarNavegacion(ruta) {
    $$('[data-nav]').forEach((enlace) => {
      const activo = enlace.dataset.nav === ruta;
      enlace.classList.toggle('is-active', activo);
      if (activo) enlace.setAttribute('aria-current', 'page');
      else enlace.removeAttribute('aria-current');
    });
  }

  function render(ruta, enfocar = false) {
    const meta = ROUTES[ruta] || ROUTES[DEFAULT_ROUTE];

    $$('[data-page]').forEach((pagina) => {
      pagina.hidden = pagina.dataset.page !== ruta;
    });

    actualizarNavegacion(ruta);

    const titulo = $('#page-title');
    if (titulo) titulo.textContent = meta.title;

    document.title = `${meta.title} · ODANC Arequipa`;

    if (ruta === 'documentos') pintarModulo2Fechas();

    if (enfocar) {
      const encabezado = $('#page-title');
      if (encabezado) {
        encabezado.setAttribute('tabindex', '-1');
        encabezado.focus({ preventScroll: true });
      }
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }
  }

  function manejarCambioRuta() {
    render(normalizarRuta(), true);
  }

  /* ------------------------------------------------------------------ */
  /* Toasts                                                              */
  /* ------------------------------------------------------------------ */

  function showToast(mensaje, duracion = 3600) {
    const toast = $('#toast');
    if (!toast) return;

    toast.textContent = mensaje;
    toast.classList.add('is-visible');

    if (toastTimer !== null) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
      toastTimer = null;
    }, duracion);
  }

  /* ------------------------------------------------------------------ */
  /* Panel de pruebas (solo ?debug=1)                                    */
  /* ------------------------------------------------------------------ */

  function crearPanelDebug() {
    const base2026 = generarFeriadosBase(2026);
    const base2027 = generarFeriadosBase(2027);
    const ambas = [...base2026, ...base2027];
    const contingencia = [{ fecha: '2026-11-09', categoria: 'contingencia', motivo: 'Prueba' }];

    const lanza = (fn) => {
      try {
        fn();
        return false;
      } catch {
        return true;
      }
    };

    const pruebas = [
      [
        '14/09/2026 + 3 sin casilla = 17/09/2026',
        () => calcularPlazo('2026-09-14', 3, false, base2026).fechaVencimiento === '2026-09-17'
      ],
      [
        '14/09/2026 + 3 con casilla = 21/09/2026',
        () => {
          const r = calcularPlazo('2026-09-14', 3, true, base2026);
          return r.fechaVencimiento === '2026-09-21'
            && r.diasHabilesPrevios === 2
            && r.fechaEfectos === '2026-09-16'
            && r.fechaInicioPlazo === '2026-09-17';
        }
      ],
      [
        'Feriados 28 y 29/07 dentro del plazo',
        () => calcularPlazo('2026-07-27', 3, false, base2026).fechaVencimiento === '2026-08-03'
      ],
      [
        'Feriado 15/08 en sábado no se traslada',
        () => calcularPlazo('2026-08-14', 1, false, base2026).fechaVencimiento === '2026-08-17'
      ],
      [
        'Contingencia 09/11 se descuenta',
        () => calcularPlazo('2026-11-06', 1, false, contingencia).fechaVencimiento === '2026-11-10'
      ],
      [
        'Cruce de año con base 2026 y 2027',
        () => calcularPlazo('2026-12-24', 5, false, ambas).fechaVencimiento === '2027-01-04'
      ],
      [
        'Días naturales y semanas',
        () => {
          const r = calcularPlazo('2026-09-14', 3, false, []);
          return r.diasNaturales === 3 && r.semanas === 0.4;
        }
      ],
      [
        'Plazo 0 rechazado',
        () => lanza(() => calcularPlazo('2026-09-14', 0, false, base2026))
      ],
      [
        'Plazo mayor a 5000 rechazado',
        () => lanza(() => calcularPlazo('2026-09-14', 5001, false, base2026))
      ]
    ];

    const panel = document.createElement('section');
    panel.className = 'debug-panel';
    panel.setAttribute('aria-label', 'Panel de pruebas del motor');

    const cabecera = document.createElement('div');
    cabecera.className = 'debug-head';
    const titulo = document.createElement('strong');
    titulo.textContent = `Pruebas del motor · v${APP_VERSION}`;
    const nota = document.createElement('span');
    nota.textContent = 'Solo visible con ?debug=1';
    cabecera.append(titulo, nota);

    const tabla = document.createElement('table');
    tabla.className = 'debug-table';
    const thead = document.createElement('thead');
    const filaHead = document.createElement('tr');
    const thEstado = document.createElement('th');
    thEstado.textContent = 'Estado';
    const thPrueba = document.createElement('th');
    thPrueba.textContent = 'Caso';
    filaHead.append(thEstado, thPrueba);
    thead.appendChild(filaHead);
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    pruebas.forEach(([nombre, ejecutar]) => {
      let ok = false;
      try {
        ok = ejecutar() === true;
      } catch {
        ok = false;
      }

      const fila = document.createElement('tr');
      const estadoCelda = document.createElement('td');
      estadoCelda.className = ok ? 'debug-pass' : 'debug-fail';
      estadoCelda.textContent = ok ? 'PASS' : 'FAIL';
      const nombreCelda = document.createElement('td');
      nombreCelda.textContent = nombre;
      fila.append(estadoCelda, nombreCelda);
      tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
    panel.append(cabecera, tabla);
    document.body.appendChild(panel);
  }

  /* ------------------------------------------------------------------ */
  /* Inicialización                                                      */
  /* ------------------------------------------------------------------ */

  function inicializarFormulario() {
    const fechaInput = $('#fecha-inicio');
    const diasInput = $('#dias-plazo');
    const checkbox = $('#notificacion-electronica');

    if (estado.calculo) {
      if (fechaInput) fechaInput.value = estado.calculo.fechaNotificacion;
      if (diasInput) diasInput.value = String(estado.calculo.diasHabiles);
      if (checkbox) checkbox.checked = estado.calculo.notificacionElectronica;
      return;
    }

    if (fechaInput) fechaInput.value = estado.reloj.fecha;
    if (diasInput) diasInput.value = '15';
    if (checkbox) checkbox.checked = false;
  }

  function manejarClicDocumento(event) {
    const pendiente = event.target.closest('[data-pending]');
    if (pendiente) {
      event.preventDefault();
      showToast(pendiente.dataset.pending);
      return;
    }

    if (event.target.closest('[data-close-reloj]')) {
      cerrarModalReloj();
    }
  }

  function init() {
    almacenamientoDisponible = probarAlmacenamiento();
    cargarEstado();

    pintarReloj();
    inicializarFormulario();
    actualizarModalidadNotificacion();
    pintarFeriados();
    pintarAvisoCalendario();
    pintarResultado(estado.calculo);
    pintarModulo2Fechas();
    inicializarDocumento();

    render(normalizarRuta(), false);

    $('#btn-calcular-plazo')?.addEventListener('click', manejarCalcular);
    $('#btn-feriados-base')?.addEventListener('click', cargarFeriadosBase);
    $('#btn-agregar-inhabil')?.addEventListener('click', agregarFeriado);
    $('#btn-copiar')?.addEventListener('click', copiarFecha);
    $('#btn-usar-modulo2')?.addEventListener('click', usarEnModulo2);

    $('#btn-abrir-reloj')?.addEventListener('click', abrirModalReloj);
    $('#btn-banner-cambiar')?.addEventListener('click', abrirModalReloj);
    $('#btn-banner-desactivar')?.addEventListener('click', desactivarFechaManual);
    $('#btn-activar-manual')?.addEventListener('click', activarFechaManual);
    $('#btn-desactivar-manual')?.addEventListener('click', desactivarFechaManual);
    $('#btn-cancelar-reloj')?.addEventListener('click', cerrarModalReloj);
    $('#btn-cerrar-modal-reloj')?.addEventListener('click', cerrarModalReloj);

    $('#fecha-inicio')?.addEventListener('input', () => {
      marcarInvalido($('#fecha-inicio'), false);
      invalidarResultado();
    });

    $('#dias-plazo')?.addEventListener('input', () => {
      marcarInvalido($('#dias-plazo'), false);
      invalidarResultado();
    });

    $('#notificacion-electronica')?.addEventListener('change', () => {
      actualizarModalidadNotificacion();
      invalidarResultado();
    });

    $('#dias-plazo')?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        manejarCalcular();
      }
    });

    $('#motivo-inhabil')?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        agregarFeriado();
      }
    });

    $('#input-fecha-manual')?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        activarFechaManual();
      }
    });

    document.addEventListener('click', manejarClicDocumento);
    window.addEventListener('hashchange', manejarCambioRuta);

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const modal = $('#modal-reloj');
      if (modal && !modal.hidden) {
        cerrarModalReloj();
        return;
      }
      cerrarPantallaCompleta();
    });

    window.setInterval(revisarCambioDeDia, 60_000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) revisarCambioDeDia();
    });

    if (new URLSearchParams(window.location.search).has('debug')) {
      crearPanelDebug();
    }

    if (calculoDescartado) {
      window.setTimeout(() => {
        showToast('El último cálculo se descartó porque el calendario de feriados cambió.');
      }, 500);
    }

    if (!almacenamientoDisponible && !avisoAlmacenamientoMostrado) {
      avisoAlmacenamientoMostrado = true;
      window.setTimeout(() => {
        showToast('El navegador bloqueó el almacenamiento. El prototipo funcionará solo en memoria.', 5200);
      }, 700);
    }

    console.info(`ODANC Arequipa · prototipo v${APP_VERSION}`);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
