import React from 'react'
import InformeResumen from '../components/informes/InformeResumen'
import InformeHistorico from '../components/informes/InformeHistorico' // <-- ¡NUEVA IMPORTACIÓN!

function InformesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Módulo de Informes</h1>

      {/* Componente existente para el resumen de un solo ciclo */}
      <div className="bg-white p-6 rounded-lg shadow mt-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Resumen de Resultados por Ciclo</h2>
        <InformeResumen />
      </div>

      {/* --- ¡NUEVO COMPONENTE AÑADIDO! --- */}
      <div className="bg-white p-6 rounded-lg shadow mt-4">
        <InformeHistorico />
      </div>

    </div>
  )
}

export default InformesPage