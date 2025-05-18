// src/preload/index.js
import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  // Utilidades de Ciclo
  getDistinctCiclos: () => ipcRenderer.invoke('ciclo:get-distinct'),

  // Materia Prima (Claves: ciclo, origen, muestra)
  getOrCreateMateriaPrima: (keys) => ipcRenderer.invoke('lab:get-or-create-materia_prima', keys),
  updateMateriaPrima: (keys, data) =>
    ipcRenderer.invoke('lab:update-materia_prima', { keys, data }),

  // Gubys (Claves: ciclo, origen)
  getOrCreateGubys: (keys) => ipcRenderer.invoke('lab:get-or-create-gubys', keys),
  updateGubys: (keys, data) => ipcRenderer.invoke('lab:update-gubys', { keys, data }),

  // Tamo Humedo (Claves: ciclo, origen)
  getOrCreateTamoHumedo: (keys) => ipcRenderer.invoke('lab:get-or-create-tamo_humedo', keys),
  updateTamoHumedo: (keys, data) => ipcRenderer.invoke('lab:update-tamo_humedo', { keys, data })

  // Formulacion (Placeholder para el futuro, Claves: ciclo, muestra - según tu última definición)
  // getOrCreateFormulacion: (keys) => ipcRenderer.invoke('form:get-or-create-formulacion', keys),
  // updateFormulacion: (keys, data) => ipcRenderer.invoke('form:update-formulacion', { keys, data }),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI)
    console.log('Preload: electronAPI (reestructurada) expuesta al mundo principal.')
  } catch (error) {
    console.error('Preload: Fallo al exponer electronAPI:', error)
  }
} else {
  console.warn('Preload: Context Isolation está deshabilitado.')
}
