from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db import database, models

# Routers (endpoints organizados por módulo)
from app.routers import (
    catalogo_router,  # Para Ciclos (catálogo), Etapas, Muestras, Origenes
)
from app.routers import ciclo_data_router  # Utilidades para datos de Ciclos (catálogo)
from app.routers import (
    ciclos_procesamiento_router,  # Para CiclosDeProcesamiento (lotes de Nitrógeno/Cenizas)
)
from app.routers import (
    datos_generales_router,  # Para DatosGeneralesLaboratorio (tabla general)
)
from app.routers import (
    registros_cenizas_router,  # Para Registros de Análisis de Cenizas
)
from app.routers import (
    registros_nitrogeno_router,  # Para Registros de Análisis de Nitrógeno
)
from app.routers import (
    informes_router,  # Para Informes
)

# -----------------------------
# Inicialización de la base de datos
# -----------------------------
try:
    models.Base.metadata.create_all(bind=database.engine)
    print("INFO: Conexión a la base de datos exitosa y tablas verificadas/creadas.")
except Exception as e:
    print(f"ERROR: Error al conectar o crear tablas: {e}")

# -----------------------------
# Inicialización de la aplicación FastAPI
# -----------------------------
app = FastAPI(title=settings.APP_NAME, openapi_url="/api/v1/openapi.json")

# -----------------------------
# Configuración de CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS + ["*"],  # En prod, quitar el "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Registro de routers (API modular)
# -----------------------------
app.include_router(catalogo_router.router, prefix="/api/v1")
app.include_router(ciclo_data_router.router, prefix="/api/v1")
app.include_router(datos_generales_router.router, prefix="/api/v1")
app.include_router(ciclos_procesamiento_router.router, prefix="/api/v1")
app.include_router(registros_nitrogeno_router.router, prefix="/api/v1")
app.include_router(registros_cenizas_router.router, prefix="/api/v1")
app.include_router(informes_router.router, prefix="/api/v1")

# -----------------------------
# Ruta básica para ver si la app está viva
# -----------------------------
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    print("INFO:     Endpoint de salud '/api/v1/health' fue accedido.")
    return {"status": "healthy", "message": f"Bienvenido a {settings.APP_NAME}!"}
