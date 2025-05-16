// src/main/index.js
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import icon from '../../resources/icon.png?asset'; // La plantilla de electron-vite lo pone en resources

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'; // URL base de tu API backend

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1366, // Un poco más ancho
    height: 768,
    show: false,
    autoHideMenuBar: true,
    // ...(process.platform === 'linux' && icon ? { icon } : {}), // Comenta o reemplaza si no tienes icon.png en resources/
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'), // Ruta correcta al preload
      sandbox: false, // Para desarrollo. En producción, considera true con config SUID sandbox en Linux
      contextIsolation: true,
      nodeIntegration: false,
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
    if (is.dev) mainWindow.webContents.openDevTools({ mode: 'detach' }); // Abrir DevTools
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.funglusapp.desktop') // Puedes cambiar esto
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
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

// --- Helper genérico para manejar peticiones a la API ---
async function handleAPIRequest(endpoint, method = 'GET', data = null) {
  const url = `${FASTAPI_BASE_URL}${endpoint}`;
  // Este console.log es útil para depurar en la terminal donde corres 'npm run dev'
  console.log(`Proceso Principal (Main): Intentando ${method} a ${url}`, data ? `con datos: ${JSON.stringify(data).substring(0,100)}...` : '');
  try {
    const options = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const responseStatus = response.status;
    const responseText = await response.text();

    console.log(`Proceso Principal (Main): Respuesta de ${url} - Status: ${responseStatus}`);

    if (!response.ok) {
      let errorDetail = `Error HTTP! Status: ${responseStatus}`;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetail = errorJson.detail || errorDetail;
      } catch (e) { /* Mantener errorDetail si no es JSON */ }
      console.error(`Proceso Principal (Main): Error API para ${url}:`, errorDetail);
      throw new Error(errorDetail);
    }

    if (responseStatus === 204) return null; // No Content
    return JSON.parse(responseText);
  } catch (error) {
    console.error(`Proceso Principal (Main): Error de red o aplicación para ${url}:`, error.message);
    throw error; // Propaga el error al renderer para que pueda manejarlo
  }
}

// NUEVO manejador para inicializar ciclo
ipcMain.handle('ciclo:initialize-placeholders', (_, cicloId) => 
  handleAPIRequest(`/ciclos/${cicloId}/initialize_placeholders`, 'POST')
);

// Laboratorio - MATERIA PRIMA (NUEVO)
ipcMain.handle('lab:update-materia_prima-by-ciclo', (_, { cicloId, data }) => 
  handleAPIRequest(`/laboratorio/materia_prima/${cicloId}`, 'PUT', data)
);
ipcMain.handle('lab:get-materia_prima-by-ciclo', (_, cicloId) => 
  handleAPIRequest(`/laboratorio/materia_prima/ciclo/${cicloId}`)
);
// ipcMain.handle('lab:get-all-materia_prima', () => handleAPIRequest('/laboratorio/materia_prima/'));



// GUBYS - Modificado para UPDATE (PUT)
ipcMain.handle('lab:update-gubys-by-ciclo', (_, { cicloId, data }) => 
  handleAPIRequest(`/laboratorio/gubys/${cicloId}`, 'PUT', data)
);
ipcMain.handle('lab:get-gubys-by-ciclo', (_, cicloId) => 
  handleAPIRequest(`/laboratorio/gubys/ciclo/${cicloId}`)
);
// ipcMain.handle('lab:get-all-gubys', () => handleAPIRequest('/laboratorio/gubys/'));

// CENIZAS - Modificado para UPDATE (PUT)
ipcMain.handle('lab:update-cenizas-by-ciclo', (_, { cicloId, data }) => 
  handleAPIRequest(`/laboratorio/cenizas/${cicloId}`, 'PUT', data)
);
ipcMain.handle('lab:get-cenizas-by-ciclo', (_, cicloId) => 
  handleAPIRequest(`/laboratorio/cenizas/ciclo/${cicloId}`)
);
// ipcMain.handle('lab:get-all-cenizas', () => handleAPIRequest('/laboratorio/cenizas/'));

// FORMULACION - Modificado para UPDATE (PUT)
ipcMain.handle('form:update-formulacion-by-ciclo', (_, { cicloId, data }) => 
  handleAPIRequest(`/formulacion/${cicloId}`, 'PUT', data)
);
ipcMain.handle('form:get-formulacion-by-ciclo', (_, cicloId) => 
  handleAPIRequest(`/formulacion/ciclo/${cicloId}`)
);
ipcMain.handle('ciclo:get-distinct', () => // <--- AÑADE ESTE MANEJADOR
  handleAPIRequest('/ciclos/distinct')
);