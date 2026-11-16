/* ==========================================================================
   ODANC Arequipa · Catálogo de plantillas del Módulo 2 · v0.5.0-alpha2
   Datos de muestra y propuestas sujetas a validación con las unidades.
   ========================================================================== */

(() => {
  'use strict';

  const unidades = [
    'Calificación',
    'Prevención',
    'Sanción',
    'Apelación',
    'Jefatura / Juez de Paz'
  ];

  const grupos = {
    general: {
      id: 'general',
      nombre: 'Resolución General',
      estado: 'Propuesta por validar',
      descripcion: 'Borrador institucional con Vistos, Considerando y Parte Resolutiva.',
      unidades: ['Calificación', 'Prevención', 'Sanción', 'Apelación']
    },
    consentida: {
      id: 'consentida',
      nombre: 'Resolución Consentida',
      estado: 'Base proporcionada',
      descripcion: 'Plantilla de Juez de Paz basada en el documento entregado.',
      unidades: ['Jefatura / Juez de Paz']
    },
    informe: {
      id: 'informe',
      nombre: 'Informe de Calificación',
      estado: 'Propuesta por validar',
      descripcion: 'Borrador con Datos, Antecedentes, Análisis, Conclusión y Recomendación.',
      unidades: ['Calificación']
    }
  };

  const placeholders = {
    EXPEDIENTE: { etiqueta: 'Expediente', fuente: 'Formulario' },
    QUEJA: { etiqueta: 'Queja N°', fuente: 'Formulario' },
    PARTES: { etiqueta: 'Partes', fuente: 'Formulario' },
    QUEJADO: { etiqueta: 'Quejado', fuente: 'Formulario' },
    INVESTIGACION: { etiqueta: 'Investigación', fuente: 'Formulario' },
    ORIGEN: { etiqueta: 'Origen', fuente: 'Formulario' },
    UNIDAD: { etiqueta: 'Unidad', fuente: 'Formulario' },
    RESOLUCION_REFERENCIA: { etiqueta: 'Resolución de referencia', fuente: 'Formulario' },
    RESOLUCION_NUMERO: { etiqueta: 'Resolución / Informe N°', fuente: 'Formulario' },
    FECHA_RESOLUCION: { etiqueta: 'Fecha de la resolución', fuente: 'Formulario' },
    FIRMANTE: { etiqueta: 'Firmante', fuente: 'Formulario' },
    CARGO: { etiqueta: 'Cargo', fuente: 'Formulario' },
    INICIALES: { etiqueta: 'Iniciales', fuente: 'Formulario' },
    FECHA_NOTIFICACION: { etiqueta: 'Fecha de notificación', fuente: 'Módulo 1' },
    FECHA_VENCIMIENTO: { etiqueta: 'Fecha de vencimiento', fuente: 'Módulo 1' },
    FECHA_CONSENTIDA: { etiqueta: 'Fecha consentida', fuente: 'Definición del formato pendiente de validación' },
    DIAS_HABILES: { etiqueta: 'Días hábiles', fuente: 'Módulo 1' }
  };

  const textos = {
    general: {
      considerando: '',
      resuelve: ''
    },
    informe: {
      antecedentes: '',
      analisis: '',
      conclusion: '',
      recomendacion: ''
    }
  };

  // Matriz inicial para el catálogo visual del prototipo.
  const matriz = unidades.map((unidad) => {
    const estado = (grupo) => {
      if (grupo === 'general') {
        if (unidad === 'Jefatura / Juez de Paz') return '—';
        return unidad === 'Calificación' ? 'Propuesta' : 'Estructura';
      }
      if (grupo === 'consentida') {
        return unidad === 'Jefatura / Juez de Paz' ? 'Base' : 'Pendiente';
      }
      if (grupo === 'informe') {
        return unidad === 'Calificación' ? 'Propuesta' : (unidad === 'Jefatura / Juez de Paz' ? '—' : 'Pendiente');
      }
      return '—';
    };

    return {
      unidad,
      general: estado('general'),
      consentida: estado('consentida'),
      informe: estado('informe')
    };
  });

  window.ODANC_PLANTILLAS = {
    unidades,
    grupos,
    placeholders,
    textos,
    matriz
  };
})();
