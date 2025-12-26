from fastapi import APIRouter

# Importamos el nuevo router de Auth
from app.api.v1.endpoints import auth

# Importamos tus routers existentes (Laboratorio)
from app.routers import (
    catalogo_router,
    ciclo_data_router,
    ciclos_procesamiento_router,
    datos_generales_router,
    registros_nitrogeno_router,
    registros_cenizas_router,
    informes_router
)

api_router = APIRouter()

# 1. Módulo de Autenticación
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])

# 2. Módulo de Laboratorio (Agrupamos tus routers actuales)
# Nota: Les quitamos el prefijo /api/v1 aquí porque se lo daremos en el main.py general
# o lo manejamos como submódulo. Para mantener compatibilidad con tu frontend actual,
# mantendremos la estructura plana por ahora en el tag, pero organizada.

api_router.include_router(catalogo_router.router, tags=["Laboratorio - Catálogos"])
api_router.include_router(ciclo_data_router.router, tags=["Laboratorio - Ciclos Data"])
api_router.include_router(datos_generales_router.router, tags=["Laboratorio - Datos Generales"])
api_router.include_router(ciclos_procesamiento_router.router, tags=["Laboratorio - Procesamiento"])
api_router.include_router(registros_nitrogeno_router.router, tags=["Laboratorio - Nitrógeno"])
api_router.include_router(registros_cenizas_router.router, tags=["Laboratorio - Cenizas"])
api_router.include_router(informes_router.router, tags=["Laboratorio - Informes"])

# Aquí podrás añadir futuros módulos fácilmente:
# from app.api.v1.endpoints import siembra
# api_router.include_router(siembra.router, prefix="/siembra", tags=["Siembra"])