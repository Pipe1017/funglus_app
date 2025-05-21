# backend_funglusapp/app/crud/crud_catalogos.py
"""
Módulo para las operaciones CRUD (Crear, Leer, Actualizar, Borrar)
relacionadas con los modelos de catálogo: Ciclo, Etapa, Muestra y Origen.
"""
from typing import List, Optional, Type, TypeVar

from app.db import models
from app.db.database import Base  # Usado por ModelType
from app.schemas import catalogo_schemas as schemas
from sqlalchemy import func
from sqlalchemy.orm import Session

# Define un tipo genérico para los modelos de SQLAlchemy que heredan de Base.
ModelType = TypeVar("ModelType", bound=Base)


# --- Operaciones CRUD para el Catálogo de Ciclos ---


def get_ciclo_by_id(db: Session, ciclo_id: int) -> Optional[models.Ciclo]:
    """
    Obtiene un ciclo por su ID.

    Args:
        db: La sesión de base de datos.
        ciclo_id: El ID del ciclo a buscar.

    Returns:
        El objeto Ciclo si se encuentra, de lo contrario None.
    """
    return db.query(models.Ciclo).filter(models.Ciclo.id == ciclo_id).first()


def get_ciclo_by_nombre(db: Session, nombre_ciclo: str) -> Optional[models.Ciclo]:
    """
    Obtiene un ciclo por su nombre (insensible a mayúsculas/minúsculas y espacios).

    Args:
        db: La sesión de base de datos.
        nombre_ciclo: El nombre del ciclo a buscar.

    Returns:
        El objeto Ciclo si se encuentra, de lo contrario None.
    """
    clean_nombre_ciclo = nombre_ciclo.strip()
    return (
        db.query(models.Ciclo)
        .filter(func.lower(models.Ciclo.nombre_ciclo) == func.lower(clean_nombre_ciclo))
        .first()
    )


def get_all_ciclos(db: Session, skip: int = 0, limit: int = 100) -> List[models.Ciclo]:
    """
    Obtiene una lista de todos los ciclos, con paginación.

    Args:
        db: La sesión de base de datos.
        skip: Número de registros a saltar (para paginación).
        limit: Número máximo de registros a devolver.

    Returns:
        Una lista de objetos Ciclo.
    """
    return (
        db.query(models.Ciclo)
        .order_by(models.Ciclo.nombre_ciclo)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_ciclo(db: Session, ciclo: schemas.CicloCreate) -> models.Ciclo:
    """
    Crea un nuevo ciclo en la base de datos.

    Args:
        db: La sesión de base de datos.
        ciclo: El objeto schema CicloCreate con los datos del ciclo a crear.

    Returns:
        El objeto Ciclo recién creado.
    """
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
    """
    Actualiza un ciclo existente.

    Args:
        db: La sesión de base de datos.
        ciclo_id: El ID del ciclo a actualizar.
        ciclo_update: El objeto schema CicloUpdate con los campos a actualizar.

    Returns:
        El objeto Ciclo actualizado si se encuentra, de lo contrario None.
    """
    db_ciclo = get_ciclo_by_id(db, ciclo_id)
    if not db_ciclo:
        return None

    update_data = ciclo_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            # Limpiar espacios en blanco para campos de texto relevantes
            if key in ["nombre_ciclo", "descripcion"] and isinstance(value, str):
                setattr(db_ciclo, key, value.strip())
            else:
                setattr(db_ciclo, key, value)
    db.commit()
    db.refresh(db_ciclo)
    return db_ciclo


def delete_ciclo(db: Session, ciclo_id: int) -> bool:
    """
    Borra un ciclo de la base de datos.

    Args:
        db: La sesión de base de datos.
        ciclo_id: El ID del ciclo a borrar.

    Returns:
        True si el ciclo fue borrado exitosamente, False en caso contrario.
    """
    db_ciclo = get_ciclo_by_id(db, ciclo_id)
    if not db_ciclo:
        return False
    try:
        db.delete(db_ciclo)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        print(f"Error al borrar ciclo {ciclo_id}: {e}")  # Log del error en el servidor
        return False


# --- Operaciones CRUD Genéricas para Catálogos Simples (Etapa, Muestra, Origen) ---
# Estos catálogos comparten una estructura similar (ID, nombre, descripción).


def get_catalogo_simple_by_id(
    db: Session, model_class: Type[ModelType], item_id: int
) -> Optional[ModelType]:
    """
    Obtiene un item de catálogo simple por su ID.

    Args:
        db: La sesión de base de datos.
        model_class: La clase del modelo SQLAlchemy (e.g., models.Etapa).
        item_id: El ID del item a buscar.

    Returns:
        El objeto del catálogo si se encuentra, de lo contrario None.
    """
    return db.query(model_class).filter(model_class.id == item_id).first()


def get_catalogo_simple_by_nombre(
    db: Session, model_class: Type[ModelType], nombre: str
) -> Optional[ModelType]:
    """
    Obtiene un item de catálogo simple por su nombre (insensible a mayúsculas/minúsculas).

    Args:
        db: La sesión de base de datos.
        model_class: La clase del modelo SQLAlchemy.
        nombre: El nombre del item a buscar.

    Returns:
        El objeto del catálogo si se encuentra, de lo contrario None.
    """
    clean_nombre = nombre.strip()
    return (
        db.query(model_class)
        .filter(func.lower(model_class.nombre) == func.lower(clean_nombre))
        .first()
    )


def get_all_catalogo_simple(
    db: Session, model_class: Type[ModelType], skip: int = 0, limit: int = 100
) -> List[ModelType]:
    """
    Obtiene una lista de todos los items de un catálogo simple, con paginación.

    Args:
        db: La sesión de base de datos.
        model_class: La clase del modelo SQLAlchemy.
        skip: Número de registros a saltar.
        limit: Número máximo de registros a devolver.

    Returns:
        Una lista de objetos del catálogo.
    """
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
    """
    Crea un nuevo item en un catálogo simple.
    Los schemas específicos (EtapaCreate, MuestraCreate, etc.) deben ser compatibles
    con CatalogoSimpleCreate.

    Args:
        db: La sesión de base de datos.
        model_class: La clase del modelo SQLAlchemy.
        item_create: El objeto schema con los datos del item a crear.

    Returns:
        El objeto del catálogo recién creado.
    """
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
    """
    Actualiza un item existente en un catálogo simple.

    Args:
        db: La sesión de base de datos.
        model_class: La clase del modelo SQLAlchemy.
        item_id: El ID del item a actualizar.
        item_update: El objeto schema con los campos a actualizar.

    Returns:
        El objeto del catálogo actualizado si se encuentra, de lo contrario None.
    """
    db_item = get_catalogo_simple_by_id(db, model_class, item_id)
    if not db_item:
        return None

    update_data = item_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            # Asumimos que los campos de catálogo simple relevantes para strip son 'nombre' y 'descripcion'
            if key in ["nombre", "descripcion"] and isinstance(value, str):
                setattr(db_item, key, value.strip())
            else:
                setattr(db_item, key, value)

    try:
        db.commit()
        db.refresh(db_item)
    except Exception as e:
        db.rollback()
        # Es importante relanzar o manejar el error de forma que el router lo capture
        # y devuelva una respuesta HTTP apropiada (e.g., 409 Conflict, 500).
        # Por ahora, hacemos log y relanzamos para que FastAPI lo maneje.
        print(
            f"Error al actualizar item de catálogo {item_id} de {model_class.__name__}: {e}"
        )
        raise  # Relanzar la excepción

    return db_item


def delete_catalogo_simple(
    db: Session, model_class: Type[ModelType], item_id: int
) -> bool:
    """
    Borra un item de un catálogo simple.

    Args:
        db: La sesión de base de datos.
        model_class: La clase del modelo SQLAlchemy.
        item_id: El ID del item a borrar.

    Returns:
        True si el item fue borrado exitosamente, False en caso contrario.
    """
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


# --- Funciones CRUD Específicas para Etapa ---


def get_etapa_by_id(db: Session, etapa_id: int) -> Optional[models.Etapa]:
    """Obtiene una etapa por su ID."""
    return get_catalogo_simple_by_id(db, models.Etapa, etapa_id)


def get_etapa_by_nombre(db: Session, nombre: str) -> Optional[models.Etapa]:
    """Obtiene una etapa por su nombre."""
    return get_catalogo_simple_by_nombre(db, models.Etapa, nombre)


def get_all_etapas(db: Session, skip: int = 0, limit: int = 100) -> List[models.Etapa]:
    """Obtiene todas las etapas."""
    return get_all_catalogo_simple(db, models.Etapa, skip, limit)


def create_etapa(db: Session, item_create: schemas.EtapaCreate) -> models.Etapa:
    """Crea una nueva etapa."""
    return create_catalogo_simple(db, models.Etapa, item_create)


def update_etapa(
    db: Session, item_id: int, item_update: schemas.EtapaUpdate
) -> Optional[models.Etapa]:
    """
    Actualiza una etapa existente.
    'item_id' es el ID de la etapa a actualizar.
    """
    return update_catalogo_simple(db, models.Etapa, item_id, item_update)


def delete_etapa(db: Session, etapa_id: int) -> bool:
    """Borra una etapa por su ID."""
    return delete_catalogo_simple(db, models.Etapa, etapa_id)


# --- Funciones CRUD Específicas para Muestra ---


def get_muestra_by_id(db: Session, muestra_id: int) -> Optional[models.Muestra]:
    """Obtiene una muestra por su ID."""
    return get_catalogo_simple_by_id(db, models.Muestra, muestra_id)


def get_muestra_by_nombre(db: Session, nombre: str) -> Optional[models.Muestra]:
    """Obtiene una muestra por su nombre."""
    return get_catalogo_simple_by_nombre(db, models.Muestra, nombre)


def get_all_muestras(
    db: Session, skip: int = 0, limit: int = 100
) -> List[models.Muestra]:
    """Obtiene todas las muestras."""
    return get_all_catalogo_simple(db, models.Muestra, skip, limit)


def create_muestra(db: Session, item_create: schemas.MuestraCreate) -> models.Muestra:
    """Crea una nueva muestra."""
    return create_catalogo_simple(db, models.Muestra, item_create)


def update_muestra(
    db: Session, item_id: int, item_update: schemas.MuestraUpdate
) -> Optional[models.Muestra]:
    """
    Actualiza una muestra existente.
    'item_id' es el ID de la muestra a actualizar.
    """
    return update_catalogo_simple(db, models.Muestra, item_id, item_update)


def delete_muestra(db: Session, muestra_id: int) -> bool:
    """Borra una muestra por su ID."""
    return delete_catalogo_simple(db, models.Muestra, muestra_id)


# --- Funciones CRUD Específicas para Origen ---


def get_origen_by_id(db: Session, origen_id: int) -> Optional[models.Origen]:
    """Obtiene un origen por su ID."""
    return get_catalogo_simple_by_id(db, models.Origen, origen_id)


def get_origen_by_nombre(db: Session, nombre: str) -> Optional[models.Origen]:
    """Obtiene un origen por su nombre."""
    return get_catalogo_simple_by_nombre(db, models.Origen, nombre)


def get_all_origenes(
    db: Session, skip: int = 0, limit: int = 100
) -> List[models.Origen]:
    """Obtiene todos los orígenes."""
    return get_all_catalogo_simple(db, models.Origen, skip, limit)


def create_origen(db: Session, item_create: schemas.OrigenCreate) -> models.Origen:
    """Crea un nuevo origen."""
    return create_catalogo_simple(db, models.Origen, item_create)


def update_origen(
    db: Session, item_id: int, item_update: schemas.OrigenUpdate
) -> Optional[models.Origen]:
    """
    Actualiza un origen existente.
    'item_id' es el ID del origen a actualizar.
    """
    return update_catalogo_simple(db, models.Origen, item_id, item_update)


def delete_origen(db: Session, origen_id: int) -> bool:
    """Borra un origen por su ID."""
    return delete_catalogo_simple(db, models.Origen, origen_id)
