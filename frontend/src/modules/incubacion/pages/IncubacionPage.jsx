// src/modules/incubacion/pages/IncubacionPage.jsx
import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

export default function IncubacionPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="text-orange-600" size={40} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            🌡️ Módulo de Incubación
          </h2>
          
          <p className="text-gray-600 mb-6">
            Este módulo está en construcción. Aquí se monitoreará temperatura y humedad.
          </p>
          
          <div className="inline-block px-6 py-3 bg-orange-50 text-orange-700 rounded-lg">
            ✅ Tienes acceso a este módulo
          </div>
        </div>
      </div>
    </div>
  );
}