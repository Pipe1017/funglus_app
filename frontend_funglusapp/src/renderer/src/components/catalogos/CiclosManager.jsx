// src/renderer/src/components/catalogos/CiclosManager.jsx
import React, { useCallback, useEffect, useState } from 'react'
import {
  FiEdit,
  FiLoader,
  FiPlusCircle,
  FiRefreshCw,
  FiSave,
  FiTrash2,
  FiXCircle
} from 'react-icons/fi'

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'
const CICLOS_ENDPOINT = `${FASTAPI_BASE_URL}/catalogos/ciclos`

const initialCicloFormState = {
  id: null,
  nombre_ciclo: '',
  descripcion: '',
  fecha_inicio: '' // Formato YYYY-MM-DD
}

function CiclosManager() {
  const [ciclos, setCiclos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [isFormVisible, setIsFormVisible] = useState(false)
  const [formData, setFormData] = useState(initialCicloFormState)
  const [isEditing, setIsEditing] = useState(false)

  const displayMessage = (setter, message, duration = 3000) => {
    setter(message)
    setTimeout(() => setter(''), duration)
  }

  const fetchCiclos = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`${CICLOS_ENDPOINT}/?limit=1000`) // Backend ya ordena por created_at desc
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      const data = await response.json()
      setCiclos(data || [])
    } catch (err) {
      console.error('Error fetching ciclos generales:', err)
      setError(`Error al cargar ciclos generales: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCiclos()
  }, [fetchCiclos])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData(initialCicloFormState)
    setIsEditing(false)
    setIsFormVisible(false)
    setError('')
    // El successMessage se limpia a través de displayMessage
  }

  const handleAddNew = () => {
    resetForm()
    setIsFormVisible(true)
  }

  const handleEdit = (ciclo) => {
    setFormData({
      id: ciclo.id,
      nombre_ciclo: ciclo.nombre_ciclo || '',
      descripcion: ciclo.descripcion || '',
      fecha_inicio: ciclo.fecha_inicio || '' // Asume formato YYYY-MM-DD
    })
    setIsEditing(true)
    setIsFormVisible(true)
    setError('')
  }

  const handleDelete = async (cicloId, cicloNombre) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres borrar el ciclo "${cicloNombre}" (ID: ${cicloId})?`
      )
    ) {
      return
    }
    setIsSubmitting(true)
    setError('')
    try {
      const response = await fetch(`${CICLOS_ENDPOINT}/${cicloId}`, { method: 'DELETE' })
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      displayMessage(setSuccessMessage, `Ciclo "${cicloNombre}" borrado exitosamente.`)
      fetchCiclos()
    } catch (err) {
      console.error('Error deleting ciclo:', err)
      displayMessage(setError, `Error al borrar ciclo: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nombre_ciclo.trim()) {
      setError('El nombre del ciclo es obligatorio.')
      return
    }
    setIsSubmitting(true)
    setError('')

    const payload = {
      nombre_ciclo: formData.nombre_ciclo.trim(),
      descripcion: formData.descripcion.trim() || null,
      fecha_inicio: formData.fecha_inicio || null
    }

    try {
      let response
      let url = CICLOS_ENDPOINT
      if (isEditing && formData.id) {
        url += `/${formData.id}`
        response = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        url += `/`
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      displayMessage(
        setSuccessMessage,
        `Ciclo ${isEditing ? 'actualizado' : 'creado'} exitosamente.`
      )
      resetForm()
      fetchCiclos()
    } catch (err) {
      console.error('Error saving ciclo:', err)
      let errorMessage = `Error al guardar ciclo: ${err.message}`
      // Intenta obtener más detalles si el backend los envía en un JSON
      try {
        const errorResponse = await err.response?.json()
        if (errorResponse && errorResponse.detail) {
          errorMessage += ` Detalle: ${errorResponse.detail}`
        }
      } catch (jsonError) {
        // No hacer nada si la respuesta del error no es JSON
      }
      displayMessage(setError, errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateForDisplay = (isoOrDateString) => {
    if (!isoOrDateString) return '-'
    // Intenta parsear como fecha completa, luego como YYYY-MM-DD
    const date = new Date(isoOrDateString)
    if (isNaN(date.getTime())) {
      // Si no es una fecha ISO válida, podría ser YYYY-MM-DD
      const parts = isoOrDateString.split('-')
      if (parts.length === 3) {
        // Asume YYYY-MM-DD y lo convierte a un formato localizado
        return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      }
      return isoOrDateString // Fallback al string original si no se puede parsear
    }
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center text-sm shadow-sm disabled:opacity-60"
          disabled={isFormVisible || isLoading || isSubmitting}
        >
          <FiPlusCircle className="mr-2" /> Añadir Nuevo Ciclo General
        </button>
      </div>

      {isFormVisible && (
        <div className="p-6 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 ease-in-out">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-medium text-gray-800 border-b pb-2 mb-4">
              {isEditing ? 'Editar Ciclo General' : 'Crear Nuevo Ciclo General'}
            </h3>
            <div>
              <label
                htmlFor="nombre_ciclo_general_form"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre del Ciclo (ID Usuario):
              </label>
              <input
                type="text"
                name="nombre_ciclo"
                id="nombre_ciclo_general_form"
                value={formData.nombre_ciclo}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="descripcion_ciclo_general_form"
                className="block text-sm font-medium text-gray-700"
              >
                Descripción (Opcional):
              </label>
              <textarea
                name="descripcion"
                id="descripcion_ciclo_general_form"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="fecha_inicio_general_form"
                className="block text-sm font-medium text-gray-700"
              >
                Fecha de Inicio (Opcional):
              </label>
              <input
                type="date"
                name="fecha_inicio"
                id="fecha_inicio_general_form"
                value={formData.fecha_inicio}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center gap-x-3 pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center text-sm shadow-sm disabled:opacity-60"
              >
                {isSubmitting ? (
                  <FiLoader className="animate-spin mr-2" />
                ) : (
                  <FiSave className="mr-2" />
                )}
                {isEditing ? 'Actualizar Ciclo' : 'Guardar Ciclo'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center text-sm shadow-sm"
              >
                <FiXCircle className="mr-2" /> Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300 shadow-sm">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="mt-3 text-sm text-green-600 bg-green-100 p-3 rounded-md border border-green-300 shadow-sm">
          {successMessage}
        </p>
      )}

      <div className="mt-6 bg-white p-2 rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-3 px-4 pt-3">
          <h3 className="text-xl font-medium text-gray-800">Ciclos Generales Existentes</h3>
          <button
            onClick={fetchCiclos}
            disabled={isLoading || isSubmitting}
            className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
            title="Refrescar lista"
          >
            <FiRefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {isLoading && (
          <p className="p-4 text-sm text-gray-500 italic text-center">
            Cargando ciclos generales...
          </p>
        )}
        {!isLoading && !error && ciclos.length === 0 && (
          <p className="p-4 text-sm text-gray-500 text-center">
            No hay ciclos generales creados todavía.
          </p>
        )}
        {!isLoading && !error && ciclos.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Nombre Ciclo
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha Inicio
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Creado
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Actualizado
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ciclos.map((ciclo) => (
                  <tr key={ciclo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                      {ciclo.nombre_ciclo}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-500 max-w-xs truncate"
                      title={ciclo.descripcion}
                    >
                      {ciclo.descripcion || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {ciclo.fecha_inicio || '-'}
                    </td>
                    {/* Asumiendo que el backend ahora devuelve created_at y updated_at para CicloInDB */}
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {formatDateForDisplay(ciclo.created_at)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {formatDateForDisplay(ciclo.updated_at)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(ciclo)}
                        className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-md hover:bg-indigo-100"
                        title="Editar"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(ciclo.id, ciclo.nombre_ciclo)}
                        className="text-red-600 hover:text-red-800 p-1.5 rounded-md hover:bg-red-100"
                        title="Borrar"
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
    </div>
  )
}

export default CiclosManager
