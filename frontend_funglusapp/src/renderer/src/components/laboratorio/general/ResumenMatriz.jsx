// src/renderer/src/components/laboratorio/general/ResumenMatriz.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import { allPossibleMetadataFields } from '../../../config/metadataFormFields' // Para las cabeceras

function ResumenMatriz({ cicloId, cicloNombre }) {
  // Recibe el ID del ciclo global
  const [datosMatriz, setDatosMatriz] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Columnas base que siempre se mostrarán (IDs de catálogo)
  const baseColumns = [
    { key: 'etapaNombre', label: 'Etapa' },
    { key: 'muestraNombre', label: 'Muestra' },
    { key: 'origenNombre', label: 'Origen' }
    // Podrías añadir 'key' (ID de DatosGeneralesLaboratorio) si es útil
  ]

  // Columnas de metadatos (basadas en allPossibleMetadataFields)
  const metadataColumns = Object.entries(allPossibleMetadataFields).map(([key, config]) => ({
    key: key,
    label: config.label || key
  }))

  const allTableColumns = [...baseColumns, ...metadataColumns]

  const fetchDatosMatriz = useCallback(async () => {
    if (!cicloId) {
      setDatosMatriz([])
      return
    }
    setIsLoading(true)
    setError('')
    try {
      console.log(`ResumenMatriz: Solicitando datos generales para cicloId: ${cicloId}`)
      const data = await window.electronAPI.getDatosGeneralesByCiclo(cicloId)
      console.log(`ResumenMatriz: Datos recibidos para ciclo ${cicloId}:`, data)

      // El backend devuelve los IDs. Necesitamos mapearlos a nombres.
      // Esto requeriría cargar los catálogos de Etapa, Muestra, Origen.
      // Por ahora, mostraremos los IDs o placeholders si los nombres no vienen.
      // Idealmente, el backend enriquecería esta respuesta con los nombres.

      // Simulación de enriquecimiento (esto debería hacerse con datos reales de catálogos)
      const enrichedData = (data || []).map((item) => ({
        ...item,
        etapaNombre: item.etapa_ref?.nombre || `EtapaID ${item.etapa_id}`, // Asume que el backend devuelve etapa_ref
        muestraNombre:
          item.muestra_ref?.nombre || (item.muestra_id ? `MuestraID ${item.muestra_id}` : 'N/A'),
        origenNombre:
          item.origen_ref?.nombre || (item.origen_id ? `OrigenID ${item.origen_id}` : 'N/A')
      }))
      setDatosMatriz(enrichedData)
    } catch (err) {
      setError(`Error al cargar datos de la matriz: ${err.message}`)
      console.error('Error fetching datos para matriz:', err)
    } finally {
      setIsLoading(false)
    }
  }, [cicloId])

  useEffect(() => {
    fetchDatosMatriz()
  }, [fetchDatosMatriz])

  if (!cicloId) {
    return <p className="text-sm text-gray-500 italic">Selecciona un ciclo para ver el resumen.</p>
  }
  if (isLoading) {
    return <p className="text-sm text-blue-600 italic">Cargando resumen del ciclo...</p>
  }
  if (error) {
    return <p className="text-sm text-red-600 bg-red-100 p-2 rounded">Error: {error}</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={fetchDatosMatriz}
          disabled={isLoading}
          className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 disabled:opacity-50 flex items-center"
          title="Refrescar resumen"
        >
          <FiRefreshCw className={`mr-1.5 h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} /> Refrescar
        </button>
      </div>
      {datosMatriz.length === 0 && (
        <p className="text-sm text-gray-500">
          No hay datos generales registrados para el ciclo:{' '}
          <span className="font-semibold">{cicloNombre || cicloId}</span>.
        </p>
      )}
      {datosMatriz.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-100">
              <tr>
                {allTableColumns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {datosMatriz.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover:bg-gray-50">
                  {allTableColumns.map((col) => (
                    <td
                      key={`${row.id || rowIndex}-${col.key}`}
                      className="px-3 py-2 whitespace-nowrap text-gray-700"
                    >
                      {row[col.key] === null || row[col.key] === undefined
                        ? '-'
                        : String(row[col.key])}
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
