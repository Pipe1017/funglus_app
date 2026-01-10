from fastapi import APIRouter

# Importamos el router de Auth
from app.api.v1.endpoints import auth, users  # AÑADIR users

# Importamos routers existentes de Laboratorio
from app.routers import (
    catalogo_router,
    ciclo_data_router,
    ciclos_procesamiento_router,
    datos_generales_router,
    registros_nitrogeno_router,
    registros_cenizas_router,
    informes_router,
    notas_informe_router,
)

api_router = APIRouter()

# 1. Módulo de Autenticación
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])

# 2. Módulo de Administración (NUEVO)
api_router.include_router(users.router, prefix="/users", tags=["Admin - Users"])

# 3. Módulo de Laboratorio
api_router.include_router(catalogo_router.router, tags=["Laboratorio - Catálogos"])
api_router.include_router(ciclo_data_router.router, tags=["Laboratorio - Ciclos Data"])
api_router.include_router(datos_generales_router.router, tags=["Laboratorio - Datos Generales"])
api_router.include_router(ciclos_procesamiento_router.router, tags=["Laboratorio - Procesamiento"])
api_router.include_router(registros_nitrogeno_router.router, tags=["Laboratorio - Nitrógeno"])
api_router.include_router(registros_cenizas_router.router, tags=["Laboratorio - Cenizas"])
api_router.include_router(informes_router.router, tags=["Laboratorio - Informes"])
api_router.include_router(notas_informe_router.router,prefix="/notas-informe",tags=["notas"])