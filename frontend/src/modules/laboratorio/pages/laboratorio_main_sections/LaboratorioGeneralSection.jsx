// Ubicación: frontend/src/modules/laboratorio/pages/laboratorio_main_sections/LaboratorioGeneralSection.jsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiEdit, FiFilter, FiDatabase, FiClipboard } from 'react-icons/fi';
// Asegúrate de que estas rutas de importación sean correctas
import IdentificadoresSelectForm from '../../components/laboratorio/general/IdentificadoresSelectForm';
import MetadataForm from '../../components/laboratorio/general/MetadataForm';
import ResumenMatriz from '../../components/laboratorio/general/ResumenMatriz';

function LaboratorioGeneralSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCatalogoKeys, setSelectedCatalogoKeys] = useState(null);
  const [initialCicloId, setInitialCicloId] = useState(null);
  const matrizRef = useRef(null);

  // Leer parámetro ciclo_id de URL
  useEffect(() => {
    const cicloParam = searchParams.get('ciclo');
    if (cicloParam) {
      setInitialCicloId(parseInt(cicloParam));
      // Scroll a la tabla después de un momento
      setTimeout(() => {
        matrizRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
      setSearchParams({}); // Limpiar URL
    }
  }, [searchParams, setSearchParams]);

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
      
      {/* Encabezado */}
      <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
        <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
            <FiClipboard size={24} />
        </div>
        <div>
            <h2 className="text-lg font-bold text-gray-800">Gestión de Datos Generales</h2>
            <p className="text-sm text-gray-500">Vista consolidada y edición de metadatos.</p>
        </div>
      </div>

      {/* Contenedor Vertical Minimalista */}
      <div className="flex flex-col space-y-6">
          
          {/* Bloque 1: Selección de Contexto */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <FiFilter /> Contexto de Trabajo
            </h3>
            <IdentificadoresSelectForm
              onConfirm={handleCatalogoKeysConfirm}
              onClear={handleCatalogoKeysClear}
              value={selectedCatalogoKeys}
              skipValidation={true} // Permitimos seleccionar sin que exista registro previo para poder crearlo
            />
          </section>

          {/* Bloque 2: Formulario de Metadatos (Solo visible si hay selección) */}
          {selectedCatalogoKeys && (
            <section className="bg-brand-50/30 rounded-xl border border-brand-200 p-5 shadow-sm border-l-4 border-l-brand-500 animate-in slide-in-from-top-4">
              <h3 className="text-sm font-bold text-brand-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FiEdit /> Editar Información General
              </h3>
              <MetadataForm
                keysFromSection={selectedCatalogoKeys}
                key={selectedCatalogoKeys.id || 'new'} 
              />
            </section>
          )}

          {/* Bloque 3: Matriz de Datos (Tabla Completa) */}
          <section ref={matrizRef} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <FiDatabase /> Matriz de Datos Consolidados
            </h3>
            <ResumenMatriz onEditClick={handleEditFromMatriz} initialCicloId={initialCicloId} />
          </section>

      </div>
    </div>
  );
}

export default LaboratorioGeneralSection;