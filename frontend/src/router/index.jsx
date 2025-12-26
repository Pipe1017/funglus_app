// src/router/index.jsx
import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

// Layouts
import MainLayout from '../layouts/MainLayout'

// Pages Nuevas (Autenticación y Navegación)
import LoginPage from '../pages/LoginPage'
import LaunchpadPage from '../pages/LaunchpadPage'

// Pages Existentes del Sistema
import FormulacionPage from '../pages/FormulacionPage'
import GestionCatalogosPage from '../pages/GestionCatalogosPage'
import GestionCiclosPage from '../pages/GestionCiclosPage'
import InformesPage from '../pages/InformesPage'
import LaboratorioPage from '../pages/LaboratorioPage'

// Sub-secciones de Laboratorio
import CenizasSection from '../pages/laboratorio_main_sections/CenizasSection'
import LaboratorioGeneralSection from '../pages/laboratorio_main_sections/LaboratorioGeneralSection'
import NitrogenoSection from '../pages/laboratorio_main_sections/NitrogenoSection'

/**
 * Componente de orden superior para proteger rutas.
 * Verifica si existe un token en localStorage.
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Si no hay token, redirigir al Login inmediatamente
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderizar el componente hijo
  return children;
};

const router = createBrowserRouter([
  {
    // Ruta pública: Login
    path: '/login',
    element: <LoginPage />
  },
  {
    // Ruta Raíz Protegida: El Launchpad (Selector de Módulos)
    path: '/',
    element: (
      <PrivateRoute>
        <LaunchpadPage />
      </PrivateRoute>
    )
  },
  {
    // Rutas de la Aplicación Principal (Laboratorio y Gestión)
    // Estas rutas comparten el Sidebar y el Header (MainLayout)
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
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
        path: 'gestion-ciclos',
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
  },
  {
    // Manejo de rutas no encontradas (404) -> Volver al inicio
    path: '*',
    element: <Navigate to="/" replace />
  }
])

export function AppRouter() {
  return <RouterProvider router={router} />
}