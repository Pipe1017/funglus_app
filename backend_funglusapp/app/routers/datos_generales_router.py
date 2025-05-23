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
    payload: schemas.DatosGeneralesUpdatePayload,
    db: Session = Depends(database.get_db),
):
    """Endpoint actualizado con manejo flexible de claves"""
    try:
        # Convertir None a 0 para claves requeridas
        keys_data = schemas.DatosGeneralesKeys(
            ciclo_id=payload.ciclo_id,
            etapa_id=payload.etapa_id,
            muestra_id=payload.muestra_id if payload.muestra_id is not None else 0,
            origen_id=payload.origen_id if payload.origen_id is not None else 0,
        )

        # Extraer solo campos de metadata
        update_data = payload.dict(
            exclude={"ciclo_id", "etapa_id", "muestra_id", "origen_id"},
            exclude_unset=True,
        )

        updated_entry = crud.update_datos_generales_entry(
            db=db,
            keys=keys_data,
            data_update=schemas.DatosGeneralesUpdate(**update_data),
        )

        if not updated_entry:
            raise HTTPException(
                status_code=404,
                detail="Entrada no encontrada con las claves proporcionadas",
            )

        return updated_entry

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al actualizar: {str(e)}")


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


# --- ¡NUEVO ENDPOINT! ---
@router.post(
    "/get_by_keys",  # Usamos POST para poder enviar las claves en el cuerpo
    response_model=Optional[
        schemas.DatosGeneralesInDB
    ],  # Puede devolver la entrada o nada (None)
    summary="Obtener una entrada de Datos Generales por sus claves (solo lectura)",
)
def get_datos_generales_by_keys_endpoint(
    keys: schemas.DatosGeneralesKeys,  # Recibe ciclo_id, etapa_id, muestra_id, origen_id
    db: Session = Depends(database.get_db),
):
    """
    Obtiene una entrada de DatosGeneralesLaboratorio existente basada en sus claves.
    Si no existe, devuelve null (o FastAPI podría convertirlo en un 200 con cuerpo null,
    o podríamos forzar un 404 si es preferible).
    No crea una entrada si no se encuentra.
    """
    if not all([keys.ciclo_id, keys.etapa_id, keys.muestra_id, keys.origen_id]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Todas las claves (ciclo_id, etapa_id, muestra_id, origen_id) son requeridas para la búsqueda.",
        )

    db_entry = crud.get_datos_generales_entry(  # Esta es tu función CRUD que solo obtiene, no crea
        db,
        ciclo_id=keys.ciclo_id,
        etapa_id=keys.etapa_id,
        muestra_id=keys.muestra_id,
        origen_id=keys.origen_id,
    )

    if db_entry is None:
        # Opción 1: Devolver null y que el frontend interprete (FastAPI podría devolver 200 con cuerpo null)
        return None
        # Opción 2: Devolver explícitamente 404 si no se encuentra
        # raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entrada de Datos Generales no encontrada para las claves proporcionadas.")

    # Asegurarse de que la respuesta incluya las referencias si el schema DatosGeneralesInDB las espera
    # (esto depende de si get_datos_generales_entry hace eager loading o si Pydantic las carga)
    # Por ahora, asumimos que get_datos_generales_entry devuelve el objeto con lo necesario
    # o que el schema DatosGeneralesInDB está configurado para manejarlo (con from_attributes y relaciones cargadas).
    # Si las refs no vienen, necesitaríamos cargar el objeto con eager loading aquí o en el CRUD.
    # Por simplicidad, mantenemos esto así y el frontend verificará si la respuesta es null.
    return db_entry


@router.post(
    "/get_by_keys",
    response_model=schemas.DatosGeneralesInDB,  # Si se encuentra, devuelve el objeto
    summary="Obtener una entrada de Datos Generales por sus claves (solo lectura)",
)
def get_datos_generales_by_keys_endpoint(
    keys: schemas.DatosGeneralesKeys, db: Session = Depends(database.get_db)
):
    # ... (validación de keys) ...
    if not all(
        [keys.ciclo_id, keys.etapa_id, keys.muestra_id, keys.origen_id]
    ):  # Asegúrate que Muestra y Origen sean siempre obligatorios
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Todas las claves (ciclo_id, etapa_id, muestra_id, origen_id) son requeridas para la búsqueda.",
        )

    db_entry = crud.get_datos_generales_entry(
        db,
        ciclo_id=keys.ciclo_id,
        etapa_id=keys.etapa_id,
        muestra_id=keys.muestra_id,
        origen_id=keys.origen_id,
    )

    if db_entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entrada de Datos Generales no encontrada para las claves proporcionadas.",
        )
    return db_entry
