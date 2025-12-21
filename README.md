# 🍄 FunglusApp

Sistema de gestión y análisis de laboratorio para procesamiento de hongos comestibles.

## 🚀 Stack Tecnológico

- **Frontend**: React + Vite + Tailwind CSS + Nginx
- **Backend**: FastAPI + Python
- **Base de Datos**: PostgreSQL
- **Containerización**: Docker + Docker Compose

## 📋 Prerrequisitos

- Docker Desktop instalado ([Descargar](https://www.docker.com/products/docker-desktop))
- Git instalado
- Conexión a internet (primera vez para descargar imágenes)

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/funglus_app.git
cd funglus_app
```

### 2. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores
# IMPORTANTE: Cambiar POSTGRES_PASSWORD en producción
nano .env  # o vim, code, etc.
```

### 3. Ajustar configuración de red

En el archivo `.env`, actualiza:
```env
# Para red local, cambia a tu IP
VITE_API_URL=http://TU_IP_LOCAL:8000/api/v1
BACKEND_CORS_ORIGINS=http://TU_IP_LOCAL,http://localhost
```

Para obtener tu IP local:
- **Mac/Linux**: `ifconfig | grep "inet "`
- **Windows**: `ipconfig`

### 4. Levantar la aplicación
```bash
# Construir y levantar todos los servicios
docker-compose up --build -d

# Ver logs
docker-compose logs -f
```

### 5. Acceder a la aplicación

- **Frontend**: http://localhost o http://TU_IP_LOCAL
- **Backend API Docs**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432

## 📊 Migración de datos desde SQLite

Si tienes datos en SQLite que quieres migrar:
```bash
# 1. Colocar archivo .db en backend/app/db/
# 2. Instalar psycopg2
pip install psycopg2-binary

# 3. Ejecutar migración
cd backend
export SQLITE_DB_PATH="app/db/TU_ARCHIVO.db"
python migrate_sqlite_to_postgres.py
```

## 🌐 Despliegue en Red Local

### Para que otros accedan desde tu red WiFi:

1. **Obtener tu IP local** (ej: 192.168.1.19)
2. **Actualizar .env**:
```env
   VITE_API_URL=http://192.168.1.19:8000/api/v1
   BACKEND_CORS_ORIGINS=http://192.168.1.19,http://localhost
```
3. **Reconstruir**:
```bash
   docker-compose down
   docker-compose up --build -d
```
4. **Compartir URL**: http://192.168.1.19

### Firewall (Mac)

Si otros no pueden acceder:
```bash
# Ver estado
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Permitir Docker
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /Applications/Docker.app/Contents/MacOS/Docker
```

## 🏢 Despliegue en Producción

### Opción A: Servidor en red local de empresa

1. **En el servidor**, clonar repo e instalar Docker
2. **Actualizar .env** con IP del servidor:
```env
   POSTGRES_PASSWORD=PASSWORD_SEGURO_AQUI
   VITE_API_URL=http://IP_SERVIDOR:8000/api/v1
   BACKEND_CORS_ORIGINS=http://IP_SERVIDOR
```
3. **Levantar**:
```bash
   docker-compose up -d
```

### Opción B: Con dominio (recomendado)

1. **Configurar DNS** interno (ej: funglusapp.empresa.local)
2. **Actualizar .env**:
```env
   POSTGRES_PASSWORD=PASSWORD_SEGURO_AQUI
   VITE_API_URL=https://funglusapp.empresa.local/api/v1
   BACKEND_CORS_ORIGINS=https://funglusapp.empresa.local
```
3. **Configurar SSL** con Let's Encrypt o certificado interno
4. **Usar docker-compose.prod.yml** (crear según necesidades)

## 📝 Comandos Útiles
```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs
docker-compose logs -f

# Reiniciar un servicio
docker-compose restart backend

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA LA BASE DE DATOS)
docker-compose down -v

# Backup de base de datos
docker exec funglusapp_db pg_dump -U funglusapp funglusapp > backup_$(date +%Y%m%d).sql

# Restaurar backup
cat backup.sql | docker exec -i funglusapp_db psql -U funglusapp -d funglusapp
```

## 🔧 Troubleshooting

### El frontend no carga
```bash
# Verificar logs
docker-compose logs frontend

# Reconstruir
docker-compose up --build frontend
```

### Error de conexión al backend

1. Verificar que el backend esté corriendo: `docker-compose ps`
2. Verificar URL en `.env`: debe coincidir con tu IP/dominio
3. Verificar CORS en `backend/app/core/config.py`

### Puerto 8000 ya en uso
```bash
# Ver qué usa el puerto
lsof -i :8000

# Matar proceso
kill -9 PID
```

### PostgreSQL no inicia
```bash
# Ver logs
docker-compose logs db

# Resetear volumen (⚠️ BORRA DATOS)
docker-compose down -v
docker-compose up -d
```

## 📁 Estructura del Proyecto
```
funglus_app/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   ├── crud/
│   │   ├── db/
│   │   ├── routers/
│   │   └── schemas/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── wait_for_db.py
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

[Especificar licencia]

## 👥 Autor

Felipe Ruiz Zea - [GitHub](https://github.com/TU_USUARIO)

## 🙏 Agradecimientos

- Proyecto desarrollado para gestión de laboratorio
- Stack: React, FastAPI, PostgreSQL, Docker
