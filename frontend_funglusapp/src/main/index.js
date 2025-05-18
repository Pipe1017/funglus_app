// src/main/index.js
import { electronApp, is } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'

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
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

async function handleAPIRequest(endpoint, method = 'GET', bodyData = null) {
  const url = `${FASTAPI_BASE_URL}${endpoint}`
  console.log(
    `Main Process: Intentando ${method} a ${url}`,
    bodyData ? `con datos: ${JSON.stringify(bodyData).substring(0, 150)}...` : ''
  )
  try {
    const options = {
      method: method,
      headers: { 'Content-Type': 'application/json' }
    }
    if (bodyData && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(bodyData)
    }

    const response = await fetch(url, options)
    const responseStatus = response.status
    const responseText = await response.text()

    console.log(`Main Process: Respuesta de ${url} - Status: ${responseStatus}`)

    if (!response.ok) {
      let errorDetail = `Error HTTP! Status: ${responseStatus}`
      try {
        const errorJson = JSON.parse(responseText)
        errorDetail = errorJson.detail || errorDetail
      } catch (e) {
        /* Mantener errorDetail si no es JSON */
      }
      console.error(`Main Process: Error API para ${url}:`, errorDetail)
      throw new Error(errorDetail)
    }
    if (responseStatus === 204) return null
    return JSON.parse(responseText)
  } catch (error) {
    console.error(`Main Process: Error de red o aplicación para ${url}:`, error.message)
    throw error
  }
}

// --- Manejadores IPC ---
ipcMain.handle('ciclo:get-distinct', () => handleAPIRequest('/ciclos/distinct'))

// MATERIA PRIMA
ipcMain.handle('lab:get-or-create-materia_prima', (_, keys) =>
  handleAPIRequest('/laboratorio/materia_prima/entry', 'POST', keys)
)
ipcMain.handle(
  'lab:update-materia_prima',
  (_, { keys, data }) =>
    handleAPIRequest('/laboratorio/materia_prima/entry', 'PUT', { ...keys, ...data }) // El backend espera claves y datos separados, o unirlos
  // O si el backend espera claves en el body y datos en otro objeto:
  // handleAPIRequest('/laboratorio/materia_prima/entry', 'PUT', { keys: keys, data_to_update: data })
  // Basado en el backend que hicimos, POST y PUT a .../entry esperan las claves en el body
  // y PUT espera los datos a actualizar también.
  // Si el endpoint PUT es /materia_prima/{ciclo}/{origen}/{muestra}, entonces sería:
  // handleAPIRequest(`/laboratorio/materia_prima/${keys.ciclo}/${keys.origen}/${keys.muestra}`, 'PUT', data)
  // VOY A ASUMIR QUE LOS ENDPOINTS POST Y PUT A .../entry esperan las claves en el body,
  // y PUT espera adicionalmente los datos a actualizar.
  // Para PUT, el backend que hicimos toma 'keys' y 'data_to_update' como parámetros separados en la función del router.
  // Así que necesitamos enviar un objeto que el backend pueda desestructurar o dos argumentos si IPC lo permite.
  // Por simplicidad, el backend espera un objeto 'keys' y un objeto 'data_to_update' para el PUT.
  // El IPC 'invoke' solo puede pasar un argumento de datos. Así que el objeto {keys, data} es correcto.
  // El backend router debe ser ajustado para recibir esto.
)

// GUBYS
ipcMain.handle('lab:get-or-create-gubys', (_, keys) =>
  handleAPIRequest('/laboratorio/gubys/entry', 'POST', keys)
)
ipcMain.handle(
  'lab:update-gubys',
  (_, { keys, data }) => handleAPIRequest('/laboratorio/gubys/entry', 'PUT', { ...keys, ...data }) // Ajustar el backend si es necesario
)

// TAMO HUMEDO
ipcMain.handle('lab:get-or-create-tamo_humedo', (_, keys) =>
  handleAPIRequest('/laboratorio/tamo_humedo/entry', 'POST', keys)
)
ipcMain.handle(
  'lab:update-tamo_humedo',
  (_, { keys, data }) =>
    handleAPIRequest('/laboratorio/tamo_humedo/entry', 'PUT', { ...keys, ...data }) // Ajustar el backend si es necesario
)

// FORMULACION (Comentado por ahora)
// ipcMain.handle('form:get-or-create-formulacion', (_, keys) =>
//   handleAPIRequest('/formulacion/entry', 'POST', keys)
// );
// ipcMain.handle('form:update-formulacion', (_, { keys, data }) =>
//   handleAPIRequest('/formulacion/entry', 'PUT', { ...keys, ...data })
// );
