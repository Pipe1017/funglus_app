// src/renderer/src/components/laboratorio/general/IdentificadoresSelectForm.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { FiCheckSquare, FiFilter, FiRefreshCw } from 'react-icons/fi'

const NA_VALUE_ID_STRING = '' // Usaremos string vacío para la opción "-- Selecciona --"

function IdentificadoresSelectForm({ onConfirm, onClear, activeCicloId }) {
  const [etapaOptions, setEtapaOptions] = useState([
    { value: NA_VALUE_ID_STRING, label: '-- Selecciona Etapa --' }
  ])
  const [muestraOptions, setMuestraOptions] = useState([
    { value: NA_VALUE_ID_STRING, label: '-- Selecciona Muestra (o N/A) --' }
  ])
  const [origenOptions, setOrigenOptions] = useState([
    { value: NA_VALUE_ID_STRING, label: '-- Selecciona Origen (o N/A) --' }
  ])

  const [selectedEtapaId, setSelectedEtapaId] = useState(NA_VALUE_ID_STRING)
  const [selectedMuestraId, setSelectedMuestraId] = useState(NA_VALUE_ID_STRING)
  const [selectedOrigenId, setSelectedOrigenId] = useState(NA_VALUE_ID_STRING)

  const [isLoading, setIsLoading] = useState(false)
  const [localMessage, setLocalMessage] = useState({ text: '', type: 'info' })

  const fetchDataForDropdowns = useCallback(async () => {
    if (!activeCicloId) {
      setEtapaOptions([{ value: NA_VALUE_ID_STRING, label: '-- Selecciona Etapa --' }])
      setMuestraOptions([{ value: NA_VALUE_ID_STRING, label: '-- Selecciona Muestra (o N/A) --' }])
      setOrigenOptions([{ value: NA_VALUE_ID_STRING, label: '-- Selecciona Origen (o N/A) --' }])
      return
    }

    setIsLoading(true)
    setLocalMessage({ text: 'Cargando opciones de catálogo...', type: 'info' })
    let success = true
    try {
      const [etapasData, muestrasData, origenesData] = await Promise.all([
        window.electronAPI.getAllEtapas({ limit: 1000 }),
        window.electronAPI.getAllMuestras({ limit: 1000 }),
        window.electronAPI.getAllOrigenes({ limit: 1000 })
      ])

      setEtapaOptions([
        { value: NA_VALUE_ID_STRING, label: '-- Selecciona Etapa --' },
        ...(etapasData || []).map((e) => ({ value: String(e.id), label: e.nombre }))
      ])
      setMuestraOptions([
        { value: NA_VALUE_ID_STRING, label: '-- Selecciona Muestra (o N/A) --' },
        ...(muestrasData || []).map((m) => ({ value: String(m.id), label: m.nombre }))
      ])
      setOrigenOptions([
        { value: NA_VALUE_ID_STRING, label: '-- Selecciona Origen (o N/A) --' },
        ...(origenesData || []).map((o) => ({ value: String(o.id), label: o.nombre }))
      ])
      setLocalMessage({ text: 'Opciones de catálogo cargadas.', type: 'success' })
    } catch (error) {
      console.error('IdentificadoresSelectForm: Error cargando catálogos', error)
      setLocalMessage({ text: `Error al cargar opciones: ${error.message}`, type: 'error' })
      success = false
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        if (success && localMessage.type !== 'error') setLocalMessage({ text: '', type: '' })
      }, 3000)
    }
  }, [activeCicloId])

  useEffect(() => {
    fetchDataForDropdowns()
  }, [fetchDataForDropdowns])

  useEffect(() => {
    if (!activeCicloId) {
      setSelectedEtapaId(NA_VALUE_ID_STRING)
      setSelectedMuestraId(NA_VALUE_ID_STRING)
      setSelectedOrigenId(NA_VALUE_ID_STRING)
      if (onClear && typeof onClear === 'function') onClear()
    }
  }, [activeCicloId, onClear])

  const handleEtapaChange = (e) => {
    setSelectedEtapaId(e.target.value)
    setSelectedMuestraId(NA_VALUE_ID_STRING)
    setSelectedOrigenId(NA_VALUE_ID_STRING)
    if (onClear && typeof onClear === 'function') onClear()
  }
  const handleMuestraChange = (e) => {
    setSelectedMuestraId(e.target.value)
    setSelectedOrigenId(NA_VALUE_ID_STRING)
    if (onClear && typeof onClear === 'function') onClear()
  }
  const handleOrigenChange = (e) => {
    setSelectedOrigenId(e.target.value)
    if (onClear && typeof onClear === 'function') onClear()
  }

  const handleConfirm = () => {
    if (!activeCicloId) {
      setLocalMessage({ text: 'Primero selecciona un Ciclo de Trabajo Activo.', type: 'error' })
      setTimeout(() => setLocalMessage({ text: '', type: '' }), 3000)
      return
    }
    if (!selectedEtapaId) {
      setLocalMessage({ text: 'La Etapa es obligatoria.', type: 'error' })
      setTimeout(() => setLocalMessage({ text: '', type: '' }), 3000)
      return
    }

    const etapaObj = etapaOptions.find((e) => e.value === selectedEtapaId)
    const muestraObj = muestraOptions.find((m) => m.value === selectedMuestraId)
    const origenObj = origenOptions.find((o) => o.value === selectedOrigenId)

    const confirmedKeys = {
      cicloId: activeCicloId,
      etapaId: selectedEtapaId ? parseInt(selectedEtapaId) : null,
      muestraId: selectedMuestraId ? parseInt(selectedMuestraId) : null,
      origenId: selectedOrigenId ? parseInt(selectedOrigenId) : null,
      etapaNombre: etapaObj?.label,
      muestraNombre: muestraObj?.label,
      origenNombre: origenObj?.label
    }

    console.log('IdentificadoresSelectForm: Confirmando claves:', confirmedKeys)
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm(confirmedKeys)
    }
    setLocalMessage({ text: 'Contexto de identificadores aplicado.', type: 'success' })
    setTimeout(() => {
      if (localMessage.type === 'success') setLocalMessage({ text: '', type: '' })
    }, 3000)
  }

  const enableConfirmButton = activeCicloId && selectedEtapaId

  return (
    <div className="mb-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-indigo-700 flex items-center">
          <FiFilter className="mr-2 h-4 w-4" />
          2. Seleccionar Identificadores (Etapa, Muestra, Origen)
        </h4>
        <button
          type="button"
          onClick={fetchDataForDropdowns}
          disabled={isLoading || !activeCicloId}
          className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 disabled:opacity-50 text-xs"
          title="Refrescar listas de catálogo"
        >
          <FiRefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div>
          <label
            htmlFor="isf-etapaSelect"
            className="block text-xs font-medium text-gray-600 mb-0.5"
          >
            Etapa (*):
          </label>
          <select
            id="isf-etapaSelect"
            value={selectedEtapaId}
            onChange={handleEtapaChange}
            disabled={isLoading || !activeCicloId}
            className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-60"
          >
            {Array.isArray(etapaOptions) &&
              etapaOptions.map((opt) => (
                <option key={opt.value || 'etapa-empty'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="isf-muestraSelect"
            className="block text-xs font-medium text-gray-600 mb-0.5"
          >
            Muestra:
          </label>
          <select
            id="isf-muestraSelect"
            value={selectedMuestraId}
            onChange={handleMuestraChange}
            disabled={isLoading || !activeCicloId || !selectedEtapaId}
            className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-60"
          >
            {Array.isArray(muestraOptions) &&
              muestraOptions.map((opt) => (
                <option key={opt.value || 'muestra-empty'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="isf-origenSelect"
            className="block text-xs font-medium text-gray-600 mb-0.5"
          >
            Origen:
          </label>
          <select
            id="isf-origenSelect"
            value={selectedOrigenId}
            onChange={handleOrigenChange}
            disabled={isLoading || !activeCicloId || !selectedEtapaId}
            className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-60"
          >
            {/* LÍNEA CORREGIDA: ELIMINADO UN ')' EXTRA AL FINAL */}
            {Array.isArray(origenOptions) &&
              origenOptions.map((opt) => (
                <option key={opt.value || 'origen-na'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-60"
          disabled={!enableConfirmButton}
        >
          <FiCheckSquare className="inline mr-1.5 h-4 w-4" /> Aplicar Identificadores
        </button>
        {localMessage.text && (
          <p
            className={`text-xs mt-1.5 ${localMessage.type === 'error' ? 'text-red-600' : localMessage.type === 'success' ? 'text-green-600' : 'text-gray-600'}`}
          >
            {localMessage.text}
          </p>
        )}
      </div>
    </div>
  )
}
export default IdentificadoresSelectForm
