// src/renderer/src/layouts/MainLayout.jsx
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { CiHome, CiBeaker1 } from 'react-icons/ci';

function MainLayout() {
  const location = useLocation();
  const commonLinkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-150 text-sm";
  const activeLinkClasses = "bg-gray-900 text-white";

  const navLinkClass = (path) => {
    const baseNavPath = path.split('/')[1];
    const currentLocationBase = location.pathname.split('/')[1];
    const isActive = baseNavPath === currentLocationBase;
    return `${commonLinkClasses} ${isActive ? activeLinkClasses : ''}`;
  }

  const pathnames = location.pathname.split('/').filter(x => x);
  const breadcrumbs = pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
    return (
      <React.Fragment key={routeTo}>
        <span className="h-5 w-5 text-gray-400 mx-1">/</span>
        {isLast ? (
          <span className="font-medium text-gray-700">{displayName}</span>
        ) : (
          <NavLink to={routeTo} className="text-indigo-500 hover:text-indigo-700 hover:underline">
            {displayName}
          </NavLink>
        )}
      </React.Fragment>
    );
  });

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-800 text-gray-100 flex flex-col flex-shrink-0 shadow-lg">
        <div className="px-5 py-5 border-b border-gray-700 flex items-center space-x-3">
          <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">F</div>
          <h1 className="text-xl font-bold text-white">FunglusApp</h1>
        </div>
        <nav className="flex-grow px-3 py-4 space-y-1.5">
          <NavLink to="/laboratorio" className={() => navLinkClass("/laboratorio")}>
            <CiBeaker1 className="mr-3 h-5 w-5 flex-shrink-0" />
            Laboratorio
          </NavLink>
          <NavLink to="/formulacion" className={() => navLinkClass("/formulacion")}>
            <CiBeaker1 className="mr-3 h-5 w-5 flex-shrink-0" /> Formulación
          </NavLink>
          <NavLink to="/informes" className={() => navLinkClass("/informes")}>
            <CiBeaker1 className="mr-3 h-5 w-5 flex-shrink-0" /> Informes
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-center text-gray-400">
          Versión 0.1.0
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white shadow-sm py-3 px-6 border-b border-gray-200">
            <div className="flex items-center text-sm">
                <NavLink to="/" className="text-gray-500 hover:text-indigo-600">
                    <CiHome className="h-5 w-5"/>
                </NavLink>
                {breadcrumbs}
            </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="max-w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;