import React from 'react'
import InformeResumen from '../components/informes/InformeResumen' // <-- ¡NUEVO!

function InformesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Módulo de Informes</h1>
      <div className="bg-white p-6 rounded-lg shadow mt-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Resumen de Resultados por Ciclo</h2>
        <InformeResumen /> {/* <-- REEMPLAZADO */}
      </div>
    </div>
  )
}
export default InformesPage