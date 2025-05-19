// src/renderer/src/App.jsx
import React from 'react'
import { CicloProvider } from './contexts/CicloContext' // Importa el proveedor de contexto
import { AppRouter } from './router' // Importa el router

function App() {
  return (
    <CicloProvider>
      {' '}
      {/* Envuelve la aplicación con el CicloProvider */}
      <AppRouter />
    </CicloProvider>
  )
}
export default App
