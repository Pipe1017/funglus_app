// Ubicación: frontend/src/modules/laboratorio/components/informes/InformeResumen.jsx
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { FiAlertTriangle, FiLayers, FiRefreshCw, FiDownload, FiBarChart2, FiMessageSquare, FiEdit2, FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { API_BASE_URL } from '../../../core/config/api'

const FASTAPI_BASE_URL = API_BASE_URL

// --- COMPONENTE PRINCIPAL ---
export default function InformeResumen() {
  const navigate = useNavigate()
  const [ciclos, setCiclos] = useState([]);
  const [selectedCicloId, setSelectedCicloId] = useState('');
  const [informeData, setInformeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const exportableContentRef = useRef(null);
  
  // Estados para notas
  const [notas, setNotas] = useState({})
  const [notaModalOpen, setNotaModalOpen] = useState(false)
  const [currentNotaRow, setCurrentNotaRow] = useState(null)
  const [notaText, setNotaText] = useState('')
  const [isSavingNota, setIsSavingNota] = useState(false)
  
  // Verificar permisos
  const allowedModules = JSON.parse(localStorage.getItem('allowed_modules') || '[]')
  const canEditLaboratorio = allowedModules.includes('laboratorio')
  const token = localStorage.getItem('token')

  const fetchCiclos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/catalogos/ciclos/?limit=1000`);
      if (!response.ok) throw new Error('No se pudieron cargar los ciclos.');
      const data = await response.json();
      setCiclos(data || []);
      
      // Cargar último ciclo visto
      const lastCiclo = localStorage.getItem('last_informe_ciclo');
      if (lastCiclo && data.some(c => c.id === parseInt(lastCiclo))) {
        setSelectedCicloId(lastCiclo);
      }
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
    
    // Guardar último ciclo visto
    localStorage.setItem('last_informe_ciclo', selectedCicloId);
    
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

  // Función para redirigir a la sección correspondiente
  const handleCellClick = (section, row) => {
    if (!canEditLaboratorio) return
    
    // Construimos los parámetros comunes para identificar la fila exacta
    const commonParams = `ciclo=${row.ciclo_id}&etapa=${row.etapa_id}&muestra=${row.muestra_id}&origen=${row.origen_id}`;

    if (section === 'general') {
      navigate(`/laboratorio/general?${commonParams}`)
    } else if (section === 'cenizas' || section === 'nitrogeno') {
      const path = section === 'cenizas' ? '/laboratorio/cenizas' : '/laboratorio/nitrogeno'
      // MODIFICADO: Ahora enviamos todos los parámetros también para Cenizas y Nitrógeno
      navigate(`${path}?${commonParams}`)
    }
  }
  
  // Cargar notas para el ciclo actual
  const fetchNotas = useCallback(async () => {
    if (!selectedCicloId) return
    
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/notas-informe/?ciclo_id=${selectedCicloId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Error al cargar notas')
      
      const data = await response.json()
      
      // Organizar notas por clave de registro
      const notasPorRegistro = {}
      data.forEach(nota => {
        const key = `${nota.ciclo_id}-${nota.etapa_id}-${nota.muestra_id}-${nota.origen_id}-${nota.secuencia_id || 'null'}`
        if (!notasPorRegistro[key]) {
          notasPorRegistro[key] = []
        }
        notasPorRegistro[key].push(nota)
      })
      
      setNotas(notasPorRegistro)
    } catch (err) {
      console.error('Error cargando notas:', err)
    }
  }, [selectedCicloId, token])
  
  useEffect(() => { fetchNotas() }, [fetchNotas])
  
  // Abrir modal de nota
  const handleOpenNotaModal = (row) => {
    setCurrentNotaRow(row)
    const key = `${row.ciclo_id}-${row.etapa_id}-${row.muestra_id}-${row.origen_id}-${row.secuencia_id || 'null'}`
    const existingNotas = notas[key] || []
    setNotaText(existingNotas.length > 0 ? existingNotas[0].nota : '')
    setNotaModalOpen(true)
  }
  
  // Guardar nota
  const handleSaveNota = async () => {
    if (!notaText.trim() || !currentNotaRow) return
    
    setIsSavingNota(true)
    try {
      const payload = {
        ciclo_id: currentNotaRow.ciclo_id,
        etapa_id: currentNotaRow.etapa_id,
        muestra_id: currentNotaRow.muestra_id,
        origen_id: currentNotaRow.origen_id,
        secuencia_id: currentNotaRow.secuencia_id || null,
        nota: notaText
      }
      
      const response = await fetch(`${FASTAPI_BASE_URL}/notas-informe/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) throw new Error('Error al guardar nota')
      
      await fetchNotas() // Recargar notas
      setNotaModalOpen(false)
      setNotaText('')
      setCurrentNotaRow(null)
    } catch (err) {
      alert('Error al guardar la nota: ' + err.message)
    } finally {
      setIsSavingNota(false)
    }
  }
  
  // Eliminar nota
  const handleDeleteNota = async (notaId) => {
    if (!confirm('¿Estás seguro de eliminar esta nota?')) return
    
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/notas-informe/${notaId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!response.ok) throw new Error('Error al eliminar nota')
      
      await fetchNotas() // Recargar notas
    } catch (err) {
      alert('Error al eliminar la nota: ' + err.message)
    }
  }
  
  // Obtener notas para una fila
  const getNotasForRow = (row) => {
    const key = `${row.ciclo_id}-${row.etapa_id}-${row.muestra_id}-${row.origen_id}-${row.secuencia_id || 'null'}`
    return notas[key] || []
  }

  const renderCell = (value) => (typeof value === 'number' ? value.toFixed(2) : (value ?? '-'));
  const formatDate = (dateString) => (!dateString ? '-' : new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }));

  const handleExport = async () => {
    if (!exportableContentRef.current) return;
    setIsExporting(true);
    
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;
      const contentWidth = pageWidth - (margin * 2);
      
      // ===== PÁGINA 1: TABLA =====
      const tablaElement = exportableContentRef.current.querySelector('.overflow-x-auto');
      if (tablaElement) {
        const tablaCanvas = await html2canvas(tablaElement, { scale: 2, backgroundColor: '#ffffff' });
        const tablaImgData = tablaCanvas.toDataURL('image/png');
        const tablaImgWidth = contentWidth;
        const tablaImgHeight = (tablaCanvas.height * tablaImgWidth) / tablaCanvas.width;
        
        // Título
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text(`Resumen de Ciclo ${selectedCicloId}`, margin, margin);
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        pdf.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, margin, margin + 20);
        
        // Tabla
        pdf.addImage(tablaImgData, 'PNG', margin, margin + 40, tablaImgWidth, tablaImgHeight);
      }
      
      // ===== GRÁFICOS: 3 POR PÁGINA =====
      const graficos = exportableContentRef.current.querySelectorAll('.p-5.border.border-gray-200.rounded-xl.bg-white.shadow-sm');
      const graficosPerPage = 3;
      const graficoHeight = (pageHeight - (margin * 2) - 40) / graficosPerPage; // Espacio para 3 gráficos + separación
      
      for (let i = 0; i < graficos.length; i++) {
        // Nueva página cada 3 gráficos
        if (i % graficosPerPage === 0) {
          pdf.addPage();
        }
        
        const graficoCanvas = await html2canvas(graficos[i], { 
          scale: 1.5, 
          backgroundColor: '#ffffff',
          logging: false 
        });
        
        const graficoImgData = graficoCanvas.toDataURL('image/png');
        const graficoImgWidth = contentWidth;
        const calculatedHeight = (graficoCanvas.height * graficoImgWidth) / graficoCanvas.width;
        
        // Ajustar altura si es muy grande
        const finalHeight = Math.min(calculatedHeight, graficoHeight - 10);
        
        // Posición Y según el índice dentro de la página
        const positionInPage = i % graficosPerPage;
        const yPosition = margin + (positionInPage * graficoHeight);
        
        pdf.addImage(graficoImgData, 'PNG', margin, yPosition, graficoImgWidth, finalHeight);
      }
      
      pdf.save(`resumen_ciclo_${selectedCicloId}.pdf`);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert('Error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setIsExporting(false);
    }
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
                    <th className="px-4 py-3 text-center">Notas</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {isLoading && <tr><td colSpan="12" className="p-8 text-center text-brand-500">Cargando datos del informe...</td></tr>}
                  {!isLoading && informeData.length === 0 && <tr><td colSpan="12" className="p-8 text-center text-gray-400">No hay datos registrados para este ciclo.</td></tr>}
                  {!isLoading && informeData.map((row, index) => {
                    const rowNotas = getNotasForRow(row)
                    return (
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
                      {/* Celdas clickeables para Datos Generales */}
                      <td 
                        className={`px-4 py-2 text-right ${canEditLaboratorio ? 'cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:font-semibold transition-all' : ''}`}
                        onClick={() => handleCellClick('general', row)}
                        title={canEditLaboratorio ? '✏️ Click para editar en Datos Generales' : ''}
                      >
                        {renderCell(row.resultado_humedad_prom_porc)}
                      </td>
                      <td 
                        className={`px-4 py-2 text-right ${canEditLaboratorio ? 'cursor-pointer hover:bg-purple-50 hover:text-purple-700 hover:font-semibold transition-all' : ''}`}
                        onClick={() => handleCellClick('cenizas', row)}
                        title={canEditLaboratorio ? '✏️ Click para editar en Cenizas' : ''}
                      >
                        {renderCell(row.resultado_cenizas_porc)}
                      </td>
                      <td 
                        className={`px-4 py-2 text-right font-bold text-brand-600 ${canEditLaboratorio ? 'cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition-all' : ''}`}
                        onClick={() => handleCellClick('nitrogeno', row)}
                        title={canEditLaboratorio ? '✏️ Click para editar en Nitrógeno' : ''}
                      >
                        {renderCell(row.resultado_nitrogeno_total_porc)}
                      </td>
                      <td 
                        className={`px-4 py-2 text-right font-bold text-green-600 ${canEditLaboratorio ? 'cursor-pointer hover:bg-green-50 hover:text-green-700 transition-all' : ''}`}
                        onClick={() => handleCellClick('nitrogeno', row)}
                        title={canEditLaboratorio ? '✏️ Click para editar en Nitrógeno' : ''}
                      >
                        {renderCell(row.resultado_nitrogeno_seca_porc)}
                      </td>
                      <td 
                        className={`px-4 py-2 text-right ${canEditLaboratorio ? 'cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:font-semibold transition-all' : ''}`}
                        onClick={() => handleCellClick('general', row)}
                        title={canEditLaboratorio ? '✏️ Click para editar en Datos Generales' : ''}
                      >
                        {renderCell(row.resultado_ph_valor)}
                      </td>
                      <td 
                        className={`px-4 py-2 text-right ${canEditLaboratorio ? 'cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:font-semibold transition-all' : ''}`}
                        onClick={() => handleCellClick('general', row)}
                        title={canEditLaboratorio ? '✏️ Click para editar en Datos Generales' : ''}
                      >
                        {renderCell(row.resultado_fdr_prom_kgf)}
                      </td>
                      {/* Columna de Notas */}
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleOpenNotaModal(row)}
                          className={`p-1.5 rounded-lg transition-colors ${rowNotas.length > 0 ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                          title={rowNotas.length > 0 ? `${rowNotas.length} nota(s)` : 'Agregar nota'}
                        >
                          <FiMessageSquare size={14} />
                          {rowNotas.length > 0 && <span className="ml-1 text-xs font-bold">{rowNotas.length}</span>}
                        </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
            
            {/* Gráficos - TODAS LAS MÉTRICAS */}
            {informeData.length > 0 && (() => {
              const metricOptions = [
                { key: 'resultado_humedad_prom_porc', label: 'Humedad (%)', color: '#3b82f6' },
                { key: 'resultado_cenizas_porc', label: 'Cenizas (%)', color: '#8b5cf6' },
                { key: 'resultado_nitrogeno_total_porc', label: 'N Total (%)', color: '#6366f1' },
                { key: 'resultado_nitrogeno_seca_porc', label: 'N Seca (%)', color: '#10b981' },
                { key: 'resultado_ph_valor', label: 'pH', color: '#f59e0b' },
                { key: 'resultado_fdr_prom_kgf', label: 'FDR (Kgf)', color: '#ef4444' },
              ];

              const dataConNombreCompleto = informeData.map(item => ({
                ...item,
                nombreCompleto: `${item.etapa_nombre} - ${item.muestra_nombre} - ${item.origen_nombre}`
              }));

              const procesoData = dataConNombreCompleto
                .filter(item => item.etapa_nombre.toLowerCase() === 'proceso')
                .sort((a, b) => new Date(a.fecha_ingreso) - new Date(b.fecha_ingreso));

              const materiaPrimaData = dataConNombreCompleto
                .filter(item => item.etapa_nombre.toLowerCase().replace('_', ' ') === 'materia prima')
                .sort((a, b) => new Date(a.fecha_ingreso) - new Date(b.fecha_ingreso));

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

              return (
                <div className="space-y-8 mt-8 border-t border-gray-100 pt-6">
                  <div className="bg-brand-50 p-3 rounded-lg border border-brand-200">
                    <p className="text-sm font-semibold text-brand-700 flex items-center gap-2">
                      <FiBarChart2 /> Visualización Completa - Todas las Métricas
                    </p>
                  </div>

                  {metricOptions.map((metric) => (
                    <React.Fragment key={metric.key}>
                      {/* Gráfico de Líneas - Proceso */}
                      <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
                        <h3 className="font-bold text-gray-700 mb-6 border-b pb-2">
                          Evolución del Proceso - {metric.label}
                        </h3>
                        {procesoData.length > 0 ? (
                          <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={procesoData} margin={{ top: 5, right: 30, left: 10, bottom: 40 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="nombreCompleto" tick={<CustomLineChartTick />} interval={0} height={60} />
                              <YAxis />
                              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}/>
                              <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                              <Line type="monotone" dataKey={metric.key} name={metric.label} stroke={metric.color} strokeWidth={3} activeDot={{ r: 8 }} connectNulls />
                            </LineChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                            No hay datos de "Proceso" para mostrar.
                          </div>
                        )}
                      </div>

                      {/* Gráfico de Barras - Materia Prima */}
                      <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
                        <h3 className="font-bold text-gray-700 mb-6 border-b pb-2">
                          Comparativa de Materia Prima - {metric.label}
                        </h3>
                        {materiaPrimaData.length > 0 ? (
                          <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={materiaPrimaData} margin={{ top: 5, right: 30, left: 10, bottom: 40 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="nombreCompleto" tick={<CustomBarChartTick />} interval={0} height={60} />
                              <YAxis />
                              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}/>
                              <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                              <Bar dataKey={metric.key} name={metric.label} fill={metric.color} radius={[4, 4, 0, 0]} barSize={50} />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                            No hay datos de "Materia Prima" para mostrar.
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* Modal de Notas */}
      {notaModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FiMessageSquare /> Nota del Registro
              </h3>
              <button 
                onClick={() => setNotaModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Info del registro */}
              {currentNotaRow && (
                <div className="bg-gray-50 p-3 rounded-lg text-xs">
                  <p className="font-semibold text-gray-700">
                    {currentNotaRow.etapa_nombre} - {currentNotaRow.muestra_nombre} - {currentNotaRow.origen_nombre}
                  </p>
                </div>
              )}

              {/* Notas existentes */}
              {currentNotaRow && getNotasForRow(currentNotaRow).length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Notas anteriores:</p>
                  {getNotasForRow(currentNotaRow).map((nota) => {
                    const userEmail = localStorage.getItem('email');
                    const userRole = localStorage.getItem('role');
                    const canDelete = nota.usuario_email === userEmail || userRole === 'admin';
                    
                    return (
                      <div key={nota.id} className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm relative">
                        <p className="text-gray-800 pr-8">{nota.nota}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Por {nota.usuario_nombre || nota.usuario_email} - {new Date(nota.created_at).toLocaleString('es-CO')}
                        </p>
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteNota(nota.id)}
                            className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                            title="Eliminar nota"
                          >
                            <FiX size={16} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Campo de nueva nota */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Nota:
                </label>
                <textarea
                  value={notaText}
                  onChange={(e) => setNotaText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Escribe tu comentario o nota aquí..."
                />
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-200">
              <button
                onClick={() => setNotaModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNota}
                disabled={isSavingNota || !notaText.trim()}
                className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingNota ? 'Guardando...' : 'Guardar Nota'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}