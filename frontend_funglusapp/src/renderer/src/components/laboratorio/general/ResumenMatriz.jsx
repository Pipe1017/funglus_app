// src/renderer/src/components/laboratorio/general/ResumenMatriz.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiAlertTriangle, FiLayers, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { allPossibleMetadataFields } from '../../../config/metadataFormFields';

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1';
const CATALOGO_CICLOS_ENDPOINT = `${FASTAPI_BASE_URL}/catalogos/ciclos`;
const DATOS_LABORATORIO_CICLO_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/ciclo`;
const DATOS_LABORATORIO_ENTRY_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/entry`;

const pinnedColumnsConfig = {
  left: ['etapa_ref.nombre', 'muestra_ref.nombre', 'origen_ref.nombre'],
  right: ['actions']
};

function ResumenMatriz() {
  const [availableCiclosCatalogo, setAvailableCiclosCatalogo] = useState([]);
  const [selectedCicloCatalogoId, setSelectedCicloCatalogoId] = useState('');
  const [isLoadingCiclos, setIsLoadingCiclos] = useState(false);
  const [datosMatriz, setDatosMatriz] = useState([]);
  const [isLoadingMatriz, setIsLoadingMatriz] = useState(false);
  const [errorMatriz, setErrorMatriz] = useState('');
  const [deleteStatus, setDeleteStatus] = useState({ isLoading: false, error: '', success: '' });

  const fetchAvailableCiclosCatalogo = useCallback(async () => {
    setIsLoadingCiclos(true);
    try {
      const response = await fetch(`${CATALOGO_CICLOS_ENDPOINT}/?limit=1000`);
      if (!response.ok) throw new Error('No se pudieron cargar los ciclos del catálogo.');
      const data = await response.json();
      setAvailableCiclosCatalogo(data || []);
    } catch (error) {
      setErrorMatriz(`Error cargando lista de ciclos: ${error.message}`);
    } finally {
      setIsLoadingCiclos(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailableCiclosCatalogo();
  }, [fetchAvailableCiclosCatalogo]);
  
  const selectedCicloCatalogoNombre = useMemo(() => {
    if (!selectedCicloCatalogoId || !availableCiclosCatalogo.length) return '';
    const ciclo = availableCiclosCatalogo.find(c => String(c.id) === String(selectedCicloCatalogoId));
    return ciclo ? ciclo.nombre_ciclo : '';
  }, [selectedCicloCatalogoId, availableCiclosCatalogo]);

  const allTableColumns = useMemo(() => {
    const baseColumns = [
      { key: 'etapa_ref.nombre', label: 'Etapa', accessor: (row) => row.etapa_ref?.nombre || `ID: ${row.etapa_id}`, width: '7rem' }, // Ancho reducido
      { key: 'muestra_ref.nombre', label: 'Muestra', accessor: (row) => row.muestra_ref?.nombre || (row.muestra_id ? `ID: ${row.muestra_id}` : 'N/A'), width: '7rem' }, // Ancho reducido
      { key: 'origen_ref.nombre', label: 'Origen', accessor: (row) => row.origen_ref?.nombre || (row.origen_id ? `ID: ${row.origen_id}` : 'N/A'), width: '7rem' } // Ancho reducido
    ];
    let metadataFields = [];
    if (typeof allPossibleMetadataFields === 'object' && allPossibleMetadataFields !== null) {
      metadataFields = Object.entries(allPossibleMetadataFields).map(([key, config]) => ({
        key: key, label: config.label || key,
        accessor: (row) => (row[key] ?? '-').toString(),
        width: '10rem' // Ancho por defecto para otras columnas
      }));
    }
    const calculatedBackendFields = [
      { key: 'humedad_prom_porc', label: 'H. Prom. (%)', accessor: (row) => row.humedad_prom_porc?.toFixed(2) ?? '-', width: '7rem' },
      { key: 'fdr_prom_kgf', label: 'FDR Prom. (Kgf)', accessor: (row) => row.fdr_prom_kgf?.toFixed(3) ?? '-', width: '7rem' },
      { key: 'resultado_cenizas_porc', label: 'Cenizas Res. (%)', accessor: (row) => row.resultado_cenizas_porc?.toFixed(2) ?? '-', width: '7rem' },
      { key: 'resultado_nitrogeno_total_porc', label: 'N Total Res. (%)', accessor: (row) => row.resultado_nitrogeno_total_porc?.toFixed(2) ?? '-', width: '7rem' },
      { key: 'resultado_nitrogeno_seca_porc', label: 'N Seca Res. (%)', accessor: (row) => row.resultado_nitrogeno_seca_porc?.toFixed(2) ?? '-', width: '7rem' },
    ];
    const actionColumn = { key: 'actions', label: 'Acciones', accessor: (row) => row, width: '6rem' };
    
    const allColumns = [...baseColumns, ...metadataFields, ...calculatedBackendFields, actionColumn];

    let leftOffset = 0;
    const columnsWithLeftOffsets = allColumns.map(col => {
      const augmentedCol = { ...col, left: leftOffset };
      if (pinnedColumnsConfig.left.includes(col.key)) {
        leftOffset += parseFloat(col.width) * 16; 
      }
      return augmentedCol;
    });

    let rightOffset = 0;
    const columnsWithAllOffsets = columnsWithLeftOffsets.reverse().map(col => {
        const augmentedCol = { ...col, right: rightOffset };
        if (pinnedColumnsConfig.right.includes(col.key)) {
            rightOffset += parseFloat(col.width) * 16;
        }
        return augmentedCol;
    }).reverse();

    return columnsWithAllOffsets;
  }, []);

  const fetchDatosMatriz = useCallback(async () => {
    if (!selectedCicloCatalogoId) { setDatosMatriz([]); return; }
    setIsLoadingMatriz(true); setErrorMatriz('');
    try {
      const response = await fetch(`${DATOS_LABORATORIO_CICLO_ENDPOINT}/${selectedCicloCatalogoId}?limit=1000`);
      if (!response.ok) throw new Error('No se pudieron cargar los datos de la matriz.');
      const data = await response.json();
      setDatosMatriz(data || []);
    } catch (err) {
      setErrorMatriz(`Error al cargar datos de la matriz: ${err.message}`);
    } finally {
      setIsLoadingMatriz(false);
    }
  }, [selectedCicloCatalogoId]);

  useEffect(() => {
    if (selectedCicloCatalogoId) fetchDatosMatriz();
    else setDatosMatriz([]);
  }, [selectedCicloCatalogoId, fetchDatosMatriz]);

  const handleDeleteEntry = async (rowData) => {
    const { ciclo_id, etapa_id, muestra_id, origen_id } = rowData;
    if (!window.confirm(`¿Seguro que quieres borrar la entrada para la etapa "${rowData.etapa_ref?.nombre}"?`)) return;
    setDeleteStatus({ isLoading: true, error: '', success: '' });
    try {
      const response = await fetch(DATOS_LABORATORIO_ENTRY_ENDPOINT, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ciclo_id, etapa_id, muestra_id, origen_id }) });
      if (!response.ok) throw new Error((await response.json()).detail || 'Error al borrar.');
      const result = await response.json();
      setDeleteStatus({ isLoading: false, error: '', success: result.message || 'Borrado exitoso.' });
      fetchDatosMatriz();
    } catch (err) {
      setDeleteStatus({ isLoading: false, error: `Error: ${err.message}`, success: '' });
    } finally {
      setTimeout(() => setDeleteStatus(prev => ({ ...prev, success: '', error: '' })), 4000);
    }
  };

  return (
    <div className="space-y-4 p-1">
      {/* ===== SECCIÓN PARA SELECCIONAR EL CICLO (DESPLEGABLE) ===== */}
      <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
        <label htmlFor="resumenCicloSelect" className="block text-sm font-medium text-gray-700 mb-1">
          <FiLayers className="inline mr-2" />
          Seleccione un Ciclo (Catálogo) para ver su Resumen General:
        </label>
        <div className="flex items-center gap-x-2">
          <select
            id="resumenCicloSelect" value={selectedCicloCatalogoId} onChange={(e) => setSelectedCicloCatalogoId(e.target.value)} disabled={isLoadingCiclos}
            className="block w-full md:w-1/2 lg:w-1/3 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">-- Seleccione un Ciclo --</option>
            {availableCiclosCatalogo.map((ciclo) => ( <option key={ciclo.id} value={ciclo.id}>{ciclo.nombre_ciclo}</option> ))}
          </select>
          <button onClick={fetchAvailableCiclosCatalogo} disabled={isLoadingCiclos} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-200" title="Refrescar lista de ciclos">
            <FiRefreshCw className={`h-5 w-5 ${isLoadingCiclos ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ===== SECCIÓN PARA LA MATRIZ DE DATOS (VISIBLE SI HAY CICLO SELECCIONADO) ===== */}
      {selectedCicloCatalogoId && (
        <div className="space-y-3 mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Resumen de Datos para Ciclo:{' '} <span className="text-indigo-600">{selectedCicloCatalogoNombre || selectedCicloCatalogoId}</span>
            </h3>
            <button onClick={fetchDatosMatriz} disabled={isLoadingMatriz || deleteStatus.isLoading} className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 disabled:opacity-50 flex items-center" title="Refrescar resumen">
              <FiRefreshCw className={`mr-1.5 h-3 w-3 ${isLoadingMatriz ? 'animate-spin' : ''}`} /> Refrescar
            </button>
          </div>

          {/* ... Mensajes de estado ... */}
          {deleteStatus.error && <p className="my-2 text-xs p-2.5 rounded-md border bg-red-50 text-red-700"><FiAlertTriangle className="inline mr-1" /> {deleteStatus.error}</p>}
          {deleteStatus.success && <p className="my-2 text-xs p-2.5 rounded-md border bg-green-50 text-green-700">{deleteStatus.success}</p>}
          {errorMatriz && !isLoadingMatriz && <p className="my-2 text-xs p-2.5 rounded-md border bg-red-50 text-red-700"><FiAlertTriangle className="inline mr-1" /> {errorMatriz}</p>}
          {isLoadingMatriz && <p className="text-sm text-gray-500 p-4 text-center italic">Cargando datos...</p>}
          {!isLoadingMatriz && !errorMatriz && datosMatriz.length === 0 && <p className="text-sm text-gray-500 p-4 text-center bg-gray-50 rounded-md">No hay datos para el ciclo seleccionado.</p>}

          {datosMatriz.length > 0 && (
            <div className="overflow-x-auto shadow-md rounded-lg border max-h-[600px]">
              <table className="min-w-full text-xs border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-20">
                  <tr>
                    {allTableColumns.map((col) => {
                      const isPinnedLeft = pinnedColumnsConfig.left.includes(col.key);
                      const isPinnedRight = pinnedColumnsConfig.right.includes(col.key);
                      const style = { width: col.width, minWidth: col.width };
                      if (isPinnedLeft) style.left = col.left + 'px';
                      if (isPinnedRight) style.right = col.right + 'px';
                      
                      return (
                        <th key={col.key} scope="col" style={style}
                          className={`px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap bg-gray-50 ${(isPinnedLeft || isPinnedRight) ? 'sticky z-10' : ''}`}
                        >
                          {col.label}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {datosMatriz.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 group">
                      {allTableColumns.map((col) => {
                        const isPinnedLeft = pinnedColumnsConfig.left.includes(col.key);
                        const isPinnedRight = pinnedColumnsConfig.right.includes(col.key);
                        const style = { width: col.width, minWidth: col.width };
                        if (isPinnedLeft) style.left = col.left + 'px';
                        if (isPinnedRight) style.right = col.right + 'px';

                        return (
                          <td key={`${row.id}-${col.key}`} style={style}
                            className={`px-3 py-2 whitespace-nowrap text-gray-700 ${(isPinnedLeft || isPinnedRight) ? 'sticky bg-white group-hover:bg-gray-50' : ''}`}
                          >
                            {col.key === 'actions' ? (
                              <button onClick={() => handleDeleteEntry(row)} disabled={deleteStatus.isLoading} className="text-red-500 hover:text-red-700 disabled:opacity-50 p-1" title="Borrar">
                                <FiTrash2 size={14} />
                              </button>
                            ) : ( col.accessor(row) ?? '-' )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumenMatriz;