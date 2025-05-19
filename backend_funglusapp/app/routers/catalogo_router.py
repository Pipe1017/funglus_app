# backend_funglusapp/app/routers/catalogo_router.py
from typing import List

from app.crud import crud_catalogos as crud
from app.db import database, models
from app.schemas import catalogo_schemas as schemas
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/catalogos",
    tags=["Gestión de Catálogos"],
)


# --- Endpoints para Ciclos ---
@router.post(
    "/ciclos/", response_model=schemas.CicloInDB, status_code=status.HTTP_201_CREATED
)
def create_new_ciclo(
    ciclo: schemas.CicloCreate, db: Session = Depends(database.get_db)
):
    db_ciclo_existente = crud.get_ciclo_by_nombre(db, nombre_ciclo=ciclo.nombre_ciclo)
    if db_ciclo_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Un ciclo con el nombre '{ciclo.nombre_ciclo}' ya existe.",
        )
    return crud.create_ciclo(db=db, ciclo=ciclo)


@router.get("/ciclos/", response_model=List[schemas.CicloInDB])
def read_ciclos(
    skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)
):
    ciclos = crud.get_all_ciclos(db, skip=skip, limit=limit)
    return ciclos


@router.get("/ciclos/{ciclo_id}", response_model=schemas.CicloInDB)
def read_ciclo_by_id(ciclo_id: int, db: Session = Depends(database.get_db)):
    db_ciclo = crud.get_ciclo_by_id(db, ciclo_id=ciclo_id)
    if db_ciclo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Ciclo no encontrado"
        )
    return db_ciclo


@router.put("/ciclos/{ciclo_id}", response_model=schemas.CicloInDB)
def update_existing_ciclo(
    ciclo_id: int,
    ciclo_update: schemas.CicloUpdate,
    db: Session = Depends(database.get_db),
):
    if ciclo_update.nombre_ciclo:
        existing_ciclo_by_name = crud.get_ciclo_by_nombre(
            db, nombre_ciclo=ciclo_update.nombre_ciclo
        )
        if existing_ciclo_by_name and existing_ciclo_by_name.id != ciclo_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Otro ciclo ya existe con el nombre '{ciclo_update.nombre_ciclo}'.",
            )

    db_ciclo = crud.update_ciclo(db, ciclo_id=ciclo_id, ciclo_update=ciclo_update)
    if db_ciclo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ciclo no encontrado para actualizar",
        )
    return db_ciclo


@router.delete("/ciclos/{ciclo_id}", response_model=schemas.Msg)
def delete_existing_ciclo(ciclo_id: int, db: Session = Depends(database.get_db)):
    db_ciclo = crud.get_ciclo_by_id(db, ciclo_id=ciclo_id)
    if db_ciclo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ciclo no encontrado para borrar",
        )

    if not crud.delete_ciclo(db, ciclo_id=ciclo_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se pudo borrar el ciclo. Puede estar en uso o ya fue borrado.",
        )
    return {"message": "Ciclo borrado exitosamente"}


# --- Endpoints Genéricos para Etapa, Muestra, Origen ---
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
]

for config in _catalogo_configs:
    # Crear
    @router.post(
        f"/{config['path']}/",
        response_model=config["schema_in_db"],
        status_code=status.HTTP_201_CREATED,
        name=f"create_new_{config['singular_name'].lower().replace(' ', '_')}",
    )
    def _create_item_endpoint(
        item_data: config["schema_create"],
        db: Session = Depends(database.get_db),
        current_config=config,
    ):
        db_item_existente = current_config["crud_get_by_nombre"](
            db, nombre=item_data.nombre
        )
        if db_item_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Un item en '{current_config['path']}' con el nombre '{item_data.nombre}' ya existe.",
            )
        return current_config["crud_create"](db=db, item_create=item_data)

    # Leer Todos
    @router.get(
        f"/{config['path']}/",
        response_model=List[config["schema_in_db"]],
        name=f"read_all_{config['path']}",
    )
    def _read_items_endpoint(
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(database.get_db),
        current_config=config,
    ):
        items = current_config["crud_get_all"](db, skip=skip, limit=limit)
        return items

    # Leer Uno por ID
    @router.get(
        f"/{config['path']}/{{item_id}}",
        response_model=config["schema_in_db"],
        name=f"read_one_{config['singular_name'].lower().replace(' ', '_')}",
    )
    def _read_item_endpoint(
        item_id: int, db: Session = Depends(database.get_db), current_config=config
    ):
        db_item = current_config["crud_get_by_id"](db, item_id=item_id)
        if db_item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{current_config['singular_name']} no encontrado",
            )
        return db_item

    # Actualizar
    @router.put(
        f"/{config['path']}/{{item_id}}",
        response_model=config["schema_in_db"],
        name=f"update_one_{config['singular_name'].lower().replace(' ', '_')}",
    )
    def _update_item_endpoint(
        item_id: int,
        item_update: config["schema_update"],
        db: Session = Depends(database.get_db),
        current_config=config,
    ):
        if item_update.nombre:
            existing_item_by_name = current_config["crud_get_by_nombre"](
                db, nombre=item_update.nombre
            )
            if existing_item_by_name and existing_item_by_name.id != item_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Otro item en '{current_config['path']}' ya existe con el nombre '{item_update.nombre}'.",
                )

        db_item = current_config["crud_update"](
            db, item_id=item_id, item_update=item_update
        )
        if db_item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{current_config['singular_name']} no encontrado para actualizar",
            )
        return db_item

    # Borrar
    @router.delete(
        f"/{config['path']}/{{item_id}}",
        response_model=schemas.Msg,
        name=f"delete_one_{config['singular_name'].lower().replace(' ', '_')}",
    )
    def _delete_item_endpoint(
        item_id: int, db: Session = Depends(database.get_db), current_config=config
    ):
        db_item_exists = current_config["crud_get_by_id"](db, item_id=item_id)
        if not db_item_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{current_config['singular_name']} no encontrado para borrar",
            )

        if not current_config["crud_delete"](db, item_id=item_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"No se pudo borrar el item de '{current_config['path']}'. Puede estar en uso.",
            )
        return {"message": f"{current_config['singular_name']} borrado exitosamente"}
