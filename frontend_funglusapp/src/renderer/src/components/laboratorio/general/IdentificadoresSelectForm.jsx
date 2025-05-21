// src/renderer/src/components/laboratorio/general/IdentificadoresSelectForm.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { FiCheckSquare, FiFilter, FiRefreshCw } from 'react-icons/fi'

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'
const NA_VALUE_ID_STRING = '' // Para la opción "-- Selecciona --"

/**
 * @component IdentificadoresSelectForm
 * @description Formulario para seleccionar una combinación de Ciclo (catálogo), Etapa, Muestra y Origen.
 * @param {object} props
 * @param {function} props.onConfirm - Callback que se ejecuta al confirmar, con los IDs seleccionados.
 * @param {function} props.onClear - Callback que se ejecuta al limpiar la selección.
 * @param {any} props.formKey - Una clave opcional para forzar el reseteo del formulario desde el padre.
 */
function IdentificadoresSelectForm({ onConfirm, onClear, formKey }) {
  const [cicloOptions, setCicloOptions] = useState([
    { value: NA_VALUE_ID_STRING, label: '-- Selecciona Ciclo (Catálogo) --' }
  ])
  const [etapaOptions, setEtapaOptions] = useState([
    { value: NA_VALUE_ID_STRING, label: '-- Selecciona Etapa --' }
  ])
  const [muestraOptions, setMuestraOptions] = useState([
    { value: NA_VALUE_ID_STRING, label: '-- Selecciona Muestra --' }
  ])
  const [origenOptions, setOrigenOptions] = useState([
    { value: NA_VALUE_ID_STRING, label: '-- Selecciona Origen --' }
  ])

  const [selectedCicloId, setSelectedCicloId] = useState(NA_VALUE_ID_STRING)
  const [selectedEtapaId, setSelectedEtapaId] = useState(NA_VALUE_ID_STRING)
  const [selectedMuestraId, setSelectedMuestraId] = useState(NA_VALUE_ID_STRING)
  const [selectedOrigenId, setSelectedOrigenId] = useState(NA_VALUE_ID_STRING)

  const [isLoading, setIsLoading] = useState({
    ciclos: false,
    etapas: false,
    muestras: false,
    origenes: false
  })
  const [localMessage, setLocalMessage] = useState({ text: '', type: 'info' })

  const fetchCatalogos = useCallback(async () => {
    setIsLoading((prev) => ({
      ...prev,
      ciclos: true,
      etapas: true,
      muestras: true,
      origenes: true
    }))
    setLocalMessage({ text: 'Cargando opciones de catálogo...', type: 'info' })
    let success = true
    try {
      const fetchOptions = { headers: { Accept: 'application/json' } }
      const [ciclosResponse, etapasResponse, muestrasResponse, origenesResponse] =
        await Promise.all([
          fetch(`${FASTAPI_BASE_URL}/catalogos/ciclos/?limit=1000`, fetchOptions),
          fetch(`${FASTAPI_BASE_URL}/catalogos/etapas/?limit=1000`, fetchOptions),
          fetch(`${FASTAPI_BASE_URL}/catalogos/muestras/?limit=1000`, fetchOptions),
          fetch(`${FASTAPI_BASE_URL}/catalogos/origenes/?limit=1000`, fetchOptions)
        ])

      // Procesar Ciclos
      if (!ciclosResponse.ok) throw new Error(`Error Ciclos: ${ciclosResponse.statusText}`)
      const ciclosData = await ciclosResponse.json()
      setCicloOptions([
        { value: NA_VALUE_ID_STRING, label: '-- Selecciona Ciclo (Catálogo) --' },
        ...(ciclosData || []).map((c) => ({ value: String(c.id), label: c.nombre_ciclo }))
      ])
      setIsLoading((prev) => ({ ...prev, ciclos: false }))

      // Procesar Etapas
      if (!etapasResponse.ok) throw new Error(`Error Etapas: ${etapasResponse.statusText}`)
      const etapasData = await etapasResponse.json()
      setEtapaOptions([
        { value: NA_VALUE_ID_STRING, label: '-- Selecciona Etapa --' },
        ...(etapasData || []).map((e) => ({ value: String(e.id), label: e.nombre }))
      ])
      setIsLoading((prev) => ({ ...prev, etapas: false }))

      // Procesar Muestras
      if (!muestrasResponse.ok) throw new Error(`Error Muestras: ${muestrasResponse.statusText}`)
      const muestrasData = await muestrasResponse.json()
      setMuestraOptions([
        { value: NA_VALUE_ID_STRING, label: '-- Selecciona Muestra (o N/A si aplica) --' },
        ...(muestrasData || []).map((m) => ({ value: String(m.id), label: m.nombre }))
      ])
      setIsLoading((prev) => ({ ...prev, muestras: false }))

      // Procesar Origenes
      if (!origenesResponse.ok) throw new Error(`Error Origenes: ${origenesResponse.statusText}`)
      const origenesData = await origenesResponse.json()
      setOrigenOptions([
        { value: NA_VALUE_ID_STRING, label: '-- Selecciona Origen (o N/A si aplica) --' },
        ...(origenesData || []).map((o) => ({ value: String(o.id), label: o.nombre }))
      ])
      setIsLoading((prev) => ({ ...prev, origenes: false }))

      setLocalMessage({ text: 'Opciones de catálogo cargadas.', type: 'success' })
    } catch (error) {
      console.error('IdentificadoresSelectForm: Error cargando catálogos:', error)
      setLocalMessage({ text: `Error al cargar opciones: ${error.message}`, type: 'error' })
      setIsLoading({ ciclos: false, etapas: false, muestras: false, origenes: false }) // Reset all loading on error
      success = false
    } finally {
      // No resetear todos los isLoading aquí, ya se hizo individualmente
      setTimeout(() => {
        if (success && localMessage.type !== 'error') setLocalMessage({ text: '', type: '' })
      }, 3000)
    }
  }, []) // Dependencia vacía para que se ejecute una vez al montar

  // Cargar catálogos al montar el componente
  useEffect(() => {
    fetchCatalogos()
  }, [fetchCatalogos])

  // Efecto para resetear el formulario si formKey cambia
  useEffect(() => {
    if (formKey) {
      // Si se provee una formKey y cambia, resetea.
      setSelectedCicloId(NA_VALUE_ID_STRING)
      setSelectedEtapaId(NA_VALUE_ID_STRING)
      setSelectedMuestraId(NA_VALUE_ID_STRING)
      setSelectedOrigenId(NA_VALUE_ID_STRING)
      if (onClear && typeof onClear === 'function') onClear()
    }
  }, [formKey, onClear])

  const handleCicloChange = (e) => {
    setSelectedCicloId(e.target.value)
    // Al cambiar el ciclo, reseteamos las selecciones dependientes (Etapa, Muestra, Origen)
    // y notificamos al padre para que limpie datos dependientes.
    setSelectedEtapaId(NA_VALUE_ID_STRING)
    setSelectedMuestraId(NA_VALUE_ID_STRING)
    setSelectedOrigenId(NA_VALUE_ID_STRING)
    if (onClear && typeof onClear === 'function') onClear()
  }
  const handleEtapaChange = (e) => {
    setSelectedEtapaId(e.target.value)
    setSelectedMuestraId(NA_VALUE_ID_STRING) // Resetear Muestra y Origen si Etapa cambia
    setSelectedOrigenId(NA_VALUE_ID_STRING)
    if (onClear && typeof onClear === 'function') onClear()
  }
  const handleMuestraChange = (e) => {
    setSelectedMuestraId(e.target.value)
    // Opcional: Resetear Origen si Muestra cambia, dependiendo de la lógica de negocio.
    // Por ahora, asumimos que pueden ser independientes después de Etapa.
    if (onClear && typeof onClear === 'function') onClear()
  }
  const handleOrigenChange = (e) => {
    setSelectedOrigenId(e.target.value)
    if (onClear && typeof onClear === 'function') onClear()
  }

  const handleConfirm = () => {
    if (!selectedCicloId) {
      setLocalMessage({ text: 'El Ciclo (Catálogo) es obligatorio.', type: 'error' })
      setTimeout(() => setLocalMessage({ text: '', type: '' }), 3000)
      return
    }
    if (!selectedEtapaId) {
      setLocalMessage({ text: 'La Etapa es obligatoria.', type: 'error' })
      setTimeout(() => setLocalMessage({ text: '', type: '' }), 3000)
      return
    }
    // Muestra y Origen pueden ser opcionales (se envían como null si NA_VALUE_ID_STRING)

    const cicloObj = cicloOptions.find((c) => c.value === selectedCicloId)
    const etapaObj = etapaOptions.find((e) => e.value === selectedEtapaId)
    const muestraObj = muestraOptions.find((m) => m.value === selectedMuestraId)
    const origenObj = origenOptions.find((o) => o.value === selectedOrigenId)

    const confirmedKeys = {
      cicloId: selectedCicloId ? parseInt(selectedCicloId) : null,
      etapaId: selectedEtapaId ? parseInt(selectedEtapaId) : null,
      muestraId: selectedMuestraId ? parseInt(selectedMuestraId) : null, // Será null si NA_VALUE_ID_STRING
      origenId: selectedOrigenId ? parseInt(selectedOrigenId) : null, // Será null si NA_VALUE_ID_STRING
      cicloNombre: cicloObj?.label.replace('-- Selecciona Ciclo (Catálogo) --', '').trim(),
      etapaNombre: etapaObj?.label.replace('-- Selecciona Etapa --', '').trim(),
      muestraNombre:
        muestraObj?.label.replace('-- Selecciona Muestra (o N/A si aplica) --', '').trim() ||
        undefined,
      origenNombre:
        origenObj?.label.replace('-- Selecciona Origen (o N/A si aplica) --', '').trim() ||
        undefined
    }

    console.log('IdentificadoresSelectForm: Confirmando claves:', confirmedKeys)
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm(confirmedKeys)
    }
    setLocalMessage({ text: 'Contexto de catálogo aplicado.', type: 'success' })
    setTimeout(() => {
      if (localMessage.type === 'success') setLocalMessage({ text: '', type: '' })
    }, 3000)
  }

  // El botón de confirmar se habilita si al menos Ciclo y Etapa están seleccionados.
  const enableConfirmButton = selectedCicloId && selectedEtapaId
  const anyLoading =
    isLoading.ciclos || isLoading.etapas || isLoading.muestras || isLoading.origenes

  return (
    <div className="mb-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-indigo-700 flex items-center">
          <FiFilter className="mr-2 h-4 w-4" />
          Seleccionar Identificadores de Catálogo
        </h4>
        <button
          type="button"
          onClick={fetchCatalogos} // Ahora refresca todos los catálogos
          disabled={anyLoading}
          className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 disabled:opacity-50 text-xs"
          title="Refrescar listas de catálogo"
        >
          <FiRefreshCw className={`h-3 w-3 ${anyLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        <div>
          <label
            htmlFor="isf-cicloSelect"
            className="block text-xs font-medium text-gray-600 mb-0.5"
          >
            Ciclo (Catálogo) (*):
          </label>
          <select
            id="isf-cicloSelect"
            value={selectedCicloId}
            onChange={handleCicloChange}
            disabled={isLoading.ciclos}
            className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-60"
          >
            {cicloOptions.map((opt) => (
              <option key={opt.value || 'ciclo-empty'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
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
            disabled={isLoading.etapas || !selectedCicloId} // Deshabilitado si no hay ciclo o si etapas están cargando
            className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-60"
          >
            {etapaOptions.map((opt) => (
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
            disabled={isLoading.muestras || !selectedEtapaId} // Deshabilitado si no hay etapa o si muestras están cargando
            className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-60"
          >
            {muestraOptions.map((opt) => (
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
            disabled={isLoading.origenes || !selectedEtapaId} // Deshabilitado si no hay etapa o si orígenes están cargando
            className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-60"
          >
            {origenOptions.map((opt) => (
              <option key={opt.value || 'origen-empty'} value={opt.value}>
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
          disabled={!enableConfirmButton || anyLoading}
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
