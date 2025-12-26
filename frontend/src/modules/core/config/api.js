// Detectar si estamos en desarrollo o producción
// Para red local, usar la IP del servidor
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     (window.location.hostname === 'localhost' 
                       ? 'http://localhost:8000/api/v1' 
                       : `http://${window.location.hostname}:8000/api/v1`)

export { API_BASE_URL }
