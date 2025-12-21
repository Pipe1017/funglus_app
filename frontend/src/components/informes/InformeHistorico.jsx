import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { FiBarChart2, FiPlus, FiX, FiDownload } from 'react-icons/fi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { API_BASE_URL } from '../../config/api'


const FASTAPI_BASE_URL = API_BASE_URL
const lineColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

function InformeHistorico() {
  // --- Estados del Componente ---
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

  // --- ¡NUEVO ESTADO Y REFERENCIA PARA EXPORTACIÓN! ---
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

  useEffect(() => {
    fetchAllCatalogs();
  }, [fetchAllCatalogs]);

  const handleAddCombination = () => {
    if (combinations.length >= 4) {
      setError('Puedes comparar un máximo de 4 combinaciones.');
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

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  // --- ¡NUEVA FUNCIÓN DE EXPORTACIÓN! ---
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
        const ratio = Math.min((pdfWidth - 40) / canvasWidth, (pdfHeight - 40) / canvasHeight); // Deja un margen de 20pt
        
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
    <div className="mt-8 p-4 bg-white rounded-lg shadow border">
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <h3 className="text-md font-semibold text-gray-700 flex items-center">
          <FiBarChart2 className="inline mr-2 mb-1" />
          Gráfico Histórico Comparativo entre Ciclos
        </h3>
        {/* --- ¡NUEVO BOTÓN DE EXPORTAR! --- */}
        <button 
          onClick={handleExport} 
          disabled={isExporting || chartData.length === 0}
          className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
        >
          <FiDownload className="mr-1.5" />
          {isExporting ? 'Exportando...' : 'Exportar Gráfico'}
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Fila 1: Selectores */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700">1. Seleccione Métrica</label>
            <select value={selectedMetric} onChange={e => setSelectedMetric(e.target.value)} className="mt-1 block w-full">
              {metricOptions.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-700">2. Arme una Combinación para Comparar</label>
            <div className="flex items-center gap-2 mt-1">
              <select value={currentSelection.etapa_id} onChange={e => setCurrentSelection(p => ({...p, etapa_id: e.target.value}))} className="w-full">
                <option value="">-- Etapa --</option>
                {etapaOptions.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
              </select>
              <select value={currentSelection.muestra_id} onChange={e => setCurrentSelection(p => ({...p, muestra_id: e.target.value}))} className="w-full">
                <option value="">-- Muestra --</option>
                {muestraOptions.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
              </select>
              <select value={currentSelection.origen_id} onChange={e => setCurrentSelection(p => ({...p, origen_id: e.target.value}))} className="w-full">
                <option value="">-- Origen --</option>
                {origenOptions.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
              </select>
              <button onClick={handleAddCombination} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                <FiPlus />
              </button>
            </div>
          </div>
        </div>

        {/* Fila 2: Combinaciones Seleccionadas */}
        {combinations.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-700">3. Series a Graficar (Máx. 4)</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {combinations.map((comb, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm">
                  <span>{seriesNames[index] || 'Cargando...'}</span>
                  <button onClick={() => handleRemoveCombination(index)} className="text-red-500 hover:text-red-700">
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* --- ¡NUEVO DIV CONTENEDOR CON LA REFERENCIA! --- */}
        <div ref={exportableChartRef} className="mt-4 bg-white p-2">
          {isLoading && <p className="text-center italic">Cargando gráfico...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!isLoading && !error && combinations.length > 0 && chartData.length === 0 && (
            <p className="text-center text-gray-500">No se encontraron datos históricos para las combinaciones seleccionadas.</p>
          )}
          {!isLoading && chartData.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ciclo_nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                {seriesNames.map((serie, index) => (
                  <Line key={serie} type="monotone" dataKey={serie} name={serie} stroke={lineColors[index % lineColors.length]} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default InformeHistorico;