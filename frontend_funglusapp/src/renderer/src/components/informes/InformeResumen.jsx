import React, { useCallback, useEffect, useState } from 'react'
import { FiAlertTriangle, FiBarChart2, FiRefreshCw, FiLayers } from 'react-icons/fi'

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'

function InformeResumen() {
  const [ciclos, setCiclos] = useState([])
  const [selectedCicloId, setSelectedCicloId] = useState('')
  const [informeData, setInformeData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchCiclos = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/catalogos/ciclos/?limit=1000`)
      if (!response.ok) throw new Error('No se pudieron cargar los ciclos.')
      const data = await response.json()
      setCiclos(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCiclos()
  }, [fetchCiclos])

  const fetchInforme = useCallback(async () => {
    if (!selectedCicloId) {
      setInformeData([])
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/informes/resumen/${selectedCicloId}`)
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || 'Error al cargar el informe.')
      }
      const data = await response.json()
      setInformeData(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCicloId])

  useEffect(() => {
    fetchInforme()
  }, [fetchInforme])

  const renderCell = (value) => {
    if (typeof value === 'number') return value.toFixed(2)
    return value ?? '-'
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg border">
        <label htmlFor="informeCicloSelect" className="block text-sm font-medium text-gray-700 mb-1">
          <FiLayers className="inline mr-2" />
          Seleccione un Ciclo para ver su Resumen:
        </label>
        <div className="flex items-center gap-x-2">
          <select
            id="informeCicloSelect"
            value={selectedCicloId}
            onChange={(e) => setSelectedCicloId(e.target.value)}
            disabled={isLoading}
            className="block w-full md:w-1/2 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm input-std"
          >
            <option value="">-- Seleccione un Ciclo --</option>
            {ciclos.map((ciclo) => ( <option key={ciclo.id} value={ciclo.id}>{ciclo.nombre_ciclo}</option> ))}
          </select>
          <button onClick={fetchInforme} disabled={isLoading || !selectedCicloId} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-200" title="Refrescar informe">
            <FiRefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 p-3 bg-red-50 border rounded"><FiAlertTriangle className="inline mr-2" />{error}</p>}
      
      {selectedCicloId && (
        <div className="mt-4 overflow-x-auto shadow-md rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Etapa</th>
                <th className="px-3 py-2 text-left font-semibold">Muestra</th>
                <th className="px-3 py-2 text-left font-semibold">Origen</th>
                <th className="px-3 py-2 text-center font-semibold">Tipo</th>
                <th className="px-3 py-2 text-right font-semibold">Humedad (%)</th>
                <th className="px-3 py-2 text-right font-semibold">Cenizas (%)</th>
                <th className="px-3 py-2 text-right font-semibold">N Total (%)</th>
                <th className="px-3 py-2 text-right font-semibold">N Seca (%)</th>
                <th className="px-3 py-2 text-right font-semibold">pH</th>
                <th className="px-3 py-2 text-right font-semibold">FDR (Kgf)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {isLoading && <tr><td colSpan="8" className="p-4 text-center italic">Cargando datos del informe...</td></tr>}
              {!isLoading && informeData.length === 0 && <tr><td colSpan="8" className="p-4 text-center text-gray-500">No hay datos para el ciclo seleccionado.</td></tr>}
              {!isLoading && informeData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">{row.etapa_nombre}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.muestra_nombre}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.origen_nombre}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.tipo_agregacion === 'Promedio' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {row.tipo_agregacion} {row.tipo_agregacion === 'Promedio' && `(${row.secuencias_count})`}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">{renderCell(row.resultado_humedad_prom_porc)}</td>
                  <td className="px-3 py-2 text-right">{renderCell(row.resultado_cenizas_porc)}</td>
                  <td className="px-3 py-2 text-right">{renderCell(row.resultado_nitrogeno_total_porc)}</td>
                  <td className="px-3 py-2 text-right">{renderCell(row.resultado_nitrogeno_seca_porc)}</td>
                  <td className="px-3 py-2 text-right">{renderCell(row.resultado_ph_valor)}</td>
                  <td className="px-3 py-2 text-right">{renderCell(row.resultado_fdr_prom_kgf)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default InformeResumen