// src/pages/laboratorio_main_sections/LaboratorioGeneralSection.jsx
import React, { useState, useCallback } from 'react';
import { FiEdit, FiFilter, FiDatabase, FiClipboard } from 'react-icons/fi';
import IdentificadoresSelectForm from '../../components/laboratorio/general/IdentificadoresSelectForm';
import MetadataForm from '../../components/laboratorio/general/MetadataForm';
import ResumenMatriz from '../../components/laboratorio/general/ResumenMatriz';

function LaboratorioGeneralSection() {
  const [selectedCatalogoKeys, setSelectedCatalogoKeys] = useState(null);

  const handleCatalogoKeysConfirm = useCallback((keys) => {
    setSelectedCatalogoKeys(keys);
  }, []);

  const handleCatalogoKeysClear = useCallback(() => {
    setSelectedCatalogoKeys(null);
  }, []);
  
  const handleEditFromMatriz = useCallback((rowToEdit) => {
    const keys = {
      id: rowToEdit.id,
      cicloId: rowToEdit.ciclo_id,
      etapaId: rowToEdit.etapa_id,
      muestraId: rowToEdit.muestra_id,
      origenId: rowToEdit.origen_id,
      secuenciaId: rowToEdit.secuencia_id,
      cicloNombre: rowToEdit.ciclo_ref?.nombre_ciclo,
      etapaNombre: rowToEdit.etapa_ref?.nombre,
      muestraNombre: rowToEdit.muestra_ref?.nombre,
      origenNombre: rowToEdit.origen_ref?.nombre,
    };
    setSelectedCatalogoKeys(keys);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Encabezado de Sección */}
      <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
        <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
            <FiClipboard size={24} />
        </div>
        <div>
            <h2 className="text-lg font-bold text-gray-800">Gestión de Datos Generales</h2>
            <p className="text-sm text-gray-500">Seleccione un contexto para editar metadatos o visualizar la matriz completa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Columna Izquierda: Formularios (4 columnas en pantallas grandes) */}
          <div className="lg:col-span-4 space-y-6">
              
              {/* Card 1: Selectores */}
              <div className="bg-surface rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wide mb-4 flex items-center">
                  <FiFilter className="mr-2" /> Contexto
                </h3>
                <IdentificadoresSelectForm
                  onConfirm={handleCatalogoKeysConfirm}
                  onClear={handleCatalogoKeysClear}
                  value={selectedCatalogoKeys}
                  skipValidation={true}
                />
              </div>

              {/* Card 2: Metadatos (Aparece al seleccionar) */}
              {selectedCatalogoKeys && (
                <div className="bg-brand-50/50 rounded-xl border border-brand-100 shadow-sm p-5 animate-in slide-in-from-left-2 duration-300">
                  <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wide mb-4 flex items-center">
                    <FiEdit className="mr-2" /> Editar Metadatos
                  </h3>
                  <MetadataForm
                    keysFromSection={selectedCatalogoKeys}
                    key={selectedCatalogoKeys.id} 
                  />
                </div>
              )}
          </div>

          {/* Columna Derecha: Matriz de Datos (8 columnas) */}
          <div className="lg:col-span-8">
              <div className="bg-surface rounded-xl border border-gray-100 shadow-sm p-5 h-full">
                <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wide mb-4 flex items-center">
                  <FiDatabase className="mr-2" /> Matriz de Datos Consolidados
                </h3>
                <ResumenMatriz onEditClick={handleEditFromMatriz} />
              </div>
          </div>
      </div>
    </div>
  );
}

export default LaboratorioGeneralSection;