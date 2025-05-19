// src/renderer/src/pages/laboratorio_main_sections/LaboratorioGeneralSection.jsx
import React, { useCallback, useEffect, useState } from 'react'
import KeySelector from '../../components/common/KeySelector'
// import MetadataForm from '../../components/laboratorio/general/MetadataForm';
// import ResumenMatriz from '../../components/laboratorio/general/ResumenMatriz';
import { FiRefreshCw } from 'react-icons/fi'
import { useCiclo } from '../../contexts/CicloContext'

function LaboratorioGeneralSection() {
  const {
    currentCiclo: globalCicloNombre, // Nombre del ciclo global
    selectCiclo: setGlobalCiclo,
    availableCiclos, // Lista de objetos {id, nombre_ciclo, ...}
    isFetchingCiclos,
    refreshCiclos
  } = useCiclo()

  const [selectedCicloIdState, setSelectedCicloIdState] = useState(null) // ID del ciclo global

  // Estado para el selector de Etapa Principal
  const [etapaOptions, setEtapaOptions] = useState([])
  const [selectedEtapaIdState, setSelectedEtapaIdState] = useState('') // ID de la etapa seleccionada
  const [selectedEtapaNameKeyState, setSelectedEtapaNameKeyState] = useState('') // ej: "materia_prima"
  const [isLoadingEtapas, setIsLoadingEtapas] = useState(false)

  // Estado para las claves finales confirmadas que se pasarán al MetadataForm
  const [confirmedFullKeys, setConfirmedFullKeys] = useState(null)
  // { cicloId, etapaId, muestraId, origenId, cicloNombre, etapaNombre, muestraNombre, origenNombre }

  // Sincronizar selectedCicloIdState con el ciclo global del contexto
  useEffect(() => {
    if (globalCicloNombre && Array.isArray(availableCiclos)) {
      const cicloObj = availableCiclos.find((c) => c.nombre_ciclo === globalCicloNombre)
      setSelectedCicloIdState(cicloObj ? cicloObj.id : null)
    } else {
      setSelectedCicloIdState(null)
    }
    // Al cambiar el ciclo global, reseteamos las selecciones de etapa y las claves confirmadas
    setSelectedEtapaIdState('')
    setSelectedEtapaNameKeyState('')
    setConfirmedFullKeys(null)
  }, [globalCicloNombre, availableCiclos])

  // Cargar Etapas para el selector principal
  const loadEtapasForSelector = useCallback(async () => {
    setIsLoadingEtapas(true)
    try {
      const etapasAPI = await window.electronAPI.getAllEtapas({ limit: 1000 }) // Asume que devuelve {id, nombre}
      setEtapaOptions([
        { value: '', label: '-- Selecciona Etapa Principal --', nameKey: '' },
        ...(etapasAPI || []).map((e) => ({
          value: e.id,
          label: e.nombre,
          nameKey: e.nombre.toLowerCase().replace(/\s+/g, '_').replace(/\./g, '') // ej: "m_p" se convierte en "m_p"
        }))
      ])
    } catch (error) {
      console.error('LaboratorioGeneralSection: Error cargando etapas:', error)
    }
    setIsLoadingEtapas(false)
  }, [])

  useEffect(() => {
    loadEtapasForSelector()
  }, [loadEtapasForSelector])

  const handleEtapaPrincipalSelectChange = (e) => {
    const etapaId = e.target.value
    const etapaObj = etapaOptions.find((opt) => String(opt.value) === String(etapaId))
    setSelectedEtapaIdState(etapaId)
    setSelectedEtapaNameKeyState(etapaObj ? etapaObj.nameKey : '')
    setConfirmedFullKeys(null) // Resetear claves confirmadas al cambiar la etapa principal
  }

  const handleSubKeysConfirmed = useCallback(
    (subKeysFromKeySelector) => {
      // subKeysFromKeySelector es { muestraId, origenId, muestraNombre, origenNombre }
      // o solo { origenId, origenNombre } si la etapa no usa muestra.
      if (selectedCicloIdState && selectedEtapaIdState) {
        const etapaObj = etapaOptions.find((e) => String(e.value) === String(selectedEtapaIdState))
        const fullKeys = {
          cicloId: selectedCicloIdState,
          cicloNombre: globalCicloNombre,
          etapaId: parseInt(selectedEtapaIdState),
          etapaNombre: etapaObj ? etapaObj.label : '',
          muestraId: subKeysFromKeySelector.muestraId || null,
          muestraNombre: subKeysFromKeySelector.muestraNombre || null,
          origenId: subKeysFromKeySelector.origenId || null,
          origenNombre: subKeysFromKeySelector.origenNombre || null
        }
        console.log(
          'LaboratorioGeneralSection: Combinación COMPLETA de claves confirmada:',
          fullKeys
        )
        setConfirmedFullKeys(fullKeys)
      } else {
        console.warn(
          'LaboratorioGeneralSection: Ciclo o Etapa Principal no seleccionados al confirmar sub-claves.'
        )
      }
    },
    [selectedCicloIdState, selectedEtapaIdState, globalCicloNombre, etapaOptions]
  )

  const handleSubKeysCleared = useCallback(() => {
    console.log('LaboratorioGeneralSection: KeySelector limpió sus claves.')
    setConfirmedFullKeys(null)
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">
        Laboratorio: Entrada General de Datos
      </h2>

      {/* 1. Selector de Ciclo Global */}
      <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
        <label
          htmlFor="ciclo-selector-general"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Ciclo de Trabajo Activo:
        </label>
        <div className="flex items-center gap-2">
          <select
            id="ciclo-selector-general"
            value={globalCicloNombre || ''}
            onChange={(e) => setGlobalCiclo(e.target.value)}
            disabled={isFetchingCiclos}
            className="block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">-- Selecciona un Ciclo --</option>
            {Array.isArray(availableCiclos) &&
              availableCiclos.map((ciclo) => (
                <option key={ciclo.id} value={ciclo.nombre_ciclo}>
                  {ciclo.nombre_ciclo}
                </option>
              ))}
          </select>
          <button
            type="button"
            onClick={refreshCiclos}
            disabled={isFetchingCiclos}
            className="p-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
            title="Refrescar lista de ciclos"
          >
            <FiRefreshCw className={`h-4 w-4 ${isFetchingCiclos ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {!globalCicloNombre && (
          <p className="text-xs text-orange-600 mt-1">
            Por favor, selecciona un ciclo o crea uno nuevo en "Gestión de Ciclos".
          </p>
        )}
      </div>

      {/* 2. Selectores para Etapa y luego Muestra/Origen (usando KeySelector) */}
      {globalCicloNombre && selectedCicloIdState && (
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 mt-4">
          <label
            htmlFor="etapaPrincipalSelect"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Selecciona la Etapa Principal para Ciclo:{' '}
            <span className="font-semibold text-indigo-600">{globalCicloNombre}</span>
          </label>
          <select
            id="etapaPrincipalSelect"
            value={selectedEtapaIdState}
            onChange={handleEtapaPrincipalSelectChange}
            disabled={isLoadingEtapas}
            className="block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
          >
            {etapaOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {selectedEtapaNameKeyState && ( // Solo muestra KeySelector si se ha elegido una etapa principal
            <KeySelector
              etapa={selectedEtapaNameKeyState} // Pasamos el nameKey de la etapa
              onKeysSelected={handleSubKeysConfirmed}
              onKeysCleared={handleSubKeysCleared}
            />
          )}
        </div>
      )}

      {/* 3. Formulario de Metadata */}
      {confirmedFullKeys && (
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Ingresar Metadatos para: <br />
            <span className="text-sm">
              Ciclo: <strong className="text-indigo-600">{confirmedFullKeys.cicloNombre}</strong>{' '}
              (ID: {confirmedFullKeys.cicloId}), Etapa:{' '}
              <strong className="text-indigo-600">
                {etapaOptions.find((e) => e.value === confirmedFullKeys.etapaId)?.label}
              </strong>{' '}
              (ID: {confirmedFullKeys.etapaId}), Muestra:{' '}
              <strong className="text-indigo-600">
                {confirmedFullKeys.muestraNombre || 'N/A'}
              </strong>{' '}
              (ID: {confirmedFullKeys.muestraId || 'N/A'}), Origen:{' '}
              <strong className="text-indigo-600">{confirmedFullKeys.origenNombre || 'N/A'}</strong>{' '}
              (ID: {confirmedFullKeys.origenId || 'N/A'})
            </span>
          </h3>
          {/* <MetadataForm
              keys={{
                  cicloId: confirmedFullKeys.cicloId,
                  etapaId: confirmedFullKeys.etapaId,
                  muestraId: confirmedFullKeys.muestraId,
                  origenId: confirmedFullKeys.origenId
              }}
              etapaNameKeyForConfig={selectedEtapaNameKeyState}
          /> */}
          <p className="text-gray-500 italic">
            (Formulario Genérico de Metadata irá aquí - En construcción)
          </p>
        </div>
      )}
      {!confirmedFullKeys && globalCicloNombre && selectedEtapaNameKeyState && (
        <p className="mt-2 text-sm text-blue-600 italic">
          Selecciona Muestra y/u Origen en el panel de arriba y presiona "Cargar / Ver Datos..."
          para ingresar metadatos.
        </p>
      )}

      {/* 4. Resumen del Ciclo (Matriz) */}
      {globalCicloNombre && selectedCicloIdState && (
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Resumen del Ciclo: <span className="text-indigo-600">{globalCicloNombre}</span>
          </h3>
          {/* <ResumenMatriz cicloId={selectedCicloIdState} /> */}
          <p className="text-gray-500 italic">
            (Tabla/Matriz de resumen para el ciclo seleccionado irá aquí - En construcción)
          </p>
        </div>
      )}
    </div>
  )
}
export default LaboratorioGeneralSection
