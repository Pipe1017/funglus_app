import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiActivity, FiCheckSquare, FiFilter, FiInfo, FiLayers,
  FiList, FiPlusSquare, FiRefreshCw, FiSave, FiTrendingUp,
  FiEdit, FiTrash2, FiXCircle, FiClipboard, FiArrowRightCircle, FiCheckCircle
} from 'react-icons/fi';
import IdentificadoresSelectForm from '../../components/laboratorio/general/IdentificadoresSelectForm';
import { API_BASE_URL } from '../../../core/config/api';

const FASTAPI_BASE_URL = API_BASE_URL;
const CICLOS_PROCESAMIENTO_ENDPOINT = `${FASTAPI_BASE_URL}/ciclos-procesamiento`;
const REGISTROS_NITROGENO_ENDPOINT = `${FASTAPI_BASE_URL}/registros-nitrogeno`;
const DATOS_LABORATORIO_GET_BY_KEYS_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/get_by_keys`;
const CATALOGO_CICLOS_ENDPOINT = `${FASTAPI_BASE_URL}/catalogos/ciclos`;
const DATOS_LABORATORIO_CICLO_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/ciclo`;
const TIPO_ANALISIS_NITROGENO = 'nitrogeno';

const initialRegistroFormState = {
  peso_muestra_n_g: '',
  n_hcl_normalidad: '',
  vol_hcl_gastado_cm3: ''
};

export default function NitrogenoSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estados Principales
  const [ciclosProcesamientoNitrogeno, setCiclosProcesamientoNitrogeno] = useState([]);
  const [selectedCicloProcesamientoId, setSelectedCicloProcesamientoId] = useState('');
  const [listaRegistros, setListaRegistros] = useState([]);

  // Estados para "Candidatos" (Selector Visual)
  const [availableCiclos, setAvailableCiclos] = useState([]);
  const [selectedSourceCicloId, setSelectedSourceCicloId] = useState('');
  const [candidateSamples, setCandidateSamples] = useState([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);

  // Estados de Formulario y Lógica
  const [isLoadingCiclosProc, setIsLoadingCiclosProc] = useState(false);
  const [selectedCatalogoKeys, setSelectedCatalogoKeys] = useState(null);
  const [registroForm, setRegistroForm] = useState(initialRegistroFormState);
  
  // Contexto para cálculos (Humedad)
  const [humedadContextual, setHumedadContextual] = useState(null);
  const [isFetchingHumedad, setIsFetchingHumedad] = useState(false);
  const [humedadMessage, setHumedadMessage] = useState('');
  
  const [calculatedValues, setCalculatedValues] = useState({});
  const [statusMessage, setStatusMessage] = useState({ isLoading: false, error: '', success: '' });
  const [isLoadingRegistros, setIsLoadingRegistros] = useState(false);
  const [averagingStatus, setAveragingStatus] = useState({ isLoading: false, error: '', success: '', details: [] });
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [highlightParams, setHighlightParams] = useState(null);

  // --- 1. Cargar Listas Iniciales ---
  const fetchCiclosProcesamiento = useCallback(async () => {
    setIsLoadingCiclosProc(true);
    try {
      const response = await fetch(`${CICLOS_PROCESAMIENTO_ENDPOINT}/${TIPO_ANALISIS_NITROGENO}/?limit=100`);
      if (response.ok) {
        setCiclosProcesamientoNitrogeno(await response.json());
      }
    } catch (error) { console.error("Error ciclos:", error); } 
    finally { setIsLoadingCiclosProc(false); }
  }, []);

  const fetchAvailableCiclos = useCallback(async () => {
    try {
        const res = await fetch(`${CATALOGO_CICLOS_ENDPOINT}/?limit=100`);
        setAvailableCiclos(await res.json() || []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { 
      fetchCiclosProcesamiento(); 
      fetchAvailableCiclos();
  }, [fetchCiclosProcesamiento, fetchAvailableCiclos]);

  // --- 2. Cargar Candidatos (Muestras del Ciclo Fuente) ---
  const fetchCandidates = useCallback(async () => {
    if (!selectedSourceCicloId) { setCandidateSamples([]); return; }
    setIsLoadingCandidates(true);
    try {
        const res = await fetch(`${DATOS_LABORATORIO_CICLO_ENDPOINT}/${selectedSourceCicloId}?limit=1000`);
        if (res.ok) setCandidateSamples(await res.json() || []);
    } catch (e) { console.error(e); } 
    finally { setIsLoadingCandidates(false); }
  }, [selectedSourceCicloId]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  // --- 3. Lógica de URL, Resaltado y Selección Automática ---
  useEffect(() => {
    const cicloParam = searchParams.get('ciclo');
    const etapaParam = searchParams.get('etapa');
    const muestraParam = searchParams.get('muestra');
    const origenParam = searchParams.get('origen');

    if (cicloParam && ciclosProcesamientoNitrogeno.length > 0) {
      if (etapaParam && muestraParam && origenParam) {
        setHighlightParams({
            ciclo_id: parseInt(cicloParam), etapa_id: parseInt(etapaParam),
            muestra_id: parseInt(muestraParam), origen_id: parseInt(origenParam)
        });
      }

      // Auto-seleccionar ciclo fuente para ver tabla de candidatos
      setSelectedSourceCicloId(cicloParam);

      // Buscar Lote asociado
      fetch(`${REGISTROS_NITROGENO_ENDPOINT}/?ciclo_catalogo_id=${cicloParam}&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0 && data[0].ciclo_procesamiento_id) {
            setSelectedCicloProcesamientoId(data[0].ciclo_procesamiento_id.toString());
          }
        })
        .catch(err => console.error('Error buscando lote:', err));
      
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, ciclosProcesamientoNitrogeno]);

  // Scroll al registro resaltado
  useEffect(() => {
    if (highlightParams && listaRegistros.length > 0) {
      const match = listaRegistros.find(r => 
        r.ciclo_catalogo_id === highlightParams.ciclo_id &&
        r.etapa_catalogo_id === highlightParams.etapa_id &&
        r.muestra_catalogo_id === highlightParams.muestra_id &&
        r.origen_catalogo_id === highlightParams.origen_id
      );
      if (match) {
        setTimeout(() => {
          document.getElementById(`registro-nitro-${match.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [listaRegistros, highlightParams]);

  // --- 4. Cargar Registros del Lote Actual ---
  const fetchRegistros = useCallback(async (cicloId) => {
    if (!cicloId) { setListaRegistros([]); return; }
    setIsLoadingRegistros(true);
    try {
      const response = await fetch(`${REGISTROS_NITROGENO_ENDPOINT}/lote/${cicloId}/`);
      if (response.ok) setListaRegistros(await response.json());
      else setListaRegistros([]);
    } catch (error) { console.error("Error registros:", error); } 
    finally { setIsLoadingRegistros(false); }
  }, []);

  useEffect(() => { fetchRegistros(selectedCicloProcesamientoId); }, [selectedCicloProcesamientoId, fetchRegistros]);

  // --- 5. Helpers y Handlers ---
  const resetFormAndExitEditing = () => {
    setRegistroForm(initialRegistroFormState);
    setEditingRecordId(null);
    setSelectedCatalogoKeys(null); 
    setCalculatedValues({});
    setStatusMessage({ isLoading: false, error: '', success: '' });
    setHumedadMessage('');
  };

  const handleCatalogoKeysConfirm = (keys) => {
    setSelectedCatalogoKeys(keys);
    fetchHumedadReferencia(keys);
  };

  // Función clave: Trae la humedad para calcular N. Base Seca
  const fetchHumedadReferencia = async (keys) => {
    setIsFetchingHumedad(true);
    setHumedadMessage('');
    setHumedadContextual(null);
    try {
        const payload = {
            ciclo_id: keys.cicloId, etapa_id: keys.etapaId,
            muestra_id: keys.muestraId, origen_id: keys.origenId, secuencia_id: keys.secuenciaId
        };
        const response = await fetch(DATOS_LABORATORIO_GET_BY_KEYS_ENDPOINT, {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
        });
        if (response.ok) {
            const data = await response.json();
            if (data.humedad_prom_porc) {
                setHumedadContextual(data.humedad_prom_porc);
                setHumedadMessage(`Humedad detectada: ${data.humedad_prom_porc.toFixed(2)}%`);
            } else setHumedadMessage('Humedad: No definida en Matriz General');
        } else setHumedadMessage('No hay datos en Matriz General');
    } catch (error) { setHumedadMessage('Error buscando H%'); } 
    finally { setIsFetchingHumedad(false); }
  };

  // Selector visual de candidatos
  const handleSelectCandidate = (row) => {
      const keys = {
          cicloId: row.ciclo_id,
          etapaId: row.etapa_id,
          muestraId: row.muestra_id,
          origenId: row.origen_id,
          secuenciaId: row.secuencia_id,
      };
      setSelectedCatalogoKeys(keys);
      setRegistroForm(initialRegistroFormState);
      setEditingRecordId(null);
      
      // Importante: Buscar humedad automáticamente
      fetchHumedadReferencia(keys);
      
      window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const checkIsAnalyzed = (row) => {
      return listaRegistros.some(r => 
          r.ciclo_catalogo_id === row.ciclo_id &&
          r.etapa_catalogo_id === row.etapa_id &&
          r.muestra_catalogo_id === row.muestra_id &&
          r.origen_catalogo_id === row.origen_id &&
          r.secuencia_catalogo_id === row.secuencia_id
      );
  };

  const handleRegistroFormChange = (e) => {
    setRegistroForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Calculadora en tiempo real
  useEffect(() => {
    const p = parseFloat(registroForm.peso_muestra_n_g);
    const n = parseFloat(registroForm.n_hcl_normalidad);
    const v = parseFloat(registroForm.vol_hcl_gastado_cm3);
    
    if (p > 0 && n > 0 && v >= 0) {
        const nitrogenoTotal = (v * n * 0.014 * 100) / p;
        let nitrogenoSeco = null;
        let pesoSeco = null;
        if (humedadContextual !== null) {
             pesoSeco = p * (1 - (humedadContextual / 100));
             if (pesoSeco > 0) nitrogenoSeco = (v * n * 0.014 * 100) / pesoSeco;
        }
        setCalculatedValues({
            nitrogeno_organico_total_porc: nitrogenoTotal,
            peso_seco_g: pesoSeco,
            nitrogeno_base_seca_porc: nitrogenoSeco
        });
    } else setCalculatedValues({});
  }, [registroForm, humedadContextual]);

  // --- 6. Guardar ---
  const handleSaveRegistro = async (e) => {
    e.preventDefault();
    if (!selectedCicloProcesamientoId) return;
    setStatusMessage({ isLoading: true, error: '', success: '' });

    try {
        const payload = {
            peso_muestra_n_g: parseFloat(registroForm.peso_muestra_n_g),
            n_hcl_normalidad: parseFloat(registroForm.n_hcl_normalidad),
            vol_hcl_gastado_cm3: parseFloat(registroForm.vol_hcl_gastado_cm3),
            ...(editingRecordId ? {} : {
                ciclo_procesamiento_id: parseInt(selectedCicloProcesamientoId),
                ciclo_catalogo_id: selectedCatalogoKeys.cicloId,
                etapa_catalogo_id: selectedCatalogoKeys.etapaId,
                muestra_catalogo_id: selectedCatalogoKeys.muestraId,
                origen_catalogo_id: selectedCatalogoKeys.origenId,
                secuencia_catalogo_id: selectedCatalogoKeys.secuenciaId
            })
        };
        const url = editingRecordId ? `${REGISTROS_NITROGENO_ENDPOINT}/${editingRecordId}/` : `${REGISTROS_NITROGENO_ENDPOINT}/`;
        const method = editingRecordId ? 'PUT' : 'POST';

        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error((await response.json()).detail || 'Error al guardar.');

        setStatusMessage({ isLoading: false, success: 'Registro guardado correctamente.', error: '' });
        fetchRegistros(selectedCicloProcesamientoId);
        
        if (editingRecordId) setTimeout(resetFormAndExitEditing, 500);
        else {
            setRegistroForm(initialRegistroFormState);
            setCalculatedValues({});
        }
    } catch (error) { setStatusMessage({ isLoading: false, error: error.message, success: '' }); }
    finally { setTimeout(() => setStatusMessage(prev => ({...prev, success: '', error: ''})), 3000); }
  };

  // --- 7. Actions de Tabla ---
  const handleEditRegistro = (registro) => {
    setEditingRecordId(registro.id);
    setRegistroForm({
        peso_muestra_n_g: registro.peso_muestra_n_g,
        n_hcl_normalidad: registro.n_hcl_normalidad,
        vol_hcl_gastado_cm3: registro.vol_hcl_gastado_cm3
    });
    // Al editar, también buscamos la humedad por si acaso ha cambiado
    fetchHumedadReferencia({
        cicloId: registro.ciclo_catalogo_id, etapaId: registro.etapa_catalogo_id,
        muestraId: registro.muestra_catalogo_id, origenId: registro.origen_catalogo_id,
        secuenciaId: registro.secuencia_catalogo_id
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteRegistro = async (id) => {
    if (!window.confirm('¿Borrar registro?')) return;
    try {
        await fetch(`${REGISTROS_NITROGENO_ENDPOINT}/${id}/`, { method: 'DELETE' });
        fetchRegistros(selectedCicloProcesamientoId);
    } catch (error) { console.error(error); }
  };

  // --- 8. Promediar y Cerrar Lote ---
  const handlePromediarYActualizarGeneral = async () => {
    if (!listaRegistros.length) return;
    setAveragingStatus({ isLoading: true, error: '', success: '' });
    try {
        const combinaciones = [];
        const seen = new Set();
        
        listaRegistros.forEach(r => {
            const key = `${r.ciclo_catalogo_id}-${r.etapa_catalogo_id}-${r.muestra_catalogo_id}-${r.origen_catalogo_id}-${r.secuencia_catalogo_id}`;
            if (!seen.has(key)) {
                seen.add(key);
                combinaciones.push({
                    ciclo_catalogo_id: r.ciclo_catalogo_id,
                    etapa_catalogo_id: r.etapa_catalogo_id,
                    muestra_catalogo_id: r.muestra_catalogo_id,
                    origen_catalogo_id: r.origen_catalogo_id,
                    secuencia_catalogo_id: r.secuencia_catalogo_id,
                    ciclo_procesamiento_id: parseInt(selectedCicloProcesamientoId)
                });
            }
        });

        let updatedCount = 0;
        for (const combo of combinaciones) {
            const res = await fetch(`${REGISTROS_NITROGENO_ENDPOINT}/acciones/promediar-y-actualizar-general/`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(combo)
            });
            if (res.ok) updatedCount++;
        }
        setAveragingStatus({ isLoading: false, success: `Lote procesado. ${updatedCount} promedios actualizados en Datos Generales.`, error: '' });
    } catch (error) { setAveragingStatus({ isLoading: false, error: error.message, success: '' }); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Encabezado */}
      <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
        <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
          <FiActivity size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Gestión de Nitrógeno</h2>
          <p className="text-sm text-gray-500">Registro y análisis de contenido de nitrógeno.</p>
        </div>
      </div>

      {/* 1. SELECCIÓN DE LOTE */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
          <FiLayers /> 1. Seleccionar Lote de Procesamiento Activo
        </h3>
        <div className="flex items-center gap-2">
          <select 
            value={selectedCicloProcesamientoId} 
            onChange={(e) => { 
                setSelectedCicloProcesamientoId(e.target.value); 
                setHighlightParams(null);
                resetFormAndExitEditing(); 
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="">-- Seleccionar Lote --</option>
            {ciclosProcesamientoNitrogeno.map(c => (
              <option key={c.id} value={c.id}>{c.identificador_lote} ({new Date(c.fecha_hora_lote).toLocaleDateString()})</option>
            ))}
          </select>
          <button onClick={fetchCiclosProcesamiento} className="p-2 text-gray-400 hover:text-brand-600 bg-gray-50 border border-gray-200 rounded-lg"><FiRefreshCw size={18}/></button>
        </div>
      </section>

      {selectedCicloProcesamientoId && (
        <>
           {/* 2. NUEVO: SELECTOR DE CANDIDATOS */}
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
                    {candidateSamples.length > 0 && <div className="text-xs text-gray-500 self-end mb-2">Mostrando {candidateSamples.length} muestras.</div>}
                </div>

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
                                                    <button onClick={() => handleSelectCandidate(row)} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 mx-auto shadow-sm">
                                                        Analizar <FiArrowRightCircle/>
                                                    </button>
                                                ) : <span className="text-gray-300">-</span>}
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

          {/* 3. FORMULARIO DE REGISTRO */}
          {(selectedCatalogoKeys || editingRecordId) && (
            <section className="bg-white rounded-xl border-2 border-blue-500 p-5 shadow-lg animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex justify-between items-center">
                    <span><FiPlusSquare className="inline mr-2" /> {editingRecordId ? 'Editando Registro' : '3. Ingresar Resultados de Nitrógeno'}</span>
                    {selectedCatalogoKeys && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded normal-case">ID Muestra: {selectedCatalogoKeys.muestraId}</span>}
                </h3>

                {/* Formulario manual (Oculto pero funcional) */}
                <div className="hidden">
                    <IdentificadoresSelectForm
                        onConfirm={handleCatalogoKeysConfirm}
                        value={selectedCatalogoKeys}
                        formKey={`${selectedCicloProcesamientoId}-${editingRecordId}`} 
                    />
                </div>
                
                {/* Indicador de Humedad Contextual */}
                <div className="mb-4 flex justify-end">
                     {isFetchingHumedad ? <span className="text-xs text-gray-400">Buscando humedad...</span> : 
                      humedadMessage && <span className={`text-xs px-2 py-1 rounded font-medium ${humedadContextual ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{humedadMessage}</span>
                     }
                </div>

                <form onSubmit={handleSaveRegistro}>
                    {/* Inputs en Grid de 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div className="relative">
                            <label className="text-[10px] text-gray-500 absolute -top-1.5 left-2 bg-white px-1 font-bold">Peso Muestra (g)</label>
                            <input type="number" step="any" name="peso_muestra_n_g" value={registroForm.peso_muestra_n_g} onChange={handleRegistroFormChange} required autoFocus
                                className="w-full text-sm border-gray-300 rounded focus:border-brand-500 focus:ring-0 pt-2 pb-1" placeholder="0.000" />
                        </div>
                        <div className="relative">
                            <label className="text-[10px] text-gray-500 absolute -top-1.5 left-2 bg-white px-1 font-bold">N HCL (Normalidad)</label>
                            <input type="number" step="any" name="n_hcl_normalidad" value={registroForm.n_hcl_normalidad} onChange={handleRegistroFormChange} required 
                                className="w-full text-sm border-gray-300 rounded focus:border-brand-500 focus:ring-0 pt-2 pb-1" placeholder="0.000" />
                        </div>
                        <div className="relative">
                            <label className="text-[10px] text-gray-500 absolute -top-1.5 left-2 bg-white px-1 font-bold">Volumen Gastado (cm³)</label>
                            <input type="number" step="any" name="vol_hcl_gastado_cm3" value={registroForm.vol_hcl_gastado_cm3} onChange={handleRegistroFormChange} required 
                                className="w-full text-sm border-gray-300 rounded focus:border-brand-500 focus:ring-0 pt-2 pb-1" placeholder="0.000" />
                        </div>
                    </div>

                    {/* Footer del Form: Cálculos y Botones */}
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50 p-2 rounded border border-gray-100">
                        <div className="flex gap-4 text-xs">
                            {calculatedValues.nitrogeno_organico_total_porc > 0 && (
                                <>
                                    <span className="text-gray-600">N Total: <b className="text-blue-700">{calculatedValues.nitrogeno_organico_total_porc.toFixed(3)}%</b></span>
                                    {calculatedValues.nitrogeno_base_seca_porc && <span className="text-gray-600 border-l pl-3 ml-1">N Base Seca: <b className="text-green-700">{calculatedValues.nitrogeno_base_seca_porc.toFixed(3)}%</b></span>}
                                </>
                            )}
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <button type="button" onClick={resetFormAndExitEditing} className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded">Cancelar</button>
                            <button type="submit" disabled={statusMessage.isLoading} className="flex-1 sm:flex-none px-6 py-1.5 bg-brand-600 text-white text-xs font-bold rounded hover:bg-brand-700 shadow-sm disabled:opacity-50">
                                {statusMessage.isLoading ? 'GUARDANDO...' : (editingRecordId ? 'ACTUALIZAR' : 'GUARDAR RESULTADO')}
                            </button>
                        </div>
                    </div>
                    {statusMessage.error && <p className="text-red-500 text-[10px] mt-1 text-right">{statusMessage.error}</p>}
                    {statusMessage.success && <p className="text-green-500 text-[10px] mt-1 text-right">{statusMessage.success}</p>}
                </form>
            </section>
          )}

          {/* 4. TABLA DE REGISTROS */}
          {selectedCicloProcesamientoId && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-8">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
                        <FiCheckSquare /> 4. Registros en Lote Actual
                    </h3>
                </div>
                <div className="overflow-x-auto max-h-[500px]">
                    <table className="min-w-full text-[11px]">
                        <thead className="bg-gray-100 text-gray-600 font-bold uppercase sticky top-0 z-10">
                            <tr>
                                <th className="px-2 py-2 text-left">Muestra</th>
                                <th className="px-2 py-2 text-left">Origen</th>
                                <th className="px-2 py-2 text-right">Peso (g)</th>
                                <th className="px-2 py-2 text-right">Vol (cm³)</th>
                                <th className="px-2 py-2 text-right bg-blue-50 text-blue-800 border-l border-gray-200">N Total %</th>
                                <th className="px-2 py-2 text-right bg-green-50 text-green-800">N BS %</th>
                                <th className="px-2 py-2 text-center w-20">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {listaRegistros.map(reg => {
                                const isHighlighted = highlightParams && 
                                    reg.ciclo_catalogo_id === highlightParams.ciclo_id &&
                                    reg.etapa_catalogo_id === highlightParams.etapa_id &&
                                    reg.muestra_catalogo_id === highlightParams.muestra_id &&
                                    reg.origen_catalogo_id === highlightParams.origen_id;

                                return (
                                    <tr key={reg.id} id={`registro-nitro-${reg.id}`} 
                                        className={isHighlighted ? 'bg-yellow-100 border-l-4 border-l-yellow-500' : 'hover:bg-gray-50'}>
                                        <td className="px-2 py-1.5 font-medium text-gray-800">{reg.muestra_ref?.nombre}</td>
                                        <td className="px-2 py-1.5 text-gray-600">{reg.origen_ref?.nombre}</td>
                                        <td className="px-2 py-1.5 text-right">{reg.peso_muestra_n_g}</td>
                                        <td className="px-2 py-1.5 text-right">{reg.vol_hcl_gastado_cm3}</td>
                                        <td className="px-2 py-1.5 text-right font-bold text-blue-600 bg-blue-50/30 border-l border-gray-100">{reg.nitrogeno_organico_total_porc?.toFixed(3)}</td>
                                        <td className="px-2 py-1.5 text-right font-bold text-green-600 bg-green-50/30">{reg.nitrogeno_base_seca_porc?.toFixed(3)}</td>
                                        <td className="px-2 py-1.5 text-center flex justify-center gap-1">
                                            <button onClick={() => handleEditRegistro(reg)} className="text-blue-500 hover:text-blue-700 p-1"><FiEdit /></button>
                                            <button onClick={() => handleDeleteRegistro(reg.id)} className="text-red-500 hover:text-red-700 p-1"><FiTrash2 /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                {listaRegistros.length > 0 && (
                    <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <button onClick={handlePromediarYActualizarGeneral} disabled={averagingStatus.isLoading}
                            className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded shadow-sm hover:bg-teal-700 flex items-center gap-2">
                            <FiTrendingUp /> {averagingStatus.isLoading ? 'PROCESANDO...' : 'FINALIZAR LOTE Y PROMEDIAR'}
                        </button>
                    </div>
                )}
                {averagingStatus.success && <p className="text-green-600 text-xs text-center p-2">{averagingStatus.success}</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}