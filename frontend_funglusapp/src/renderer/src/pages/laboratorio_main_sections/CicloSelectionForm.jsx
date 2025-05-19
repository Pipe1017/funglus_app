// src/renderer/src/components/laboratorio/general/CicloSelectionForm.jsx
import React, { useEffect, useState } from 'react'
import { FiPlusCircle, FiRefreshCw } from 'react-icons/fi'
import { useCiclo } from '../../../contexts/CicloContext' // Para leer y setear el ciclo global

const initialFormData = {
  nombre_ciclo: '',
  descripcion: '',
  fecha_inicio: ''
}

function CicloSelectionForm({ onCicloSelected }) {
  // onCicloSelected es un callback al padre
  const {
    currentCiclo: globalCurrentCiclo, // Nombre del ciclo global
    selectCiclo: setGlobalCiclo, // Función para setear el nombre del ciclo global
    availableCiclos, // Lista de objetos {id, nombre_ciclo} del backend
    isFetchingCiclos,
    refreshCiclos
  } = useCiclo()

  const [formData, setFormData] = useState(initialFormState)
  const [selectedExistingCiclo, setSelectedExistingCiclo] = useState(globalCurrentCiclo || '') // Para el dropdown
  const [isCreatingNew, setIsCreatingNew] = useState(false) // Para mostrar/ocultar form de nuevo ciclo
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Sincronizar el dropdown si el ciclo global cambia desde otro lugar
  useEffect(() => {
    setSelectedExistingCiclo(globalCurrentCiclo || '')
    if (globalCurrentCiclo) {
      // Si hay un ciclo global, no mostramos el form de creación por defecto
      setIsCreatingNew(false)
      // Y actualizamos el formData del input por si el usuario quiere editarlo o verlo
      const cicloDetails = availableCiclos.find((c) => c.nombre_ciclo === globalCurrentCiclo)
      if (cicloDetails) {
        setFormData({
          nombre_ciclo: cicloDetails.nombre_ciclo,
          descripcion: cicloDetails.descripcion || '',
          fecha_inicio: cicloDetails.fecha_inicio || ''
        })
      } else if (globalCurrentCiclo) {
        // Si es un ciclo nuevo que aún no está en availableCiclos
        setFormData({ ...initialFormState, nombre_ciclo: globalCurrentCiclo })
      }
    }
  }, [globalCurrentCiclo, availableCiclos])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'nombre_ciclo' && isCreatingNew) {
      setSelectedExistingCiclo('') // Deseleccionar el dropdown si se escribe en nuevo
    }
  }

  const handleSelectCiclo = (e) => {
    const nombreCicloSeleccionado = e.target.value
    setSelectedExistingCiclo(nombreCicloSeleccionado)
    setIsCreatingNew(false) // Ocultar form de nuevo ciclo
    setGlobalCiclo(nombreCicloSeleccionado) // Actualiza el ciclo global
    if (onCicloSelected && nombreCicloSeleccionado) {
      const cicloObj = availableCiclos.find((c) => c.nombre_ciclo === nombreCicloSeleccionado)
      if (cicloObj) onCicloSelected(cicloObj) // Llama al callback del padre con el objeto ciclo
    } else if (onCicloSelected && !nombreCicloSeleccionado) {
      onCicloSelected(null) // Ciclo deseleccionado
    }
    setMessage({ text: '', type: '' }) // Limpiar mensajes
  }

  const toggleCreateNewForm = () => {
    setIsCreatingNew(!isCreatingNew)
    if (!isCreatingNew) {
      // Si vamos a mostrar el form de creación
      setFormData(initialFormState) // Limpiar datos del formulario
      setSelectedExistingCiclo('') // Deseleccionar el dropdown
      setGlobalCiclo('') // Limpiar ciclo global para indicar que se está creando uno nuevo
      if (onCicloSelected) onCicloSelected(null)
    }
    setMessage({ text: '', type: '' })
  }

  const handleSubmitNewCiclo = async (e) => {
    e.preventDefault()
    if (!formData.nombre_ciclo.trim()) {
      setMessage({ text: 'El nombre del nuevo ciclo es obligatorio.', type: 'error' })
      return
    }
    setIsLoading(true)
    setMessage({ text: '', type: '' })

    try {
      console.log('CicloSelectionForm: Creando nuevo ciclo:', formData)
      // El backend ya verifica si el nombre_ciclo existe
      const nuevoCiclo = await window.electronAPI.createCiclo({
        nombre_ciclo: formData.nombre_ciclo.trim(),
        descripcion: formData.descripcion.trim() || null,
        fecha_inicio: formData.fecha_inicio || null
      })
      setSuccessMessage(`Ciclo "${nuevoCiclo.nombre_ciclo}" creado exitosamente.`)
      refreshCiclos() // Refrescar la lista de ciclos disponibles en el dropdown
      setGlobalCiclo(nuevoCiclo.nombre_ciclo) // Establecer el nuevo ciclo como activo globalmente
      if (onCicloSelected) onCicloSelected(nuevoCiclo) // Notificar al padre
      setIsCreatingNew(false) // Ocultar formulario de creación
      setSelectedExistingCiclo(nuevoCiclo.nombre_ciclo) // Seleccionar el nuevo en el dropdown
      setFormData(initialFormState) // Limpiar campos de texto
    } catch (err) {
      setMessage({ text: `Error al crear ciclo: ${err.message}`, type: 'error' })
      console.error('Error creating ciclo:', err)
    } finally {
      setIsLoading(false)
      setTimeout(() => setMessage({ text: '', type: '' }), 5000)
    }
  }

  // Para el botón de "Usar este ciclo" si se escribe en el input
  const handleSetCicloFromInput = () => {
    const nombreCicloInput = formData.nombre_ciclo.trim()
    if (nombreCicloInput) {
      const cicloExistente = availableCiclos.find(
        (c) => c.nombre_ciclo.toUpperCase() === nombreCicloInput.toUpperCase()
      )
      if (cicloExistente) {
        setGlobalCiclo(cicloExistente.nombre_ciclo)
        if (onCicloSelected) onCicloSelected(cicloExistente)
        setSelectedExistingCiclo(cicloExistente.nombre_ciclo)
        setIsCreatingNew(false)
        setMessage({ text: `Ciclo '${cicloExistente.nombre_ciclo}' seleccionado.`, type: 'info' })
      } else {
        // Si no existe, asumimos que es uno nuevo y el usuario debe usar el form de creación
        setMessage({
          text: `El ciclo '${nombreCicloInput}' no existe. Use el formulario de abajo para crearlo.`,
          type: 'warning'
        })
        setIsCreatingNew(true) // Mostrar el formulario para crear
        setSelectedExistingCiclo('')
      }
    } else {
      setGlobalCiclo('')
      if (onCicloSelected) onCicloSelected(null)
      setMessage({ text: 'Por favor, ingrese o seleccione un nombre de ciclo.', type: 'info' })
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 5000)
  }

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-slate-50 shadow-sm">
      <div className="mb-4">
        <label htmlFor="cicloSelect" className="block text-sm font-medium text-gray-700 mb-1">
          Seleccionar Ciclo Existente:
        </label>
        <div className="flex items-center gap-2">
          <select
            id="cicloSelect"
            value={selectedExistingCiclo}
            onChange={handleSelectCiclo}
            disabled={isLoading || isFetchingCiclos || isCreatingNew}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-70"
          >
            <option value="">-- Selecciona un Ciclo --</option>
            {Array.isArray(availableCiclos) &&
              availableCiclos.map((ciclo) => (
                <option key={ciclo.id} value={ciclo.nombre_ciclo}>
                  {ciclo.nombre_ciclo} (ID: {ciclo.id})
                </option>
              ))}
          </select>
          <button
            type="button"
            onClick={refreshCiclos}
            disabled={isFetchingCiclos || isLoading}
            className="p-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
            title="Refrescar lista de ciclos"
          >
            <FiRefreshCw className={`h-4 w-4 ${isFetchingCiclos ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {isFetchingCiclos && (
          <p className="text-xs text-gray-500 italic mt-1">Actualizando lista de ciclos...</p>
        )}
      </div>

      <div className="text-center my-3">
        <span className="text-sm text-gray-500">o</span>
      </div>

      {!isCreatingNew && (
        <button
          onClick={toggleCreateNewForm}
          className="w-full mb-3 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center text-sm"
          disabled={isLoading}
        >
          <FiPlusCircle className="mr-2" /> Crear Nuevo Ciclo
        </button>
      )}

      {isCreatingNew && (
        <form
          onSubmit={handleSubmitNewCiclo}
          className="mt-2 p-3 border-t border-gray-200 space-y-3"
        >
          <h4 className="text-md font-medium text-gray-700">Datos del Nuevo Ciclo:</h4>
          <div>
            <label htmlFor="nombre_ciclo_nuevo" className="block text-sm font-medium text-gray-700">
              Nombre del Ciclo (ID Usuario):
            </label>
            <input
              type="text"
              name="nombre_ciclo"
              id="nombre_ciclo_nuevo"
              value={formData.nombre_ciclo}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="descripcion_nuevo" className="block text-sm font-medium text-gray-700">
              Descripción (Opcional):
            </label>
            <textarea
              name="descripcion"
              id="descripcion_nuevo"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows="2"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="fecha_inicio_nuevo" className="block text-sm font-medium text-gray-700">
              Fecha de Inicio (Opcional):
            </label>
            <input
              type="date"
              name="fecha_inicio"
              id="fecha_inicio_nuevo"
              value={formData.fecha_inicio}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
            >
              <FiSave className="mr-2" /> {isLoading ? 'Creando...' : 'Crear y Establecer Ciclo'}
            </button>
            <button
              type="button"
              onClick={toggleCreateNewForm}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 flex items-center text-sm"
            >
              <FiXCircle className="mr-2" /> Cancelar Creación
            </button>
          </div>
        </form>
      )}

      {message.text && (
        <p
          className={`mt-3 text-xs font-medium p-2 rounded-md ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : message.type === 'info'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : message.type === 'warning'
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  )
}
export default CicloSelectionForm
