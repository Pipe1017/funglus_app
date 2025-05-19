// src/renderer/src/pages/laboratorio_sections/CenizasSection.jsx
import React, { useState } from 'react'
// import KeySelectorForAnalysis from '../../components/common/KeySelectorForAnalysis';
// import CenizasForm from '../../components/laboratorio/CenizasForm';
import { useCiclo } from '../../contexts/CicloContext'

function CenizasSection() {
  const { currentCiclo } = useCiclo()
  const [analysisKeys, setAnalysisKeys] = useState(null)

  const handleAnalysisKeysSelected = (keys) => {
    setAnalysisKeys(keys)
    console.log('CenizasSection: Claves para análisis de Cenizas seleccionadas:', keys)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700">Análisis de Cenizas</h2>

      <p className="p-4 bg-yellow-50 text-yellow-700 rounded-md shadow">
        <strong>Nota:</strong> El Ciclo global activo es:{' '}
        <strong>{currentCiclo || 'Ninguno'}</strong>. Este formulario necesitará seleccionar Etapa,
        Muestra, Origen y Fecha de Análisis.
      </p>

      {/* <KeySelectorForAnalysis etapaContext="cenizas" onKeysSelected={handleAnalysisKeysSelected} /> */}
      <p className="text-gray-500 italic p-4 bg-white rounded shadow">
        (Selector de claves para Cenizas y Formulario irán aquí)
      </p>

      {/* {analysisKeys && <CenizasForm keys={analysisKeys} />} */}
    </div>
  )
}
export default CenizasSection
