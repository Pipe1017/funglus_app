#!/usr/bin/env python3
import re

files = [
    "frontend/src/components/procesamiento/CiclosProcesamientoCenizasManager.jsx",
    "frontend/src/components/procesamiento/CiclosProcesamientoManager.jsx",
    "frontend/src/components/procesamiento/CiclosProcesamientoNitrogenoManager.jsx"
]

for filepath in files:
    print(f"🔧 Procesando: {filepath}")
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Contar cuántas veces aparece el import de API_BASE_URL
    api_import_pattern = r"import\s*{\s*API_BASE_URL\s*}\s*from\s*['\"].*config/api['\"]"
    matches = list(re.finditer(api_import_pattern, content))
    
    if len(matches) > 1:
        print(f"  ⚠️  Encontrados {len(matches)} imports duplicados de API_BASE_URL")
        
        # Eliminar todos los imports de API_BASE_URL
        content_cleaned = re.sub(api_import_pattern + r'\s*\n?', '', content)
        
        # Encontrar dónde termina el último import (después de react-icons)
        react_icons_import = re.search(r"}\s*from\s*['\"]react-icons/fi['\"]", content_cleaned)
        
        if react_icons_import:
            insert_pos = react_icons_import.end()
            # Insertar el import de API_BASE_URL una sola vez
            content_final = (
                content_cleaned[:insert_pos] + 
                "\nimport { API_BASE_URL } from '../../config/api'" +
                content_cleaned[insert_pos:]
            )
            
            with open(filepath, 'w') as f:
                f.write(content_final)
            
            print(f"  ✅ Arreglado - import unificado\n")
        else:
            print(f"  ❌ No se encontró el import de react-icons\n")
    else:
        print(f"  ✓ No hay duplicados\n")

print("🎉 Proceso completado!")
