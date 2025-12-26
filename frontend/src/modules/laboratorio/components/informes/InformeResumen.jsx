// Ubicación: frontend/src/modules/laboratorio/components/informes/InformeResumen.jsx
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { FiAlertTriangle, FiLayers, FiRefreshCw, FiDownload, FiBarChart2 } from 'react-icons/fi'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { API_BASE_URL } from '../../../core/config/api'

const FASTAPI_BASE_URL = API_BASE_URL

// --- COMPONENTE DE GRÁFICOS ---
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

  const CustomLineChartTick = ({ x, y, payload }) => {
    const item = procesoData.find(d => d.nombreCompleto === payload.value);
    if (!item) return null;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize="11px" fontWeight="500">
          {item.etapa_nombre}
        </text>
        <text x={0} y={0} dy={28} textAnchor="middle" fill="#999" fontSize="10px">
          {item.muestra_nombre}
        </text>
      </g>
    );
  };

  const CustomBarChartTick = ({ x, y, payload }) => {
    const item = materiaPrimaData.find(d => d.nombreCompleto === payload.value);
    if (!item) return null;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize="11px" fontWeight="500">
          {item.muestra_nombre}
        </text>
        <text x={0} y={0} dy={28} textAnchor="middle" fill="#999" fontSize="10px">
          {item.origen_nombre}
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
    <div className="space-y-8 mt-8 border-t border-gray-100 pt-6">
      <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg border border-gray-200 w-fit">
        <FiBarChart2 className="text-gray-500"/>
        <label htmlFor="metric-select" className="text-sm font-bold text-gray-700">Variable a Graficar:</label>
        <select
          id="metric-select"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="block px-3 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm text-sm focus:ring-brand-500 focus:border-brand-500"
        >
          {metricOptions.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
        </select>
      </div>

      {/* GRÁFICO 1: LÍNEAS (PROCESO) */}
      <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
        <h3 className="font-bold text-gray-700 mb-6 border-b pb-2">Evolución del Proceso ({selectedLabel})</h3>
        {procesoData.length > 0 ? (
           // AQUÍ ESTÁ EL CAMBIO: height={400} explícito
           <ResponsiveContainer width="100%" height={400}>
            <LineChart data={procesoData} margin={{ top: 5, right: 30, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="nombreCompleto" tick={<CustomLineChartTick />} interval={0} height={60} />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}/>
                <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                <Line type="monotone" dataKey={selectedMetric} name={selectedLabel} stroke="#6366f1" strokeWidth={3} activeDot={{ r: 8 }} connectNulls />
            </LineChart>
           </ResponsiveContainer>
        ) : (
            <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                No hay datos de "Proceso" para mostrar.
            </div>
        )}
      </div>

      {/* GRÁFICO 2: BARRAS (MATERIA PRIMA) */}
      <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
        <h3 className="font-bold text-gray-700 mb-6 border-b pb-2">Comparativa de Materia Prima ({selectedLabel})</h3>
        {materiaPrimaData.length > 0 ? (
           // AQUÍ ESTÁ EL CAMBIO: height={400} explícito
           <ResponsiveContainer width="100%" height={400}>
            <BarChart data={materiaPrimaData} margin={{ top: 5, right: 30, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="nombreCompleto" tick={<CustomBarChartTick />} interval={0} height={60} />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}/>
                <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                <Bar dataKey={selectedMetric} name={selectedLabel} fill="#10b981" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
           </ResponsiveContainer>
        ) : (
            <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                No hay datos de "Materia Prima" para mostrar la barra comparativa.
            </div>
        )}
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function InformeResumen() {
  const [ciclos, setCiclos] = useState([]);
  const [selectedCicloId, setSelectedCicloId] = useState('');
  const [informeData, setInformeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const exportableContentRef = useRef(null);

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

  useEffect(() => { fetchCiclos(); }, [fetchCiclos]);
  
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

  useEffect(() => { fetchInforme(); }, [selectedCicloId, fetchInforme]);

  const renderCell = (value) => (typeof value === 'number' ? value.toFixed(2) : (value ?? '-'));
  const formatDate = (dateString) => (!dateString ? '-' : new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }));

  const handleExport = () => {
    if (!exportableContentRef.current) return;
    setIsExporting(true);
    html2canvas(exportableContentRef.current, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = (pdfHeight - imgHeight * ratio) / 2;
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`resumen_ciclo_${selectedCicloId}.pdf`);
      })
      .finally(() => setIsExporting(false));
  };

  return (
    <div className="space-y-4">
      {/* Header de Selección */}
      <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="w-full md:w-2/3">
                <label htmlFor="informeCicloSelect" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <FiLayers /> Seleccione un Ciclo para Consultar:
                </label>
                <div className="flex items-center gap-2">
                    <select
                        id="informeCicloSelect"
                        value={selectedCicloId}
                        onChange={(e) => setSelectedCicloId(e.target.value)}
                        disabled={isLoading}
                        className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    >
                        <option value="">-- Seleccionar Ciclo --</option>
                        {ciclos.map((ciclo) => ( <option key={ciclo.id} value={ciclo.id}>{ciclo.nombre_ciclo}</option> ))}
                    </select>
                    <button onClick={fetchInforme} disabled={isLoading || !selectedCicloId} className="p-2.5 text-gray-500 hover:text-brand-600 bg-gray-50 border border-gray-200 rounded-lg" title="Refrescar informe">
                        <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>
            <button 
              onClick={handleExport} 
              disabled={isExporting || !selectedCicloId || informeData.length === 0}
              className="w-full md:w-auto px-4 py-2.5 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              <FiDownload />
              {isExporting ? 'Exportando...' : 'Descargar PDF'}
            </button>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2"><FiAlertTriangle /> {error}</div>}
      
      {/* Contenido Exportable */}
      <div ref={exportableContentRef} className="bg-white p-2 rounded-xl">
        {selectedCicloId && (
          <>
            {/* Tabla de Resultados */}
            <div className="mt-2 overflow-x-auto shadow-sm rounded-xl border border-gray-200">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50 text-gray-700 font-bold uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Etapa</th>
                    <th className="px-4 py-3 text-left">Muestra</th>
                    <th className="px-4 py-3 text-left">Origen</th>
                    <th className="px-4 py-3 text-left">Fecha</th>
                    <th className="px-4 py-3 text-center">Tipo</th>
                    <th className="px-4 py-3 text-right">Humedad %</th>
                    <th className="px-4 py-3 text-right">Cenizas %</th>
                    <th className="px-4 py-3 text-right text-brand-600">N Total %</th>
                    <th className="px-4 py-3 text-right text-green-600">N Seca %</th>
                    <th className="px-4 py-3 text-right">pH</th>
                    <th className="px-4 py-3 text-right">FDR</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {isLoading && <tr><td colSpan="11" className="p-8 text-center text-brand-500">Cargando datos del informe...</td></tr>}
                  {!isLoading && informeData.length === 0 && <tr><td colSpan="11" className="p-8 text-center text-gray-400">No hay datos registrados para este ciclo.</td></tr>}
                  {!isLoading && informeData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 font-medium text-gray-800">{row.etapa_nombre}</td>
                      <td className="px-4 py-2 text-gray-600">{row.muestra_nombre}</td>
                      <td className="px-4 py-2 text-gray-500">{row.origen_nombre}</td>
                      <td className="px-4 py-2 text-gray-500">{formatDate(row.fecha_ingreso)}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.tipo_agregacion === 'Promedio' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {row.tipo_agregacion} {row.tipo_agregacion === 'Promedio' && `(${row.secuencias_count})`}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">{renderCell(row.resultado_humedad_prom_porc)}</td>
                      <td className="px-4 py-2 text-right">{renderCell(row.resultado_cenizas_porc)}</td>
                      <td className="px-4 py-2 text-right font-bold text-brand-600">{renderCell(row.resultado_nitrogeno_total_porc)}</td>
                      <td className="px-4 py-2 text-right font-bold text-green-600">{renderCell(row.resultado_nitrogeno_seca_porc)}</td>
                      <td className="px-4 py-2 text-right">{renderCell(row.resultado_ph_valor)}</td>
                      <td className="px-4 py-2 text-right">{renderCell(row.resultado_fdr_prom_kgf)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Gráficos */}
            {informeData.length > 0 && <InformeGraficos data={informeData} />}
          </>
        )}
      </div>
    </div>
  );
}