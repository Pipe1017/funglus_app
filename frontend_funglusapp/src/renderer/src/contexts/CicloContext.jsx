// src/renderer/src/contexts/CicloContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CicloContext = createContext(undefined)

export function CicloProvider({ children }) {
  const [currentCiclo, setCurrentCiclo] = useState('') // Sigue guardando el nombre_ciclo del ciclo activo
  const [availableCiclos, setAvailableCiclos] = useState([]) // AHORA SERÁ UN ARRAY DE OBJETOS CICLO {id, nombre_ciclo, ...}
  const [isFetchingCiclos, setIsFetchingCiclos] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const fetchAvailableCicloObjects = useCallback(async () => {
    // Renombrada
    setIsFetchingCiclos(true)
    try {
      console.log('CicloContext: Solicitando lista de OBJETOS ciclo...')
      // CAMBIO AQUÍ: Usamos getAllCiclos para obtener los objetos completos
      const cicloObjects = await window.electronAPI.getAllCiclos({ limit: 1000 }) // Asume que esto devuelve [{id, nombre_ciclo, ...}]
      setAvailableCiclos(cicloObjects || []) // Guardamos el array de objetos
      console.log('CicloContext: OBJETOS ciclo recibidos:', cicloObjects)
    } catch (error) {
      console.error('CicloContext: Error al cargar OBJETOS ciclo:', error)
      setFeedbackMessage(`Error al cargar lista de ciclos: ${error.message}`)
      setTimeout(() => setFeedbackMessage(''), 5000)
    } finally {
      setIsFetchingCiclos(false)
    }
  }, [])

  useEffect(() => {
    fetchAvailableCicloObjects()
  }, [fetchAvailableCicloObjects])

  const selectCiclo = (nombreCiclo) => {
    // Recibe y setea el nombre_ciclo
    const trimmedCicloNombre = nombreCiclo ? nombreCiclo.trim() : ''
    setCurrentCiclo(trimmedCicloNombre)
    setFeedbackMessage(
      trimmedCicloNombre
        ? `Ciclo activo globalmente: ${trimmedCicloNombre}`
        : 'Ciclo activo global limpiado.'
    )
    console.log('CicloContext: Ciclo activo global (nombre):', trimmedCicloNombre || 'ninguno')
    setTimeout(() => setFeedbackMessage(''), 3000)
  }

  // Esta función podría ser útil si en algún lugar solo necesitas el ID del ciclo actual
  const getCurrentCicloId = useCallback(() => {
    if (!currentCiclo || !Array.isArray(availableCiclos)) return null
    const cicloObj = availableCiclos.find((c) => c.nombre_ciclo === currentCiclo)
    return cicloObj ? cicloObj.id : null
  }, [currentCiclo, availableCiclos])

  const refreshCiclos = useCallback(() => {
    fetchAvailableCicloObjects()
  }, [fetchAvailableCicloObjects])

  const value = useMemo(
    () => ({
      currentCiclo, // Nombre del ciclo activo
      selectCiclo,
      availableCiclos, // Array de objetos ciclo {id, nombre_ciclo, ...}
      isFetchingCiclos,
      refreshCiclos,
      feedbackMessage,
      getCurrentCicloId // Nueva función utilitaria
    }),
    [
      currentCiclo,
      availableCiclos,
      isFetchingCiclos,
      refreshCiclos,
      feedbackMessage,
      getCurrentCicloId
    ]
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
