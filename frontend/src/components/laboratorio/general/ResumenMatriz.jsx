import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiRefreshCw, FiTrash2, FiEdit, FiSearch, FiInbox } from 'react-icons/fi';
import { allPossibleMetadataFields } from '../../../config/metadataFormFields';
import { API_BASE_URL } from '../../../config/api'

const DATOS_LABORATORIO_CICLO_ENDPOINT = `${API_BASE_URL}/datos_laboratorio/ciclo`;
const CATALOGO_CICLOS_ENDPOINT = `${API_BASE_URL}/catalogos/ciclos`;
const DATOS_LABORATORIO_ENTRY_ENDPOINT = `${API_BASE_URL}/datos_laboratorio/entry`;

function ResumenMatriz({ onEditClick }) {
  const [availableCiclos, setAvailableCiclos] = useState([]);
  const [selectedCicloId, setSelectedCicloId] = useState('');
  const [datosMatriz, setDatosMatriz] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Cargar lista de ciclos al inicio
  useEffect(() => {
    fetch(`${CATALOGO_CICLOS_ENDPOINT}/?limit=100`)
      .then(res => res.json())
      .then(data => setAvailableCiclos(data || []))
      .catch(err => console.error("Error cargando ciclos", err));
  }, []);

  // 2. Definición de Columnas (Estáticas + Dinámicas)
  const columns = useMemo(() => {
    const base = [
      { key: 'etapa', label: 'Etapa', accessor: r => r.etapa_ref?.nombre, width: '120px' },
      { key: 'muestra', label: 'Muestra', accessor: r => r.muestra_ref?.nombre, width: '120px' },
      { key: 'origen', label: 'Origen', accessor: r => r.origen_ref?.nombre, width: '100px' },
      { key: 'secuencia', label: 'Secuencia', accessor: r => r.secuencia_ref?.nombre, width: '100px' }
    ];
    
    // Campos dinámicos de metadata
    const meta = Object.entries(allPossibleMetadataFields || {}).map(([k, v]) => ({
        key: k, label: v.label || k, accessor: r => r[k], width: '100px'
    }));

    // Campos calculados por el backend
    const calc = [
        { key: 'humedad', label: '% Humedad', accessor: r => r.humedad_prom_porc != null ? r.humedad_prom_porc.toFixed(1) : '-', width: '90px' },
        { key: 'cenizas', label: '% Cenizas', accessor: r => r.resultado_cenizas_porc != null ? r.resultado_cenizas_porc.toFixed(2) : '-', width: '90px' },
        { key: 'ntotal', label: '% N Total', accessor: r => r.resultado_nitrogeno_total_porc != null ? r.resultado_nitrogeno_total_porc.toFixed(2) : '-', width: '90px' },
    ];

    const actions = { key: 'actions', label: '', width: '80px' };

    return [...base, ...meta, ...calc, actions];
  }, []);

  // 3. Obtener datos de la matriz
  const fetchData = useCallback(async () => {
    if (!selectedCicloId) {
        setDatosMatriz([]);
        return;
    }
    setIsLoading(true);
    try {
        const res = await fetch(`${DATOS_LABORATORIO_CICLO_ENDPOINT}/${selectedCicloId}?limit=1000`);
        const data = await res.json();
        setDatosMatriz(data || []);
        setError('');
    } catch (e) { setError(e.message); }
    finally { setIsLoading(false); }
  }, [selectedCicloId]);

  useEffect(() => { fetchData() }, [fetchData]);

  // 4. Borrar entrada
  const handleDelete = async (row) => {
    if (!confirm("¿Estás seguro de eliminar este registro? Esta acción borrará los metadatos asociados.")) return;
    
    // Usamos URL Search Params para el DELETE
    const url = new URL(DATOS_LABORATORIO_ENTRY_ENDPOINT);
    url.searchParams.append('ciclo_id', row.ciclo_id);
    url.searchParams.append('etapa_id', row.etapa_id);
    url.searchParams.append('muestra_id', row.muestra_id);
    url.searchParams.append('origen_id', row.origen_id);
    url.searchParams.append('secuencia_id', row.secuencia_id);
    
    try {
        await fetch(url, { method: 'DELETE' });
        fetchData(); // Recargar tabla
    } catch(err) {
        alert("Error al borrar: " + err.message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Selector de Ciclo (Diseño Limpio) */}
      <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-100 transition-colors focus-within:bg-white focus-within:border-brand-200">
        <FiSearch className="text-gray-400" />
        <select 
            value={selectedCicloId} 
            onChange={e => setSelectedCicloId(e.target.value)}
            className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 w-full cursor-pointer outline-none placeholder-gray-400"
        >
            <option value="">Seleccione un Ciclo de Trabajo para cargar datos...</option>
            {availableCiclos.map(c => <option key={c.id} value={c.id}>{c.nombre_ciclo}</option>)}
        </select>
        {selectedCicloId && (
            <button onClick={fetchData} className="text-brand-600 hover:text-brand-800 p-1 bg-white rounded-md shadow-sm border border-gray-100">
                <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
            </button>
        )}
      </div>

      {/* Tabla de Datos */}
      <div className="overflow-hidden rounded-lg border border-gray-100 shadow-sm relative min-h-[300px]">
        {/* Loading Overlay */}
        {isLoading && (
            <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center text-brand-600 text-sm backdrop-blur-[1px]">
                <FiRefreshCw className="animate-spin mb-2 text-2xl" />
                Cargando registros...
            </div>
        )}

        {/* Empty State */}
        {!selectedCicloId ? (
             <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 bg-gray-50/50">
                <FiInbox className="text-4xl mb-2 opacity-50" />
                <span className="text-sm">Seleccione un ciclo arriba para comenzar</span>
             </div>
        ) : (
            <div className="max-h-[600px] overflow-y-auto">
                <table className="min-w-full text-left text-xs">
                    <thead className="bg-brand-50 text-brand-900 font-bold sticky top-0 z-10 shadow-sm">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} className="px-4 py-3 whitespace-nowrap tracking-wide" style={{ minWidth: col.width }}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                        {datosMatriz.length === 0 ? (
                            <tr><td colSpan={columns.length} className="p-10 text-center text-gray-400 italic">No se encontraron datos para este ciclo.</td></tr>
                        ) : (
                            datosMatriz.map((row) => (
                                <tr key={row.id} className="hover:bg-brand-50/40 transition-colors group">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-2.5 whitespace-nowrap text-gray-600">
                                            {col.key === 'actions' ? (
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                    <button onClick={() => onEditClick(row)} className="text-brand-600 hover:bg-brand-100 p-1.5 rounded-md transition-colors" title="Editar"><FiEdit /></button>
                                                    <button onClick={() => handleDelete(row)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-md transition-colors" title="Eliminar"><FiTrash2 /></button>
                                                </div>
                                            ) : (
                                                col.accessor(row)
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}

export default ResumenMatriz;