// src/renderer/src/components/catalogos/MuestrasManager.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { FiEdit, FiPlusCircle, FiSave, FiTrash2, FiXCircle } from 'react-icons/fi'

const initialMuestraFormState = {
  id: null,
  nombre: '',
  descripcion: ''
}

function MuestrasManager() {
  const [muestras, setMuestras] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [isFormVisible, setIsFormVisible] = useState(false)
  const [formData, setFormData] = useState(initialMuestraFormState)
  const [isEditing, setIsEditing] = useState(false)

  const fetchMuestras = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      console.log('MuestrasManager: Solicitando todas las muestras...')
      const data = await window.electronAPI.getAllMuestras({ skip: 0, limit: 1000 }) // Aumentar límite si es necesario
      console.log('MuestrasManager: Muestras recibidas:', data)
      setMuestras(data || [])
    } catch (err) {
      setError(`Error al cargar muestras: ${err.message}`)
      console.error('Error fetching muestras:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMuestras()
  }, [fetchMuestras])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData(initialMuestraFormState)
    setIsEditing(false)
    setIsFormVisible(false)
    setError('')
    setSuccessMessage('')
  }

  const handleAddNew = () => {
    resetForm()
    setIsFormVisible(true)
  }

  const handleEdit = (muestra) => {
    setFormData({
      id: muestra.id,
      nombre: muestra.nombre || '',
      descripcion: muestra.descripcion || ''
    })
    setIsEditing(true)
    setIsFormVisible(true)
    setError('')
    setSuccessMessage('')
  }

  const handleDelete = async (muestraId, muestraNombre) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres borrar la muestra "${muestraNombre}" (ID: ${muestraId})?`
      )
    ) {
      setIsLoading(true)
      setError('')
      setSuccessMessage('')
      try {
        await window.electronAPI.deleteMuestra(muestraId)
        setSuccessMessage(`Muestra "${muestraNombre}" borrada exitosamente.`)
        fetchMuestras()
      } catch (err) {
        setError(`Error al borrar muestra: ${err.message}`)
        console.error('Error deleting muestra:', err)
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
      setError('El nombre de la muestra es obligatorio.')
      return
    }
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || null
    }

    try {
      if (isEditing && formData.id) {
        await window.electronAPI.updateMuestra(formData.id, payload)
        setSuccessMessage('Muestra actualizada exitosamente.')
      } else {
        await window.electronAPI.createMuestra(payload)
        setSuccessMessage('Muestra creada exitosamente.')
      }
      resetForm()
      fetchMuestras()
    } catch (err) {
      setError(`Error al guardar muestra: ${err.message}`)
      console.error('Error saving muestra:', err)
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
        <FiPlusCircle className="mr-2" /> Añadir Nueva Muestra
      </button>

      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-3 shadow"
        >
          <h3 className="text-lg font-medium mb-2 text-gray-800">
            {isEditing ? 'Editar Muestra' : 'Crear Nueva Muestra'}
          </h3>
          <div>
            <label htmlFor="muestra_nombre" className="block text-sm font-medium text-gray-700">
              Nombre de la Muestra:
            </label>
            <input
              type="text"
              name="nombre"
              id="muestra_nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="muestra_descripcion"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción (Opcional):
            </label>
            <textarea
              name="descripcion"
              id="muestra_descripcion"
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
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Muestra' : 'Crear Muestra'}
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
        <h3 className="text-lg font-medium mb-2 text-gray-700">Muestras Existentes</h3>
        {isLoading && <p className="text-sm text-gray-500 italic">Cargando muestras...</p>}
        {!isLoading && muestras.length === 0 && (
          <p className="text-sm text-gray-500">No hay muestras creadas todavía.</p>
        )}
        {!isLoading && muestras.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200 border shadow-sm rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nombre Muestra
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
              {muestras.map((muestra) => (
                <tr key={muestra.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {muestra.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {muestra.nombre}
                  </td>
                  <td
                    className="px-4 py-3 text-sm text-gray-500 max-w-md truncate"
                    title={muestra.descripcion}
                  >
                    {muestra.descripcion || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(muestra)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Editar"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(muestra.id, muestra.nombre)}
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
export default MuestrasManager
