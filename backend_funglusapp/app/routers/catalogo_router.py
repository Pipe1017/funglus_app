# backend_funglusapp/app/routers/catalogo_router.py
from typing import Any, List  # Any para los tipos dinámicos de schema

from app.crud import crud_catalogos as crud
from app.db import database, models
from app.schemas import catalogo_schemas as schemas
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/catalogos",
    tags=["Gestión de Catálogos"],
)


# --- Endpoints para Ciclos (sin cambios, se mantienen como estaban) ---
@router.post(
    "/ciclos/", response_model=schemas.CicloInDB, status_code=status.HTTP_201_CREATED
)
def create_new_ciclo(
    ciclo: schemas.CicloCreate, db: Session = Depends(database.get_db)
):
    # ... (tu lógica existente para crear ciclo)
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
    # ... (tu lógica existente para leer ciclos)
    return crud.get_all_ciclos(db, skip=skip, limit=limit)


@router.get("/ciclos/{ciclo_id}", response_model=schemas.CicloInDB)
def read_ciclo_by_id(ciclo_id: int, db: Session = Depends(database.get_db)):
    # ... (tu lógica existente)
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
    # ... (tu lógica existente para actualizar ciclo)
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
    # ... (tu lógica existente para borrar ciclo)
    db_ciclo = crud.get_ciclo_by_id(
        db, ciclo_id=ciclo_id
    )  # Verificar existencia primero
    if db_ciclo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ciclo no encontrado para borrar",
        )
    if not crud.delete_ciclo(db, ciclo_id=ciclo_id):
        # Esta condición podría ser redundante si get_ciclo_by_id ya verificó
        # O si delete_ciclo puede fallar por otras razones (ej. restricciones FK)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,  # O 500 si es un error inesperado
            detail="No se pudo borrar el ciclo. Puede estar en uso.",
        )
    return {"message": "Ciclo borrado exitosamente"}


# --- Endpoints Genéricos Refactorizados para Etapa, Muestra, Origen ---

_catalogo_configs = [
    # ... (tus definiciones de _catalogo_configs para Etapa, Muestra, Origen sin cambios) ...
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


def _create_generic_endpoints(config: dict):
    """Factoría para crear los endpoints CRUD genéricos."""

    # Tipos dinámicos para type hinting de los cuerpos de solicitud
    SchemaCreateType = config["schema_create"]
    SchemaUpdateType = config["schema_update"]

    def _create_item(
        item_data: SchemaCreateType, db: Session = Depends(database.get_db)
    ):
        db_item_existente = config["crud_get_by_nombre"](db, nombre=item_data.nombre)
        if db_item_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Un item en '{config['path']}' con el nombre '{item_data.nombre}' ya existe.",
            )
        return config["crud_create"](db=db, item_create=item_data)

    def _read_all_items(
        skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)
    ):
        return config["crud_get_all"](db, skip=skip, limit=limit)

    def _read_one_item(item_id: int, db: Session = Depends(database.get_db)):
        db_item = config["crud_get_by_id"](db, item_id=item_id)
        if db_item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{config['singular_name']} no encontrado",
            )
        return db_item

    def _update_item(
        item_id: int,
        item_update: SchemaUpdateType,
        db: Session = Depends(database.get_db),
    ):
        if (
            item_update.nombre
        ):  # Asumiendo que todos los SchemaUpdateType tienen un campo 'nombre' opcional
            existing_item_by_name = config["crud_get_by_nombre"](
                db, nombre=item_update.nombre
            )
            if existing_item_by_name and existing_item_by_name.id != item_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Otro item en '{config['path']}' ya existe con el nombre '{item_update.nombre}'.",
                )
        db_item = config["crud_update"](db, item_id=item_id, item_update=item_update)
        if db_item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{config['singular_name']} no encontrado para actualizar",
            )
        return db_item

    def _delete_item(item_id: int, db: Session = Depends(database.get_db)):
        db_item_exists = config["crud_get_by_id"](db, item_id=item_id)
        if not db_item_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{config['singular_name']} no encontrado para borrar",
            )
        if not config["crud_delete"](db, item_id=item_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,  # O 500 si es un error inesperado del CRUD
                detail=f"No se pudo borrar el item de '{config['path']}'. Puede estar en uso.",
            )
        return {"message": f"{config['singular_name']} borrado exitosamente"}

    # Registrar los endpoints usando las funciones internas
    router.post(
        f"/{config['path']}/",
        response_model=config["schema_in_db"],
        status_code=status.HTTP_201_CREATED,
        name=f"create_new_{config['singular_name'].lower().replace(' ', '_')}",
    )(_create_item)

    router.get(
        f"/{config['path']}/",
        response_model=List[config["schema_in_db"]],
        name=f"read_all_{config['path']}",
    )(_read_all_items)

    router.get(
        f"/{config['path']}/{{item_id}}",
        response_model=config["schema_in_db"],
        name=f"read_one_{config['singular_name'].lower().replace(' ', '_')}",
    )(_read_one_item)

    router.put(
        f"/{config['path']}/{{item_id}}",
        response_model=config["schema_in_db"],
        name=f"update_one_{config['singular_name'].lower().replace(' ', '_')}",
    )(_update_item)

    router.delete(
        f"/{config['path']}/{{item_id}}",
        response_model=schemas.Msg,
        name=f"delete_one_{config['singular_name'].lower().replace(' ', '_')}",
    )(_delete_item)


# Crear los endpoints para cada configuración de catálogo
for item_config in _catalogo_configs:
    _create_generic_endpoints(item_config)
