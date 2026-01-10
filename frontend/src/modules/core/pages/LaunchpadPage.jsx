// src/modules/core/pages/LaunchpadPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CiBeaker1, 
  CiTempHigh, 
  CiSettings, 
  CiLogout,
  CiFileOn
} from 'react-icons/ci';
import { FiLock } from 'react-icons/fi';

const ModuleCard = ({ title, icon: Icon, description, onClick, colorClass, isLocked = false }) => (
  <div 
    onClick={isLocked ? null : onClick}
    className={`group bg-surface p-6 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 relative overflow-hidden ${
      isLocked 
        ? 'opacity-60 cursor-not-allowed' 
        : 'hover:shadow-xl hover:border-brand-200 cursor-pointer transform hover:-translate-y-1'
    }`}
  >
    {isLocked && (
      <div className="absolute top-3 right-3">
        <FiLock className="text-gray-400" size={20} />
      </div>
    )}
    
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${colorClass} bg-opacity-10`}>
      <Icon />
    </div>
    <h3 className={`text-lg font-bold text-gray-800 mb-2 ${!isLocked && 'group-hover:text-brand-600'} transition-colors`}>
      {title}
    </h3>
    <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    
    {isLocked && (
      <p className="text-xs text-red-600 mt-2 font-medium">
        🔒 Sin acceso a este módulo
      </p>
    )}
  </div>
);

export default function LaunchpadPage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Usuario';
  const role = localStorage.getItem('role');
  const allowedModulesStr = localStorage.getItem('allowed_modules');
  const allowedModules = allowedModulesStr ? JSON.parse(allowedModulesStr) : [];

  const hasModuleAccess = (moduleName) => {
    if (role === 'admin') return true;
    return allowedModules.includes(moduleName);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleModuleClick = (path, moduleName) => {
    if (hasModuleAccess(moduleName)) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-sans">
      {/* Header con Logo */}
      <header className="flex justify-between items-center mb-12 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          {/* Logo de la empresa */}
          <img 
            src="/Logo.png" 
            alt="Funglus Logo" 
            className="h-16 w-16 object-contain"
          />
          <div>
            <h1 className="text-3xl font-light text-brand-900">
              Hola, <span className="font-semibold">{userName}</span>
            </h1>
            <p className="text-gray-400 mt-1">
              {role === 'admin' 
                ? 'Acceso completo al sistema' 
                : `Módulos disponibles: ${allowedModules.join(', ')}`
              }
            </p>
          </div>
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
        
        {/* Módulo Laboratorio */}
        <ModuleCard 
          title="Laboratorio" 
          icon={CiBeaker1}
          description="Gestión de muestras, análisis de Nitrógeno, Cenizas e Informes técnicos."
          colorClass="text-blue-600 bg-blue-600"
          onClick={() => handleModuleClick('/laboratorio', 'laboratorio')}
          isLocked={!hasModuleAccess('laboratorio')}
        />

        {/* Módulo Informes */}
        <ModuleCard 
          title="Informes" 
          icon={CiFileOn}
          description="Visualización de informes, resúmenes y análisis históricos del laboratorio."
          colorClass="text-purple-600 bg-purple-600"
          onClick={() => handleModuleClick('/informes', 'informes')}
          isLocked={!hasModuleAccess('informes')}
        />

        {/* Módulo Siembra */}
        <ModuleCard 
          title="Siembra" 
          icon={CiSettings}
          description="Control de lotes de siembra, semillas y trazabilidad de producción."
          colorClass="text-green-600 bg-green-600"
          onClick={() => handleModuleClick('/siembra', 'siembra')}
          isLocked={!hasModuleAccess('siembra')}
        />

        {/* Módulo Incubación */}
        <ModuleCard 
          title="Incubación" 
          icon={CiTempHigh}
          description="Monitoreo de temperatura, humedad y tiempos de ciclo en cuartos."
          colorClass="text-orange-600 bg-orange-600"
          onClick={() => handleModuleClick('/incubacion', 'incubacion')}
          isLocked={!hasModuleAccess('incubacion')}
        />

        {/* Admin Only */}
        {role === 'admin' && (
          <ModuleCard 
            title="Administración" 
            icon={CiSettings}
            description="Gestión de usuarios, permisos y configuración global del sistema."
            colorClass="text-red-600 bg-red-600"
            onClick={() => navigate('/admin/users')}
          />
        )}
      </div>
    </div>
  );
}