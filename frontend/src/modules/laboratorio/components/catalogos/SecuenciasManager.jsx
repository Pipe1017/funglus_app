import React, { useCallback, useEffect, useState } from 'react'
import { FiEdit, FiPlusCircle, FiSave, FiTrash2, FiXCircle } from 'react-icons/fi'
import { API_BASE_URL } from '../../../core/config/api'


// Componente genérico para gestionar catálogos simples (Etapa, Muestra, Origen, Secuencia)
function SimpleCatalogManager({ catalogName, apiEndpoint, singularName }) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [isFormVisible, setIsFormVisible] = useState(false)
  const [formData, setFormData] = useState({ id: null, nombre: '', descripcion: '' })
  const [isEditing, setIsEditing] = useState(false)

  const fetchItems = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`${apiEndpoint}?limit=1000`)
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      const data = await response.json()
      setItems(data || [])
    } catch (err) {
      setError(`Error al cargar ${catalogName}: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [apiEndpoint, catalogName])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])
  
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const resetForm = () => {
    setFormData({ id: null, nombre: '', descripcion: '' })
    setIsEditing(false)
    setIsFormVisible(false)
    setError('')
    setSuccessMessage('')
  }

  const handleAddNew = () => {
    resetForm()
    setIsFormVisible(true)
  }

  const handleEdit = (item) => {
    setFormData({ id: item.id, nombre: item.nombre || '', descripcion: item.descripcion || '' })
    setIsEditing(true)
    setIsFormVisible(true)
  }

  const handleDelete = async (itemId, itemName) => {
    if (!window.confirm(`¿Seguro que quieres borrar "${itemName}" (ID: ${itemId})?`)) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`${apiEndpoint}/${itemId}`, { method: 'DELETE' })
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      setSuccessMessage(`"${itemName}" borrado exitosamente.`)
      fetchItems()
    } catch (err) {
      setError(`Error al borrar: ${err.message}`)
    } finally {
      setIsLoading(false)
      setTimeout(() => { setError(''); setSuccessMessage(''); }, 3000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nombre.trim()) {
      setError(`El nombre es obligatorio.`)
      return
    }
    setIsLoading(true)

    const payload = { nombre: formData.nombre.trim(), descripcion: formData.descripcion.trim() || null }
    const url = isEditing ? `${apiEndpoint}/${formData.id}` : `${apiEndpoint}/`
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      setSuccessMessage(`${singularName} ${isEditing ? 'actualizada' : 'creada'} exitosamente.`)
      resetForm()
      fetchItems()
    } catch (err) {
      setError(`Error al guardar: ${err.message}`)
    } finally {
      setIsLoading(false)
      setTimeout(() => { setError(''); setSuccessMessage(''); }, 3000)
    }
  }

  return (
    <div className="space-y-4">
      <button onClick={handleAddNew} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center text-sm" disabled={isLoading || isFormVisible}>
        <FiPlusCircle className="mr-2" /> Añadir Nueva {singularName}
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-3 shadow">
          <h3 className="text-lg font-medium text-gray-800">{isEditing ? `Editar ${singularName}` : `Crear Nueva ${singularName}`}</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required className="mt-1 block w-full input-std" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción (Opcional):</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} rows="3" className="mt-1 block w-full input-std" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm">
              <FiSave className="mr-2" /> {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" onClick={resetForm} disabled={isLoading} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 flex items-center text-sm">
              <FiXCircle className="mr-2" /> Cancelar
            </button>
          </div>
        </form>
      )}

      {error && <p className="mt-2 text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>}
      {successMessage && <p className="mt-2 text-sm text-green-600 bg-green-100 p-3 rounded-md border border-green-300">{successMessage}</p>}

      <div className="mt-6 overflow-x-auto">
        <h3 className="text-lg font-medium mb-2 text-gray-700">{catalogName} Existentes</h3>
        {isLoading && <p className="text-sm italic">Cargando...</p>}
        {!isLoading && items.length === 0 && <p className="text-sm text-gray-500">No hay items creados.</p>}
        {!isLoading && items.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200 border shadow-sm rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{item.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">{item.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-md truncate" title={item.descripcion}>{item.descripcion || '-'}</td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 p-1" title="Editar"><FiEdit size={16} /></button>
                    <button onClick={() => handleDelete(item.id, item.nombre)} className="text-red-600 hover:text-red-900 p-1" title="Borrar"><FiTrash2 size={16} /></button>
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

function SecuenciasManager() {
  return (
    <SimpleCatalogManager 
      catalogName="Secuencias"
      apiEndpoint={`${API_BASE_URL}/catalogos/secuencias/`}
      singularName="Secuencia"
    />
  )
}

export default SecuenciasManager;