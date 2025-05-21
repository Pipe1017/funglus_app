// src/renderer/src/contexts/CicloContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CicloContext = createContext(undefined)
const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1' // Define tu URL base de la API

export function CicloProvider({ children }) {
  const [currentCiclo, setCurrentCiclo] = useState('')
  const [availableCiclos, setAvailableCiclos] = useState([])
  const [isFetchingCiclos, setIsFetchingCiclos] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const fetchAvailableCiclosAPI = useCallback(async () => {
    // Nombre correcto de la función
    setIsFetchingCiclos(true)
    setFeedbackMessage('')
    try {
      console.log('CicloContext: Solicitando lista de OBJETOS ciclo vía HTTP...')
      const response = await fetch(`${FASTAPI_BASE_URL}/catalogos/ciclos/?limit=1000`)

      if (!response.ok) {
        let errorMsg = `Error HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMsg = errorData.detail || errorMsg
        } catch (e) {
          /* No hacer nada si el cuerpo no es JSON */
        }
        throw new Error(errorMsg)
      }

      const cicloObjects = await response.json()
      setAvailableCiclos(cicloObjects || [])
      console.log('CicloContext: OBJETOS ciclo recibidos vía HTTP:', cicloObjects)
      if (!cicloObjects || cicloObjects.length === 0) {
        setFeedbackMessage(
          "No hay ciclos creados en el sistema. Ve a 'Gestión de Ciclos' para añadir uno."
        )
      }
    } catch (error) {
      console.error('CicloContext: Error al cargar OBJETOS ciclo vía HTTP:', error)
      setFeedbackMessage(`Error al cargar lista de ciclos: ${error.message}`)
    } finally {
      setIsFetchingCiclos(false)
    }
  }, [])

  useEffect(() => {
    fetchAvailableCiclosAPI()
  }, [fetchAvailableCiclosAPI])

  const selectCiclo = (nombreCiclo) => {
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

  const getCurrentCicloId = useCallback(() => {
    if (!currentCiclo || !Array.isArray(availableCiclos)) return null
    const cicloObj = availableCiclos.find((c) => c.nombre_ciclo === currentCiclo)
    return cicloObj ? cicloObj.id : null
  }, [currentCiclo, availableCiclos])

  // CORRECCIÓN AQUÍ:
  const refreshCiclos = useCallback(() => {
    fetchAvailableCiclosAPI() // Llamar a la función con el nombre correcto
  }, [fetchAvailableCiclosAPI]) // Usar la función correcta en las dependencias

  const value = useMemo(
    () => ({
      currentCiclo,
      selectCiclo,
      availableCiclos,
      isFetchingCiclos,
      refreshCiclos,
      feedbackMessage,
      setFeedbackMessage,
      getCurrentCicloId
    }),
    [
      currentCiclo,
      availableCiclos,
      isFetchingCiclos,
      refreshCiclos,
      feedbackMessage,
      getCurrentCicloId
    ]
  ) // setFeedbackMessage no necesita estar en dependencias si es estable

  return <CicloContext.Provider value={value}>{children}</CicloContext.Provider>
}

export function useCiclo() {
  const context = useContext(CicloContext)
  if (context === undefined) {
    throw new Error('useCiclo debe usarse dentro de un CicloProvider')
  }
  return context
}
