# backend_funglusapp/app/main.py
from app.core.config import settings
from app.db import database, models

# Importa tus routers
from app.routers import datos_nitrogeno_router  # <--- AÑADE datos_nitrogeno_router
from app.routers import (
    catalogo_router,
    ciclo_data_router,
    datos_cenizas_router,
    datos_generales_router,
)
from fastapi import FastAPI

try:
    models.Base.metadata.create_all(bind=database.engine)
    print("INFO:     Conexión a la base de datos exitosa y tablas verificadas/creadas.")
except Exception as e:
    print(f"ERROR:    Error al conectar o crear tablas en la base de datos: {e}")
    # raise e

app = FastAPI(title=settings.APP_NAME, openapi_url="/api/v1/openapi.json")

# Incluir los routers en la aplicación FastAPI
app.include_router(catalogo_router.router, prefix="/api/v1")
app.include_router(ciclo_data_router.router, prefix="/api/v1")
app.include_router(datos_generales_router.router, prefix="/api/v1")
app.include_router(datos_cenizas_router.router, prefix="/api/v1")
app.include_router(
    datos_nitrogeno_router.router, prefix="/api/v1"
)  # <--- AÑADE ESTA LÍNEA


@app.get("/api/v1/health", tags=["Health"])
def health_check():
    print("INFO:     Endpoint de salud '/api/v1/health' fue accedido.")
    return {"status": "healthy", "message": f"Bienvenido a {settings.APP_NAME}!"}
