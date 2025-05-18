// src/renderer/src/pages/laboratorio_sections/TamoHumedoSection.jsx
import React, { useCallback, useState } from 'react'
import KeySelector from '../../components/common/KeySelector'
import TamoHumedoForm from '../../components/laboratorio/TamoHumedoForm'
// No necesitamos useCiclo directamente aquí

function TamoHumedoSection() {
  const [selectedKeysForForm, setSelectedKeysForForm] = useState(null)

  // Memoiza handleKeysReady
  const handleKeysReady = useCallback((keys) => {
    // keys para Tamo Humedo debería ser { ciclo, origen }
    console.log('TamoHumedoSection: Claves listas desde KeySelector:', keys)
    if (keys && keys.ciclo && keys.origen) {
      setSelectedKeysForForm(keys)
    } else {
      console.warn(
        'TamoHumedoSection: KeySelector llamó a onKeysSelected sin todas las claves necesarias para Tamo Humedo.'
      )
      setSelectedKeysForForm(null)
    }
  }, [])

  // Memoiza handleKeysCleared
  const handleKeysCleared = useCallback(() => {
    console.log('TamoHumedoSection: Claves limpiadas desde KeySelector, ocultando formulario.')
    setSelectedKeysForForm(null)
  }, [])

  return (
    <div className="py-1 space-y-6">
      <KeySelector
        etapa="tamo_humedo" // Especifica la etapa para el KeySelector
        onKeysSelected={handleKeysReady}
        onKeysCleared={handleKeysCleared}
      />

      {selectedKeysForForm ? (
        <TamoHumedoForm
          cicloKey={selectedKeysForForm.ciclo}
          origenKey={selectedKeysForForm.origen}
          // Muestra no es una clave para Tamo Humedo
        />
      ) : (
        <div className="p-6 bg-blue-50 text-blue-700 rounded-md shadow text-center border border-blue-200">
          Por favor, selecciona Ciclo y Origen en el panel de claves de arriba y presiona "Cargar /
          Ver Datos de Etapa".
        </div>
      )}
    </div>
  )
}
export default TamoHumedoSection
