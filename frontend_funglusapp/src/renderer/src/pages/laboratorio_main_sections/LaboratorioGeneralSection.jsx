// src/renderer/src/pages/laboratorio_main_sections/LaboratorioGeneralSection.jsx
import React, { useCallback, useState } from 'react'
import { FiClipboard, FiDatabase, FiEdit, FiFilter } from 'react-icons/fi'
import IdentificadoresSelectForm from '../../components/laboratorio/general/IdentificadoresSelectForm'
import MetadataForm from '../../components/laboratorio/general/MetadataForm'
import ResumenMatriz from '../../components/laboratorio/general/ResumenMatriz' // El ResumenMatriz modificado

function LaboratorioGeneralSection() {
  // Estado para las claves de catálogo seleccionadas (Ciclo Cat, Etapa, Muestra, Origen)
  const [selectedCatalogoKeys, setSelectedCatalogoKeys] = useState(null)

  // Callback para cuando se confirman los identificadores del IdentificadoresSelectForm
  const handleCatalogoKeysConfirm = useCallback((keys) => {
    console.log('LaboratorioGeneralSection: Combinación de claves confirmada:', keys)
    setSelectedCatalogoKeys(keys)
  }, [])

  // Callback para cuando se limpian los identificadores
  const handleCatalogoKeysClear = useCallback(() => {
    console.log('LaboratorioGeneralSection: Selección de identificadores limpiada.')
    setSelectedCatalogoKeys(null)
  }, [])

  return (
    <div className="space-y-6 p-1">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <FiClipboard className="mr-3 text-purple-600" size={24} />
        Gestión de Datos Generales de Laboratorio
      </h2>

      {/* Sección 1: Selección de Identificadores de Catálogo */}
      <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
        <h3 className="text-md font-semibold text-gray-600 mb-3 border-b pb-2">
          <FiFilter className="inline mr-2 mb-1" />
          1. Seleccione el Contexto del Catálogo
        </h3>
        <IdentificadoresSelectForm
          onConfirm={handleCatalogoKeysConfirm}
          onClear={handleCatalogoKeysClear}
          // formKey podría usarse si necesitamos resetearlo externamente,
          // por ahora no parece necesario aquí ya que es el nivel superior de selección.
        />
      </div>

      {/* Sección 2: Formulario de Metadatos (visible si se seleccionó un contexto de catálogo) */}
      {selectedCatalogoKeys && (
        <div className="p-4 bg-white rounded-lg shadow border border-gray-200 mt-4">
          <h3 className="text-md font-semibold text-gray-600 mb-3 border-b pb-2">
            <FiEdit className="inline mr-2 mb-1" />
            2. Editar Metadatos para la Selección Actual
          </h3>
          <MetadataForm
            keysFromSection={selectedCatalogoKeys}
            key={
              selectedCatalogoKeys
                ? `${selectedCatalogoKeys.cicloId}-${selectedCatalogoKeys.etapaId}-${selectedCatalogoKeys.muestraId}-${selectedCatalogoKeys.origenId}`
                : 'empty'
            } // Forza re-render si las claves cambian
          />
        </div>
      )}
      {!selectedCatalogoKeys && (
        <div className="p-3 mt-4 rounded-md border text-sm bg-gray-50 border-gray-200 text-gray-600">
          Seleccione una combinación de Ciclo (Catálogo), Etapa, Muestra y Origen para ver/editar
          sus metadatos generales.
        </div>
      )}

      {/* Sección 3: Resumen de la Matriz General */}
      {/* ResumenMatriz ahora tiene su propio selector de ciclo, por lo que no necesita props de cicloId/Nombre */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow border border-gray-200">
        <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
          <FiDatabase className="inline mr-2 mb-1" />
          3. Resumen de la Tabla General (Seleccione un Ciclo del Catálogo en la tabla de abajo)
        </h3>
        <ResumenMatriz />
      </div>
    </div>
  )
}

export default LaboratorioGeneralSection
