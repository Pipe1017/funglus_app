import React, { useState, useCallback } from 'react';
import { FiEdit, FiFilter, FiDatabase, FiClipboard } from 'react-icons/fi';
import IdentificadoresSelectForm from '../../components/laboratorio/general/IdentificadoresSelectForm';
import MetadataForm from '../../components/laboratorio/general/MetadataForm';
import ResumenMatriz from '../../components/laboratorio/general/ResumenMatriz';

function LaboratorioGeneralSection() {
  // Este estado ahora es la "fuente de la verdad" para la selección activa
  const [selectedCatalogoKeys, setSelectedCatalogoKeys] = useState(null);

  const handleCatalogoKeysConfirm = useCallback((keys) => {
    console.log('LaboratorioGeneralSection: Combinación de claves confirmada desde formulario:', keys);
    setSelectedCatalogoKeys(keys);
  }, []);

  const handleCatalogoKeysClear = useCallback(() => {
    console.log('LaboratorioGeneralSection: Selección de identificadores limpiada.');
    setSelectedCatalogoKeys(null);
  }, []);
  
  // --- NUEVA FUNCIÓN PARA MANEJAR EL CLIC DE "EDITAR" DESDE LA MATRIZ ---
  const handleEditFromMatriz = useCallback((rowToEdit) => {
    console.log('LaboratorioGeneralSection: Editar fila desde matriz:', rowToEdit);
    // Extraer las claves y nombres del objeto 'row' de la matriz
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
    // Actualizar el estado central. Esto hará que tanto IdentificadoresSelectForm
    // como MetadataForm se actualicen con estos datos.
    setSelectedCatalogoKeys(keys);
    // Opcional: Hacer scroll hacia arriba para ver el formulario de edición
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);


  return (
    <div className="space-y-6 p-1">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <FiClipboard className="mr-3 text-purple-600" size={24} />
        Gestión de Datos Generales de Laboratorio
      </h2>

      {/* Sección 1: Selección de Identificadores de Catálogo */}
      <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
        <h3 className="text-md font-semibold text-gray-600 mb-3 border-b pb-2">
          <FiFilter className="inline mr-2 mb-1" />
          1. Seleccione o Verifique el Contexto del Catálogo
        </h3>
        <IdentificadoresSelectForm
          onConfirm={handleCatalogoKeysConfirm}
          onClear={handleCatalogoKeysClear}
          value={selectedCatalogoKeys} // Pasamos el estado para controlar los selectores
          skipValidation={true}
        />
      </div>

      {/* Sección 2: Formulario de Metadatos */}
      {selectedCatalogoKeys && (
        <div className="p-4 bg-white rounded-lg shadow border border-gray-200 mt-4">
          <h3 className="text-md font-semibold text-gray-600 mb-3 border-b pb-2">
            <FiEdit className="inline mr-2 mb-1" />
            2. Editar Metadatos para la Selección Actual
          </h3>
          <MetadataForm
            keysFromSection={selectedCatalogoKeys}
            // --- ¡LÍNEA MODIFICADA! ---
            key={selectedCatalogoKeys.id} // Forza el re-montaje del componente con el ID de la fila
          />
        </div>
      )}

      {/* Sección 3: Resumen de la Matriz General */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow border border-gray-200">
        <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
          <FiDatabase className="inline mr-2 mb-1" />
          3. Resumen de la Tabla General
        </h3>
        <ResumenMatriz onEditClick={handleEditFromMatriz} /> {/* Pasamos la nueva función como prop */}
      </div>
    </div>
  );
}

export default LaboratorioGeneralSection;
