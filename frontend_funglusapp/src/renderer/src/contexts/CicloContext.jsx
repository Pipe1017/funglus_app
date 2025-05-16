// src/renderer/src/contexts/CicloContext.jsx
import React, { createContext, useState, useContext, useMemo } from 'react';

const CicloContext = createContext(undefined);

export function CicloProvider({ children }) {
  const [currentCiclo, setCurrentCiclo] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const selectCiclo = (cicloId) => {
    const trimmedCicloId = cicloId.trim();
    if (trimmedCicloId) {
      setCurrentCiclo(trimmedCicloId);
      setFeedbackMessage(`Ciclo activo establecido: ${trimmedCicloId}`);
      console.log("CicloContext: Ciclo activo cambiado a:", trimmedCicloId);
    } else {
      setCurrentCiclo('');
      setFeedbackMessage('Ciclo activo limpiado.');
      console.log("CicloContext: Ciclo activo limpiado.");
    }
    // Limpiar el mensaje después de unos segundos
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  // useMemo para optimizar y evitar re-renders innecesarios
  const value = useMemo(() => ({
    currentCiclo,
    selectCiclo,
    feedbackMessage
  }), [currentCiclo, feedbackMessage]);

  return (
    <CicloContext.Provider value={value}>
      {children}
    </CicloContext.Provider>
  );
}

export function useCiclo() {
  const context = useContext(CicloContext);
  if (context === undefined) { // Comprueba si el contexto es undefined
    throw new Error('useCiclo debe usarse dentro de un CicloProvider');
  }
  return context;
}