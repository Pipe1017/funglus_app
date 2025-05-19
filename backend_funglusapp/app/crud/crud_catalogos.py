# backend_funglusapp/app/crud/crud_catalogos.py
from typing import List, Optional, Type, TypeVar

from app.db import models
from app.db.database import Base
from app.schemas import catalogo_schemas as schemas
from sqlalchemy import func
from sqlalchemy.orm import Session

ModelType = TypeVar("ModelType", bound=Base)
# Ya no necesitamos CreateSchemaType y UpdateSchemaType aquí si las funciones específicas
# usan sus propios schemas y las genéricas no se llaman directamente desde el router para POST/PUT.
# O, si las genéricas se usan, deben ser consistentes.
# Por ahora, ajustaremos las específicas.


# --- CRUD para Ciclo ---
# (Sin cambios en las funciones de Ciclo)
def get_ciclo_by_id(db: Session, ciclo_id: int) -> Optional[models.Ciclo]:
    return db.query(models.Ciclo).filter(models.Ciclo.id == ciclo_id).first()


def get_ciclo_by_nombre(db: Session, nombre_ciclo: str) -> Optional[models.Ciclo]:
    clean_nombre_ciclo = nombre_ciclo.strip()
    return (
        db.query(models.Ciclo)
        .filter(func.lower(models.Ciclo.nombre_ciclo) == func.lower(clean_nombre_ciclo))
        .first()
    )


def get_all_ciclos(db: Session, skip: int = 0, limit: int = 100) -> List[models.Ciclo]:
    return (
        db.query(models.Ciclo)
        .order_by(models.Ciclo.nombre_ciclo)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_ciclo(db: Session, ciclo: schemas.CicloCreate) -> models.Ciclo:
    db_ciclo = models.Ciclo(
        nombre_ciclo=ciclo.nombre_ciclo.strip(),
        descripcion=ciclo.descripcion.strip() if ciclo.descripcion else None,
        fecha_inicio=ciclo.fecha_inicio,
    )
    db.add(db_ciclo)
    db.commit()
    db.refresh(db_ciclo)
    return db_ciclo


def update_ciclo(
    db: Session, ciclo_id: int, ciclo_update: schemas.CicloUpdate
) -> Optional[models.Ciclo]:
    db_ciclo = get_ciclo_by_id(db, ciclo_id)
    if not db_ciclo:
        return None
    update_data = ciclo_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            if key == "nombre_ciclo":
                setattr(db_ciclo, key, value.strip())
            elif key == "descripcion":
                setattr(db_ciclo, key, value.strip())
            else:
                setattr(db_ciclo, key, value)
    db.commit()
    db.refresh(db_ciclo)
    return db_ciclo


def delete_ciclo(db: Session, ciclo_id: int) -> bool:
    db_ciclo = get_ciclo_by_id(db, ciclo_id)
    if not db_ciclo:
        return False
    try:
        db.delete(db_ciclo)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        print(f"Error al borrar ciclo {ciclo_id}: {e}")
        return False


# --- CRUD Genérico para Catálogos Simples (Etapa, Muestra, Origen) ---
# Estas funciones genéricas SÍ esperan 'item_create' e 'item_update'
def get_catalogo_simple_by_id(
    db: Session, model_class: Type[ModelType], item_id: int
) -> Optional[ModelType]:
    return db.query(model_class).filter(model_class.id == item_id).first()


def get_catalogo_simple_by_nombre(
    db: Session, model_class: Type[ModelType], nombre: str
) -> Optional[ModelType]:
    clean_nombre = nombre.strip()
    return (
        db.query(model_class)
        .filter(func.lower(model_class.nombre) == func.lower(clean_nombre))
        .first()
    )


def get_all_catalogo_simple(
    db: Session, model_class: Type[ModelType], skip: int = 0, limit: int = 100
) -> List[ModelType]:
    return (
        db.query(model_class)
        .order_by(model_class.nombre)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_catalogo_simple(
    db: Session, model_class: Type[ModelType], item_create: schemas.CatalogoSimpleCreate
) -> ModelType:
    # ^^^^ Nota: CatalogoSimpleCreate es el tipo genérico.
    # Las funciones específicas de abajo pasarán el schema específico (EtapaCreate, etc.)
    # que debe ser compatible con CatalogoSimpleCreate.
    db_item = model_class(
        nombre=item_create.nombre.strip(),
        descripcion=(
            item_create.descripcion.strip() if item_create.descripcion else None
        ),
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_catalogo_simple(
    db: Session,
    model_class: Type[ModelType],
    item_id: int,
    item_update: schemas.CatalogoSimpleUpdate,
) -> Optional[ModelType]:
    db_item = get_catalogo_simple_by_id(db, model_class, item_id)
    if not db_item:
        return None
    update_data = item_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            if key == "nombre":
                setattr(db_item, key, value.strip())
            elif key == "descripcion":
                setattr(db_item, key, value.strip())
            else:
                setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item


def delete_catalogo_simple(
    db: Session, model_class: Type[ModelType], item_id: int
) -> bool:
    db_item = get_catalogo_simple_by_id(db, model_class, item_id)
    if not db_item:
        return False
    try:
        db.delete(db_item)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        print(
            f"Error al borrar item de catálogo {item_id} de {model_class.__name__}: {e}"
        )
        return False


# --- Funciones CRUD específicas que usan las genéricas ---
# CAMBIO: El parámetro para el schema ahora se llama 'item_create' para coincidir
# con cómo el router dinámico lo llama a través de current_config["crud_create"].


# ETAPA
def get_etapa_by_id(db: Session, etapa_id: int) -> Optional[models.Etapa]:
    return get_catalogo_simple_by_id(db, models.Etapa, etapa_id)


def get_etapa_by_nombre(db: Session, nombre: str) -> Optional[models.Etapa]:
    return get_catalogo_simple_by_nombre(db, models.Etapa, nombre)


def get_all_etapas(db: Session, skip: int = 0, limit: int = 100) -> List[models.Etapa]:
    return get_all_catalogo_simple(db, models.Etapa, skip, limit)


def create_etapa(
    db: Session, item_create: schemas.EtapaCreate
) -> models.Etapa:  # <--- CAMBIO AQUÍ: 'etapa' a 'item_create'
    return create_catalogo_simple(db, models.Etapa, item_create)


def update_etapa(
    db: Session, etapa_id: int, item_update: schemas.EtapaUpdate
) -> Optional[models.Etapa]:  # <--- CAMBIO AQUÍ: 'etapa_update' a 'item_update'
    return update_catalogo_simple(db, models.Etapa, etapa_id, item_update)


def delete_etapa(db: Session, etapa_id: int) -> bool:
    return delete_catalogo_simple(db, models.Etapa, etapa_id)


# MUESTRA
def get_muestra_by_id(db: Session, muestra_id: int) -> Optional[models.Muestra]:
    return get_catalogo_simple_by_id(db, models.Muestra, muestra_id)


def get_muestra_by_nombre(db: Session, nombre: str) -> Optional[models.Muestra]:
    return get_catalogo_simple_by_nombre(db, models.Muestra, nombre)


def get_all_muestras(
    db: Session, skip: int = 0, limit: int = 100
) -> List[models.Muestra]:
    return get_all_catalogo_simple(db, models.Muestra, skip, limit)


def create_muestra(
    db: Session, item_create: schemas.MuestraCreate
) -> models.Muestra:  # <--- CAMBIO AQUÍ: 'muestra' a 'item_create'
    return create_catalogo_simple(db, models.Muestra, item_create)


def update_muestra(
    db: Session, muestra_id: int, item_update: schemas.MuestraUpdate
) -> Optional[models.Muestra]:  # <--- CAMBIO AQUÍ: 'muestra_update' a 'item_update'
    return update_catalogo_simple(db, models.Muestra, muestra_id, item_update)


def delete_muestra(db: Session, muestra_id: int) -> bool:
    return delete_catalogo_simple(db, models.Muestra, muestra_id)


# ORIGEN
def get_origen_by_id(db: Session, origen_id: int) -> Optional[models.Origen]:
    return get_catalogo_simple_by_id(db, models.Origen, origen_id)


def get_origen_by_nombre(db: Session, nombre: str) -> Optional[models.Origen]:
    return get_catalogo_simple_by_nombre(db, models.Origen, nombre)


def get_all_origenes(
    db: Session, skip: int = 0, limit: int = 100
) -> List[models.Origen]:
    return get_all_catalogo_simple(db, models.Origen, skip, limit)


def create_origen(
    db: Session, item_create: schemas.OrigenCreate
) -> models.Origen:  # <--- CAMBIO AQUÍ: 'origen' a 'item_create'
    return create_catalogo_simple(db, models.Origen, item_create)


def update_origen(
    db: Session, origen_id: int, item_update: schemas.OrigenUpdate
) -> Optional[models.Origen]:  # <--- CAMBIO AQUÍ: 'origen_update' a 'item_update'
    return update_catalogo_simple(db, models.Origen, origen_id, item_update)


def delete_origen(db: Session, origen_id: int) -> bool:
    return delete_catalogo_simple(db, models.Origen, origen_id)
