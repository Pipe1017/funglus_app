import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CiBeaker1, CiGrid41, CiTempHigh, CiSettings, CiLogout } from 'react-icons/ci';

const ModuleCard = ({ title, icon: Icon, description, onClick, colorClass }) => (
  <div 
    onClick={onClick}
    className="group bg-surface p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-200 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${colorClass} bg-opacity-10`}>
      <Icon />
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-brand-600 transition-colors">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
  </div>
);

export default function LaunchpadPage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Usuario';
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-12 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-light text-brand-900">Hola, <span className="font-semibold">{userName}</span></h1>
          <p className="text-gray-400 mt-1">Selecciona un módulo para comenzar.</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:text-red-600 hover:border-red-100 transition-colors shadow-sm"
        >
          <CiLogout className="mr-2 text-lg" /> Salir
        </button>
      </header>

      {/* Grid de Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* Módulo Laboratorio (Existente) */}
        <ModuleCard 
          title="Laboratorio" 
          icon={CiBeaker1}
          description="Gestión de muestras, análisis de Nitrógeno, Cenizas e Informes técnicos."
          colorClass="text-blue-600 bg-blue-600"
          onClick={() => navigate('/laboratorio')}
        />

        {/* Módulo Siembra (Placeholder) */}
        <ModuleCard 
          title="Siembra" 
          icon={CiGrid41}
          description="Control de lotes de siembra, semillas y trazabilidad de producción."
          colorClass="text-green-600 bg-green-600"
          onClick={() => alert("🚧 Módulo de Siembra en construcción")}
        />

        {/* Módulo Incubación (Placeholder) */}
        <ModuleCard 
          title="Incubación" 
          icon={CiTempHigh}
          description="Monitoreo de temperatura, humedad y tiempos de ciclo en cuartos."
          colorClass="text-orange-600 bg-orange-600"
          onClick={() => alert("🚧 Módulo de Incubación en construcción")}
        />

        {/* Admin Only */}
        {role === 'admin' && (
          <ModuleCard 
            title="Administración" 
            icon={CiSettings}
            description="Gestión de usuarios, permisos y configuración global del sistema."
            colorClass="text-purple-600 bg-purple-600"
            onClick={() => alert("🚧 Panel de Admin en construcción")}
          />
        )}
      </div>
    </div>
  );
}