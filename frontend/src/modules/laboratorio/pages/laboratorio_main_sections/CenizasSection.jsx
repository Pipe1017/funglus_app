import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FiClipboard, FiFilter, FiInfo, FiLayers, FiList,
  FiPlusSquare, FiRefreshCw, FiSave, FiEdit, FiTrash2, FiXCircle, FiCheckSquare, FiArrowRightCircle, FiCheckCircle
} from 'react-icons/fi'
import IdentificadoresSelectForm from '../../../laboratorio/components/laboratorio/general/IdentificadoresSelectForm'
import { API_BASE_URL } from '../../../core/config/api'

const FASTAPI_BASE_URL = API_BASE_URL
const CICLOS_PROCESAMIENTO_ENDPOINT = `${FASTAPI_BASE_URL}/ciclos-procesamiento`
const REGISTROS_CENIZAS_ENDPOINT = `${FASTAPI_BASE_URL}/registros-cenizas`
const CATALOGO_CICLOS_ENDPOINT = `${FASTAPI_BASE_URL}/catalogos/ciclos`
const DATOS_LABORATORIO_CICLO_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/ciclo`
const TIPO_ANALISIS_CENIZAS = 'cenizas'

const initialRegistroCenizasFormState = {
  peso_crisol_vacio_g: '',
  peso_crisol_mas_muestra_g: '',
  peso_crisol_mas_cenizas_g: ''
}

function CenizasSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estados Principales
  const [ciclosProcesamientoCenizas, setCiclosProcesamientoCenizas] = useState([]);
  const [selectedCicloProcesamientoId, setSelectedCicloProcesamientoId] = useState('');
  const [listaRegistrosCenizas, setListaRegistrosCenizas] = useState([]);
  
  // Estados para "Candidatos" (Mejora UX)
  const [availableCiclos, setAvailableCiclos] = useState([]);
  const [selectedSourceCicloId, setSelectedSourceCicloId] = useState('');
  const [candidateSamples, setCandidateSamples] = useState([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);

  // Estados de Formulario y UI
  const [isLoadingCiclosProc, setIsLoadingCiclosProc] = useState(false);
  const [selectedCatalogoKeys, setSelectedCatalogoKeys] = useState(null);
  const [registroForm, setRegistroForm] = useState(initialRegistroCenizasFormState);
  const [calculatedCenizasPorc, setCalculatedCenizasPorc] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ isLoading: false, error: '', success: '' });
  const [isLoadingRegistros, setIsLoadingRegistros] = useState(false);
  const [errorLoadingRegistros, setErrorLoadingRegistros] = useState('');
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [resyncStatus, setResyncStatus] = useState({ isLoading: false, error: '', success: '' });
  const [highlightParams, setHighlightParams] = useState(null);

  // --- 1. Cargar Listas Iniciales ---
  const fetchCiclosProcesamientoCenizas = useCallback(async () => {
    setIsLoadingCiclosProc(true);
    try {
      const response = await fetch(`${CICLOS_PROCESAMIENTO_ENDPOINT}/${TIPO_ANALISIS_CENIZAS}/?limit=1000`);
      if (!response.ok) throw new Error('No se pudieron cargar los lotes.');
      const data = await response.json();
      setCiclosProcesamientoCenizas(data || []);
    } catch (error) {
      setStatusMessage({ error: error.message, success: '', isLoading: false });
    } finally {
      setIsLoadingCiclosProc(false);
    }
  }, []);

  const fetchAvailableCiclos = useCallback(async () => {
    try {
        const res = await fetch(`${CATALOGO_CICLOS_ENDPOINT}/?limit=100`);
        const data = await res.json();
        setAvailableCiclos(data || []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { 
      fetchCiclosProcesamientoCenizas(); 
      fetchAvailableCiclos();
  }, [fetchCiclosProcesamientoCenizas, fetchAvailableCiclos]);

  // --- 2. Cargar Candidatos (Muestras del Ciclo Seleccionado) ---
  const fetchCandidates = useCallback(async () => {
    if (!selectedSourceCicloId) { setCandidateSamples([]); return; }
    setIsLoadingCandidates(true);
    try {
        const res = await fetch(`${DATOS_LABORATORIO_CICLO_ENDPOINT}/${selectedSourceCicloId}?limit=1000`);
        if (res.ok) {
            setCandidateSamples(await res.json() || []);
        }
    } catch (e) { console.error(e); } 
    finally { setIsLoadingCandidates(false); }
  }, [selectedSourceCicloId]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  // --- 3. Cargar Registros del Lote Actual ---
  const fetchRegistrosCenizasDelLote = useCallback(async () => {
    if (!selectedCicloProcesamientoId) { setListaRegistrosCenizas([]); return; }
    setIsLoadingRegistros(true);
    setErrorLoadingRegistros('');
    try {
      const response = await fetch(`${REGISTROS_CENIZAS_ENDPOINT}/lote/${selectedCicloProcesamientoId}/?limit=1000`);
      if (!response.ok) throw new Error('No se pudieron cargar los registros.');
      const data = await response.json();
      setListaRegistrosCenizas(data || []);
    } catch (error) { setErrorLoadingRegistros(error.message); } 
    finally { setIsLoadingRegistros(false); }
  }, [selectedCicloProcesamientoId]);

  useEffect(() => { fetchRegistrosCenizasDelLote(); }, [selectedCicloProcesamientoId, fetchRegistrosCenizasDelLote]);

  // --- 4. Lógica de URL y Resaltado ---
  useEffect(() => {
    const cicloParam = searchParams.get('ciclo');
    const etapaParam = searchParams.get('etapa');
    const muestraParam = searchParams.get('muestra');
    const origenParam = searchParams.get('origen');

    if (cicloParam && ciclosProcesamientoCenizas.length > 0) {
      if (etapaParam && muestraParam && origenParam) {
        setHighlightParams({
            ciclo_id: parseInt(cicloParam), etapa_id: parseInt(etapaParam),
            muestra_id: parseInt(muestraParam), origen_id: parseInt(origenParam)
        });
      }
      
      // Auto-seleccionar ciclo fuente para ver candidatos
      setSelectedSourceCicloId(cicloParam);

      // Buscar Lote asociado
      fetch(`${REGISTROS_CENIZAS_ENDPOINT}/?ciclo_catalogo_id=${cicloParam}&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0 && data[0].ciclo_procesamiento_id) {
            setSelectedCicloProcesamientoId(data[0].ciclo_procesamiento_id.toString());
          }
        })
        .catch(err => console.error('Error buscando lote:', err));
      
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, ciclosProcesamientoCenizas]);
  
  // Scroll al registro resaltado
  useEffect(() => {
    if (highlightParams && listaRegistrosCenizas.length > 0) {
      const match = listaRegistrosCenizas.find(r => 
        r.ciclo_catalogo_id === highlightParams.ciclo_id &&
        r.etapa_catalogo_id === highlightParams.etapa_id &&
        r.muestra_catalogo_id === highlightParams.muestra_id &&
        r.origen_catalogo_id === highlightParams.origen_id
      );
      if (match) {
        setTimeout(() => {
          document.getElementById(`registro-ceniza-${match.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [listaRegistrosCenizas, highlightParams]);

  // --- 5. Helpers y Handlers ---
  const handleCatalogoKeysConfirm = useCallback((keys) => setSelectedCatalogoKeys(keys), []);
  
  const resetFormAndExitEditing = () => {
    setRegistroForm(initialRegistroCenizasFormState);
    setEditingRecordId(null);
    setSelectedCatalogoKeys(null);
    setStatusMessage({ isLoading: false, error: '', success: '' });
  };

  const handleSelectCandidate = (row) => {
      // Convertir fila de Datos Generales a "Keys" para el formulario
      const keys = {
          cicloId: row.ciclo_id,
          etapaId: row.etapa_id,
          muestraId: row.muestra_id,
          origenId: row.origen_id,
          secuenciaId: row.secuencia_id,
          // Nombres para mostrar (opcional, IdentificadoresSelectForm podría necesitarlos si se modificara para mostrar labels)
      };
      setSelectedCatalogoKeys(keys);
      setRegistroForm(initialRegistroCenizasFormState);
      setEditingRecordId(null);
      
      // Scroll suave al formulario
      window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const checkIsAnalyzed = (row) => {
      // Verifica si la muestra candidata ya está en la lista de registros del lote actual
      return listaRegistrosCenizas.some(r => 
          r.ciclo_catalogo_id === row.ciclo_id &&
          r.etapa_catalogo_id === row.etapa_id &&
          r.muestra_catalogo_id === row.muestra_id &&
          r.origen_catalogo_id === row.origen_id &&
          r.secuencia_catalogo_id === row.secuencia_id
      );
  };

  const recalcularCenizasPorc = useCallback(() => {
    const a = parseFloat(registroForm.peso_crisol_vacio_g);
    const b = parseFloat(registroForm.peso_crisol_mas_muestra_g);
    const c = parseFloat(registroForm.peso_crisol_mas_cenizas_g);
    let cenizasPorc = null;
    if (!isNaN(a) && !isNaN(b) && !isNaN(c) && (b - a) !== 0) {
      cenizasPorc = ((c - a) / (b - a)) * 100;
    }
    setCalculatedCenizasPorc(cenizasPorc);
  }, [registroForm]);

  useEffect(() => { recalcularCenizasPorc(); }, [recalcularCenizasPorc]);

  const handleRegistroCenizasFormChange = (e) => setRegistroForm({ ...registroForm, [e.target.name]: e.target.value });

  const handleEdit = useCallback((record) => {
    setEditingRecordId(record.id);
    setRegistroForm({
      peso_crisol_vacio_g: record.peso_crisol_vacio_g ?? '',
      peso_crisol_mas_muestra_g: record.peso_crisol_mas_muestra_g ?? '',
      peso_crisol_mas_cenizas_g: record.peso_crisol_mas_cenizas_g ?? '',
    });
    setSelectedCatalogoKeys({
      cicloId: record.ciclo_catalogo_id,
      etapaId: record.etapa_catalogo_id,
      muestraId: record.muestra_catalogo_id,
      origenId: record.origen_catalogo_id,
      secuenciaId: record.secuencia_catalogo_id,
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }, []);

  const handleDelete = useCallback(async (recordId) => {
    if (!window.confirm(`¿Seguro que quieres borrar el registro con ID: ${recordId}?`)) return;
    setStatusMessage({ isLoading: true, error: '', success: '' });
    try {
      const response = await fetch(`${REGISTROS_CENIZAS_ENDPOINT}/${recordId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al borrar');
      setStatusMessage({ isLoading: false, success: `Borrado exitoso.`, error: '' });
      fetchRegistrosCenizasDelLote();
    } catch (error) {
      setStatusMessage({ isLoading: false, error: `Error: ${error.message}`, success: '' });
    }
  }, [fetchRegistrosCenizasDelLote]);

  const handleSaveRegistroCenizas = async (e) => {
    e.preventDefault();
    setStatusMessage({ isLoading: true, error: '', success: '' });
    const isEditing = editingRecordId !== null;
    
    const payload = {
      peso_crisol_vacio_g: parseFloat(registroForm.peso_crisol_vacio_g),
      peso_crisol_mas_muestra_g: parseFloat(registroForm.peso_crisol_mas_muestra_g),
      peso_crisol_mas_cenizas_g: parseFloat(registroForm.peso_crisol_mas_cenizas_g),
    };

    try {
      let url = isEditing ? `${REGISTROS_CENIZAS_ENDPOINT}/${editingRecordId}` : `${REGISTROS_CENIZAS_ENDPOINT}/`;
      let method = isEditing ? 'PUT' : 'POST';
      
      if (!isEditing) {
          Object.assign(payload, {
            ciclo_procesamiento_id: parseInt(selectedCicloProcesamientoId),
            ciclo_catalogo_id: selectedCatalogoKeys.cicloId,
            etapa_catalogo_id: selectedCatalogoKeys.etapaId,
            muestra_catalogo_id: selectedCatalogoKeys.muestraId,
            origen_catalogo_id: selectedCatalogoKeys.origenId,
            secuencia_catalogo_id: selectedCatalogoKeys.secuenciaId,
          });
      }

      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error((await response.json()).detail || 'Error al guardar');
      
      const savedData = await response.json();
      setStatusMessage({ isLoading: false, success: `Guardado exitoso (ID: ${savedData.id}).`, error: '' });
      resetFormAndExitEditing();
      fetchRegistrosCenizasDelLote(); // Actualiza la tabla de abajo
    } catch (error) {
      setStatusMessage({ isLoading: false, error: `Error: ${error.message}`, success: '' });
    } finally {
      setTimeout(() => setStatusMessage(prev => ({...prev, success: '', error: ''})), 3000);
    }
  };
  
  const handleResync = useCallback(async () => {
    if (!selectedCicloProcesamientoId) return;
    setResyncStatus({ isLoading: true, error: '', success: '' });
    try {
      const response = await fetch(`${REGISTROS_CENIZAS_ENDPOINT}/acciones/resincronizar-lote/${selectedCicloProcesamientoId}`, { method: 'POST' });
      const result = await response.json();
      setResyncStatus({ isLoading: false, success: result.message, error: '' });
    } catch (error) {
      setResyncStatus({ isLoading: false, error: `Error: ${error.message}`, success: '' });
    }
  }, [selectedCicloProcesamientoId]);

  return (
    <div className="space-y-6 p-1">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <FiClipboard className="mr-3 text-orange-600" size={24} />
        Análisis de Cenizas por Lote
      </h2>

      {/* 1. SELECCIÓN DEL LOTE ACTIVO */}
      <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-md font-semibold text-gray-600">
            <FiLayers className="inline mr-2 mb-1" /> 1. Lote de Procesamiento Activo:
          </label>
          <button onClick={fetchCiclosProcesamientoCenizas} className="p-1 text-gray-500 hover:text-blue-600"><FiRefreshCw /></button>
        </div>
        <select
            value={selectedCicloProcesamientoId}
            onChange={(e) => {
              setSelectedCicloProcesamientoId(e.target.value);
              setHighlightParams(null);
              resetFormAndExitEditing();
            }}
            className="mt-1 block w-full lg:w-1/2 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">-- Seleccione un Lote de Cenizas --</option>
            {ciclosProcesamientoCenizas.map((cp) => (
              <option key={cp.id} value={cp.id}>
                {`${cp.identificador_lote} (${new Date(cp.fecha_hora_lote).toLocaleDateString()})`}
              </option>
            ))}
        </select>
      </div>

      {selectedCicloProcesamientoId && (
        <>
            {/* 2. NUEVO: SELECTOR DE CANDIDATOS (Reemplaza la selección manual engorrosa) */}
            <div className="p-4 bg-blue-50/50 rounded-lg shadow-sm border border-blue-200">
                <h3 className="text-md font-bold text-blue-800 mb-3 flex items-center">
                    <FiList className="mr-2" /> 2. Muestras Disponibles para Análisis
                </h3>
                
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-full md:w-1/3">
                        <label className="text-xs font-bold text-gray-500 uppercase">Filtrar por Ciclo de Origen:</label>
                        <select 
                            value={selectedSourceCicloId} 
                            onChange={(e) => setSelectedSourceCicloId(e.target.value)}
                            className="w-full text-sm border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">-- Ver muestras de... --</option>
                            {availableCiclos.map(c => <option key={c.id} value={c.id}>{c.nombre_ciclo}</option>)}
                        </select>
                    </div>
                    {candidateSamples.length > 0 && (
                        <div className="text-xs text-gray-500 self-end mb-2">
                            Mostrando {candidateSamples.length} muestras totales en este ciclo.
                        </div>
                    )}
                </div>

                {/* Tabla de Candidatos */}
                {selectedSourceCicloId && (
                    <div className="max-h-60 overflow-y-auto bg-white rounded border border-gray-200">
                        <table className="min-w-full text-xs">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    <th className="px-3 py-2 text-left">Etapa</th>
                                    <th className="px-3 py-2 text-left">Muestra</th>
                                    <th className="px-3 py-2 text-left">Origen</th>
                                    <th className="px-3 py-2 text-center">Estado</th>
                                    <th className="px-3 py-2 text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {candidateSamples.map(row => {
                                    const analyzed = checkIsAnalyzed(row);
                                    return (
                                        <tr key={row.id} className={analyzed ? 'bg-green-50/50' : 'hover:bg-blue-50'}>
                                            <td className="px-3 py-1.5">{row.etapa_ref?.nombre}</td>
                                            <td className="px-3 py-1.5 font-medium">{row.muestra_ref?.nombre}</td>
                                            <td className="px-3 py-1.5">{row.origen_ref?.nombre}</td>
                                            <td className="px-3 py-1.5 text-center">
                                                {analyzed ? 
                                                    <span className="text-green-600 flex justify-center items-center gap-1"><FiCheckCircle/> Listo</span> : 
                                                    <span className="text-gray-400">Pendiente</span>
                                                }
                                            </td>
                                            <td className="px-3 py-1.5 text-center">
                                                {!analyzed ? (
                                                    <button 
                                                        onClick={() => handleSelectCandidate(row)}
                                                        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 mx-auto shadow-sm"
                                                    >
                                                        Analizar <FiArrowRightCircle/>
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {candidateSamples.length === 0 && <div className="p-4 text-center text-gray-400">No hay muestras en este ciclo.</div>}
                    </div>
                )}
            </div>

            {/* 3. FORMULARIO DE INGRESO (Se activa al seleccionar arriba) */}
            {(selectedCatalogoKeys || editingRecordId) && (
                <div className="p-4 bg-white rounded-lg shadow border-2 border-blue-500 mt-4 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-md font-bold text-gray-800 mb-3 border-b pb-2 flex justify-between">
                        <span>
                            <FiPlusSquare className="inline mr-2 mb-1" />
                            {editingRecordId ? `Editando ID: ${editingRecordId}` : '3. Ingresar Resultados de Análisis'}
                        </span>
                        {/* Muestra Contexto Seleccionado */}
                        {selectedCatalogoKeys && (
                           <span className="text-xs font-normal bg-gray-100 px-2 py-1 rounded text-gray-600">
                               Muestra seleccionada (IDs): {selectedCatalogoKeys.etapaId} - {selectedCatalogoKeys.muestraId} - {selectedCatalogoKeys.origenId}
                           </span>
                        )}
                    </h3>
                    
                    {/* Formulario opcional manual (oculto por defecto, pero funcional si se requiere) */}
                    <div className="hidden">
                        <IdentificadoresSelectForm
                            onConfirm={handleCatalogoKeysConfirm}
                            value={selectedCatalogoKeys}
                            formKey={`${selectedCicloProcesamientoId}-${editingRecordId}`}
                        />
                    </div>

                    <form onSubmit={handleSaveRegistroCenizas} className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">P. Crisol Vacío (a) [g]:</label>
                            <input type="number" name="peso_crisol_vacio_g" value={registroForm.peso_crisol_vacio_g} onChange={handleRegistroCenizasFormChange} step="any" required autoFocus className="mt-1 w-full input-std border-gray-300 rounded" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">P. Crisol+Muestra (b) [g]:</label>
                            <input type="number" name="peso_crisol_mas_muestra_g" value={registroForm.peso_crisol_mas_muestra_g} onChange={handleRegistroCenizasFormChange} step="any" required className="mt-1 w-full input-std border-gray-300 rounded" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">P. Crisol+Cenizas (c) [g]:</label>
                            <input type="number" name="peso_crisol_mas_cenizas_g" value={registroForm.peso_crisol_mas_cenizas_g} onChange={handleRegistroCenizasFormChange} step="any" required className="mt-1 w-full input-std border-gray-300 rounded" />
                        </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm font-semibold bg-gray-50 px-3 py-1 rounded border">
                                Resultado: <span className="text-orange-600">{calculatedCenizasPorc?.toFixed(2) ?? '-'} %</span>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={resetFormAndExitEditing} className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancelar</button>
                                <button type="submit" disabled={statusMessage.isLoading} className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 shadow-md">
                                    {statusMessage.isLoading ? 'Guardando...' : 'GUARDAR RESULTADO'}
                                </button>
                            </div>
                        </div>
                        {statusMessage.error && <p className="text-xs text-red-600 mt-2 text-right">{statusMessage.error}</p>}
                    </form>
                </div>
            )}
        </>
      )}

      {/* 4. TABLA DE REGISTROS GUARDADOS (Igual que antes) */}
      {selectedCicloProcesamientoId && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow border">
          <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2"><FiCheckSquare className="inline mr-2" /> 4. Registros Completados en este Lote</h3>
          <div className="overflow-x-auto text-xs">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                    <th className="px-3 py-2 text-left">Ciclo</th><th className="px-3 py-2 text-left">Etapa</th>
                    <th className="px-3 py-2 text-left">Muestra</th><th className="px-3 py-2 text-left">Origen</th>
                    <th className="px-3 py-2 text-right">Cenizas %</th><th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {listaRegistrosCenizas.map(registro => {
                  const isHighlighted = highlightParams && 
                      registro.ciclo_catalogo_id === highlightParams.ciclo_id &&
                      registro.etapa_catalogo_id === highlightParams.etapa_id &&
                      registro.muestra_catalogo_id === highlightParams.muestra_id &&
                      registro.origen_catalogo_id === highlightParams.origen_id;
                  return (
                    <tr key={registro.id} id={`registro-ceniza-${registro.id}`} className={isHighlighted ? 'bg-yellow-100 border-l-4 border-l-yellow-500' : ''}>
                      <td className="px-3 py-2">{registro.ciclo_catalogo_ref?.nombre_ciclo}</td>
                      <td className="px-3 py-2">{registro.etapa_catalogo_ref?.nombre}</td>
                      <td className="px-3 py-2 font-semibold">{registro.muestra_catalogo_ref?.nombre}</td>
                      <td className="px-3 py-2">{registro.origen_catalogo_ref?.nombre}</td>
                      <td className="px-3 py-2 text-right font-bold text-orange-600">{registro.calc_cenizas_porc?.toFixed(2)}</td>
                      <td className="px-3 py-2 text-center flex justify-center gap-2">
                          <button onClick={() => handleEdit(registro)} className="text-blue-600"><FiEdit/></button>
                          <button onClick={() => handleDelete(registro.id)} className="text-red-600"><FiTrash2/></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {listaRegistrosCenizas.length === 0 && <p className="text-center p-4 text-gray-400">Aún no hay registros.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default CenizasSection;