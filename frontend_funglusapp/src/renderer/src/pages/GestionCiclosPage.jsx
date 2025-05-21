// src/renderer/src/pages/GestionCiclosPage.jsx
import React, { useState } from 'react'
import CiclosManager from '../components/catalogos/CiclosManager' // Para Ciclos Generales
import CiclosProcesamientoNitrogenoManager from '../components/procesamiento/CiclosProcesamientoNitrogenoManager' // ¡Nuevo! Asegúrate que la ruta sea correcta

const TABS = {
  GENERALES: 'Ciclos Generales',
  PROCESAMIENTO_NITROGENO: 'Ciclos de Procesamiento (Nitrógeno)'
  // PROCESAMIENTO_CENIZAS: 'Ciclos de Procesamiento (Cenizas)', // Para el futuro
}

function GestionCiclosPage() {
  const [activeTab, setActiveTab] = useState(TABS.GENERALES)

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case TABS.GENERALES:
        return <CiclosManager />
      case TABS.PROCESAMIENTO_NITROGENO:
        return <CiclosProcesamientoNitrogenoManager />
      // case TABS.PROCESAMIENTO_CENIZAS:
      //   return <div>Gestión de Ciclos de Procesamiento de Cenizas (Próximamente)</div>;
      default:
        return <CiclosManager />
    }
  }

  const getTabButtonClass = (tabName) => {
    return `px-4 py-2.5 text-sm font-medium rounded-t-lg focus:outline-none transition-colors duration-150 ease-in-out
            ${
              activeTab === tabName
                ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Ciclos</h1>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-2" aria-label="Tabs">
          <button
            onClick={() => setActiveTab(TABS.GENERALES)}
            className={getTabButtonClass(TABS.GENERALES)}
          >
            {TABS.GENERALES}
          </button>
          <button
            onClick={() => setActiveTab(TABS.PROCESAMIENTO_NITROGENO)}
            className={getTabButtonClass(TABS.PROCESAMIENTO_NITROGENO)}
          >
            {TABS.PROCESAMIENTO_NITROGENO}
          </button>
          {/* // Futura pestaña para Cenizas
          <button
            onClick={() => setActiveTab(TABS.PROCESAMIENTO_CENIZAS)}
            className={getTabButtonClass(TABS.PROCESAMIENTO_CENIZAS)}
          >
            {TABS.PROCESAMIENTO_CENIZAS}
          </button>
          */}
        </nav>
      </div>

      <div className="mt-4">
        {' '}
        {/* El contenido de la pestaña se renderiza aquí */}
        {/* No es necesario el div con clase p-6 bg-white... si los managers ya tienen su propio padding y fondo */}
        {renderActiveTabContent()}
      </div>
    </div>
  )
}

export default GestionCiclosPage
