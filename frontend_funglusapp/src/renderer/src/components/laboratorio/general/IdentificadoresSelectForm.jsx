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
 * @param {object} props.value - Objeto con los IDs para controlar el formulario desde un componente padre.
 */
function IdentificadoresSelectForm({ onConfirm, onClear, formKey, value }) {
  // --- DECLARACIÓN DE ESTADOS (UNA SOLA VEZ) ---
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
  const [secuenciaOptions, setSecuenciaOptions] = useState([
    { value: NA_VALUE_ID_STRING, label: '-- Selecciona Secuencia --' }
  ])

  const [selectedCicloId, setSelectedCicloId] = useState(NA_VALUE_ID_STRING)
  const [selectedEtapaId, setSelectedEtapaId] = useState(NA_VALUE_ID_STRING)
  const [selectedMuestraId, setSelectedMuestraId] = useState(NA_VALUE_ID_STRING)
  const [selectedOrigenId, setSelectedOrigenId] = useState(NA_VALUE_ID_STRING)
  const [selectedSecuenciaId, setSelectedSecuenciaId] = useState(NA_VALUE_ID_STRING)

  const [isLoading, setIsLoading] = useState({
    ciclos: false,
    etapas: false,
    muestras: false,
    origenes: false
  })
  const [localMessage, setLocalMessage] = useState({ text: '', type: 'info' })

  // --- DEFINICIÓN DE FUNCIONES (UNA SOLA VEZ) ---
const fetchCatalogos = useCallback(async () => {
    // El estado de carga ahora debe incluir secuencias
    setIsLoading({ ciclos: true, etapas: true, muestras: true, origenes: true, secuencias: true });
    setLocalMessage({ text: 'Cargando opciones de catálogo...', type: 'info' });
    
    try {
      const fetchOptions = { headers: { Accept: 'application/json' } };
      
      // <-- MODIFICADO: Se añade `secuenciasRes` para recibir la 5ta respuesta
      const [ciclosRes, etapasRes, muestrasRes, origenesRes, secuenciasRes] =
        await Promise.all([
          fetch(`${FASTAPI_BASE_URL}/catalogos/ciclos/?limit=1000`, fetchOptions),
          fetch(`${FASTAPI_BASE_URL}/catalogos/etapas/?limit=1000`, fetchOptions),
          fetch(`${FASTAPI_BASE_URL}/catalogos/muestras/?limit=1000`, fetchOptions),
          fetch(`${FASTAPI_BASE_URL}/catalogos/origenes/?limit=1000`, fetchOptions),
          fetch(`${FASTAPI_BASE_URL}/catalogos/secuencias/?limit=1000`, fetchOptions),
        ]);

      // Procesamiento de Ciclos (sin cambios)
      if (!ciclosRes.ok) throw new Error(`Error Ciclos: ${ciclosRes.statusText}`);
      const ciclosData = await ciclosRes.json();
      setCicloOptions([
        { value: NA_VALUE_ID_STRING, label: '-- Selecciona Ciclo (Catálogo) --' },
        ...(ciclosData || []).map((c) => ({ value: String(c.id), label: c.nombre_ciclo })),
      ]);
      setIsLoading((prev) => ({ ...prev, ciclos: false }));

      // Procesamiento de Etapas (sin cambios)
      if (!etapasRes.ok) throw new Error(`Error Etapas: ${etapasRes.statusText}`);
      const etapasData = await etapasRes.json();
      setEtapaOptions([
        { value: NA_VALUE_ID_STRING, label: '-- Selecciona Etapa --' },
        ...(etapasData || []).map((e) => ({ value: String(e.id), label: e.nombre })),
      ]);
      setIsLoading((prev) => ({ ...prev, etapas: false }));

      // Procesamiento de Muestras (sin cambios)
      if (!muestrasRes.ok) throw new Error(`Error Muestras: ${muestrasRes.statusText}`);
      const muestrasData = await muestrasRes.json();
      setMuestraOptions([
        { value: NA_VALUE_ID_STRING, label: '-- Selecciona Muestra --' },
        ...(muestrasData || []).map((m) => ({ value: String(m.id), label: m.nombre })),
      ]);
      setIsLoading((prev) => ({ ...prev, muestras: false }));

      // Procesamiento de Origenes (sin cambios)
      if (!origenesRes.ok) throw new Error(`Error Origenes: ${origenesRes.statusText}`);
      const origenesData = await origenesRes.json();
      setOrigenOptions([
        { value: NA_VALUE_ID_STRING, label: '-- Selecciona Origen --' },
        ...(origenesData || []).map((o) => ({ value: String(o.id), label: o.nombre })),
      ]);
      setIsLoading((prev) => ({ ...prev, origenes: false }));

      // <-- ¡NUEVO! Se añade la lógica completa para Secuencias
      if (!secuenciasRes.ok) throw new Error(`Error Secuencias: ${secuenciasRes.statusText}`);
      const secuenciasData = await secuenciasRes.json();
      setSecuenciaOptions([
        { value: NA_VALUE_ID_STRING, label: '-- Selecciona Secuencia --' },
        ...(secuenciasData || []).map((s) => ({ value: String(s.id), label: s.nombre })),
      ]);
      setIsLoading((prev) => ({ ...prev, secuencias: false }));

      setLocalMessage({ text: 'Opciones de catálogo cargadas.', type: 'success' });
    } catch (error) {
        setLocalMessage({ text: `Error al cargar opciones: ${error.message}`, type: 'error' });
    } finally {
        // Asegurarse de que todos los isLoading se pongan en false en caso de error
        setIsLoading({ ciclos: false, etapas: false, muestras: false, origenes: false, secuencias: false });
    }
  }, []);

  // --- LÓGICA DE EFECTOS (useEffect) ---
  useEffect(() => {
    fetchCatalogos()
  }, [fetchCatalogos])

  useEffect(() => {
    if (value) {
      setSelectedCicloId(String(value.cicloId || ''))
      setSelectedEtapaId(String(value.etapaId || ''))
      setSelectedMuestraId(String(value.muestraId || ''))
      setSelectedOrigenId(String(value.origenId || ''))
      setSelectedSecuenciaId(String(value.secuenciaId || '')) 
    }
  }, [value])

  useEffect(() => {
    if (formKey) {
      setSelectedCicloId(NA_VALUE_ID_STRING)
      setSelectedEtapaId(NA_VALUE_ID_STRING)
      setSelectedMuestraId(NA_VALUE_ID_STRING)
      setSelectedOrigenId(NA_VALUE_ID_STRING)
      setSelectedSecuenciaId(NA_VALUE_ID_STRING)
      if (onClear) onClear()
    }
  }, [formKey, onClear])

  // --- MANEJADORES DE EVENTOS ---
  const handleCicloChange = (e) => {
    setSelectedCicloId(e.target.value)
    setSelectedEtapaId(NA_VALUE_ID_STRING)
    setSelectedMuestraId(NA_VALUE_ID_STRING)
    setSelectedOrigenId(NA_VALUE_ID_STRING)
    if (onClear) onClear()
  }

  const handleEtapaChange = (e) => {
    setSelectedEtapaId(e.target.value)
    setSelectedMuestraId(NA_VALUE_ID_STRING)
    setSelectedOrigenId(NA_VALUE_ID_STRING)
    if (onClear) onClear()
  }

  const handleMuestraChange = (e) => {
    setSelectedMuestraId(e.target.value)
    if (onClear) onClear()
  }

  const handleOrigenChange = (e) => {
    setSelectedOrigenId(e.target.value)
    if (onClear) onClear()
  }

  const handleConfirm = () => {
    if (!selectedCicloId || !selectedEtapaId || !selectedMuestraId || !selectedOrigenId || !selectedSecuenciaId) {
      setLocalMessage({ text: 'Todos los campos de catálogo son obligatorios.', type: 'error' })
      setTimeout(() => setLocalMessage({ text: '', type: '' }), 3000)
      return
    }

    const cicloObj = cicloOptions.find((c) => c.value === selectedCicloId)
    const etapaObj = etapaOptions.find((e) => e.value === selectedEtapaId)
    const muestraObj = muestraOptions.find((m) => m.value === selectedMuestraId)
    const origenObj = origenOptions.find((o) => o.value === selectedOrigenId)

    const confirmedKeys = {
      cicloId: parseInt(selectedCicloId),
      etapaId: parseInt(selectedEtapaId),
      muestraId: parseInt(selectedMuestraId),
      origenId: parseInt(selectedOrigenId),
      secuenciaId: parseInt(selectedSecuenciaId),
      cicloNombre: cicloObj?.label,
      etapaNombre: etapaObj?.label,
      muestraNombre: muestraObj?.label,
      origenNombre: origenObj?.label
    }

    if (onConfirm) onConfirm(confirmedKeys)
    setLocalMessage({ text: 'Contexto de catálogo aplicado.', type: 'success' })
    setTimeout(() => {
      if (localMessage.type === 'success') setLocalMessage({ text: '', type: '' })
    }, 3000)
  }

  // --- RENDERIZADO DEL COMPONENTE ---
  const enableConfirmButton =
    selectedCicloId && selectedEtapaId && selectedMuestraId && selectedOrigenId
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
          onClick={fetchCatalogos}
          disabled={anyLoading}
          className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 disabled:opacity-50 text-xs"
          title="Refrescar listas de catálogo"
        >
          <FiRefreshCw className={`h-3 w-3 ${anyLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* MODIFIED: Grid now has 5 columns for large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        {/* 1. Ciclo */}
        <div>
          <label htmlFor="isf-cicloSelect" className="block text-xs font-medium text-gray-600 mb-0.5">
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

        {/* 2. Etapa */}
        <div>
          <label htmlFor="isf-etapaSelect" className="block text-xs font-medium text-gray-600 mb-0.5">
            Etapa (*):
          </label>
          <select
            id="isf-etapaSelect"
            value={selectedEtapaId}
            onChange={handleEtapaChange}
            disabled={isLoading.etapas || !selectedCicloId}
            className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-60"
          >
            {etapaOptions.map((opt) => (
              <option key={opt.value || 'etapa-empty'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Muestra */}
        <div>
          <label htmlFor="isf-muestraSelect" className="block text-xs font-medium text-gray-600 mb-0.5">
            Muestra (*):
          </label>
          <select
            id="isf-muestraSelect"
            value={selectedMuestraId}
            onChange={handleMuestraChange}
            disabled={isLoading.muestras || !selectedEtapaId}
            className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-60"
          >
            {muestraOptions.map((opt) => (
              <option key={opt.value || 'muestra-empty'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Origen (CORRECTED ORDER) */}
        <div>
          <label htmlFor="isf-origenSelect" className="block text-xs font-medium text-gray-600 mb-0.5">
            Origen (*):
          </label>
          <select
            id="isf-origenSelect"
            value={selectedOrigenId}
            onChange={handleOrigenChange}
            disabled={isLoading.origenes || !selectedMuestraId} // Depends on Muestra now
            className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-60"
          >
            {origenOptions.map((opt) => (
              <option key={opt.value || 'origen-empty'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Secuencia (CORRECTED ORDER) */}
        <div>
          <label htmlFor="isf-secuenciaSelect" className="block text-xs font-medium text-gray-600 mb-0.5">
            Secuencia (*):
          </label>
          <select
            id="isf-secuenciaSelect"
            value={selectedSecuenciaId}
            onChange={(e) => setSelectedSecuenciaId(e.target.value)}
            disabled={isLoading.secuencias || !selectedOrigenId} // Depends on Origen now
            className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-60"
          >
            {secuenciaOptions.map((opt) => (
              <option key={opt.value || 'secuencia-empty'} value={opt.value}>
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
          <p className={`text-xs mt-1.5 ${localMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {localMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default IdentificadoresSelectForm
