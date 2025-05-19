// src/renderer/src/components/catalogos/EtapasManager.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { FiEdit, FiPlusCircle, FiSave, FiTrash2, FiXCircle } from 'react-icons/fi'

const initialEtapaFormState = {
  id: null, // Para saber si estamos editando
  nombre: '', // 'nombre' en lugar de 'nombre_ciclo'
  descripcion: ''
  // La tabla 'Etapa' no tiene 'fecha_inicio' como 'Ciclo'
  // Si tuviera otros campos (como fase_id), se añadirían aquí.
}

function EtapasManager() {
  const [etapas, setEtapas] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [isFormVisible, setIsFormVisible] = useState(false)
  const [formData, setFormData] = useState(initialEtapaFormState)
  const [isEditing, setIsEditing] = useState(false)

  const fetchEtapas = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      console.log('EtapasManager: Solicitando todas las etapas...')
      const data = await window.electronAPI.getAllEtapas() // API para Etapas
      console.log('EtapasManager: Etapas recibidas:', data)
      setEtapas(data || [])
    } catch (err) {
      setError(`Error al cargar etapas: ${err.message}`)
      console.error('Error fetching etapas:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEtapas()
  }, [fetchEtapas])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData(initialEtapaFormState)
    setIsEditing(false)
    setIsFormVisible(false)
    setError('')
    setSuccessMessage('')
  }

  const handleAddNew = () => {
    resetForm()
    setIsFormVisible(true)
  }

  const handleEdit = (etapa) => {
    setFormData({
      id: etapa.id,
      nombre: etapa.nombre || '',
      descripcion: etapa.descripcion || ''
    })
    setIsEditing(true)
    setIsFormVisible(true)
    setError('')
    setSuccessMessage('')
  }

  const handleDelete = async (etapaId, etapaNombre) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres borrar la etapa "${etapaNombre}" (ID: ${etapaId})?`
      )
    ) {
      setIsLoading(true)
      setError('')
      setSuccessMessage('')
      try {
        await window.electronAPI.deleteEtapa(etapaId) // API para Etapas
        setSuccessMessage(`Etapa "${etapaNombre}" borrada exitosamente.`)
        fetchEtapas()
      } catch (err) {
        setError(`Error al borrar etapa: ${err.message}`)
        console.error('Error deleting etapa:', err)
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
      setError('El nombre de la etapa es obligatorio.')
      return
    }
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    const payload = {
      // Schema CatalogoSimpleCreate o CatalogoSimpleUpdate
      nombre: formData.nombre,
      descripcion: formData.descripcion || null
    }

    try {
      if (isEditing && formData.id) {
        await window.electronAPI.updateEtapa(formData.id, payload) // API para Etapas
        setSuccessMessage('Etapa actualizada exitosamente.')
      } else {
        await window.electronAPI.createEtapa(payload) // API para Etapas
        setSuccessMessage('Etapa creada exitosamente.')
      }
      resetForm()
      fetchEtapas()
    } catch (err) {
      setError(`Error al guardar etapa: ${err.message}`)
      console.error('Error saving etapa:', err)
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
        disabled={isLoading}
      >
        <FiPlusCircle className="mr-2" /> Añadir Nueva Etapa
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-3">
          <h3 className="text-lg font-medium mb-2">
            {isEditing ? 'Editar Etapa' : 'Crear Nueva Etapa'}
          </h3>
          <div>
            <label htmlFor="etapa_nombre" className="block text-sm font-medium text-gray-700">
              Nombre de la Etapa:
            </label>
            <input
              type="text"
              name="nombre"
              id="etapa_nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="etapa_descripcion" className="block text-sm font-medium text-gray-700">
              Descripción (Opcional):
            </label>
            <input
              type="text"
              name="descripcion"
              id="etapa_descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {/* Si Etapa tuviera más campos (ej. fase_id como un select), se añadirían aquí */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
            >
              <FiSave className="mr-2" />{' '}
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Etapa' : 'Crear Etapa'}
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
        <h3 className="text-lg font-medium mb-2 text-gray-700">Etapas Existentes</h3>
        {isLoading && <p className="text-sm text-gray-500 italic">Cargando etapas...</p>}
        {!isLoading && etapas.length === 0 && (
          <p className="text-sm text-gray-500">No hay etapas creadas todavía.</p>
        )}
        {!isLoading && etapas.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200 border shadow-sm rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nombre Etapa
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                {/* Si Etapa tuviera más campos (ej. Fase), se añadirían aquí */}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {etapas.map((etapa) => (
                <tr key={etapa.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{etapa.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {etapa.nombre}
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate"
                    title={etapa.descripcion}
                  >
                    {etapa.descripcion || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(etapa)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Editar"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(etapa.id, etapa.nombre)}
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
export default EtapasManager
