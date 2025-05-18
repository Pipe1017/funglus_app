// src/renderer/src/pages/LaboratorioPage.jsx
import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
// import CicloManager from '../components/laboratorio/CicloManager'; // <--- ELIMINA ESTA LÍNEA

function LaboratorioPage() {
  const location = useLocation() // Mantén esto si lo usas para navLinkClasses
  const labSections = [
    { name: 'MATERIA PRIMA', path: 'materia_prima' },
    { name: 'TAMO HUMEDO', path: 'tamo_humedo' },
    { name: 'GUBYS', path: 'gubys' },
    { name: 'CENIZAS', path: 'cenizas' }
    // ... otras secciones
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
      {/* CicloManager ya no va aquí. Se usa KeySelector dentro de cada sección (Outlet) */}
      {/* <CicloManager /> */} {/* <--- ELIMINA O COMENTA ESTA LÍNEA */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Etapas / Análisis de Laboratorio
        </h2>
        <nav className="mb-6 border-b pb-4">
          <ul className="flex flex-wrap gap-x-3 gap-y-2">
            {labSections.map((section) => (
              <li key={section.path}>
                <NavLink to={section.path} className={navLinkClasses}>
                  {section.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-1">
          <Outlet /> {/* Las secciones como MateriaPrimaSection usarán KeySelector internamente */}
        </div>
      </div>
    </div>
  )
}
export default LaboratorioPage
