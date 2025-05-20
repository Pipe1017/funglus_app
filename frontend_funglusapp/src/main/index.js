// src/main/index.js
import { electronApp, is } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'

// --- Función Helper para preparar payloads ---
function prepareDatosGeneralesPayload(data) {
  // Asegurar snake_case y manejar valores null
  return {
    ciclo_id: Number(data.cicloId || data.ciclo_id),
    etapa_id: Number(data.etapaId || data.etapa_id),
    muestra_id: data.muestraId || data.muestra_id ? Number(data.muestraId || data.muestra_id) : 0,
    origen_id: data.origenId || data.origen_id ? Number(data.origenId || data.origen_id) : 0,
    // Copiar el resto de campos sin modificar
    ...Object.fromEntries(
      Object.entries(data).filter(
        ([key]) => !['cicloId', 'etapaId', 'muestraId', 'origenId', 'keys'].includes(key)
      )
    )
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    if (is.dev) mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.funglusapp.desktop')
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// --- Función para manejar peticiones API ---
async function handleAPIRequest(endpoint, method = 'GET', bodyData = null) {
  const url = `${FASTAPI_BASE_URL}${endpoint}`

  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    }

    if (bodyData && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      options.body = JSON.stringify(bodyData)
    }

    const response = await fetch(url, options)
    const responseStatus = response.status

    if (!response.ok) {
      const errorText = await response.text()
      let errorDetail = `Error HTTP ${responseStatus}`

      try {
        const errorJson = JSON.parse(errorText)
        errorDetail = errorJson.detail || errorDetail
      } catch {
        errorDetail = `${errorDetail}: ${errorText.substring(0, 100)}`
      }

      throw new Error(errorDetail)
    }

    return responseStatus === 204 ? null : await response.json()
  } catch (error) {
    console.error(`Error en ${method} ${url}:`, error.message)
    throw error
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.funglusapp.desktop')
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // --- Manejadores IPC ---

  // Catálogos - Ciclos
  ipcMain.handle('catalogo:create-ciclo', (_, data) =>
    handleAPIRequest('/catalogos/ciclos/', 'POST', data)
  )
  ipcMain.handle('catalogo:get-all-ciclos', () => handleAPIRequest('/catalogos/ciclos/'))
  ipcMain.handle('catalogo:get-ciclo-by-id', (_, id) => handleAPIRequest(`/catalogos/ciclos/${id}`))
  ipcMain.handle('catalogo:update-ciclo', (_, { id, data }) =>
    handleAPIRequest(`/catalogos/ciclos/${id}`, 'PUT', data)
  )
  ipcMain.handle('catalogo:delete-ciclo', (_, id) =>
    handleAPIRequest(`/catalogos/ciclos/${id}`, 'DELETE')
  )

  // Catálogos - Etapas
  ipcMain.handle('catalogo:create-etapa', (_, data) =>
    handleAPIRequest('/catalogos/etapas/', 'POST', data)
  )
  ipcMain.handle('catalogo:get-all-etapas', () => handleAPIRequest('/catalogos/etapas/'))
  ipcMain.handle('catalogo:update-etapa', (_, { id, data }) =>
    handleAPIRequest(`/catalogos/etapas/${id}`, 'PUT', data)
  )
  ipcMain.handle('catalogo:delete-etapa', (_, id) =>
    handleAPIRequest(`/catalogos/etapas/${id}`, 'DELETE')
  )

  // Catálogos - Muestras
  ipcMain.handle('catalogo:create-muestra', (_, data) =>
    handleAPIRequest('/catalogos/muestras/', 'POST', data)
  )
  ipcMain.handle('catalogo:get-all-muestras', () => handleAPIRequest('/catalogos/muestras/'))
  ipcMain.handle('catalogo:update-muestra', (_, { id, data }) =>
    handleAPIRequest(`/catalogos/muestras/${id}`, 'PUT', data)
  )
  ipcMain.handle('catalogo:delete-muestra', (_, id) =>
    handleAPIRequest(`/catalogos/muestras/${id}`, 'DELETE')
  )

  // Catálogos - Origenes
  ipcMain.handle('catalogo:create-origen', (_, data) =>
    handleAPIRequest('/catalogos/origenes/', 'POST', data)
  )
  ipcMain.handle('catalogo:get-all-origenes', () => handleAPIRequest('/catalogos/origenes/'))
  ipcMain.handle('catalogo:update-origen', (_, { id, data }) =>
    handleAPIRequest(`/catalogos/origenes/${id}`, 'PUT', data)
  )
  ipcMain.handle('catalogo:delete-origen', (_, id) =>
    handleAPIRequest(`/catalogos/origenes/${id}`, 'DELETE')
  )

  // --- Manejadores IPC para Datos Generales ---
  ipcMain.handle('datosGenerales:get-or-create', async (_, keys) => {
    try {
      const payload = prepareDatosGeneralesPayload(keys)
      console.log('Enviando a get-or-create:', payload)
      return await handleAPIRequest('/datos_laboratorio/entry', 'POST', payload)
    } catch (error) {
      console.error('Error en get-or-create:', error)
      throw new Error(`No se pudo obtener/crear datos: ${error.message}`)
    }
  })

  ipcMain.handle('datosGenerales:update', async (_, data) => {
    try {
      const payload = prepareDatosGeneralesPayload(data)
      console.log('Enviando a update:', payload)
      return await handleAPIRequest('/datos_laboratorio/entry', 'PUT', payload)
    } catch (error) {
      console.error('Error en update:', error)
      throw new Error(`No se pudo actualizar: ${error.message}`)
    }
  })

  ipcMain.handle('datosGenerales:get-by-ciclo', async (_, cicloId) => {
    try {
      return await handleAPIRequest(`/datos_laboratorio/ciclo/${cicloId}`)
    } catch (error) {
      console.error('Error en get-by-ciclo:', error)
      throw new Error(`No se pudo obtener datos por ciclo: ${error.message}`)
    }
  })

  ipcMain.handle('datosGenerales:delete', async (_, keys) => {
    try {
      const payload = prepareDatosGeneralesPayload(keys)
      console.log('Enviando a delete:', payload)
      return await handleAPIRequest('/datos_laboratorio/entry', 'DELETE', payload)
    } catch (error) {
      console.error('Error en delete:', error)
      throw new Error(`No se pudo eliminar: ${error.message}`)
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Datos Cenizas
ipcMain.handle('datosCenizas:create', (_, data) =>
  handleAPIRequest('/datos_cenizas/', 'POST', data)
)
ipcMain.handle('datosCenizas:get-by-context', (_, keys) => {
  const queryParams = new URLSearchParams(keys).toString()
  return handleAPIRequest(`/datos_cenizas/contexto/?${queryParams}`)
})
ipcMain.handle('datosCenizas:get-by-id', (_, analisisId) =>
  handleAPIRequest(`/datos_cenizas/${analisisId}`)
)
ipcMain.handle('datosCenizas:update', (_, { analisisId, data }) =>
  handleAPIRequest(`/datos_cenizas/${analisisId}`, 'PUT', data)
)
ipcMain.handle('datosCenizas:delete', (_, analisisId) =>
  handleAPIRequest(`/datos_cenizas/${analisisId}`, 'DELETE')
)

// Datos Nitrógeno
ipcMain.handle('datosNitrogeno:create', (_, data) =>
  handleAPIRequest('/datos_nitrogeno/', 'POST', data)
)
ipcMain.handle('datosNitrogeno:get-by-context', (_, keys) => {
  const queryParams = new URLSearchParams(keys).toString()
  return handleAPIRequest(`/datos_nitrogeno/contexto/?${queryParams}`)
})
ipcMain.handle('datosNitrogeno:get-by-id', (_, analisisId) =>
  handleAPIRequest(`/datos_nitrogeno/${analisisId}`)
)
ipcMain.handle('datosNitrogeno:update', (_, { analisisId, data }) =>
  handleAPIRequest(`/datos_nitrogeno/${analisisId}`, 'PUT', data)
)
ipcMain.handle('datosNitrogeno:delete', (_, analisisId) =>
  handleAPIRequest(`/datos_nitrogeno/${analisisId}`, 'DELETE')
)
