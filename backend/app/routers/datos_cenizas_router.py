# backend_funglusapp/app/routers/datos_cenizas_router.py
from typing import List, Optional

from app.crud import crud_datos_cenizas as crud  # El nuevo CRUD para cenizas
from app.db import database
from app.schemas import datos_schemas as schemas  # Usaremos los schemas de datos
from app.schemas.catalogo_schemas import Msg
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/datos_cenizas",  # Prefijo base para estos endpoints
    tags=["Datos de Cenizas"],
)


@router.post(
    "/", response_model=schemas.DatosCenizasInDB, status_code=status.HTTP_201_CREATED
)
def create_new_analisis_cenizas(
    entry_create: schemas.DatosCenizasCreate, db: Session = Depends(database.get_db)
):
    """
    Crea una nueva entrada de análisis de cenizas.
    El payload debe incluir todas las claves (ciclo_id, etapa_id, muestra_id, origen_id, fecha_analisis_cenizas)
    y los datos de entrada para el análisis.
    """
    # Verificar si ya existe una entrada con la misma clave única compuesta
    # La función CRUD ahora maneja la creación o puede lanzar IntegrityError si el router no valida antes.
    # Para un POST, generalmente se espera crear un nuevo recurso.
    # Si la combinación de claves ya existe, la restricción UNIQUE en la BD debería actuar.
    try:
        return crud.create_datos_cenizas_entry(db=db, entry_create=entry_create)
    except IntegrityError as e:  # Específicamente para la restricción UNIQUE
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un análisis de cenizas con las mismas claves (ciclo, etapa, muestra, origen, fecha): {e.params}",
        )
    except Exception as e:
        db.rollback()
        # Loguear el error 'e' para depuración interna
        print(f"Error inesperado al crear entrada de cenizas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocurrió un error interno al procesar la solicitud de cenizas.",
        )


@router.get("/contexto/", response_model=List[schemas.DatosCenizasInDB])
def read_analisis_cenizas_by_context(
    ciclo_id: int,
    etapa_id: int,
    muestra_id: int,
    origen_id: int,
    db: Session = Depends(database.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene todos los análisis de cenizas para una combinación de
    ciclo_id, etapa_id, muestra_id, y origen_id.
    Útil para ver todas las repeticiones o análisis en diferentes fechas para un contexto.
    """
    entries = crud.get_all_datos_cenizas_for_context(
        db,
        ciclo_id=ciclo_id,
        etapa_id=etapa_id,
        muestra_id=muestra_id,
        origen_id=origen_id,
        skip=skip,
        limit=limit,
    )
    return entries


@router.get("/{analisis_id}", response_model=schemas.DatosCenizasInDB)
def read_analisis_cenizas_by_id(
    analisis_id: int,  # El ID de la fila en la tabla datos_cenizas
    db: Session = Depends(database.get_db),
):
    """Obtiene un análisis de cenizas específico por su ID de análisis."""
    db_entry = crud.get_datos_cenizas_by_id(db, analisis_id=analisis_id)
    if db_entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Análisis de cenizas no encontrado.",
        )
    return db_entry


@router.put("/{analisis_id}", response_model=schemas.DatosCenizasInDB)
def update_existing_analisis_cenizas(
    analisis_id: int,  # El ID de la fila en la tabla datos_cenizas
    entry_update: schemas.DatosCenizasUpdate,
    db: Session = Depends(database.get_db),
):
    """Actualiza un análisis de cenizas existente por su ID de análisis."""
    updated_entry = crud.update_datos_cenizas_entry(
        db, analisis_id=analisis_id, entry_update=entry_update
    )
    if updated_entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Análisis de cenizas no encontrado para actualizar.",
        )
    return updated_entry


@router.delete("/{analisis_id}", response_model=Msg)
def delete_existing_analisis_cenizas(
    analisis_id: int,  # El ID de la fila en la tabla datos_cenizas
    db: Session = Depends(database.get_db),
):
    """Borra un análisis de cenizas específico por su ID de análisis."""
    deleted = crud.delete_datos_cenizas_entry(db, analisis_id=analisis_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Análisis de cenizas no encontrado para borrar.",
        )
    return {"message": "Análisis de cenizas borrado exitosamente"}
