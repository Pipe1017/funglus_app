import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FiClipboard, FiFilter, FiInfo, FiLayers, FiList,
  FiPlusSquare, FiRefreshCw, FiSave, FiEdit, FiTrash2, FiXCircle, FiCheckSquare
} from 'react-icons/fi'
import IdentificadoresSelectForm from '../../components/laboratorio/general/IdentificadoresSelectForm'

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'
const CICLOS_PROCESAMIENTO_ENDPOINT = `${FASTAPI_BASE_URL}/ciclos-procesamiento`
const REGISTROS_CENIZAS_ENDPOINT = `${FASTAPI_BASE_URL}/registros-cenizas`
const TIPO_ANALISIS_CENIZAS = 'cenizas'

const initialRegistroCenizasFormState = {
  peso_crisol_vacio_g: '',
  peso_crisol_mas_muestra_g: '',
  peso_crisol_mas_cenizas_g: ''
}

function CenizasSection() {
  const [ciclosProcesamientoCenizas, setCiclosProcesamientoCenizas] = useState([]);
  const [selectedCicloProcesamientoId, setSelectedCicloProcesamientoId] = useState('');
  const [isLoadingCiclosProc, setIsLoadingCiclosProc] = useState(false);
  const [selectedCatalogoKeys, setSelectedCatalogoKeys] = useState(null);
  const [registroForm, setRegistroForm] = useState(initialRegistroCenizasFormState);
  const [calculatedCenizasPorc, setCalculatedCenizasPorc] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ isLoading: false, error: '', success: '' });
  const [listaRegistrosCenizas, setListaRegistrosCenizas] = useState([]);
  const [isLoadingRegistros, setIsLoadingRegistros] = useState(false);
  const [errorLoadingRegistros, setErrorLoadingRegistros] = useState('');
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [resyncStatus, setResyncStatus] = useState({ isLoading: false, error: '', success: '' });

  const fetchCiclosProcesamientoCenizas = useCallback(async () => {
    setIsLoadingCiclosProc(true);
    try {
      const response = await fetch(`${CICLOS_PROCESAMIENTO_ENDPOINT}/${TIPO_ANALISIS_CENIZAS}/?limit=1000`);
      if (!response.ok) throw new Error('No se pudieron cargar los lotes de procesamiento.');
      const data = await response.json();
      setCiclosProcesamientoCenizas(data || []);
    } catch (error) {
      setStatusMessage({ error: error.message, success: '', isLoading: false });
    } finally {
      setIsLoadingCiclosProc(false);
    }
  }, []);

  const fetchRegistrosCenizasDelLote = useCallback(async () => {
    if (!selectedCicloProcesamientoId) {
        setListaRegistrosCenizas([]);
        return;
    }
    setIsLoadingRegistros(true);
    setErrorLoadingRegistros('');
    try {
      const response = await fetch(`${REGISTROS_CENIZAS_ENDPOINT}/lote/${selectedCicloProcesamientoId}/?limit=1000`);
      if (!response.ok) throw new Error('No se pudieron cargar los registros.');
      const data = await response.json();
      setListaRegistrosCenizas(data || []);
    } catch (error) {
      setErrorLoadingRegistros(error.message);
    } finally {
      setIsLoadingRegistros(false);
    }
  }, [selectedCicloProcesamientoId]);

  useEffect(() => { fetchCiclosProcesamientoCenizas(); }, [fetchCiclosProcesamientoCenizas]);
  
  useEffect(() => {
    fetchRegistrosCenizasDelLote();
  }, [selectedCicloProcesamientoId]);

  const handleCatalogoKeysConfirm = useCallback((keys) => setSelectedCatalogoKeys(keys), []);
  
  const resetFormAndExitEditing = () => {
    setRegistroForm(initialRegistroCenizasFormState);
    setEditingRecordId(null);
    setSelectedCatalogoKeys(null);
    setStatusMessage({ isLoading: false, error: '', success: '' });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDelete = useCallback(async (recordId) => {
    if (!window.confirm(`¿Seguro que quieres borrar el registro con ID: ${recordId}?`)) return;

    setStatusMessage({ isLoading: true, error: '', success: '' });
    try {
      const response = await fetch(`${REGISTROS_CENIZAS_ENDPOINT}/${recordId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Error HTTP ${response.status}`);
      }
      setStatusMessage({ isLoading: false, success: `Registro ${recordId} borrado.`, error: '' });
      fetchRegistrosCenizasDelLote();
    } catch (error) {
      setStatusMessage({ isLoading: false, error: `Error al borrar: ${error.message}`, success: '' });
    } finally {
      setTimeout(() => setStatusMessage(prev => ({...prev, success: '', error: ''})), 4000);
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

    let url;
    let method;

    if (isEditing) {
      method = 'PUT';
      url = `${REGISTROS_CENIZAS_ENDPOINT}/${editingRecordId}`;
    } else {
      method = 'POST';
      url = `${REGISTROS_CENIZAS_ENDPOINT}/`;
      Object.assign(payload, {
        ciclo_procesamiento_id: parseInt(selectedCicloProcesamientoId),
        ciclo_catalogo_id: selectedCatalogoKeys.cicloId,
        etapa_catalogo_id: selectedCatalogoKeys.etapaId,
        muestra_catalogo_id: selectedCatalogoKeys.muestraId,
        origen_catalogo_id: selectedCatalogoKeys.origenId,
        secuencia_catalogo_id: selectedCatalogoKeys.secuenciaId,
      });
    }

    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Error HTTP ${response.status}`);
      }
      const savedData = await response.json();
      setStatusMessage({ isLoading: false, success: `Registro ${isEditing ? 'actualizado' : 'creado'} (ID: ${savedData.id}) con éxito.`, error: '' });
      resetFormAndExitEditing();
      fetchRegistrosCenizasDelLote();
    } catch (error) {
      setStatusMessage({ isLoading: false, error: `Error al guardar: ${error.message}`, success: '' });
    } finally {
      setTimeout(() => setStatusMessage(prev => ({...prev, success: '', error: ''})), 4000);
    }
  };
  
  const handleResync = useCallback(async () => {
    if (!selectedCicloProcesamientoId) return;
    setResyncStatus({ isLoading: true, error: '', success: '' });
    try {
      const response = await fetch(`${REGISTROS_CENIZAS_ENDPOINT}/acciones/resincronizar-lote/${selectedCicloProcesamientoId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Error HTTP ${response.status}`);
      }
      const result = await response.json();
      setResyncStatus({ isLoading: false, success: result.message, error: '' });
    } catch (error) {
      setResyncStatus({ isLoading: false, error: `Error: ${error.message}`, success: '' });
    } finally {
      setTimeout(() => setResyncStatus({ isLoading: false, error: '', success: '' }), 5000);
    }
  }, [selectedCicloProcesamientoId]);
  
  const selectedCicloProcDetails = useMemo(() => ciclosProcesamientoCenizas.find(
      (cp) => cp.id === parseInt(selectedCicloProcesamientoId, 10)
    ), [ciclosProcesamientoCenizas, selectedCicloProcesamientoId]
  );

  const registrosTableColumns = useMemo(() => [
    { Header: 'Ciclo Cat.', accessor: (row) => row.ciclo_catalogo_ref?.nombre_ciclo ?? 'N/A' },
    { Header: 'Etapa', accessor: (row) => row.etapa_catalogo_ref?.nombre ?? 'N/A' },
    { Header: 'Muestra', accessor: (row) => row.muestra_catalogo_ref?.nombre ?? 'N/A' },
    { Header: 'Origen', accessor: (row) => row.origen_catalogo_ref?.nombre ?? 'N/A' },
    { Header: 'Secuencia', accessor: (row) => row.secuencia_catalogo_ref?.nombre ?? 'N/A' },
    { Header: 'P. Crisol Vacío (g)', accessor: (row) => row.peso_crisol_vacio_g?.toFixed(3) ?? '-' },
    { Header: 'P. Crisol+Muestra (g)', accessor: (row) => row.peso_crisol_mas_muestra_g?.toFixed(3) ?? '-' },
    { Header: 'P. Crisol+Cenizas (g)', accessor: (row) => row.peso_crisol_mas_cenizas_g?.toFixed(3) ?? '-' },
    { Header: 'Cenizas (%)', accessor: (row) => row.calc_cenizas_porc?.toFixed(2) ?? '-' },
    {
      Header: 'Acciones',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-800 p-1" title="Editar"><FiEdit size={14} /></button>
          <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-800 p-1" title="Borrar"><FiTrash2 size={14} /></button>
        </div>
      ),
    },
  ], [handleEdit, handleDelete]);

  return (
    <div className="space-y-6 p-1">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <FiClipboard className="mr-3 text-orange-600" size={24} />
        Análisis de Cenizas por Lote de Procesamiento
      </h2>

      <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="cicloProcesamientoCenizasSelect" className="block text-md font-semibold text-gray-600">
            <FiLayers className="inline mr-2 mb-1" />
            1. Lote de Procesamiento de Cenizas Activo:
          </label>
          <button onClick={fetchCiclosProcesamientoCenizas} disabled={isLoadingCiclosProc} className="p-1 text-gray-500 hover:text-blue-600" title="Refrescar lista de lotes">
            <FiRefreshCw className={`h-4 w-4 ${isLoadingCiclosProc ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {isLoadingCiclosProc && <p className="text-sm italic">Cargando lotes...</p>}
        {!isLoadingCiclosProc && ciclosProcesamientoCenizas.length === 0 && (
          <p className="text-sm text-orange-600 p-2 bg-orange-50 border border-orange-200 rounded">
            No hay Lotes de Cenizas. Por favor, cree uno en "Gestión de Ciclos".
          </p>
        )}
        {!isLoadingCiclosProc && ciclosProcesamientoCenizas.length > 0 && (
          <select
            id="cicloProcesamientoCenizasSelect"
            value={selectedCicloProcesamientoId}
            onChange={(e) => {
              setSelectedCicloProcesamientoId(e.target.value);
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
        )}
        {selectedCicloProcDetails && (
          <div className="mt-2 p-2 text-xs bg-orange-50 border border-orange-200 rounded-md">
            <strong>Lote Activo:</strong> {selectedCicloProcDetails.identificador_lote} <br />
            <strong>Fecha:</strong> {new Date(selectedCicloProcDetails.fecha_hora_lote).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'medium' })} <br />
            <strong>Descripción:</strong> {selectedCicloProcDetails.descripcion || '-'}
          </div>
        )}
      </div>

      {selectedCicloProcesamientoId && (
        <>
          <div className="p-4 bg-white rounded-lg shadow border mt-4">
            <h3 className="text-md font-semibold text-gray-600 mb-3 border-b pb-2">
              <FiFilter className="inline mr-2 mb-1" />
              2. Contexto del Catálogo para el Registro
            </h3>
            <IdentificadoresSelectForm
              onConfirm={handleCatalogoKeysConfirm}
              onClear={resetFormAndExitEditing}
              value={selectedCatalogoKeys}
              formKey={`${selectedCicloProcesamientoId}-${editingRecordId}`}
            />
          </div>

          {(selectedCatalogoKeys || editingRecordId) && (
            <div className="p-4 bg-white rounded-lg shadow border mt-4">
              <h3 className="text-md font-semibold text-gray-600 mb-3 border-b pb-2">
                <FiPlusSquare className="inline mr-2 mb-1" />
                {editingRecordId ? `Editando Registro ID: ${editingRecordId}` : '3. Añadir Nuevo Registro de Análisis de Cenizas'}
              </h3>
              <form onSubmit={handleSaveRegistroCenizas} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div>
                    <label htmlFor="peso_crisol_vacio_g" className="block text-xs font-medium text-gray-700">P. Crisol Vacío (a) [g]:</label>
                    <input type="number" name="peso_crisol_vacio_g" value={registroForm.peso_crisol_vacio_g} onChange={handleRegistroCenizasFormChange} step="any" required className="mt-1 w-full input-std" />
                  </div>
                  <div>
                    <label htmlFor="peso_crisol_mas_muestra_g" className="block text-xs font-medium text-gray-700">P. Crisol+Muestra (b) [g]:</label>
                    <input type="number" name="peso_crisol_mas_muestra_g" value={registroForm.peso_crisol_mas_muestra_g} onChange={handleRegistroCenizasFormChange} step="any" required className="mt-1 w-full input-std" />
                  </div>
                  <div>
                    <label htmlFor="peso_crisol_mas_cenizas_g" className="block text-xs font-medium text-gray-700">P. Crisol+Cenizas (c) [g]:</label>
                    <input type="number" name="peso_crisol_mas_cenizas_g" value={registroForm.peso_crisol_mas_cenizas_g} onChange={handleRegistroCenizasFormChange} step="any" required className="mt-1 w-full input-std" />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-100 rounded-md border">
                  <h4 className="text-sm font-semibold">Resultado Calculado:</h4>
                  <p>Cenizas [%]: <strong className="text-orange-700">{calculatedCenizasPorc?.toFixed(2) ?? '-'}</strong></p>
                </div>
                <div className="flex items-center gap-x-3 pt-2">
                  <button type="submit" disabled={statusMessage.isLoading} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-60 flex items-center">
                    <FiSave className="mr-2 h-4 w-4" />
                    {editingRecordId ? 'Actualizar Registro' : 'Guardar Nuevo Registro'}
                  </button>
                  {editingRecordId && (
                    <button type="button" onClick={resetFormAndExitEditing} className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-400 flex items-center">
                      <FiXCircle className="mr-2 h-4 w-4" />
                      Cancelar Edición
                    </button>
                  )}
                </div>
                {statusMessage.error && <p className="text-xs text-red-600 mt-1">{statusMessage.error}</p>}
                {statusMessage.success && <p className="text-xs text-green-600 mt-1">{statusMessage.success}</p>}
              </form>
            </div>
          )}
        </>
      )}

      {selectedCicloProcesamientoId && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow border">
          <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2"><FiList className="inline mr-2 mb-1" />Registros Guardados para el Lote</h3>
          <div className="overflow-x-auto text-xs">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                  {registrosTableColumns.map(col => <th key={col.Header} className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{col.Header}</th>)}
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {isLoadingRegistros && <tr><td colSpan={registrosTableColumns.length} className="text-center p-4 italic">Cargando registros...</td></tr>}
                {!isLoadingRegistros && !errorLoadingRegistros && listaRegistrosCenizas.length === 0 && (
                  <tr><td colSpan={registrosTableColumns.length} className="text-center p-4 text-gray-500">No hay registros para este lote.</td></tr>
                )}
                {!isLoadingRegistros && !errorLoadingRegistros && listaRegistrosCenizas.map(registro => (
                  <tr key={registro.id} className="hover:bg-gray-50">
                    {registrosTableColumns.map(col => (
                      <td key={`${registro.id}-${col.Header}`} className="px-3 py-2 whitespace-nowrap">
                        {col.accessor === 'actions' 
                          ? col.Cell({ row: registro }) 
                          : col.accessor(registro)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedCicloProcesamientoId && listaRegistrosCenizas.length > 0 && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow border border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
            <FiCheckSquare className="inline mr-2 mb-1 text-blue-600" />
            4. Finalizar / Re-sincronizar Lote
          </h3>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 mb-4">
            <p className="flex items-start">
              <FiInfo size={20} className="mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
              <span>
                Aunque los resultados de cenizas se actualizan en la Tabla General automáticamente, puedes usar este botón para forzar una re-sincronización de **todos** los registros de este lote.
              </span>
            </p>
          </div>
          <button
            onClick={handleResync}
            disabled={resyncStatus.isLoading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60 flex items-center"
          >
            <FiRefreshCw className={`mr-2 h-4 w-4 ${resyncStatus.isLoading ? 'animate-spin' : ''}`} />
            {resyncStatus.isLoading ? 'Sincronizando...' : 'Re-sincronizar Lote con Tabla General'}
          </button>
          {resyncStatus.error && <p className="text-xs text-red-600 mt-2">{resyncStatus.error}</p>}
          {resyncStatus.success && <p className="text-xs text-green-600 mt-2">{resyncStatus.success}</p>}
        </div>
      )}

      <style>{`
        .input-std {
          display: block;
          width: 100%;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #374151;
          background-color: #fff;
          background-clip: padding-box;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.075);
          transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        }
        .input-std:focus {
          border-color: #4f46e5;
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(79,70,229,.25);
        }
      `}</style>
    </div>
  );
}

export default CenizasSection;