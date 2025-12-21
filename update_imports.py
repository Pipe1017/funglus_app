#!/usr/bin/env python3
import os
import re

files = [
    "frontend/src/contexts/CicloContext.jsx",
    "frontend/src/components/procesamiento/CiclosProcesamientoCenizasManager.jsx",
    "frontend/src/components/procesamiento/CiclosProcesamientoManager.jsx",
    "frontend/src/components/procesamiento/CiclosProcesamientoNitrogenoManager.jsx",
    "frontend/src/components/informes/InformeResumen.jsx",
    "frontend/src/components/informes/InformeHistorico.jsx",
    "frontend/src/components/catalogos/OrigenesManager.jsx",
    "frontend/src/components/catalogos/EtapasManager.jsx",
    "frontend/src/components/catalogos/SecuenciasManager.jsx",
    "frontend/src/components/catalogos/CiclosManager.jsx",
    "frontend/src/components/catalogos/MuestrasManager.jsx",
    "frontend/src/components/laboratorio/general/MetadataForm.jsx",
    "frontend/src/components/laboratorio/general/ResumenMatriz.jsx",
    "frontend/src/components/laboratorio/general/IdentificadoresSelectForm.jsx",
    "frontend/src/pages/laboratorio_main_sections/CenizasSection.jsx",
    "frontend/src/pages/laboratorio_main_sections/NitrogenoSection.jsx",
]

def get_relative_path(file_path):
    """Calcula la ruta relativa correcta para importar config/api.js"""
    depth = file_path.count('/') - 2  # -2 porque empezamos desde frontend/src/
    return '../' * depth + 'config/api'

for file_path in files:
    if not os.path.exists(file_path):
        print(f"⚠️  Archivo no encontrado: {file_path}")
        continue
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Verificar si ya tiene el import
    if 'from' in content and 'config/api' in content:
        print(f"✓ Ya actualizado: {file_path}")
        continue
    
    # Calcular ruta relativa
    relative_path = get_relative_path(file_path)
    import_statement = f"import {{ API_BASE_URL }} from '{relative_path}'\n"
    
    # Agregar import después del último import de React/componentes
    lines = content.split('\n')
    last_import_index = 0
    for i, line in enumerate(lines):
        if line.strip().startswith('import '):
            last_import_index = i
    
    # Insertar el import
    lines.insert(last_import_index + 1, import_statement)
    
    # Reemplazar la URL hardcodeada
    new_content = '\n'.join(lines)
    new_content = new_content.replace(
        "const FASTAPI_BASE_URL = 'http://localhost:8000/api/v1'",
        "const FASTAPI_BASE_URL = API_BASE_URL"
    )
    new_content = new_content.replace(
        'apiEndpoint="http://localhost:8000/api/v1/catalogos/secuencias"',
        'apiEndpoint={`${API_BASE_URL}/catalogos/secuencias`}'
    )
    
    with open(file_path, 'w') as f:
        f.write(new_content)
    
    print(f"✅ Actualizado: {file_path}")

print("\n🎉 ¡Todos los archivos actualizados!")
