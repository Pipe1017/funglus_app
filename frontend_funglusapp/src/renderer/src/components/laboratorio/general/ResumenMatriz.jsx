// src/renderer/src/components/laboratorio/general/ResumenMatriz.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FiAlertTriangle, FiLayers, FiRefreshCw, FiTrash2 } from 'react-icons/fi'
import { allPossibleMetadataFields } from '../../../config/metadataFormFields'

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'
const CATALOGO_CICLOS_ENDPOINT = `${FASTAPI_BASE_URL}/catalogos/ciclos`
const DATOS_LABORATORIO_CICLO_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/ciclo`
const DATOS_LABORATORIO_ENTRY_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/entry`

function ResumenMatriz() {
  const [availableCiclosCatalogo, setAvailableCiclosCatalogo] = useState([])
  const [selectedCicloCatalogoId, setSelectedCicloCatalogoId] = useState('')
  const [isLoadingCiclos, setIsLoadingCiclos] = useState(false)

  const [datosMatriz, setDatosMatriz] = useState([])
  const [isLoadingMatriz, setIsLoadingMatriz] = useState(false)
  const [errorMatriz, setErrorMatriz] = useState('')
  const [deleteStatus, setDeleteStatus] = useState({ isLoading: false, error: '', success: '' })

  const fetchAvailableCiclosCatalogo = useCallback(async () => {
    setIsLoadingCiclos(true)
    setErrorMatriz('') // Limpiar errores previos de matriz al cargar ciclos
    try {
      const response = await fetch(`${CATALOGO_CICLOS_ENDPOINT}/?limit=1000`)
      if (!response.ok) {
        const errText = await response.text()
        throw new Error(
          `No se pudieron cargar los ciclos del catálogo: ${response.status} ${errText}`
        )
      }
      const data = await response.json()
      setAvailableCiclosCatalogo(data || [])
    } catch (error) {
      console.error('Error fetching ciclos de catálogo:', error)
      setErrorMatriz(`Error cargando lista de ciclos: ${error.message}`)
    } finally {
      setIsLoadingCiclos(false)
    }
  }, [])

  useEffect(() => {
    fetchAvailableCiclosCatalogo()
  }, [fetchAvailableCiclosCatalogo])

  const selectedCicloCatalogoNombre = useMemo(() => {
    if (!selectedCicloCatalogoId || availableCiclosCatalogo.length === 0) return ''
    const ciclo = availableCiclosCatalogo.find(
      (c) => String(c.id) === String(selectedCicloCatalogoId)
    )
    return ciclo ? ciclo.nombre_ciclo : ''
  }, [selectedCicloCatalogoId, availableCiclosCatalogo])

  const baseColumns = useMemo(
    () => [
      {
        key: 'etapa_ref.nombre',
        label: 'Etapa',
        accessor: (row) => row.etapa_ref?.nombre || `ID: ${row.etapa_id}`
      },
      {
        key: 'muestra_ref.nombre',
        label: 'Muestra',
        accessor: (row) =>
          row.muestra_ref?.nombre || (row.muestra_id ? `ID: ${row.muestra_id}` : 'N/A')
      },
      {
        key: 'origen_ref.nombre',
        label: 'Origen',
        accessor: (row) =>
          row.origen_ref?.nombre || (row.origen_id ? `ID: ${row.origen_id}` : 'N/A')
      }
    ],
    []
  )

  const metadataDisplayFields = useMemo(() => {
    // console.log('ResumenMatriz - allPossibleMetadataFields importado:', allPossibleMetadataFields);
    if (typeof allPossibleMetadataFields !== 'object' || allPossibleMetadataFields === null) {
      console.error(
        'ResumenMatriz: allPossibleMetadataFields no es un objeto válido o no se importó.'
      )
      return []
    }
    const fields = Object.entries(allPossibleMetadataFields).map(([key, config]) => ({
      key: key,
      label: config.label || key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      accessor: (row) =>
        row[key] === null || typeof row[key] === 'undefined' ? '-' : String(row[key])
    }))
    // console.log('ResumenMatriz - metadataDisplayFields calculado:', fields);
    return fields
  }, [])

  const calculatedBackendFields = useMemo(
    () => [
      {
        key: 'humedad_prom_porc',
        label: 'H. Prom. (%)',
        accessor: (row) => row.humedad_prom_porc?.toFixed(2) ?? '-'
      },
      {
        key: 'fdr_prom_kgf',
        label: 'FDR Prom. (Kgf)',
        accessor: (row) => row.fdr_prom_kgf?.toFixed(3) ?? '-'
      },
      {
        key: 'resultado_cenizas_porc',
        label: 'Cenizas Res. (%)',
        accessor: (row) => row.resultado_cenizas_porc?.toFixed(2) ?? '-'
      },
      {
        key: 'resultado_nitrogeno_total_porc',
        label: 'N Total Res. (%)',
        accessor: (row) => row.resultado_nitrogeno_total_porc?.toFixed(2) ?? '-'
      },
      {
        key: 'resultado_nitrogeno_seca_porc',
        label: 'N Seca Res. (%)',
        accessor: (row) => row.resultado_nitrogeno_seca_porc?.toFixed(2) ?? '-'
      }
    ],
    []
  )

  const allTableColumns = useMemo(() => {
    const actionColumn = {
      key: 'actions',
      label: 'Acciones',
      accessor: (row) => row
    }

    const validBaseColumns = Array.isArray(baseColumns) ? baseColumns : []
    const validMetadataFields = Array.isArray(metadataDisplayFields) ? metadataDisplayFields : []
    const validCalculatedFields = Array.isArray(calculatedBackendFields)
      ? calculatedBackendFields
      : []

    const columns = [
      ...validBaseColumns,
      ...validMetadataFields,
      ...validCalculatedFields,
      actionColumn
    ]

    const uniqueCols = new Map()
    columns.forEach((col) => {
      if (col && col.key && !uniqueCols.has(col.key)) {
        uniqueCols.set(col.key, col)
      } else if (col && !col.key && col.label && !uniqueCols.has(col.label)) {
        uniqueCols.set(col.label, { ...col, key: col.label })
      }
    })
    // console.log('ResumenMatriz - allTableColumns final:', Array.from(uniqueCols.values()));
    return Array.from(uniqueCols.values())
  }, [baseColumns, metadataDisplayFields, calculatedBackendFields])

  const fetchDatosMatriz = useCallback(async () => {
    if (!selectedCicloCatalogoId) {
      setDatosMatriz([])
      setErrorMatriz('')
      return
    }
    setIsLoadingMatriz(true)
    setErrorMatriz('')
    setDeleteStatus({ isLoading: false, error: '', success: '' })
    try {
      // console.log(`ResumenMatriz: Solicitando datos generales para cicloId: ${selectedCicloCatalogoId}`);
      const response = await fetch(
        `${DATOS_LABORATORIO_CICLO_ENDPOINT}/${selectedCicloCatalogoId}?limit=1000`
      )
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: `Error HTTP ${response.status}: ${response.statusText}` }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      const data = await response.json()
      // console.log(`ResumenMatriz: Datos recibidos para ciclo ${selectedCicloCatalogoNombre || selectedCicloCatalogoId}:`, data);
      setDatosMatriz(data || [])
    } catch (err) {
      setErrorMatriz(`Error al cargar datos de la matriz: ${err.message}`)
      console.error('ResumenMatriz: Error fetching datos para matriz:', err)
    } finally {
      setIsLoadingMatriz(false)
    }
  }, [selectedCicloCatalogoId, selectedCicloCatalogoNombre])

  useEffect(() => {
    if (selectedCicloCatalogoId) {
      fetchDatosMatriz()
    } else {
      setDatosMatriz([])
    }
  }, [selectedCicloCatalogoId, fetchDatosMatriz])

  const handleDeleteEntry = async (rowData) => {
    const { ciclo_id, etapa_id, muestra_id, origen_id } = rowData
    const etapaNombre = rowData.etapa_ref?.nombre || `Etapa ID ${etapa_id}`
    const muestraNombre =
      rowData.muestra_ref?.nombre || (muestra_id ? `Muestra ID ${muestra_id}` : 'N/A')
    const origenNombre =
      rowData.origen_ref?.nombre || (origen_id ? `Origen ID ${origen_id}` : 'N/A')
    const entryDescription = `${etapaNombre}, ${muestraNombre}, ${origenNombre}`

    if (
      !window.confirm(
        `¿Estás seguro de que quieres borrar la entrada: ${entryDescription} del ciclo ${selectedCicloCatalogoNombre || selectedCicloCatalogoId}? Esta acción no se puede deshacer.`
      )
    ) {
      return
    }
    setDeleteStatus({ isLoading: true, error: '', success: '' })
    const keysForDelete = { ciclo_id, etapa_id, muestra_id, origen_id }
    try {
      const response = await fetch(DATOS_LABORATORIO_ENTRY_ENDPOINT, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keysForDelete)
      })
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: `Error HTTP ${response.status}` }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      const result = await response.json()
      setDeleteStatus({
        isLoading: false,
        error: '',
        success: result.message || 'Entrada borrada exitosamente.'
      })
      fetchDatosMatriz()
    } catch (err) {
      setDeleteStatus({ isLoading: false, error: `Error al borrar: ${err.message}`, success: '' })
    } finally {
      setTimeout(() => setDeleteStatus((prev) => ({ ...prev, success: '', error: '' })), 4000)
    }
  }

  if (!Array.isArray(allTableColumns)) {
    console.error(
      'ResumenMatriz: allTableColumns NO es un array antes del return!',
      allTableColumns
    )
    return (
      <div className="p-4 text-red-500">
        Error crítico: Fallo al configurar las columnas de la tabla. Revise la consola.
      </div>
    )
  }

  return (
    <div className="space-y-4 p-1">
      <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
        <label
          htmlFor="resumenCicloSelect"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <FiLayers className="inline mr-2" />
          Seleccione un Ciclo (Catálogo) para ver su Resumen General:
        </label>
        <div className="flex items-center gap-x-2">
          <select
            id="resumenCicloSelect"
            value={selectedCicloCatalogoId}
            onChange={(e) => setSelectedCicloCatalogoId(e.target.value)}
            disabled={isLoadingCiclos}
            className="block w-full md:w-1/2 lg:w-1/3 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">-- Seleccione un Ciclo --</option>
            {availableCiclosCatalogo.map((ciclo) => (
              <option key={ciclo.id} value={ciclo.id}>
                {ciclo.nombre_ciclo}
              </option>
            ))}
          </select>
          <button
            onClick={fetchAvailableCiclosCatalogo}
            disabled={isLoadingCiclos}
            className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-200"
            title="Refrescar lista de ciclos"
          >
            <FiRefreshCw className={`h-5 w-5 ${isLoadingCiclos ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {isLoadingCiclos && <p className="text-xs text-gray-500 mt-1 italic">Cargando ciclos...</p>}
      </div>

      {selectedCicloCatalogoId && (
        <div className="space-y-3 mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Resumen de Datos para Ciclo:{' '}
              <span className="text-indigo-600">
                {selectedCicloCatalogoNombre || selectedCicloCatalogoId}
              </span>
            </h3>
            <button
              onClick={fetchDatosMatriz}
              disabled={isLoadingMatriz || deleteStatus.isLoading}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 disabled:opacity-50 flex items-center"
              title="Refrescar resumen"
            >
              <FiRefreshCw className={`mr-1.5 h-3 w-3 ${isLoadingMatriz ? 'animate-spin' : ''}`} />{' '}
              Refrescar Matriz
            </button>
          </div>
          {deleteStatus.error && (
            <p className="my-2 text-xs p-2.5 rounded-md border bg-red-50 text-red-700 border-red-300 flex items-center">
              {' '}
              <FiAlertTriangle className="mr-2 h-4 w-4 text-red-500" /> {deleteStatus.error}{' '}
            </p>
          )}
          {deleteStatus.success && (
            <p className="my-2 text-xs p-2.5 rounded-md border bg-green-50 text-green-700 border-green-300">
              {' '}
              {deleteStatus.success}{' '}
            </p>
          )}
          {errorMatriz && !isLoadingMatriz && (
            <p className="my-2 text-xs p-2.5 rounded-md border bg-red-50 text-red-700 border-red-300 flex items-center">
              {' '}
              <FiAlertTriangle className="mr-2 h-4 w-4 text-red-500" /> {errorMatriz}{' '}
            </p>
          )}
          {isLoadingMatriz && datosMatriz.length === 0 && (
            <p className="text-sm text-gray-500 p-4 text-center italic">
              Cargando datos de la matriz...
            </p>
          )}
          {!isLoadingMatriz && !errorMatriz && datosMatriz.length === 0 && (
            <p className="text-sm text-gray-500 p-4 text-center bg-gray-50 rounded-md">
              No hay datos generales registrados para el ciclo seleccionado.
            </p>
          )}
          {datosMatriz.length > 0 &&
          Array.isArray(allTableColumns) &&
          allTableColumns.length > 0 ? (
            <div className="overflow-x-auto shadow-md rounded-lg border max-h-[600px]">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    {allTableColumns.map((col) => (
                      <th
                        key={col.key || col.label}
                        scope="col"
                        className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {datosMatriz.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {allTableColumns.map((col) => (
                        <td
                          key={`${row.id}-${col.key || col.label}`}
                          className="px-3 py-2 whitespace-nowrap text-gray-700"
                        >
                          {col.key === 'actions' ? (
                            <button
                              onClick={() => handleDeleteEntry(row)}
                              disabled={deleteStatus.isLoading}
                              className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                              title="Borrar esta entrada"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          ) : col.accessor(row) === null ||
                            typeof col.accessor(row) === 'undefined' ? (
                            '-'
                          ) : (
                            String(col.accessor(row))
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}{' '}
          {/* Fin del renderizado condicional de la tabla */}
        </div>
      )}
      {!selectedCicloCatalogoId && !isLoadingCiclos && (
        <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md mt-4">
          Por favor, seleccione un Ciclo (Catálogo) del desplegable de arriba para ver su resumen.
        </div>
      )}
    </div>
  )
}

export default ResumenMatriz
