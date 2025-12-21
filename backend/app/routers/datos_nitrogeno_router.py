# backend_funglusapp/app/routers/datos_nitrogeno_router.py
from typing import List, Optional

from app.crud import crud_datos_nitrogeno as crud
from app.db import database
from app.schemas import datos_schemas as schemas
from app.schemas.catalogo_schemas import Msg  # Para mensajes de borrado
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/datos_nitrogeno",
    tags=["Datos de Nitrógeno"],
)


@router.post(
    "/", response_model=schemas.DatosNitrogenoInDB, status_code=status.HTTP_201_CREATED
)
def create_new_analisis_nitrogeno(
    entry_create: schemas.DatosNitrogenoCreate, db: Session = Depends(database.get_db)
):
    """
    Crea una nueva entrada (repetición) de análisis de nitrógeno.
    El payload debe incluir todas las claves
    (ciclo_id, etapa_id, muestra_id, origen_id, fecha_analisis_nitrogeno, numero_repeticion)
    y los datos de entrada para el análisis.
    """
    try:
        return crud.create_datos_nitrogeno_entry(db=db, entry_create=entry_create)
    except IntegrityError as e:
        db.rollback()
        # Extraer detalles si es posible, o un mensaje genérico
        detail = f"Ya existe un análisis de nitrógeno con las mismas claves (ciclo, etapa, muestra, origen, fecha, repetición): {entry_create.model_dump(include={'ciclo_id', 'etapa_id', 'muestra_id', 'origen_id', 'fecha_analisis_nitrogeno', 'numero_repeticion'})}"
        # O un mensaje más simple: detail = "Violación de restricción de unicidad."
        print(
            f"Error de integridad al crear entrada de nitrógeno: {e}"
        )  # Log detallado en servidor
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail)
    except Exception as e:
        db.rollback()
        print(f"Error inesperado al crear entrada de nitrógeno: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocurrió un error interno al procesar la solicitud de nitrógeno.",
        )


@router.get("/contexto/", response_model=List[schemas.DatosNitrogenoInDB])
def read_analisis_nitrogeno_by_context(
    ciclo_id: int,
    etapa_id: int,
    muestra_id: int,
    origen_id: int,
    db: Session = Depends(database.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene todos los análisis de nitrógeno para una combinación de
    ciclo_id, etapa_id, muestra_id, y origen_id (incluyendo todas las fechas y repeticiones).
    """
    entries = crud.get_all_datos_nitrogeno_for_context(
        db,
        ciclo_id=ciclo_id,
        etapa_id=etapa_id,
        muestra_id=muestra_id,
        origen_id=origen_id,
        skip=skip,
        limit=limit,
    )
    return entries


@router.get("/{analisis_id}", response_model=schemas.DatosNitrogenoInDB)
def read_analisis_nitrogeno_by_id(
    analisis_id: int, db: Session = Depends(database.get_db)
):
    """Obtiene un análisis de nitrógeno específico (una repetición) por su ID de tabla."""
    db_entry = crud.get_datos_nitrogeno_by_id(db, analisis_id=analisis_id)
    if db_entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Análisis de nitrógeno no encontrado.",
        )
    return db_entry


@router.put("/{analisis_id}", response_model=schemas.DatosNitrogenoInDB)
def update_existing_analisis_nitrogeno(
    analisis_id: int,
    entry_update: schemas.DatosNitrogenoUpdate,
    db: Session = Depends(database.get_db),
):
    """Actualiza un análisis de nitrógeno existente (una repetición) por su ID de tabla."""
    updated_entry = crud.update_datos_nitrogeno_entry(
        db, analisis_id=analisis_id, entry_update=entry_update
    )
    if updated_entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Análisis de nitrógeno no encontrado para actualizar.",
        )
    return updated_entry


@router.delete("/{analisis_id}", response_model=Msg)
def delete_existing_analisis_nitrogeno(
    analisis_id: int, db: Session = Depends(database.get_db)
):
    """Borra un análisis de nitrógeno específico (una repetición) por su ID de tabla."""
    deleted = crud.delete_datos_nitrogeno_entry(db, analisis_id=analisis_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Análisis de nitrógeno no encontrado para borrar.",
        )
    return {"message": "Análisis de nitrógeno borrado exitosamente"}
