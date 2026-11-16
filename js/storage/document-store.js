/* ==========================================================================
   ODANC Arequipa · Almacenamiento local de documentos · v0.5.0-alpha2
   IndexedDB con respaldo en memoria. Sin dependencias externas.
   ========================================================================== */

(() => {
  'use strict';

  const DB_NAME = 'odanc.proto.documentos';
  const DB_VERSION = 1;
  const STORE = 'documentos';
  const memoria = new Map();

  let dbPromise = null;
  let disponible = true;

  function nuevoId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function abrir() {
    if (!('indexedDB' in window)) {
      return Promise.reject(new Error('IndexedDB no está disponible.'));
    }

    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const solicitud = window.indexedDB.open(DB_NAME, DB_VERSION);

        solicitud.onupgradeneeded = () => {
          const db = solicitud.result;
          if (!db.objectStoreNames.contains(STORE)) {
            const store = db.createObjectStore(STORE, { keyPath: 'id' });
            store.createIndex('actualizadoEn', 'actualizadoEn');
            store.createIndex('grupo', 'grupo');
            store.createIndex('unidad', 'unidad');
          }
        };

        solicitud.onsuccess = () => resolve(solicitud.result);
        solicitud.onerror = () => reject(solicitud.error || new Error('No se pudo abrir IndexedDB.'));
        solicitud.onblocked = () => reject(new Error('IndexedDB está bloqueado por otra pestaña.'));
      });
    }

    return dbPromise;
  }

  function ejecutar(modo, accion) {
    return abrir().then((db) => new Promise((resolve, reject) => {
      const transaccion = db.transaction(STORE, modo);
      const store = transaccion.objectStore(STORE);
      let solicitud;

      try {
        solicitud = accion(store);
      } catch (error) {
        reject(error);
        return;
      }

      transaccion.oncomplete = () => resolve(solicitud ? solicitud.result : undefined);
      transaccion.onerror = () => reject(transaccion.error || new Error('Error de IndexedDB.'));
      transaccion.onabort = () => reject(transaccion.error || new Error('Transacción cancelada.'));
    }));
  }

  function ordenar(documentos) {
    return documentos.slice().sort((a, b) => (b.actualizadoEn || 0) - (a.actualizadoEn || 0));
  }

  async function listar() {
    try {
      return ordenar(await ejecutar('readonly', (store) => store.getAll()));
    } catch {
      disponible = false;
      return ordenar([...memoria.values()]);
    }
  }

  async function obtener(id) {
    try {
      return await ejecutar('readonly', (store) => store.get(id));
    } catch {
      disponible = false;
      return memoria.get(id) || null;
    }
  }

  async function guardar(documento) {
    try {
      await ejecutar('readwrite', (store) => store.put(documento));
    } catch {
      disponible = false;
    }
    memoria.set(documento.id, documento);
    return documento;
  }

  async function eliminar(id) {
    memoria.delete(id);
    try {
      await ejecutar('readwrite', (store) => store.delete(id));
    } catch {
      disponible = false;
    }
  }

  async function limpiar() {
    memoria.clear();
    try {
      await ejecutar('readwrite', (store) => store.clear());
    } catch {
      disponible = false;
    }
  }

  async function exportar() {
    const documentos = await listar();
    return {
      schemaVersion: 1,
      generadoEn: new Date().toISOString(),
      documentos
    };
  }

  window.ODANC_DOCS = {
    nuevoId,
    listar,
    obtener,
    guardar,
    eliminar,
    limpiar,
    exportar,
    get disponible() {
      return disponible;
    }
  };
})();
