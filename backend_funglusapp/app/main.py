# backend_funglusapp/app/main.py
from app.core.config import settings
from app.db import database, models

# Importa tus routers
from app.routers import (
    catalogo_router,
    ciclo_data_router,
    datos_cenizas_router,
    datos_generales_router,
    datos_nitrogeno_router,
)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    models.Base.metadata.create_all(bind=database.engine)
    print("INFO:     Conexión a la base de datos exitosa y tablas verificadas/creadas.")
except Exception as e:
    print(f"ERROR:    Error al conectar o crear tablas en la base de datos: {e}")
    # raise e

app = FastAPI(title=settings.APP_NAME, openapi_url="/api/v1/openapi.json")


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Lista de orígenes que pueden hacer peticiones
    allow_credentials=True,  # Permite cookies (no las usamos ahora, pero es buena práctica)
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permite todas las cabeceras
)

# Incluir los routers en la aplicación FastAPI
app.include_router(catalogo_router.router, prefix="/api/v1")
app.include_router(ciclo_data_router.router, prefix="/api/v1")
app.include_router(datos_generales_router.router, prefix="/api/v1")
app.include_router(datos_cenizas_router.router, prefix="/api/v1")
app.include_router(datos_nitrogeno_router.router, prefix="/api/v1")


@app.get("/api/v1/health", tags=["Health"])
def health_check():
    print("INFO:     Endpoint de salud '/api/v1/health' fue accedido.")
    return {"status": "healthy", "message": f"Bienvenido a {settings.APP_NAME}!"}
