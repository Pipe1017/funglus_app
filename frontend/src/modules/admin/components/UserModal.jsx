// src/modules/admin/components/UserModal.jsx
import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiAlertCircle } from 'react-icons/fi';
import { API_BASE_URL } from '../../core/config/api';

const AVAILABLE_MODULES = [
  { id: 'laboratorio', label: 'Laboratorio', icon: '🧪' },
  { id: 'informes', label: 'Informes', icon: '📄' },
  { id: 'siembra', label: 'Siembra', icon: '🌱' },
  { id: 'incubacion', label: 'Incubación', icon: '🌡️' }
];

const ROLES = [
  { value: 'admin', label: 'Administrador', description: 'Acceso completo al sistema' },
  { value: 'manager', label: 'Gerente', description: 'Solo acceso a informes' },
  { value: 'operator', label: 'Operador', description: 'Puede ver y editar en módulos permitidos' },
  { value: 'viewer', label: 'Visor', description: 'Solo lectura en módulos permitidos' }
];

export default function UserModal({ user, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'operator',
    is_active: true,
    allowed_modules: ['laboratorio']
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        password: '',
        full_name: user.full_name || '',
        role: user.role || 'operator',
        is_active: user.is_active ?? true,
        allowed_modules: user.allowed_modules || ['laboratorio']
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleModuleToggle = (moduleId) => {
    setFormData(prev => ({
      ...prev,
      allowed_modules: prev.allowed_modules.includes(moduleId)
        ? prev.allowed_modules.filter(m => m !== moduleId)
        : [...prev.allowed_modules, moduleId]
    }));
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('Mínimo 8 caracteres');
    if (!/[A-Z]/.test(password)) errors.push('Al menos una mayúscula');
    if (!/[0-9]/.test(password)) errors.push('Al menos un número');
    return errors;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    if (!user && !formData.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (formData.password) {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        errors.password = passwordErrors.join(', ');
      }
    }
    if (formData.role !== 'admin' && formData.allowed_modules.length === 0) {
      errors.allowed_modules = 'Selecciona al menos un módulo';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const url = user 
        ? `${API_BASE_URL}/users/${user.id}`
        : `${API_BASE_URL}/users/`;
      const method = user ? 'PUT' : 'POST';
      const payload = { ...formData };
      if (user && !payload.password) delete payload.password;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al guardar usuario');
      }

      onClose(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </h2>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <FiAlertCircle className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={!!user}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                validationErrors.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-brand-500 focus:ring-brand-100'
              } focus:ring-2 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500`}
              placeholder="usuario@funglus.com"
            />
            {validationErrors.email && <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña {user ? '(dejar vacío para mantener actual)' : '*'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!user}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                validationErrors.password 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-brand-500 focus:ring-brand-100'
              } focus:ring-2 outline-none transition-all`}
              placeholder="••••••••"
            />
            {validationErrors.password && <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rol *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            >
              {ROLES.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {formData.role === 'admin' && '⚡ Acceso completo al sistema'}
              {formData.role === 'manager' && '👨‍💼 Solo acceso a informes'}
              {formData.role === 'operator' && '✏️ Puede ver y editar en módulos permitidos'}
              {formData.role === 'viewer' && '👁️ Solo lectura en módulos permitidos'}
            </p>
          </div>

          {formData.role !== 'admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Módulos Permitidos *</label>
              <div className="grid grid-cols-1 gap-3">
                {AVAILABLE_MODULES.map(module => (
                  <label
                    key={module.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.allowed_modules.includes(module.id)
                        ? 'border-brand-300 bg-brand-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.allowed_modules.includes(module.id)}
                      onChange={() => handleModuleToggle(module.id)}
                      className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {module.icon} {module.label}
                    </span>
                  </label>
                ))}
              </div>
              {validationErrors.allowed_modules && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.allowed_modules}</p>
              )}
            </div>
          )}

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
            />
            <label htmlFor="is_active" className="ml-3 text-sm text-gray-700">Usuario Activo</label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FiSave />
              {isLoading ? 'Guardando...' : 'Guardar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}