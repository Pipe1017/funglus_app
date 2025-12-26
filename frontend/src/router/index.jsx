// Ubicación: frontend/src/router/index.jsx
import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

// Layouts
import MainLayout from '../modules/core/layouts/MainLayout';

// Auth Module
import LoginPage from '../modules/auth/pages/LoginPage';

// Core Module
import LaunchpadPage from '../modules/core/pages/LaunchpadPage';

// Laboratorio Module
import LaboratorioPage from '../modules/laboratorio/pages/LaboratorioPage';
import LaboratorioGeneralSection from '../modules/laboratorio/pages/laboratorio_main_sections/LaboratorioGeneralSection';
import NitrogenoSection from '../modules/laboratorio/pages/laboratorio_main_sections/NitrogenoSection';
import CenizasSection from '../modules/laboratorio/pages/laboratorio_main_sections/CenizasSection';
import FormulacionPage from '../modules/laboratorio/pages/FormulacionPage';
import GestionCatalogosPage from '../modules/laboratorio/pages/GestionCatalogosPage';
import GestionCiclosPage from '../modules/laboratorio/pages/GestionCiclosPage';
import InformesPage from '../modules/laboratorio/pages/InformesPage';

// Admin Module
import UsersPage from '../modules/admin/pages/UsersPage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <LaunchpadPage />
      </PrivateRoute>
    )
  },
  {
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
      // --- SECCIÓN ADMIN CORREGIDA ---
      {
        path: 'admin',
        children: [
          // Esta línea es la clave: redirige /admin -> /admin/users
          { index: true, element: <Navigate to="users" replace /> },
          { path: 'users', element: <UsersPage /> }
        ]
      },
      // -------------------------------
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
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}