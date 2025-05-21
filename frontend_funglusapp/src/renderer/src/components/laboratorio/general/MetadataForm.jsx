// src/renderer/src/components/laboratorio/general/MetadataForm.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FiRefreshCw, FiSave } from 'react-icons/fi'
import { allPossibleMetadataFields } from '../../../config/metadataFormFields'

// Constantes para la API
const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'
const DATOS_LABORATORIO_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/entry` // <-- CORRECCIÓN AQUÍ

/**
 * @component MetadataForm
 * @description Formulario para editar y mostrar los metadatos generales de laboratorio
 * para una combinación específica de ciclo, etapa, muestra y origen.
 * Interactúa con el backend para obtener o crear una entrada y para actualizarla.
 * @param {object} props
 * @param {object} props.keysFromSection - Objeto con las claves identificadoras.
 * Ej: { cicloId, etapaId, muestraId, origenId, cicloNombre, etapaNombre, muestraNombre, origenNombre }
 */
function MetadataForm({ keysFromSection }) {
  const [formData, setFormData] = useState({})
  const [initialBackendData, setInitialBackendData] = useState(null) // Datos originales del backend para comparación
  const [message, setMessage] = useState({ text: '', type: '' }) // Mensajes para el usuario (éxito, error, info)
  const [isSaving, setIsSaving] = useState(false) // Estado para cuando se está guardando (PUT)
  const [isFetching, setIsFetching] = useState(false) // Estado para cuando se está cargando datos (POST/GET)

  // Genera la lista de campos a renderizar en el formulario una sola vez.
  const formFieldsToRender = useMemo(
    () =>
      Object.entries(allPossibleMetadataFields).map(([name, config]) => ({
        name,
        ...config
      })),
    []
  )

  /**
   * @function initializeFormData
   * @description Inicializa el estado del formulario (formData) basado en los campos definidos
   * y opcionalmente los puebla con datos del backend.
   * @param {object|null} backendData - Datos opcionales del backend para poblar el formulario.
   */
  const initializeFormData = useCallback(
    (backendData = null) => {
      const newFormData = {}
      formFieldsToRender.forEach((field) => {
        newFormData[field.name] =
          backendData &&
          backendData[field.name] !== null &&
          typeof backendData[field.name] !== 'undefined'
            ? backendData[field.name]
            : '' // Campos vacíos si no hay dato o si es null/undefined
      })
      setFormData(newFormData)
      setInitialBackendData(backendData) // Guarda los datos originales para comparar al guardar
    },
    [formFieldsToRender]
  )

  /**
   * @function fetchOrCreateEntry
   * @description Obtiene una entrada de metadatos existente del backend o crea una nueva
   * si no existe, basada en las claves proporcionadas.
   */
  const fetchOrCreateEntry = useCallback(async () => {
    if (!keysFromSection?.cicloId || !keysFromSection?.etapaId) {
      initializeFormData(null) // Resetea el formulario si faltan claves esenciales
      return
    }

    const keysForAPI = {
      ciclo_id: keysFromSection.cicloId, // Asegúrate que los nombres coincidan con el schema Pydantic 'DatosGeneralesCreate'
      etapa_id: keysFromSection.etapaId,
      muestra_id: keysFromSection.muestraId || null,
      origen_id: keysFromSection.origenId || null
    }

    setIsFetching(true)
    setMessage({ text: 'Cargando/Inicializando metadatos...', type: 'info' })
    console.log('MetadataForm: Solicitando getOrCreateDatosGenerales con claves (IDs):', keysForAPI)

    try {
      const response = await fetch(DATOS_LABORATORIO_ENDPOINT, {
        // Usa la URL corregida
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keysForAPI)
      })

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: `Error HTTP ${response.status}: ${response.statusText}` }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }

      const entryData = await response.json()
      console.log('MetadataForm: Datos recibidos de getOrCreateDatosGenerales:', entryData)

      if (entryData) {
        initializeFormData(entryData)
        setMessage({
          text: `Metadatos para ${keysFromSection.etapaNombre || 'etapa'} cargados.`,
          type: 'success'
        })
      } else {
        initializeFormData(null)
        setMessage({
          text: 'No se pudo obtener o crear la entrada (respuesta vacía).',
          type: 'warning'
        })
      }
    } catch (error) {
      initializeFormData(null)
      setMessage({ text: `Error al cargar metadatos: ${error.message}`, type: 'error' })
      console.error('MetadataForm: Error en fetchOrCreateEntry:', error)
    } finally {
      setIsFetching(false)
      setTimeout(() => {
        if (message.type !== 'error' && message.type !== 'warning')
          setMessage({ text: '', type: '' })
      }, 4000)
    }
  }, [keysFromSection, initializeFormData]) // initializeFormData está ahora en dependencias

  // Efecto para cargar datos cuando las claves de sección cambian.
  useEffect(() => {
    if (keysFromSection?.cicloId && keysFromSection?.etapaId) {
      fetchOrCreateEntry()
    } else {
      initializeFormData(null) // Limpia el formulario si no hay claves válidas
    }
  }, [fetchOrCreateEntry, keysFromSection]) // fetchOrCreateEntry es la dependencia principal aquí

  /**
   * @function handleChange
   * @description Maneja los cambios en los campos del formulario.
   * Convierte valores numéricos y maneja checkboxes.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const fieldDef = formFieldsToRender.find((f) => f.name === name)
    const isNumeric = fieldDef?.type === 'number'

    let processedValue
    if (type === 'checkbox') {
      processedValue = checked
    } else if (isNumeric) {
      processedValue = value === '' ? null : parseFloat(value) // null si está vacío, sino parsea
    } else {
      processedValue = value
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }))
  }

  /**
   * @function handleSubmit
   * @description Envía los datos del formulario al backend para actualizar la entrada.
   * Solo envía los campos que han cambiado.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!keysFromSection?.cicloId || !keysFromSection?.etapaId) {
      setMessage({ text: 'Faltan claves principales (Ciclo/Etapa) para guardar.', type: 'error' })
      return
    }

    setIsSaving(true)
    setMessage({ text: 'Guardando metadatos...', type: 'info' })

    const dataToUpdate = {}
    let hasChanges = false

    formFieldsToRender.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(formData, field.name)) {
        const currentValue = formData[field.name]
        const initialValue = initialBackendData ? initialBackendData[field.name] : undefined

        // Compara si el valor ha cambiado. Para números, null vs '' puede ser un tema.
        // Si el valor inicial era null o undefined, y el actual es '' (típico de input vacío), no lo consideramos cambio para backend.
        // Si el valor actual es null (por input numérico vacío) y el inicial era '', también es un no-cambio efectivo.
        let currentComparisonVal = currentValue
        let initialComparisonVal = initialValue

        if (field.type === 'number') {
          currentComparisonVal = currentValue === '' ? null : currentValue
          initialComparisonVal =
            initialValue === '' || typeof initialValue === 'undefined' ? null : initialValue
        }

        if (String(currentComparisonVal) !== String(initialComparisonVal)) {
          // Considera el caso de que initialBackendData sea null (creación)
          if (
            initialBackendData === null ||
            typeof initialValue === 'undefined' ||
            currentComparisonVal !== initialComparisonVal
          ) {
            dataToUpdate[field.name] = currentValue
            hasChanges = true
          }
        }
      }
    })

    if (!hasChanges && initialBackendData !== null) {
      setMessage({ text: 'No hay cambios para guardar.', type: 'info' })
      setIsSaving(false)
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      return
    }

    const payloadForUpdate = {
      ciclo_id: keysFromSection.cicloId, // Asegúrate que estos nombres coincidan con el schema Pydantic 'DatosGeneralesUpdatePayload'
      etapa_id: keysFromSection.etapaId,
      muestra_id: keysFromSection.muestraId || null,
      origen_id: keysFromSection.origenId || null,
      ...dataToUpdate
    }

    console.log('MetadataForm: Actualizando datos generales con payload:', payloadForUpdate)
    try {
      const response = await fetch(DATOS_LABORATORIO_ENDPOINT, {
        // Usa la URL corregida
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadForUpdate)
      })

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: `Error HTTP ${response.status}: ${response.statusText}` }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      setMessage({ text: 'Metadatos guardados exitosamente.', type: 'success' })
      fetchOrCreateEntry() // Recarga los datos para reflejar cambios y actualizar initialBackendData
    } catch (error) {
      setMessage({ text: `Error al guardar metadatos: ${error.message}`, type: 'error' })
      console.error('MetadataForm: Error en handleSubmit:', error)
    } finally {
      setIsSaving(false)
      setTimeout(() => {
        if (message.type !== 'error' && message.type !== 'warning')
          setMessage({ text: '', type: '' })
      }, 4000)
    }
  }

  // --- Renderizado Condicional ---
  if (isFetching && !initialBackendData) {
    // Muestra cargando solo si es la carga inicial y no hay datos aún
    return (
      <div className="p-4 text-center text-gray-500 italic">
        Cargando metadatos para {keysFromSection?.etapaNombre || 'la etapa seleccionada'}...
      </div>
    )
  }

  if (!keysFromSection?.cicloId || !keysFromSection?.etapaId) {
    return (
      <div className="p-4 text-center text-orange-600 bg-orange-50 border border-orange-200 rounded-md">
        Por favor, selecciona un Ciclo de Trabajo y una Etapa para ver o editar los metadatos.
      </div>
    )
  }

  // --- Renderizado del Formulario ---
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border border-gray-300 rounded-b-lg bg-white shadow-md"
    >
      <div className="flex justify-between items-center">
        <h4 className="text-md font-semibold text-gray-700">
          Campos de Metadata para Etapa:{' '}
          <span className="text-indigo-600 font-bold">
            {keysFromSection.etapaNombre || 'Desconocida'}
          </span>
        </h4>
        <button
          type="button"
          onClick={fetchOrCreateEntry}
          disabled={isFetching || isSaving}
          className="p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50 text-xs"
          title="Recargar datos desde el servidor"
        >
          <FiRefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {formFieldsToRender.length === 0 && (
        <p className="text-sm text-orange-500">
          No hay campos de metadatos configurados en `allPossibleMetadataFields`.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {formFieldsToRender.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={`metadata-${field.name}`}
              className="block text-sm font-medium text-gray-700 mb-1"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50"
                disabled={isSaving}
              />
            ) : (
              <input
                type={field.type || 'text'}
                name={field.name}
                id={`metadata-${field.name}`}
                value={formData[field.name] === null ? '' : formData[field.name] || ''}
                onChange={handleChange}
                step={field.step || (field.type === 'number' ? 'any' : undefined)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50"
                disabled={isSaving}
              />
            )}
          </div>
        ))}
      </div>

      {initialBackendData && (
        <div className="mt-6 pt-4 border-t">
          <h5 className="text-sm font-medium text-gray-600 mb-2">
            Valores Adicionales Registrados/Calculados (Solo Lectura):
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-xs p-3 bg-gray-50 rounded-md">
            {initialBackendData.humedad_prom_porc !== null &&
              typeof initialBackendData.humedad_prom_porc !== 'undefined' && (
                <div>
                  <span className="text-gray-500">Humedad Promedio (%):</span>{' '}
                  <strong className="text-gray-800">{initialBackendData.humedad_prom_porc}</strong>
                </div>
              )}
            {initialBackendData.fdr_prom_kgf !== null &&
              typeof initialBackendData.fdr_prom_kgf !== 'undefined' && (
                <div>
                  <span className="text-gray-500">FDR Promedio (Kgf):</span>{' '}
                  <strong className="text-gray-800">{initialBackendData.fdr_prom_kgf}</strong>
                </div>
              )}
            {initialBackendData.resultado_cenizas_porc !== null &&
              typeof initialBackendData.resultado_cenizas_porc !== 'undefined' && (
                <div>
                  <span className="text-gray-500">Resultado Cenizas (%):</span>{' '}
                  <strong className="text-gray-800">
                    {initialBackendData.resultado_cenizas_porc}
                  </strong>
                </div>
              )}
            {initialBackendData.resultado_nitrogeno_total_porc !== null &&
              typeof initialBackendData.resultado_nitrogeno_total_porc !== 'undefined' && (
                <div>
                  <span className="text-gray-500">Resultado N Total (%):</span>{' '}
                  <strong className="text-gray-800">
                    {initialBackendData.resultado_nitrogeno_total_porc}
                  </strong>
                </div>
              )}
            {initialBackendData.resultado_nitrogeno_seca_porc !== null &&
              typeof initialBackendData.resultado_nitrogeno_seca_porc !== 'undefined' && (
                <div>
                  <span className="text-gray-500">Resultado N Base Seca (%):</span>{' '}
                  <strong className="text-gray-800">
                    {initialBackendData.resultado_nitrogeno_seca_porc}
                  </strong>
                </div>
              )}
          </div>
        </div>
      )}

      <div className="flex gap-x-3 pt-3 items-center">
        <button
          type="submit"
          disabled={isSaving || isFetching}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-60 flex items-center"
        >
          <FiSave className="mr-2 h-4 w-4" />
          {isSaving ? 'Guardando...' : 'Guardar Metadatos'}
        </button>
        {/* El botón de recargar ahora está junto al título del formulario */}
      </div>

      {message.text && (
        <p
          className={`mt-3 text-xs p-2.5 rounded-md border ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-300'
              : message.type === 'info'
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : message.type === 'warning'
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-300'
                  : 'bg-red-50 text-red-700 border-red-300'
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  )
}
export default MetadataForm
