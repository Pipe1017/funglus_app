// src/modules/admin/components/ModuleSelector.jsx
import React from 'react'
import { CiBeaker1, CiFileOn, CiSettings, CiTempHigh } from 'react-icons/ci'

const AVAILABLE_MODULES = [
  { 
    id: 'laboratorio', 
    name: 'Laboratorio', 
    icon: CiBeaker1, 
    color: 'blue',
    description: 'Gestión de muestras y análisis'
  },
  { 
    id: 'informes', 
    name: 'Informes', 
    icon: CiFileOn, 
    color: 'purple',
    description: 'Visualización de reportes'
  },
  { 
    id: 'siembra', 
    name: 'Siembra', 
    icon: CiSettings, 
    color: 'green',
    description: 'Control de siembra'
  },
  { 
    id: 'incubacion', 
    name: 'Incubación', 
    icon: CiTempHigh, 
    color: 'orange',
    description: 'Monitoreo de incubación'
  },
]

// Plantillas de roles predefinidos
const ROLE_PRESETS = {
  admin: {
    name: 'Administrador',
    modules: ['laboratorio', 'informes', 'siembra', 'incubacion'],
    description: 'Acceso completo a todos los módulos'
  },
  manager: {
    name: 'Gerente',
    modules: ['informes'],
    description: 'Solo visualización de informes'
  },
  operator: {
    name: 'Operador',
    modules: ['laboratorio', 'informes'],
    description: 'Operación de laboratorio y consulta de informes'
  },
  viewer: {
    name: 'Visor',
    modules: ['laboratorio', 'siembra', 'incubacion', 'informes'],
    description: 'Solo lectura de todos los módulos'
  }
}

export default function ModuleSelector({ selectedModules = [], onChange, selectedRole }) {
  const toggleModule = (moduleId) => {
    if (selectedModules.includes(moduleId)) {
      onChange(selectedModules.filter(m => m !== moduleId))
    } else {
      onChange([...selectedModules, moduleId])
    }
  }

  const applyRolePreset = (role) => {
    const preset = ROLE_PRESETS[role]
    if (preset) {
      onChange(preset.modules)
    }
  }

  const getColorClasses = (color, isSelected) => {
    const colors = {
      blue: isSelected 
        ? 'border-blue-500 bg-blue-50 text-blue-700' 
        : 'border-gray-200 hover:border-blue-300',
      purple: isSelected 
        ? 'border-purple-500 bg-purple-50 text-purple-700' 
        : 'border-gray-200 hover:border-purple-300',
      green: isSelected 
        ? 'border-green-500 bg-green-50 text-green-700' 
        : 'border-gray-200 hover:border-green-300',
      orange: isSelected 
        ? 'border-orange-500 bg-orange-50 text-orange-700' 
        : 'border-gray-200 hover:border-orange-300',
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Módulos Permitidos
        </label>
        
        {/* Botón de plantilla rápida según rol */}
        {selectedRole && selectedRole !== 'admin' && ROLE_PRESETS[selectedRole] && (
          <button
            type="button"
            onClick={() => applyRolePreset(selectedRole)}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium"
          >
            ⚡ Aplicar plantilla de {ROLE_PRESETS[selectedRole].name}
          </button>
        )}
      </div>

      {/* Info sobre plantilla del rol */}
      {selectedRole && ROLE_PRESETS[selectedRole] && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
          <strong>{ROLE_PRESETS[selectedRole].name}:</strong> {ROLE_PRESETS[selectedRole].description}
        </div>
      )}

      {/* Grid de módulos */}
      <div className="grid grid-cols-2 gap-3">
        {AVAILABLE_MODULES.map(module => {
          const isSelected = selectedModules.includes(module.id)
          const ModuleIcon = module.icon
          
          return (
            <div
              key={module.id}
              onClick={() => toggleModule(module.id)}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                ${getColorClasses(module.color, isSelected)}
              `}
            >
              <div className="flex items-start gap-3">
                <ModuleIcon className="text-2xl flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm truncate">
                      {module.name}
                    </span>
                    {isSelected && (
                      <span className="text-green-600 text-lg flex-shrink-0">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {module.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Contador de módulos seleccionados */}
      <div className="text-xs text-gray-500 text-center">
        {selectedModules.length === 0 && (
          <span className="text-orange-600 font-medium">
            ⚠️ Selecciona al menos un módulo
          </span>
        )}
        {selectedModules.length > 0 && (
          <span>
            {selectedModules.length} módulo{selectedModules.length !== 1 ? 's' : ''} seleccionado{selectedModules.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}

// Export para usar en otros componentes
export { AVAILABLE_MODULES, ROLE_PRESETS }