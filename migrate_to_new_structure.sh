#!/bin/bash

echo "�� Iniciando migración de estructura..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Crear nueva estructura
echo -e "${BLUE}📁 Creando nueva estructura de carpetas...${NC}"
mkdir -p backend frontend

# 2. Migrar Backend
echo -e "${BLUE}📦 Migrando backend...${NC}"
cp -r backend_funglusapp/app backend/
cp backend_funglusapp/Dockerfile backend/
cp backend_funglusapp/requirements.txt backend/
cp backend_funglusapp/wait_for_db.py backend/
cp backend_funglusapp/migrate_sqlite_to_postgres.py backend/

echo -e "${GREEN}✅ Backend migrado${NC}"

# 3. Migrar Frontend (sin Electron)
echo -e "${BLUE}📦 Migrando frontend...${NC}"

# Verificar si existe src/renderer/src (estructura Electron)
if [ -d "frontend_funglusapp/src/renderer/src" ]; then
    echo -e "${YELLOW}Estructura Electron detectada, extrayendo código React...${NC}"
    cp -r frontend_funglusapp/src/renderer/src frontend/src
    cp -r frontend_funglusapp/src/renderer/assets frontend/src/ 2>/dev/null || true
else
    # Si ya está en estructura simple
    cp -r frontend_funglusapp/src frontend/src
fi

# Copiar archivos de configuración necesarios
cp frontend_funglusapp/index.html frontend/
cp frontend_funglusapp/package.json frontend/
cp frontend_funglusapp/tailwind.config.js frontend/
cp frontend_funglusapp/postcss.config.js frontend/
cp frontend_funglusapp/Dockerfile frontend/
cp frontend_funglusapp/nginx.conf frontend/
cp frontend_funglusapp/vite.config.js frontend/

# Copiar .gitignore si existe
cp frontend_funglusapp/.gitignore frontend/ 2>/dev/null || true

echo -e "${GREEN}✅ Frontend migrado${NC}"

# 4. Actualizar package.json del frontend (quitar Electron)
echo -e "${BLUE}🔧 Actualizando package.json (eliminando Electron)...${NC}"
cat > frontend/package.json << 'PACKAGE_JSON'
{
  "name": "funglusapp-frontend",
  "version": "0.2.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "react-icons": "^4.12.0",
    "recharts": "^2.10.3",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
PACKAGE_JSON

echo -e "${GREEN}✅ package.json actualizado${NC}"

# 5. Actualizar index.html
echo -e "${BLUE}🔧 Actualizando index.html...${NC}"
cat > frontend/index.html << 'INDEX_HTML'
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FunglusApp</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
INDEX_HTML

echo -e "${GREEN}✅ index.html actualizado${NC}"

# 6. Crear main.jsx para React puro
echo -e "${BLUE}🔧 Creando main.jsx...${NC}"
cat > frontend/src/main.jsx << 'MAIN_JSX'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/main.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
MAIN_JSX

echo -e "${GREEN}✅ main.jsx creado${NC}"

# 7. Crear archivo de configuración API
echo -e "${BLUE}🔧 Creando configuración de API...${NC}"
mkdir -p frontend/src/config
cat > frontend/src/config/api.js << 'API_CONFIG'
// Detectar si estamos en desarrollo o producción
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export { API_BASE_URL }
API_CONFIG

echo -e "${GREEN}✅ Configuración de API creada${NC}"

# 8. Actualizar backend/app/core/config.py
echo -e "${BLUE}🔧 Actualizando config.py del backend...${NC}"
cat > backend/app/core/config.py << 'CONFIG_PY'
import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "FunglusApp Backend"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://funglusapp:funglusapp123@db:5432/funglusapp"
    )
    
    # CORS
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:5173",  # Vite dev
        "http://localhost:3000",  # React dev
        "http://localhost",
        "http://localhost:8080",  # Frontend en producción
    ]
    
    class Config:
        case_sensitive = True

settings = Settings()
CONFIG_PY

echo -e "${GREEN}✅ config.py actualizado${NC}"

# 9. Actualizar vite.config.js
echo -e "${BLUE}🔧 Actualizando vite.config.js...${NC}"
cat > frontend/vite.config.js << 'VITE_CONFIG'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
VITE_CONFIG

echo -e "${GREEN}✅ vite.config.js actualizado${NC}"

# 10. Actualizar requirements.txt del backend
echo -e "${BLUE}🔧 Actualizando requirements.txt...${NC}"
cat > backend/requirements.txt << 'REQUIREMENTS'
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
pydantic-settings==2.1.0
python-multipart==0.0.6
psycopg2-binary==2.9.9
alembic==1.13.0
python-dotenv==1.0.0
REQUIREMENTS

echo -e "${GREEN}✅ requirements.txt actualizado${NC}"

echo ""
echo -e "${GREEN}🎉 ¡Migración completada!${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos pasos:${NC}"
echo "1. Revisar las carpetas 'backend/' y 'frontend/'"
echo "2. Ejecutar: cd frontend && npm install"
echo "3. Actualizar imports en componentes React que usen el API"
echo "4. Verificar docker-compose.yml"
echo "5. Ejecutar: docker-compose up --build"
echo ""
echo -e "${BLUE}💡 Las carpetas originales (backend_funglusapp y frontend_funglusapp) NO se eliminaron por seguridad${NC}"
echo ""
