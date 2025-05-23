// src/renderer/src/pages/laboratorio_sections/GubysSection.jsx
import React, { useCallback, useState } from 'react'
import KeySelector from '../../components/common/KeySelector'
import GubysForm from '../../components/laboratorio/GubysForm'
// No necesitamos useCiclo directamente aquí si KeySelector maneja la selección global de ciclo
// y las claves específicas (origen) se manejan a través de las props de KeySelector
// y el estado local 'selectedKeysForForm'.

function GubysSection() {
  const [selectedKeysForForm, setSelectedKeysForForm] = useState(null)

  // Memoiza handleKeysReady
  const handleKeysReady = useCallback((keys) => {
    // keys para Gubys debería ser { ciclo, origen }
    console.log('GubysSection: Claves listas desde KeySelector:', keys)
    if (keys && keys.ciclo && keys.origen) {
      setSelectedKeysForForm(keys)
    } else {
      // Esto no debería suceder si KeySelector valida correctamente para la etapa 'gubys'
      console.warn(
        'GubysSection: KeySelector llamó a onKeysSelected sin todas las claves necesarias para Gubys.'
      )
      setSelectedKeysForForm(null)
    }
  }, []) // Sin dependencias, ya que setSelectedKeysForForm es estable

  // Memoiza handleKeysCleared
  const handleKeysCleared = useCallback(() => {
    console.log('GubysSection: Claves limpiadas desde KeySelector, ocultando formulario.')
    setSelectedKeysForForm(null)
  }, []) // Sin dependencias, ya que setSelectedKeysForForm es estable

  return (
    <div className="py-1 space-y-6">
      <KeySelector
        etapa="gubys" // Especifica la etapa para el KeySelector
        onKeysSelected={handleKeysReady}
        onKeysCleared={handleKeysCleared}
      />

      {selectedKeysForForm ? (
        <GubysForm
          cicloKey={selectedKeysForForm.ciclo}
          origenKey={selectedKeysForForm.origen}
          // Muestra no es una clave para Gubys
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
export default GubysSection
