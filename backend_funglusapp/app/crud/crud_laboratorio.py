# backend_funglusapp/app/crud/crud_laboratorio.py
from sqlalchemy.orm import Session
from sqlalchemy import distinct # Asegúrate que esta importación esté
from app.db import models
from app.schemas import laboratorio_schemas as schemas
from typing import List, Optional

# --- GUBYS CRUD ---
# (Tu código CRUD para Gubys existente va aquí, incluyendo el cálculo de Hprom)
def update_gubys_entry_by_ciclo(db: Session, ciclo_id: str, entry_data: schemas.GubysUpdate) -> Optional[models.Gubys]:
    db_entry = db.query(models.Gubys).filter(models.Gubys.ciclo == ciclo_id).first()
    if not db_entry:
        return None 

    update_data = entry_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_entry, key, value)

    porc_h1_value = db_entry.porc_h1
    porc_h2_value = db_entry.porc_h2

    if porc_h1_value is not None and porc_h2_value is not None:
        try:
            calculated_hprom = (float(porc_h1_value) + float(porc_h2_value)) / 2
            db_entry.hprom = round(calculated_hprom, 3)
            print(f"CRUD Gubys: Hprom calculado para ciclo {ciclo_id}: {db_entry.hprom}")
        except (ValueError, TypeError):
            print(f"CRUD Gubys: No se pudo calcular Hprom para ciclo {ciclo_id} debido a valores no numéricos para %H1 o %H2.")
    elif 'porc_h1' in update_data or 'porc_h2' in update_data:
        if 'hprom' not in update_data: # Solo setea a None si el cliente no envió un hprom explícito
             db_entry.hprom = None
             print(f"CRUD Gubys: Hprom establecido a None para ciclo {ciclo_id} porque falta %H1 o %H2.")

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def get_single_gubys_entry_by_ciclo(db: Session, ciclo: str) -> Optional[models.Gubys]:
    return db.query(models.Gubys).filter(models.Gubys.ciclo == ciclo).first()

def get_all_gubys_entries(db: Session, skip: int = 0, limit: int = 100) -> List[models.Gubys]:
    return db.query(models.Gubys).offset(skip).limit(limit).all()

# --- CENIZAS CRUD ---
# (Tu código CRUD para Cenizas existente va aquí)
def update_cenizas_entry_by_ciclo(db: Session, ciclo_id: str, entry_data: schemas.CenizasUpdate) -> Optional[models.Cenizas]:
    db_entry = db.query(models.Cenizas).filter(models.Cenizas.ciclo == ciclo_id).first()
    if not db_entry:
        return None

    update_data = entry_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_entry, key, value)
    
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def get_single_cenizas_entry_by_ciclo(db: Session, ciclo: str) -> Optional[models.Cenizas]:
    return db.query(models.Cenizas).filter(models.Cenizas.ciclo == ciclo).first()

def get_all_cenizas_entries(db: Session, skip: int = 0, limit: int = 100) -> List[models.Cenizas]:
    return db.query(models.Cenizas).offset(skip).limit(limit).all()

# --- MATERIA PRIMA CRUD --- (NUEVO)
def update_materia_prima_entry_by_ciclo(db: Session, ciclo_id: str, entry_data: schemas.MateriaPrimaUpdate) -> Optional[models.MateriaPrima]:
    db_entry = db.query(models.MateriaPrima).filter(models.MateriaPrima.ciclo == ciclo_id).first()
    if not db_entry:
        return None

    update_data = entry_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_entry, key, value)

    # Cálculo para Hprom en MateriaPrima
    porc_h1_mp = db_entry.porc_h1
    porc_h2_mp = db_entry.porc_h2
    if porc_h1_mp is not None and porc_h2_mp is not None:
        try:
            calculated_hprom_mp = (float(porc_h1_mp) + float(porc_h2_mp)) / 2
            db_entry.hprom = round(calculated_hprom_mp, 3)
            print(f"CRUD MateriaPrima: Hprom calculado para ciclo {ciclo_id}: {db_entry.hprom}")
        except (ValueError, TypeError):
            print(f"CRUD MateriaPrima: No se pudo calcular Hprom para ciclo {ciclo_id}.")
    elif 'porc_h1' in update_data or 'porc_h2' in update_data:
        if 'hprom' not in update_data:
             db_entry.hprom = None
             print(f"CRUD MateriaPrima: Hprom establecido a None para ciclo {ciclo_id} porque falta %H1 o %H2.")

    # Cálculo para Dprom en MateriaPrima
    d1_mp = db_entry.d1
    d2_mp = db_entry.d2
    d3_mp = db_entry.d3
    if d1_mp is not None and d2_mp is not None and d3_mp is not None:
        try:
            calculated_dprom_mp = (float(d1_mp) + float(d2_mp) + float(d3_mp)) / 3
            db_entry.dprom = round(calculated_dprom_mp, 3)
            print(f"CRUD MateriaPrima: Dprom calculado para ciclo {ciclo_id}: {db_entry.dprom}")
        except (ValueError, TypeError):
            print(f"CRUD MateriaPrima: No se pudo calcular Dprom para ciclo {ciclo_id}.")
    elif 'd1' in update_data or 'd2' in update_data or 'd3' in update_data:
        # Si alguno de los 'd' se actualiza pero no todos están presentes para el cálculo,
        # y el cliente no envió un 'dprom' explícito, lo ponemos a None.
        if 'dprom' not in update_data:
            db_entry.dprom = None
            print(f"CRUD MateriaPrima: Dprom establecido a None para ciclo {ciclo_id} porque falta d1, d2 o d3.")
            
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def get_single_materia_prima_entry_by_ciclo(db: Session, ciclo: str) -> Optional[models.MateriaPrima]:
    return db.query(models.MateriaPrima).filter(models.MateriaPrima.ciclo == ciclo).first()

def get_all_materia_prima_entries(db: Session, skip: int = 0, limit: int = 100) -> List[models.MateriaPrima]:
    return db.query(models.MateriaPrima).offset(skip).limit(limit).all()
