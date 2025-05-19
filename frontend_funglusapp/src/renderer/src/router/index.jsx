// src/renderer/src/router/index.jsx
import React from 'react'
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

import FormulacionPage from '../pages/FormulacionPage'
import GestionCatalogosPage from '../pages/GestionCatalogosPage'
import GestionCiclosPage from '../pages/GestionCiclosPage' // <--- IMPORTA NUEVA PÁGINA
import InformesPage from '../pages/InformesPage'
import LaboratorioPage from '../pages/LaboratorioPage'

// Sub-secciones de Laboratorio
import CenizasSection from '../pages/laboratorio_main_sections/CenizasSection'
import LaboratorioGeneralSection from '../pages/laboratorio_main_sections/LaboratorioGeneralSection'
import NitrogenoSection from '../pages/laboratorio_main_sections/NitrogenoSection'

const router = createHashRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/laboratorio/general" replace /> },
      {
        path: 'laboratorio',
        element: <LaboratorioPage />,
        children: [
          { index: true, element: <Navigate to="general" replace /> },
          { path: 'general', element: <LaboratorioGeneralSection /> },
          { path: 'nitrogeno', element: <NitrogenoSection /> },
          { path: 'cenizas', element: <CenizasSection /> }
        ]
      },
      {
        path: 'gestion-ciclos', // <--- NUEVA RUTA PRINCIPAL
        element: <GestionCiclosPage />
      },
      {
        path: 'formulacion',
        element: <FormulacionPage />
      },
      {
        path: 'informes',
        element: <InformesPage />
      },
      {
        path: 'gestion-catalogos',
        element: <GestionCatalogosPage />
      }
    ]
  }
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
