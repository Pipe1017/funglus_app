# backend_funglusapp/app/routers/datos_generales_router.py
from typing import List, Optional

from app.crud import crud_datos_generales as crud  # El nuevo CRUD
from app.db import database
from app.schemas import datos_schemas as schemas  # Usaremos los schemas de datos
from app.schemas.catalogo_schemas import Msg  # Para mensajes de borrado
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/datos_laboratorio",  # Prefijo base para estos endpoints
    tags=["Datos Generales Laboratorio"],
)


@router.post(
    "/entry", response_model=schemas.DatosGeneralesInDB, status_code=status.HTTP_200_OK
)
def get_or_create_datos_generales(
    keys: schemas.DatosGeneralesCreate,  # Usa DatosGeneralesCreate que hereda de Keys
    db: Session = Depends(database.get_db),
):
    """
    Obtiene una entrada de DatosGeneralesLaboratorio existente basada en ciclo_id,
    etapa_id, muestra_id, y origen_id, o crea una nueva entrada placeholder
    si no existe.
    """
    if not all([keys.ciclo_id, keys.etapa_id, keys.muestra_id, keys.origen_id]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Todas las claves (ciclo_id, etapa_id, muestra_id, origen_id) son requeridas.",
        )

    db_entry = crud.get_or_create_datos_generales_entry(db=db, keys=keys)
    # La función CRUD ya maneja la creación si no existe.
    return db_entry


@router.put("/entry", response_model=schemas.DatosGeneralesInDB)
def update_datos_generales(
    payload: schemas.DatosGeneralesUpdatePayload,  # Recibe claves y datos a actualizar
    db: Session = Depends(database.get_db),
):
    """
    Actualiza una entrada existente en DatosGeneralesLaboratorio.
    El payload debe contener las claves (ciclo_id, etapa_id, muestra_id, origen_id)
    y los campos de metadatos a actualizar.
    """
    keys_data = schemas.DatosGeneralesKeys(
        ciclo_id=payload.ciclo_id,
        etapa_id=payload.etapa_id,
        muestra_id=payload.muestra_id,
        origen_id=payload.origen_id,
    )
    # Extraer solo los campos de metadata del payload para la actualización
    metadata_to_update_dict = payload.model_dump(
        exclude={"ciclo_id", "etapa_id", "muestra_id", "origen_id"}, exclude_unset=True
    )
    metadata_update_schema = schemas.DatosGeneralesUpdate(**metadata_to_update_dict)

    updated_entry = crud.update_datos_generales_entry(
        db=db, keys=keys_data, data_update=metadata_update_schema
    )
    if not updated_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entrada de Datos Generales no encontrada para actualizar (claves no coinciden).",
        )
    return updated_entry


@router.get("/ciclo/{ciclo_id_int}", response_model=List[schemas.DatosGeneralesInDB])
def read_datos_generales_for_ciclo(
    ciclo_id_int: int,  # Recibe el ID del ciclo (de la tabla catalogo_ciclos)
    db: Session = Depends(database.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene todas las entradas de DatosGeneralesLaboratorio para un ciclo_id específico.
    Esto es para la "matriz completa" de un ciclo.
    """
    entries = crud.get_datos_generales_by_ciclo(
        db, ciclo_id=ciclo_id_int, skip=skip, limit=limit
    )
    if not entries:
        # Devolver lista vacía es aceptable si no hay datos, en lugar de 404
        # raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron datos para este ciclo.")
        pass
    return entries


@router.delete("/entry", response_model=Msg, status_code=status.HTTP_200_OK)
def delete_datos_generales(
    keys: schemas.DatosGeneralesKeys,  # Recibe las claves en el cuerpo
    db: Session = Depends(database.get_db),
):
    """
    Borra una entrada específica de DatosGeneralesLaboratorio.
    """
    if not all([keys.ciclo_id, keys.etapa_id, keys.muestra_id, keys.origen_id]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Todas las claves (ciclo_id, etapa_id, muestra_id, origen_id) son requeridas para borrar.",
        )

    deleted = crud.delete_datos_generales_entry(
        db,
        ciclo_id=keys.ciclo_id,
        etapa_id=keys.etapa_id,
        muestra_id=keys.muestra_id,
        origen_id=keys.origen_id,
    )
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entrada de Datos Generales no encontrada para borrar.",
        )
    return {"message": "Entrada de Datos Generales borrada exitosamente"}
