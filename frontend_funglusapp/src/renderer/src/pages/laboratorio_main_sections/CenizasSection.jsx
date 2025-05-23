// src/renderer/src/pages/laboratorio_main_sections/CenizasSection.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FiClipboard,
  FiFilter,
  FiInfo,
  FiLayers,
  FiList,
  FiPlusSquare,
  FiRefreshCw,
  FiSave
} from 'react-icons/fi' // Añadido FiPercent
import IdentificadoresSelectForm from '../../components/laboratorio/general/IdentificadoresSelectForm'
import { useCiclo } from '../../contexts/CicloContext' // Aún puede ser útil para el IdentificadoresSelectForm si este espera un ciclo de catálogo global como filtro inicial o referencia

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'
const CICLOS_PROCESAMIENTO_ENDPOINT = `${FASTAPI_BASE_URL}/ciclos-procesamiento`
const REGISTROS_CENIZAS_ENDPOINT = `${FASTAPI_BASE_URL}/registros-cenizas` // Nuevo endpoint para cenizas
// DATOS_LABORATORIO_ENTRY_ENDPOINT sigue siendo relevante para asegurar la entrada en la tabla general
const DATOS_LABORATORIO_ENTRY_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/entry`
const TIPO_ANALISIS_CENIZAS = 'cenizas'

const initialRegistroCenizasFormState = {
  peso_crisol_vacio_g: '', // (a)
  peso_crisol_mas_muestra_g: '', // (b)
  peso_crisol_mas_cenizas_g: '' // (c)
}

function CenizasSection() {
  const { getCurrentCicloId: getCurrentCicloCatalogoGlobalId } = useCiclo() // Para pasar al IdentificadoresSelectForm

  // Estado para Ciclos de Procesamiento de Cenizas
  const [ciclosProcesamientoCenizas, setCiclosProcesamientoCenizas] = useState([])
  const [selectedCicloProcesamientoId, setSelectedCicloProcesamientoId] = useState('')
  const [isLoadingCiclosProc, setIsLoadingCiclosProc] = useState(false)

  // Estado para selección de identificadores de catálogo
  const [selectedCatalogoKeys, setSelectedCatalogoKeys] = useState(null)

  // Estado para el formulario del registro de cenizas
  const [registroForm, setRegistroForm] = useState(initialRegistroCenizasFormState)

  // Estado para valor calculado
  const [calculatedCenizasPorc, setCalculatedCenizasPorc] = useState(null)

  // Estado para guardar registro y mensajes
  const [saveRegistroStatus, setSaveRegistroStatus] = useState({
    isLoading: false,
    error: '',
    success: ''
  })

  // Estado para lista de registros de cenizas
  const [listaRegistrosCenizas, setListaRegistrosCenizas] = useState([])
  const [isLoadingRegistros, setIsLoadingRegistros] = useState(false)
  const [errorLoadingRegistros, setErrorLoadingRegistros] = useState('')

  // --- FETCH CICLOS DE PROCESAMIENTO DE CENIZAS ---
  const fetchCiclosProcesamientoCenizas = useCallback(async () => {
    setIsLoadingCiclosProc(true)
    try {
      const response = await fetch(
        `${CICLOS_PROCESAMIENTO_ENDPOINT}/${TIPO_ANALISIS_CENIZAS}/?limit=1000`
      )
      if (!response.ok)
        throw new Error('No se pudieron cargar los lotes de procesamiento de cenizas.')
      const data = await response.json()
      setCiclosProcesamientoCenizas(data || [])
    } catch (error) {
      console.error('Error fetching lotes de procesamiento cenizas:', error)
    } finally {
      setIsLoadingCiclosProc(false)
    }
  }, [])

  useEffect(() => {
    fetchCiclosProcesamientoCenizas()
  }, [fetchCiclosProcesamientoCenizas])

  // --- MANEJO DE IDENTIFICADORES DE CATÁLOGO ---
  const handleCatalogoKeysConfirm = useCallback((keys) => {
    setSelectedCatalogoKeys(keys)
    // Para cenizas, no necesitamos H%, así que no hay fetchHumedad aquí.
    // Solo preparamos para el nuevo registro.
  }, [])

  const handleCatalogoKeysClear = useCallback(() => {
    setSelectedCatalogoKeys(null)
    setRegistroForm(initialRegistroCenizasFormState)
    setCalculatedCenizasPorc(null)
  }, [])

  // --- CÁLCULO DINÁMICO DE CENIZAS % ---
  const recalcularCenizasPorc = useCallback(() => {
    const a = parseFloat(registroForm.peso_crisol_vacio_g)
    const b = parseFloat(registroForm.peso_crisol_mas_muestra_g)
    const c = parseFloat(registroForm.peso_crisol_mas_cenizas_g)
    let cenizasPorc = null

    if (!isNaN(a) && !isNaN(b) && !isNaN(c) && b - a !== 0) {
      cenizasPorc = ((c - a) / (b - a)) * 100
    }
    setCalculatedCenizasPorc(cenizasPorc)
  }, [registroForm])

  useEffect(() => {
    recalcularCenizasPorc()
  }, [recalcularCenizasPorc])

  // --- FETCH REGISTROS DE CENIZAS PARA EL LOTE SELECCIONADO ---
  const fetchRegistrosCenizasDelLote = useCallback(async () => {
    if (!selectedCicloProcesamientoId) {
      setListaRegistrosCenizas([])
      setErrorLoadingRegistros('')
      return
    }
    setIsLoadingRegistros(true)
    setErrorLoadingRegistros('')
    try {
      const response = await fetch(
        `${REGISTROS_CENIZAS_ENDPOINT}/lote/${selectedCicloProcesamientoId}/?limit=1000`
      )
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: `Error HTTP ${response.status}` }))
        throw new Error(
          errData.detail || `No se pudieron cargar los registros de cenizas para este lote.`
        )
      }
      const data = await response.json()
      setListaRegistrosCenizas(data || [])
    } catch (error) {
      console.error('Error fetching registros de cenizas del lote:', error)
      setErrorLoadingRegistros(error.message)
    } finally {
      setIsLoadingRegistros(false)
    }
  }, [selectedCicloProcesamientoId])

  useEffect(() => {
    if (selectedCicloProcesamientoId) {
      // Solo cargar si hay un lote seleccionado
      fetchRegistrosCenizasDelLote()
    } else {
      setListaRegistrosCenizas([]) // Limpiar lista si no hay lote seleccionado
    }
  }, [selectedCicloProcesamientoId, fetchRegistrosCenizasDelLote]) // react-hooks/exhaustive-deps sugiere fetchRegistrosCenizasDelLote

  // --- MANEJO DEL FORMULARIO DE REGISTRO DE CENIZAS ---
  const handleRegistroCenizasFormChange = (e) => {
    const { name, value } = e.target
    setRegistroForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveRegistroCenizas = async (e) => {
    e.preventDefault()
    if (!selectedCicloProcesamientoId) {
      setSaveRegistroStatus({
        isLoading: false,
        success: '',
        error: 'Seleccione un Lote de Procesamiento de Cenizas.'
      })
      return
    }
    if (!selectedCatalogoKeys) {
      setSaveRegistroStatus({
        isLoading: false,
        success: '',
        error: 'Seleccione el contexto del catálogo (Ciclo, Etapa, Muestra, Origen).'
      })
      return
    }
    // Validaciones básicas de inputs
    const a = parseFloat(registroForm.peso_crisol_vacio_g)
    const b = parseFloat(registroForm.peso_crisol_mas_muestra_g)
    const c = parseFloat(registroForm.peso_crisol_mas_cenizas_g)

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      setSaveRegistroStatus({
        isLoading: false,
        success: '',
        error: 'Todos los pesos deben ser números válidos.'
      })
      return
    }
    if (b - a === 0) {
      setSaveRegistroStatus({
        isLoading: false,
        success: '',
        error: 'El peso de la muestra (Peso Crisol+Muestra - Peso Crisol Vacío) no puede ser cero.'
      })
      return
    }

    setSaveRegistroStatus({ isLoading: true, error: '', success: '' })
    const payload = {
      ciclo_procesamiento_id: parseInt(selectedCicloProcesamientoId, 10),
      ciclo_catalogo_id: selectedCatalogoKeys.cicloId,
      etapa_catalogo_id: selectedCatalogoKeys.etapaId,
      muestra_catalogo_id: selectedCatalogoKeys.muestraId,
      origen_catalogo_id: selectedCatalogoKeys.origenId,
      peso_crisol_vacio_g: a,
      peso_crisol_mas_muestra_g: b,
      peso_crisol_mas_cenizas_g: c
      // calc_cenizas_porc se calcula en el backend y se guarda, y también actualiza la tabla general.
    }

    try {
      const response = await fetch(REGISTROS_CENIZAS_ENDPOINT + '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: `Error HTTP ${response.status}` }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      const savedData = await response.json()
      setSaveRegistroStatus({
        isLoading: false,
        success: `Registro de Cenizas (ID: ${savedData.id}) guardado. % Cenizas: ${savedData.calc_cenizas_porc?.toFixed(2)}`,
        error: ''
      })
      setRegistroForm(initialRegistroCenizasFormState) // Limpiar formulario
      fetchRegistrosCenizasDelLote() // Refrescar la lista
      setTimeout(() => setSaveRegistroStatus((prev) => ({ ...prev, success: '' })), 4000)
    } catch (error) {
      setSaveRegistroStatus({
        isLoading: false,
        error: `Error al guardar registro de cenizas: ${error.message}`,
        success: ''
      })
    }
  }

  const selectedCicloProcDetails = useMemo(() => {
    return ciclosProcesamientoCenizas.find(
      (cp) => cp.id === parseInt(selectedCicloProcesamientoId, 10)
    )
  }, [ciclosProcesamientoCenizas, selectedCicloProcesamientoId])

  // Columnas para la tabla de registros de cenizas
  const registrosTableColumns = useMemo(
    () => [
      {
        Header: 'Ciclo Cat.',
        accessor: (row) => row.ciclo_catalogo_ref?.nombre_ciclo || row.ciclo_catalogo_id
      },
      {
        Header: 'Etapa Cat.',
        accessor: (row) => row.etapa_catalogo_ref?.nombre || row.etapa_catalogo_id
      },
      {
        Header: 'Muestra Cat.',
        accessor: (row) => row.muestra_catalogo_ref?.nombre || row.muestra_catalogo_id
      },
      {
        Header: 'Origen Cat.',
        accessor: (row) => row.origen_catalogo_ref?.nombre || row.origen_catalogo_id
      },
      {
        Header: 'P. Crisol Vacío (g)',
        accessor: (row) => row.peso_crisol_vacio_g?.toFixed(3) || '-'
      },
      {
        Header: 'P. Crisol+Muestra (g)',
        accessor: (row) => row.peso_crisol_mas_muestra_g?.toFixed(3) || '-'
      },
      {
        Header: 'P. Crisol+Cenizas (g)',
        accessor: (row) => row.peso_crisol_mas_cenizas_g?.toFixed(3) || '-'
      },
      { Header: 'Cenizas Calc. (%)', accessor: (row) => row.calc_cenizas_porc?.toFixed(2) || '-' }
      // { Header: 'Acciones', Cell: ({row}) => (...) } // Para Edit/Delete futuro
    ],
    []
  )

  return (
    <div className="space-y-6 p-1">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <FiClipboard className="mr-3 text-orange-600" size={24} />
        Análisis de Cenizas por Lote de Procesamiento
      </h2>

      {/* 1. Selección del Ciclo de Procesamiento de Cenizas */}
      <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="cicloProcesamientoCenizasSelect"
            className="block text-md font-semibold text-gray-600"
          >
            <FiLayers className="inline mr-2 mb-1" />
            1. Lote de Procesamiento de Cenizas Activo:
          </label>
          <button
            onClick={fetchCiclosProcesamientoCenizas}
            disabled={isLoadingCiclosProc}
            className="p-1 text-gray-500 hover:text-blue-600"
            title="Refrescar lista de lotes"
          >
            <FiRefreshCw className={`h-4 w-4 ${isLoadingCiclosProc ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {isLoadingCiclosProc && <p className="text-sm italic">Cargando lotes de cenizas...</p>}
        {!isLoadingCiclosProc && ciclosProcesamientoCenizas.length === 0 && (
          <p className="text-sm text-orange-600 p-2 bg-orange-50 border border-orange-200 rounded">
            No hay Lotes de Procesamiento de Cenizas. Por favor, cree uno en "Gestión de Ciclos".
          </p>
        )}
        {!isLoadingCiclosProc && ciclosProcesamientoCenizas.length > 0 && (
          <select
            id="cicloProcesamientoCenizasSelect"
            value={selectedCicloProcesamientoId}
            onChange={(e) => {
              setSelectedCicloProcesamientoId(e.target.value)
              handleCatalogoKeysClear()
            }}
            className="mt-1 block w-full lg:w-1/2 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">-- Seleccione un Lote de Cenizas --</option>
            {ciclosProcesamientoCenizas.map((cp) => (
              <option key={cp.id} value={cp.id}>
                {cp.identificador_lote} (
                {new Date(cp.fecha_hora_lote).toLocaleString('es-ES', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
                )
              </option>
            ))}
          </select>
        )}
        {selectedCicloProcDetails && (
          <div className="mt-2 p-2 text-xs bg-orange-50 border border-orange-200 rounded-md">
            <strong>Lote Activo:</strong> {selectedCicloProcDetails.identificador_lote} <br />
            <strong>Fecha Lote:</strong>{' '}
            {new Date(selectedCicloProcDetails.fecha_hora_lote).toLocaleString('es-ES', {
              dateStyle: 'long',
              timeStyle: 'medium'
            })}{' '}
            <br />
            <strong>Descripción:</strong> {selectedCicloProcDetails.descripcion || '-'}
          </div>
        )}
      </div>

      {selectedCicloProcesamientoId && (
        <>
          <div className="p-4 bg-white rounded-lg shadow border border-gray-200 mt-4">
            <h3 className="text-md font-semibold text-gray-600 mb-3 border-b pb-2">
              <FiFilter className="inline mr-2 mb-1" />
              2. Contexto del Catálogo para este Registro de Cenizas
            </h3>
            <IdentificadoresSelectForm
              onConfirm={handleCatalogoKeysConfirm}
              onClear={handleCatalogoKeysClear}
              formKey={selectedCicloProcesamientoId} // Para resetear si cambia el lote
            />
          </div>

          {selectedCatalogoKeys && (
            <div className="p-4 bg-white rounded-lg shadow border border-gray-200 mt-4">
              <h3 className="text-md font-semibold text-gray-600 mb-3 border-b pb-2">
                <FiPlusSquare className="inline mr-2 mb-1" />
                3. Añadir Nuevo Registro de Análisis de Cenizas al Lote{' '}
                <span className="text-orange-600 font-bold">
                  "{selectedCicloProcDetails?.identificador_lote}"
                </span>
              </h3>
              <form onSubmit={handleSaveRegistroCenizas} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                  <div>
                    <label
                      htmlFor="peso_crisol_vacio_g"
                      className="block text-xs font-medium text-gray-700"
                    >
                      P. Crisol Vacío (a) [g]:
                    </label>
                    <input
                      type="number"
                      name="peso_crisol_vacio_g"
                      value={registroForm.peso_crisol_vacio_g}
                      onChange={handleRegistroCenizasFormChange}
                      step="any"
                      required
                      className="mt-1 w-full input-std"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="peso_crisol_mas_muestra_g"
                      className="block text-xs font-medium text-gray-700"
                    >
                      P. Crisol+Muestra (b) [g]:
                    </label>
                    <input
                      type="number"
                      name="peso_crisol_mas_muestra_g"
                      value={registroForm.peso_crisol_mas_muestra_g}
                      onChange={handleRegistroCenizasFormChange}
                      step="any"
                      required
                      className="mt-1 w-full input-std"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="peso_crisol_mas_cenizas_g"
                      className="block text-xs font-medium text-gray-700"
                    >
                      P. Crisol+Cenizas (c) [g]:
                    </label>
                    <input
                      type="number"
                      name="peso_crisol_mas_cenizas_g"
                      value={registroForm.peso_crisol_mas_cenizas_g}
                      onChange={handleRegistroCenizasFormChange}
                      step="any"
                      required
                      className="mt-1 w-full input-std"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-100 rounded-md border">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Resultado Calculado (para esta entrada):
                  </h4>
                  <div className="grid grid-cols-1 text-sm">
                    <p>
                      Cenizas [%]:{' '}
                      <strong className="text-orange-700">
                        {calculatedCenizasPorc?.toFixed(2) || '-'}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={saveRegistroStatus.isLoading}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none disabled:opacity-60 flex items-center"
                  >
                    <FiSave className="mr-2 h-4 w-4" />
                    {saveRegistroStatus.isLoading ? 'Guardando...' : 'Guardar Registro de Cenizas'}
                  </button>
                </div>
                {saveRegistroStatus.error && (
                  <p className="text-xs text-red-600 mt-1">{saveRegistroStatus.error}</p>
                )}
                {saveRegistroStatus.success && (
                  <p className="text-xs text-green-600 mt-1">{saveRegistroStatus.success}</p>
                )}
              </form>
            </div>
          )}
        </>
      )}

      {selectedCicloProcesamientoId && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h3 className="text-md font-semibold text-gray-700">
              <FiList className="inline mr-2 mb-1" />
              Registros de Cenizas Guardados para el Lote:{' '}
              <span className="text-orange-600 font-bold">
                {selectedCicloProcDetails?.identificador_lote}
              </span>
            </h3>
            <button
              onClick={fetchRegistrosCenizasDelLote}
              disabled={isLoadingRegistros}
              className="p-1 text-gray-500 hover:text-blue-600"
              title="Refrescar lista de registros"
            >
              <FiRefreshCw className={`h-4 w-4 ${isLoadingRegistros ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {isLoadingRegistros && (
            <p className="text-sm italic text-center py-3">Cargando registros de cenizas...</p>
          )}
          {!isLoadingRegistros && errorLoadingRegistros && (
            <p className="text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded">
              {errorLoadingRegistros}
            </p>
          )}
          {!isLoadingRegistros && !errorLoadingRegistros && listaRegistrosCenizas.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-3">
              No hay registros de cenizas para este lote aún.
            </p>
          )}
          {!isLoadingRegistros && !errorLoadingRegistros && listaRegistrosCenizas.length > 0 && (
            <div className="overflow-x-auto text-xs">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {registrosTableColumns.map(
                      (
                        col // Reutilizar 'registrosTableColumns' pero adaptarlo o crear uno nuevo para cenizas
                      ) => (
                        <th
                          key={col.Header}
                          scope="col"
                          className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          {col.Header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listaRegistrosCenizas.map((registro) => (
                    <tr key={registro.id} className="hover:bg-gray-50">
                      {registrosTableColumns.map((col) => (
                        <td key={col.Header} className="px-3 py-2 whitespace-nowrap">
                          {col.accessor(registro)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* La actualización a la tabla general para cenizas ocurre en cada guardado de registro via backend CRUD.
          No se necesita un botón separado para "promediar" como en nitrógeno debido a la unicidad.
          Un mensaje informativo podría ser útil. */}
      {selectedCicloProcesamientoId && listaRegistrosCenizas.length > 0 && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow border border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
            <FiInfo className="inline mr-2 mb-1 text-blue-600" />
            Actualización de Tabla General para Cenizas
          </h3>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
            <p className="flex items-start">
              <FiInfo size={20} className="mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
              <span>
                Cada vez que se guarda un registro de análisis de cenizas para una combinación de
                catálogos (Ciclo, Etapa, Muestra, Origen) dentro de este lote, el campo{' '}
                <strong className="font-semibold">"Resultado Cenizas (%)"</strong> en la Tabla
                General de Laboratorio se actualiza automáticamente con el valor calculado para esa
                combinación.
              </span>
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
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
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
          transition:
            border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
        }
        .input-std:focus {
          border-color: #4f46e5;
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(79, 70, 229, 0.25);
        }
      `}</style>
    </div>
  )
}

export default CenizasSection
