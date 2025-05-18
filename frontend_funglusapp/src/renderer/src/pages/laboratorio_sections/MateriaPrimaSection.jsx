// src/renderer/src/pages/laboratorio_sections/MateriaPrimaSection.jsx
import React, { useCallback, useState } from 'react' // <--- IMPORTA useCallback
import KeySelector from '../../components/common/KeySelector'
import MateriaPrimaForm from '../../components/laboratorio/MateriaPrimaForm'
import { useCiclo } from '../../contexts/CicloContext'

function MateriaPrimaSection() {
  const { currentCiclo, currentOrigen, currentMuestra } = useCiclo()
  const [selectedKeysForForm, setSelectedKeysForForm] = useState(null) // Renombrado para claridad

  // Memoiza handleKeysReady
  const handleKeysReady = useCallback((keys) => {
    console.log('MateriaPrimaSection: Claves listas desde KeySelector:', keys)
    setSelectedKeysForForm(keys)
  }, []) // Sin dependencias, ya que setSelectedKeysForForm es estable

  // Memoiza handleKeysCleared
  const handleKeysCleared = useCallback(() => {
    console.log('MateriaPrimaSection: Claves limpiadas desde KeySelector, ocultando formulario.')
    setSelectedKeysForForm(null)
  }, []) // Sin dependencias, ya que setSelectedKeysForForm es estable

  // Determina si las claves globales necesarias para esta sección están listas
  // Esta condición se usa para decidir si se debe intentar mostrar el formulario
  // después de que KeySelector haya confirmado las claves.
  const areGlobalKeysSufficientForEtapa = currentCiclo && currentOrigen && currentMuestra

  return (
    <div className="py-1 space-y-6">
      <KeySelector
        etapa="materia_prima"
        onKeysSelected={handleKeysReady}
        onKeysCleared={handleKeysCleared}
      />

      {/* El formulario se muestra si selectedKeysForForm (manejado por KeySelector) tiene valor */}
      {selectedKeysForForm ? (
        <MateriaPrimaForm
          cicloKey={selectedKeysForForm.ciclo}
          origenKey={selectedKeysForForm.origen}
          muestraKey={selectedKeysForForm.muestra}
        />
      ) : (
        <div className="p-6 bg-blue-50 text-blue-700 rounded-md shadow text-center border border-blue-200">
          Por favor, selecciona Ciclo, Origen y Muestra en el panel de arriba y presiona "Cargar /
          Ver Datos de Etapa".
        </div>
      )}
    </div>
  )
}
export default MateriaPrimaSection
