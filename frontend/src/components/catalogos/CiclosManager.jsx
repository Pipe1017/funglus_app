// src/components/catalogos/CiclosManager.jsx
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
import { API_BASE_URL } from '../../config/api'

const FASTAPI_BASE_URL = API_BASE_URL
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
      const response = await fetch(`${CICLOS_ENDPOINT}/?limit=1000`)
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
      fecha_inicio: ciclo.fecha_inicio || ''
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
    setIsSubmitting(true)
    setError('')

    const payload = {
      nombre_ciclo: formData.nombre_ciclo.trim(),
      descripcion: formData.descripcion.trim(),
      fecha_inicio: formData.fecha_inicio || null
    }

    try {
      const url = isEditing ? `${CICLOS_ENDPOINT}/${formData.id}` : CICLOS_ENDPOINT
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }

      const actionText = isEditing ? 'actualizado' : 'creado'
      displayMessage(setSuccessMessage, `Ciclo ${actionText} exitosamente.`)
      fetchCiclos()
      resetForm()
    } catch (err) {
      console.error('Error submitting ciclo:', err)
      displayMessage(setError, `Error al guardar ciclo: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Ciclos</h1>
          <div className="flex gap-3">
            <button
              onClick={fetchCiclos}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
            >
              <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
              Recargar
            </button>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <FiPlusCircle />
              Nuevo Ciclo
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {isFormVisible && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Editar Ciclo' : 'Nuevo Ciclo'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Ciclo *
                </label>
                <input
                  type="text"
                  name="nombre_ciclo"
                  value={formData.nombre_ciclo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
                >
                  <FiSave />
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  <FiXCircle />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <FiLoader className="animate-spin text-4xl text-blue-500" />
            </div>
          ) : ciclos.length === 0 ? (
            <div className="text-center p-12 text-gray-500">
              No hay ciclos registrados. ¡Crea uno nuevo!
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Inicio
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ciclos.map((ciclo) => (
                  <tr key={ciclo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ciclo.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ciclo.nombre_ciclo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {ciclo.descripcion || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ciclo.fecha_inicio || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(ciclo)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FiEdit className="inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(ciclo.id, ciclo.nombre_ciclo)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default CiclosManager
