// src/pages/LaboratorioPage.jsx
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function LaboratorioPage() {
  const labSubSections = [
    { name: 'General', path: 'general' },
    { name: 'Análisis de Nitrógeno', path: 'nitrogeno' },
    { name: 'Análisis de Cenizas', path: 'cenizas' }
  ]

  // Estilo de Pestañas Moderno
  const navLinkClasses = ({ isActive }) =>
    `px-5 py-2.5 rounded-t-lg text-sm font-medium transition-all duration-200 border-b-2 ${
      isActive
        ? 'border-brand-500 text-brand-600 bg-brand-50'
        : 'border-transparent text-gray-500 hover:text-brand-500 hover:bg-gray-50'
    }`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light text-brand-900">
          Laboratorio <span className="font-bold text-gray-400">/</span> Control de Calidad
        </h1>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header de Navegación */}
        <div className="px-6 pt-4 border-b border-gray-100">
            <nav className="flex space-x-2">
                {labSubSections.map((section) => (
                <NavLink key={section.path} to={section.path} className={navLinkClasses}>
                    {section.name}
                </NavLink>
                ))}
            </nav>
        </div>

        {/* Contenido */}
        <div className="p-6 bg-surface min-h-[400px]">
          <Outlet /> 
        </div>
      </div>
    </div>
  )
}
export default LaboratorioPage