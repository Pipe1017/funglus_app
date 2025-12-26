// Ubicación: frontend/src/modules/laboratorio/pages/laboratorio_main_sections/NitrogenoSection.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiActivity, FiCheckSquare, FiFilter, FiInfo, FiLayers,
  FiList, FiPlusSquare, FiRefreshCw, FiSave, FiTrendingUp,
  FiEdit, FiTrash2, FiXCircle, FiClipboard
} from 'react-icons/fi';
import IdentificadoresSelectForm from '../../components/laboratorio/general/IdentificadoresSelectForm';
import { API_BASE_URL } from '../../../core/config/api';

const FASTAPI_BASE_URL = API_BASE_URL;
const CICLOS_PROCESAMIENTO_ENDPOINT = `${FASTAPI_BASE_URL}/ciclos-procesamiento`;
const REGISTROS_NITROGENO_ENDPOINT = `${FASTAPI_BASE_URL}/registros-nitrogeno`;
const DATOS_LABORATORIO_GET_BY_KEYS_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/get_by_keys`;
const TIPO_ANALISIS_NITROGENO = 'nitrogeno';

const initialRegistroFormState = {
  peso_muestra_n_g: '',
  n_hcl_normalidad: '',
  vol_hcl_gastado_cm3: ''
};

export default function NitrogenoSection() {
  const [ciclosProcesamientoNitrogeno, setCiclosProcesamientoNitrogeno] = useState([]);
  const [selectedCicloProcesamientoId, setSelectedCicloProcesamientoId] = useState('');
  const [isLoadingCiclosProc, setIsLoadingCiclosProc] = useState(false);
  
  const [selectedCatalogoKeys, setSelectedCatalogoKeys] = useState(null);
  const [registroForm, setRegistroForm] = useState(initialRegistroFormState);
  const [humedadContextual, setHumedadContextual] = useState(null);
  const [isFetchingHumedad, setIsFetchingHumedad] = useState(false);
  const [humedadMessage, setHumedadMessage] = useState('');
  
  const [calculatedValues, setCalculatedValues] = useState({});
  const [statusMessage, setStatusMessage] = useState({ isLoading: false, error: '', success: '' });
  
  const [listaRegistros, setListaRegistros] = useState([]);
  const [isLoadingRegistros, setIsLoadingRegistros] = useState(false);
  
  const [averagingStatus, setAveragingStatus] = useState({ isLoading: false, error: '', success: '', details: [] });
  const [editingRecordId, setEditingRecordId] = useState(null);

  // --- 1. Cargar Ciclos ---
  const fetchCiclosProcesamiento = useCallback(async () => {
    setIsLoadingCiclosProc(true);
    try {
      const response = await fetch(`${CICLOS_PROCESAMIENTO_ENDPOINT}/${TIPO_ANALISIS_NITROGENO}/?limit=100`);
      if (response.ok) {
        const data = await response.json();
        setCiclosProcesamientoNitrogeno(data);
      }
    } catch (error) { console.error("Error ciclos:", error); } 
    finally { setIsLoadingCiclosProc(false); }
  }, []);

  useEffect(() => { fetchCiclosProcesamiento(); }, [fetchCiclosProcesamiento]);

  // --- 2. Cargar Registros ---
  const fetchRegistros = useCallback(async (cicloId) => {
    if (!cicloId) return;
    setIsLoadingRegistros(true);
    try {
      const response = await fetch(`${REGISTROS_NITROGENO_ENDPOINT}/lote/${cicloId}/`);
      if (response.ok) setListaRegistros(await response.json());
      else setListaRegistros([]);
    } catch (error) { console.error("Error registros:", error); } 
    finally { setIsLoadingRegistros(false); }
  }, []);

  useEffect(() => {
    if (selectedCicloProcesamientoId) fetchRegistros(selectedCicloProcesamientoId);
    else setListaRegistros([]);
  }, [selectedCicloProcesamientoId, fetchRegistros]);

  // --- 3. Helpers ---
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
                setHumedadMessage(`H%: ${data.humedad_prom_porc.toFixed(2)}%`);
            } else setHumedadMessage('H%: No def.');
        } else setHumedadMessage('No hay datos generales.');
    } catch (error) { setHumedadMessage('Error buscando H%.'); } 
    finally { setIsFetchingHumedad(false); }
  };

  const handleRegistroFormChange = (e) => {
    setRegistroForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Calculadora
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

  // --- 4. Guardar ---
  const handleSaveRegistro = async (e) => {
    e.preventDefault();
    if (!selectedCicloProcesamientoId) return;
    if (!selectedCatalogoKeys && !editingRecordId) {
        setStatusMessage({ error: 'Falta contexto.', isLoading: false }); return;
    }
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
        if (!response.ok) throw new Error('Error al guardar.');

        setStatusMessage({ isLoading: false, success: 'Guardado.', error: '' });
        fetchRegistros(selectedCicloProcesamientoId);
        
        if (editingRecordId) setTimeout(resetFormAndExitEditing, 500);
        else {
            setRegistroForm(initialRegistroFormState);
            setCalculatedValues({});
        }
    } catch (error) { setStatusMessage({ isLoading: false, error: error.message, success: '' }); }
  };

  // --- 5. Tabla Actions ---
  const handleEditRegistro = (registro) => {
    setEditingRecordId(registro.id);
    setRegistroForm({
        peso_muestra_n_g: registro.peso_muestra_n_g,
        n_hcl_normalidad: registro.n_hcl_normalidad,
        vol_hcl_gastado_cm3: registro.vol_hcl_gastado_cm3
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRegistro = async (id) => {
    if (!window.confirm('¿Borrar registro?')) return;
    try {
        await fetch(`${REGISTROS_NITROGENO_ENDPOINT}/${id}/`, { method: 'DELETE' });
        fetchRegistros(selectedCicloProcesamientoId);
    } catch (error) { console.error(error); }
  };

  // --- 6. Promediar (CORREGIDO: Incluye Secuencia) ---
  const handlePromediarYActualizarGeneral = async () => {
    if (!listaRegistros.length) return;
    setAveragingStatus({ isLoading: true, error: '', success: '' });
    try {
        const combinaciones = [];
        const seen = new Set();
        
        listaRegistros.forEach(r => {
            // CORRECCIÓN: Clave única incluye secuencia
            const key = `${r.ciclo_catalogo_id}-${r.etapa_catalogo_id}-${r.muestra_catalogo_id}-${r.origen_catalogo_id}-${r.secuencia_catalogo_id}`;
            if (!seen.has(key)) {
                seen.add(key);
                combinaciones.push({
                    ciclo_catalogo_id: r.ciclo_catalogo_id,
                    etapa_catalogo_id: r.etapa_catalogo_id,
                    muestra_catalogo_id: r.muestra_catalogo_id,
                    origen_catalogo_id: r.origen_catalogo_id,
                    secuencia_catalogo_id: r.secuencia_catalogo_id, // CORRECCIÓN: Campo enviado
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
        setAveragingStatus({ isLoading: false, success: `Finalizado. ${updatedCount} promedios actualizados.`, error: '' });
    } catch (error) { setAveragingStatus({ isLoading: false, error: error.message, success: '' }); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in duration-500">
      {/* Encabezado Compacto */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2 text-brand-700">
            <div className="p-1.5 bg-brand-50 rounded text-brand-600"><FiActivity size={18} /></div>
            <h2 className="text-base font-bold">Nitrógeno</h2>
        </div>
        
        {/* Selector de Lote Inline */}
        <div className="flex items-center gap-2">
            <select 
                value={selectedCicloProcesamientoId} 
                onChange={(e) => { setSelectedCicloProcesamientoId(e.target.value); resetFormAndExitEditing(); }}
                className="text-xs border-gray-200 rounded py-1 pl-2 pr-8 focus:ring-1 focus:ring-brand-500"
            >
                <option value="">-- Seleccionar Lote --</option>
                {ciclosProcesamientoNitrogeno.map(c => (
                    <option key={c.id} value={c.id}>{c.identificador_lote} ({new Date(c.fecha_hora_lote).toLocaleDateString()})</option>
                ))}
            </select>
            <button onClick={fetchCiclosProcesamiento} className="text-gray-400 hover:text-brand-600"><FiRefreshCw size={14} className={isLoadingCiclosProc ? 'animate-spin':''} /></button>
        </div>
      </div>

      {selectedCicloProcesamientoId && (
        <>
          {/* Card Única de Trabajo (Grid Layout) */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                <FiPlusSquare /> {editingRecordId ? 'Editando Registro' : 'Nuevo Ingreso'}
            </h3>

            {/* Contexto */}
            {!editingRecordId && (
                <div className="mb-4 bg-gray-50/50 p-2 rounded border border-gray-100">
                    <IdentificadoresSelectForm
                        onConfirm={handleCatalogoKeysConfirm}
                        onClear={() => { setSelectedCatalogoKeys(null); setHumedadMessage(''); }}
                        value={selectedCatalogoKeys}
                        formKey={`${selectedCicloProcesamientoId}-${editingRecordId}`} 
                    />
                    <div className="mt-1 flex justify-end">
                         {humedadMessage && <span className={`text-[10px] px-2 py-0.5 rounded-full ${humedadContextual ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{humedadMessage}</span>}
                    </div>
                </div>
            )}

            <form onSubmit={handleSaveRegistro}>
                {/* Inputs en Grid de 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="relative">
                        <label className="text-[10px] text-gray-500 absolute -top-1.5 left-2 bg-white px-1">Peso (g)</label>
                        <input type="number" step="any" name="peso_muestra_n_g" value={registroForm.peso_muestra_n_g} onChange={handleRegistroFormChange} required 
                            className="w-full text-sm border-gray-300 rounded focus:border-brand-500 focus:ring-0 pt-2 pb-1" placeholder="0.000" />
                    </div>
                    <div className="relative">
                        <label className="text-[10px] text-gray-500 absolute -top-1.5 left-2 bg-white px-1">N HCL</label>
                        <input type="number" step="any" name="n_hcl_normalidad" value={registroForm.n_hcl_normalidad} onChange={handleRegistroFormChange} required 
                            className="w-full text-sm border-gray-300 rounded focus:border-brand-500 focus:ring-0 pt-2 pb-1" placeholder="0.000" />
                    </div>
                    <div className="relative">
                        <label className="text-[10px] text-gray-500 absolute -top-1.5 left-2 bg-white px-1">Vol (cm³)</label>
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
                                {calculatedValues.nitrogeno_base_seca_porc && <span className="text-gray-600">N Base Seca: <b className="text-green-700">{calculatedValues.nitrogeno_base_seca_porc.toFixed(3)}%</b></span>}
                            </>
                        )}
                        {!calculatedValues.nitrogeno_organico_total_porc && <span className="text-gray-400 italic">Ingresa datos para calcular...</span>}
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        {editingRecordId && <button type="button" onClick={resetFormAndExitEditing} className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded">Cancelar</button>}
                        <button type="submit" disabled={statusMessage.isLoading} className="flex-1 sm:flex-none px-4 py-1.5 bg-brand-600 text-white text-xs font-bold rounded hover:bg-brand-700 disabled:opacity-50">
                            {editingRecordId ? 'ACTUALIZAR' : 'GUARDAR REGISTRO'}
                        </button>
                    </div>
                </div>
                {statusMessage.error && <p className="text-red-500 text-[10px] mt-1 text-right">{statusMessage.error}</p>}
                {statusMessage.success && <p className="text-green-500 text-[10px] mt-1 text-right">{statusMessage.success}</p>}
            </form>
          </div>

          {/* Tabla Densa */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
             <div className="overflow-x-auto max-h-[500px]">
                <table className="min-w-full text-[11px]">
                    <thead className="bg-gray-100 text-gray-600 font-bold uppercase sticky top-0 z-10">
                        <tr>
                            <th className="px-2 py-2 text-left w-10">ID</th>
                            <th className="px-2 py-2 text-left">Muestra</th>
                            <th className="px-2 py-2 text-left">Origen</th>
                            <th className="px-2 py-2 text-right">Peso (g)</th>
                            <th className="px-2 py-2 text-right">N HCL</th>
                            <th className="px-2 py-2 text-right">Vol (cm³)</th>
                            <th className="px-2 py-2 text-right bg-blue-50 text-blue-800 border-l border-gray-200">N Total %</th>
                            <th className="px-2 py-2 text-right bg-green-50 text-green-800">N BS %</th>
                            <th className="px-2 py-2 text-center w-20">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {listaRegistros.map(reg => (
                            <tr key={reg.id} className="hover:bg-gray-50">
                                <td className="px-2 py-1.5 text-gray-500">{reg.id}</td>
                                <td className="px-2 py-1.5 font-medium text-gray-800">{reg.muestra_ref?.nombre}</td>
                                <td className="px-2 py-1.5 text-gray-600">{reg.origen_ref?.nombre}</td>
                                <td className="px-2 py-1.5 text-right">{reg.peso_muestra_n_g}</td>
                                <td className="px-2 py-1.5 text-right">{reg.n_hcl_normalidad}</td>
                                <td className="px-2 py-1.5 text-right">{reg.vol_hcl_gastado_cm3}</td>
                                <td className="px-2 py-1.5 text-right font-bold text-blue-600 bg-blue-50/30 border-l border-gray-100">{reg.nitrogeno_organico_total_porc?.toFixed(3)}</td>
                                <td className="px-2 py-1.5 text-right font-bold text-green-600 bg-green-50/30">{reg.nitrogeno_base_seca_porc?.toFixed(3)}</td>
                                <td className="px-2 py-1.5 text-center flex justify-center gap-1">
                                    <button onClick={() => handleEditRegistro(reg)} className="text-blue-500 hover:text-blue-700 p-1"><FiEdit /></button>
                                    <button onClick={() => handleDeleteRegistro(reg.id)} className="text-red-500 hover:text-red-700 p-1"><FiTrash2 /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          </div>
          
          {listaRegistros.length > 0 && (
            <div className="flex justify-end">
                 <button onClick={handlePromediarYActualizarGeneral} disabled={averagingStatus.isLoading}
                    className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded shadow-sm hover:bg-teal-700 flex items-center gap-2">
                    <FiTrendingUp /> {averagingStatus.isLoading ? '...' : 'FINALIZAR LOTE Y PROMEDIAR'}
                 </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}