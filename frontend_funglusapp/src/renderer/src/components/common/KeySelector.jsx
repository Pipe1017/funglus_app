// frontend_funglusapp/src/renderer/src/components/common/KeySelector.jsx
import React, { useEffect, useState } from 'react'
import { FiCheckCircle, FiFilter, FiRefreshCw } from 'react-icons/fi'
import { etapaDropdownOptions } from '../../config/dropdownOptions'
import { useCiclo } from '../../contexts/CicloContext'

const etapaKeyDefinition = {
  materia_prima: {
    label: 'Materia Prima',
    keys: ['ciclo', 'origen', 'muestra'],
    getOrigenOptions: (selectedMuestra) => {
      if (!etapaDropdownOptions?.materia_prima?.origen) return []
      return (
        etapaDropdownOptions.materia_prima.origen[selectedMuestra?.toUpperCase()] ||
        etapaDropdownOptions.materia_prima.origen.DEFAULT ||
        []
      )
    },
    getMuestraOptions: () => etapaDropdownOptions?.materia_prima?.muestra || []
  },
  gubys: {
    label: 'Gubys',
    keys: ['ciclo', 'origen'],
    getOrigenOptions: () => etapaDropdownOptions?.gubys?.origen || []
  },
  tamo_humedo: {
    label: 'Tamo Húmedo',
    keys: ['ciclo', 'origen'],
    getOrigenOptions: () => etapaDropdownOptions?.tamo_humedo?.origen || []
  },
  formulacion: {
    label: 'Formulación',
    keys: ['ciclo', 'muestra'],
    getMuestraOptions: () => etapaDropdownOptions?.formulacion?.muestra || []
  }
}

function KeySelector({ etapa, onKeysSelected, onKeysCleared }) {
  const {
    currentCiclo: globalCiclo,
    selectCiclo: setGlobalCiclo,
    availableCiclos,
    isFetchingCiclos,
    refreshCiclos,
    feedbackMessage: contextFeedbackCM
  } = useCiclo()

  const [internalCiclo, setInternalCiclo] = useState(globalCiclo || '')
  const [internalOrigen, setInternalOrigen] = useState('')
  const [internalMuestra, setInternalMuestra] = useState('')
  const [localMessage, setLocalMessage] = useState('')

  useEffect(() => {
    if (!etapaDropdownOptions) {
      console.error('KeySelector: FATAL - etapaDropdownOptions no se importó o está undefined.')
    }
  }, [])

  const etapaConfig = etapaKeyDefinition[etapa]

  if (!etapaConfig) {
    console.error(`KeySelector: Configuración de etapa no encontrada para "${etapa}".`)
    return (
      <div className="p-4 text-red-600 bg-red-100 border border-red-300 rounded-md">
        Error: Configuración de etapa no encontrada para "{etapa}".
      </div>
    )
  }

  const requiredKeysForEtapa = etapaConfig.keys || ['ciclo']

  // Efecto para sincronizar internalCiclo con el ciclo global
  useEffect(() => {
    setInternalCiclo(globalCiclo || '')
  }, [globalCiclo])

  // Efecto para resetear selecciones locales (origen, muestra) y notificar al padre
  // SOLO cuando la 'etapa' cambia.
  useEffect(() => {
    console.log(`KeySelector: Etapa prop changed to: ${etapa}. Resetting local origen/muestra.`)
    setInternalOrigen('')
    setInternalMuestra('')
    if (onKeysCleared && typeof onKeysCleared === 'function') {
      onKeysCleared()
    }
  }, [etapa, onKeysCleared])

  const handleCicloInputChange = (e) => setInternalCiclo(e.target.value)

  const handleCicloSelectChange = (e) => {
    const selected = e.target.value
    // setInputCiclo(selected); // Ya no tenemos setInputCiclo, usamos setInternalCiclo
    setInternalCiclo(selected)
    if (typeof setGlobalCiclo === 'function') {
      setGlobalCiclo(selected) // Esto actualizará el contexto global
    }
    // Al seleccionar un ciclo del dropdown, también reseteamos origen y muestra locales
    // porque el ciclo global cambiará y el useEffect de arriba lo manejará,
    // o si queremos ser explícitos aquí:
    setInternalOrigen('')
    setInternalMuestra('')
    if (onKeysCleared && typeof onKeysCleared === 'function') {
      onKeysCleared()
    }
  }

  const handleSetCicloFromInput = () => {
    const trimmedCicloId = internalCiclo.trim()
    if (typeof setGlobalCiclo === 'function') {
      setGlobalCiclo(trimmedCicloId) // Esto actualizará el contexto global
    }
    setLocalMessage(
      trimmedCicloId
        ? `Ciclo '${trimmedCicloId}' establecido globalmente. Selecciona las demás claves.`
        : 'ID de ciclo global limpiado.'
    )
    if (
      trimmedCicloId &&
      Array.isArray(availableCiclos) &&
      !availableCiclos.includes(trimmedCicloId)
    ) {
      if (typeof refreshCiclos === 'function') {
        refreshCiclos()
      }
    }
    // Al setear desde input, también reseteamos origen y muestra locales
    setInternalOrigen('')
    setInternalMuestra('')
    if (onKeysCleared && typeof onKeysCleared === 'function') {
      onKeysCleared()
    }
    setTimeout(() => setLocalMessage(''), 4000)
  }

  const handleOrigenChange = (e) => {
    setInternalOrigen(e.target.value)
    if (onKeysCleared && typeof onKeysCleared === 'function') onKeysCleared()
  }

  const handleMuestraChange = (e) => {
    const newMuestra = e.target.value
    setInternalMuestra(newMuestra)
    if (etapa === 'materia_prima') {
      setInternalOrigen('')
    }
    if (onKeysCleared && typeof onKeysCleared === 'function') onKeysCleared()
  }

  const handleConfirmKeys = () => {
    let allKeysSet = true
    const selectedKeys = {}

    if (requiredKeysForEtapa.includes('ciclo')) {
      if (!internalCiclo.trim()) allKeysSet = false
      selectedKeys.ciclo = internalCiclo.trim()
    }
    if (requiredKeysForEtapa.includes('origen')) {
      if (!internalOrigen) allKeysSet = false
      selectedKeys.origen = internalOrigen
    }
    if (requiredKeysForEtapa.includes('muestra')) {
      if (!internalMuestra) allKeysSet = false
      selectedKeys.muestra = internalMuestra
    }

    if (allKeysSet) {
      const msg =
        `Claves listas para ${etapaConfig.label}: Ciclo=${selectedKeys.ciclo}` +
        `${selectedKeys.origen ? ', Origen=' + selectedKeys.origen : ''}` +
        `${selectedKeys.muestra ? ', Muestra=' + selectedKeys.muestra : ''}`
      setLocalMessage(msg)
      console.log('KeySelector: Claves Confirmadas para pasar al padre:', selectedKeys)
      if (onKeysSelected && typeof onKeysSelected === 'function') {
        onKeysSelected(selectedKeys)
      }
    } else {
      setLocalMessage('Por favor, completa todas las claves requeridas para esta etapa.')
      if (onKeysCleared && typeof onKeysCleared === 'function') {
        onKeysCleared()
      }
    }
    setTimeout(() => setLocalMessage(''), 4000)
  }

  const currentOrigenOptions =
    etapaConfig.getOrigenOptions && typeof etapaConfig.getOrigenOptions === 'function'
      ? etapaConfig.getOrigenOptions(internalMuestra)
      : []
  const currentMuestraOptions =
    etapaConfig.getMuestraOptions && typeof etapaConfig.getMuestraOptions === 'function'
      ? etapaConfig.getMuestraOptions()
      : []

  const showOrigenSelector = requiredKeysForEtapa.includes('origen')
  const showMuestraSelector = requiredKeysForEtapa.includes('muestra')

  let allRequiredKeysSelected = requiredKeysForEtapa.includes('ciclo')
    ? !!internalCiclo.trim()
    : true
  if (showOrigenSelector) allRequiredKeysSelected = allRequiredKeysSelected && !!internalOrigen
  if (showMuestraSelector) allRequiredKeysSelected = allRequiredKeysSelected && !!internalMuestra

  return (
    // ... El JSX del return es el mismo que el del artifact frontend_key_selector_v4_final ...
    // Asegúrate de que las guardias Array.isArray() estén en los .map() de los select
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold text-gray-700 flex items-center">
          <FiFilter className="mr-2 h-5 w-5 text-indigo-600" />
          Seleccionar/Definir Claves para:{' '}
          <span className="ml-1 font-bold text-indigo-700">{etapaConfig.label}</span>
        </h3>
        <button
          type="button"
          onClick={refreshCiclos}
          disabled={isFetchingCiclos}
          className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50 text-xs"
          title="Refrescar lista de ciclos"
        >
          {' '}
          <FiRefreshCw className={`h-4 w-4 ${isFetchingCiclos ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="ks-cicloSelect" className="block text-sm font-medium text-gray-600 mb-1">
            Ciclo Existente:
          </label>
          <select
            id="ks-cicloSelect"
            value={internalCiclo}
            onChange={handleCicloSelectChange}
            disabled={isFetchingCiclos}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">-- Ciclo --</option>
            {Array.isArray(availableCiclos) &&
              availableCiclos.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="ks-cicloInput" className="block text-sm font-medium text-gray-600 mb-1">
            O Ingresar/Nuevo Ciclo:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="ks-cicloInput"
              value={internalCiclo}
              onChange={handleCicloInputChange}
              placeholder="ID Ciclo"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleSetCicloFromInput}
              className="px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 text-sm whitespace-nowrap"
            >
              Set
            </button>
          </div>
        </div>

        {showOrigenSelector && (
          <div>
            <label
              htmlFor="ks-origenSelect"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Origen:
            </label>
            <select
              id="ks-origenSelect"
              value={internalOrigen}
              onChange={handleOrigenChange}
              disabled={!internalCiclo}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50"
            >
              {Array.isArray(currentOrigenOptions) &&
                currentOrigenOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </select>
          </div>
        )}

        {showMuestraSelector && (
          <div>
            <label
              htmlFor="ks-muestraSelect"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Muestra:
            </label>
            <select
              id="ks-muestraSelect"
              value={internalMuestra}
              onChange={handleMuestraChange}
              disabled={!internalCiclo}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50"
            >
              {Array.isArray(currentMuestraOptions) &&
                currentMuestraOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col items-start space-y-2">
        <button
          type="button"
          onClick={handleConfirmKeys}
          className="px-5 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={!allRequiredKeysSelected}
        >
          <FiCheckCircle className="inline mr-2 h-5 w-5" /> Cargar / Ver Datos de Etapa
        </button>
        {localMessage && <p className="text-xs text-gray-600 mt-2 italic">{localMessage}</p>}
        {contextFeedbackCM && (
          <p className="text-xs text-indigo-500 mt-1 italic">{contextFeedbackCM}</p>
        )}
      </div>

      {internalCiclo && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-xs text-green-700">
          Contexto de Selección Actual: Ciclo: <strong>{internalCiclo}</strong>
          {showOrigenSelector && internalOrigen && (
            <span>
              , Origen: <strong>{internalOrigen}</strong>
            </span>
          )}
          {showMuestraSelector && internalMuestra && (
            <span>
              , Muestra: <strong>{internalMuestra}</strong>
            </span>
          )}
          {!allRequiredKeysSelected && (
            <span className="ml-2 text-red-600 font-semibold">(Faltan claves)</span>
          )}
        </div>
      )}
    </div>
  )
}
export default KeySelector
