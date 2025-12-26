// Ubicación: frontend/src/modules/laboratorio/components/informes/InformeHistorico.jsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiBarChart2, FiPlus, FiX, FiDownload, FiFilter } from 'react-icons/fi';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// CORRECCIÓN DE RUTA: 3 niveles atrás
import { API_BASE_URL } from '../../../core/config/api';

const FASTAPI_BASE_URL = API_BASE_URL;
const lineColors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

export default function InformeHistorico() {
  const [metricOptions] = useState([
    { key: 'resultado_humedad_prom_porc', label: 'Humedad (%)' },
    { key: 'resultado_cenizas_porc', label: 'Cenizas (%)' },
    { key: 'resultado_nitrogeno_total_porc', label: 'N Total (%)' },
    { key: 'resultado_nitrogeno_seca_porc', label: 'N Seca (%)' },
    { key: 'resultado_ph_valor', label: 'pH' },
    { key: 'resultado_fdr_prom_kgf', label: 'FDR (Kgf)' },
  ]);
  const [selectedMetric, setSelectedMetric] = useState('resultado_cenizas_porc');
  const [etapaOptions, setEtapaOptions] = useState([]);
  const [muestraOptions, setMuestraOptions] = useState([]);
  const [origenOptions, setOrigenOptions] = useState([]);
  const [currentSelection, setCurrentSelection] = useState({ etapa_id: '', muestra_id: '', origen_id: '' });
  const [combinations, setCombinations] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [seriesNames, setSeriesNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [isExporting, setIsExporting] = useState(false);
  const exportableChartRef = useRef(null);

  const fetchAllCatalogs = useCallback(async () => {
    try {
      const [etapasRes, muestrasRes, origenesRes] = await Promise.all([
        fetch(`${FASTAPI_BASE_URL}/catalogos/etapas/?limit=1000`),
        fetch(`${FASTAPI_BASE_URL}/catalogos/muestras/?limit=1000`),
        fetch(`${FASTAPI_BASE_URL}/catalogos/origenes/?limit=1000`),
      ]);
      setEtapaOptions(await etapasRes.json() || []);
      setMuestraOptions(await muestrasRes.json() || []);
      setOrigenOptions(await origenesRes.json() || []);
    } catch (err) {
      setError('Error al cargar catálogos para los filtros.');
    }
  }, []);

  useEffect(() => { fetchAllCatalogs(); }, [fetchAllCatalogs]);

  const handleAddCombination = () => {
    if (combinations.length >= 4) {
      setError('Máximo 4 combinaciones permitidas.');
      return;
    }
    if (currentSelection.etapa_id && currentSelection.muestra_id && currentSelection.origen_id) {
      const newCombination = {
        etapa_id: parseInt(currentSelection.etapa_id),
        muestra_id: parseInt(currentSelection.muestra_id),
        origen_id: parseInt(currentSelection.origen_id),
      };
      if (!combinations.some(c => JSON.stringify(c) === JSON.stringify(newCombination))) {
        setCombinations([...combinations, newCombination]);
        setError('');
      }
    }
  };

  const handleRemoveCombination = (indexToRemove) => {
    setCombinations(combinations.filter((_, index) => index !== indexToRemove));
  };

  const fetchChartData = useCallback(async () => {
    if (combinations.length === 0 || !selectedMetric) {
      setChartData([]);
      setSeriesNames([]);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/informes/historico`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrica: selectedMetric,
          combinaciones: combinations,
        }),
      });
      if (!response.ok) throw new Error('No se pudieron cargar los datos históricos.');
      
      const result = await response.json();
      const formattedData = result.data.map(cicloData => {
        const point = { ciclo_nombre: cicloData.ciclo_nombre };
        Object.keys(cicloData.resultados).forEach(serieName => {
          point[serieName] = cicloData.resultados[serieName];
        });
        return point;
      });
      
      setChartData(formattedData);
      setSeriesNames(result.series_nombres);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [combinations, selectedMetric]);

  useEffect(() => { fetchChartData(); }, [fetchChartData]);

  const handleExport = () => {
    if (!exportableChartRef.current) return;
    setIsExporting(true);
    html2canvas(exportableChartRef.current, { scale: 2, backgroundColor: '#ffffff' })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = Math.min((pdfWidth - 40) / canvasWidth, (pdfHeight - 40) / canvasHeight);
        const finalWidth = canvasWidth * ratio;
        const finalHeight = canvasHeight * ratio;
        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;
        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        pdf.save('informe_historico.pdf');
      })
      .finally(() => setIsExporting(false));
  };

  return (
    <div className="space-y-6">
      
      {/* Panel de Configuración */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 border-b border-gray-100 pb-3 gap-4">
            <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                    <FiFilter /> Configuración de Comparativa
                </h3>
                <p className="text-xs text-gray-400 mt-1">Selecciona una métrica y agrega hasta 4 combinaciones para comparar.</p>
            </div>
            <button 
                onClick={handleExport} 
                disabled={isExporting || chartData.length === 0}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
                <FiDownload /> {isExporting ? 'Exportando...' : 'Exportar Gráfico'}
            </button>
         </div>

        <div className="space-y-4">
            {/* Paso 1: Métrica */}
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">1. Variable a Comparar</label>
                <select value={selectedMetric} onChange={e => setSelectedMetric(e.target.value)} className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500">
                    {metricOptions.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                </select>
            </div>

            {/* Paso 2: Combinaciones */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">2. Agregar Serie de Datos</label>
                <div className="flex flex-col md:flex-row gap-2">
                    <select value={currentSelection.etapa_id} onChange={e => setCurrentSelection(p => ({...p, etapa_id: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="">-- Etapa --</option>
                        {etapaOptions.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
                    </select>
                    <select value={currentSelection.muestra_id} onChange={e => setCurrentSelection(p => ({...p, muestra_id: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="">-- Muestra --</option>
                        {muestraOptions.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
                    </select>
                    <select value={currentSelection.origen_id} onChange={e => setCurrentSelection(p => ({...p, origen_id: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="">-- Origen --</option>
                        {origenOptions.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
                    </select>
                    <button onClick={handleAddCombination} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                        <FiPlus size={18} />
                    </button>
                </div>
            </div>

            {/* Paso 3: Tags Activos */}
            {combinations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {combinations.map((comb, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full pl-3 pr-2 py-1 text-xs font-medium text-gray-700">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lineColors[index % lineColors.length] }}></span>
                            {seriesNames[index] || 'Cargando...'}
                            <button onClick={() => handleRemoveCombination(index)} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors">
                                <FiX size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        </div>
      </section>

      {/* Área del Gráfico */}
      <section ref={exportableChartRef} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm min-h-[400px]">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-6 text-center">
             Tendencia Histórica: {metricOptions.find(m => m.key === selectedMetric)?.label}
          </h3>
          
          {isLoading && <div className="h-64 flex items-center justify-center text-brand-600 animate-pulse">Cargando visualización...</div>}
          
          {!isLoading && !error && combinations.length > 0 && chartData.length === 0 && (
             <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                <FiBarChart2 size={32} className="mb-2 opacity-50" />
                <p>No se encontraron datos históricos para esta combinación.</p>
             </div>
          )}

          {!isLoading && chartData.length > 0 && (
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="ciclo_nombre" tick={{fontSize: 11, fill: '#6b7280'}} axisLine={{stroke: '#e5e7eb'}} tickLine={false} dy={10} />
                    <YAxis tick={{fontSize: 11, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                    {seriesNames.map((serie, index) => (
                    <Line 
                        key={serie} 
                        type="monotone" 
                        dataKey={serie} 
                        name={serie} 
                        stroke={lineColors[index % lineColors.length]} 
                        strokeWidth={3}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        dot={{ r: 3, strokeWidth: 0 }}
                    />
                    ))}
                </LineChart>
                </ResponsiveContainer>
            </div>
          )}
      </section>
    </div>
  );
}