// src/renderer/src/components/laboratorio/MateriaPrimaForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useCiclo } from '../../contexts/CicloContext';

function MateriaPrimaForm() {
  const { currentCiclo } = useCiclo();

  const initialFormState = {
    fecha_i: '', fecha_p: '', muestra: '', origen: '',
    p1h1: '', p2h2: '', porc_h1: '', porc_h2: '',
    p_ph: '', ph: '', d1: '', d2: '', d3: ''
    // Hprom y Dprom no se ingresan, se calculan en backend
  };
  const [formData, setFormData] = useState(initialFormState);
  const [currentEntry, setCurrentEntry] = useState(null); // Para guardar la entrada completa con key, Hprom, Dprom
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const formFields = [
    { name: 'fecha_i', label: 'Fecha Inicio', type: 'date' },
    { name: 'fecha_p', label: 'Fecha Pesaje', type: 'date' },
    { name: 'muestra', label: 'Muestra', type: 'text' },
    { name: 'origen', label: 'Origen', type: 'text' }, // Podríamos cambiarlo a select después
    { name: 'p1h1', label: 'P1H1', type: 'number' },
    { name: 'p2h2', label: 'P2H2', type: 'number' },
    { name: 'porc_h1', label: '%H1', type: 'number' },
    { name: 'porc_h2', label: '%H2', type: 'number' },
    { name: 'p_ph', label: 'P_PH', type: 'number' },
    { name: 'ph', label: 'PH', type: 'number' },
    { name: 'd1', label: 'd1', type: 'number' },
    { name: 'd2', label: 'd2', type: 'number' },
    { name: 'd3', label: 'd3', type: 'number' },
  ];

  // Campos que son calculados y solo se muestran
  const calculatedFields = [
    { name: 'hprom', label: 'Hprom (Calculado)'},
    { name: 'dprom', label: 'Dprom (Calculado)'},
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const fieldDef = formFields.find(f => f.name === name);
    const isNumeric = fieldDef?.type === 'number';

    setFormData(prev => ({
      ...prev,
      [name]: isNumeric && value !== '' ? parseFloat(value) : (value === '' ? null : value)
    }));
  };

  const fetchDataForCurrentCiclo = useCallback(async () => {
    if (!currentCiclo) {
      setFormData(initialFormState);
      setCurrentEntry(null);
      return;
    }
    setIsFetchingData(true);
    setMessage({ text: '', type: '' });
    try {
      console.log(`MateriaPrimaForm: Fetching entry for ciclo: ${currentCiclo}`);
      const entryData = await window.electronAPI.getMateriaPrimaByCiclo(currentCiclo);

      if (entryData) {
        const populatedFormData = {};
        formFields.forEach(field => {
          populatedFormData[field.name] = entryData[field.name] === null || entryData[field.name] === undefined ? '' : entryData[field.name];
        });
        setFormData(populatedFormData);
        setCurrentEntry(entryData); // Guardamos toda la entrada, incluyendo campos calculados y key
        setMessage({ text: 'Datos de Materia Prima cargados.', type: 'info' });
      } else {
        setFormData(initialFormState);
        setCurrentEntry(null);
        setMessage({ text: `No se encontró entrada de Materia Prima para el ciclo ${currentCiclo}. Verifica que el ciclo fue inicializado.`, type: 'warning' });
      }
    } catch (error) {
      console.error("MateriaPrimaForm: Error al cargar entrada:", error);
      setFormData(initialFormState);
      setCurrentEntry(null);
      if (error.message.includes("No hay entrada Materia Prima para el ciclo")) {
         setMessage({ text: error.message + " (Esto es normal si el ciclo es nuevo y la inicialización falló o está pendiente).", type: 'info' });
      } else {
         setMessage({ text: `Error al cargar entrada: ${error.message}`, type: 'error' });
      }
    } finally {
      setIsFetchingData(false);
    }
  }, [currentCiclo]);

  useEffect(() => {
    fetchDataForCurrentCiclo();
  }, [fetchDataForCurrentCiclo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentCiclo) {
      setMessage({ text: 'Por favor, establece un ciclo activo primero.', type: 'error' });
      return;
    }
    setMessage({ text: '', type: '' });
    setIsLoadingForm(true);

    const dataToSubmit = { ...formData };
    formFields.forEach(field => {
      if (dataToSubmit[field.name] === '') {
        dataToSubmit[field.name] = null;
      }
    });

    try {
      console.log(`MateriaPrimaForm: Actualizando datos para ciclo '${currentCiclo}':`, dataToSubmit);
      const result = await window.electronAPI.updateMateriaPrimaByCiclo(currentCiclo, dataToSubmit);
      setMessage({ text: `Entrada Materia Prima para ciclo '${currentCiclo}' actualizada. Key: ${result.key}`, type: 'success' });
      // Volver a cargar los datos para mostrar Hprom y Dprom calculados
      fetchDataForCurrentCiclo(); 
    } catch (error) {
      setMessage({ text: `Error al actualizar: ${error.message}`, type: 'error' });
      console.error("MateriaPrimaForm: Error al actualizar:", error);
    } finally {
      setIsLoadingForm(false);
    }
  };

  return (
    <div className="space-y-8 p-1">
      <form onSubmit={handleSubmit} className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">
          Datos MATERIA PRIMA para Ciclo: <span className="font-bold text-indigo-600">{currentCiclo || "(Ninguno definido)"}</span>
          {currentEntry && <span className="text-sm text-gray-500 ml-2">(Registro Key: {currentEntry.key})</span>}
        </h3>
        {!currentCiclo && <p className="text-sm text-red-600 italic">Para editar, primero defina un "Ciclo Activo".</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {formFields.map(field => (
            <div key={field.name}>
              <label htmlFor={`mp-${field.name}`} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                id={`mp-${field.name}`}
                value={formData[field.name] === null ? '' : formData[field.name]}
                onChange={handleChange}
                step={field.type === 'number' ? 'any' : undefined}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                disabled={!currentCiclo || isLoadingForm || isFetchingData}
              />
            </div>
          ))}
        </div>
        <button 
          type="submit" 
          disabled={!currentCiclo || isLoadingForm || isFetchingData}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium text-xs uppercase rounded shadow-md hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isLoadingForm ? 'Guardando Cambios...' : 'Guardar Cambios Materia Prima'}
        </button>
        {message.text && (
          <p className={`mt-3 text-sm font-medium ${
            message.type === 'success' ? 'text-green-600' : 
            message.type === 'info' ? 'text-blue-600' : 
            message.type === 'warning' ? 'text-yellow-600' : 
            'text-red-600'}`}>
            {message.text}
          </p>
        )}
      </form>

      {/* Sección para mostrar la entrada actual, incluyendo campos calculados */}
      {currentCiclo && currentEntry && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
              Datos Registrados de Materia Prima para Ciclo: <span className="font-bold text-indigo-600">{currentCiclo}</span>
              </h3>
              <button 
                  onClick={fetchDataForCurrentCiclo} 
                  disabled={isFetchingData || !currentCiclo}
                  className="px-4 py-2 bg-gray-500 text-white text-xs rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isFetchingData ? 'Actualizando...' : 'Actualizar Vista'}
              </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Campo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Valor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50"><td className="px-4 py-2 text-sm font-medium text-gray-800">Key</td><td className="px-4 py-2 text-sm text-gray-600">{currentEntry.key}</td></tr>
                <tr className="hover:bg-gray-50"><td className="px-4 py-2 text-sm font-medium text-gray-800">Ciclo</td><td className="px-4 py-2 text-sm text-gray-600">{currentEntry.ciclo}</td></tr>
                {formFields.map(field => (
                  <tr key={field.name} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-800">{field.label}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {currentEntry[field.name] === null || currentEntry[field.name] === undefined ? '-' : String(currentEntry[field.name])}
                    </td>
                  </tr>
                ))}
                {calculatedFields.map(field => (
                     <tr key={field.name} className="hover:bg-gray-50 bg-indigo-50">
                        <td className="px-4 py-2 text-sm font-semibold text-indigo-700">{field.label}</td>
                        <td className="px-4 py-2 text-sm font-bold text-indigo-700">
                        {currentEntry[field.name] === null || currentEntry[field.name] === undefined ? '-' : String(currentEntry[field.name])}
                        </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!isFetchingData && !currentEntry && currentCiclo && (
        <div className="mt-8 p-6 bg-yellow-50 text-yellow-700 rounded-lg shadow border border-yellow-200">
            No hay datos cargados para Materia Prima del ciclo <span className="font-bold">{currentCiclo}</span>. Intenta actualizar o verifica la inicialización del ciclo.
        </div>
      )}
    </div>
  );
}
export default MateriaPrimaForm;