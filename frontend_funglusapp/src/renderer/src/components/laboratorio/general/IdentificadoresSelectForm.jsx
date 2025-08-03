import React, { useCallback, useEffect, useState } from 'react'
import { FiCheckSquare, FiFilter, FiRefreshCw } from 'react-icons/fi'

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'
const NA_VALUE_ID_STRING = ''
const DATOS_LABORATORIO_GET_BY_KEYS_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/get_by_keys`

function IdentificadoresSelectForm({ onConfirm, onClear, formKey, value, skipValidation = false }) {
  // --- Estados para las opciones y selecciones de los <select> ---
  const [cicloOptions, setCicloOptions] = useState([])
  const [etapaOptions, setEtapaOptions] = useState([])
  const [muestraOptions, setMuestraOptions] = useState([])
  const [origenOptions, setOrigenOptions] = useState([])
  const [secuenciaOptions, setSecuenciaOptions] = useState([])

  const [selectedCicloId, setSelectedCicloId] = useState(NA_VALUE_ID_STRING)
  const [selectedEtapaId, setSelectedEtapaId] = useState(NA_VALUE_ID_STRING)
  const [selectedMuestraId, setSelectedMuestraId] = useState(NA_VALUE_ID_STRING)
  const [selectedOrigenId, setSelectedOrigenId] = useState(NA_VALUE_ID_STRING)
  const [selectedSecuenciaId, setSelectedSecuenciaId] = useState(NA_VALUE_ID_STRING)

  const [isLoading, setIsLoading] = useState({})
  const [localMessage, setLocalMessage] = useState({ text: '', type: '' })

  // --- Carga de datos de los catálogos ---
  const fetchCatalogos = useCallback(async () => {
    setIsLoading({ ciclos: true, etapas: true, muestras: true, origenes: true, secuencias: true });
    setLocalMessage({ text: 'Cargando opciones de catálogo...', type: 'info' });
    try {
      const fetchOptions = { headers: { Accept: 'application/json' } };
      const [ciclosRes, etapasRes, muestrasRes, origenesRes, secuenciasRes] =
        await Promise.all([
          fetch(`${FASTAPI_BASE_URL}/catalogos/ciclos/?limit=1000`, fetchOptions),
          fetch(`${FASTAPI_BASE_URL}/catalogos/etapas/?limit=1000`, fetchOptions),
          fetch(`${FASTAPI_BASE_URL}/catalogos/muestras/?limit=1000`, fetchOptions),
          fetch(`${FASTAPI_BASE_URL}/catalogos/origenes/?limit=1000`, fetchOptions),
          fetch(`${FASTAPI_BASE_URL}/catalogos/secuencias/?limit=1000`, fetchOptions),
        ]);

      const ciclosData = await ciclosRes.json();
      setCicloOptions([{ value: NA_VALUE_ID_STRING, label: '-- Ciclo --' }, ...ciclosData.map(c => ({ value: String(c.id), label: c.nombre_ciclo }))]);
      const etapasData = await etapasRes.json();
      setEtapaOptions([{ value: NA_VALUE_ID_STRING, label: '-- Etapa --' }, ...etapasData.map(e => ({ value: String(e.id), label: e.nombre }))]);
      const muestrasData = await muestrasRes.json();
      setMuestraOptions([{ value: NA_VALUE_ID_STRING, label: '-- Muestra --' }, ...muestrasData.map(m => ({ value: String(m.id), label: m.nombre }))]);
      const origenesData = await origenesRes.json();
      setOrigenOptions([{ value: NA_VALUE_ID_STRING, label: '-- Origen --' }, ...origenesData.map(o => ({ value: String(o.id), label: o.nombre }))]);
      const secuenciasData = await secuenciasRes.json();
      setSecuenciaOptions([{ value: NA_VALUE_ID_STRING, label: '-- Secuencia --' }, ...secuenciasData.map(s => ({ value: String(s.id), label: s.nombre }))]);
      
      setLocalMessage({ text: 'Catálogos cargados.', type: 'success' });
    } catch (error) {
        setLocalMessage({ text: `Error: ${error.message}`, type: 'error' });
    } finally {
        setIsLoading({});
    }
  }, []);

  // --- Efectos para sincronizar y cargar datos ---
  useEffect(() => { fetchCatalogos() }, [fetchCatalogos]);

  useEffect(() => {
    if (localMessage.text && localMessage.type !== 'error') {
      const timer = setTimeout(() => setLocalMessage({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [localMessage.text, localMessage.type]);

  useEffect(() => {
    if (value) {
      setSelectedCicloId(String(value.cicloId || ''));
      setSelectedEtapaId(String(value.etapaId || ''));
      setSelectedMuestraId(String(value.muestraId || ''));
      setSelectedOrigenId(String(value.origenId || ''));
      setSelectedSecuenciaId(String(value.secuenciaId || '')); 
    }
  }, [value]);

  useEffect(() => {
    if (formKey) {
      setSelectedCicloId(NA_VALUE_ID_STRING);
      setSelectedEtapaId(NA_VALUE_ID_STRING);
      setSelectedMuestraId(NA_VALUE_ID_STRING);
      setSelectedOrigenId(NA_VALUE_ID_STRING);
      setSelectedSecuenciaId(NA_VALUE_ID_STRING);
    }
  }, [formKey]);

  // --- Manejadores de eventos de los <select> ---
  const handleCicloChange = (e) => {
    setSelectedCicloId(e.target.value);
    setSelectedEtapaId(NA_VALUE_ID_STRING);
    setSelectedMuestraId(NA_VALUE_ID_STRING);
    setSelectedOrigenId(NA_VALUE_ID_STRING);
    setSelectedSecuenciaId(NA_VALUE_ID_STRING);
    if (onClear) onClear();
  };
  const handleEtapaChange = (e) => {
    setSelectedEtapaId(e.target.value);
    setSelectedMuestraId(NA_VALUE_ID_STRING);
    setSelectedOrigenId(NA_VALUE_ID_STRING);
    setSelectedSecuenciaId(NA_VALUE_ID_STRING);
    if (onClear) onClear();
  };
  const handleMuestraChange = (e) => {
    setSelectedMuestraId(e.target.value);
    setSelectedOrigenId(NA_VALUE_ID_STRING);
    setSelectedSecuenciaId(NA_VALUE_ID_STRING);
    if (onClear) onClear();
  };
  const handleOrigenChange = (e) => {
    setSelectedOrigenId(e.target.value);
    setSelectedSecuenciaId(NA_VALUE_ID_STRING);
    if (onClear) onClear();
  };

  // --- ¡Función `handleConfirm` CORREGIDA! ---
  const handleConfirm = async () => {
    if (!selectedCicloId || !selectedEtapaId || !selectedMuestraId || !selectedOrigenId || !selectedSecuenciaId) {
      setLocalMessage({ text: 'Todos los campos son obligatorios.', type: 'error' });
      return;
    }

    // Preparamos el objeto con los datos seleccionados
    const confirmedKeys = {
        cicloId: parseInt(selectedCicloId),
        etapaId: parseInt(selectedEtapaId),
        muestraId: parseInt(selectedMuestraId),
        origenId: parseInt(selectedOrigenId),
        secuenciaId: parseInt(selectedSecuenciaId),
        cicloNombre: cicloOptions.find(c => c.value === selectedCicloId)?.label,
        etapaNombre: etapaOptions.find(e => e.value === selectedEtapaId)?.label,
        muestraNombre: muestraOptions.find(m => m.value === selectedMuestraId)?.label,
        origenNombre: origenOptions.find(o => o.value === selectedOrigenId)?.label,
        secuenciaNombre: secuenciaOptions.find(s => s.value === selectedSecuenciaId)?.label,
    };
    
    // --- ¡AQUÍ ESTÁ LA LÓGICA CLAVE! ---
    // Si la prop `skipValidation` es true, simplemente confirmamos y terminamos.
    if (skipValidation) {
      if (onConfirm) onConfirm(confirmedKeys);
      return; // Salimos de la función aquí
    }

    // --- Si `skipValidation` es false, se ejecuta el resto del código (la validación) ---
    setIsLoading(prev => ({ ...prev, validation: true }));
    setLocalMessage({ text: 'Validando combinación...', type: 'info' });

    try {
      // El objeto para validar solo necesita los IDs numéricos
      const keysToValidate = {
          ciclo_id: confirmedKeys.cicloId,
          etapa_id: confirmedKeys.etapaId,
          muestra_id: confirmedKeys.muestraId,
          origen_id: confirmedKeys.origenId,
          secuencia_id: confirmedKeys.secuenciaId,
      };

      const response = await fetch(DATOS_LABORATORIO_GET_BY_KEYS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keysToValidate),
      });

      if (response.status === 404) {
        throw new Error("Combinación no existe en Tabla General. Créala en 'Laboratorio General'.");
      }
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Error de validación: ${response.statusText}`);
      }

      // Si la validación pasa, confirmamos
      setLocalMessage({ text: 'Combinación válida.', type: 'success' });
      if (onConfirm) onConfirm(confirmedKeys);

    } catch (error) {
      setLocalMessage({ text: error.message, type: 'error' });
      if (onClear) onClear();
    } finally {
      setIsLoading(prev => ({ ...prev, validation: false }));
    }
  };

  const anyLoading = Object.values(isLoading).some(Boolean);
  const enableConfirmButton = selectedCicloId && selectedEtapaId && selectedMuestraId && selectedOrigenId && selectedSecuenciaId;

  return (
    <div className="mb-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-indigo-700 flex items-center">
          <FiFilter className="mr-2 h-4 w-4" />
          Seleccionar Identificadores de Catálogo
        </h4>
        <button type="button" onClick={fetchCatalogos} disabled={anyLoading} className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 disabled:opacity-50 text-xs" title="Refrescar listas">
          <FiRefreshCw className={`h-3 w-3 ${anyLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        <div>
          <label htmlFor="isf-cicloSelect" className="block text-xs font-medium text-gray-600 mb-0.5">Ciclo (*):</label>
          <select id="isf-cicloSelect" value={selectedCicloId} onChange={handleCicloChange} disabled={isLoading.ciclos} className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm">
            {cicloOptions.map((opt) => <option key={opt.value || 'ciclo-empty'} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="isf-etapaSelect" className="block text-xs font-medium text-gray-600 mb-0.5">Etapa (*):</label>
          <select id="isf-etapaSelect" value={selectedEtapaId} onChange={handleEtapaChange} disabled={isLoading.etapas || !selectedCicloId} className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm">
            {etapaOptions.map((opt) => <option key={opt.value || 'etapa-empty'} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="isf-muestraSelect" className="block text-xs font-medium text-gray-600 mb-0.5">Muestra (*):</label>
          <select id="isf-muestraSelect" value={selectedMuestraId} onChange={handleMuestraChange} disabled={isLoading.muestras || !selectedEtapaId} className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm">
            {muestraOptions.map((opt) => <option key={opt.value || 'muestra-empty'} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="isf-origenSelect" className="block text-xs font-medium text-gray-600 mb-0.5">Origen (*):</label>
          <select id="isf-origenSelect" value={selectedOrigenId} onChange={handleOrigenChange} disabled={isLoading.origenes || !selectedMuestraId} className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm">
            {origenOptions.map((opt) => <option key={opt.value || 'origen-empty'} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="isf-secuenciaSelect" className="block text-xs font-medium text-gray-600 mb-0.5">Secuencia (*):</label>
          <select id="isf-secuenciaSelect" value={selectedSecuenciaId} onChange={(e) => setSelectedSecuenciaId(e.target.value)} disabled={isLoading.secuencias || !selectedOrigenId} className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm">
            {secuenciaOptions.map((opt) => <option key={opt.value || 'secuencia-empty'} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <button type="button" onClick={handleConfirm} className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 disabled:opacity-60" disabled={!enableConfirmButton || anyLoading}>
          <FiCheckSquare className="inline mr-1.5 h-4 w-4" />
          {isLoading.validation ? 'Validando...' : 'Aplicar Identificadores'}
        </button>
        {localMessage.text && (
          <p className={`text-xs mt-1.5 ${localMessage.type === 'error' ? 'text-red-600' : localMessage.type === 'success' ? 'text-green-600' : 'text-blue-600'}`}>
            {localMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default IdentificadoresSelectForm