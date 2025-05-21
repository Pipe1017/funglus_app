// src/renderer/src/components/catalogos/OrigenesManager.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { FiEdit, FiPlusCircle, FiSave, FiTrash2, FiXCircle } from 'react-icons/fi'

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'

const initialOrigenFormState = {
  id: null,
  nombre: '',
  descripcion: ''
}

function OrigenesManager() {
  const [origenes, setOrigenes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [isFormVisible, setIsFormVisible] = useState(false)
  const [formData, setFormData] = useState(initialOrigenFormState)
  const [isEditing, setIsEditing] = useState(false)

  const fetchOrigenes = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      console.log('OrigenesManager: Solicitando todos los origenes vía HTTP...')
      const response = await fetch(`${FASTAPI_BASE_URL}/catalogos/origenes/?limit=1000`)
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      const data = await response.json()
      console.log('OrigenesManager: Origenes recibidos:', data)
      setOrigenes(data || [])
    } catch (err) {
      setError(`Error al cargar origenes: ${err.message}`)
      console.error('Error fetching origenes:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrigenes()
  }, [fetchOrigenes])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData(initialOrigenFormState)
    setIsEditing(false)
    setIsFormVisible(false)
    setError('')
    setSuccessMessage('')
  }

  const handleAddNew = () => {
    resetForm()
    setIsFormVisible(true)
  }

  const handleEdit = (origen) => {
    setFormData({
      id: origen.id,
      nombre: origen.nombre || '',
      descripcion: origen.descripcion || ''
    })
    setIsEditing(true)
    setIsFormVisible(true)
    setError('')
    setSuccessMessage('')
  }

  const handleDelete = async (origenId, origenNombre) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres borrar el origen "${origenNombre}" (ID: ${origenId})?`
      )
    ) {
      setIsLoading(true)
      setError('')
      setSuccessMessage('')
      try {
        const response = await fetch(`${FASTAPI_BASE_URL}/catalogos/origenes/${origenId}`, {
          method: 'DELETE'
        })
        if (!response.ok) {
          const errData = await response.json().catch(() => ({ detail: response.statusText }))
          throw new Error(errData.detail || `Error HTTP ${response.status}`)
        }
        setSuccessMessage(`Origen "${origenNombre}" borrado exitosamente.`)
        fetchOrigenes()
      } catch (err) {
        setError(`Error al borrar origen: ${err.message}`)
        console.error('Error deleting origen:', err)
      } finally {
        setIsLoading(false)
        setTimeout(() => {
          setError('')
          setSuccessMessage('')
        }, 3000)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nombre.trim()) {
      setError('El nombre del origen es obligatorio.')
      return
    }
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    const payload = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim() || null
    }

    try {
      let response
      if (isEditing && formData.id) {
        response = await fetch(`${FASTAPI_BASE_URL}/catalogos/origenes/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        response = await fetch(`${FASTAPI_BASE_URL}/catalogos/origenes/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }

      setSuccessMessage(
        isEditing ? 'Origen actualizado exitosamente.' : 'Origen creado exitosamente.'
      )
      resetForm()
      fetchOrigenes()
    } catch (err) {
      setError(`Error al guardar origen: ${err.message}`)
      console.error('Error saving origen:', err)
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setError('')
        setSuccessMessage('')
      }, 3000)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddNew}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center text-sm"
        disabled={isLoading || isFormVisible}
      >
        <FiPlusCircle className="mr-2" /> Añadir Nuevo Origen
      </button>

      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-3 shadow"
        >
          <h3 className="text-lg font-medium mb-2 text-gray-800">
            {isEditing ? 'Editar Origen' : 'Crear Nuevo Origen'}
          </h3>
          <div>
            <label htmlFor="origen_nombre_form" className="block text-sm font-medium text-gray-700">
              Nombre del Origen:
            </label>
            <input
              type="text"
              name="nombre"
              id="origen_nombre_form"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="origen_descripcion_form"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción (Opcional):
            </label>
            <textarea
              name="descripcion"
              id="origen_descripcion_form"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
            >
              <FiSave className="mr-2" />{' '}
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Origen' : 'Crear Origen'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 flex items-center text-sm"
            >
              <FiXCircle className="mr-2" /> Cancelar
            </button>
          </div>
        </form>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="mt-2 text-sm text-green-600 bg-green-100 p-3 rounded-md border border-green-300">
          {successMessage}
        </p>
      )}

      <div className="mt-6 overflow-x-auto">
        <h3 className="text-lg font-medium mb-2 text-gray-700">Origenes Existentes</h3>
        {isLoading && <p className="text-sm text-gray-500 italic">Cargando origenes...</p>}
        {!isLoading && origenes.length === 0 && (
          <p className="text-sm text-gray-500">No hay origenes creados todavía.</p>
        )}
        {!isLoading && origenes.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200 border shadow-sm rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nombre Origen
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {origenes.map((origen) => (
                <tr key={origen.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{origen.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {origen.nombre}
                  </td>
                  <td
                    className="px-4 py-3 text-sm text-gray-500 max-w-md truncate"
                    title={origen.descripcion}
                  >
                    {origen.descripcion || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(origen)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Editar"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(origen.id, origen.nombre)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Borrar"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
export default OrigenesManager
