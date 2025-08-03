import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { electronApp, is } from '@electron-toolkit/utils'
import { spawn } from 'child_process'
import path from 'path'
import log from 'electron-log'

// Configura electron-log
// src/main/index.js
log.transports.file.resolvePathFn = () => path.join(app.getPath('userData'), 'logs', 'main.log');
log.info('Aplicación iniciándose...');

let backendProcess = null

function createWindow() {
  if (app.isPackaged) {
    const assetsPath = path.join(process.resourcesPath, 'assets')
    const backendPath = path.join(assetsPath, 'funglusapp_backend.exe')
    const userDataPath = app.getPath('userData')
    
    log.info(`Ruta del backend: ${backendPath}`);
    log.info(`Ruta de datos de usuario (userData): ${userDataPath}`);

    try {
      backendProcess = spawn(backendPath, [userDataPath])
      backendProcess.stdout.on('data', (data) => log.info(`Backend: ${data}`))
      backendProcess.stderr.on('data', (data) => log.error(`Backend Error: ${data}`))
      backendProcess.on('error', (err) => {
        log.error('Error al intentar iniciar el proceso del backend:', err);
      });
    } catch (error) {
      log.error("Error catastrófico al iniciar el backend:", error)
    }
  }

  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
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

app.on('will-quit', () => {
  if (backendProcess) {
    log.info('Cerrando proceso del backend...');
    backendProcess.kill()
    backendProcess = null
  }
  log.info('Aplicación cerrada.');
})