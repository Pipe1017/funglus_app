# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db import database, models

# IMPORTANTE: Importamos el router centralizado nuevo
from app.api.v1.api import api_router 


# -----------------------------
# Inicialización de la base de datos
# -----------------------------
try:
    models.Base.metadata.create_all(bind=database.engine)
    print("✓ INFO: Conexión a la base de datos exitosa y tablas verificadas/creadas.")
except Exception as e:
    print(f"✗ ERROR: Error al conectar o crear tablas: {e}")


# -----------------------------
# Inicialización de la aplicación FastAPI
# -----------------------------
app = FastAPI(
    title=settings.APP_NAME, 
    version=settings.VERSION,
    openapi_url="/api/v1/openapi.json",
    debug=settings.DEBUG
)


# -----------------------------
# Configuración de CORS
# -----------------------------
# IMPORTANTE: Removí el ["*"] que estaba agregando todos los orígenes
# Esto era un riesgo de seguridad en producción
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,  # 🔥 Ahora lee dinámicamente desde .env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Registro de Routers
# -----------------------------
# En lugar de importar router por router, usamos el api_router que agrupa Auth + Laboratorio
app.include_router(api_router, prefix="/api/v1")


# -----------------------------
# Health Check
# -----------------------------
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    """Endpoint para verificar que la API está funcionando"""
    return {
        "status": "healthy", 
        "message": f"Bienvenido a {settings.APP_NAME} - Sistema Modular",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }


@app.get("/")
def root():
    """Endpoint raíz"""
    return {
        "message": "Funglus API is running.",
        "docs": "/docs",
        "health": "/api/v1/health"
    }