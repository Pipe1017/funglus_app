// Ubicación: frontend/src/modules/laboratorio/components/laboratorio/general/ResumenMatriz.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiRefreshCw, FiTrash2, FiEdit, FiSearch, FiInbox, FiDatabase } from 'react-icons/fi';
import { allPossibleMetadataFields } from '../../../../core/config/metadataFormFields';
import { API_BASE_URL } from '../../../../core/config/api'

const DATOS_LABORATORIO_CICLO_ENDPOINT = `${API_BASE_URL}/datos_laboratorio/ciclo`;
const CATALOGO_CICLOS_ENDPOINT = `${API_BASE_URL}/catalogos/ciclos`;
const DATOS_LABORATORIO_ENTRY_ENDPOINT = `${API_BASE_URL}/datos_laboratorio/entry`;

// MODIFICADO: Se agrega highlightParams a las props
function ResumenMatriz({ onEditClick, initialCicloId, highlightParams }) {
  const [availableCiclos, setAvailableCiclos] = useState([]);
  const [selectedCicloId, setSelectedCicloId] = useState('');
  const [datosMatriz, setDatosMatriz] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${CATALOGO_CICLOS_ENDPOINT}/?limit=100`)
      .then(res => res.json()).then(data => setAvailableCiclos(data || [])).catch(err => console.error(err));
  }, []);
  
  // Auto-seleccionar ciclo si viene de URL
  useEffect(() => {
    if (initialCicloId && !selectedCicloId) {
      setSelectedCicloId(initialCicloId.toString());
    }
  }, [initialCicloId, selectedCicloId]);

  const fetchData = useCallback(async () => {
    if (!selectedCicloId) { setDatosMatriz([]); return; }
    setIsLoading(true);
    try {
        const res = await fetch(`${DATOS_LABORATORIO_CICLO_ENDPOINT}/${selectedCicloId}?limit=1000`);
        setDatosMatriz(await res.json() || []);
        setError('');
    } catch (e) { setError(e.message); } finally { setIsLoading(false); }
  }, [selectedCicloId]);

  useEffect(() => { fetchData() }, [fetchData]);

  const handleDelete = async (row) => {
    if (!confirm("¿Borrar toda la fila de metadatos?")) return;
    const url = new URL(DATOS_LABORATORIO_ENTRY_ENDPOINT);
    ['ciclo_id', 'etapa_id', 'muestra_id', 'origen_id', 'secuencia_id'].forEach(k => url.searchParams.append(k, row[k]));
    try { await fetch(url, { method: 'DELETE' }); fetchData(); } catch(err) { alert(err.message); }
  };

  // Definición Optimizado de Columnas
  const metaColumns = useMemo(() => Object.entries(allPossibleMetadataFields || {}).map(([k, v]) => ({
        key: k, label: v.label || k, accessor: r => r[k]
  })), []);

  return (
    <div className="space-y-3">
      {/* Header Compacto */}
      <div className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200">
        <div className="flex items-center gap-2 w-full max-w-lg">
            <FiDatabase className="text-gray-400 ml-2" />
            <select value={selectedCicloId} onChange={e => setSelectedCicloId(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold text-gray-700 w-full focus:ring-0 cursor-pointer">
                <option value="">-- Seleccionar Ciclo de Datos --</option>
                {availableCiclos.map(c => <option key={c.id} value={c.id}>{c.nombre_ciclo}</option>)}
            </select>
        </div>
        <button onClick={fetchData} disabled={!selectedCicloId} className="p-1.5 text-gray-500 hover:text-brand-600 bg-white rounded shadow-sm border border-gray-100">
            <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Tabla Ultra-Optimizada con Sticky Columns */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white min-h-[400px] relative flex flex-col">
        {!selectedCicloId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <FiInbox size={32} className="opacity-30 mb-2"/>
                <p className="text-xs">Selecciona un ciclo para ver la matriz</p>
            </div>
        ) : (
            <div className="overflow-auto flex-1 max-h-[600px] w-full">
                <table className="text-[10px] w-full border-collapse">
                    <thead className="bg-gray-100 text-gray-700 font-bold uppercase sticky top-0 z-30 shadow-sm">
                        <tr>
                            {/* Columnas Fijas (Sticky Left) */}
                            <th className="sticky left-0 z-40 bg-gray-100 px-3 py-2 border-r border-b border-gray-200 min-w-[100px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Etapa</th>
                            <th className="sticky left-[100px] z-40 bg-gray-100 px-3 py-2 border-r border-b border-gray-200 min-w-[100px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Muestra</th>
                            <th className="sticky left-[200px] z-40 bg-gray-100 px-3 py-2 border-r border-b border-gray-200 min-w-[80px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Origen</th>
                            <th className="sticky left-[280px] z-40 bg-gray-100 px-3 py-2 border-r border-b border-gray-200 min-w-[80px] shadow-[4px_0_10px_-4px_rgba(0,0,0,0.15)]">Sec.</th>
                            
                            {/* Columnas Calculadas Importantes */}
                            <th className="px-2 py-2 border-b border-gray-200 bg-blue-50 text-blue-800 min-w-[60px] text-right">Humedad %</th>
                            <th className="px-2 py-2 border-b border-gray-200 bg-orange-50 text-orange-800 min-w-[60px] text-right">Cenizas %</th>
                            <th className="px-2 py-2 border-b border-gray-200 bg-green-50 text-green-800 min-w-[60px] text-right border-r border-gray-300">N Total %</th>
                            
                            {/* Columnas Dinámicas de Metadatos */}
                            {metaColumns.map(col => (
                                <th key={col.key} className="px-2 py-2 border-b border-gray-200 min-w-[80px] whitespace-nowrap text-gray-500 font-normal">{col.label}</th>
                            ))}
                            
                            {/* Acciones (Sticky Right opcional, aquí normal al final) */}
                            <th className="px-2 py-2 border-b border-gray-200 w-16 text-center"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {datosMatriz.map((row) => {
                            // MODIFICADO: Lógica de resaltado mejorada
                            // Si hay highlightParams, debe coincidir TODO. Si no, usa lógica antigua (ciclo).
                            const isHighlighted = highlightParams 
                                ? (row.etapa_id === highlightParams.etapa_id && 
                                   row.muestra_id === highlightParams.muestra_id && 
                                   row.origen_id === highlightParams.origen_id)
                                : (initialCicloId && row.ciclo_id === initialCicloId);

                            return (
                            <tr key={row.id} className={`transition-colors group ${isHighlighted ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-blue-50/30'}`}>
                                {/* Celdas Fijas */}
                                <td className={`sticky left-0 z-20 ${isHighlighted ? 'bg-yellow-100 group-hover:bg-yellow-200' : 'bg-white group-hover:bg-blue-50'} px-3 py-1.5 border-r border-gray-100 font-medium text-gray-800 truncate max-w-[100px]`} title={row.etapa_ref?.nombre}>{row.etapa_ref?.nombre}</td>
                                <td className={`sticky left-[100px] z-20 ${isHighlighted ? 'bg-yellow-100 group-hover:bg-yellow-200' : 'bg-white group-hover:bg-blue-50'} px-3 py-1.5 border-r border-gray-100 text-gray-600 truncate max-w-[100px]`} title={row.muestra_ref?.nombre}>{row.muestra_ref?.nombre}</td>
                                <td className={`sticky left-[200px] z-20 ${isHighlighted ? 'bg-yellow-100 group-hover:bg-yellow-200' : 'bg-white group-hover:bg-blue-50'} px-3 py-1.5 border-r border-gray-100 text-gray-500 truncate max-w-[80px]`} title={row.origen_ref?.nombre}>{row.origen_ref?.nombre}</td>
                                <td className={`sticky left-[280px] z-20 ${isHighlighted ? 'bg-yellow-100 group-hover:bg-yellow-200' : 'bg-white group-hover:bg-blue-50'} px-3 py-1.5 border-r border-gray-200 text-gray-500 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]`}>{row.secuencia_ref?.nombre}</td>

                                {/* Resultados */}
                                <td className="px-2 py-1.5 text-right font-medium text-blue-600 bg-blue-50/10">{row.humedad_prom_porc?.toFixed(1) || '-'}</td>
                                <td className="px-2 py-1.5 text-right font-medium text-orange-600 bg-orange-50/10">{row.resultado_cenizas_porc?.toFixed(2) || '-'}</td>
                                <td className="px-2 py-1.5 text-right font-medium text-green-600 bg-green-50/10 border-r border-gray-200">{row.resultado_nitrogeno_total_porc?.toFixed(2) || '-'}</td>

                                {/* Metadatos */}
                                {metaColumns.map(col => (
                                    <td key={col.key} className="px-2 py-1.5 text-gray-400 truncate max-w-[80px]" title={row[col.key]}>
                                        {row[col.key] || '-'}
                                    </td>
                                ))}

                                {/* Acciones */}
                                <td className="px-2 py-1.5 text-center">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100">
                                        <button onClick={() => onEditClick(row)} className="text-blue-500 hover:bg-blue-100 p-1 rounded"><FiEdit size={12}/></button>
                                        <button onClick={() => handleDelete(row)} className="text-red-500 hover:bg-red-100 p-1 rounded"><FiTrash2 size={12}/></button>
                                    </div>
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}

export default ResumenMatriz;