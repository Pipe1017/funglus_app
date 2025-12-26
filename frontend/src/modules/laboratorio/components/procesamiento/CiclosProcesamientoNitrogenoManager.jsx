import React, { useCallback, useEffect, useState } from 'react'
import {
  FiEdit,
  FiLoader,
  FiPlusCircle,
  FiRefreshCw,
  FiSave,
  FiTrash2,
  FiXCircle,
  FiCalendar,
  FiClock
} from 'react-icons/fi'
import { API_BASE_URL } from '../../../core/config/api'

const FASTAPI_BASE_URL = API_BASE_URL
const CICLOS_PROCESAMIENTO_ENDPOINT = `${FASTAPI_BASE_URL}/ciclos-procesamiento`
const TIPO_ANALISIS_NITROGENO = 'nitrogeno'

const initialFormState = {
  id: null,
  identificador_lote: '',
  fecha: '', // Separamos fecha
  hora: '',  // Separamos hora
  descripcion: ''
}

function CiclosProcesamientoNitrogenoManager() {
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
      const response = await fetch(
        `${CICLOS_PROCESAMIENTO_ENDPOINT}/${TIPO_ANALISIS_NITROGENO}/?limit=1000`
      )
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      const data = await response.json()
      setCiclosProcesamiento(data || [])
    } catch (err) {
      console.error('Error fetching ciclos de procesamiento de nitrógeno:', err)
      setError(`Error al cargar ciclos de procesamiento: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

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
    // Establecer fecha y hora actuales por defecto al crear
    const now = new Date()
    // Formato YYYY-MM-DD
    const fechaHoy = now.toLocaleDateString('en-CA') 
    // Formato HH:mm
    const horaActual = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    
    setFormData(prev => ({
        ...prev,
        fecha: fechaHoy,
        hora: horaActual
    }))
    setIsFormVisible(true)
  }

  const handleEdit = (cicloProc) => {
    let fechaLocal = ''
    let horaLocal = ''

    if (cicloProc.fecha_hora_lote) {
        const dateObj = new Date(cicloProc.fecha_hora_lote)
        // Extraemos fecha y hora locales correctamente
        fechaLocal = dateObj.toLocaleDateString('en-CA') // YYYY-MM-DD
        horaLocal = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    }

    setFormData({
      id: cicloProc.id,
      identificador_lote: cicloProc.identificador_lote || '',
      fecha: fechaLocal,
      hora: horaLocal,
      descripcion: cicloProc.descripcion || ''
    })
    setIsEditing(true)
    setIsFormVisible(true)
    setError('')
  }

  const handleDelete = async (cicloProcId, identificadorLote) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres borrar el ciclo de procesamiento "${identificadorLote}" (ID: ${cicloProcId})? Esto borrará todos sus registros de análisis asociados.`
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
      displayMessage(
        setSuccessMessage,
        `Ciclo de procesamiento "${identificadorLote}" borrado exitosamente.`
      )
      fetchCiclosProcesamiento()
    } catch (err) {
      console.error('Error deleting ciclo de procesamiento:', err)
      displayMessage(setError, `Error al borrar ciclo de procesamiento: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.identificador_lote.trim() || !formData.fecha || !formData.hora) {
      setError('El Identificador, la Fecha y la Hora son obligatorios.')
      return
    }
    setIsSubmitting(true)
    setError('')

    // Combinar fecha y hora locales para crear el ISO string
    const fechaHoraCombined = new Date(`${formData.fecha}T${formData.hora}`)
    
    const payload = {
      identificador_lote: formData.identificador_lote.trim(),
      fecha_hora_lote: fechaHoraCombined.toISOString(), 
      tipo_analisis: TIPO_ANALISIS_NITROGENO,
      descripcion: formData.descripcion.trim() || null
    }

    try {
      let response
      let url = CICLOS_PROCESAMIENTO_ENDPOINT
      if (isEditing && formData.id) {
        url += `/${formData.id}/`
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
        `Ciclo de procesamiento ${isEditing ? 'actualizado' : 'creado'} exitosamente.`
      )
      resetForm()
      fetchCiclosProcesamiento() 
    } catch (err) {
      console.error('Error saving ciclo de procesamiento:', err)
      displayMessage(setError, `Error al guardar ciclo de procesamiento: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateTimeForDisplay = (isoString) => {
    if (!isoString) return '-'
    try {
      return new Date(isoString).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch (e) {
      return isoString 
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          Gestión de Ciclos de Procesamiento de Nitrógeno
        </h2>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm shadow-sm disabled:opacity-60"
          disabled={isFormVisible || isLoading || isSubmitting}
        >
          <FiPlusCircle className="mr-2" /> Añadir Nuevo Ciclo de Nitrógeno
        </button>
      </div>

      {isFormVisible && (
        <div className="p-6 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 ease-in-out">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-medium text-gray-800 border-b pb-2 mb-4">
              {isEditing ? 'Editar Ciclo de Procesamiento' : 'Crear Nuevo Ciclo de Procesamiento'}
            </h3>
            
            {/* Campo Identificador */}
            <div>
              <label
                htmlFor="identificador_lote"
                className="block text-sm font-medium text-gray-700"
              >
                Identificador del Lote/Ciclo (Nombre o Código):
              </label>
              <input
                type="text"
                name="identificador_lote"
                id="identificador_lote"
                value={formData.identificador_lote}
                onChange={handleInputChange}
                required
                placeholder="Ej: LOTE-2023-A"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Campos Fecha y Hora SEPARADOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FiCalendar /> Fecha del Lote:
                    </label>
                    <input
                        type="date"
                        name="fecha"
                        id="fecha"
                        value={formData.fecha}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="hora" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FiClock /> Hora de Inicio:
                    </label>
                    <input
                        type="time"
                        name="hora"
                        id="hora"
                        value={formData.hora}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
          <h3 className="text-xl font-medium text-gray-800">Ciclos de Nitrógeno Existentes</h3>
          <button
            onClick={fetchCiclosProcesamiento}
            disabled={isLoading || isSubmitting}
            className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            title="Refrescar lista"
          >
            <FiRefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {isLoading && (
          <p className="p-4 text-sm text-gray-500 italic text-center">
            Cargando ciclos de procesamiento...
          </p>
        )}
        {!isLoading && !error && ciclosProcesamiento.length === 0 && (
          <p className="p-4 text-sm text-gray-500 text-center">
            No hay ciclos de procesamiento de nitrógeno creados todavía.
          </p>
        )}
        {!isLoading && !error && ciclosProcesamiento.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    ID Lote
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ciclosProcesamiento.map((cicloProc) => (
                  <tr key={cicloProc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                      {cicloProc.identificador_lote}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {formatDateTimeForDisplay(cicloProc.fecha_hora_lote)}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-500 max-w-sm truncate"
                      title={cicloProc.descripcion}
                    >
                      {cicloProc.descripcion || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(cicloProc)}
                        disabled={isSubmitting}
                        className="text-blue-600 hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-100"
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

export default CiclosProcesamientoNitrogenoManager