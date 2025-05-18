// src/renderer/src/config/dropdownOptions.js

export const materiaPrimaOptions = {
  muestra: [
    { value: '', label: '-- Selecciona Muestra MP --' },
    { value: 'TAMO', label: 'Tamo' },
    { value: 'CASCARILLA', label: 'Cascarilla' },
    { value: 'GALLINAZA', label: 'Gallinaza' },
    { value: 'BAGAZO', label: 'Bagazo' }
  ],
  origen: {
    // Las opciones de origen dependen de la muestra seleccionada
    TAMO: [
      { value: '', label: '-- Origen para Tamo --' },
      { value: 'BODEGA', label: 'Bodega' },
      { value: 'CAMION1', label: 'Camión 1' },
      { value: 'CAMION2', label: 'Camión 2' },
      { value: 'CAMION3', label: 'Camión 3' },
      { value: 'CAMION4', label: 'Camión 4' }
    ],
    CASCARILLA: [
      { value: '', label: '-- Origen para Cascarilla --' },
      { value: 'BODEGA', label: 'Bodega' },
      { value: 'CAMION1', label: 'Camión 1' }
    ],
    GALLINAZA: [
      { value: '', label: '-- Origen para Gallinaza --' },
      { value: 'BODEGA', label: 'Bodega' },
      { value: 'CAMION1', label: 'Camión 1' },
      { value: 'CAMION2', label: 'Camión 2' }
    ],
    BAGAZO: [
      { value: '', label: '-- Origen para Bagazo --' },
      { value: 'BODEGA', label: 'Bodega' },
      { value: 'CARMEN', label: 'Carmen' },
      { value: 'YALI', label: 'Yali' },
      { value: 'S.C', label: 'S.C' }
    ],
    DEFAULT: [{ value: '', label: '-- Selecciona muestra primero --' }] // Opciones por defecto si no hay muestra
  }
}

export const tamoHumedoOptions = {
  origen: [
    { value: '', label: '-- Origen Tamo Húmedo --' },
    { value: 'VOLTEO1', label: 'Volteo 1' },
    { value: 'VOLTEO2', label: 'Volteo 2' },
    { value: 'VOLTEO3', label: 'Volteo 3' },
    { value: 'VOLTEO4', label: 'Volteo 4' }
  ]
  // No tiene 'muestra' como desplegable según tu descripción
}

export const gubysOptions = {
  origen: [
    { value: '', label: '-- Origen Gubys --' },
    { value: 'ENTRADA', label: 'Entrada' },
    { value: 'SALIDA', label: 'Salida' }
  ]
  // No tiene 'muestra' como desplegable según tu descripción
}
// NUEVA SECCIÓN PARA FORMULACION
export const formulacionOptions = {
  muestra: [
    // 'muestra' es clave para Formulacion
    { value: '', label: '-- Selecciona Muestra Formulación --' },
    { value: 'Lote A', label: 'Lote A Formulación' },
    { value: 'Lote B', label: 'Lote B Formulación' },
    { value: 'Estándar', label: 'Estándar Formulación' }
  ],
  origen: [
    // 'origen' es un campo de datos para Formulacion, no clave
    { value: '', label: '-- Origen Formulación --' },
    { value: 'MP Combinada', label: 'MP Combinada' },
    { value: 'Proceso Interno', label: 'Proceso Interno' }
  ]
}

export const etapaDropdownOptions = {
  materia_prima: materiaPrimaOptions,
  tamo_humedo: tamoHumedoOptions,
  gubys: gubysOptions,
  formulacion: formulacionOptions // <--- AÑADIDO
}
