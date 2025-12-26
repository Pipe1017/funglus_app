#
from typing import List, Optional

from app.crud import crud_procesamiento
from app.db import database
from app.schemas import procesamiento_schemas as schemas_proc
from app.schemas.catalogo_schemas import Msg
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session


# --- Modelo para el Payload de Promediar (CORREGIDO) ---
class PromediarNitrogenoPayload(BaseModel):
    ciclo_catalogo_id: int
    etapa_catalogo_id: int
    muestra_catalogo_id: int
    origen_catalogo_id: int
    secuencia_catalogo_id: int # <--- ¡CAMPO AÑADIDO!
    ciclo_procesamiento_id: Optional[int] = None


router = APIRouter(
    prefix="/registros-nitrogeno", 
    tags=["Análisis de Nitrógeno - Registros"],
)

@router.post(
    "/",
    response_model=schemas_proc.RegistroAnalisisNitrogenoInDB,
    status_code=status.HTTP_201_CREATED,
)
def create_new_registro_nitrogeno(
    registro_create: schemas_proc.RegistroAnalisisNitrogenoCreate,
    db: Session = Depends(database.get_db),
):
    try:
        return crud_procesamiento.create_registro_nitrogeno(
            db=db, registro_create=registro_create
        )
    except Exception as e:
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
    # Verificamos si existe antes de intentar actualizar
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
    
    return crud_procesamiento.get_registro_nitrogeno_by_id(
        db, registro_id=updated_registro.id, eager_load_catalogs=True
    )


@router.delete("/{registro_id}/", response_model=Msg)
def delete_existing_registro_nitrogeno(
    registro_id: int, db: Session = Depends(database.get_db)
):
    deleted = crud_procesamiento.delete_registro_nitrogeno(db, registro_id=registro_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de análisis de nitrógeno no encontrado para borrar.",
        )
    return {"message": "Registro de análisis de nitrógeno borrado exitosamente."}


@router.post(
    "/acciones/promediar-y-actualizar-general/",
    response_model=Msg,
)
def promediar_y_actualizar_general(
    payload: PromediarNitrogenoPayload, db: Session = Depends(database.get_db)
):
    """
    Calcula promedios y actualiza la tabla general.
    """
    success = crud_procesamiento.promediar_y_actualizar_nitrogeno_en_tabla_general(
        db=db,
        ciclo_catalogo_id=payload.ciclo_catalogo_id,
        etapa_catalogo_id=payload.etapa_catalogo_id,
        muestra_catalogo_id=payload.muestra_catalogo_id,
        origen_catalogo_id=payload.origen_catalogo_id,
        secuencia_catalogo_id=payload.secuencia_catalogo_id, # <--- SE PASA EL PARAMETRO
        ciclo_procesamiento_id=payload.ciclo_procesamiento_id,
    )
    
    # Retornamos éxito siempre que no haya un error técnico grave, 
    # incluso si no hubo registros para promediar (success=False), para evitar alertas en frontend.
    return {
        "message": "Proceso de promediado completado."
    }