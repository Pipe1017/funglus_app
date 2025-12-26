// Versión modernizada con el nuevo diseño
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
const DATOS_LABORATORIO_ENTRY_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/entry`;
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
  const [errorLoadingRegistros, setErrorLoadingRegistros] = useState('');
  const [averagingStatus, setAveragingStatus] = useState({ isLoading: false, error: '', success: '', details: [] });
  const [editingRecordId, setEditingRecordId] = useState(null);

  // ... (mantener toda la lógica existente) ...

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Encabezado de Sección */}
      <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
        <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
          <FiActivity size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Análisis de Nitrógeno</h2>
          <p className="text-sm text-gray-500">Gestión de registros de nitrógeno por lote de procesamiento</p>
        </div>
      </div>

      {/* Card: Selección de Lote */}
      <div className="bg-surface rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FiLayers className="text-brand-600" />
            Lote de Procesamiento Activo
          </label>
          <button
            onClick={fetchCiclosProcesamiento}
            disabled={isLoadingCiclosProc}
            className="p-1.5 text-gray-400 hover:text-brand-600 rounded-md hover:bg-gray-50 transition-colors"
            title="Refrescar lista de lotes"
          >
            <FiRefreshCw className={isLoadingCiclosProc ? 'animate-spin' : ''} size={16} />
          </button>
        </div>
        
        {!isLoadingCiclosProc && ciclosProcesamientoNitrogeno.length > 0 && (
          <select
            value={selectedCicloProcesamientoId}
            onChange={(e) => {
              setSelectedCicloProcesamientoId(e.target.value);
              resetFormAndExitEditing();
            }}
            className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm"
          >
            <option value="">-- Seleccione un Lote --</option>
            {ciclosProcesamientoNitrogeno.map((cp) => (
              <option key={cp.id} value={cp.id}>
                {`${cp.identificador_lote} (${new Date(cp.fecha_hora_lote).toLocaleDateString()})`}
              </option>
            ))}
          </select>
        )}

        {selectedCicloProcDetails && (
          <div className="mt-3 p-3 bg-brand-50/50 border border-brand-100 rounded-lg text-xs space-y-1">
            <div><span className="font-medium text-brand-900">Lote:</span> {selectedCicloProcDetails.identificador_lote}</div>
            <div><span className="font-medium text-brand-900">Fecha:</span> {new Date(selectedCicloProcDetails.fecha_hora_lote).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'medium' })}</div>
            {selectedCicloProcDetails.descripcion && (
              <div><span className="font-medium text-brand-900">Descripción:</span> {selectedCicloProcDetails.descripcion}</div>
            )}
          </div>
        )}
      </div>

      {selectedCicloProcesamientoId && (
        <>
          {/* Card: Contexto del Catálogo */}
          <div className="bg-surface rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FiFilter className="text-brand-600" />
              Contexto del Catálogo
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
              {/* Info: Humedad de Referencia */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="font-medium text-blue-900 flex items-center gap-2 text-sm mb-1">
                  <FiInfo size={16} />
                  Humedad de Referencia (H%)
                </p>
                {isFetchingHumedad && <p className="text-blue-700 text-xs">Buscando H%...</p>}
                {humedadMessage && !isFetchingHumedad && (
                  <p className={`text-xs ${humedadContextual !== null ? 'text-green-700' : 'text-orange-700'}`}>
                    {humedadMessage}
                  </p>
                )}
              </div>

              {/* Card: Formulario de Registro */}
              <div className="bg-surface rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FiPlusSquare className="text-brand-600" />
                  {editingRecordId ? `Editando Registro #${editingRecordId}` : 'Nuevo Registro'}
                </h3>
                
                <form onSubmit={handleSaveRegistro} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Peso Muestra (a) [g]
                      </label>
                      <input
                        type="number"
                        name="peso_muestra_n_g"
                        value={registroForm.peso_muestra_n_g}
                        onChange={handleRegistroFormChange}
                        step="any"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        N HCL (b)
                      </label>
                      <input
                        type="number"
                        name="n_hcl_normalidad"
                        value={registroForm.n_hcl_normalidad}
                        onChange={handleRegistroFormChange}
                        step="any"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Vol HCL (c) [cm³]
                      </label>
                      <input
                        type="number"
                        name="vol_hcl_gastado_cm3"
                        value={registroForm.vol_hcl_gastado_cm3}
                        onChange={handleRegistroFormChange}
                        step="any"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Resultados Calculados */}
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                    <h4 className="text-xs font-semibold text-gray-700 mb-3">Resultados Calculados</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500">N Org. Total [%]:</span>
                        <p className="font-semibold text-brand-700">
                          {calculatedValues.nitrogeno_organico_total_porc?.toFixed(3) || '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Peso Seco [g]:</span>
                        <p className="font-semibold text-brand-700">
                          {calculatedValues.peso_seco_g?.toFixed(3) || '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">N Base Seca [%]:</span>
                        <p className="font-semibold text-brand-700">
                          {calculatedValues.nitrogeno_base_seca_porc?.toFixed(3) || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={statusMessage.isLoading || isFetchingHumedad}
                      className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm font-medium"
                    >
                      <FiSave />
                      {editingRecordId ? 'Actualizar' : 'Guardar'}
                    </button>
                    {editingRecordId && (
                      <button
                        type="button"
                        onClick={resetFormAndExitEditing}
                        className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <FiXCircle />
                        Cancelar
                      </button>
                    )}
                  </div>

                  {statusMessage.error && (
                    <p className="text-xs text-red-600 p-2 bg-red-50 border border-red-100 rounded">
                      {statusMessage.error}
                    </p>
                  )}
                  {statusMessage.success && (
                    <p className="text-xs text-green-600 p-2 bg-green-50 border border-green-100 rounded">
                      {statusMessage.success}
                    </p>
                  )}
                </form>
              </div>
            </>
          )}
        </>
      )}

      {/* Card: Tabla de Registros */}
      {selectedCicloProcesamientoId && (
        <div className="bg-surface rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FiList className="text-brand-600" />
              Registros del Lote
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-brand-50">
                <tr>
                  {registrosTableColumns.map(col => (
                    <th key={col.Header} className="px-4 py-3 text-left font-semibold text-brand-900 uppercase tracking-wider whitespace-nowrap">
                      {col.Header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {isLoadingRegistros && (
                  <tr>
                    <td colSpan={registrosTableColumns.length} className="text-center p-8">
                      <FiRefreshCw className="animate-spin text-brand-500 mx-auto mb-2" size={24} />
                      <p className="text-gray-500">Cargando registros...</p>
                    </td>
                  </tr>
                )}
                {!isLoadingRegistros && listaRegistros.length === 0 && (
                  <tr>
                    <td colSpan={registrosTableColumns.length} className="text-center p-8 text-gray-500">
                      No hay registros para este lote
                    </td>
                  </tr>
                )}
                {!isLoadingRegistros && listaRegistros.map(registro => (
                  <tr key={registro.id} className="hover:bg-gray-50 transition-colors">
                    {registrosTableColumns.map(col => (
                      <td key={`${registro.id}-${col.Header}`} className="px-4 py-3 whitespace-nowrap text-gray-700">
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

      {/* Card: Finalizar Lote */}
      {selectedCicloProcesamientoId && listaRegistros.length > 0 && (
        <div className="bg-surface rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FiCheckSquare className="text-green-600" />
            Finalizar Lote
          </h3>
          
          <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-800 mb-4">
            <p className="flex items-start gap-2">
              <FiInfo size={16} className="mt-0.5 flex-shrink-0" />
              <span>
                Calcula los promedios para cada combinación de catálogos y actualiza la Tabla General.
              </span>
            </p>
          </div>
          
          <button
            onClick={handlePromediarYActualizarGeneral}
            disabled={averagingStatus.isLoading || listaRegistros.length === 0}
            className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
          >
            <FiTrendingUp />
            {averagingStatus.isLoading ? 'Procesando...' : 'Calcular y Guardar Promedios'}
          </button>
          
          {averagingStatus.error && (
            <div className="mt-3 text-xs text-red-700 p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="font-semibold">Error: {averagingStatus.error}</p>
            </div>
          )}
          {averagingStatus.success && (
            <div className="mt-3 text-xs text-green-700 p-3 bg-green-50 border border-green-100 rounded-lg">
              <p className="font-semibold">{averagingStatus.success}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}