from typing import List, Optional

from app.crud import crud_procesamiento
from app.db import database, models
from app.schemas import procesamiento_schemas as schemas_proc
from app.schemas.catalogo_schemas import Msg
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/registros-cenizas",
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
    try:
        return crud_procesamiento.create_registro_cenizas(
            db=db, registro_create=registro_create
        )
    except ValueError as ve:
        if "Ya existe un registro de cenizas" in str(ve):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(ve))
        elif "No existe una entrada en la Tabla General" in str(ve):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve)
            )
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))

# --- CORRECCIÓN AQUÍ: Nombre correcto del modelo RegistroAnalisisCenizas ---
@router.get(
    "/",
    response_model=List[schemas_proc.RegistroAnalisisCenizasInDB],
)
def read_registros_cenizas_filtered(
    ciclo_catalogo_id: Optional[int] = None,
    etapa_catalogo_id: Optional[int] = None,
    muestra_catalogo_id: Optional[int] = None,
    origen_catalogo_id: Optional[int] = None,
    db: Session = Depends(database.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Busca registros de cenizas con filtros opcionales.
    Esencial para que el Frontend encuentre el 'Lote' asociado a un ciclo de catálogo.
    """
    # SE USA models.RegistroAnalisisCenizas (nombre exacto en models.py)
    query = db.query(models.RegistroAnalisisCenizas) 

    if ciclo_catalogo_id:
        query = query.filter(models.RegistroAnalisisCenizas.ciclo_catalogo_id == ciclo_catalogo_id)
    if etapa_catalogo_id:
        query = query.filter(models.RegistroAnalisisCenizas.etapa_catalogo_id == etapa_catalogo_id)
    if muestra_catalogo_id:
        query = query.filter(models.RegistroAnalisisCenizas.muestra_catalogo_id == muestra_catalogo_id)
    if origen_catalogo_id:
        query = query.filter(models.RegistroAnalisisCenizas.origen_catalogo_id == origen_catalogo_id)
        
    return query.offset(skip).limit(limit).all()
# --------------------------------------------------------------------------

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
    db_registro_check = crud_procesamiento.get_registro_cenizas_by_id(
        db, registro_id=registro_id, eager_load_catalogs=False
    )
    if db_registro_check is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro no encontrado.",
        )
    try:
        updated_registro_internal = crud_procesamiento.update_registro_cenizas(
            db, registro_id=registro_id, registro_update=registro_update
        )
        return crud_procesamiento.get_registro_cenizas_by_id(
            db, registro_id=updated_registro_internal.id, eager_load_catalogs=True
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar: {e}",
        )

@router.delete("/{registro_id}/", response_model=Msg)
def delete_existing_registro_cenizas(
    registro_id: int, db: Session = Depends(database.get_db)
):
    deleted = crud_procesamiento.delete_registro_cenizas(db, registro_id=registro_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro no encontrado para borrar.",
        )
    return {"message": "Registro borrado exitosamente."}

@router.post(
    "/acciones/resincronizar-lote/{ciclo_proc_id}",
    response_model=Msg,
    summary="Re-sincroniza los resultados de un lote con la tabla general"
)
def resincronizar_lote_cenizas(
    ciclo_proc_id: int,
    db: Session = Depends(database.get_db)
):
    updated_count = crud_procesamiento.resincronizar_cenizas_en_tabla_general(
        db=db, ciclo_proc_id=ciclo_proc_id
    )
    return {
        "message": f"{updated_count} registros re-sincronizados exitosamente."
    }