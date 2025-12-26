import React from 'react'
import { CicloProvider } from './modules/core/contexts/CicloContext'
import { AppRouter } from './router'

function App() {
  return (
    <CicloProvider>
      <AppRouter />
    </CicloProvider>
  )
}

export default App
