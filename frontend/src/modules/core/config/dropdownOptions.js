// src/renderer/src/config/dropdownOptions.js
// Este archivo ahora es menos crucial si IdentificadoresSelectForm carga
// todas las Etapas, Muestras y Origenes directamente del backend
// y no implementamos filtrado jerárquico complejo aquí.
// Sin embargo, lo mantenemos por si se necesita lógica específica de opciones por etapa en el futuro.

export const materiaPrimaMuestraOptionsForConfig = [
  // Ejemplo, podría no usarse si cargamos todo
  { value: '', label: '-- Selecciona Muestra (MP) --' },
  { value: 'TAMO', label: 'Tamo' }, // Estos 'value' son NOMBRES, necesitaríamos mapearlos a IDs
  { value: 'CASCARILLA', label: 'Cascarilla' }
  // ...
]

// Podríamos tener un objeto que defina si Muestra u Origen son obligatorios para una etapa,
// pero la obligatoriedad principal la definirá el usuario al interactuar con los selectores.
// El backend espera IDs, y si un selector se deja en "-- Selecciona --" (value=''),
// enviaremos null para ese ID.

export const etapaRequiresMuestra = (etapaNameKey) => {
  // Define aquí qué etapas SIEMPRE requieren una Muestra (no puede ser N/A)
  // Por defecto, asumimos que puede ser N/A (no seleccionada)
  const etapasQueRequierenMuestra = ['materia_prima', 'formulacion'] // Ejemplo
  return etapasQueRequierenMuestra.includes(etapaNameKey)
}

export const etapaRequiresOrigen = (etapaNameKey) => {
  // Define aquí qué etapas SIEMPRE requieren un Origen
  const etapasQueRequierenOrigen = ['materia_prima', 'gubys', 'tamo_humedo'] // Ejemplo
  return etapasQueRequierenOrigen.includes(etapaNameKey)
}
