// src/modules/core/layouts/MainLayout.jsx
import React, { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { 
  CiBeaker1, 
  CiHome, 
  CiSettings,
  CiGrid41,
  CiFileOn,
  CiRepeat,
  CiMenuBurger
} from 'react-icons/ci'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  const userName = localStorage.getItem('user_name') || 'Usuario'
  const role = localStorage.getItem('role')

  // Determinar en qué módulo estamos
  const pathSegment = location.pathname.split('/')[1]
  
  // Rutas que pertenecen al módulo Laboratorio
  const laboratorioRoutes = ['laboratorio', 'gestion-ciclos', 'formulacion', 'gestion-catalogos']
  const currentModule = laboratorioRoutes.includes(pathSegment) ? 'laboratorio' : pathSegment

  // Clases para los links del sidebar
  const commonLinkClasses =
    'flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-150 text-sm'
  const activeLinkClasses = 'bg-gray-900 text-white shadow-md border-l-4 border-brand-500'

  const navLinkClass = (path) => {
    const isActive = location.pathname === path || location.pathname.startsWith(path + '/')
    return `${commonLinkClasses} ${isActive ? activeLinkClasses : ''}`
  }

  // Generación de Breadcrumbs
  const pathnames = location.pathname.split('/').filter((x) => x)
  const breadcrumbs = pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
    const isLast = index === pathnames.length - 1
    
    let displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' ')
    if (displayName === 'Gestion catalogos') displayName = 'Catálogos'
    if (displayName === 'Gestion ciclos') displayName = 'Gestión de Ciclos'
    if (displayName === 'Admin') displayName = 'Administración'
    if (displayName === 'Users') displayName = 'Usuarios'

    return (
      <React.Fragment key={routeTo}>
        <span className="text-gray-400 mx-2">/</span>
        {isLast ? (
          <span className="font-medium text-gray-700">{displayName}</span>
        ) : (
          <NavLink to={routeTo} className="text-brand-600 hover:text-brand-800 hover:underline">
            {displayName}
          </NavLink>
        )}
      </React.Fragment>
    )
  })

  // ========== FUNCIÓN CORREGIDA DEL SIDEBAR ==========
  const renderSidebarOptions = () => {
    // CASO ESPECIAL: Módulo Informes - SOLO opciones de informes
    if (currentModule === 'informes') {
      return (
        <>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
            {!sidebarCollapsed && 'Informes'}
          </div>
          <NavLink to="/informes" className={() => navLinkClass('/informes')}>
            <CiFileOn className="mr-3 h-6 w-6 flex-shrink-0" /> 
            {!sidebarCollapsed && 'Ver Informes'}
          </NavLink>
        </>
      )
    }
    
    // Módulo Laboratorio - con subsecciones
    if (currentModule === 'laboratorio') {
      const isInLaboratorioSection = location.pathname.startsWith('/laboratorio')
      
      return (
        <>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
            {!sidebarCollapsed && 'Laboratorio'}
          </div>
          
          {/* Botón principal del módulo Laboratorio */}
          <NavLink to="/laboratorio/general" className={() => navLinkClass('/laboratorio')}>
            <CiBeaker1 className="mr-3 h-6 w-6 flex-shrink-0" /> 
            {!sidebarCollapsed && 'Módulo Laboratorio'}
          </NavLink>
          
          {/* Subsecciones (General, Nitrógeno, Cenizas) - Solo visibles dentro de /laboratorio */}
          {isInLaboratorioSection && !sidebarCollapsed && (
            <div className="ml-6 space-y-1 border-l-2 border-gray-700 pl-2 mb-2">
              <NavLink 
                to="/laboratorio/general" 
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 text-xs rounded-md transition-colors ${
                    isActive 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`
                }
              >
                General
              </NavLink>
              <NavLink 
                to="/laboratorio/nitrogeno" 
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 text-xs rounded-md transition-colors ${
                    isActive 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`
                }
              >
                Nitrógeno
              </NavLink>
              <NavLink 
                to="/laboratorio/cenizas" 
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 text-xs rounded-md transition-colors ${
                    isActive 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`
                }
              >
                Cenizas
              </NavLink>
            </div>
          )}
          
          {/* Otras opciones de Laboratorio */}
          <NavLink to="/gestion-ciclos" className={() => navLinkClass('/gestion-ciclos')}>
            <CiRepeat className="mr-3 h-6 w-6 flex-shrink-0" /> 
            {!sidebarCollapsed && 'Gestión de Ciclos'}
          </NavLink>
          <NavLink to="/formulacion" className={() => navLinkClass('/formulacion')}>
            <CiGrid41 className="mr-3 h-6 w-6 flex-shrink-0" /> 
            {!sidebarCollapsed && 'Formulación'}
          </NavLink>
          <NavLink to="/informes" className={() => navLinkClass('/informes')}>
            <CiFileOn className="mr-3 h-6 w-6 flex-shrink-0" /> 
            {!sidebarCollapsed && 'Informes'}
          </NavLink>
          <NavLink to="/gestion-catalogos" className={() => navLinkClass('/gestion-catalogos')}>
            <CiSettings className="mr-3 h-6 w-6 flex-shrink-0" /> 
            {!sidebarCollapsed && 'Catálogos'}
          </NavLink>
        </>
      )
    }
    
    // Módulo Siembra
    if (currentModule === 'siembra') {
      return (
        <>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
            {!sidebarCollapsed && 'Siembra'}
          </div>
          <div className="text-xs text-gray-500 px-4 py-2 italic">
            {!sidebarCollapsed && 'Opciones disponibles próximamente'}
          </div>
        </>
      )
    }
    
    // Módulo Incubación
    if (currentModule === 'incubacion') {
      return (
        <>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
            {!sidebarCollapsed && 'Incubación'}
          </div>
          <div className="text-xs text-gray-500 px-4 py-2 italic">
            {!sidebarCollapsed && 'Opciones disponibles próximamente'}
          </div>
        </>
      )
    }
    
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-gray-800 text-gray-100 flex flex-col flex-shrink-0 shadow-2xl z-20 transition-all duration-300`}>
        
        {/* Header del Sidebar */}
        <div className="px-5 py-6 border-b border-gray-700 flex items-center justify-between bg-gray-900">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <img 
                src="/Logo.png" 
                alt="Funglus Logo" 
                className="h-10 w-10 rounded-lg object-contain bg-white p-1"
              />
              <div>
                <h1 className="text-lg font-bold text-white tracking-wide">FunglusApp</h1>
                <p className="text-xs text-gray-400">Sistema Integral</p>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <img 
              src="/Logo.png" 
              alt="Funglus" 
              className="h-10 w-10 rounded-lg object-contain bg-white p-1 mx-auto"
            />
          )}
        </div>
        
        <nav className="flex-grow px-3 py-6 space-y-2 overflow-y-auto">
          
          {/* Botón Volver a Módulos */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center px-4 py-3 text-gray-300 bg-brand-600 hover:bg-brand-700 rounded-md transition-colors duration-150 text-sm font-medium"
          >
            <CiHome className="h-6 w-6 flex-shrink-0 mr-3" />
            {!sidebarCollapsed && 'Volver a Módulos'}
          </button>

          {/* Separador */}
          <div className="border-t border-gray-700 my-4"></div>

          {/* Opciones dinámicas según el módulo */}
          {renderSidebarOptions()}
          
          {/* Administración - Solo visible para admins */}
          {role === 'admin' && (
            <>
              <div className="mt-8 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
                {!sidebarCollapsed && 'Configuración'}
              </div>
              <NavLink to="/admin/users" className={() => navLinkClass('/admin')}>
                <CiSettings className="mr-3 h-6 w-6 flex-shrink-0" /> 
                {!sidebarCollapsed && 'Administración'}
              </NavLink>
            </>
          )}
        </nav>
        
        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-gray-700 bg-gray-900">
          {!sidebarCollapsed ? (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-gray-500">
                  {role === 'admin' ? 'Administrador' : role === 'operator' ? 'Operador' : 'Visor'}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold mx-auto">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Botón para colapsar/expandir */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full py-3 bg-gray-900 hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-300"
          title={sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {sidebarCollapsed ? (
            <FiChevronRight size={20} />
          ) : (
            <>
              <FiChevronLeft size={20} />
              <span className="ml-2 text-xs">Colapsar</span>
            </>
          )}
        </button>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-background">
        <header className="bg-white shadow-sm py-3 px-6 border-b border-gray-200 flex items-center justify-between z-10">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-brand-600 transition-colors p-1 rounded-md hover:bg-gray-100"
              title="Volver al Launchpad"
            >
              <CiHome className="h-6 w-6" />
            </button>
            <div className="h-6 w-px bg-gray-300 mx-4"></div>
            <div className="flex items-center text-sm">{breadcrumbs}</div>
          </div>
          
          <div className="flex items-center gap-4">
            <img src="/Logo.png" alt="Funglus" className="h-6 object-contain" />
            <div className="text-xs text-gray-400 italic">
              v0.3.1 Admin
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout