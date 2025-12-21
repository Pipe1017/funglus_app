// src/renderer/src/components/procesamiento/CiclosProcesamientoManager.jsx
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
const CICLOS_PROCESAMIENTO_ENDPOINT = `${FASTAPI_BASE_URL}/ciclos-procesamiento`

const initialFormState = {
  id: null,
  identificador_lote: '',
  fecha_hora_lote: '',
  descripcion: ''
}

// Este es nuestro nuevo componente genérico
function CiclosProcesamientoManager({ tipoAnalisis, titulo, colorBoton = 'blue' }) {
  const [ciclosProcesamiento, setCiclosProcesamiento] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [isFormVisible, setIsFormVisible] = useState(false)
  const [formData, setFormData] = useState(initialFormState)
  const [isEditing, setIsEditing] = useState(false)

  const displayMessage = (setter, message, duration = 3000) => {
    setter(message)
    setTimeout(() => setter(''), duration)
  }

  const fetchCiclosProcesamiento = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`${CICLOS_PROCESAMIENTO_ENDPOINT}/${tipoAnalisis}/?limit=1000`)
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      const data = await response.json()
      setCiclosProcesamiento(data || [])
    } catch (err) {
      console.error(`Error fetching ciclos de procesamiento de ${tipoAnalisis}:`, err)
      setError(`Error al cargar ciclos de ${titulo}: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [tipoAnalisis, titulo])

  useEffect(() => {
    fetchCiclosProcesamiento()
  }, [fetchCiclosProcesamiento])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData(initialFormState)
    setIsEditing(false)
    setIsFormVisible(false)
    setError('')
  }

  const handleAddNew = () => {
    resetForm()
    setIsFormVisible(true)
  }

  const handleEdit = (cicloProc) => {
    setFormData({
      id: cicloProc.id,
      identificador_lote: cicloProc.identificador_lote || '',
      fecha_hora_lote: cicloProc.fecha_hora_lote
        ? new Date(cicloProc.fecha_hora_lote).toISOString().slice(0, 16)
        : '',
      descripcion: cicloProc.descripcion || ''
    })
    setIsEditing(true)
    setIsFormVisible(true)
    setError('')
  }

  const handleDelete = async (cicloProcId, identificadorLote) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres borrar el ciclo "${identificadorLote}" (ID: ${cicloProcId})? Esto borrará todos sus registros de análisis asociados.`
      )
    ) {
      return
    }
    setIsSubmitting(true)
    setError('')
    try {
      const response = await fetch(`${CICLOS_PROCESAMIENTO_ENDPOINT}/${cicloProcId}/`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      displayMessage(setSuccessMessage, `Ciclo "${identificadorLote}" borrado exitosamente.`)
      fetchCiclosProcesamiento()
    } catch (err) {
      console.error(`Error deleting ciclo de ${tipoAnalisis}:`, err)
      displayMessage(setError, `Error al borrar ciclo: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.identificador_lote.trim() || !formData.fecha_hora_lote) {
      setError('El Identificador del Lote y la Fecha y Hora son obligatorios.')
      return
    }
    setIsSubmitting(true)
    setError('')

    // Payload para crear
    const createPayload = {
      identificador_lote: formData.identificador_lote.trim(),
      fecha_hora_lote: new Date(formData.fecha_hora_lote).toISOString(),
      tipo_analisis: tipoAnalisis,
      descripcion: formData.descripcion.trim() || null
    }
    
    // Payload para actualizar (sin tipo_analisis)
    const updatePayload = {
      identificador_lote: createPayload.identificador_lote,
      fecha_hora_lote: createPayload.fecha_hora_lote,
      descripcion: createPayload.descripcion
    }

    try {
      let response
      let url = CICLOS_PROCESAMIENTO_ENDPOINT
      if (isEditing && formData.id) {
        url += `/${formData.id}/`
        response = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload)
        })
      } else {
        url += `/`
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createPayload)
        })
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }

      displayMessage(setSuccessMessage, `Ciclo ${isEditing ? 'actualizado' : 'creado'} exitosamente.`)
      resetForm()
      fetchCiclosProcesamiento()
    } catch (err) {
      console.error(`Error saving ciclo de ${tipoAnalisis}:`, err)
      displayMessage(setError, `Error al guardar ciclo: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateTimeForDisplay = (isoString) => {
    if (!isoString) return '-'
    return new Date(isoString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  // Clases dinámicas para los colores de los botones
  const buttonColorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    orange: 'bg-orange-600 hover:bg-orange-700'
  }
  const buttonHoverColorClasses = {
    blue: 'hover:text-blue-600 hover:bg-blue-100',
    orange: 'hover:text-orange-600 hover:bg-orange-100'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700">{`Gestión de Ciclos de ${titulo}`}</h2>
        <button
          onClick={handleAddNew}
          className={`px-4 py-2 text-white rounded-md flex items-center text-sm shadow-sm disabled:opacity-60 ${buttonColorClasses[colorBoton]}`}
          disabled={isFormVisible || isLoading || isSubmitting}
        >
          <FiPlusCircle className="mr-2" /> {`Añadir Nuevo Ciclo de ${titulo}`}
        </button>
      </div>

      {isFormVisible && (
        <div className="p-6 bg-white rounded-lg shadow-xl border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-medium text-gray-800 border-b pb-2 mb-4">
              {isEditing ? `Editar Ciclo de ${titulo}` : `Crear Nuevo Ciclo de ${titulo}`}
            </h3>
            {/* ... Formulario ... */}
            <div>
              <label htmlFor="identificador_lote" className="block text-sm font-medium text-gray-700">
                Identificador del Lote/Ciclo:
              </label>
              <input
                type="text"
                name="identificador_lote"
                id="identificador_lote"
                value={formData.identificador_lote}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="fecha_hora_lote" className="block text-sm font-medium text-gray-700">
                Fecha y Hora del Lote/Ciclo:
              </label>
              <input
                type="datetime-local"
                name="fecha_hora_lote"
                id="fecha_hora_lote"
                value={formData.fecha_hora_lote}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                Descripción (Opcional):
              </label>
              <textarea
                name="descripcion"
                id="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center gap-x-3 pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center text-sm shadow-sm disabled:opacity-60"
              >
                {isSubmitting ? <FiLoader className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
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

      {/* ... Mensajes de error y éxito ... */}
      {error && <p className="mt-3 text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>}
      {successMessage && <p className="mt-3 text-sm text-green-600 bg-green-100 p-3 rounded-md border border-green-300">{successMessage}</p>}

      <div className="mt-6 bg-white p-2 rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-3 px-4 pt-3">
          <h3 className="text-xl font-medium text-gray-800">{`Ciclos de ${titulo} Existentes`}</h3>
          <button
            onClick={fetchCiclosProcesamiento}
            disabled={isLoading || isSubmitting}
            className={`p-2 text-gray-500 rounded-full ${buttonHoverColorClasses[colorBoton]}`}
            title="Refrescar lista"
          >
            <FiRefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {/* ... Tabla de resultados ... */}
        {isLoading && <p className="p-4 text-sm text-gray-500 italic text-center">Cargando ciclos...</p>}
        {!isLoading && !error && ciclosProcesamiento.length === 0 && <p className="p-4 text-sm text-gray-500 text-center">No hay ciclos creados todavía.</p>}
        {!isLoading && !error && ciclosProcesamiento.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">ID Lote</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Fecha y Hora</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Descripción</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ciclosProcesamiento.map((cicloProc) => (
                  <tr key={cicloProc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{cicloProc.identificador_lote}</td>
                    <td className="px-4 py-3 text-gray-700">{formatDateTimeForDisplay(cicloProc.fecha_hora_lote)}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-sm truncate" title={cicloProc.descripcion}>{cicloProc.descripcion || '-'}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => handleEdit(cicloProc)}
                        disabled={isSubmitting}
                        className={`text-gray-600 p-1.5 rounded-md ${buttonHoverColorClasses[colorBoton]}`}
                        title="Editar"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cicloProc.id, cicloProc.identificador_lote)}
                        disabled={isSubmitting}
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

export default CiclosProcesamientoManager
