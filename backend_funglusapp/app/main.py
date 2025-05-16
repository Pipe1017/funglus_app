# backend_funglusapp/app/main.py
from fastapi import FastAPI
from app.core.config import settings
from app.db import database, models
# Modifica esta línea para incluir el nuevo router:
from app.routers import laboratorio_router, formulacion_router, ciclo_data_router 

try:
    models.Base.metadata.create_all(bind=database.engine)
    print("INFO:     Conexión a la base de datos exitosa y tablas verificadas/creadas.")
except Exception as e:
    print(f"ERROR:    Error al conectar o crear tablas en la base de datos: {e}")
    # raise e 

app = FastAPI(
    title=settings.APP_NAME,
    openapi_url="/api/v1/openapi.json"
)

# Incluir los routers
app.include_router(ciclo_data_router.router, prefix="/api/v1") # <--- AÑADE ESTA LÍNEA
app.include_router(laboratorio_router.router, prefix="/api/v1")
app.include_router(formulacion_router.router, prefix="/api/v1")


@app.get("/api/v1/health", tags=["Health"])
def health_check():
    print("INFO:     Endpoint de salud '/api/v1/health' fue accedido.")
    return {"status": "healthy", "message": f"Welcome to {settings.APP_NAME}!"}