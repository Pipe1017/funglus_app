import React from 'react'
import { CicloProvider } from './contexts/CicloContext'
import { AppRouter } from './router'

function App() {
  return (
    <CicloProvider>
      <AppRouter />
    </CicloProvider>
  )
}

export default App
