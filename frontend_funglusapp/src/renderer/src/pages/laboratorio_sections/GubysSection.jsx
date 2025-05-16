// src/renderer/src/pages/laboratorio_sections/GubysSection.jsx
import React from 'react';
import GubysForm from '../../components/laboratorio/GubysForm'; // Lo crearemos en el siguiente paso

function GubysSection() {
  return (
    <div className="py-1">
      {/* El título podría estar aquí o dentro de GubysForm */}
      {/* <h2 className="text-2xl font-semibold text-gray-700 mb-5">Gestión de Datos GUBYS</h2> */}
      <GubysForm />
    </div>
  );
}
export default GubysSection;