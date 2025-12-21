#!/bin/bash

files=(
  "frontend/src/components/procesamiento/CiclosProcesamientoCenizasManager.jsx"
  "frontend/src/components/procesamiento/CiclosProcesamientoManager.jsx"
  "frontend/src/components/procesamiento/CiclosProcesamientoNitrogenoManager.jsx"
)

for file in "${files[@]}"; do
  echo "🔧 Arreglando: $file"
  
  # Usar sed para eliminar la línea duplicada "import { API_BASE_URL"
  # que aparece justo después de "import {"
  sed -i '' '/^import {$/,/^} from/ {
    /^import { API_BASE_URL/d
  }' "$file"
  
  # Agregar el import correcto después de los imports de react-icons
  # Buscar la línea que cierra el import de react-icons y agregar después
  sed -i '' "/} from 'react-icons\/fi'/a\\
import { API_BASE_URL } from '../../config/api'
" "$file"
  
  echo "  ✅ Arreglado"
done

echo ""
echo "🎉 Todos los archivos arreglados"
