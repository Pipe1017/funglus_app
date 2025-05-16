// src/renderer/src/App.jsx
import React from 'react';
import { AppRouter } from './router'; // Importa el router
import { CicloProvider } from './contexts/CicloContext';

function App() {
  return (
    <CicloProvider> {/* Envuelve con el proveedor de contexto del ciclo */}
      <AppRouter />
    </CicloProvider>
  );
}
export default App;