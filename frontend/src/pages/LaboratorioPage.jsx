// src/renderer/src/pages/LaboratorioPage.jsx
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
// Ya no necesitamos CicloManager aquí directamente.
// La selección de claves se manejará dentro de la sección "General" o en los formularios específicos.

function LaboratorioPage() {
  const labSubSections = [
    { name: 'GENERAL', path: 'general' }, // Para Ciclo, Selección de Identificadores y Metadata General
    { name: 'ANÁLISIS DE NITRÓGENO', path: 'nitrogeno' },
    { name: 'ANÁLISIS DE CENIZAS', path: 'cenizas' }
  ]

  const navLinkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out shadow-sm border ${
      isActive
        ? 'bg-indigo-600 text-white border-indigo-700'
        : 'bg-white text-indigo-700 hover:bg-indigo-50 border-indigo-300'
    }`

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Módulo de Laboratorio</h1>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Sub-Módulos de Laboratorio</h2>
        <nav className="mb-6 border-b pb-4">
          <ul className="flex flex-wrap gap-x-3 gap-y-2">
            {labSubSections.map((section) => (
              <li key={section.path}>
                <NavLink to={section.path} className={navLinkClasses}>
                  {section.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-1 p-2 bg-gray-50 rounded-b-lg min-h-[300px]">
          {' '}
          {/* Añadido min-h para mejor visualización */}
          <Outlet /> {/* Aquí se renderizarán LaboratorioGeneralSection, NitrogenoSection, etc. */}
        </div>
      </div>
    </div>
  )
}
export default LaboratorioPage
