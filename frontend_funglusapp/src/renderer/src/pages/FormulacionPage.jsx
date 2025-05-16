// src/renderer/src/pages/FormulacionPage.jsx
import React from 'react';
import CicloManager from '../components/laboratorio/CicloManager'; // Reutilizaremos el CicloManager

function FormulacionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Módulo de Formulación</h1>
      <CicloManager />
      <div className="bg-white p-6 rounded-lg shadow mt-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Formulación (En Construcción)</h2>
        <p className="text-gray-500">Formulario para Formulación irá aquí.</p>
        {/* Aquí iría el componente del formulario de formulación cuando lo creemos */}
      </div>
    </div>
  );
}
export default FormulacionPage;