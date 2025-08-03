import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FiAlertTriangle, FiLayers, FiRefreshCw } from 'react-icons/fi'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'

// --- COMPONENTE PARA LOS GRÁFICOS (VERSIÓN CON EJE X MEJORADO) ---
function InformeGraficos({ data }) {
  const [selectedMetric, setSelectedMetric] = useState('resultado_cenizas_porc');

  const metricOptions = [
    { key: 'resultado_humedad_prom_porc', label: 'Humedad (%)' },
    { key: 'resultado_cenizas_porc', label: 'Cenizas (%)' },
    { key: 'resultado_nitrogeno_total_porc', label: 'N Total (%)' },
    { key: 'resultado_nitrogeno_seca_porc', label: 'N Seca (%)' },
    { key: 'resultado_ph_valor', label: 'pH' },
    { key: 'resultado_fdr_prom_kgf', label: 'FDR (Kgf)' },
  ];

  // --- ¡NUEVO! Componente para la etiqueta del gráfico de LÍNEAS ---
  const CustomLineChartTick = ({ x, y, payload }) => {
    const item = procesoData.find(d => d.nombreCompleto === payload.value);
    if (!item) return null;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize="12px">
          {item.etapa_nombre}
        </text>
        <text x={0} y={0} dy={30} textAnchor="middle" fill="#999" fontSize="10px">
          ({`${item.muestra_nombre} - ${item.origen_nombre}`})
        </text>
      </g>
    );
  };

  const CustomBarChartTick = ({ x, y, payload }) => {
    const item = materiaPrimaData.find(d => d.nombreCompleto === payload.value);
    if (!item) return null;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize="12px">
          {item.muestra_nombre}
        </text>
        <text x={0} y={0} dy={30} textAnchor="middle" fill="#999" fontSize="10px">
          ({item.origen_nombre})
        </text>
      </g>
    );
  };

  const { procesoData, materiaPrimaData } = useMemo(() => {
    const dataConNombreCompleto = data.map(item => ({
      ...item,
      nombreCompleto: `${item.etapa_nombre} - ${item.muestra_nombre} - ${item.origen_nombre}`
    }));

    const proceso = dataConNombreCompleto
      .filter(item => item.etapa_nombre === 'Proceso')
      .sort((a, b) => new Date(a.fecha_ingreso) - new Date(b.fecha_ingreso));

    const materiaPrima = dataConNombreCompleto
      .filter(item => item.etapa_nombre === 'Materia Prima')
      .sort((a, b) => new Date(a.fecha_ingreso) - new Date(b.fecha_ingreso));

    return { procesoData: proceso, materiaPrimaData: materiaPrima };
  }, [data]);

  const selectedLabel = metricOptions.find(opt => opt.key === selectedMetric)?.label || '';

  return (
    <div className="space-y-8 mt-8">
      <div className="flex items-center space-x-4">
        <label htmlFor="metric-select" className="text-sm font-medium">Seleccionar Métrica para Graficar:</label>
        <select
          id="metric-select"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="block px-3 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm text-sm"
        >
          {metricOptions.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
        </select>
      </div>

      {/* GRÁFICO DE LÍNEAS PARA PROCESO (MODIFICADO) */}
      <div className="p-4 border rounded-lg bg-white">
        <h3 className="font-semibold mb-4">Evolución del Proceso ({selectedLabel})</h3>
        <ResponsiveContainer width="100%" height={350}>
          {/* --- ¡LÍNEA MODIFICADA! Se aumentan los márgenes izquierdo y derecho --- */}
          <LineChart data={procesoData} margin={{ top: 5, right: 50, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombreCompleto" tick={<CustomLineChartTick />} interval={0} height={50} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={selectedMetric} name={selectedLabel} stroke="#8884d8" activeDot={{ r: 8 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* GRÁFICO DE BARRAS PARA MATERIA PRIMA (sin cambios) */}
      <div className="p-4 border rounded-lg bg-white">
        <h3 className="font-semibold mb-4">Comparativa de Materia Prima ({selectedLabel})</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={materiaPrimaData} margin={{ top: 5, right: 20, left: -10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombreCompleto" tick={<CustomBarChartTick />} interval={0} height={50} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={selectedMetric} name={selectedLabel} fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


// --- COMPONENTE PRINCIPAL ---
function InformeResumen() {
  const [ciclos, setCiclos] = useState([]);
  const [selectedCicloId, setSelectedCicloId] = useState('');
  const [informeData, setInformeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCiclos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/catalogos/ciclos/?limit=1000`);
      if (!response.ok) throw new Error('No se pudieron cargar los ciclos.');
      const data = await response.json();
      setCiclos(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCiclos();
  }, [fetchCiclos]);
  
  const fetchInforme = useCallback(async () => {
    if (!selectedCicloId) {
      setInformeData([]);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/informes/resumen/${selectedCicloId}`);
      if (!response.ok) throw new Error('Error al cargar el informe.');
      const data = await response.json();
      setInformeData(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCicloId]);

  useEffect(() => {
    fetchInforme();
  }, [selectedCicloId]);

  const renderCell = (value) => {
    if (typeof value === 'number') return value.toFixed(2);
    return value ?? '-';
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

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
            className="block w-full md:w-1/2 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
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
        <>
          <div className="mt-4 overflow-x-auto shadow-md rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Etapa</th>
                  <th className="px-3 py-2 text-left font-semibold">Muestra</th>
                  <th className="px-3 py-2 text-left font-semibold">Origen</th>
                  <th className="px-3 py-2 text-left font-semibold">Fecha Ingreso</th>
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
                {isLoading && <tr><td colSpan="11" className="p-4 text-center italic">Cargando...</td></tr>}
                {!isLoading && informeData.length === 0 && <tr><td colSpan="11" className="p-4 text-center">No hay datos.</td></tr>}
                {!isLoading && informeData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{row.etapa_nombre}</td>
                    <td className="px-3 py-2">{row.muestra_nombre}</td>
                    <td className="px-3 py-2">{row.origen_nombre}</td>
                    <td className="px-3 py-2">{formatDate(row.fecha_ingreso)}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${row.tipo_agregacion === 'Promedio' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
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
          
          {informeData.length > 0 && <InformeGraficos data={informeData} />}
        </>
      )}
    </div>
  );
}

export default InformeResumen;