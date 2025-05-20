// src/renderer/src/components/laboratorio/general/MetadataForm.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { FiRefreshCw, FiSave } from 'react-icons/fi'
import { allPossibleMetadataFields } from '../../../config/metadataFormFields'

// Fuera del componente o memoizado dentro
const formFieldsToRender = Object.entries(allPossibleMetadataFields).map(([name, config]) => ({
  name,
  ...config
}))

function MetadataForm({ keysFromSection }) {
  const [formData, setFormData] = useState({})
  const [initialBackendData, setInitialBackendData] = useState(null)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const fetchOrCreateEntry = useCallback(async () => {
    if (!keysFromSection || !keysFromSection.cicloId || !keysFromSection.etapaId) {
      console.warn('MetadataForm: Faltan claves principales (Ciclo/Etapa) para cargar datos.')
      setFormData({})
      setInitialBackendData(null)
      return
    }

    const keysForAPI = {
      ciclo_id: Number(keysFromSection.cicloId),
      etapa_id: Number(keysFromSection.etapaId),
      muestra_id: keysFromSection.muestraId ? Number(keysFromSection.muestraId) : null,
      origen_id: keysFromSection.origenId ? Number(keysFromSection.origenId) : null
    }

    setIsFetching(true)
    setMessage({ text: 'Cargando/Inicializando metadatos...', type: 'info' })

    try {
      const entryData = await window.electronAPI.getOrCreateDatosGenerales(keysForAPI)

      if (entryData) {
        const populatedFormData = {}
        formFieldsToRender.forEach((field) => {
          populatedFormData[field.name] =
            entryData[field.name] === null || entryData[field.name] === undefined
              ? ''
              : entryData[field.name]
        })
        setFormData(populatedFormData)
        setInitialBackendData(entryData)
        setMessage({
          text: `Metadatos para ${keysFromSection.etapaNombre || 'etapa'} cargados.`,
          type: 'success'
        })
      } else {
        const emptyFormData = {}
        formFieldsToRender.forEach((field) => {
          emptyFormData[field.name] = ''
        })
        setFormData(emptyFormData)
        setInitialBackendData(null)
        setMessage({
          text: 'No se pudo obtener o crear la entrada de metadatos.',
          type: 'warning'
        })
      }
    } catch (error) {
      const emptyFormData = {}
      formFieldsToRender.forEach((field) => {
        emptyFormData[field.name] = ''
      })
      setFormData(emptyFormData)
      setInitialBackendData(null)
      setMessage({ text: `Error al cargar metadatos: ${error.message}`, type: 'error' })
      console.error('MetadataForm: Error en fetchOrCreateEntry:', error)
    } finally {
      setIsFetching(false)
      setTimeout(() => {
        if (message.type !== 'error') setMessage({ text: '', type: '' })
      }, 4000)
    }
  }, [keysFromSection]) // Eliminamos formFieldsToRender de las dependencias

  useEffect(() => {
    if (keysFromSection && keysFromSection.cicloId && keysFromSection.etapaId) {
      fetchOrCreateEntry()
    } else {
      const emptyFormData = {}
      formFieldsToRender.forEach((field) => {
        emptyFormData[field.name] = ''
      })
      setFormData(emptyFormData)
      setInitialBackendData(null)
    }
  }, [fetchOrCreateEntry, keysFromSection])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const fieldDef = formFieldsToRender.find((f) => f.name === name)
    const isNumeric = fieldDef?.type === 'number'
    const val =
      type === 'checkbox'
        ? checked
        : isNumeric && value !== ''
          ? parseFloat(value)
          : value === '' && isNumeric
            ? null
            : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación de claves principales
    if (!keysFromSection?.cicloId || !keysFromSection?.etapaId) {
      setMessage({ text: 'Se requieren cicloId y etapaId', type: 'error' })
      return
    }

    setIsLoading(true)
    setMessage({ text: 'Guardando...', type: 'info' })

    // Preparar payload según esquema DatosGeneralesUpdatePayload
    const payload = {
      ciclo_id: Number(keysFromSection.cicloId),
      etapa_id: Number(keysFromSection.etapaId),
      muestra_id: keysFromSection.muestraId ? Number(keysFromSection.muestraId) : null,
      origen_id: keysFromSection.origenId ? Number(keysFromSection.origenId) : null,
      ...Object.fromEntries(
        Object.entries(formData)
          .filter(([_, value]) => value !== '' && value !== null)
          .map(([key, value]) => [key, value])
      )
    }

    try {
      // Verificación final del payload
      if (payload.muestra_id === null || payload.origen_id === null) {
        console.warn('Advertencia: muestra_id y origen_id no pueden ser null según el esquema')
        // Opción 1: Eliminar los campos si son null
        delete payload.muestra_id
        delete payload.origen_id
        // Opción 2: Asignar valores por defecto (ej: 0)
        // payload.muestra_id = payload.muestra_id ?? 0;
        // payload.origen_id = payload.origen_id ?? 0;
      }

      console.log('Payload final:', payload)
      await window.electronAPI.updateDatosGenerales(payload)
      setMessage({ text: 'Guardado exitoso', type: 'success' })
      fetchOrCreateEntry()
    } catch (error) {
      console.error('Error al guardar:', error)
      setMessage({
        text: `Error: ${error.message || 'Ver consola para detalles'}`,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="p-4 text-center text-gray-500 italic">
        Cargando/Inicializando metadatos para {keysFromSection?.etapaNombre || 'etapa seleccionada'}
        ...
      </div>
    )
  }

  if (!keysFromSection || !keysFromSection.cicloId || !keysFromSection.etapaId) {
    return null
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border border-gray-300 rounded-b-lg bg-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        {formFieldsToRender.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={`metadata-${field.name}`}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label || field.name}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                id={`metadata-${field.name}`}
                rows={field.rows || 3}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoading}
              />
            ) : (
              <input
                type={field.type || 'text'}
                name={field.name}
                id={`metadata-${field.name}`}
                value={formData[field.name] === null ? '' : formData[field.name] || ''}
                onChange={handleChange}
                step={field.step || (field.type === 'number' ? 'any' : undefined)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoading}
              />
            )}
          </div>
        ))}
      </div>

      {initialBackendData && (
        <div className="mt-4 pt-4 border-t">
          <h5 className="text-sm font-medium text-gray-600 mb-1">
            Valores Registrados/Calculados (Backend):
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-xs">
            {initialBackendData.humedad_prom_porc !== null && (
              <p className="text-gray-700">
                Humedad Promedio: <strong>{initialBackendData.humedad_prom_porc}%</strong>
              </p>
            )}
            {initialBackendData.fdr_prom_kgf !== null && (
              <p className="text-gray-700">
                FDR Promedio: <strong>{initialBackendData.fdr_prom_kgf} Kgf</strong>
              </p>
            )}
            {initialBackendData.resultado_cenizas_porc !== null && (
              <p className="text-gray-700">
                Resultado Cenizas: <strong>{initialBackendData.resultado_cenizas_porc}%</strong>
              </p>
            )}
            {initialBackendData.resultado_nitrogeno_total_porc !== null && (
              <p className="text-gray-700">
                Resultado N Total:{' '}
                <strong>{initialBackendData.resultado_nitrogeno_total_porc}%</strong>
              </p>
            )}
            {initialBackendData.resultado_nitrogeno_seca_porc !== null && (
              <p className="text-gray-700">
                Resultado N Base Seca:{' '}
                <strong>{initialBackendData.resultado_nitrogeno_seca_porc}%</strong>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2 items-center">
        <button
          type="submit"
          disabled={isLoading || isFetching}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
        >
          <FiSave className="mr-2" /> {isLoading ? 'Guardando...' : 'Guardar Metadatos'}
        </button>
        <button
          type="button"
          onClick={fetchOrCreateEntry}
          disabled={
            isFetching ||
            isLoading ||
            !keysFromSection ||
            !keysFromSection.cicloId ||
            !keysFromSection.etapaId
          }
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center text-sm disabled:opacity-50"
          title="Recargar datos desde el servidor"
        >
          <FiRefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} /> Recargar
        </button>
      </div>

      {message.text && (
        <p
          className={`mt-2 text-xs p-2 rounded-md ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : message.type === 'info'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : message.type === 'warning'
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  )
}

export default MetadataForm
