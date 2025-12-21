# backend_funglusapp/app/routers/catalogo_router.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import crud_catalogos as crud
from app.db import database, models
from app.schemas import catalogo_schemas as schemas

router = APIRouter(
    prefix="/catalogos",
    tags=["Gestión de Catálogos"],
)

# --- Endpoints para Ciclos (sin cambios) ---
@router.post("/ciclos/", response_model=schemas.CicloInDB, status_code=status.HTTP_201_CREATED)
def create_new_ciclo(ciclo: schemas.CicloCreate, db: Session = Depends(database.get_db)):
    db_ciclo_existente = crud.get_ciclo_by_nombre(db, nombre_ciclo=ciclo.nombre_ciclo)
    if db_ciclo_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Un ciclo con el nombre '{ciclo.nombre_ciclo}' ya existe.",
        )
    return crud.create_ciclo(db=db, ciclo=ciclo)

@router.get("/ciclos/", response_model=List[schemas.CicloInDB])
def read_ciclos(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_all_ciclos(db, skip=skip, limit=limit)

@router.get("/ciclos/{ciclo_id}", response_model=schemas.CicloInDB)
def read_ciclo_by_id(ciclo_id: int, db: Session = Depends(database.get_db)):
    db_ciclo = crud.get_ciclo_by_id(db, ciclo_id=ciclo_id)
    if db_ciclo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ciclo no encontrado")
    return db_ciclo

@router.put("/ciclos/{ciclo_id}", response_model=schemas.CicloInDB)
def update_existing_ciclo(ciclo_id: int, ciclo_update: schemas.CicloUpdate, db: Session = Depends(database.get_db)):
    if ciclo_update.nombre_ciclo:
        existing_ciclo_by_name = crud.get_ciclo_by_nombre(db, nombre_ciclo=ciclo_update.nombre_ciclo)
        if existing_ciclo_by_name and existing_ciclo_by_name.id != ciclo_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Otro ciclo ya existe con el nombre '{ciclo_update.nombre_ciclo}'.",
            )
    db_ciclo = crud.update_ciclo(db, ciclo_id=ciclo_id, ciclo_update=ciclo_update)
    if db_ciclo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ciclo no encontrado para actualizar")
    return db_ciclo

@router.delete("/ciclos/{ciclo_id}", response_model=schemas.Msg)
def delete_existing_ciclo(ciclo_id: int, db: Session = Depends(database.get_db)):
    db_ciclo = crud.get_ciclo_by_id(db, ciclo_id=ciclo_id)
    if db_ciclo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ciclo no encontrado para borrar")
    if not crud.delete_ciclo(db, ciclo_id=ciclo_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se pudo borrar el ciclo. Puede estar en uso.",
        )
    return {"message": "Ciclo borrado exitosamente"}


# --- Endpoints Genéricos para Catálogos Simples ---

_catalogo_configs = [
    {
        "path": "etapas",
        "model_class": models.Etapa,
        "schema_in_db": schemas.EtapaInDB,
        "schema_create": schemas.EtapaCreate,
        "schema_update": schemas.EtapaUpdate,
        "crud_create": crud.create_etapa,
        "crud_get_all": crud.get_all_etapas,
        "crud_get_by_id": crud.get_etapa_by_id,
        "crud_get_by_nombre": crud.get_etapa_by_nombre,
        "crud_update": crud.update_etapa,
        "crud_delete": crud.delete_etapa,
        "singular_name": "Etapa",
    },
    {
        "path": "muestras",
        "model_class": models.Muestra,
        "schema_in_db": schemas.MuestraInDB,
        "schema_create": schemas.MuestraCreate,
        "schema_update": schemas.MuestraUpdate,
        "crud_create": crud.create_muestra,
        "crud_get_all": crud.get_all_muestras,
        "crud_get_by_id": crud.get_muestra_by_id,
        "crud_get_by_nombre": crud.get_muestra_by_nombre,
        "crud_update": crud.update_muestra,
        "crud_delete": crud.delete_muestra,
        "singular_name": "Muestra",
    },
    {
        "path": "origenes",
        "model_class": models.Origen,
        "schema_in_db": schemas.OrigenInDB,
        "schema_create": schemas.OrigenCreate,
        "schema_update": schemas.OrigenUpdate,
        "crud_create": crud.create_origen,
        "crud_get_all": crud.get_all_origenes,
        "crud_get_by_id": crud.get_origen_by_id,
        "crud_get_by_nombre": crud.get_origen_by_nombre,
        "crud_update": crud.update_origen,
        "crud_delete": crud.delete_origen,
        "singular_name": "Origen",
    },
    # --- ¡NUEVA CONFIGURACIÓN PARA SECUENCIA! ---
    {
        "path": "secuencias",
        "model_class": models.Secuencia,
        "schema_in_db": schemas.SecuenciaInDB,
        "schema_create": schemas.SecuenciaCreate,
        "schema_update": schemas.SecuenciaUpdate,
        "crud_create": crud.create_secuencia,
        "crud_get_all": crud.get_all_secuencias,
        "crud_get_by_id": crud.get_secuencia_by_id,
        "crud_get_by_nombre": crud.get_secuencia_by_nombre,
        "crud_update": crud.update_secuencia,
        "crud_delete": crud.delete_secuencia,
        "singular_name": "Secuencia",
    },
]

def _create_generic_endpoints(config: dict):
    """Factoría para crear los endpoints CRUD genéricos."""
    SchemaCreateType = config["schema_create"]
    SchemaUpdateType = config["schema_update"]

    @router.post(f"/{config['path']}/", response_model=config["schema_in_db"], status_code=status.HTTP_201_CREATED, summary=f"Crear {config['singular_name']}")
    def _create_item(item_data: SchemaCreateType, db: Session = Depends(database.get_db)):
        db_item_existente = config["crud_get_by_nombre"](db, nombre=item_data.nombre)
        if db_item_existente:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Un item en '{config['path']}' con el nombre '{item_data.nombre}' ya existe.")
        return config["crud_create"](db=db, item_create=item_data)

    @router.get(f"/{config['path']}/", response_model=List[config["schema_in_db"]], summary=f"Leer todas las {config['path']}")
    def _read_all_items(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
        return config["crud_get_all"](db, skip=skip, limit=limit)

    @router.get(f"/{config['path']}/{{item_id}}", response_model=config["schema_in_db"], summary=f"Leer un item de {config['path']} por ID")
    def _read_one_item(item_id: int, db: Session = Depends(database.get_db)):
        db_item = config["crud_get_by_id"](db, item_id=item_id)
        if db_item is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{config['singular_name']} no encontrado")
        return db_item

    @router.put(f"/{config['path']}/{{item_id}}", response_model=config["schema_in_db"], summary=f"Actualizar un item de {config['path']}")
    def _update_item(item_id: int, item_update: SchemaUpdateType, db: Session = Depends(database.get_db)):
        if hasattr(item_update, 'nombre') and item_update.nombre:
            existing_item = config["crud_get_by_nombre"](db, nombre=item_update.nombre)
            if existing_item and existing_item.id != item_id:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Otro item ya existe con el nombre '{item_update.nombre}'.")
        db_item = config["crud_update"](db, item_id=item_id, item_update=item_update)
        if db_item is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{config['singular_name']} no encontrado para actualizar")
        return db_item

    @router.delete(f"/{config['path']}/{{item_id}}", response_model=schemas.Msg, summary=f"Borrar un item de {config['path']}")
    def _delete_item(item_id: int, db: Session = Depends(database.get_db)):
        db_item_exists = config["crud_get_by_id"](db, item_id=item_id)
        if not db_item_exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{config['singular_name']} no encontrado para borrar")
        if not config["crud_delete"](db, item_id=item_id):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"No se pudo borrar el item. Puede estar en uso.")
        return {"message": f"{config['singular_name']} borrado exitosamente"}

# Crear los endpoints para cada configuración de catálogo
for item_config in _catalogo_configs:
    _create_generic_endpoints(item_config)