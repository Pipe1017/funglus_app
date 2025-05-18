// src/renderer/src/contexts/CicloContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CicloContext = createContext(undefined)

export function CicloProvider({ children }) {
  const [currentCiclo, setCurrentCiclo] = useState('')
  const [availableCiclos, setAvailableCiclos] = useState([])
  const [isFetchingCiclos, setIsFetchingCiclos] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('') // Para mensajes generales del ciclo

  const fetchAvailableCiclosAPI = useCallback(async () => {
    setIsFetchingCiclos(true)
    try {
      console.log('CicloContext: Solicitando lista de ciclos distintos...')
      const ciclos = await window.electronAPI.getDistinctCiclos()
      setAvailableCiclos(ciclos || [])
      console.log('CicloContext: Ciclos distintos recibidos:', ciclos)
    } catch (error) {
      console.error('CicloContext: Error al cargar ciclos disponibles:', error)
      setFeedbackMessage(`Error al cargar lista de ciclos: ${error.message}`)
      setTimeout(() => setFeedbackMessage(''), 5000)
    } finally {
      setIsFetchingCiclos(false)
    }
  }, [])

  useEffect(() => {
    fetchAvailableCiclosAPI() // Cargar al inicio
  }, [fetchAvailableCiclosAPI])

  const selectCiclo = (cicloId) => {
    const trimmedCicloId = cicloId.trim()
    setCurrentCiclo(trimmedCicloId)
    setFeedbackMessage(
      trimmedCicloId
        ? `Ciclo activo globalmente: ${trimmedCicloId}`
        : 'Ciclo activo global limpiado.'
    )
    console.log('CicloContext: Ciclo activo global:', trimmedCicloId || 'ninguno')
    setTimeout(() => setFeedbackMessage(''), 3000)
    // Ya no reseteamos origen y muestra aquí, eso lo manejará el KeySelector o la página
  }

  // Función para refrescar la lista de ciclos desde fuera si es necesario
  const refreshCiclos = useCallback(() => {
    fetchAvailableCiclosAPI()
  }, [fetchAvailableCiclosAPI])

  const value = useMemo(
    () => ({
      currentCiclo,
      selectCiclo,
      availableCiclos,
      isFetchingCiclos,
      refreshCiclos, // Exponer la función de refresco
      feedbackMessage
    }),
    [currentCiclo, availableCiclos, isFetchingCiclos, refreshCiclos, feedbackMessage]
  )

  return <CicloContext.Provider value={value}>{children}</CicloContext.Provider>
}

export function useCiclo() {
  const context = useContext(CicloContext)
  if (context === undefined) {
    throw new Error('useCiclo debe usarse dentro de un CicloProvider')
  }
  return context
}
