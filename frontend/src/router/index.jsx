// src/router/index.jsx
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

// Otros Módulos (Placeholders)
import SiembraPage from '../modules/siembra/pages/SiembraPage';
import IncubacionPage from '../modules/incubacion/pages/IncubacionPage';

// Protección de rutas privadas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Protección de rutas de admin
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) return <Navigate to="/login" replace />;
  if (role !== 'admin') return <Navigate to="/" replace />;
  
  return children;
};

// Protección por módulos permitidos
const ModuleRoute = ({ children, requiredModule }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const allowedModulesStr = localStorage.getItem('allowed_modules');
  
  if (!token) return <Navigate to="/login" replace />;
  
  // Admin tiene acceso a todo
  if (role === 'admin') return children;
  
  // Verificar si el usuario tiene permiso para este módulo
  const allowedModules = allowedModulesStr ? JSON.parse(allowedModulesStr) : [];
  if (!allowedModules.includes(requiredModule)) {
    return <Navigate to="/" replace />;
  }
  
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
      // Módulo Laboratorio
      {
        path: 'laboratorio',
        element: (
          <ModuleRoute requiredModule="laboratorio">
            <LaboratorioPage />
          </ModuleRoute>
        ),
        children: [
          { index: true, element: <Navigate to="general" replace /> },
          { path: 'general', element: <LaboratorioGeneralSection /> },
          { path: 'nitrogeno', element: <NitrogenoSection /> },
          { path: 'cenizas', element: <CenizasSection /> }
        ]
      },
      
      // Módulo Siembra
      {
        path: 'siembra',
        element: (
          <ModuleRoute requiredModule="siembra">
            <SiembraPage />
          </ModuleRoute>
        )
      },
      
      // Módulo Incubación
      {
        path: 'incubacion',
        element: (
          <ModuleRoute requiredModule="incubacion">
            <IncubacionPage />
          </ModuleRoute>
        )
      },
      
      // RUTAS INDEPENDIENTES (fuera de laboratorio)
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
      },
      
      // Módulo de Administración (solo admin)
      {
        path: 'admin/users',
        element: (
          <AdminRoute>
            <UsersPage />
          </AdminRoute>
        )
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