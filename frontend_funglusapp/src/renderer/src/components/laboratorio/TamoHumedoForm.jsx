// src/renderer/src/components/laboratorio/TamoHumedoForm.jsx
import React, { useCallback, useEffect, useState } from 'react'
// Ya no necesitamos useCiclo aquí si las claves vienen como props

const initialFormState = {
  fecha_i: '',
  fecha_p: '',
  // origen viene como prop (origenKey)
  p1h1: '',
  p2h2: '',
  porc_h1: '',
  porc_h2: '',
  p_ph: '',
  ph: '',
  d1: '',
  d2: '',
  d3: ''
  // Hprom y Dprom son calculados
}

function TamoHumedoForm({ cicloKey, origenKey }) {
  // Recibe cicloKey y origenKey como props
  const [formData, setFormData] = useState(initialFormState)
  const [currentEntry, setCurrentEntry] = useState(null)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const [isFetchingData, setIsFetchingData] = useState(false)

  const formFields = [
    { name: 'fecha_i', label: 'Fecha Inicio', type: 'date' },
    { name: 'fecha_p', label: 'Fecha Pesaje', type: 'date' },
    // 'origen' no es un campo editable aquí
    { name: 'p1h1', label: 'P1H1', type: 'number' },
    { name: 'p2h2', label: 'P2H2', type: 'number' },
    { name: 'porc_h1', label: '%H1', type: 'number' },
    { name: 'porc_h2', label: '%H2', type: 'number' },
    { name: 'p_ph', label: 'P_PH', type: 'number' },
    { name: 'ph', label: 'PH', type: 'number' },
    { name: 'd1', label: 'd1', type: 'number' },
    { name: 'd2', label: 'd2', type: 'number' },
    { name: 'd3', label: 'd3', type: 'number' }
  ]

  const calculatedFields = [
    { name: 'hprom', label: 'Hprom (Calculado)' },
    { name: 'dprom', label: 'Dprom (Calculado)' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    const fieldDef = formFields.find((f) => f.name === name)
    const isNumeric = fieldDef?.type === 'number'
    setFormData((prev) => ({
      ...prev,
      [name]:
        isNumeric && value !== '' ? parseFloat(value) : value === '' && isNumeric ? null : value
    }))
  }

  const fetchDataForCurrentKeys = useCallback(async () => {
    if (!cicloKey || !origenKey) {
      setFormData(initialFormState)
      setCurrentEntry(null)
      return
    }
    setIsFetchingData(true)
    setMessage({ text: '', type: '' })
    try {
      const keys = { ciclo: cicloKey, origen: origenKey }
      console.log(`TamoHumedoForm: Fetching/Creating entry for keys:`, keys)
      const entryData = await window.electronAPI.getOrCreateTamoHumedo(keys)

      if (entryData) {
        const populatedFormData = {}
        formFields.forEach((field) => {
          populatedFormData[field.name] =
            entryData[field.name] === null || entryData[field.name] === undefined
              ? ''
              : entryData[field.name]
        })
        setFormData(populatedFormData)
        setCurrentEntry(entryData)
        setMessage({ text: 'Datos de Tamo Húmedo cargados/inicializados.', type: 'info' })
      } else {
        setFormData(initialFormState)
        setCurrentEntry(null)
        setMessage({
          text: `No se pudo obtener o crear la entrada Tamo Húmedo para ${cicloKey}/${origenKey}.`,
          type: 'warning'
        })
      }
    } catch (error) {
      setFormData(initialFormState)
      setCurrentEntry(null)
      setMessage({
        text: `Error al cargar datos Tamo Húmedo: ${error.message || 'Error desconocido'}`,
        type: 'error'
      })
      console.error('TamoHumedoForm: Error al cargar/crear entrada:', error)
    } finally {
      setIsFetchingData(false)
    }
  }, [cicloKey, origenKey])

  useEffect(() => {
    fetchDataForCurrentKeys()
  }, [fetchDataForCurrentKeys])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!cicloKey || !origenKey) {
      setMessage({ text: 'Las claves Ciclo y Origen deben estar seleccionadas.', type: 'error' })
      return
    }
    setMessage({ text: '', type: '' })
    setIsLoadingForm(true)
    const dataToSubmit = { ...formData }
    formFields.forEach((field) => {
      if (field.type === 'number' && dataToSubmit[field.name] === '')
        dataToSubmit[field.name] = null
      if (field.type !== 'number' && dataToSubmit[field.name] === '')
        dataToSubmit[field.name] = null
    })

    try {
      const keys = { ciclo: cicloKey, origen: origenKey }
      console.log(`TamoHumedoForm: Actualizando datos para keys:`, keys, `con data:`, dataToSubmit)
      const result = await window.electronAPI.updateTamoHumedo(keys, dataToSubmit)
      setMessage({ text: `Entrada Tamo Húmedo actualizada. Key: ${result.key}`, type: 'success' })
      fetchDataForCurrentKeys()
    } catch (error) {
      setMessage({
        text: `Error al actualizar Tamo Húmedo: ${error.message || 'Error desconocido'}`,
        type: 'error'
      })
      console.error('TamoHumedoForm: Error al actualizar:', error)
    } finally {
      setIsLoadingForm(false)
    }
  }

  return (
    <div className="space-y-8 p-1">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4 border border-gray-200"
      >
        <h3 className="text-lg font-medium text-gray-800">
          Datos TAMO HÚMEDO para: <br />
          Ciclo: <span className="font-bold text-indigo-600">{cicloKey || 'N/A'}</span>, Origen:{' '}
          <span className="font-bold text-indigo-600">{origenKey || 'N/A'}</span>
          {currentEntry && (
            <span className="text-sm text-gray-500 ml-2">(Key DB: {currentEntry.key})</span>
          )}
        </h3>
        {(!cicloKey || !origenKey) && (
          <p className="text-sm text-red-600 italic">
            Para editar, primero seleccione Ciclo y Origen en el panel de claves.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {formFields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={`th-${field.name}`}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                id={`th-${field.name}`}
                value={formData[field.name] === null ? '' : formData[field.name]}
                onChange={handleChange}
                step={field.type === 'number' ? 'any' : undefined}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                disabled={!cicloKey || !origenKey || isLoadingForm || isFetchingData}
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={!cicloKey || !origenKey || isLoadingForm || isFetchingData}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium text-xs uppercase rounded shadow-md hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isLoadingForm ? 'Guardando Cambios...' : 'Guardar Cambios Tamo Húmedo'}
        </button>
        {message.text && (
          <p
            className={`mt-3 text-sm font-medium ${
              message.type === 'success'
                ? 'text-green-600'
                : message.type === 'info'
                  ? 'text-blue-600'
                  : message.type === 'warning'
                    ? 'text-yellow-600'
                    : 'text-red-600'
            }`}
          >
            {message.text}
          </p>
        )}
      </form>

      {/* Tabla de Visualización para TamoHumedo */}
      {cicloKey && origenKey && currentEntry && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Datos Registrados de Tamo Húmedo
            </h3>
            <button
              onClick={fetchDataForCurrentKeys}
              disabled={isFetchingData || !cicloKey || !origenKey}
              className="px-4 py-2 bg-gray-500 text-white text-xs rounded-md hover:bg-gray-600 disabled:opacity-50"
            >
              {isFetchingData ? 'Actualizando...' : 'Actualizar Vista'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Campo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm font-medium text-gray-800">Key DB</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{currentEntry.key}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm font-medium text-gray-800">Ciclo</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{currentEntry.ciclo}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm font-medium text-gray-800">Origen</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{currentEntry.origen}</td>
                </tr>
                {formFields.map((field) => (
                  <tr key={field.name} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-800">{field.label}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {currentEntry[field.name] === null || currentEntry[field.name] === undefined
                        ? '-'
                        : String(currentEntry[field.name])}
                    </td>
                  </tr>
                ))}
                {calculatedFields.map((field) => (
                  <tr key={field.name} className="hover:bg-gray-50 bg-indigo-50">
                    <td className="px-4 py-2 text-sm font-semibold text-indigo-700">
                      {field.label}
                    </td>
                    <td className="px-4 py-2 text-sm font-bold text-indigo-700">
                      {currentEntry[field.name] === null || currentEntry[field.name] === undefined
                        ? '-'
                        : String(currentEntry[field.name])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!isFetchingData && !currentEntry && cicloKey && origenKey && (
        <div className="mt-8 p-6 bg-yellow-50 text-yellow-700 rounded-lg shadow border border-yellow-200 text-sm">
          No hay datos cargados para Tamo Húmedo (Ciclo: {cicloKey}, Origen: {origenKey}). El
          placeholder está vacío o la carga inicial falló. Puede ingresar datos y guardar.
        </div>
      )}
    </div>
  )
}
export default TamoHumedoForm
