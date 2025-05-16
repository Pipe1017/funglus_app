// src/preload/index.js
import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  // NUEVA función para inicializar ciclo
  initializeCicloPlaceholders: (cicloId) => ipcRenderer.invoke('ciclo:initialize-placeholders', cicloId),
  getDistinctCiclos: () => ipcRenderer.invoke('ciclo:get-distinct'), // <--- AÑADE ESTA LÍNEA
  
  // Laboratorio - MATERIA PRIMA (NUEVO)
  updateMateriaPrimaByCiclo: (cicloId, data) => ipcRenderer.invoke('lab:update-materia_prima-by-ciclo', { cicloId, data }),
  getMateriaPrimaByCiclo: (cicloId) => ipcRenderer.invoke('lab:get-materia_prima-by-ciclo', cicloId),
  // getAllMateriaPrima: () => ipcRenderer.invoke('lab:get-all-materia_prima'), // Si lo necesitas

  // Laboratorio - GUBYS
  // Cambiado de submitGubys a updateGubysByCiclo, ahora pasamos cicloId y data
  updateGubysByCiclo: (cicloId, data) => ipcRenderer.invoke('lab:update-gubys-by-ciclo', { cicloId, data }),
  getGubysByCiclo: (cicloId) => ipcRenderer.invoke('lab:get-gubys-by-ciclo', cicloId),
  // getAllGubys: () => ipcRenderer.invoke('lab:get-all-gubys'),

  // Laboratorio - CENIZAS
  updateCenizasByCiclo: (cicloId, data) => ipcRenderer.invoke('lab:update-cenizas-by-ciclo', { cicloId, data }),
  getCenizasByCiclo: (cicloId) => ipcRenderer.invoke('lab:get-cenizas-by-ciclo', cicloId),
  // getAllCenizas: () => ipcRenderer.invoke('lab:get-all-cenizas'),
  
  // Formulación
  updateFormulacionByCiclo: (cicloId, data) => ipcRenderer.invoke('form:update-formulacion-by-ciclo', { cicloId, data }),
  getFormulacionByCiclo: (cicloId) => ipcRenderer.invoke('form:get-formulacion-by-ciclo', cicloId),
  // getAllFormulaciones: () => ipcRenderer.invoke('form:get-all-formulaciones'),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI)
    console.log('Preload: electronAPI (actualizada) expuesta al mundo principal.');
  } catch (error) {
    console.error('Preload: Fallo al exponer electronAPI:', error)
  }
} else {
  console.warn('Preload: Context Isolation está deshabilitado...')
}