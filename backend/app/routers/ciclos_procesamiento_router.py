# backend_funglusapp/app/routers/ciclos_procesamiento_router.py
from typing import List, Optional

from app.crud import crud_procesamiento
from app.db import database, models
from app.schemas import procesamiento_schemas as schemas_proc
from app.schemas.catalogo_schemas import Msg  # Para mensajes de borrado
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/ciclos-procesamiento",  # Prefijo base para estos endpoints
    tags=["Gestión de Ciclos de Procesamiento"],
)


@router.post(
    "/",
    response_model=schemas_proc.CicloProcesamientoInDB,
    status_code=status.HTTP_201_CREATED,
)
def create_new_ciclo_procesamiento(
    ciclo_proc_create: schemas_proc.CicloProcesamientoCreate,
    db: Session = Depends(database.get_db),
):
    """
    Crea un nuevo ciclo de procesamiento (ej. para Nitrógeno o Cenizas).
    'tipo_analisis' en el payload debe ser "nitrogeno" o "cenizas".
    'identificador_lote' y 'fecha_hora_lote' junto con 'tipo_analisis' deben ser únicos.
    """
    # Opcional: Verificar si ya existe una combinación idéntica para evitar errores de BD directamente
    # existing = crud_procesamiento.get_ciclo_procesamiento_by_identificador_and_fecha(
    #     db,
    #     identificador_lote=ciclo_proc_create.identificador_lote,
    #     fecha_hora_lote=ciclo_proc_create.fecha_hora_lote,
    #     tipo_analisis=ciclo_proc_create.tipo_analisis
    # )
    # if existing:
    #     raise HTTPException(
    #         status_code=status.HTTP_409_CONFLICT,
    #         detail="Ya existe un ciclo de procesamiento con el mismo identificador, fecha/hora y tipo de análisis."
    #     )
    try:
        return crud_procesamiento.create_ciclo_procesamiento(
            db=db, ciclo_proc_create=ciclo_proc_create
        )
    except (
        Exception
    ) as e:  # Captura genérica, idealmente se capturarían IntegrityError de SQLAlchemy
        # En producción, loguear 'e' detalladamente
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear el ciclo de procesamiento: {e}",  # No exponer detalles sensibles de 'e' al cliente en producción
        )


@router.get(
    "/{tipo_analisis}/", response_model=List[schemas_proc.CicloProcesamientoInDB]
)
def read_ciclos_procesamiento_by_tipo(
    tipo_analisis: str,  # "nitrogeno" o "cenizas"
    db: Session = Depends(database.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Obtiene una lista de ciclos de procesamiento para un tipo de análisis específico,
    ordenados por fecha_hora_lote descendente (los más recientes primero).
    """
    if tipo_analisis not in ["nitrogeno", "cenizas"]:  # Validar tipos permitidos
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipo de análisis no válido. Debe ser 'nitrogeno' o 'cenizas'.",
        )
    ciclos_proc = crud_procesamiento.get_ciclos_procesamiento_by_tipo(
        db, tipo_analisis=tipo_analisis, skip=skip, limit=limit
    )
    return ciclos_proc


@router.get(
    "/id/{ciclo_proc_id}/",  # Distinguir path de búsqueda por tipo
    response_model=schemas_proc.CicloProcesamientoInDB,
)
def read_ciclo_procesamiento_by_id(
    ciclo_proc_id: int, db: Session = Depends(database.get_db)
):
    """
    Obtiene un ciclo de procesamiento específico por su ID.
    """
    db_ciclo_proc = crud_procesamiento.get_ciclo_procesamiento_by_id(
        db, ciclo_proc_id=ciclo_proc_id
    )
    if db_ciclo_proc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ciclo de procesamiento no encontrado.",
        )
    return db_ciclo_proc


@router.put("/{ciclo_proc_id}/", response_model=schemas_proc.CicloProcesamientoInDB)
def update_existing_ciclo_procesamiento(
    ciclo_proc_id: int,
    ciclo_proc_update: schemas_proc.CicloProcesamientoUpdate,
    db: Session = Depends(database.get_db),
):
    """
    Actualiza un ciclo de procesamiento existente.
    No permite cambiar el 'tipo_analisis'.
    """
    updated_ciclo_proc = crud_procesamiento.update_ciclo_procesamiento(
        db, ciclo_proc_id=ciclo_proc_id, ciclo_proc_update=ciclo_proc_update
    )
    if updated_ciclo_proc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ciclo de procesamiento no encontrado para actualizar.",
        )
    return updated_ciclo_proc


@router.delete("/{ciclo_proc_id}/", response_model=Msg)
def delete_existing_ciclo_procesamiento(
    ciclo_proc_id: int, db: Session = Depends(database.get_db)
):
    """
    Borra un ciclo de procesamiento y todos sus registros de análisis asociados
    (debido a cascade="all, delete-orphan" en el modelo).
    """
    deleted = crud_procesamiento.delete_ciclo_procesamiento(
        db, ciclo_proc_id=ciclo_proc_id
    )
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ciclo de procesamiento no encontrado para borrar.",
        )
    return {
        "message": "Ciclo de procesamiento y sus registros asociados borrados exitosamente."
    }
