// Ubicación: frontend/src/modules/laboratorio/pages/InformesPage.jsx
import React, { useState } from 'react';
import { FiPieChart, FiClock, FiFileText } from 'react-icons/fi';
import InformeResumen from '../components/informes/InformeResumen';
import InformeHistorico from '../components/informes/InformeHistorico';

export default function InformesPage() {
  const [activeTab, setActiveTab] = useState('resumen');

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Encabezado Principal */}
      <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
        <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
          <FiFileText size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Centro de Informes</h2>
          <p className="text-sm text-gray-500">Generación de reportes, métricas y consulta histórica.</p>
        </div>
      </div>

      {/* Navegación de Pestañas (Tabs) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-1.5 flex space-x-1 w-full md:w-auto self-start inline-flex">
        <button
          onClick={() => setActiveTab('resumen')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'resumen'
              ? 'bg-brand-50 text-brand-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FiPieChart /> Resumen de Lote
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'historico'
              ? 'bg-brand-50 text-brand-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FiClock /> Histórico Completo
        </button>
      </div>

      {/* Contenido Dinámico */}
      <div className="animate-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'resumen' ? <InformeResumen /> : <InformeHistorico />}
      </div>
    </div>
  );
}