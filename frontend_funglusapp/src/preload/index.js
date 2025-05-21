// src/preload/index.js
import { contextBridge } from 'electron'

// Ya que el frontend hará llamadas HTTP directas al backend FastAPI,
// no necesitamos exponer la mayoría de las funciones API aquí.
// Mantendremos la estructura por si se necesita exponer alguna API
// específica de Electron/Node.js en el futuro (ej. manejo de archivos, diálogos nativos).
const electronAPI = {}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI)
    // Actualiza el mensaje de consola para reflejar el cambio
    console.log(
      'Preload: electronAPI (simplificada para HTTP directo) expuesta al mundo principal.'
    )
  } catch (error) {
    console.error('Preload: Fallo al exponer electronAPI:', error)
  }
} else {
  console.warn(
    'Preload: Context Isolation está deshabilitado. Considera habilitarlo por seguridad.'
  )
  // window.electronAPI = electronAPI; // Solo si contextIsolation es false
}
