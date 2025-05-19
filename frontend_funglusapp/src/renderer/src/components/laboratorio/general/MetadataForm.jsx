// frontend_funglusapp/src/renderer/src/components/common/KeySelector.jsx
import React, { useEffect, useState } from 'react'
import { FiCheckCircle, FiFilter } from 'react-icons/fi'
import { useCiclo } from '../../contexts/CicloContext'

// etapaKeyDefinition sigue igual
const etapaKeyDefinition = {
  materia_prima: {
    /* ... */
  },
  gubys: {
    /* ... */
  },
  tamo_humedo: {
    /* ... */
  },
  formulacion: {
    /* ... */
  }
}

function KeySelector({ etapa, onKeysSelected, onKeysCleared }) {
  const {
    currentCiclo: globalCicloNombre, // Nombre del ciclo global
    selectCiclo: setGlobalCiclo,
    availableCiclos, // Lista de objetos {id, nombre_ciclo}
    isFetchingCiclos,
    refreshCiclos
  } = useCiclo()

  const [selectedCicloId, setSelectedCicloId] = useState('') // Guardará el ID del ciclo
  const [selectedEtapaId, setSelectedEtapaId] = useState('') // Este lo recibe la sección padre
  const [selectedMuestraId, setSelectedMuestraId] = useState('')
  const [selectedOrigenId, setSelectedOrigenId] = useState('')

  // Opciones para los desplegables (listas de objetos {value: ID, label: nombre})
  const [etapaOptionsForSelect, setEtapaOptionsForSelect] = useState([])
  const [muestraOptionsForSelect, setMuestraOptionsForSelect] = useState([])
  const [origenOptionsForSelect, setOrigenOptionsForSelect] = useState([])

  const [localMessage, setLocalMessage] = useState('')
  const [isLoadingData, setIsLoadingData] = useState(false)

  const etapaConfig = etapaKeyDefinition[etapa] // 'etapa' es el nameKey, ej: "materia_prima"

  if (!etapaConfig) {
    return <div className="p-4 text-red-500">KeySelector: Etapa no configurada: "{etapa}"</div>
  }
  const requiredKeysForEtapa = etapaConfig.keys || []

  // Sincronizar selectedCicloId con el ciclo global del contexto
  useEffect(() => {
    const cicloObj = Array.isArray(availableCiclos)
      ? availableCiclos.find((c) => c.nombre_ciclo === globalCicloNombre)
      : null
    setSelectedCicloId(cicloObj ? cicloObj.id : '')
  }, [globalCicloNombre, availableCiclos])

  // Resetear selecciones locales cuando la etapa cambia
  useEffect(() => {
    console.log(
      `KeySelector: Etapa prop (nameKey) cambió a: ${etapa}. Reseteando Muestra y Origen locales.`
    )
    // setSelectedEtapaId(''); // Etapa no se selecciona aquí, viene del padre
    setSelectedMuestraId('')
    setSelectedOrigenId('')
    if (onKeysCleared && typeof onKeysCleared === 'function') {
      onKeysCleared()
    }
  }, [etapa, onKeysCleared])

  // Cargar opciones de Muestra para la etapa actual
  useEffect(() => {
    if (etapa && etapaConfig.getMuestraOptions) {
      const opts = etapaConfig.getMuestraOptions() // Esto viene de dropdownOptions.js
      // Estos son arrays de {value: "NOMBRE", label: "Label"}
      // Necesitamos transformarlos si queremos usar IDs, o que dropdownOptions ya tenga IDs
      // Por ahora, asumimos que los 'value' son los NOMBRES que se guardarán o se usarán para buscar IDs
      setMuestraOptionsForSelect(opts || [])
    } else {
      setMuestraOptionsForSelect([])
    }
    setSelectedMuestraId('') // Reset al cambiar etapa
  }, [etapa, etapaConfig])

  // Cargar opciones de Origen para la etapa y muestra actual
  useEffect(() => {
    if (etapa && etapaConfig.getOrigenOptions) {
      // selectedMuestraId aquí es el NOMBRE/VALOR del desplegable de muestra
      const opts = etapaConfig.getOrigenOptions(selectedMuestraId)
      setOrigenOptionsForSelect(opts || [])
    } else {
      setOrigenOptionsForSelect([])
    }
    setSelectedOrigenId('') // Reset al cambiar etapa o muestra
  }, [etapa, selectedMuestraId, etapaConfig])

  const handleCicloSelectChange = (e) => {
    const nombreCicloSeleccionado = e.target.value
    if (typeof setGlobalCiclo === 'function') {
      setGlobalCiclo(nombreCicloSeleccionado) // Actualiza el nombre del ciclo en el contexto global
    }
    // El useEffect [globalCicloNombre] se encargará de setear selectedCicloId
    // y el useEffect [etapa, globalCicloNombre] reseteará origen/muestra
  }

  const handleOrigenChange = (e) => setSelectedOrigenId(e.target.value)
  const handleMuestraChange = (e) => {
    const newMuestra = e.target.value
    setSelectedMuestraId(newMuestra)
    if (etapa === 'materia_prima') {
      // Lógica específica
      setSelectedOrigenId('')
    }
  }

  const handleConfirmKeys = async () => {
    // Este botón ahora solo confirma las selecciones locales de Etapa, Muestra, Origen
    // El Ciclo ya está en el contexto global (globalCicloNombre y su ID en selectedCicloId)
    if (!selectedCicloId) {
      setLocalMessage('Ciclo global no está seleccionado.')
      setTimeout(() => setLocalMessage(''), 3000)
      return
    }

    // Obtener el ID de la Etapa seleccionada por el padre (LaboratorioGeneralSection)
    // Esto es un poco indirecto. Sería mejor si LaboratorioGeneralSection pasara el etapaId.
    // O si KeySelector tuviera su propio selector de Etapa.
    // Por ahora, asumimos que 'etapa' (prop) es el nameKey y necesitamos encontrar su ID.
    // Esto requiere que KeySelector también cargue las etapas.
    // VAMOS A SIMPLIFICAR: el padre (LaboratorioGeneralSection) ya seleccionó la etapa
    // y nos pasa 'etapa' como el nameKey. Necesitamos el ID de esa etapa.
    // Esto implica que LaboratorioGeneralSection debe pasar el etapaId.
    // O KeySelector debe tener su propio selector de Etapa.

    // REVISIÓN DE LÓGICA:
    // El padre (LaboratorioGeneralSection) selecciona una ETAPA (obtiene su ID y nameKey).
    // Pasa el 'nameKey' de la etapa a KeySelector.
    // KeySelector usa el 'nameKey' para mostrar los desplegables de Muestra y Origen.
    // KeySelector necesita devolver los IDs de Muestra y Origen seleccionados.

    let allRequiredSetForThisSelector = true
    const confirmedSubKeys = {} // Solo las claves que este selector define

    if (requiredKeysForEtapa.includes('muestra')) {
      if (!selectedMuestraId) allRequiredSetForThisSelector = false
      // Aquí selectedMuestraId es el VALOR del option (ej. "TAMO"). Necesitamos el ID del catálogo.
      // Esto requiere que muestraOptionsForSelect sea [{value: ID, label: NOMBRE}]
      // Y que el value del select sea el ID.
      // Por ahora, asumimos que selectedMuestraId ES el ID o un valor que el backend entiende.
      confirmedSubKeys.muestraId = selectedMuestraId
      confirmedSubKeys.muestraNombre = muestraOptionsForSelect.find(
        (o) => o.value === selectedMuestraId
      )?.label
    }
    if (requiredKeysForEtapa.includes('origen')) {
      if (!selectedOrigenId) allRequiredSetForThisSelector = false
      confirmedSubKeys.origenId = selectedOrigenId
      confirmedSubKeys.origenNombre = origenOptionsForSelect.find(
        (o) => o.value === selectedOrigenId
      )?.label
    }

    if (allRequiredSetForThisSelector) {
      const fullKeys = {
        cicloId: selectedCicloId, // ID numérico del ciclo
        cicloNombre: globalCicloNombre,
        // etapaId: ?? // El padre (LaboratorioGeneralSection) ya tiene el etapaId
        // etapaNombre: etapaConfig.label,
        ...confirmedSubKeys
      }
      console.log('KeySelector: Confirmando y pasando al padre:', fullKeys)
      if (onKeysSelected) onKeysSelected(fullKeys)
      setLocalMessage('Contexto de Muestra/Origen aplicado para la etapa.')
    } else {
      setLocalMessage('Por favor, complete la selección de Muestra y/u Origen para esta etapa.')
      if (onKeysCleared) onKeysCleared()
    }
    setTimeout(() => setLocalMessage(''), 4000)
  }

  // Determinar si el botón de confirmar debe estar habilitado
  let enableConfirmButton = !!selectedCicloId // Necesitamos un ciclo global
  if (requiredKeysForEtapa.includes('muestra')) {
    enableConfirmButton = enableConfirmButton && !!selectedMuestraId
  }
  if (requiredKeysForEtapa.includes('origen')) {
    enableConfirmButton = enableConfirmButton && !!selectedOrigenId
  }

  return (
    <div className="mb-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-indigo-700 flex items-center">
          <FiFilter className="mr-2 h-4 w-4" />
          Definir para Etapa: <span className="ml-1 font-bold">{etapaConfig.label}</span>
          {globalCicloNombre && (
            <span>
              {' '}
              (Ciclo: <span className="font-bold">{globalCicloNombre}</span>)
            </span>
          )}
        </h4>
        {/* No necesitamos el botón de refrescar ciclos aquí si se maneja en CicloContext */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
        {/* Muestra (Condicional) */}
        {showMuestraSelector && (
          <div>
            <label
              htmlFor={`ks-muestraSelect-${etapa}`}
              className="block text-xs font-medium text-gray-600 mb-0.5"
            >
              Muestra:
            </label>
            <select
              id={`ks-muestraSelect-${etapa}`}
              value={selectedMuestraId}
              onChange={handleMuestraChange}
              disabled={!globalCicloNombre}
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-60"
            >
              {/* Las opciones vienen de etapaConfig.getMuestraOptions() */}
              {Array.isArray(currentMuestraOptions) &&
                currentMuestraOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Origen (Condicional) */}
        {showOrigenSelector && (
          <div>
            <label
              htmlFor={`ks-origenSelect-${etapa}`}
              className="block text-xs font-medium text-gray-600 mb-0.5"
            >
              Origen:
            </label>
            <select
              id={`ks-origenSelect-${etapa}`}
              value={selectedOrigenId}
              onChange={handleOrigenChange}
              disabled={
                !globalCicloNombre ||
                (showMuestraSelector && etapa === 'materia_prima' && !selectedMuestraId)
              }
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-60"
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
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={handleConfirmKeys}
          className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-50"
          disabled={!enableConfirmButton}
        >
          <FiCheckCircle className="inline mr-1.5 h-4 w-4" /> Aplicar esta selección de
          Muestra/Origen
        </button>
        {localMessage && <p className="text-xs text-gray-500 mt-1.5 italic">{localMessage}</p>}
      </div>
    </div>
  )
}
export default KeySelector
