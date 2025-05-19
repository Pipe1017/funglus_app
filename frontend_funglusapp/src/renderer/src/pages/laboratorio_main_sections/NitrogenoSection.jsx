// src/renderer/src/pages/laboratorio_main_sections/NitrogenoSection.jsx
import React from 'react' // Asegúrate de importar React si usas JSX
// Importarás KeySelector y el formulario de Nitrógeno después
// import KeySelector from '../../components/common/KeySelector';
// import NitrogenoForm from '../../components/laboratorio/NitrogenoForm';
import { useCiclo } from '../../contexts/CicloContext'

function NitrogenoSection() {
  const { currentCiclo } = useCiclo()
  // const [analysisKeys, setAnalysisKeys] = useState(null); // Estado para claves específicas

  // const handleAnalysisKeysSelected = (keys) => {
  //   setAnalysisKeys(keys);
  //   console.log("NitrogenoSection: Claves para análisis de Nitrógeno seleccionadas:", keys);
  // };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700">Análisis de Nitrógeno</h2>

      <p className="p-4 bg-yellow-50 text-yellow-700 rounded-md shadow">
        <strong>Nota:</strong> El Ciclo global activo es:{' '}
        <strong>{currentCiclo || 'Ninguno'}</strong>.
        {/* Este formulario necesitará seleccionar Etapa, Muestra, Origen, Fecha de Análisis y Número de Repetición. */}
      </p>

      {/* Aquí iría un KeySelector adaptado para análisis específicos que permita seleccionar:
            - Etapa (de catálogo)
            - Muestra (de catálogo, filtrada por etapa si es necesario)
            - Origen (de catálogo, filtrado por etapa/muestra si es necesario)
            - Fecha de Análisis (input de fecha)
            - Número de Repetición (input numérico)
          */}
      {/* <KeySelector etapa="nitrogeno_analisis" onKeysSelected={handleAnalysisKeysSelected} /> */}
      <p className="text-gray-500 italic p-4 bg-white rounded shadow">
        (Selector de claves para Nitrógeno y Formulario irán aquí - En construcción)
      </p>

      {/* {analysisKeys && <NitrogenoForm keys={analysisKeys} />} */}
    </div>
  )
}

export default NitrogenoSection // <--- ¡ASEGÚRATE DE QUE ESTA LÍNEA EXISTA Y SEA CORRECTA!
