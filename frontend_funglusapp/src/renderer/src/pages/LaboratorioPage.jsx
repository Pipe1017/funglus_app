// src/renderer/src/pages/LaboratorioPage.jsx
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import CicloManager from '../components/laboratorio/CicloManager';

function LaboratorioPage() {
  const labSections = [
    { name: 'MATERIA PRIMA', path: 'materia_prima' }, // AÑADIDO
    { name: 'GUBYS', path: 'gubys' },
    { name: 'CENIZAS', path: 'cenizas' },
    // ... otras secciones
  ];

  const navLinkClasses = ({ isActive }) => // Simplificado para usar isActive de NavLink
    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out shadow-sm border ${
      isActive 
        ? 'bg-indigo-600 text-white border-indigo-700' 
        : 'bg-white text-indigo-700 hover:bg-indigo-50 border-indigo-300'
    }`;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Módulo de Laboratorio</h1>
      <CicloManager />
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Etapas / Análisis de Laboratorio</h2>
        <nav className="mb-6 border-b pb-4">
          <ul className="flex flex-wrap gap-x-3 gap-y-2">
            {labSections.map(section => (
              <li key={section.path}>
                <NavLink to={section.path} className={navLinkClasses}>
                  {section.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default LaboratorioPage;