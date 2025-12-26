import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FiRefreshCw, FiSave, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { allPossibleMetadataFields } from '../../../config/metadataFormFields'
import { API_BASE_URL } from '../../../config/api'

const DATOS_LABORATORIO_ENDPOINT = `${API_BASE_URL}/datos_laboratorio/entry`

function MetadataForm({ keysFromSection }) {
  const [formData, setFormData] = useState({})
  const [initialBackendData, setInitialBackendData] = useState(null)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const formFieldsToRender = useMemo(
    () => Object.entries(allPossibleMetadataFields).map(([name, config]) => ({ name, ...config })),
    []
  )

  const initializeFormData = useCallback((backendData = null) => {
    const newFormData = {}
    formFieldsToRender.forEach((field) => {
      newFormData[field.name] = backendData?.[field.name] ?? ''
    })
    setFormData(newFormData)
    setInitialBackendData(backendData)
  }, [formFieldsToRender])

  const fetchOrCreateEntry = useCallback(async () => {
    if (!keysFromSection?.cicloId || !keysFromSection?.etapaId) {
      initializeFormData(null)
      return
    }

    const keysForAPI = {
      ciclo_id: keysFromSection.cicloId,
      etapa_id: keysFromSection.etapaId,
      muestra_id: keysFromSection.muestraId || null,
      origen_id: keysFromSection.origenId || null,
      secuencia_id: keysFromSection.secuenciaId || null
    }

    setIsFetching(true)
    setMessage({ text: 'Sincronizando...', type: 'info' })

    try {
      const response = await fetch(DATOS_LABORATORIO_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keysForAPI)
      })

      if (!response.ok) throw new Error(`Error HTTP ${response.status}`)
      const entryData = await response.json()

      if (entryData) {
        initializeFormData(entryData)
        setMessage({ text: '', type: '' }) 
      } else {
        initializeFormData(null)
      }
    } catch (error) {
      initializeFormData(null)
      setMessage({ text: 'Error de conexión', type: 'error' })
    } finally {
      setIsFetching(false)
    }
  }, [keysFromSection, initializeFormData])

  useEffect(() => {
    if (keysFromSection?.cicloId && keysFromSection?.etapaId && keysFromSection?.secuenciaId) {
      fetchOrCreateEntry()
    } else {
      initializeFormData(null)
    }
  }, [fetchOrCreateEntry, keysFromSection])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const isNumeric = formFieldsToRender.find((f) => f.name === name)?.type === 'number'
    
    let processedValue = value
    if (type === 'checkbox') processedValue = checked
    else if (isNumeric) processedValue = value === '' ? null : parseFloat(value)

    setFormData((prev) => ({ ...prev, [name]: processedValue }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    
    const dataToUpdate = {}
    let hasChanges = false

    formFieldsToRender.forEach((field) => {
        // Lógica simple de comparación
        if (formData[field.name] !== initialBackendData?.[field.name]) {
            dataToUpdate[field.name] = formData[field.name]
            hasChanges = true
        }
    })

    if (!hasChanges) {
      setIsSaving(false)
      setMessage({ text: 'No hay cambios nuevos', type: 'info' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
      return
    }

    const payload = {
      ciclo_id: keysFromSection.cicloId,
      etapa_id: keysFromSection.etapaId,
      muestra_id: keysFromSection.muestraId || null,
      origen_id: keysFromSection.origenId || null,
      secuencia_id: keysFromSection.secuenciaId || null,
      ...dataToUpdate
    }

    try {
      const response = await fetch(DATOS_LABORATORIO_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('Error al guardar')
      
      setMessage({ text: 'Guardado correctamente', type: 'success' })
      // Recargar datos para actualizar la "foto inicial"
      fetchOrCreateEntry()
    } catch (error) {
      setMessage({ text: 'Error al guardar', type: 'error' })
    } finally {
      setIsSaving(false)
      setTimeout(() => {
         if(message.type === 'success') setMessage({ text: '', type: '' })
      }, 3000)
    }
  }

  if (isFetching && !initialBackendData) return <div className="p-4 text-xs text-brand-500 animate-pulse text-center">Cargando datos...</div>
  if (!keysFromSection?.etapaId) return <div className="p-4 text-xs text-gray-400 italic text-center">Seleccione un contexto completo.</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center pb-2 mb-2 border-b border-brand-200/50">
        <span className="text-xs font-bold text-brand-700 bg-brand-100 px-2 py-1 rounded">
          {keysFromSection.etapaNombre || 'Etapa'}
        </span>
        <button type="button" onClick={fetchOrCreateEntry} disabled={isFetching} className="text-gray-400 hover:text-brand-500 transition-colors p-1" title="Recargar">
          <FiRefreshCw className={isFetching ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="space-y-3">
        {formFieldsToRender.map((field) => (
          <div key={field.name}>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">{field.label || field.name}</label>
            {field.type === 'textarea' ? (
                <textarea 
                    name={field.name}
                    rows="2"
                    value={formData[field.name] ?? ''}
                    onChange={handleChange}
                    className="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder-gray-300 resize-none"
                    disabled={isSaving}
                />
            ) : (
                <input
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name] ?? ''}
                onChange={handleChange}
                step={field.type === 'number' ? 'any' : undefined}
                className="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder-gray-300"
                placeholder="..."
                disabled={isSaving}
                />
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full mt-4 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSaving ? <FiRefreshCw className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
      </button>

      {/* Feedback Mensajes */}
      {message.text && (
        <div className={`flex items-center text-xs p-2 rounded-md transition-all duration-300 ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 
            message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
        }`}>
            {message.type === 'success' ? <FiCheckCircle className="mr-2 flex-shrink-0" /> : <FiAlertCircle className="mr-2 flex-shrink-0" />}
            {message.text}
        </div>
      )}
    </form>
  )
}
export default MetadataForm