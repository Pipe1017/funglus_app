// src/renderer/src/pages/GestionCiclosPage.jsx
import React from 'react'
import CiclosManager from '../components/catalogos/CiclosManager' // Asumiendo que CiclosManager está en esta ruta

function GestionCiclosPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Ciclos</h1>

      <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        {/* El título específico ya está dentro de CiclosManager si lo tiene,
                o puedes añadir uno aquí si CiclosManager es más genérico */}
        <CiclosManager />
      </div>
    </div>
  )
}
export default GestionCiclosPage
