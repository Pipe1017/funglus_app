// src/renderer/src/pages/FormulacionPage.jsx
import React from 'react'
import KeySelector from '../components/common/KeySelector' // <--- USA KEYSELECTOR
// import FormulacionForm from '../components/formulacion/FormulacionForm'; // Crearás este
import { useCiclo } from '../contexts/CicloContext' // Para las claves

function FormulacionPage() {
  const { currentCiclo, currentOrigen, currentMuestra } = useCiclo() // O las claves que necesite Formulacion

  // Define qué claves necesita la etapa "formulacion"
  // Asumamos que necesita ciclo y muestra (según tu última definición de claves para Formulacion en el backend)
  const areKeysSelected = currentCiclo && currentMuestra
  // Si 'origen' también es clave para formulacion, añádelo: && currentOrigen;

  const handleKeysReady = (keys) => {
    console.log('FormulacionPage: Claves listas desde KeySelector:', keys)
    // Aquí podrías setear un estado local si necesitas una confirmación explícita
    // o simplemente confiar en que el contexto se actualizó.
  }

  const handleKeysCleared = () => {
    console.log('FormulacionPage: Claves limpiadas desde KeySelector')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Módulo de Formulación</h1>

      <KeySelector
        etapa="formulacion" // Necesitarás añadir "formulacion" a etapaKeyDefinition en KeySelector.jsx
        onKeysSelected={handleKeysReady}
        onKeysCleared={handleKeysCleared}
      />

      {areKeysSelected ? (
        <div className="bg-white p-6 rounded-lg shadow mt-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Formulario de Formulación (En Construcción)
          </h2>
          <p className="text-gray-500">
            Formulario para Ciclo: {currentCiclo},
            {/* Origen: {currentOrigen},  // Si aplica para formulación */}
            Muestra: {currentMuestra}
          </p>
          {/* <FormulacionForm
                  cicloKey={currentCiclo}
                  muestraKey={currentMuestra}
                  // origenKey={currentOrigen} // Si aplica
              /> */}
        </div>
      ) : (
        <div className="p-6 bg-yellow-50 text-yellow-700 rounded-md shadow text-center border border-yellow-200">
          Por favor, selecciona las claves requeridas (Ciclo, Muestra) en el panel de arriba para
          continuar con Formulación.
        </div>
      )}
    </div>
  )
}
export default FormulacionPage
