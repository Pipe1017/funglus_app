// frontend_funglusapp/electron.vite.config.js
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
    // ...otras configuraciones de 'main' si las tienes
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
    // ...otras configuraciones de 'preload' si las tienes
  },
  renderer: { // <-- ENTRA AQUÍ, EN LA CONFIGURACIÓN DEL RENDERER
    resolve: {
      alias: {
        // '@renderer': resolve('src/renderer/src') // Puede que tengas un alias así o no
        // Si no tienes la sección 'resolve' o 'alias', no te preocupes, solo añade optimizeDeps
      }
    },
    plugins: [react()],
    optimizeDeps: { // <--- AÑADE ESTA SECCIÓN COMPLETA
      include: [
        'react-icons/fi', // <--- ESTA LÍNEA ES LA IMPORTANTE
        // 'otras-dependencias-problematicas-si-las-hubiera' 
      ]
    }
  }
})