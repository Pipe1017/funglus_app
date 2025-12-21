// src/renderer/src/layouts/MainLayout.jsx
import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
// Asegúrate de que CiGrid41 esté importado
import { CiBeaker1, CiFileOn, CiGrid41, CiHome, CiRepeat, CiSettings } from 'react-icons/ci'

function MainLayout() {
  const location = useLocation()
  const commonLinkClasses =
    'flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-150 text-sm'
  const activeLinkClasses = 'bg-gray-900 text-white'

  const navLinkClass = (path) => {
    const baseNavPath = path.split('/')[1]
    const currentLocationBase = location.pathname.split('/')[1]
    // Considera que la ruta raíz "/" también debe activar el primer NavLink si es "Home" o similar.
    // Para este layout, la activación se basa en el primer segmento de la ruta.
    const isActive = baseNavPath === currentLocationBase
    return `${commonLinkClasses} ${isActive ? activeLinkClasses : ''}`
  }

  const pathnames = location.pathname.split('/').filter((x) => x)
  const breadcrumbs = pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
    const isLast = index === pathnames.length - 1
    // Capitaliza y reemplaza guiones/guiones bajos para el display name
    let displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' ')
    if (displayName === 'M p') displayName = 'Materia Prima'
    if (displayName === 'Gestion catalogos') displayName = 'Catálogos'
    if (displayName === 'Gestion ciclos') displayName = 'Ciclos'

    return (
      <React.Fragment key={routeTo}>
        <span className="text-gray-400 mx-1">/</span>
        {isLast ? (
          <span className="font-medium text-gray-700">{displayName}</span>
        ) : (
          <NavLink to={routeTo} className="text-indigo-500 hover:text-indigo-700 hover:underline">
            {displayName}
          </NavLink>
        )}
      </React.Fragment>
    )
  })

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col flex-shrink-0 shadow-2xl">
        <div className="px-5 py-5 border-b border-gray-700 flex items-center space-x-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
            F
          </div>
          <h1 className="text-xl font-bold text-white">FunglusApp</h1>
        </div>
        <nav className="flex-grow px-3 py-4 space-y-1.5">
          <NavLink to="/laboratorio" className={() => navLinkClass('/laboratorio')}>
            <CiBeaker1 className="mr-3 h-5 w-5 flex-shrink-0" /> Laboratorio
          </NavLink>
          <NavLink to="/gestion-ciclos" className={() => navLinkClass('/gestion-ciclos')}>
            <CiRepeat className="mr-3 h-5 w-5 flex-shrink-0" /> Gestión de Ciclos
          </NavLink>
          <NavLink to="/formulacion" className={() => navLinkClass('/formulacion')}>
            <CiGrid41 className="mr-3 h-5 w-5 flex-shrink-0" /> Formulación {/* Icono corregido */}
          </NavLink>
          <NavLink to="/informes" className={() => navLinkClass('/informes')}>
            <CiFileOn className="mr-3 h-5 w-5 flex-shrink-0" /> Informes
          </NavLink>
          <NavLink to="/gestion-catalogos" className={() => navLinkClass('/gestion-catalogos')}>
            <CiSettings className="mr-3 h-5 w-5 flex-shrink-0" /> Catálogos (Etapas, etc.)
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-center text-gray-400">
          Versión 0.2.0
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white shadow-sm py-3 px-6 border-b border-gray-200 flex items-center">
          <NavLink to="/" className="text-gray-500 hover:text-indigo-600">
            <CiHome className="h-5 w-5" />
          </NavLink>
          <div className="flex items-center text-sm ml-2">{breadcrumbs}</div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="max-w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
export default MainLayout
