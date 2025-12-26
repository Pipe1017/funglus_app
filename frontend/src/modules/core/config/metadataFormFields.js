// src/renderer/src/config/metadataFormFields.js

// Define todos los campos de metadatos posibles que el formulario podría manejar.
// El formulario 'MetadataForm.jsx' renderizará todos los campos listados aquí.
export const allPossibleMetadataFields = {
  fecha_ingreso: { label: 'Fecha Ingreso', type: 'date' },
  fecha_procesamiento: { label: 'Fecha Procesamiento', type: 'date' },
  peso_h1_g: { label: 'Peso H1 (g)', type: 'number', step: 'any' },
  peso_h2_g: { label: 'Peso H2 (g)', type: 'number', step: 'any' },
  humedad_1_porc: { label: 'Humedad 1 (%)', type: 'number', step: 'any' },
  humedad_2_porc: { label: 'Humedad 2 (%)', type: 'number', step: 'any' },
  // humedad_prom_porc es calculado en el backend y se muestra en la sección de solo lectura.
  peso_ph_g: { label: 'Peso pH (g)', type: 'number', step: 'any' },
  ph_valor: { label: 'Valor pH', type: 'number', step: 'any' },
  fdr_1_kgf: { label: 'FDR 1 (Kgf)', type: 'number', step: 'any' },
  fdr_2_kgf: { label: 'FDR 2 (Kgf)', type: 'number', step: 'any' },
  fdr_3_kgf: { label: 'FDR 3 (Kgf)', type: 'number', step: 'any' }
  // Se eliminó: observaciones_generales: { label: 'Observaciones Generales', type: 'textarea', rows: 3 }
}

// Configuración adicional por etapa (actualmente no muy utilizada si todos los campos son globales).
// Podría usarse en el futuro para variar campos o su obligatoriedad por etapa.
export const metadataFormConfigByEtapa = {
  default: {
    label: 'Datos Generales'
    // Si quisieras campos específicos por etapa, podrías definirlos aquí.
    // Ejemplo: 'materia_prima': ['fecha_ingreso', 'peso_h1_g', ...]
  }
}
