// src/renderer/src/components/catalogos/CiclosManager.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { FiEdit, FiPlusCircle, FiSave, FiTrash2, FiXCircle } from 'react-icons/fi'

const initialCicloFormState = {
  id: null, // Para saber si estamos editando
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
      const data = await window.electronAPI.getAllCiclos()
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
        `¿Estás seguro de que quieres borrar el ciclo "${cicloNombre}" (ID: ${cicloId})? Esto no se puede deshacer.`
      )
    ) {
      setIsLoading(true)
      setError('')
      setSuccessMessage('')
      try {
        await window.electronAPI.deleteCiclo(cicloId)
        setSuccessMessage(`Ciclo "${cicloNombre}" borrado exitosamente.`)
        fetchCiclos() // Refrescar la lista
        // También deberías llamar a refreshCiclos del CicloContext si este componente lo usa para la lista global
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
      nombre_ciclo: formData.nombre_ciclo,
      descripcion: formData.descripcion || null, // Enviar null si está vacío
      fecha_inicio: formData.fecha_inicio || null
    }

    try {
      if (isEditing && formData.id) {
        await window.electronAPI.updateCiclo(formData.id, payload)
        setSuccessMessage('Ciclo actualizado exitosamente.')
      } else {
        await window.electronAPI.createCiclo(payload)
        setSuccessMessage('Ciclo creado exitosamente.')
      }
      resetForm()
      fetchCiclos()
      // También deberías llamar a refreshCiclos del CicloContext si este componente lo usa
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
    <div className="space-y-4">
      <button
        onClick={handleAddNew}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        disabled={isLoading}
      >
        <FiPlusCircle className="mr-2" /> Añadir Nuevo Ciclo
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-3">
          <h3 className="text-lg font-medium">
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
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <FiSave className="mr-2" />{' '}
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Ciclo' : 'Crear Ciclo'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 flex items-center"
            >
              <FiXCircle className="mr-2" /> Cancelar
            </button>
          </div>
        </form>
      )}

      {error && <p className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}
      {successMessage && (
        <p className="mt-2 text-sm text-green-600 bg-green-100 p-2 rounded-md">{successMessage}</p>
      )}

      <div className="mt-6 overflow-x-auto">
        <h3 className="text-lg font-medium mb-2">Ciclos Existentes</h3>
        {isLoading && <p>Cargando ciclos...</p>}
        {!isLoading && ciclos.length === 0 && (
          <p className="text-gray-500">No hay ciclos creados todavía.</p>
        )}
        {!isLoading && ciclos.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID (DB)
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nombre Ciclo
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ciclos.map((ciclo) => (
                <tr key={ciclo.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{ciclo.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ciclo.nombre_ciclo}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {ciclo.descripcion || '-'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {ciclo.fecha_inicio || '-'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(ciclo)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Editar"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(ciclo.id, ciclo.nombre_ciclo)}
                      className="text-red-600 hover:text-red-900"
                      title="Borrar"
                    >
                      <FiTrash2 />
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
