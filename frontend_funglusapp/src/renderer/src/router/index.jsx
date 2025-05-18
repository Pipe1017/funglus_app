// src/renderer/src/router/index.jsx
import React from 'react'
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import FormulacionPage from '../pages/FormulacionPage'
import InformesPage from '../pages/InformesPage'
import CenizasSection from '../pages/laboratorio_sections/CenizasSection'
import GubysSection from '../pages/laboratorio_sections/GubysSection'
import MateriaPrimaSection from '../pages/laboratorio_sections/MateriaPrimaSection' // <--- IMPORTA NUEVA SECCIÓN
import TamoHumedoSection from '../pages/laboratorio_sections/TamoHumedoSection'
import LaboratorioPage from '../pages/LaboratorioPage'

const router = createHashRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/laboratorio" replace /> },
      {
        path: 'laboratorio',
        element: <LaboratorioPage />,
        children: [
          {
            index: true,
            element: (
              <div className="p-6 text-lg text-center text-gray-500 rounded-md bg-white shadow">
                Bienvenido al módulo de Laboratorio. <br /> Por favor, define un "Ciclo Activo"
                usando el gestor de arriba y luego selecciona una etapa del menú de etapas.
              </div>
            )
          },
          { path: 'materia_prima', element: <MateriaPrimaSection /> }, // <--- AÑADE RUTA
          { path: 'gubys', element: <GubysSection /> },
          { path: 'cenizas', element: <CenizasSection /> },
          { path: 'tamo_humedo', element: <TamoHumedoSection /> } // <--- AÑADE RUTA
        ]
      },
      { path: 'formulacion', element: <FormulacionPage /> },
      { path: 'informes', element: <InformesPage /> }
    ]
  }
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
