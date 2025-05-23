# backend_funglusapp/app/routers/registros_cenizas_router.py
from typing import List, Optional

from app.crud import crud_procesamiento
from app.db import database, models
from app.schemas import procesamiento_schemas as schemas_proc
from app.schemas.catalogo_schemas import Msg  # Para mensajes de borrado
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/registros-cenizas",  # Prefijo base para estos endpoints
    tags=["Análisis de Cenizas - Registros"],
)


@router.post(
    "/",
    response_model=schemas_proc.RegistroAnalisisCenizasInDB,
    status_code=status.HTTP_201_CREATED,
)
def create_new_registro_cenizas(
    registro_create: schemas_proc.RegistroAnalisisCenizasCreate,
    db: Session = Depends(database.get_db),
):
    """
    Crea un nuevo registro de análisis de cenizas.
    El % de cenizas se calcula y se guarda en el backend.
    La tabla DatosGeneralesLaboratorio se actualiza con este resultado.
    """
    try:
        return crud_procesamiento.create_registro_cenizas(
            db=db, registro_create=registro_create
        )
    except ValueError as ve:  # Captura el ValueError de la UniqueConstraint
        if "Ya existe un registro de cenizas" in str(ve):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(ve))
        elif "No existe una entrada en la Tabla General" in str(ve):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve)
            )  # O 412
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))


@router.get(
    "/lote/{ciclo_proc_id}/",
    response_model=List[schemas_proc.RegistroAnalisisCenizasInDB],
)
def read_registros_cenizas_by_ciclo_procesamiento(
    ciclo_proc_id: int,
    db: Session = Depends(database.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene todos los registros de análisis de cenizas para un ciclo_procesamiento_id específico.
    Incluye los datos de los catálogos referenciados.
    """
    registros = crud_procesamiento.get_registros_cenizas_by_ciclo_procesamiento_id(
        db,
        ciclo_proc_id=ciclo_proc_id,
        skip=skip,
        limit=limit,
        eager_load_catalogs=True,
    )
    return registros


@router.get("/{registro_id}/", response_model=schemas_proc.RegistroAnalisisCenizasInDB)
def read_registro_cenizas_by_id(
    registro_id: int, db: Session = Depends(database.get_db)
):
    """
    Obtiene un registro de análisis de cenizas específico por su ID.
    Incluye los datos de los catálogos referenciados.
    """
    db_registro = crud_procesamiento.get_registro_cenizas_by_id(
        db, registro_id=registro_id, eager_load_catalogs=True
    )
    if db_registro is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de análisis de cenizas no encontrado.",
        )
    return db_registro


@router.put("/{registro_id}/", response_model=schemas_proc.RegistroAnalisisCenizasInDB)
def update_existing_registro_cenizas(
    registro_id: int,
    registro_update: schemas_proc.RegistroAnalisisCenizasUpdate,
    db: Session = Depends(database.get_db),
):
    """
    Actualiza un registro de análisis de cenizas existente.
    Recalcula el % de cenizas si los inputs relevantes cambian.
    La tabla DatosGeneralesLaboratorio se actualiza con el nuevo resultado.
    """
    db_registro_check = crud_procesamiento.get_registro_cenizas_by_id(
        db, registro_id=registro_id, eager_load_catalogs=False
    )
    if db_registro_check is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de análisis de cenizas no encontrado para actualizar.",
        )
    try:
        updated_registro_internal = crud_procesamiento.update_registro_cenizas(
            db, registro_id=registro_id, registro_update=registro_update
        )
        # Recargar con los refs para la respuesta
        return crud_procesamiento.get_registro_cenizas_by_id(
            db, registro_id=updated_registro_internal.id, eager_load_catalogs=True
        )
    except (
        ValueError
    ) as ve:  # Captura el ValueError de la UniqueConstraint si la actualización causara conflicto (menos probable)
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el registro de cenizas: {e}",
        )


@router.delete("/{registro_id}/", response_model=Msg)
def delete_existing_registro_cenizas(
    registro_id: int, db: Session = Depends(database.get_db)
):
    """
    Borra un registro de análisis de cenizas.
    NOTA: Esto no recalcula/resetea automáticamente el valor en DatosGeneralesLaboratorio.
    Esa lógica podría necesitar un trigger separado o ser manejada al volver a guardar un
    nuevo registro para la misma combinación de catálogos.
    """
    # Opcional: Obtener el registro antes de borrar para saber a qué combinación de catálogos afecta
    # db_registro = crud_procesamiento.get_registro_cenizas_by_id(db, registro_id, eager_load_catalogs=False)
    # if db_registro:
    #     # Aquí podrías llamar a una función para actualizar DatosGeneralesLaboratorio
    #     # por ejemplo, poniendo resultado_cenizas_porc a None o recalculando
    #     # si hubiera otros registros de cenizas para esa combinación de catálogos en otros lotes.
    #     # Por ahora, se mantiene simple: solo borra el registro.
    #     pass

    deleted = crud_procesamiento.delete_registro_cenizas(db, registro_id=registro_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de análisis de cenizas no encontrado para borrar.",
        )
    return {"message": "Registro de análisis de cenizas borrado exitosamente."}
