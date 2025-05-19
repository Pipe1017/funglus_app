# backend_funglusapp/app/crud/crud_datos_generales.py
from typing import List, Optional

from app.db import models  # Tus modelos SQLAlchemy
from app.schemas import datos_schemas as schemas  # Tus schemas Pydantic para datos
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

# --- CRUD para DatosGeneralesLaboratorio ---


def get_datos_generales_entry(
    db: Session, ciclo_id: int, etapa_id: int, muestra_id: int, origen_id: int
) -> Optional[models.DatosGeneralesLaboratorio]:
    """Obtiene una entrada específica de DatosGeneralesLaboratorio por sus claves."""
    return (
        db.query(models.DatosGeneralesLaboratorio)
        .filter(
            models.DatosGeneralesLaboratorio.ciclo_id == ciclo_id,
            models.DatosGeneralesLaboratorio.etapa_id == etapa_id,
            models.DatosGeneralesLaboratorio.muestra_id == muestra_id,
            models.DatosGeneralesLaboratorio.origen_id == origen_id,
        )
        .first()
    )


def get_or_create_datos_generales_entry(
    db: Session, keys: schemas.DatosGeneralesKeys
) -> models.DatosGeneralesLaboratorio:
    """
    Obtiene una entrada de DatosGeneralesLaboratorio por sus claves.
    Si no existe, crea un nuevo placeholder.
    """
    print(
        f"CRUD DGL: Buscando con ciclo_id={keys.ciclo_id}, etapa_id={keys.etapa_id}, muestra_id={keys.muestra_id}, origen_id={keys.origen_id}"
    )
    db_entry = get_datos_generales_entry(
        db,
        ciclo_id=keys.ciclo_id,
        etapa_id=keys.etapa_id,
        muestra_id=keys.muestra_id,
        origen_id=keys.origen_id,
    )

    if db_entry:
        print(f"CRUD DGL: Entrada YA EXISTE con id={db_entry.id}")
        return db_entry
    else:
        print(f"CRUD DGL: No se encontró. Creando placeholder...")
        new_entry = models.DatosGeneralesLaboratorio(
            ciclo_id=keys.ciclo_id,
            etapa_id=keys.etapa_id,
            muestra_id=keys.muestra_id,
            origen_id=keys.origen_id,
            # Todos los demás campos de metadatos serán NULL por defecto
        )
        db.add(new_entry)
        try:
            db.commit()
            db.refresh(new_entry)
            print(f"CRUD DGL: Placeholder CREADO con id={new_entry.id}")
            return new_entry
        except (
            IntegrityError
        ):  # Debería ser raro aquí si la búsqueda inicial fue exhaustiva
            db.rollback()
            print(f"CRUD DGL: IntegrityError al crear. Re-consultando...")
            existing_entry = get_datos_generales_entry(
                db,
                ciclo_id=keys.ciclo_id,
                etapa_id=keys.etapa_id,
                muestra_id=keys.muestra_id,
                origen_id=keys.origen_id,
            )
            if existing_entry:
                print(
                    f"CRUD DGL: Placeholder encontrado después de IntegrityError, id={existing_entry.id}"
                )
                return existing_entry
            else:
                print(
                    f"CRUD DGL: CRÍTICO - Falló INSERT por unicidad pero no se encontró después."
                )
                raise
        except Exception as e:
            db.rollback()
            print(f"CRUD DGL: ERROR GENERAL AL CREAR placeholder: {e}")
            raise


def update_datos_generales_entry(
    db: Session,
    keys: schemas.DatosGeneralesKeys,
    data_update: schemas.DatosGeneralesUpdate,
) -> Optional[models.DatosGeneralesLaboratorio]:
    """Actualiza una entrada existente de DatosGeneralesLaboratorio."""
    db_entry = get_datos_generales_entry(
        db,
        ciclo_id=keys.ciclo_id,
        etapa_id=keys.etapa_id,
        muestra_id=keys.muestra_id,
        origen_id=keys.origen_id,
    )
    if not db_entry:
        print(
            f"CRUD DGL: No se encontró entrada para actualizar con claves: {keys.model_dump()}"
        )
        return None

    update_data_dict = data_update.model_dump(exclude_unset=True)
    print(
        f"CRUD DGL: Actualizando entrada id={db_entry.id} con datos: {update_data_dict}"
    )

    for key, value in update_data_dict.items():
        if hasattr(db_entry, key):
            setattr(db_entry, key, value)
        else:
            print(
                f"Advertencia CRUD DGL: El campo '{key}' no existe en el modelo DatosGeneralesLaboratorio."
            )

    # --- LÓGICA DE CÁLCULO ---
    # Humedad Promedio
    if db_entry.humedad_1_porc is not None and db_entry.humedad_2_porc is not None:
        db_entry.humedad_prom_porc = round(
            (db_entry.humedad_1_porc + db_entry.humedad_2_porc) / 2, 3
        )
        print(f"CRUD DGL: Humedad Promedio calculada: {db_entry.humedad_prom_porc}")
    # Si solo se actualiza uno de los dos, y no se envió humedad_prom_porc, podría ponerse a None
    elif "humedad_1_porc" in update_data_dict or "humedad_2_porc" in update_data_dict:
        if (
            "humedad_prom_porc" not in update_data_dict
        ):  # Solo si el cliente no envió un valor explícito
            db_entry.humedad_prom_porc = None

    # FDR Promedio
    if (
        db_entry.fdr_1_kgf is not None
        and db_entry.fdr_2_kgf is not None
        and db_entry.fdr_3_kgf is not None
    ):
        db_entry.fdr_prom_kgf = round(
            (db_entry.fdr_1_kgf + db_entry.fdr_2_kgf + db_entry.fdr_3_kgf) / 3, 3
        )
        print(f"CRUD DGL: FDR Promedio calculado: {db_entry.fdr_prom_kgf}")
    elif (
        "fdr_1_kgf" in update_data_dict
        or "fdr_2_kgf" in update_data_dict
        or "fdr_3_kgf" in update_data_dict
    ):
        if (
            "fdr_prom_kgf" not in update_data_dict
        ):  # Solo si el cliente no envió un valor explícito
            db_entry.fdr_prom_kgf = None

    # Los campos resultado_cenizas_porc, resultado_nitrogeno_total_porc, etc.,
    # se actualizarán desde los CRUD de DatosCenizas y DatosNitrogeno.

    try:
        db.add(db_entry)  # SQLAlchemy rastrea los cambios
        db.commit()
        db.refresh(db_entry)
        print(f"CRUD DGL: Entrada id={db_entry.id} actualizada exitosamente.")
        return db_entry
    except Exception as e:
        db.rollback()
        print(f"CRUD DGL: ERROR GENERAL AL ACTUALIZAR entrada id={db_entry.id}: {e}")
        raise


def get_datos_generales_by_ciclo(
    db: Session, ciclo_id: int, skip: int = 0, limit: int = 100
) -> List[models.DatosGeneralesLaboratorio]:
    """Obtiene todas las entradas de DatosGeneralesLaboratorio para un ciclo_id específico."""
    return (
        db.query(models.DatosGeneralesLaboratorio)
        .filter(models.DatosGeneralesLaboratorio.ciclo_id == ciclo_id)
        .order_by(
            models.DatosGeneralesLaboratorio.etapa_id,
            models.DatosGeneralesLaboratorio.muestra_id,
            models.DatosGeneralesLaboratorio.origen_id,
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def delete_datos_generales_entry(
    db: Session, ciclo_id: int, etapa_id: int, muestra_id: int, origen_id: int
) -> bool:
    """Borra una entrada específica de DatosGeneralesLaboratorio."""
    db_entry = get_datos_generales_entry(db, ciclo_id, etapa_id, muestra_id, origen_id)
    if not db_entry:
        return False

    # Considerar si el borrado de una entrada de datos generales debe afectar
    # a las entradas relacionadas en DatosCenizas o DatosNitrogeno.
    # Por ahora, solo borra la entrada de datos generales.
    try:
        db.delete(db_entry)
        db.commit()
        print(f"CRUD DGL: Entrada id={db_entry.id} BORRADA.")
        return True
    except Exception as e:
        db.rollback()
        print(f"CRUD DGL: ERROR AL BORRAR entrada id={db_entry.id}: {e}")
        return False  # O podrías levantar una excepción
