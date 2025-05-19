// src/preload/index.js
import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  // Utilidades de Ciclo
  getDistinctCiclos: () => ipcRenderer.invoke('ciclo:get-distinct'), // <--- ESTA LÍNEA ES CRUCIAL

  // Materia Prima
  getOrCreateMateriaPrima: (keys) => ipcRenderer.invoke('lab:get-or-create-materia_prima', keys),
  updateMateriaPrima: (keys, data) =>
    ipcRenderer.invoke('lab:update-materia_prima', { keys, data }),

  // Gubys
  getOrCreateGubys: (keys) => ipcRenderer.invoke('lab:get-or-create-gubys', keys),
  updateGubys: (keys, data) => ipcRenderer.invoke('lab:update-gubys', { keys, data }),

  // Tamo Humedo
  getOrCreateTamoHumedo: (keys) => ipcRenderer.invoke('lab:get-or-create-tamo_humedo', keys),
  updateTamoHumedo: (keys, data) => ipcRenderer.invoke('lab:update-tamo_humedo', { keys, data }),

  // Catálogos - Ciclos (Estos son para la página de Gestión de Ciclos)
  createCiclo: (data) => ipcRenderer.invoke('catalogo:create-ciclo', data),
  getAllCiclos: () => ipcRenderer.invoke('catalogo:get-all-ciclos'),
  getCicloById: (id) => ipcRenderer.invoke('catalogo:get-ciclo-by-id', id),
  updateCiclo: (id, data) => ipcRenderer.invoke('catalogo:update-ciclo', { id, data }),
  deleteCiclo: (id) => ipcRenderer.invoke('catalogo:delete-ciclo', id),

  // Catálogos - Etapas
  createEtapa: (data) => ipcRenderer.invoke('catalogo:create-etapa', data),
  getAllEtapas: () => ipcRenderer.invoke('catalogo:get-all-etapas'),
  updateEtapa: (id, data) => ipcRenderer.invoke('catalogo:update-etapa', { id, data }),
  deleteEtapa: (id) => ipcRenderer.invoke('catalogo:delete-etapa', id),

  // Catálogos - Muestras
  createMuestra: (data) => ipcRenderer.invoke('catalogo:create-muestra', data),
  getAllMuestras: () => ipcRenderer.invoke('catalogo:get-all-muestras'),
  updateMuestra: (id, data) => ipcRenderer.invoke('catalogo:update-muestra', { id, data }),
  deleteMuestra: (id) => ipcRenderer.invoke('catalogo:delete-muestra', id),

  // Catálogos - Origenes
  createOrigen: (data) => ipcRenderer.invoke('catalogo:create-origen', data),
  getAllOrigenes: () => ipcRenderer.invoke('catalogo:get-all-origenes'),
  updateOrigen: (id, data) => ipcRenderer.invoke('catalogo:update-origen', { id, data }),
  deleteOrigen: (id) => ipcRenderer.invoke('catalogo:delete-origen', id),

  // Datos Generales Laboratorio
  getOrCreateDatosGenerales: (keys) => ipcRenderer.invoke('datosGenerales:get-or-create', keys),
  updateDatosGenerales: (keys, data) => ipcRenderer.invoke('datosGenerales:update', { keys, data }),
  getDatosGeneralesByCiclo: (cicloId) => ipcRenderer.invoke('datosGenerales:get-by-ciclo', cicloId),
  deleteDatosGenerales: (keys) => ipcRenderer.invoke('datosGenerales:delete', keys),

  // Datos Cenizas
  createDatosCenizas: (data) => ipcRenderer.invoke('datosCenizas:create', data),
  getDatosCenizasByContext: (keys) => ipcRenderer.invoke('datosCenizas:get-by-context', keys),
  updateDatosCenizas: (analisisId, data) =>
    ipcRenderer.invoke('datosCenizas:update', { analisisId, data }),
  deleteDatosCenizas: (analisisId) => ipcRenderer.invoke('datosCenizas:delete', analisisId),
  getDatosCenizasById: (analisisId) => ipcRenderer.invoke('datosCenizas:get-by-id', analisisId),

  // Datos Nitrógeno
  createDatosNitrogeno: (data) => ipcRenderer.invoke('datosNitrogeno:create', data),
  getDatosNitrogenoByContext: (keys) => ipcRenderer.invoke('datosNitrogeno:get-by-context', keys),
  updateDatosNitrogeno: (analisisId, data) =>
    ipcRenderer.invoke('datosNitrogeno:update', { analisisId, data }),
  deleteDatosNitrogeno: (analisisId) => ipcRenderer.invoke('datosNitrogeno:delete', analisisId),
  getDatosNitrogenoById: (analisisId) => ipcRenderer.invoke('datosNitrogeno:get-by-id', analisisId)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI)
    console.log('Preload: electronAPI (COMPLETA REESTRUCTURADA V2) expuesta al mundo principal.')
  } catch (error) {
    console.error('Preload: Fallo al exponer electronAPI:', error)
  }
} else {
  console.warn('Preload: Context Isolation está deshabilitado.')
}
