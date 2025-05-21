// src/renderer/src/components/laboratorio/general/ResumenMatriz.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react' // <-- Añade useMemo aquí
import { FiAlertTriangle, FiRefreshCw, FiTrash2 } from 'react-icons/fi' // Añadido FiTrash2, FiAlertTriangle
import { allPossibleMetadataFields } from '../../../config/metadataFormFields'

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'
const DATOS_LABORATORIO_CICLO_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/ciclo`
const DATOS_LABORATORIO_ENTRY_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/entry` // Endpoint para DELETE

/**
 * @component ResumenMatriz
 * @description Muestra una tabla con el resumen de todos los datos generales de laboratorio
 * para un ciclo específico. Permite refrescar los datos y borrar entradas individuales.
 * @param {object} props
 * @param {number|string} props.cicloId - El ID del ciclo activo.
 * @param {string} props.cicloNombre - El nombre del ciclo activo (para mostrar).
 */
function ResumenMatriz({ cicloId, cicloNombre }) {
  const [datosMatriz, setDatosMatriz] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('') // Para errores de carga de la matriz
  const [deleteStatus, setDeleteStatus] = useState({ isLoading: false, error: '', success: '' }) // Estado para la operación de borrado

  // Definición de columnas base para la tabla
  const baseColumns = [
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
      accessor: (row) => row.origen_ref?.nombre || (row.origen_id ? `ID: ${row.origen_id}` : 'N/A')
    }
  ]

  // Campos de metadatos editables (se mostrarán sus valores actuales)
  const metadataDisplayFields = Object.entries(allPossibleMetadataFields).map(([key, config]) => ({
    key: key,
    label: config.label || key,
    accessor: (row) =>
      row[key] === null || typeof row[key] === 'undefined' ? '-' : String(row[key])
  }))

  // Campos calculados en el backend (solo lectura)
  const calculatedBackendFields = [
    { key: 'humedad_prom_porc', label: 'H. Prom. (%)', accessor: (row) => row.humedad_prom_porc },
    { key: 'fdr_prom_kgf', label: 'FDR Prom. (Kgf)', accessor: (row) => row.fdr_prom_kgf },
    {
      key: 'resultado_cenizas_porc',
      label: 'Cenizas Res. (%)',
      accessor: (row) => row.resultado_cenizas_porc
    },
    {
      key: 'resultado_nitrogeno_total_porc',
      label: 'N Total Res. (%)',
      accessor: (row) => row.resultado_nitrogeno_total_porc
    },
    {
      key: 'resultado_nitrogeno_seca_porc',
      label: 'N Seca Res. (%)',
      accessor: (row) => row.resultado_nitrogeno_seca_porc
    }
  ]

  // Unir todas las columnas y asegurar unicidad por 'key'
  // Dando prioridad a las definiciones de baseColumns si hay colisión (poco probable aquí).
  const allTableColumns = useMemo(() => {
    const actionColumn = {
      key: 'actions',
      label: 'Acciones',
      accessor: (row) => row // Pasamos la fila completa para el handler
    }
    const columns = [
      ...baseColumns,
      ...metadataDisplayFields,
      ...calculatedBackendFields,
      actionColumn
    ]
    const uniqueCols = new Map()
    columns.forEach((col) => {
      if (!uniqueCols.has(col.key)) {
        uniqueCols.set(col.key, col)
      }
    })
    return Array.from(uniqueCols.values())
  }, []) // Dependencias vacías si metadataDisplayFields y calculatedBackendFields son estables en cuanto a estructura

  /**
   * @function fetchDatosMatriz
   * @description Carga los datos de la matriz para el ciclo activo desde el backend.
   */
  const fetchDatosMatriz = useCallback(async () => {
    if (!cicloId) {
      setDatosMatriz([])
      setError('')
      return
    }
    setIsLoading(true)
    setError('')
    setDeleteStatus({ isLoading: false, error: '', success: '' }) // Limpiar estado de borrado
    try {
      console.log(`ResumenMatriz: Solicitando datos generales para cicloId: ${cicloId}`)
      const response = await fetch(`${DATOS_LABORATORIO_CICLO_ENDPOINT}/${cicloId}?limit=1000`)

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: `Error HTTP ${response.status}: ${response.statusText}` }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      const data = await response.json()
      console.log(`ResumenMatriz: Datos recibidos para ciclo ${cicloNombre || cicloId}:`, data)
      setDatosMatriz(data || [])
    } catch (err) {
      setError(`Error al cargar datos de la matriz: ${err.message}`)
      console.error('ResumenMatriz: Error fetching datos para matriz:', err)
    } finally {
      setIsLoading(false)
    }
  }, [cicloId, cicloNombre])

  useEffect(() => {
    fetchDatosMatriz()
  }, [fetchDatosMatriz]) // Se ejecuta cuando cambia fetchDatosMatriz (que depende de cicloId)

  /**
   * @function handleDeleteEntry
   * @description Maneja el borrado de una entrada de la matriz.
   * @param {object} rowData - Los datos de la fila a borrar (debe contener las claves).
   */
  const handleDeleteEntry = async (rowData) => {
    const { ciclo_id, etapa_id, muestra_id, origen_id } = rowData // El backend espera estos nombres de clave

    // Construye un string legible para la confirmación
    const etapaNombre = rowData.etapa_ref?.nombre || `Etapa ID ${etapa_id}`
    const muestraNombre =
      rowData.muestra_ref?.nombre || (muestra_id ? `Muestra ID ${muestra_id}` : 'N/A')
    const origenNombre =
      rowData.origen_ref?.nombre || (origen_id ? `Origen ID ${origen_id}` : 'N/A')
    const entryDescription = `${etapaNombre}, ${muestraNombre}, ${origenNombre}`

    if (
      !window.confirm(
        `¿Estás seguro de que quieres borrar la entrada: ${entryDescription} del ciclo ${cicloNombre || ciclo_id}? Esta acción no se puede deshacer.`
      )
    ) {
      return
    }

    setDeleteStatus({ isLoading: true, error: '', success: '' })

    // El backend espera las claves en el cuerpo de la solicitud DELETE
    const keysForDelete = {
      ciclo_id: ciclo_id, // El backend espera ciclo_id de la fila, no el cicloId global de la prop
      etapa_id: etapa_id,
      muestra_id: muestra_id,
      origen_id: origen_id
    }
    console.log('ResumenMatriz: Intentando borrar entrada con claves:', keysForDelete)

    try {
      const response = await fetch(DATOS_LABORATORIO_ENTRY_ENDPOINT, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keysForDelete)
      })

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: `Error HTTP ${response.status}: ${response.statusText}` }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }

      const result = await response.json() // Esperamos un mensaje del backend
      setDeleteStatus({
        isLoading: false,
        error: '',
        success: result.message || 'Entrada borrada exitosamente.'
      })
      fetchDatosMatriz() // Recargar la matriz para reflejar el borrado
    } catch (err) {
      setDeleteStatus({
        isLoading: false,
        error: `Error al borrar entrada: ${err.message}`,
        success: ''
      })
      console.error('ResumenMatriz: Error deleting entry:', err)
    } finally {
      setTimeout(() => {
        // Limpiar mensajes de borrado después de un tiempo, solo si no hay error persistente
        if (deleteStatus.error === '' || !deleteStatus.isLoading) {
          // Verificación adicional
          setDeleteStatus((prev) => ({ ...prev, success: '', error: '' }))
        }
      }, 4000)
    }
  }

  // --- Renderizado Condicional ---
  if (!cicloId) {
    return (
      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md">
        Selecciona un Ciclo de Trabajo para ver el resumen de datos.
      </div>
    )
  }

  if (isLoading && datosMatriz.length === 0) {
    // Mostrar cargando solo si es la carga inicial
    return (
      <p className="text-sm text-gray-500 p-4 text-center italic">
        Cargando resumen de la matriz...
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-700">
          Resumen de Datos para Ciclo:{' '}
          <span className="text-indigo-600">{cicloNombre || cicloId}</span>
        </h3>
        <button
          onClick={fetchDatosMatriz}
          disabled={isLoading || deleteStatus.isLoading}
          className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 disabled:opacity-50 flex items-center"
          title="Refrescar resumen"
        >
          <FiRefreshCw className={`mr-1.5 h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} /> Refrescar
        </button>
      </div>

      {/* Mensajes de estado para la operación de borrado */}
      {deleteStatus.error && (
        <p className="my-2 text-xs p-2.5 rounded-md border bg-red-50 text-red-700 border-red-300 flex items-center">
          <FiAlertTriangle className="mr-2 h-4 w-4 text-red-500" /> {deleteStatus.error}
        </p>
      )}
      {deleteStatus.success && (
        <p className="my-2 text-xs p-2.5 rounded-md border bg-green-50 text-green-700 border-green-300">
          {deleteStatus.success}
        </p>
      )}
      {error &&
        !isLoading && ( // Mostrar error de carga de matriz solo si no está cargando y hay error
          <p className="my-2 text-xs p-2.5 rounded-md border bg-red-50 text-red-700 border-red-300 flex items-center">
            <FiAlertTriangle className="mr-2 h-4 w-4 text-red-500" /> {error}
          </p>
        )}

      {datosMatriz.length === 0 && !isLoading && !error && (
        <p className="text-sm text-gray-500 p-4 text-center bg-gray-50 rounded-md">
          No hay datos generales registrados para el ciclo:{' '}
          <span className="font-semibold">{cicloNombre || cicloId}</span>.
        </p>
      )}

      {datosMatriz.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg border max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {allTableColumns.map((col) => (
                  <th
                    key={col.key}
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
                      key={`${row.id}-${col.key}`}
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
                      ) : col.accessor(row) === null || typeof col.accessor(row) === 'undefined' ? (
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
      )}
    </div>
  )
}
export default ResumenMatriz
