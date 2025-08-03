# backend_funglusapp/app/routers/datos_generales_router.py
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import crud_datos_generales as crud
from app.db import database
from app.schemas import datos_schemas as schemas
from app.schemas.catalogo_schemas import Msg

router = APIRouter(
    prefix="/datos_laboratorio",
    tags=["Datos Generales Laboratorio"],
)

@router.post(
    "/entry",
    response_model=schemas.DatosGeneralesInDB,
    summary="Obtener o crear una entrada en la tabla general"
)
def get_or_create_datos_generales(
    keys: schemas.DatosGeneralesCreate,
    db: Session = Depends(database.get_db),
):
    """
    Obtiene una entrada de DatosGeneralesLaboratorio existente o crea una nueva
    si no existe, basada en la clave completa (incluyendo secuencia_id).
    """
    # La validación ahora es implícita gracias al schema Pydantic,
    # pero una comprobación explícita no está de más.
    if not all([keys.ciclo_id, keys.etapa_id, keys.muestra_id, keys.origen_id, keys.secuencia_id]): # <-- MODIFICADO
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Todas las claves (ciclo, etapa, muestra, origen, secuencia) son requeridas.",
        )

    db_entry = crud.get_or_create_datos_generales_entry(db=db, keys=keys)
    return db_entry

@router.put(
    "/entry",
    response_model=schemas.DatosGeneralesInDB,
    summary="Actualizar una entrada en la tabla general"
)
def update_datos_generales(
    payload: schemas.DatosGeneralesUpdatePayload,
    db: Session = Depends(database.get_db),
):
    """
    Actualiza los campos de metadatos para una entrada específica, identificada
    por su clave completa (incluyendo secuencia_id).
    """
    # El schema `DatosGeneralesUpdatePayload` ya contiene todos los IDs
    keys_data = schemas.DatosGeneralesKeys(
        ciclo_id=payload.ciclo_id,
        etapa_id=payload.etapa_id,
        muestra_id=payload.muestra_id,
        origen_id=payload.origen_id,
        secuencia_id=payload.secuencia_id, # <-- MODIFICADO
    )

    # Extraer solo los campos de metadatos para la actualización
    update_data = payload.model_dump(
        exclude={"ciclo_id", "etapa_id", "muestra_id", "origen_id", "secuencia_id"}, # <-- MODIFICADO
        exclude_unset=True,
    )

    updated_entry = crud.update_datos_generales_entry(
        db=db,
        keys=keys_data,
        data_update=schemas.DatosGeneralesUpdate(**update_data),
    )

    if not updated_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entrada no encontrada con las claves proporcionadas",
        )
    return updated_entry

@router.get(
    "/ciclo/{ciclo_id_int}",
    response_model=List[schemas.DatosGeneralesInDB],
    summary="Obtener todas las entradas de un ciclo"
)
def read_datos_generales_for_ciclo(
    ciclo_id_int: int,
    db: Session = Depends(database.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene todas las entradas de DatosGeneralesLaboratorio para un ciclo_id específico.
    La respuesta ahora incluirá la información de la secuencia.
    """
    # No se necesitan cambios aquí, el CRUD y el Schema ya fueron actualizados.
    entries = crud.get_datos_generales_by_ciclo(db, ciclo_id=ciclo_id_int, skip=skip, limit=limit)
    return entries

@router.delete(
    "/entry",
    response_model=Msg,
    summary="Borrar una entrada de la tabla general"
)
def delete_datos_generales(
    keys: schemas.DatosGeneralesKeys = Depends(), # <-- MODIFICADO
    db: Session = Depends(database.get_db),
):
    """
    Borra una entrada específica de DatosGeneralesLaboratorio.
    Requiere la clave completa de 5 partes como query parameters en la URL.
    """
    deleted = crud.delete_datos_generales_entry(
        db,
        ciclo_id=keys.ciclo_id,
        etapa_id=keys.etapa_id,
        muestra_id=keys.muestra_id,
        origen_id=keys.origen_id,
        secuencia_id=keys.secuencia_id,
    )
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entrada de Datos Generales no encontrada para borrar.",
        )
    return {"message": "Entrada de Datos Generales borrada exitosamente"}



@router.post(
    "/get_by_keys",
    response_model=schemas.DatosGeneralesInDB,
    summary="Obtener una entrada por su clave completa"
)
def get_datos_generales_by_keys_endpoint(
    keys: schemas.DatosGeneralesKeys, # <-- El body ahora espera la clave completa
    db: Session = Depends(database.get_db)
):
    """
    Obtiene una única entrada de DatosGeneralesLaboratorio basada en su clave completa.
    Devuelve 404 si no se encuentra.
    """
    db_entry = crud.get_datos_generales_entry(
        db,
        ciclo_id=keys.ciclo_id,
        etapa_id=keys.etapa_id,
        muestra_id=keys.muestra_id,
        origen_id=keys.origen_id,
        secuencia_id=keys.secuencia_id, # <-- MODIFICADO
    )

    if db_entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entrada de Datos Generales no encontrada para las claves proporcionadas.",
        )
    return db_entry