// src/renderer/src/pages/GestionCatalogosPage.jsx
import React from 'react'
import EtapasManager from '../components/catalogos/EtapasManager'
import MuestrasManager from '../components/catalogos/MuestrasManager' // <--- IMPORTA
import OrigenesManager from '../components/catalogos/OrigenesManager' // <--- IMPORTA

function GestionCatalogosPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Gestión de Catálogos (Etapas, Muestras, Origenes)
      </h1>

      <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-3">Etapas</h2>
        <EtapasManager />
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-3">Muestras</h2>
        <MuestrasManager /> {/* <--- AÑADE */}
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-3">Origenes</h2>
        <OrigenesManager /> {/* <--- AÑADE */}
      </div>
    </div>
  )
}
export default GestionCatalogosPage
