// src/renderer/src/config/metadataFormFields.js
export const allPossibleMetadataFields = {
  fecha_ingreso: { label: 'Fecha Ingreso', type: 'date' },
  fecha_procesamiento: { label: 'Fecha Procesamiento', type: 'date' },
  peso_h1_g: { label: 'Peso H1 (g)', type: 'number', step: 'any' },
  peso_h2_g: { label: 'Peso H2 (g)', type: 'number', step: 'any' },
  humedad_1_porc: { label: 'Humedad 1 (%)', type: 'number', step: 'any' },
  humedad_2_porc: { label: 'Humedad 2 (%)', type: 'number', step: 'any' },
  // humedad_prom_porc es calculado
  peso_ph_g: { label: 'Peso pH (g)', type: 'number', step: 'any' },
  ph_valor: { label: 'Valor PH', type: 'number', step: 'any' },
  fdr_1_kgf: { label: 'FDR 1 (Kgf)', type: 'number', step: 'any' },
  fdr_2_kgf: { label: 'FDR 2 (Kgf)', type: 'number', step: 'any' },
  fdr_3_kgf: { label: 'FDR 3 (Kgf)', type: 'number', step: 'any' },
  // fdr_prom_kgf es calculado

  // Campos de resumen que el backend podría actualizar desde otras tablas.
  // No son para entrada directa aquí, pero los podrías listar para verlos.
  // resultado_cenizas_porc: { label: 'Resultado Cenizas (%)', type: 'number', readOnly: true },
  // resultado_nitrogeno_total_porc: { label: 'Resultado N Total (%)', type: 'number', readOnly: true },
  // resultado_nitrogeno_seca_porc: { label: 'Resultado N Base Seca (%)', type: 'number', readOnly: true },

  // Ejemplo de otros campos que podrías tener:
  // temperatura_max: { label: 'Temperatura Máx (°C)', type: 'number', step: 'any' },
  observaciones_generales: { label: 'Observaciones Generales', type: 'textarea', rows: 3 }
  // ...AÑADE AQUÍ TODOS TUS CAMPOS DE METADATOS DE LA TABLA DatosGeneralesLaboratorio...
  // Recuerda que los nombres aquí (ej. 'fecha_ingreso') deben coincidir
  // con las propiedades del objeto que el backend devuelve y espera.
}

// Ya no necesitamos metadataFormConfigByEtapa para mostrar/ocultar campos,
// pero lo podrías usar para definir cuáles son *obligatorios* por etapa si quieres validación.
export const metadataFormConfigByEtapa = {
  default: {
    label: 'Datos Generales'
    // Podrías definir aquí qué campos de 'allPossibleMetadataFields' son obligatorios
    // para la validación con Formik más adelante.
    // Ejemplo: required: ['fecha_ingreso']
  }
  // ...podrías tener configs por etapa si algunos campos son obligatorios solo para ciertas etapas
}
