// src/layouts/MainLayout.jsx
import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
// Aseguramos que los iconos estén disponibles
import { CiBeaker1, CiFileOn, CiGrid41, CiHome, CiRepeat, CiSettings } from 'react-icons/ci'

function MainLayout() {
  const location = useLocation()
  const userName = localStorage.getItem('user_name') || 'Usuario'

  // Clases para los links del sidebar
  const commonLinkClasses =
    'flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-150 text-sm'
  const activeLinkClasses = 'bg-gray-900 text-white shadow-md border-l-4 border-brand-500' // Agregado un borde para resaltar

  const navLinkClass = (path) => {
    // Lógica para determinar si el link está activo basado en la URL actual
    const baseNavPath = path.split('/')[1]
    const currentLocationBase = location.pathname.split('/')[1]
    const isActive = baseNavPath === currentLocationBase
    return `${commonLinkClasses} ${isActive ? activeLinkClasses : ''}`
  }

  // Generación de Breadcrumbs (Migas de pan)
  const pathnames = location.pathname.split('/').filter((x) => x)
  const breadcrumbs = pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
    const isLast = index === pathnames.length - 1
    
    // Formateo de nombres para que se vean bien
    let displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' ')
    if (displayName === 'M p') displayName = 'Materia Prima'
    if (displayName === 'Gestion catalogos') displayName = 'Catálogos'
    if (displayName === 'Gestion ciclos') displayName = 'Ciclos'

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

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col flex-shrink-0 shadow-2xl z-20">
        <div className="px-5 py-6 border-b border-gray-700 flex items-center space-x-3 bg-gray-900">
          <div className="h-10 w-10 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/40">
            F
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">FunglusApp</h1>
            <p className="text-xs text-gray-400">Laboratorio</p>
          </div>
        </div>
        
        <nav className="flex-grow px-3 py-6 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">Módulos</div>
          
          <NavLink to="/laboratorio" className={() => navLinkClass('/laboratorio')}>
            <CiBeaker1 className="mr-3 h-6 w-6 flex-shrink-0" /> Laboratorio
          </NavLink>
          <NavLink to="/gestion-ciclos" className={() => navLinkClass('/gestion-ciclos')}>
            <CiRepeat className="mr-3 h-6 w-6 flex-shrink-0" /> Gestión de Ciclos
          </NavLink>
          <NavLink to="/formulacion" className={() => navLinkClass('/formulacion')}>
            <CiGrid41 className="mr-3 h-6 w-6 flex-shrink-0" /> Formulación
          </NavLink>
          <NavLink to="/informes" className={() => navLinkClass('/informes')}>
            <CiFileOn className="mr-3 h-6 w-6 flex-shrink-0" /> Informes
          </NavLink>
          
          <div className="mt-8 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">Configuración</div>
          
          <NavLink to="/gestion-catalogos" className={() => navLinkClass('/gestion-catalogos')}>
            <CiSettings className="mr-3 h-6 w-6 flex-shrink-0" /> Catálogos
          </NavLink>
        </nav>
        
        <div className="p-4 border-t border-gray-700 bg-gray-900">
           <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-gray-500">Sesión Activa</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-background">
        <header className="bg-white shadow-sm py-3 px-6 border-b border-gray-200 flex items-center justify-between z-10">
          <div className="flex items-center">
            {/* El botón Home ahora lleva al Launchpad ("/") */}
            <NavLink 
              to="/" 
              className="text-gray-400 hover:text-brand-600 transition-colors p-1 rounded-md hover:bg-gray-100" 
              title="Volver al Launchpad"
            >
              <CiHome className="h-6 w-6" />
            </NavLink>
            <div className="h-6 w-px bg-gray-300 mx-4"></div>
            <div className="flex items-center text-sm">{breadcrumbs}</div>
          </div>
          
          <div className="text-xs text-gray-400 italic">
             v0.2.0 Modular
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