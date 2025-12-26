// src/modules/siembra/pages/SiembraPage.jsx
import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

export default function SiembraPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="text-green-600" size={40} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            🌱 Módulo de Siembra
          </h2>
          
          <p className="text-gray-600 mb-6">
            Este módulo está en construcción. Aquí se gestionarán los lotes de siembra.
          </p>
          
          <div className="inline-block px-6 py-3 bg-green-50 text-green-700 rounded-lg">
            ✅ Tienes acceso a este módulo
          </div>
        </div>
      </div>
    </div>
  );
}