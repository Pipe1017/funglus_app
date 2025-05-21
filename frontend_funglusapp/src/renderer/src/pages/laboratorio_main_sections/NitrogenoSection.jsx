// src/renderer/src/pages/laboratorio_main_sections/NitrogenoSection.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FiActivity,
  FiCheckSquare,
  FiFilter,
  FiHelpCircle,
  FiInfo,
  FiLayers,
  FiList,
  FiPlusSquare,
  FiRefreshCw,
  FiSave,
  FiTrendingUp
} from 'react-icons/fi' // Añadido FiTrendingUp
import IdentificadoresSelectForm from '../../components/laboratorio/general/IdentificadoresSelectForm'
import { useCiclo } from '../../contexts/CicloContext'

const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'
const CICLOS_PROCESAMIENTO_ENDPOINT = `${FASTAPI_BASE_URL}/ciclos-procesamiento`
const REGISTROS_NITROGENO_ENDPOINT = `${FASTAPI_BASE_URL}/registros-nitrogeno`
const DATOS_LABORATORIO_ENTRY_ENDPOINT = `${FASTAPI_BASE_URL}/datos_laboratorio/entry`
const TIPO_ANALISIS_NITROGENO = 'nitrogeno'

const initialRegistroFormState = {
  peso_muestra_n_g: '',
  n_hcl_normalidad: '',
  vol_hcl_gastado_cm3: ''
}

function NitrogenoSection() {
  // ... (estados existentes sin cambios: ciclosProcesamientoNitrogeno, selectedCicloProcesamientoId, etc.) ...
  const {
    currentCiclo: currentCicloCatalogoGlobal,
    getCurrentCicloId: getCurrentCicloCatalogoGlobalId
  } = useCiclo()

  const [ciclosProcesamientoNitrogeno, setCiclosProcesamientoNitrogeno] = useState([])
  const [selectedCicloProcesamientoId, setSelectedCicloProcesamientoId] = useState('')
  const [isLoadingCiclosProc, setIsLoadingCiclosProc] = useState(false)

  const [selectedCatalogoKeys, setSelectedCatalogoKeys] = useState(null)

  const [registroForm, setRegistroForm] = useState(initialRegistroFormState)

  const [humedadContextual, setHumedadContextual] = useState(null)
  const [isFetchingHumedad, setIsFetchingHumedad] = useState(false)
  const [humedadMessage, setHumedadMessage] = useState('')
  const [calculatedValues, setCalculatedValues] = useState({
    nitrogeno_organico_total_porc: null,
    peso_seco_g: null,
    nitrogeno_base_seca_porc: null
  })

  const [saveRegistroStatus, setSaveRegistroStatus] = useState({
    isLoading: false,
    error: '',
    success: ''
  })
  const [listaRegistros, setListaRegistros] = useState([])
  const [isLoadingRegistros, setIsLoadingRegistros] = useState(false)
  const [errorLoadingRegistros, setErrorLoadingRegistros] = useState('')

  // --- NUEVO ESTADO PARA EL PROCESO DE PROMEDIAR Y ACTUALIZAR ---
  const [averagingStatus, setAveragingStatus] = useState({
    isLoading: false,
    error: '',
    success: '',
    details: [] // Para mensajes detallados por cada grupo actualizado
  })

  // ... (fetchCiclosProcesamiento, handleCatalogoKeysConfirm, handleCatalogoKeysClear, fetchHumedadParaContexto, recalcularValoresNitrogeno, handleRegistroFormChange, fetchRegistrosNitrogenoDelLote, handleSaveRegistro - sin cambios)
  const fetchCiclosProcesamiento = useCallback(async () => {
    setIsLoadingCiclosProc(true)
    try {
      const response = await fetch(
        `${CICLOS_PROCESAMIENTO_ENDPOINT}/${TIPO_ANALISIS_NITROGENO}/?limit=1000`
      )
      if (!response.ok)
        throw new Error('No se pudieron cargar los lotes de procesamiento de nitrógeno.')
      const data = await response.json()
      setCiclosProcesamientoNitrogeno(data || [])
    } catch (error) {
      console.error('Error fetching lotes de procesamiento nitrógeno:', error)
    } finally {
      setIsLoadingCiclosProc(false)
    }
  }, [])

  useEffect(() => {
    fetchCiclosProcesamiento()
  }, [fetchCiclosProcesamiento])

  const handleCatalogoKeysConfirm = useCallback((keys) => {
    setSelectedCatalogoKeys(keys)
    setHumedadContextual(null)
    setHumedadMessage('')
  }, [])

  const handleCatalogoKeysClear = useCallback(() => {
    setSelectedCatalogoKeys(null)
    setHumedadContextual(null)
    setHumedadMessage('')
    setRegistroForm(initialRegistroFormState)
    setCalculatedValues({
      nitrogeno_organico_total_porc: null,
      peso_seco_g: null,
      nitrogeno_base_seca_porc: null
    })
  }, [])

  const fetchHumedadParaContexto = useCallback(async () => {
    if (!selectedCatalogoKeys || !selectedCatalogoKeys.cicloId || !selectedCatalogoKeys.etapaId) {
      setHumedadContextual(null)
      setHumedadMessage('')
      return
    }
    const keysForAPI = {
      ciclo_id: selectedCatalogoKeys.cicloId,
      etapa_id: selectedCatalogoKeys.etapaId,
      muestra_id: selectedCatalogoKeys.muestraId || 0,
      origen_id: selectedCatalogoKeys.origenId || 0
    }
    setIsFetchingHumedad(true)
    setHumedadMessage('Buscando H%...')
    setHumedadContextual(null)
    try {
      const response = await fetch(DATOS_LABORATORIO_ENTRY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keysForAPI)
      })
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: `Error HTTP ${response.status}` }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      const generalDataEntry = await response.json()
      if (generalDataEntry && typeof generalDataEntry.humedad_prom_porc === 'number') {
        setHumedadContextual(generalDataEntry.humedad_prom_porc)
        setHumedadMessage(`H% contextual: ${generalDataEntry.humedad_prom_porc.toFixed(2)}%`)
      } else {
        setHumedadMessage('Advertencia: H% no encontrado en tabla general para este contexto.')
      }
    } catch (error) {
      setHumedadContextual(null)
      setHumedadMessage(`Error al cargar H%: ${error.message}`)
    } finally {
      setIsFetchingHumedad(false)
    }
  }, [selectedCatalogoKeys])

  useEffect(() => {
    if (selectedCatalogoKeys) fetchHumedadParaContexto()
  }, [selectedCatalogoKeys, fetchHumedadParaContexto])

  const recalcularValoresNitrogeno = useCallback(() => {
    const a = parseFloat(registroForm.peso_muestra_n_g)
    const b = parseFloat(registroForm.n_hcl_normalidad)
    const c = parseFloat(registroForm.vol_hcl_gastado_cm3)
    const H_porc = humedadContextual
    let nTotal = null,
      pesoSeco = null,
      nSeca = null
    if (!isNaN(a) && a !== 0 && !isNaN(b) && !isNaN(c)) nTotal = (c * b * 1.4) / a
    if (!isNaN(a) && typeof H_porc === 'number' && H_porc !== null) {
      pesoSeco = (a * (100 - H_porc)) / 100
      if (pesoSeco !== 0 && !isNaN(b) && !isNaN(c)) nSeca = (c * b * 1.4) / pesoSeco
    }
    setCalculatedValues({
      nitrogeno_organico_total_porc: nTotal,
      peso_seco_g: pesoSeco,
      nitrogeno_base_seca_porc: nSeca
    })
  }, [registroForm, humedadContextual])

  useEffect(() => {
    recalcularValoresNitrogeno()
  }, [recalcularValoresNitrogeno])

  const fetchRegistrosNitrogenoDelLote = useCallback(async () => {
    if (!selectedCicloProcesamientoId) {
      setListaRegistros([])
      setErrorLoadingRegistros('')
      return
    }
    setIsLoadingRegistros(true)
    setErrorLoadingRegistros('')
    try {
      const response = await fetch(
        `${REGISTROS_NITROGENO_ENDPOINT}/lote/${selectedCicloProcesamientoId}/?limit=1000`
      )
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: `Error HTTP ${response.status}` }))
        throw new Error(
          errData.detail || `No se pudieron cargar los registros de nitrógeno para este lote.`
        )
      }
      const data = await response.json()
      setListaRegistros(data || [])
    } catch (error) {
      console.error('Error fetching registros de nitrógeno del lote:', error)
      setErrorLoadingRegistros(error.message)
    } finally {
      setIsLoadingRegistros(false)
    }
  }, [selectedCicloProcesamientoId])

  useEffect(() => {
    fetchRegistrosNitrogenoDelLote()
  }, [fetchRegistrosNitrogenoDelLote])

  const handleRegistroFormChange = (e) => {
    const { name, value } = e.target
    setRegistroForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveRegistro = async (e) => {
    e.preventDefault()
    if (!selectedCicloProcesamientoId) {
      setSaveRegistroStatus({
        isLoading: false,
        success: '',
        error: 'Seleccione un Lote de Procesamiento.'
      })
      return
    }
    if (!selectedCatalogoKeys) {
      setSaveRegistroStatus({
        isLoading: false,
        success: '',
        error: 'Seleccione el contexto del catálogo.'
      })
      return
    }
    if (
      isNaN(parseFloat(registroForm.peso_muestra_n_g)) ||
      isNaN(parseFloat(registroForm.n_hcl_normalidad)) ||
      isNaN(parseFloat(registroForm.vol_hcl_gastado_cm3))
    ) {
      setSaveRegistroStatus({
        isLoading: false,
        success: '',
        error: 'Peso Muestra, N HCL y Vol HCL deben ser números.'
      })
      return
    }

    setSaveRegistroStatus({ isLoading: true, error: '', success: '' })
    const payload = {
      ciclo_procesamiento_id: parseInt(selectedCicloProcesamientoId, 10),
      ciclo_catalogo_id: selectedCatalogoKeys.cicloId,
      etapa_catalogo_id: selectedCatalogoKeys.etapaId,
      muestra_catalogo_id: selectedCatalogoKeys.muestraId,
      origen_catalogo_id: selectedCatalogoKeys.origenId,
      peso_muestra_n_g: parseFloat(registroForm.peso_muestra_n_g),
      n_hcl_normalidad: parseFloat(registroForm.n_hcl_normalidad),
      vol_hcl_gastado_cm3: parseFloat(registroForm.vol_hcl_gastado_cm3)
    }
    try {
      const response = await fetch(REGISTROS_NITROGENO_ENDPOINT + '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: `Error HTTP ${response.status}` }))
        throw new Error(errData.detail || `Error HTTP ${response.status}`)
      }
      const savedData = await response.json()
      setSaveRegistroStatus({
        isLoading: false,
        success: `Registro (ID: ${savedData.id}) guardado.`,
        error: ''
      })
      setRegistroForm(initialRegistroFormState)
      fetchRegistrosNitrogenoDelLote()
      setTimeout(() => setSaveRegistroStatus((prev) => ({ ...prev, success: '' })), 4000)
    } catch (error) {
      setSaveRegistroStatus({
        isLoading: false,
        error: `Error al guardar: ${error.message}`,
        success: ''
      })
    }
  }

  const selectedCicloProcDetails = useMemo(() => {
    return ciclosProcesamientoNitrogeno.find(
      (cp) => cp.id === parseInt(selectedCicloProcesamientoId, 10)
    )
  }, [ciclosProcesamientoNitrogeno, selectedCicloProcesamientoId])

  const registrosTableColumns = useMemo(
    () => [
      {
        Header: 'Ciclo Cat.',
        accessor: (row) => row.ciclo_catalogo_ref?.nombre_ciclo || row.ciclo_catalogo_id
      },
      {
        Header: 'Etapa Cat.',
        accessor: (row) => row.etapa_catalogo_ref?.nombre || row.etapa_catalogo_id
      },
      {
        Header: 'Muestra Cat.',
        accessor: (row) => row.muestra_catalogo_ref?.nombre || row.muestra_catalogo_id
      },
      {
        Header: 'Origen Cat.',
        accessor: (row) => row.origen_catalogo_ref?.nombre || row.origen_catalogo_id
      },
      { Header: 'Peso N (g)', accessor: (row) => row.peso_muestra_n_g?.toFixed(3) || '-' },
      { Header: 'N HCL', accessor: (row) => row.n_hcl_normalidad?.toFixed(4) || '-' },
      { Header: 'Vol HCL (cm³)', accessor: (row) => row.vol_hcl_gastado_cm3?.toFixed(2) || '-' },
      {
        Header: 'N Org. Total (%)',
        accessor: (row) => row.calc_nitrogeno_organico_total_porc?.toFixed(2) || '-'
      },
      {
        Header: 'H% Usada (%)',
        accessor: (row) => row.calc_humedad_usada_referencia_porc?.toFixed(2) || '-'
      },
      { Header: 'Peso Seco (g)', accessor: (row) => row.calc_peso_seco_g?.toFixed(3) || '-' },
      {
        Header: 'N Base Seca (%)',
        accessor: (row) => row.calc_nitrogeno_base_seca_porc?.toFixed(2) || '-'
      }
    ],
    []
  )

  // --- NUEVA FUNCIÓN PARA PROMEDIAR Y ACTUALIZAR TABLA GENERAL ---
  const handlePromediarYActualizarGeneral = async () => {
    if (listaRegistros.length === 0) {
      setAveragingStatus({
        isLoading: false,
        success: '',
        error: 'No hay registros en este lote para promediar.',
        details: []
      })
      return
    }

    setAveragingStatus({ isLoading: true, error: '', success: '', details: [] })

    // 1. Agrupar registros por combinación de catálogos
    const groupedByCatalogo = listaRegistros.reduce((acc, registro) => {
      const key = `${registro.ciclo_catalogo_id}-${registro.etapa_catalogo_id}-${registro.muestra_catalogo_id}-${registro.origen_catalogo_id}`
      if (!acc[key]) {
        acc[key] = {
          ciclo_catalogo_id: registro.ciclo_catalogo_id,
          etapa_catalogo_id: registro.etapa_catalogo_id,
          muestra_catalogo_id: registro.muestra_catalogo_id,
          origen_catalogo_id: registro.origen_catalogo_id,
          // Para nombres en mensajes
          ciclo_nombre:
            registro.ciclo_catalogo_ref?.nombre_ciclo || `ID ${registro.ciclo_catalogo_id}`,
          etapa_nombre: registro.etapa_catalogo_ref?.nombre || `ID ${registro.etapa_catalogo_id}`,
          muestra_nombre:
            registro.muestra_catalogo_ref?.nombre || `ID ${registro.muestra_catalogo_id}`,
          origen_nombre:
            registro.origen_catalogo_ref?.nombre || `ID ${registro.origen_catalogo_id}`,
          sum_n_org_total: 0,
          count_n_org_total: 0,
          sum_n_base_seca: 0,
          count_n_base_seca: 0
        }
      }
      if (typeof registro.calc_nitrogeno_organico_total_porc === 'number') {
        acc[key].sum_n_org_total += registro.calc_nitrogeno_organico_total_porc
        acc[key].count_n_org_total++
      }
      if (typeof registro.calc_nitrogeno_base_seca_porc === 'number') {
        acc[key].sum_n_base_seca += registro.calc_nitrogeno_base_seca_porc
        acc[key].count_n_base_seca++
      }
      return acc
    }, {})

    const updatePromises = []
    const resultsDetails = []

    for (const key in groupedByCatalogo) {
      const group = groupedByCatalogo[key]
      const avg_n_org_total =
        group.count_n_org_total > 0 ? group.sum_n_org_total / group.count_n_org_total : null
      const avg_n_base_seca =
        group.count_n_base_seca > 0 ? group.sum_n_base_seca / group.count_n_base_seca : null

      const payloadGeneral = {
        ciclo_id: group.ciclo_catalogo_id,
        etapa_id: group.etapa_catalogo_id,
        muestra_id: group.muestra_catalogo_id,
        origen_id: group.origen_catalogo_id,
        // Solo enviar los campos que se van a actualizar
        resultado_nitrogeno_total_porc:
          avg_n_org_total !== null ? parseFloat(avg_n_org_total.toFixed(2)) : null,
        resultado_nitrogeno_seca_porc:
          avg_n_base_seca !== null ? parseFloat(avg_n_base_seca.toFixed(2)) : null
      }

      // Filtrar nulls del payload para no enviar campos no calculados si no hay datos para promediar
      const filteredPayload = Object.entries(payloadGeneral).reduce((acc, [k, v]) => {
        if (k.startsWith('resultado_') && v === null) {
          // No incluir resultados nulos si no se pudieron promediar
        } else {
          acc[k] = v
        }
        return acc
      }, {})

      // Solo proceder si hay algo que actualizar
      if (
        filteredPayload.hasOwnProperty('resultado_nitrogeno_total_porc') ||
        filteredPayload.hasOwnProperty('resultado_nitrogeno_seca_porc')
      ) {
        updatePromises.push(
          fetch(DATOS_LABORATORIO_ENTRY_ENDPOINT, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filteredPayload)
          })
            .then(async (response) => {
              const groupName = `C:${group.ciclo_nombre}, E:${group.etapa_nombre}, M:${group.muestra_nombre}, O:${group.origen_nombre}`
              if (!response.ok) {
                const errData = await response
                  .json()
                  .catch(() => ({ detail: `Error HTTP ${response.status}` }))
                return {
                  success: false,
                  message: `Error actualizando ${groupName}: ${errData.detail || response.statusText}`
                }
              }
              return {
                success: true,
                message: `Tabla general actualizada para ${groupName}. N Total: ${avg_n_org_total?.toFixed(2) || 'N/A'}, N Seca: ${avg_n_base_seca?.toFixed(2) || 'N/A'}`
              }
            })
            .catch((error) => {
              const groupName = `C:${group.ciclo_nombre}, E:${group.etapa_nombre}, M:${group.muestra_nombre}, O:${group.origen_nombre}`
              return {
                success: false,
                message: `Error de red actualizando ${groupName}: ${error.message}`
              }
            })
        )
      } else {
        const groupName = `C:${group.ciclo_nombre}, E:${group.etapa_nombre}, M:${group.muestra_nombre}, O:${group.origen_nombre}`
        resultsDetails.push({
          success: 'info',
          message: `No hay datos de nitrógeno válidos para promediar para ${groupName}. No se actualizó.`
        })
      }
    }

    if (updatePromises.length > 0) {
      const settledPromises = await Promise.allSettled(updatePromises)
      settledPromises.forEach((result) => {
        if (result.status === 'fulfilled') {
          resultsDetails.push(result.value)
        } else {
          // Esto no debería ocurrir si el .catch() dentro del promise devuelve un objeto
          resultsDetails.push({
            success: false,
            message: `Fallo una promesa de actualización: ${result.reason}`
          })
        }
      })
    }

    const allSuccessful = resultsDetails.every((r) => r.success === true || r.success === 'info') // 'info' es éxito parcial
    const finalMessage = allSuccessful
      ? 'Actualización de promedios en tabla general completada.'
      : 'Algunas actualizaciones de promedios fallaron o no se realizaron.'

    setAveragingStatus({
      isLoading: false,
      success: allSuccessful && resultsDetails.some((r) => r.success === true) ? finalMessage : '', // Solo mensaje de éxito si algo se actualizó realmente
      error: !allSuccessful ? finalMessage : '',
      details: resultsDetails
    })
  }

  return (
    <div className="space-y-6 p-1">
      {/* ... (Sección 1: Selección del Ciclo de Procesamiento - sin cambios) ... */}
      {/* ... (Sección 2 y 3: Identificadores de Catálogo, Humedad, Formulario de Nuevo Registro - sin cambios) ... */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <FiActivity className="mr-3 text-indigo-600" size={24} />
        Análisis de Nitrógeno por Lote de Procesamiento
      </h2>

      <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="cicloProcesamientoSelect"
            className="block text-md font-semibold text-gray-600"
          >
            <FiLayers className="inline mr-2 mb-1" />
            1. Lote de Procesamiento de Nitrógeno Activo:
          </label>
          <button
            onClick={fetchCiclosProcesamiento}
            disabled={isLoadingCiclosProc}
            className="p-1 text-gray-500 hover:text-blue-600"
            title="Refrescar lista de lotes"
          >
            <FiRefreshCw className={`h-4 w-4 ${isLoadingCiclosProc ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {isLoadingCiclosProc && <p className="text-sm italic">Cargando lotes...</p>}
        {!isLoadingCiclosProc && ciclosProcesamientoNitrogeno.length === 0 && (
          <p className="text-sm text-orange-600 p-2 bg-orange-50 border border-orange-200 rounded">
            No hay Lotes de Procesamiento de Nitrógeno. Por favor, cree uno en "Gestión de Ciclos".
          </p>
        )}
        {!isLoadingCiclosProc && ciclosProcesamientoNitrogeno.length > 0 && (
          <select
            id="cicloProcesamientoSelect"
            value={selectedCicloProcesamientoId}
            onChange={(e) => {
              setSelectedCicloProcesamientoId(e.target.value)
              handleCatalogoKeysClear()
            }}
            className="mt-1 block w-full lg:w-1/2 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">-- Seleccione un Lote de Procesamiento --</option>
            {ciclosProcesamientoNitrogeno.map((cp) => (
              <option key={cp.id} value={cp.id}>
                {cp.identificador_lote} (
                {new Date(cp.fecha_hora_lote).toLocaleString('es-ES', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
                )
              </option>
            ))}
          </select>
        )}
        {selectedCicloProcDetails && (
          <div className="mt-2 p-2 text-xs bg-indigo-50 border border-indigo-200 rounded-md">
            <strong>Lote Activo:</strong> {selectedCicloProcDetails.identificador_lote} <br />
            <strong>Fecha Lote:</strong>{' '}
            {new Date(selectedCicloProcDetails.fecha_hora_lote).toLocaleString('es-ES', {
              dateStyle: 'long',
              timeStyle: 'medium'
            })}{' '}
            <br />
            <strong>Descripción:</strong> {selectedCicloProcDetails.descripcion || '-'}
          </div>
        )}
      </div>

      {selectedCicloProcesamientoId && (
        <>
          <div className="p-4 bg-white rounded-lg shadow border border-gray-200 mt-4">
            <h3 className="text-md font-semibold text-gray-600 mb-3 border-b pb-2">
              <FiFilter className="inline mr-2 mb-1" />
              2. Contexto del Catálogo para este Registro
            </h3>
            <IdentificadoresSelectForm
              onConfirm={handleCatalogoKeysConfirm}
              onClear={handleCatalogoKeysClear}
              activeCicloId={getCurrentCicloCatalogoGlobalId()}
              key={selectedCicloProcesamientoId}
            />
          </div>

          {selectedCatalogoKeys && (
            <>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm">
                <p className="font-medium text-blue-700 flex items-center">
                  <FiHelpCircle className="inline mr-2" />
                  Humedad de Referencia (H%)
                </p>
                {isFetchingHumedad && (
                  <p className="text-blue-600 italic text-xs">Buscando H%...</p>
                )}
                {humedadMessage && !isFetchingHumedad && (
                  <p
                    className={`mt-1 text-xs ${humedadContextual !== null ? 'text-green-700' : 'text-orange-600'}`}
                  >
                    {humedadMessage}
                  </p>
                )}
              </div>

              <div className="p-4 bg-white rounded-lg shadow border border-gray-200 mt-4">
                <h3 className="text-md font-semibold text-gray-600 mb-3 border-b pb-2">
                  <FiPlusSquare className="inline mr-2 mb-1" />
                  3. Añadir Nuevo Registro de Análisis de Nitrógeno al Lote{' '}
                  <span className="text-indigo-600 font-bold">
                    "{selectedCicloProcDetails?.identificador_lote}"
                  </span>
                </h3>
                <form onSubmit={handleSaveRegistro} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                    <div>
                      <label
                        htmlFor="peso_muestra_n_g"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Peso Muestra (a) [g]:
                      </label>
                      <input
                        type="number"
                        name="peso_muestra_n_g"
                        value={registroForm.peso_muestra_n_g}
                        onChange={handleRegistroFormChange}
                        step="any"
                        required
                        className="mt-1 w-full input-std"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="n_hcl_normalidad"
                        className="block text-xs font-medium text-gray-700"
                      >
                        N HCL (b):
                      </label>
                      <input
                        type="number"
                        name="n_hcl_normalidad"
                        value={registroForm.n_hcl_normalidad}
                        onChange={handleRegistroFormChange}
                        step="any"
                        required
                        className="mt-1 w-full input-std"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="vol_hcl_gastado_cm3"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Vol HCL (c) [cm³]:
                      </label>
                      <input
                        type="number"
                        name="vol_hcl_gastado_cm3"
                        value={registroForm.vol_hcl_gastado_cm3}
                        onChange={handleRegistroFormChange}
                        step="any"
                        required
                        className="mt-1 w-full input-std"
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-100 rounded-md border">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Resultados Calculados (para esta entrada):
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <p>
                        N Org. Total [%]:{' '}
                        <strong className="text-indigo-700">
                          {calculatedValues.nitrogeno_organico_total_porc?.toFixed(3) || '-'}
                        </strong>
                      </p>
                      <p>
                        Peso Seco [g]:{' '}
                        <strong className="text-indigo-700">
                          {calculatedValues.peso_seco_g?.toFixed(3) || '-'}
                        </strong>
                      </p>
                      <p>
                        N Base Seca [%]:{' '}
                        <strong className="text-indigo-700">
                          {calculatedValues.nitrogeno_base_seca_porc?.toFixed(3) || '-'}
                        </strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={saveRegistroStatus.isLoading || isFetchingHumedad}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none disabled:opacity-60 flex items-center"
                    >
                      <FiSave className="mr-2 h-4 w-4" />
                      {saveRegistroStatus.isLoading ? 'Guardando...' : 'Guardar Este Registro'}
                    </button>
                  </div>
                  {saveRegistroStatus.error && (
                    <p className="text-xs text-red-600 mt-1">{saveRegistroStatus.error}</p>
                  )}
                  {saveRegistroStatus.success && (
                    <p className="text-xs text-green-600 mt-1">{saveRegistroStatus.success}</p>
                  )}
                </form>
              </div>
            </>
          )}
        </>
      )}

      {selectedCicloProcesamientoId && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow border border-gray-200">
          {/* ... (código de la tabla de lista de registros sin cambios) ... */}
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h3 className="text-md font-semibold text-gray-700">
              <FiList className="inline mr-2 mb-1" />
              Registros Guardados para el Lote:{' '}
              <span className="text-indigo-600 font-bold">
                {selectedCicloProcDetails?.identificador_lote}
              </span>
            </h3>
            <button
              onClick={fetchRegistrosNitrogenoDelLote}
              disabled={isLoadingRegistros}
              className="p-1 text-gray-500 hover:text-blue-600"
              title="Refrescar lista de registros"
            >
              <FiRefreshCw className={`h-4 w-4 ${isLoadingRegistros ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {isLoadingRegistros && (
            <p className="text-sm italic text-center py-3">Cargando registros...</p>
          )}
          {!isLoadingRegistros && errorLoadingRegistros && (
            <p className="text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded">
              {errorLoadingRegistros}
            </p>
          )}
          {!isLoadingRegistros && !errorLoadingRegistros && listaRegistros.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-3">
              No hay registros de nitrógeno para este lote aún.
            </p>
          )}
          {!isLoadingRegistros && !errorLoadingRegistros && listaRegistros.length > 0 && (
            <div className="overflow-x-auto text-xs">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {registrosTableColumns.map((col) => (
                      <th
                        key={col.Header}
                        scope="col"
                        className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {col.Header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listaRegistros.map((registro) => (
                    <tr key={registro.id} className="hover:bg-gray-50">
                      {registrosTableColumns.map((col) => (
                        <td key={col.Header} className="px-3 py-2 whitespace-nowrap">
                          {col.accessor(registro)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- NUEVA SECCIÓN: BOTÓN Y LÓGICA PARA PROMEDIAR --- */}
      {selectedCicloProcesamientoId && listaRegistros.length > 0 && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow border border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
            <FiTrendingUp className="inline mr-2 mb-1 text-green-600" />
            4. Finalizar Lote: Calcular Promedios y Actualizar Tabla General
          </h3>
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 mb-4">
            <p className="flex items-start">
              <FiInfo size={20} className="mr-2 mt-0.5 text-green-600 flex-shrink-0" />
              <span>
                Esta acción calculará los promedios de "N Org. Total (%)" y "N Base Seca (%)" para
                cada combinación única de Ciclo (Cat.), Etapa, Muestra y Origen dentro de{' '}
                <strong className="font-semibold">este lote de procesamiento activo</strong>. Luego,
                actualizará la Tabla General con estos promedios.
              </span>
            </p>
          </div>
          <button
            onClick={handlePromediarYActualizarGeneral}
            disabled={averagingStatus.isLoading || listaRegistros.length === 0}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 focus:outline-none disabled:opacity-60 flex items-center"
          >
            <FiCheckSquare className="mr-2 h-4 w-4" />
            {averagingStatus.isLoading
              ? 'Procesando Promedios...'
              : 'Calcular y Guardar Promedios en Tabla General'}
          </button>
          {averagingStatus.isLoading && (
            <p className="text-xs italic text-teal-700 mt-2">
              Actualizando tabla general, esto puede tardar un momento...
            </p>
          )}
          {averagingStatus.error && (
            <div className="mt-2 text-xs text-red-700 p-2 bg-red-50 border border-red-200 rounded">
              <p className="font-semibold">
                Error al promediar/actualizar: {averagingStatus.error}
              </p>
              {averagingStatus.details
                .filter((d) => !d.success)
                .map((detail, index) => (
                  <p key={`err-${index}`}>- {detail.message}</p>
                ))}
            </div>
          )}
          {averagingStatus.success && (
            <div className="mt-2 text-xs text-green-700 p-2 bg-green-50 border border-green-200 rounded">
              <p className="font-semibold">{averagingStatus.success}</p>
              {averagingStatus.details
                .filter((d) => d.success === true || d.success === 'info')
                .map((detail, index) => (
                  <p key={`ok-${index}`}>- {detail.message}</p>
                ))}
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .input-std {
          display: block;
          width: 100%;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #374151;
          background-color: #fff;
          background-clip: padding-box;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
          transition:
            border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
        }
        .input-std:focus {
          border-color: #4f46e5;
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(79, 70, 229, 0.25);
        }
      `}</style>
    </div>
  )
}

export default NitrogenoSection
