# backend_funglusapp/app/routers/registros_nitrogeno_router.py
from typing import List, Optional

from app.crud import crud_procesamiento
from app.db import database, models
from app.schemas import procesamiento_schemas as schemas_proc
from app.schemas.catalogo_schemas import Msg  # Para mensajes de borrado
from fastapi import APIRouter, Depends, HTTPException, status

# Nuevo schema para el payload de promediar
from pydantic import BaseModel
from sqlalchemy.orm import Session


class PromediarNitrogenoPayload(BaseModel):
    ciclo_catalogo_id: int
    etapa_catalogo_id: int
    muestra_catalogo_id: int
    origen_catalogo_id: int
    ciclo_procesamiento_id: Optional[int] = None


router = APIRouter(
    prefix="/registros-nitrogeno",  # Prefijo base para estos endpoints
    tags=["Análisis de Nitrógeno - Registros"],
)


@router.post(
    "/",
    response_model=schemas_proc.RegistroAnalisisNitrogenoInDB,
    status_code=status.HTTP_201_CREATED,
)
def create_new_registro_nitrogeno(
    registro_create: schemas_proc.RegistroAnalisisNitrogenoCreate,  # ciclo_procesamiento_id viene aquí
    db: Session = Depends(database.get_db),
):
    """
    Crea un nuevo registro de análisis de nitrógeno.
    Los valores calculados (N% total, peso seco, N% base seca, H% usada)
    se generan y guardan en el backend.
    Asegura que exista una entrada en DatosGeneralesLaboratorio para la combinación de catálogos.
    """
    try:
        return crud_procesamiento.create_registro_nitrogeno(
            db=db, registro_create=registro_create
        )
    except Exception as e:
        # Loguear 'e'
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear el registro de nitrógeno: {e}",
        )


@router.get(
    "/lote/{ciclo_proc_id}/",
    response_model=List[schemas_proc.RegistroAnalisisNitrogenoInDB],
)
def read_registros_by_ciclo_procesamiento(
    ciclo_proc_id: int,
    db: Session = Depends(database.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene todos los registros de análisis de nitrógeno para un ciclo_procesamiento_id específico.
    Incluye los datos de los catálogos referenciados.
    """
    registros = crud_procesamiento.get_registros_nitrogeno_by_ciclo_procesamiento_id(
        db,
        ciclo_proc_id=ciclo_proc_id,
        skip=skip,
        limit=limit,
        eager_load_catalogs=True,
    )
    return registros


@router.get(
    "/{registro_id}/", response_model=schemas_proc.RegistroAnalisisNitrogenoInDB
)
def read_registro_nitrogeno_by_id(
    registro_id: int, db: Session = Depends(database.get_db)
):
    """
    Obtiene un registro de análisis de nitrógeno específico por su ID.
    Incluye los datos de los catálogos referenciados.
    """
    db_registro = crud_procesamiento.get_registro_nitrogeno_by_id(
        db, registro_id=registro_id, eager_load_catalogs=True
    )
    if db_registro is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de análisis de nitrógeno no encontrado.",
        )
    return db_registro


@router.put(
    "/{registro_id}/", response_model=schemas_proc.RegistroAnalisisNitrogenoInDB
)
def update_existing_registro_nitrogeno(
    registro_id: int,
    registro_update: schemas_proc.RegistroAnalisisNitrogenoUpdate,
    db: Session = Depends(database.get_db),
):
    """
    Actualiza un registro de análisis de nitrógeno existente.
    Recalcula los valores si los inputs relevantes cambian.
    """
    # Primero, obtener el registro para devolverlo con los refs cargados después de actualizar
    db_registro_check = crud_procesamiento.get_registro_nitrogeno_by_id(
        db, registro_id=registro_id, eager_load_catalogs=False
    )
    if db_registro_check is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de análisis de nitrógeno no encontrado para actualizar.",
        )

    updated_registro = crud_procesamiento.update_registro_nitrogeno(
        db, registro_id=registro_id, registro_update=registro_update
    )
    # El updated_registro del CRUD no tiene los refs cargados, así que volvemos a consultarlo
    return crud_procesamiento.get_registro_nitrogeno_by_id(
        db, registro_id=updated_registro.id, eager_load_catalogs=True
    )


@router.delete("/{registro_id}/", response_model=Msg)
def delete_existing_registro_nitrogeno(
    registro_id: int, db: Session = Depends(database.get_db)
):
    """
    Borra un registro de análisis de nitrógeno.
    """
    deleted = crud_procesamiento.delete_registro_nitrogeno(db, registro_id=registro_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de análisis de nitrógeno no encontrado para borrar.",
        )
    return {"message": "Registro de análisis de nitrógeno borrado exitosamente."}


@router.post(
    "/acciones/promediar-y-actualizar-general/",
    response_model=Msg,  # O un schema más detallado del resultado
)
def promediar_y_actualizar_general(
    payload: PromediarNitrogenoPayload, db: Session = Depends(database.get_db)
):
    """
    Calcula los promedios de nitrógeno para la combinación de catálogos dada
    (opcionalmente filtrado por un ciclo_procesamiento_id) y actualiza
    la tabla DatosGeneralesLaboratorio.
    """
    success = crud_procesamiento.promediar_y_actualizar_nitrogeno_en_tabla_general(
        db=db,
        ciclo_catalogo_id=payload.ciclo_catalogo_id,
        etapa_catalogo_id=payload.etapa_catalogo_id,
        muestra_catalogo_id=payload.muestra_catalogo_id,
        origen_catalogo_id=payload.origen_catalogo_id,
        ciclo_procesamiento_id=payload.ciclo_procesamiento_id,
    )
    if not success:
        # La función CRUD podría levantar excepciones más específicas o devolver más info.
        # Por ahora, un error genérico si no se pudo actualizar o no se encontraron registros.
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,  # O 404 si no se encontraron registros y eso es un error
            detail="No se pudo actualizar la tabla general. Puede que no haya registros para promediar o la entrada general no exista (aunque debería crearse).",
        )
    return {
        "message": "Promedios de nitrógeno actualizados en la tabla general exitosamente."
    }
