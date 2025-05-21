// src/renderer/src/components/catalogos/CiclosManager.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { FiEdit, FiPlusCircle, FiSave, FiTrash2, FiXCircle } from 'react-icons/fi'

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1' // URL base de tu API

const initialCicloFormState = {
  id: null,
  nombre_ciclo: '',
  descripcion: '',
  fecha_inicio: ''
}

function CiclosManager() {
  const [ciclos, setCiclos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [isFormVisible, setIsFormVisible] = useState(false)
  const [formData, setFormData] = useState(initialCicloFormState)
  const [isEditing, setIsEditing] = useState(false)

  const fetchCiclos = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      console.log('CiclosManager: Solicitando todos los ciclos vía HTTP...')
      const response = await fetch(`${FASTAPI_BASE_URL}/catalogos/ciclos/?limit=1000`) // GET all
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      const data = await response.json()
      console.log('CiclosManager: Ciclos recibidos:', data)
      setCiclos(data || [])
    } catch (err) {
      setError(`Error al cargar ciclos: ${err.message}`)
      console.error('Error fetching ciclos:', err)
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
    setSuccessMessage('')
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
    setSuccessMessage('')
  }

  const handleDelete = async (cicloId, cicloNombre) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres borrar el ciclo "${cicloNombre}" (ID: ${cicloId})?`
      )
    ) {
      setIsLoading(true)
      setError('')
      setSuccessMessage('')
      try {
        const response = await fetch(`${FASTAPI_BASE_URL}/catalogos/ciclos/${cicloId}`, {
          method: 'DELETE'
        })
        if (!response.ok) {
          const errData = await response.json().catch(() => ({ detail: response.statusText }))
          throw new Error(errData.detail || `Error HTTP ${response.status}`)
        }
        // const result = await response.json(); // DELETE suele devolver 200 OK con mensaje o 204 No Content
        setSuccessMessage(`Ciclo "${cicloNombre}" borrado exitosamente.`)
        fetchCiclos()
      } catch (err) {
        setError(`Error al borrar ciclo: ${err.message}`)
        console.error('Error deleting ciclo:', err)
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
    if (!formData.nombre_ciclo.trim()) {
      setError('El nombre del ciclo es obligatorio.')
      return
    }
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    const payload = {
      nombre_ciclo: formData.nombre_ciclo.trim(),
      descripcion: formData.descripcion.trim() || null,
      fecha_inicio: formData.fecha_inicio || null
    }

    try {
      let response
      if (isEditing && formData.id) {
        console.log('CiclosManager: Actualizando ciclo vía HTTP:', formData.id, payload)
        response = await fetch(`${FASTAPI_BASE_URL}/catalogos/ciclos/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        console.log('CiclosManager: Creando nuevo ciclo vía HTTP:', payload)
        response = await fetch(`${FASTAPI_BASE_URL}/catalogos/ciclos/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: response.statusText }))
        // Si el error es por nombre duplicado (400 Bad Request), el backend ya lo maneja
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }

      // const result = await response.json(); // El backend devuelve el objeto creado/actualizado
      setSuccessMessage(
        isEditing ? 'Ciclo actualizado exitosamente.' : 'Ciclo creado exitosamente.'
      )
      resetForm()
      fetchCiclos()
    } catch (err) {
      setError(`Error al guardar ciclo: ${err.message}`)
      console.error('Error saving ciclo:', err)
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setError('')
        setSuccessMessage('')
      }, 3000)
    }
  }

  return (
    // El JSX del return (formulario y tabla) no necesita cambios significativos,
    // ya que la lógica de estado y los handlers son los mismos.
    // Solo asegúrate de que todos los campos y botones funcionen como antes.
    <div className="space-y-4">
      <button
        onClick={handleAddNew}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center text-sm"
        disabled={isLoading || isFormVisible}
      >
        <FiPlusCircle className="mr-2" /> Añadir Nuevo Ciclo
      </button>

      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-3 shadow"
        >
          <h3 className="text-lg font-medium mb-2 text-gray-800">
            {isEditing ? 'Editar Ciclo' : 'Crear Nuevo Ciclo'}
          </h3>
          <div>
            <label htmlFor="nombre_ciclo" className="block text-sm font-medium text-gray-700">
              Nombre del Ciclo (ID Usuario):
            </label>
            <input
              type="text"
              name="nombre_ciclo"
              id="nombre_ciclo"
              value={formData.nombre_ciclo}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción (Opcional):
            </label>
            <input
              type="text"
              name="descripcion"
              id="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">
              Fecha de Inicio (Opcional):
            </label>
            <input
              type="date"
              name="fecha_inicio"
              id="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleInputChange}
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
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Ciclo' : 'Crear Ciclo'}
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
        <h3 className="text-lg font-medium mb-2 text-gray-700">Ciclos Existentes</h3>
        {isLoading && <p className="text-sm text-gray-500 italic">Cargando ciclos...</p>}
        {!isLoading && ciclos.length === 0 && (
          <p className="text-sm text-gray-500">No hay ciclos creados todavía.</p>
        )}
        {!isLoading && ciclos.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200 border shadow-sm rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nombre Ciclo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ciclos.map((ciclo) => (
                <tr key={ciclo.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{ciclo.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ciclo.nombre_ciclo}
                  </td>
                  <td
                    className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate"
                    title={ciclo.descripcion}
                  >
                    {ciclo.descripcion || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {ciclo.fecha_inicio || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(ciclo)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Editar"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(ciclo.id, ciclo.nombre_ciclo)}
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
export default CiclosManager
