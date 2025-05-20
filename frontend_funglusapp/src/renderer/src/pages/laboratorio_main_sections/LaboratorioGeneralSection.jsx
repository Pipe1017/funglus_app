// src/renderer/src/pages/laboratorio_main_sections/LaboratorioGeneralSection.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import IdentificadoresSelectForm from '../../components/laboratorio/general/IdentificadoresSelectForm'
import MetadataForm from '../../components/laboratorio/general/MetadataForm'
import ResumenMatriz from '../../components/laboratorio/general/ResumenMatriz'
import { useCiclo } from '../../contexts/CicloContext'

function LaboratorioGeneralSection() {
  const {
    currentCiclo: globalCicloNombre,
    selectCiclo: setGlobalCiclo,
    availableCiclos,
    isFetchingCiclos,
    refreshCiclos,
    getCurrentCicloId
  } = useCiclo()

  const [confirmedFullKeys, setConfirmedFullKeys] = useState(null)
  const activeCicloIdFromContext = getCurrentCicloId()

  const handleIdentificadoresConfirmed = useCallback((keysFromSelector) => {
    console.log('LaboratorioGeneralSection: Combinación de claves confirmada:', keysFromSelector)
    setConfirmedFullKeys(keysFromSelector)
  }, [])

  const handleIdentificadoresCleared = useCallback(() => {
    console.log('LaboratorioGeneralSection: Selección de identificadores limpiada.')
    setConfirmedFullKeys(null)
  }, [])

  useEffect(() => {
    setConfirmedFullKeys(null)
  }, [globalCicloNombre])

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
          1. Ciclo de Trabajo Activo:
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

      {/* 2. Selectores para Etapa, Muestra, Origen */}
      {globalCicloNombre && activeCicloIdFromContext && (
        <IdentificadoresSelectForm
          activeCicloId={activeCicloIdFromContext}
          onConfirm={handleIdentificadoresConfirmed}
          onClear={handleIdentificadoresCleared}
        />
      )}

      {/* 3. Formulario de Metadata */}
      {confirmedFullKeys && confirmedFullKeys.cicloId && confirmedFullKeys.etapaId && (
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Ingresar Metadatos para: <br />
            <span className="text-sm">
              Ciclo: <strong className="text-indigo-600">{confirmedFullKeys.cicloNombre}</strong>{' '}
              (ID: {confirmedFullKeys.cicloId}), Etapa:{' '}
              <strong className="text-indigo-600">{confirmedFullKeys.etapaNombre}</strong> (ID:{' '}
              {confirmedFullKeys.etapaId}), Muestra:{' '}
              <strong className="text-indigo-600">
                {confirmedFullKeys.muestraNombre || 'N/A'}
              </strong>{' '}
              (ID: {confirmedFullKeys.muestraId || 'N/A'}), Origen:{' '}
              <strong className="text-indigo-600">{confirmedFullKeys.origenNombre || 'N/A'}</strong>{' '}
              (ID: {confirmedFullKeys.origenId || 'N/A'})
            </span>
          </h3>
          <MetadataForm
            keysFromSection={{
              cicloId: confirmedFullKeys.cicloId,
              etapaId: confirmedFullKeys.etapaId,
              muestraId: confirmedFullKeys.muestraId,
              origenId: confirmedFullKeys.origenId,
              cicloNombre: confirmedFullKeys.cicloNombre,
              etapaNombre: confirmedFullKeys.etapaNombre,
              muestraNombre: confirmedFullKeys.muestraNombre,
              origenNombre: confirmedFullKeys.origenNombre
            }}
          />
        </div>
      )}
      {!confirmedFullKeys && globalCicloNombre && (
        <p className="mt-2 text-sm text-blue-600 italic p-4 bg-blue-50 rounded-md shadow">
          Selecciona Etapa, Muestra (si aplica) y Origen (si aplica) y presiona "Aplicar Contexto"
          para ingresar metadatos.
        </p>
      )}

      {/* 4. Resumen del Ciclo (Matriz) */}
      {globalCicloNombre && activeCicloIdFromContext && (
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Resumen del Ciclo: <span className="text-indigo-600">{globalCicloNombre}</span>
          </h3>
          <ResumenMatriz cicloId={activeCicloIdFromContext} />
        </div>
      )}
    </div>
  )
}

export default LaboratorioGeneralSection
