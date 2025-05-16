// src/renderer/src/components/laboratorio/CicloManager.jsx
import React, { useState, useEffect } from 'react';
import { useCiclo } from '../../contexts/CicloContext';
import { FiRefreshCw } from 'react-icons/fi'; // Para el botón de refrescar

function CicloManager() {
  const [inputCiclo, setInputCiclo] = useState('');
  const { currentCiclo, selectCiclo, feedbackMessage: contextFeedback } = useCiclo();
  const [isLoading, setIsLoading] = useState(false);
  const [localMessage, setLocalMessage] = useState({ text: '', type: '' });
  const [availableCiclos, setAvailableCiclos] = useState([]);
  const [isFetchingCiclos, setIsFetchingCiclos] = useState(false);

  const fetchAvailableCiclos = async () => {
    setIsFetchingCiclos(true);
    setLocalMessage({ text: '', type: '' }); // Limpiar mensajes locales al refrescar
    try {
      console.log("CicloManager: Solicitando lista de ciclos distintos...");
      const ciclos = await window.electronAPI.getDistinctCiclos();
      console.log("CicloManager: Ciclos distintos recibidos:", ciclos);
      setAvailableCiclos(ciclos || []);
      if (ciclos && ciclos.length > 0) {
        // No mostramos mensaje de éxito aquí para no ser ruidoso,
        // el dropdown poblado es suficiente feedback.
      } else {
        setLocalMessage({ text: 'No hay ciclos previamente inicializados.', type: 'info' });
      }
    } catch (error) {
      console.error("CicloManager: Error al cargar ciclos disponibles:", error);
      setLocalMessage({ text: `Error al cargar lista de ciclos: ${error.message}`, type: 'error'});
    } finally {
      setIsFetchingCiclos(false);
      setTimeout(() => setLocalMessage({ text: '', type: '' }), 5000); // Limpiar mensaje de error/info
    }
  };

  useEffect(() => {
    fetchAvailableCiclos(); // Cargar ciclos al montar el componente
  }, []);

  const handleSetCiclo = async (cicloToSet) => {
    const trimmedCicloId = cicloToSet.trim();

    if (!trimmedCicloId) {
      setLocalMessage({ text: 'Por favor, ingresa o selecciona un ID de ciclo.', type: 'error' });
      // Considerar si se debe limpiar el ciclo activo en el contexto aquí
      // selectCiclo(''); // Esto limpiaría el ciclo activo si el input/select está vacío
      return;
    }

    setIsLoading(true);
    setLocalMessage({ text: `Estableciendo e inicializando ciclo '${trimmedCicloId}'...`, type: 'info' });

    try {
      console.log(`CicloManager: Llamando a initializeCicloPlaceholders para ciclo: ${trimmedCicloId}`);
      const backendResponse = await window.electronAPI.initializeCicloPlaceholders(trimmedCicloId);
      console.log("CicloManager: Respuesta del backend al inicializar placeholders:", backendResponse);

      selectCiclo(trimmedCicloId); // Actualiza el ciclo en el contexto global
      // El mensaje de feedback del contexto (de selectCiclo) se mostrará.
      // El mensaje local puede ser más específico sobre la inicialización.
      setLocalMessage({ text: backendResponse.message || `Ciclo '${trimmedCicloId}' establecido e inicializado con éxito.`, type: 'success' });
      
      // Si el ciclo era nuevo y no estaba en la lista, refrescar la lista
      if (!availableCiclos.includes(trimmedCicloId)) {
        fetchAvailableCiclos();
      }
      // setInputCiclo(''); // Opcional: limpiar el input de texto
    } catch (error) {
      console.error("CicloManager: Error al inicializar ciclo en backend:", error);
      setLocalMessage({ text: `Error al procesar ciclo '${trimmedCicloId}': ${error.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setLocalMessage({ text: '', type: '' }), 7000); // Mensaje local dura un poco más
    }
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSetCiclo(inputCiclo);
  };

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    setInputCiclo(selected); // Sincroniza el input de texto con el select
    if (selected) {
        handleSetCiclo(selected); // Establece e inicializa el ciclo seleccionado
    } else {
        selectCiclo(''); // Limpia el ciclo activo del contexto
        setLocalMessage({ text: 'Ningún ciclo seleccionado. Ciclo activo limpiado.', type: 'info'});
        setTimeout(() => setLocalMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Gestor de Ciclo Activo</h3>
      
      <div className="mb-4">
        <label htmlFor="cicloSelect" className="block text-sm font-medium text-gray-600 mb-1">
          Seleccionar Ciclo Existente:
        </label>
        <div className="flex items-center gap-2">
          <select
            id="cicloSelect"
            value={currentCiclo} // Controlado por el ciclo activo del contexto
            onChange={handleSelectChange}
            disabled={isLoading || isFetchingCiclos}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-70"
          >
            <option value="">-- Seleccionar un ciclo --</option>
            {availableCiclos.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button 
            type="button" 
            onClick={fetchAvailableCiclos} 
            disabled={isFetchingCiclos || isLoading}
            className="p-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
            title="Refrescar lista de ciclos"
          >
            <FiRefreshCw className={`h-4 w-4 ${isFetchingCiclos ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {isFetchingCiclos && <p className="text-xs text-gray-500 italic mt-1">Actualizando lista de ciclos...</p>}
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-3">
        <div>
          <label htmlFor="cicloInput" className="block text-sm font-medium text-gray-600 mb-1">
            O Ingresar Nuevo ID de Ciclo (y presionar "Establecer/Crear"):
          </label>
          <input
            type="text"
            id="cicloInput"
            value={inputCiclo}
            onChange={(e) => setInputCiclo(e.target.value)}
            placeholder="Ej: 1002 o C2025-02"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit"
          className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 whitespace-nowrap disabled:opacity-50"
          disabled={isLoading || !inputCiclo.trim()}
        >
          {isLoading ? 'Procesando...' : 'Establecer / Crear Ciclo'}
        </button>
      </form>

      {/* Sección de Mensajes (Corregida) */}
      {localMessage.text && (
        <p className={`mt-3 text-sm font-medium px-3 py-2 rounded-md inline-block ${
            localMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 
            localMessage.type === 'info' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
            localMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
            'bg-red-100 text-red-800 border border-red-300' // error
        }`}>
          {localMessage.text}
        </p>
      )}

      {currentCiclo && (
        <p className="mt-3 text-sm text-indigo-700">
          Ciclo activo actual para formularios: <strong className="font-semibold text-indigo-800">{currentCiclo}</strong>
          {contextFeedback && contextFeedback.includes(currentCiclo) && !localMessage.text && /* Mostrar feedback del contexto si no hay mensaje local */
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">({contextFeedback})</span>
          }
        </p>
       )}
       {!currentCiclo && !localMessage.text && !contextFeedback && (
        <p className="mt-3 text-sm text-orange-600 italic">
          Por favor, seleccione o ingrese un ciclo para comenzar.
        </p>
       )}
    </div>
  );
}

export default CicloManager;