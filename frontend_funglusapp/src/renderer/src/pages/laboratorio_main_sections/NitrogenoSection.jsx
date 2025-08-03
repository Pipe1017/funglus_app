import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FiActivity, FiCheckSquare, FiFilter, FiHelpCircle, FiInfo, FiLayers,
  FiList, FiPlusSquare, FiRefreshCw, FiSave, FiTrendingUp,
  FiEdit, FiTrash2, FiXCircle
} from 'react-icons/fi'
import IdentificadoresSelectForm from '../../components/laboratorio/general/IdentificadoresSelectForm'

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'
const CICLOS_PROCESAMIENTO_ENDPOINT = `${FASTAPI_BASE_URL}/ciclos-procesamiento`
const REGISTROS_NITROGENO_ENDPOINT = `${FASTAPI_BASE_URL}/registros-nitrogeno`
const DATOS_LABORATORIO_ENTRY_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/entry`
const TIPO_ANALISIS_NITROGENO = 'nitrogeno'

const initialRegistroFormState = {
  peso_muestra_n_g: '',
  n_hcl_normalidad: '',
  vol_hcl_gastado_cm3: ''
}

function NitrogenoSection() {
  const [ciclosProcesamientoNitrogeno, setCiclosProcesamientoNitrogeno] = useState([])
  const [selectedCicloProcesamientoId, setSelectedCicloProcesamientoId] = useState('')
  const [isLoadingCiclosProc, setIsLoadingCiclosProc] = useState(false)
  const [selectedCatalogoKeys, setSelectedCatalogoKeys] = useState(null)
  const [registroForm, setRegistroForm] = useState(initialRegistroFormState)
  const [humedadContextual, setHumedadContextual] = useState(null)
  const [isFetchingHumedad, setIsFetchingHumedad] = useState(false)
  const [humedadMessage, setHumedadMessage] = useState('')
  const [calculatedValues, setCalculatedValues] = useState({})
  const [statusMessage, setStatusMessage] = useState({ isLoading: false, error: '', success: '' })
  const [listaRegistros, setListaRegistros] = useState([])
  const [isLoadingRegistros, setIsLoadingRegistros] = useState(false)
  const [errorLoadingRegistros, setErrorLoadingRegistros] = useState('')
  const [averagingStatus, setAveragingStatus] = useState({ isLoading: false, error: '', success: '', details: [] })
  const [editingRecordId, setEditingRecordId] = useState(null)

  const fetchCiclosProcesamiento = useCallback(async () => {
    setIsLoadingCiclosProc(true)
    try {
      const response = await fetch(`${CICLOS_PROCESAMIENTO_ENDPOINT}/${TIPO_ANALISIS_NITROGENO}/?limit=1000`)
      if (!response.ok) throw new Error('No se pudieron cargar los lotes de procesamiento.')
      setCiclosProcesamientoNitrogeno(await response.json() || [])
    } catch (error) {
      setStatusMessage({ isLoading: false, error: error.message, success: '' })
    } finally {
      setIsLoadingCiclosProc(false)
    }
  }, []);

  const fetchRegistrosNitrogenoDelLote = useCallback(async () => {
    if (!selectedCicloProcesamientoId) {
        setListaRegistros([]);
        return;
    }
    setIsLoadingRegistros(true)
    setErrorLoadingRegistros('')
    try {
      const response = await fetch(`${REGISTROS_NITROGENO_ENDPOINT}/lote/${selectedCicloProcesamientoId}/?limit=1000`)
      if (!response.ok) throw new Error('No se pudieron cargar los registros.')
      setListaRegistros(await response.json() || [])
    } catch (error) {
      setErrorLoadingRegistros(error.message)
    } finally {
      setIsLoadingRegistros(false)
    }
  }, [selectedCicloProcesamientoId])
  
  const fetchHumedadParaContexto = useCallback(async () => {
    if (!selectedCatalogoKeys?.secuenciaId) {
      setHumedadContextual(null);
      setHumedadMessage('');
      return;
    }
    const keysForAPI = {
      ciclo_id: selectedCatalogoKeys.cicloId,
      etapa_id: selectedCatalogoKeys.etapaId,
      muestra_id: selectedCatalogoKeys.muestraId,
      origen_id: selectedCatalogoKeys.origenId,
      secuencia_id: selectedCatalogoKeys.secuenciaId,
    };
    setIsFetchingHumedad(true);
    setHumedadMessage('Buscando H%...');
    try {
      const response = await fetch(DATOS_LABORATORIO_ENTRY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keysForAPI)
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Error HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data && typeof data.humedad_prom_porc === 'number') {
        setHumedadContextual(data.humedad_prom_porc);
        setHumedadMessage(`H% contextual: ${data.humedad_prom_porc.toFixed(2)}%`);
      } else {
        setHumedadMessage('Advertencia: H% no encontrado en tabla general.');
        setHumedadContextual(null);
      }
    } catch (error) {
      setHumedadMessage(`Error al cargar H%: ${error.message}`);
      setHumedadContextual(null);
    } finally {
      setIsFetchingHumedad(false);
    }
  }, [selectedCatalogoKeys]);

  useEffect(() => { fetchCiclosProcesamiento() }, [fetchCiclosProcesamiento])
  useEffect(() => { fetchRegistrosNitrogenoDelLote() }, [selectedCicloProcesamientoId])
  useEffect(() => { if (selectedCatalogoKeys) fetchHumedadParaContexto() }, [selectedCatalogoKeys, fetchHumedadParaContexto])
  
  const recalcularValoresNitrogeno = useCallback(() => {
    const a = parseFloat(registroForm.peso_muestra_n_g)
    const b = parseFloat(registroForm.n_hcl_normalidad)
    const c = parseFloat(registroForm.vol_hcl_gastado_cm3)
    const H_porc = humedadContextual
    let nTotal = null, pesoSeco = null, nSeca = null
    if (!isNaN(a) && a !== 0 && !isNaN(b) && !isNaN(c)) nTotal = (c * b * 1.4) / a
    if (!isNaN(a) && typeof H_porc === 'number' && H_porc !== null) {
      pesoSeco = (a * (100 - H_porc)) / 100
      if (pesoSeco !== 0 && !isNaN(b) && !isNaN(c)) nSeca = (c * b * 1.4) / pesoSeco
    }
    setCalculatedValues({
      nitrogeno_organico_total_porc: nTotal,
      peso_seco_g: pesoSeco,
      nitrogeno_base_seca_porc: nSeca
    })
  }, [registroForm, humedadContextual]);
  useEffect(() => { recalcularValoresNitrogeno() }, [recalcularValoresNitrogeno]);

  const handleCatalogoKeysConfirm = useCallback((keys) => setSelectedCatalogoKeys(keys), [])
  
  const resetFormAndExitEditing = () => {
    setRegistroForm(initialRegistroFormState)
    setEditingRecordId(null)
    setSelectedCatalogoKeys(null)
    setStatusMessage({ isLoading: false, error: '', success: '' })
  }
  
  const handleRegistroFormChange = (e) => setRegistroForm({ ...registroForm, [e.target.name]: e.target.value })

  const handleEdit = useCallback((record) => {
    setEditingRecordId(record.id);
    setRegistroForm({
      peso_muestra_n_g: record.peso_muestra_n_g ?? '',
      n_hcl_normalidad: record.n_hcl_normalidad ?? '',
      vol_hcl_gastado_cm3: record.vol_hcl_gastado_cm3 ?? '',
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
      const response = await fetch(`${REGISTROS_NITROGENO_ENDPOINT}/${recordId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Error HTTP ${response.status}`);
      }
      setStatusMessage({ isLoading: false, success: `Registro ${recordId} borrado.`, error: '' });
      fetchRegistrosNitrogenoDelLote();
    } catch (error) {
      setStatusMessage({ isLoading: false, error: `Error al borrar: ${error.message}`, success: '' });
    } finally {
      setTimeout(() => setStatusMessage(prev => ({ ...prev, success: '', error: '' })), 4000);
    }
  }, [fetchRegistrosNitrogenoDelLote]);

  const handleSaveRegistro = async (e) => {
    e.preventDefault();
    setStatusMessage({ isLoading: true, error: '', success: '' });
    const isEditing = editingRecordId !== null;
    const payload = {
      peso_muestra_n_g: parseFloat(registroForm.peso_muestra_n_g),
      n_hcl_normalidad: parseFloat(registroForm.n_hcl_normalidad),
      vol_hcl_gastado_cm3: parseFloat(registroForm.vol_hcl_gastado_cm3),
    };
    let url;
    let method;
    if (isEditing) {
      method = 'PUT';
      url = `${REGISTROS_NITROGENO_ENDPOINT}/${editingRecordId}`;
    } else {
      method = 'POST';
      url = `${REGISTROS_NITROGENO_ENDPOINT}/`;
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
      fetchRegistrosNitrogenoDelLote();
    } catch (error) {
      setStatusMessage({ isLoading: false, error: `Error al guardar: ${error.message}`, success: '' });
    } finally {
      setTimeout(() => setStatusMessage(prev => ({ ...prev, success: '', error: '' })), 4000);
    }
  };

  const selectedCicloProcDetails = useMemo(() => ciclosProcesamientoNitrogeno.find(
    (cp) => cp.id === parseInt(selectedCicloProcesamientoId, 10)
  ), [ciclosProcesamientoNitrogeno, selectedCicloProcesamientoId]);
  
  const registrosTableColumns = useMemo(() => [
    { Header: 'Ciclo Cat.', accessor: (row) => row.ciclo_catalogo_ref?.nombre_ciclo ?? 'N/A' },
    { Header: 'Etapa', accessor: (row) => row.etapa_catalogo_ref?.nombre ?? 'N/A' },
    { Header: 'Muestra', accessor: (row) => row.muestra_catalogo_ref?.nombre ?? 'N/A' },
    { Header: 'Origen', accessor: (row) => row.origen_catalogo_ref?.nombre ?? 'N/A' },
    { Header: 'Secuencia', accessor: (row) => row.secuencia_catalogo_ref?.nombre ?? 'N/A' },
    { Header: 'N Org. Total (%)', accessor: (row) => row.calc_nitrogeno_organico_total_porc?.toFixed(2) ?? '-' },
    { Header: 'N Base Seca (%)', accessor: (row) => row.calc_nitrogeno_base_seca_porc?.toFixed(2) ?? '-' },
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

  // --- NUEVA FUNCIÓN PARA PROMEDIAR Y ACTUALIZAR TABLA GENERAL ---
   const handlePromediarYActualizarGeneral = async () => {
    if (listaRegistros.length === 0) {
      setAveragingStatus({ error: 'No hay registros en este lote para promediar.' });
      return;
    }

    setAveragingStatus({ isLoading: true, error: '', success: '', details: [] });

    // 1. Agrupar registros por la clave completa de 5 partes
    const groupedByCatalogo = listaRegistros.reduce((acc, registro) => {
      const key = `${registro.ciclo_catalogo_id}-${registro.etapa_catalogo_id}-${registro.muestra_catalogo_id}-${registro.origen_catalogo_id}-${registro.secuencia_catalogo_id}`;
      if (!acc[key]) {
        acc[key] = {
          keys: {
            ciclo_id: registro.ciclo_catalogo_id,
            etapa_id: registro.etapa_catalogo_id,
            muestra_id: registro.muestra_catalogo_id,
            origen_id: registro.origen_catalogo_id,
            secuencia_id: registro.secuencia_catalogo_id,
          },
          registros: [],
        };
      }
      acc[key].registros.push(registro);
      return acc;
    }, {});

    const updatePromises = [];

    // 2. Calcular promedios para cada grupo y preparar la actualización
    for (const key in groupedByCatalogo) {
      const group = groupedByCatalogo[key];
      const sum_n_org_total = group.registros.reduce((sum, r) => sum + (r.calc_nitrogeno_organico_total_porc || 0), 0);
      const sum_n_base_seca = group.registros.reduce((sum, r) => sum + (r.calc_nitrogeno_base_seca_porc || 0), 0);
      const count = group.registros.length;

      const avg_n_org_total = count > 0 ? parseFloat((sum_n_org_total / count).toFixed(2)) : null;
      const avg_n_base_seca = count > 0 ? parseFloat((sum_n_base_seca / count).toFixed(2)) : null;

      const payloadGeneral = {
        ...group.keys,
        resultado_nitrogeno_total_porc: avg_n_org_total,
        resultado_nitrogeno_seca_porc: avg_n_base_seca,
      };

      updatePromises.push(
        fetch(DATOS_LABORATORIO_ENTRY_ENDPOINT, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadGeneral),
        })
      );
    }

    try {
      await Promise.all(updatePromises);
      setAveragingStatus({ isLoading: false, success: 'Tabla general actualizada con los promedios.', error: '', details: [] });
    } catch (error) {
      setAveragingStatus({ isLoading: false, error: `Error al actualizar promedios: ${error.message}`, success: '', details: [] });
    } finally {
        setTimeout(() => setAveragingStatus(prev => ({...prev, success: '', error: ''})), 5000);
    }
  };


  return (
    <div className="space-y-6 p-1">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <FiActivity className="mr-3 text-indigo-600" size={24} />
        Análisis de Nitrógeno por Lote de Procesamiento
      </h2>

      <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="cicloProcesamientoSelect" className="block text-md font-semibold text-gray-600">
            <FiLayers className="inline mr-2 mb-1" />
            1. Lote de Procesamiento de Nitrógeno Activo:
          </label>
          <button onClick={fetchCiclosProcesamiento} disabled={isLoadingCiclosProc} className="p-1 text-gray-500 hover:text-blue-600" title="Refrescar lista de lotes">
            <FiRefreshCw className={`h-4 w-4 ${isLoadingCiclosProc ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {!isLoadingCiclosProc && ciclosProcesamientoNitrogeno.length > 0 && (
          <select
            id="cicloProcesamientoSelect"
            value={selectedCicloProcesamientoId}
            onChange={(e) => {
              setSelectedCicloProcesamientoId(e.target.value)
              resetFormAndExitEditing()
            }}
            className="mt-1 block w-full lg:w-1/2 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">-- Seleccione un Lote de Procesamiento --</option>
            {ciclosProcesamientoNitrogeno.map((cp) => (
              <option key={cp.id} value={cp.id}>
                {`${cp.identificador_lote} (${new Date(cp.fecha_hora_lote).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })})`}
              </option>
            ))}
          </select>
        )}
        {selectedCicloProcDetails && (
          <div className="mt-2 p-2 text-xs bg-indigo-50 border border-indigo-200 rounded-md">
            <strong>Lote Activo:</strong> {selectedCicloProcDetails.identificador_lote} <br />
            <strong>Fecha Lote:</strong>{' '}
            {new Date(selectedCicloProcDetails.fecha_hora_lote).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'medium' })}
            <br />
            <strong>Descripción:</strong> {selectedCicloProcDetails.descripcion || '-'}
          </div>
        )}
      </div>

      {selectedCicloProcesamientoId && (
        <>
          <div className="p-4 bg-white rounded-lg shadow border mt-4">
            <h3 className="text-md font-semibold text-gray-600 mb-3 border-b pb-2">
              <FiFilter className="inline mr-2 mb-1" />
              2. Contexto del Catálogo para este Registro
            </h3>
            <IdentificadoresSelectForm
              onConfirm={handleCatalogoKeysConfirm}
              onClear={resetFormAndExitEditing}
              value={selectedCatalogoKeys}
              formKey={`${selectedCicloProcesamientoId}-${editingRecordId}`}
            />
          </div>

          {(selectedCatalogoKeys || editingRecordId) && (
            <>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm">
                <p className="font-medium text-blue-700 flex items-center">
                  <FiHelpCircle className="inline mr-2" />
                  Humedad de Referencia (H%)
                </p>
                {isFetchingHumedad && <p className="text-blue-600 italic text-xs">Buscando H%...</p>}
                {humedadMessage && !isFetchingHumedad && (
                  <p className={`mt-1 text-xs ${humedadContextual !== null ? 'text-green-700' : 'text-orange-600'}`}>
                    {humedadMessage}
                  </p>
                )}
              </div>

              <div className="p-4 bg-white rounded-lg shadow border mt-4">
                <h3 className="text-md font-semibold text-gray-600 mb-3 border-b pb-2">
                  <FiPlusSquare className="inline mr-2 mb-1" />
                  {editingRecordId ? `Editando Registro ID: ${editingRecordId}` : '3. Añadir Nuevo Registro'}
                </h3>
                <form onSubmit={handleSaveRegistro} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div>
                      <label htmlFor="peso_muestra_n_g" className="block text-xs font-medium text-gray-700">Peso Muestra (a) [g]:</label>
                      <input type="number" name="peso_muestra_n_g" value={registroForm.peso_muestra_n_g} onChange={handleRegistroFormChange} step="any" required className="mt-1 w-full input-std" />
                    </div>
                    <div>
                      <label htmlFor="n_hcl_normalidad" className="block text-xs font-medium text-gray-700">N HCL (b):</label>
                      <input type="number" name="n_hcl_normalidad" value={registroForm.n_hcl_normalidad} onChange={handleRegistroFormChange} step="any" required className="mt-1 w-full input-std" />
                    </div>
                    <div>
                      <label htmlFor="vol_hcl_gastado_cm3" className="block text-xs font-medium text-gray-700">Vol HCL (c) [cm³]:</label>
                      <input type="number" name="vol_hcl_gastado_cm3" value={registroForm.vol_hcl_gastado_cm3} onChange={handleRegistroFormChange} step="any" required className="mt-1 w-full input-std" />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-100 rounded-md border">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Resultados Calculados:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <p>N Org. Total [%]: <strong>{calculatedValues.nitrogeno_organico_total_porc?.toFixed(3) || '-'}</strong></p>
                      <p>Peso Seco [g]: <strong>{calculatedValues.peso_seco_g?.toFixed(3) || '-'}</strong></p>
                      <p>N Base Seca [%]: <strong>{calculatedValues.nitrogeno_base_seca_porc?.toFixed(3) || '-'}</strong></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-3 pt-2">
                    <button type="submit" disabled={statusMessage.isLoading || isFetchingHumedad} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-60 flex items-center">
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
            </>
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
                {isLoadingRegistros && <tr><td colSpan={registrosTableColumns.length} className="text-center p-4 italic">Cargando...</td></tr>}
                {!isLoadingRegistros && listaRegistros.map(registro => (
                  <tr key={registro.id} className="hover:bg-gray-50">
                    {registrosTableColumns.map(col => (
                      <td key={`${registro.id}-${col.Header}`} className="px-3 py-2 whitespace-nowrap">
                        {col.accessor === 'actions' ? col.Cell({ row: registro }) : col.accessor(registro)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedCicloProcesamientoId && listaRegistros.length > 0 && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow border">
          <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
            <FiTrendingUp className="inline mr-2 mb-1 text-green-600" />
            4. Finalizar Lote: Calcular Promedios y Actualizar Tabla General
          </h3>
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 mb-4">
            <p className="flex items-start">
              <FiInfo size={20} className="mr-2 mt-0.5 text-green-600 flex-shrink-0" />
              <span>
                Esta acción calculará los promedios para cada combinación de catálogos y actualizará la Tabla General.
              </span>
            </p>
          </div>
          <button
            onClick={handlePromediarYActualizarGeneral}
            disabled={averagingStatus.isLoading || listaRegistros.length === 0}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 disabled:opacity-60 flex items-center"
          >
            <FiCheckSquare className="mr-2 h-4 w-4" />
            {averagingStatus.isLoading ? 'Procesando...' : 'Calcular y Guardar Promedios'}
          </button>
          {averagingStatus.isLoading && <p className="text-xs italic text-teal-700 mt-2">Actualizando tabla general...</p>}
          {averagingStatus.error && (
            <div className="mt-2 text-xs text-red-700 p-2 bg-red-50 border rounded">
              <p className="font-semibold">Error: {averagingStatus.error}</p>
              {averagingStatus.details.filter(d => !d.success).map((detail, index) => <p key={`err-${index}`}>- {detail.message}</p>)}
            </div>
          )}
          {averagingStatus.success && (
            <div className="mt-2 text-xs text-green-700 p-2 bg-green-50 border rounded">
              <p className="font-semibold">{averagingStatus.success}</p>
              {averagingStatus.details.filter(d => d.success).map((detail, index) => <p key={`ok-${index}`}>- {detail.message}</p>)}
            </div>
          )}
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

export default NitrogenoSection;