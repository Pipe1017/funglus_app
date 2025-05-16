// src/renderer/src/router/index.jsx
import React from 'react';
import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LaboratorioPage from '../pages/LaboratorioPage';
import FormulacionPage from '../pages/FormulacionPage';
import InformesPage from '../pages/InformesPage';
import MateriaPrimaSection from '../pages/laboratorio_sections/MateriaPrimaSection'; // <--- IMPORTA NUEVA SECCIÓN
import GubysSection from '../pages/laboratorio_sections/GubysSection';
import CenizasSection from '../pages/laboratorio_sections/CenizasSection';

const router = createHashRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/laboratorio" replace /> },
      { 
        path: "laboratorio", 
        element: <LaboratorioPage />,
        children: [
          { index: true, element: <div className="p-6 text-lg text-center text-gray-500 rounded-md bg-white shadow">Bienvenido al módulo de Laboratorio. <br/> Por favor, define un "Ciclo Activo" usando el gestor de arriba y luego selecciona una etapa del menú de etapas.</div> },
          { path: "materia_prima", element: <MateriaPrimaSection /> }, // <--- AÑADE RUTA
          { path: "gubys", element: <GubysSection /> },
          { path: "cenizas", element: <CenizasSection /> },
        ]
      },
      { path: "formulacion", element: <FormulacionPage /> },
      { path: "informes", element: <InformesPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}