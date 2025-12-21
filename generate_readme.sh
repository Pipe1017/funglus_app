#!/bin/bash

echo "📝 Generando README.md completo..."

cat > README.md << 'EOF'
# 🍄 FunglusApp - Sistema de Gestión de Laboratorio

Sistema completo de gestión y análisis de laboratorio para procesamiento de hongos comestibles.

**Stack:** React + FastAPI + PostgreSQL + Docker

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Instalación Rápida](#-instalación-rápida)
- [Configuración](#-configuración)
- [Despliegue en Red Local](#-despliegue-en-red-local)
- [Despliegue en Producción](#-despliegue-en-producción)
- [Acceso a la Base de Datos](#-acceso-a-la-base-de-datos)
- [Migración de Datos](#-migración-de-datos)
- [Comandos Útiles](#-comandos-útiles)
- [Troubleshooting](#-troubleshooting)

---

## 🔧 Requisitos Previos

- **Docker Desktop** ([Descargar](https://www.docker.com/products/docker-desktop))
- **Git** (opcional, para clonar)
- **8GB RAM mínimo** recomendado
- **Puertos disponibles:** 80, 8000, 5432

---

## �� Instalación Rápida

### 1. Clonar el repositorio

\`\`\`bash
git clone https://github.com/TU_USUARIO/funglus_app.git
cd funglus_app
\`\`\`

### 2. Configurar variables de entorno

\`\`\`bash
cp .env.example .env
\`\`\`

Edita \`.env\` con tus valores:

\`\`\`env
POSTGRES_PASSWORD=tu_password_seguro_aqui
VITE_API_URL=http://localhost:8000/api/v1
\`\`\`

### 3. Levantar la aplicación

\`\`\`bash
docker-compose up -d
\`\`\`

### 4. Acceder

- **Frontend:** http://localhost
- **API Docs:** http://localhost:8000/docs
- **Base de Datos:** localhost:5432

---

## ⚙️ Configuración

### Variables de Entorno Clave

Edita el archivo \`.env\`:

\`\`\`env
# Base de Datos
POSTGRES_USER=funglusapp
POSTGRES_PASSWORD=CAMBIAR_ESTO          # ⚠️ IMPORTANTE en producción
POSTGRES_DB=funglusapp

# Backend API URL (ajustar según tu IP)
VITE_API_URL=http://localhost:8000/api/v1

# CORS (ajustar según tu dominio/IP)
BACKEND_CORS_ORIGINS=http://localhost,http://192.168.1.19
\`\`\`

### Obtener tu IP Local

\`\`\`bash
# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
\`\`\`

---

## 🌐 Despliegue en Red Local

Para que otros dispositivos en tu WiFi accedan:

### Paso 1: Obtener IP local
Ejemplo: \`192.168.1.19\`

### Paso 2: Actualizar \`.env\`

\`\`\`env
VITE_API_URL=http://192.168.1.19:8000/api/v1
BACKEND_CORS_ORIGINS=http://192.168.1.19,http://localhost
\`\`\`

### Paso 3: Reconstruir

\`\`\`bash
docker-compose down
docker-compose up --build -d
\`\`\`

### Paso 4: Compartir URL

Otros usuarios acceden a: **http://192.168.1.19**

### Firewall (Solo Mac)

Si no funciona:

\`\`\`bash
# Ver estado del firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Permitir Docker
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /Applications/Docker.app/Contents/MacOS/Docker
\`\`\`

---

## 🏢 Despliegue en Producción

### Opción A: Servidor en Red Local (Empresa)

**En el servidor:**

1. **Instalar Docker**

\`\`\`bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker \$USER
\`\`\`

2. **Clonar repositorio**

\`\`\`bash
git clone https://github.com/TU_USUARIO/funglus_app.git
cd funglus_app
\`\`\`

3. **Configurar \`.env\`**

\`\`\`env
POSTGRES_PASSWORD=PASSWORD_MUY_SEGURO_AQUI
VITE_API_URL=http://IP_DEL_SERVIDOR:8000/api/v1
BACKEND_CORS_ORIGINS=http://IP_DEL_SERVIDOR
\`\`\`

4. **Levantar**

\`\`\`bash
docker-compose up -d
\`\`\`

**Los usuarios acceden a:** \`http://IP_DEL_SERVIDOR\`

---

### Opción B: Con Dominio + SSL (Recomendado)

**Requisitos:**
- Dominio (ej: \`funglusapp.empresa.com\`)
- Certificado SSL

**Configurar \`.env\`:**

\`\`\`env
POSTGRES_PASSWORD=PASSWORD_MUY_SEGURO
VITE_API_URL=https://funglusapp.empresa.com/api/v1
BACKEND_CORS_ORIGINS=https://funglusapp.empresa.com
\`\`\`

**Usar \`docker-compose.prod.yml\`:**

\`\`\`bash
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

**Configurar SSL:**

1. Colocar certificados en carpeta \`ssl/\`
2. Actualizar \`frontend/nginx.conf\` con rutas SSL
3. Reconstruir: \`docker-compose -f docker-compose.prod.yml up --build -d\`

---

## 🗄️ Acceso a la Base de Datos

### Credenciales

\`\`\`
Host: localhost (o IP del servidor)
Port: 5432
Database: funglusapp
Username: funglusapp
Password: [ver .env]
\`\`\`

### Método 1: Terminal (Rápido)

\`\`\`bash
# Conectarse directamente
docker exec -it funglusapp_db psql -U funglusapp -d funglusapp
\`\`\`

**Comandos útiles:**

\`\`\`sql
\dt                              -- Listar tablas
\d tabla                         -- Ver estructura de tabla
SELECT COUNT(*) FROM tabla;      -- Contar registros
\q                               -- Salir
\`\`\`

### Método 2: DBeaver (Recomendado - GUI)

1. **Descargar:** https://dbeaver.io/download/
2. **Nueva Conexión** → PostgreSQL
3. **Configurar:**
   - Host: \`localhost\`
   - Port: \`5432\`
   - Database: \`funglusapp\`
   - Username: \`funglusapp\`
   - Password: \`[tu password del .env]\`
4. **Test Connection** → Finish

### Método 3: pgAdmin (Oficial PostgreSQL)

1. **Descargar:** https://www.pgadmin.org/download/
2. **Add New Server**
3. **Connection:**
   - Host: \`localhost\`
   - Port: \`5432\`
   - Maintenance DB: \`funglusapp\`
   - Username: \`funglusapp\`
   - Password: \`[tu password]\`

### Método 4: String de Conexión

\`\`\`
postgresql://funglusapp:funglusapp123@localhost:5432/funglusapp
\`\`\`

---

## 📊 Migración de Datos

### Desde SQLite a PostgreSQL

**Requisitos:**
- Archivo \`.db\` en \`backend/app/db/\`
- \`psycopg2-binary\` instalado

\`\`\`bash
# Instalar dependencia
pip install psycopg2-binary

# Ejecutar migración
cd backend
export SQLITE_DB_PATH="app/db/tu_archivo.db"
python migrate_sqlite_to_postgres.py
\`\`\`

El script:
- ✅ Detecta automáticamente todas las tablas
- ✅ Migra todos los datos
- ✅ Maneja valores NULL correctamente
- ✅ Resetea secuencias automáticamente

---

## 🛠️ Comandos Útiles

### Docker Compose

\`\`\`bash
# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Reiniciar un servicio
docker-compose restart backend

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA LA BASE DE DATOS)
docker-compose down -v

# Reconstruir un servicio
docker-compose up --build frontend
\`\`\`

### Base de Datos

\`\`\`bash
# Backup de PostgreSQL
docker exec funglusapp_db pg_dump -U funglusapp funglusapp > backup_\$(date +%Y%m%d).sql

# Restaurar backup
cat backup.sql | docker exec -i funglusapp_db psql -U funglusapp -d funglusapp

# Ver tamaño de la base de datos
docker exec -it funglusapp_db psql -U funglusapp -d funglusapp -c "\l+"

# Limpiar logs de PostgreSQL
docker exec -it funglusapp_db sh -c "echo '' > /var/lib/postgresql/data/log/postgresql.log"
\`\`\`

### Verificar Conexiones

\`\`\`bash
# Ver qué puertos están en uso
lsof -i :80
lsof -i :8000
lsof -i :5432

# Probar conectividad al backend
curl -I http://localhost:8000/docs

# Probar conectividad al frontend
curl -I http://localhost
\`\`\`

---

## 🐛 Troubleshooting

### Error: "Puerto 80 ya en uso"

\`\`\`bash
# Ver qué usa el puerto
lsof -i :80

# Detener el proceso
sudo kill -9 PID

# O usar otro puerto en docker-compose.yml
ports:
  - "8080:80"  # Cambiar a 8080
\`\`\`

### Error: "Cannot connect to Docker daemon"

\`\`\`bash
# Iniciar Docker Desktop
open -a Docker

# Verificar que Docker está corriendo
docker ps
\`\`\`

### Frontend no carga

\`\`\`bash
# Ver logs del frontend
docker-compose logs frontend

# Reconstruir frontend
docker-compose up --build frontend

# Verificar nginx.conf
docker exec funglusapp_frontend cat /etc/nginx/conf.d/default.conf
\`\`\`

### Backend no responde

\`\`\`bash
# Ver logs del backend
docker-compose logs backend

# Verificar que PostgreSQL está corriendo
docker-compose ps db

# Reiniciar backend
docker-compose restart backend
\`\`\`

### Base de datos no inicia

\`\`\`bash
# Ver logs
docker-compose logs db

# Verificar espacio en disco
df -h

# Resetear PostgreSQL (⚠️ BORRA DATOS)
docker-compose down -v
docker volume rm funglus_app_postgres_data
docker-compose up -d
\`\`\`

### CORS Error en el navegador

1. Verificar \`BACKEND_CORS_ORIGINS\` en \`.env\`
2. Debe incluir la URL desde donde accedes
3. Reconstruir backend: \`docker-compose up --build backend\`

### Datos no se ven en la aplicación

\`\`\`bash
# Verificar que hay datos en PostgreSQL
docker exec -it funglusapp_db psql -U funglusapp -d funglusapp -c "SELECT COUNT(*) FROM datos_generales_laboratorio;"

# Verificar conexión backend-database
docker-compose logs backend | grep "Conexión a la base de datos"
\`\`\`

---

## 📁 Estructura del Proyecto

\`\`\`
funglus_app/
├── backend/
│   ├── app/
│   │   ├── main.py              # Entrada de FastAPI
│   │   ├── core/
│   │   │   └── config.py        # Configuración y CORS
│   │   ├── db/
│   │   │   ├── database.py      # Conexión a PostgreSQL
│   │   │   └── models.py        # Modelos SQLAlchemy
│   │   ├── routers/             # Endpoints de la API
│   │   ├── schemas/             # Esquemas Pydantic
│   │   └── crud/                # Operaciones CRUD
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── wait_for_db.py           # Script espera PostgreSQL
│   └── migrate_sqlite_to_postgres.py
├── frontend/
│   ├── src/
│   │   ├── main.jsx             # Entrada React
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── config/
│   │       └── api.js           # Configuración API
│   ├── Dockerfile
│   ├── nginx.conf               # Configuración Nginx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.cjs
├── docker-compose.yml           # Desarrollo
├── docker-compose.prod.yml      # Producción
├── .env.example                 # Plantilla de variables
├── .gitignore
└── README.md
\`\`\`

---

## 🔐 Seguridad

### Antes de Producción

- [ ] Cambiar \`POSTGRES_PASSWORD\` a contraseña fuerte
- [ ] Especificar dominios exactos en \`BACKEND_CORS_ORIGINS\` (eliminar \`*\`)
- [ ] Configurar SSL/HTTPS
- [ ] No exponer puerto 5432 a internet
- [ ] Hacer backups regulares
- [ ] Actualizar dependencias

### Ejemplo de Password Seguro

\`\`\`bash
# Generar password aleatorio
openssl rand -base64 32
\`\`\`

---

## 📝 Notas Adicionales

### Puertos Utilizados

- **80**: Frontend (Nginx)
- **8000**: Backend (FastAPI)
- **5432**: PostgreSQL

### Persistencia de Datos

Los datos de PostgreSQL se guardan en el volumen Docker \`postgres_data\`.
Para borrar datos: \`docker-compose down -v\`

### Actualizaciones

\`\`\`bash
# Actualizar código
git pull

# Reconstruir contenedores
docker-compose up --build -d
\`\`\`

---

## 👥 Soporte

Para problemas o preguntas:
1. Revisar la sección [Troubleshooting](#-troubleshooting)
2. Ver logs: \`docker-compose logs -f\`
3. Abrir un issue en GitHub

---

## 📄 Licencia

[Especificar licencia]

---

## ✅ Checklist de Instalación

- [ ] Docker Desktop instalado y corriendo
- [ ] Repositorio clonado
- [ ] Archivo \`.env\` creado y configurado
- [ ] IP local obtenida (si red local)
- [ ] \`docker-compose up -d\` ejecutado exitosamente
- [ ] Frontend accesible en http://localhost
- [ ] Backend accesible en http://localhost:8000/docs
- [ ] Datos migrados (si aplica)
- [ ] Backup de base de datos creado

---

**¡Listo para usar! 🚀**
EOF

echo "✅ README.md creado exitosamente!"
