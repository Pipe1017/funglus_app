// src/renderer/src/pages/GestionCiclosPage.jsx
import React, { useState } from 'react'
import CiclosManager from '../components/catalogos/CiclosManager'
import CiclosProcesamientoCenizasManager from '../components/procesamiento/CiclosProcesamientoCenizasManager' // <-- ¡NUEVA IMPORTACIÓN!
import CiclosProcesamientoNitrogenoManager from '../components/procesamiento/CiclosProcesamientoNitrogenoManager'

const TABS = {
  GENERALES: 'Ciclos Generales (Catálogo)', // Etiqueta más clara
  PROCESAMIENTO_NITROGENO: 'Lotes de Procesamiento (Nitrógeno)', // Etiqueta más clara
  PROCESAMIENTO_CENIZAS: 'Lotes de Procesamiento (Cenizas)' // <-- NUEVA PESTAÑA
}

function GestionCiclosPage() {
  const [activeTab, setActiveTab] = useState(TABS.GENERALES)

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case TABS.GENERALES:
        return <CiclosManager />
      case TABS.PROCESAMIENTO_NITROGENO:
        return <CiclosProcesamientoNitrogenoManager />
      case TABS.PROCESAMIENTO_CENIZAS: // <-- NUEVO CASE
        return <CiclosProcesamientoCenizasManager />
      default:
        return <CiclosManager />
    }
  }

  const getTabButtonClass = (tabName) => {
    return `px-4 py-2.5 text-sm font-medium rounded-t-lg focus:outline-none transition-colors duration-150 ease-in-out
            ${
              activeTab === tabName
                ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white shadow-sm' // Un poco más de resalte
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border-b-2 border-transparent'
            }`
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Gestión de Ciclos y Lotes de Procesamiento
      </h1>{' '}
      {/* Título más inclusivo */}
      <div className="border-b border-gray-300">
        {' '}
        {/* Borde ligeramente más visible */}
        <nav className="-mb-px flex space-x-3" aria-label="Tabs">
          {' '}
          {/* Ajuste de espacio si es necesario */}
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
          <button // <-- NUEVO BOTÓN DE PESTAÑA
            onClick={() => setActiveTab(TABS.PROCESAMIENTO_CENIZAS)}
            className={getTabButtonClass(TABS.PROCESAMIENTO_CENIZAS)}
          >
            {TABS.PROCESAMIENTO_CENIZAS}
          </button>
        </nav>
      </div>
      <div className="mt-5">{renderActiveTabContent()}</div>
    </div>
  )
}

export default GestionCiclosPage
