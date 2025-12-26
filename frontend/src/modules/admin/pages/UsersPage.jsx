// src/modules/admin/pages/UsersPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { FiUsers, FiPlus, FiRefreshCw, FiEdit, FiTrash2, FiSearch, FiDownload } from 'react-icons/fi';
import UserModal from '../components/UserModal';
import { API_BASE_URL } from '../../core/config/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar usuarios');
      
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`¿Desactivar usuario ${userEmail}?`)) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Error al desactivar usuario');
      
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleModalClose = (shouldRefresh) => {
    setIsModalOpen(false);
    setEditingUser(null);
    if (shouldRefresh) fetchUsers();
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      operator: 'bg-blue-100 text-blue-800 border-blue-200',
      viewer: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[role] || colors.viewer;
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: '⚡',
      operator: '✏️',
      viewer: '👁️'
    };
    return icons[role] || '👤';
  };

  const exportToCSV = () => {
    const headers = ['Email', 'Nombre', 'Rol', 'Estado', 'Módulos'];
    const rows = users.map(u => [
      u.email,
      u.full_name || '',
      u.role,
      u.is_active ? 'Activo' : 'Inactivo',
      u.allowed_modules?.join(', ') || ''
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-50 rounded-lg">
            <FiUsers className="text-brand-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
            <p className="text-sm text-gray-500">Administra los usuarios y sus permisos del sistema</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FiDownload />
            Exportar
          </button>
          
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
            Recargar
          </button>
          
          <button
            onClick={handleCreateUser}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <FiPlus />
            Crear Usuario
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por email, nombre o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-100 focus:border-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <FiRefreshCw className="animate-spin text-brand-500 mx-auto mb-4" size={32} />
            <p className="text-gray-500">Cargando usuarios...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {searchTerm ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios registrados'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-brand-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-900 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-900 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-900 uppercase tracking-wider">
                    Módulos Permitidos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-900 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-brand-900 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name || user.email}
                        </div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                        <span>{getRoleIcon(user.role)}</span>
                        {user.role === 'admin' ? 'Administrador' : user.role === 'operator' ? 'Operador' : 'Visor'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.allowed_modules?.map((module) => (
                          <span
                            key={module}
                            className="inline-flex px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 border border-gray-200"
                          >
                            {module}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {user.is_active ? '✓ Activo' : '✗ Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-brand-600 hover:text-brand-800 p-1.5 rounded-md hover:bg-brand-50 transition-colors"
                        title="Editar"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="text-red-600 hover:text-red-800 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                        title="Desactivar"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">{users.length}</div>
            <div className="text-xs text-gray-500">Total Usuarios</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'admin').length}</div>
            <div className="text-xs text-gray-500">Administradores</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'operator').length}</div>
            <div className="text-xs text-gray-500">Operadores</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{users.filter(u => u.is_active).length}</div>
            <div className="text-xs text-gray-500">Activos</div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <UserModal
          user={editingUser}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}