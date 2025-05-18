# backend_funglusapp/app/crud/crud_laboratorio.py
from typing import List, Optional

from app.db import models
from app.schemas import (
    laboratorio_schemas as schemas,  # Asegúrate que esta importación sea correcta
)
from sqlalchemy import distinct
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session


# --- MATERIA PRIMA CRUD ---
def get_or_create_materia_prima_entry(
    db: Session, ciclo: str, origen: str, muestra: str
) -> models.MateriaPrima:
    clean_ciclo = ciclo.strip().upper()
    clean_origen = origen.strip().upper()
    clean_muestra = muestra.strip().upper()

    print(
        f"CRUD MateriaPrima: Buscando con ciclo='{clean_ciclo}', origen='{clean_origen}', muestra='{clean_muestra}'"
    )
    db_entry = (
        db.query(models.MateriaPrima)
        .filter(
            models.MateriaPrima.ciclo == clean_ciclo,
            models.MateriaPrima.origen == clean_origen,
            models.MateriaPrima.muestra == clean_muestra,
        )
        .first()
    )

    if db_entry:
        print(
            f"CRUD MateriaPrima: Placeholder YA EXISTE con key={db_entry.key} para ciclo='{clean_ciclo}', origen='{clean_origen}', muestra='{clean_muestra}'"
        )
        return db_entry
    else:
        print(
            f"CRUD MateriaPrima: No se encontró. Intentando crear placeholder para ciclo='{clean_ciclo}', origen='{clean_origen}', muestra='{clean_muestra}'"
        )
        new_entry = models.MateriaPrima(
            ciclo=clean_ciclo, origen=clean_origen, muestra=clean_muestra
        )
        db.add(new_entry)
        try:
            db.commit()
            db.refresh(new_entry)
            print(f"CRUD MateriaPrima: Placeholder CREADO con key={new_entry.key}")
            return new_entry
        except IntegrityError:
            db.rollback()
            print(
                f"CRUD MateriaPrima: IntegrityError al crear (probablemente condición de carrera). Re-consultando..."
            )
            existing_entry = (
                db.query(models.MateriaPrima)
                .filter(
                    models.MateriaPrima.ciclo == clean_ciclo,
                    models.MateriaPrima.origen == clean_origen,
                    models.MateriaPrima.muestra == clean_muestra,
                )
                .first()
            )
            if existing_entry:
                print(
                    f"CRUD MateriaPrima: Placeholder encontrado después de IntegrityError, key={existing_entry.key}"
                )
                return existing_entry
            else:
                print(
                    f"CRUD MateriaPrima: CRÍTICO - Falló el INSERT por unicidad pero no se encontró el registro después del rollback y re-consulta."
                )
                raise
        except Exception as e:
            db.rollback()
            print(f"CRUD MateriaPrima: ERROR GENERAL AL CREAR placeholder: {e}")
            raise


def update_materia_prima_entry(
    db: Session,
    ciclo: str,
    origen: str,
    muestra: str,
    entry_data: schemas.MateriaPrimaDataUpdate,
) -> Optional[models.MateriaPrima]:
    clean_ciclo = ciclo.strip().upper()
    clean_origen = origen.strip().upper()
    clean_muestra = muestra.strip().upper()

    db_entry = (
        db.query(models.MateriaPrima)
        .filter(
            models.MateriaPrima.ciclo == clean_ciclo,
            models.MateriaPrima.origen == clean_origen,
            models.MateriaPrima.muestra == clean_muestra,
        )
        .first()
    )
    if not db_entry:
        print(
            f"CRUD MateriaPrima: No se encontró entrada para actualizar con ciclo='{clean_ciclo}', origen='{clean_origen}', muestra='{clean_muestra}'"
        )
        return None

    update_data = entry_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_entry, key, value)

    # Cálculo para Hprom
    if db_entry.porc_h1 is not None and db_entry.porc_h2 is not None:
        db_entry.hprom = round((db_entry.porc_h1 + db_entry.porc_h2) / 2, 3)
    elif "porc_h1" in update_data or "porc_h2" in update_data:
        if "hprom" not in update_data:
            db_entry.hprom = None

    # Cálculo para Dprom
    if db_entry.d1 is not None and db_entry.d2 is not None and db_entry.d3 is not None:
        db_entry.dprom = round((db_entry.d1 + db_entry.d2 + db_entry.d3) / 3, 3)
    elif "d1" in update_data or "d2" in update_data or "d3" in update_data:
        if "dprom" not in update_data:
            db_entry.dprom = None

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    print(
        f"CRUD MateriaPrima: Entrada actualizada para ciclo='{clean_ciclo}', origen='{clean_origen}', muestra='{clean_muestra}'"
    )
    return db_entry


def get_all_materia_prima_entries(
    db: Session, skip: int = 0, limit: int = 100
) -> List[models.MateriaPrima]:
    return (
        db.query(models.MateriaPrima)
        .order_by(models.MateriaPrima.key.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# --- GUBYS CRUD --- (Clave: ciclo, origen)
def get_or_create_gubys_entry(db: Session, ciclo: str, origen: str) -> models.Gubys:
    clean_ciclo = ciclo.strip().upper()
    clean_origen = origen.strip().upper()

    print(f"CRUD Gubys: Buscando con ciclo='{clean_ciclo}', origen='{clean_origen}'")
    db_entry = (
        db.query(models.Gubys)
        .filter(models.Gubys.ciclo == clean_ciclo, models.Gubys.origen == clean_origen)
        .first()
    )
    if db_entry:
        print(
            f"CRUD Gubys: Placeholder YA EXISTE con key={db_entry.key} para ciclo='{clean_ciclo}', origen='{clean_origen}'"
        )
        return db_entry
    else:
        print(
            f"CRUD Gubys: No se encontró. Creando placeholder para ciclo='{clean_ciclo}', origen='{clean_origen}'"
        )
        new_entry = models.Gubys(ciclo=clean_ciclo, origen=clean_origen)
        db.add(new_entry)
        try:
            db.commit()
            db.refresh(new_entry)
            print(f"CRUD Gubys: Placeholder CREADO con key={new_entry.key}")
            return new_entry
        except IntegrityError:
            db.rollback()
            print(f"CRUD Gubys: IntegrityError al crear. Re-consultando...")
            existing_entry = (
                db.query(models.Gubys)
                .filter(
                    models.Gubys.ciclo == clean_ciclo,
                    models.Gubys.origen == clean_origen,
                )
                .first()
            )
            if existing_entry:
                print(
                    f"CRUD Gubys: Placeholder encontrado después de IntegrityError, key={existing_entry.key}"
                )
                return existing_entry
            else:
                print(
                    f"CRUD Gubys: CRÍTICO - Falló INSERT por unicidad pero no se encontró después."
                )
                raise
        except Exception as e:
            db.rollback()
            print(f"CRUD Gubys: ERROR GENERAL AL CREAR placeholder: {e}")
            raise


def update_gubys_entry(
    db: Session, ciclo: str, origen: str, entry_data: schemas.GubysDataUpdate
) -> Optional[models.Gubys]:
    clean_ciclo = ciclo.strip().upper()
    clean_origen = origen.strip().upper()

    db_entry = (
        db.query(models.Gubys)
        .filter(models.Gubys.ciclo == clean_ciclo, models.Gubys.origen == clean_origen)
        .first()
    )
    if not db_entry:
        print(
            f"CRUD Gubys: No se encontró entrada para actualizar con ciclo='{clean_ciclo}', origen='{clean_origen}'"
        )
        return None

    update_data = entry_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_entry, key, value)

    if db_entry.porc_h1 is not None and db_entry.porc_h2 is not None:
        db_entry.hprom = round((db_entry.porc_h1 + db_entry.porc_h2) / 2, 3)
    elif "porc_h1" in update_data or "porc_h2" in update_data:
        if "hprom" not in update_data:
            db_entry.hprom = None

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    print(
        f"CRUD Gubys: Entrada actualizada para ciclo='{clean_ciclo}', origen='{clean_origen}'"
    )
    return db_entry


def get_all_gubys_entries(
    db: Session, skip: int = 0, limit: int = 100
) -> List[models.Gubys]:
    return (
        db.query(models.Gubys)
        .order_by(models.Gubys.key.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# --- TAMO HUMEDO CRUD --- (Clave: ciclo, origen)
def get_or_create_tamo_humedo_entry(
    db: Session, ciclo: str, origen: str
) -> models.TamoHumedo:
    clean_ciclo = ciclo.strip().upper()
    clean_origen = origen.strip().upper()

    print(
        f"CRUD TamoHumedo: Buscando con ciclo='{clean_ciclo}', origen='{clean_origen}'"
    )
    db_entry = (
        db.query(models.TamoHumedo)
        .filter(
            models.TamoHumedo.ciclo == clean_ciclo,
            models.TamoHumedo.origen == clean_origen,
        )
        .first()
    )
    if db_entry:
        print(
            f"CRUD TamoHumedo: Placeholder YA EXISTE con key={db_entry.key} para ciclo='{clean_ciclo}', origen='{clean_origen}'"
        )
        return db_entry
    else:
        print(
            f"CRUD TamoHumedo: No se encontró. Creando placeholder para ciclo='{clean_ciclo}', origen='{clean_origen}'"
        )
        new_entry = models.TamoHumedo(ciclo=clean_ciclo, origen=clean_origen)
        db.add(new_entry)
        try:
            db.commit()
            db.refresh(new_entry)
            print(f"CRUD TamoHumedo: Placeholder CREADO con key={new_entry.key}")
            return new_entry
        except IntegrityError:
            db.rollback()
            print(f"CRUD TamoHumedo: IntegrityError al crear. Re-consultando...")
            existing_entry = (
                db.query(models.TamoHumedo)
                .filter(
                    models.TamoHumedo.ciclo == clean_ciclo,
                    models.TamoHumedo.origen == clean_origen,
                )
                .first()
            )
            if existing_entry:
                print(
                    f"CRUD TamoHumedo: Placeholder encontrado después de IntegrityError, key={existing_entry.key}"
                )
                return existing_entry
            else:
                print(
                    f"CRUD TamoHumedo: CRÍTICO - Falló INSERT por unicidad pero no se encontró después."
                )
                raise
        except Exception as e:
            db.rollback()
            print(f"CRUD TamoHumedo: ERROR GENERAL AL CREAR placeholder: {e}")
            raise


def update_tamo_humedo_entry(
    db: Session, ciclo: str, origen: str, entry_data: schemas.TamoHumedoDataUpdate
) -> Optional[models.TamoHumedo]:
    clean_ciclo = ciclo.strip().upper()
    clean_origen = origen.strip().upper()

    db_entry = (
        db.query(models.TamoHumedo)
        .filter(
            models.TamoHumedo.ciclo == clean_ciclo,
            models.TamoHumedo.origen == clean_origen,
        )
        .first()
    )
    if not db_entry:
        print(
            f"CRUD TamoHumedo: No se encontró entrada para actualizar con ciclo='{clean_ciclo}', origen='{clean_origen}'"
        )
        return None

    update_data = entry_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_entry, key, value)

    # Cálculo para Hprom
    if db_entry.porc_h1 is not None and db_entry.porc_h2 is not None:
        db_entry.hprom = round((db_entry.porc_h1 + db_entry.porc_h2) / 2, 3)
    elif "porc_h1" in update_data or "porc_h2" in update_data:
        if "hprom" not in update_data:
            db_entry.hprom = None

    # Cálculo para Dprom
    if db_entry.d1 is not None and db_entry.d2 is not None and db_entry.d3 is not None:
        db_entry.dprom = round((db_entry.d1 + db_entry.d2 + db_entry.d3) / 3, 3)
    elif "d1" in update_data or "d2" in update_data or "d3" in update_data:
        if "dprom" not in update_data:
            db_entry.dprom = None

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    print(
        f"CRUD TamoHumedo: Entrada actualizada para ciclo='{clean_ciclo}', origen='{clean_origen}'"
    )
    return db_entry


def get_all_tamo_humedo_entries(
    db: Session, skip: int = 0, limit: int = 100
) -> List[models.TamoHumedo]:
    return (
        db.query(models.TamoHumedo)
        .order_by(models.TamoHumedo.key.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
