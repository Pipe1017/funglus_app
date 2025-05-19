# backend_funglusapp/app/crud/crud_datos_cenizas.py

from typing import List, Optional

from app.crud import crud_datos_generales
from app.db import models
from app.schemas import datos_schemas as schemas
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

# --- CRUD para DatosCenizas ---


def get_datos_cenizas_by_id(
    db: Session, analisis_id: int
) -> Optional[models.DatosCenizas]:
    """Obtiene un análisis de cenizas específico por su ID de análisis."""
    return (
        db.query(models.DatosCenizas)
        .filter(models.DatosCenizas.id == analisis_id)
        .first()
    )


def get_datos_cenizas_by_keys(
    db: Session,
    ciclo_id: int,
    etapa_id: int,
    muestra_id: int,
    origen_id: int,
    fecha_analisis_cenizas: str,
) -> Optional[models.DatosCenizas]:
    """Obtiene un análisis de cenizas específico por su conjunto de claves únicas."""
    return (
        db.query(models.DatosCenizas)
        .filter(
            models.DatosCenizas.ciclo_id == ciclo_id,
            models.DatosCenizas.etapa_id == etapa_id,
            models.DatosCenizas.muestra_id == muestra_id,
            models.DatosCenizas.origen_id == origen_id,
            models.DatosCenizas.fecha_analisis_cenizas == fecha_analisis_cenizas,
        )
        .first()
    )


def get_all_datos_cenizas_for_context(
    db: Session,
    ciclo_id: int,
    etapa_id: int,
    muestra_id: int,
    origen_id: int,
    skip: int = 0,
    limit: int = 100,
) -> List[models.DatosCenizas]:
    """Obtiene todos los análisis de cenizas para una combinación de Ciclo/Etapa/Muestra/Origen."""
    return (
        db.query(models.DatosCenizas)
        .filter(
            models.DatosCenizas.ciclo_id == ciclo_id,
            models.DatosCenizas.etapa_id == etapa_id,
            models.DatosCenizas.muestra_id == muestra_id,
            models.DatosCenizas.origen_id == origen_id,
        )
        .order_by(models.DatosCenizas.fecha_analisis_cenizas.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_datos_cenizas_entry(
    db: Session, entry_create: schemas.DatosCenizasCreate
) -> models.DatosCenizas:
    """Crea una nueva entrada de análisis de cenizas."""

    existing_entry = get_datos_cenizas_by_keys(
        db,
        ciclo_id=entry_create.ciclo_id,
        etapa_id=entry_create.etapa_id,
        muestra_id=entry_create.muestra_id,
        origen_id=entry_create.origen_id,
        fecha_analisis_cenizas=entry_create.fecha_analisis_cenizas,
    )
    if existing_entry:
        print(
            f"CRUD DatosCenizas: Ya existe una entrada con estas claves. ID existente: {existing_entry.id}"
        )
        raise IntegrityError(
            "Entrada duplicada para DatosCenizas con las mismas claves.",
            params=entry_create.model_dump(),
            orig=None,
        )

    db_entry_data = entry_create.model_dump()
    db_entry = models.DatosCenizas(**db_entry_data)

    # Cálculo del porcentaje de cenizas
    a = db_entry.peso_crisol_vacio_g
    b = db_entry.peso_crisol_mas_muestra_g
    c = db_entry.peso_crisol_mas_cenizas_g

    if a is not None and b is not None and c is not None and (b - a) != 0:
        try:
            db_entry.cenizas_porc = round(((c - a) / (b - a)) * 100, 2)
            print(f"CRUD DatosCenizas: % Cenizas calculado: {db_entry.cenizas_porc}")
        except ZeroDivisionError:
            print("CRUD DatosCenizas: División por cero al calcular % Cenizas.")
            db_entry.cenizas_porc = None
        except Exception as e:
            print(f"CRUD DatosCenizas: Error al calcular % Cenizas: {e}")
            db_entry.cenizas_porc = None
    else:
        db_entry.cenizas_porc = None
        print(
            f"CRUD DatosCenizas: Faltan datos para calcular % Cenizas (a,b,c): a={a}, b={b}, c={c}"
        )

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)

    if db_entry.cenizas_porc is not None:
        keys_generales = schemas.DatosGeneralesKeys(
            ciclo_id=db_entry.ciclo_id,
            etapa_id=db_entry.etapa_id,
            muestra_id=db_entry.muestra_id,
            origen_id=db_entry.origen_id,
        )
        update_payload = schemas.DatosGeneralesUpdate(
            resultado_cenizas_porc=db_entry.cenizas_porc
        )
        crud_datos_generales.update_datos_generales_entry(
            db, keys=keys_generales, data_update=update_payload
        )
        print("CRUD DatosCenizas: Resumen actualizado en DatosGeneralesLaboratorio.")

    return db_entry


def update_datos_cenizas_entry(
    db: Session, analisis_id: int, entry_update: schemas.DatosCenizasUpdate
) -> Optional[models.DatosCenizas]:
    """Actualiza una entrada existente de análisis de cenizas por su ID."""
    db_entry = get_datos_cenizas_by_id(db, analisis_id)
    if not db_entry:
        return None

    update_data_dict = entry_update.model_dump(exclude_unset=True)
    print(
        f"CRUD DatosCenizas: Actualizando entrada id={analisis_id} con datos: {update_data_dict}"
    )

    for key, value in update_data_dict.items():
        if hasattr(db_entry, key):
            setattr(db_entry, key, value)

    a = db_entry.peso_crisol_vacio_g
    b = db_entry.peso_crisol_mas_muestra_g
    c = db_entry.peso_crisol_mas_cenizas_g

    if a is not None and b is not None and c is not None and (b - a) != 0:
        try:
            db_entry.cenizas_porc = round(((c - a) / (b - a)) * 100, 2)
            print(f"CRUD DatosCenizas: % Cenizas recalculado: {db_entry.cenizas_porc}")
        except ZeroDivisionError:
            db_entry.cenizas_porc = None
        except Exception:
            db_entry.cenizas_porc = None
    elif any(
        field in update_data_dict
        for field in [
            "peso_crisol_vacio_g",
            "peso_crisol_mas_muestra_g",
            "peso_crisol_mas_cenizas_g",
        ]
    ):
        if "cenizas_porc" not in update_data_dict:
            db_entry.cenizas_porc = None

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)

    if db_entry.cenizas_porc is not None:
        keys_generales = schemas.DatosGeneralesKeys(
            ciclo_id=db_entry.ciclo_id,
            etapa_id=db_entry.etapa_id,
            muestra_id=db_entry.muestra_id,
            origen_id=db_entry.origen_id,
        )
        update_payload = schemas.DatosGeneralesUpdate(
            resultado_cenizas_porc=db_entry.cenizas_porc
        )
        crud_datos_generales.update_datos_generales_entry(
            db, keys=keys_generales, data_update=update_payload
        )
        print("CRUD DatosCenizas: Resumen actualizado en DatosGeneralesLaboratorio.")

    return db_entry


def delete_datos_cenizas_entry(db: Session, analisis_id: int) -> bool:
    """Borra una entrada específica de análisis de cenizas por su ID."""
    db_entry = get_datos_cenizas_by_id(db, analisis_id)
    if not db_entry:
        return False
    try:
        db.delete(db_entry)
        db.commit()
        print(f"CRUD DatosCenizas: Entrada id={analisis_id} BORRADA.")
        return True
    except Exception as e:
        db.rollback()
        print(f"CRUD DatosCenizas: ERROR al borrar entrada id={analisis_id}: {e}")
        return False
