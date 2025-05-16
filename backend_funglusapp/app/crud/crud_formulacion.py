# backend_funglusapp/app/crud/crud_formulacion.py
from sqlalchemy.orm import Session
from app.db import models
from app.schemas import formulacion_schemas as schemas
from typing import List, Optional

def update_formulacion_entry_by_ciclo(db: Session, ciclo_id: str, entry_data: schemas.FormulacionUpdate) -> Optional[models.Formulacion]:
    db_entry = db.query(models.Formulacion).filter(models.Formulacion.ciclo == ciclo_id).first()
    if not db_entry:
        return None

    # Actualiza db_entry con los datos del payload
    update_data_payload = entry_data.model_dump(exclude_unset=True)
    for key, value in update_data_payload.items():
        setattr(db_entry, key, value)

    # --- LÓGICA DE CÁLCULO PARA FORMULACIÓN ---
    # Ahora que db_entry tiene los valores de entrada actualizados, recalculamos
    # Asumimos que los porcentajes de entrada como db_entry.porc_n_entrada están en formato decimal (ej. 0.025 para 2.5%)
    # y que hprom_entrada está como decimal (ej. 0.70 para 70%)
    # Si no, necesitarás convertirlos (dividir por 100) ANTES de los cálculos.

    if db_entry.peso is not None and db_entry.hprom_entrada is not None:
        # Asegúrate que hprom_entrada es un decimal (ej. 0.0 a 1.0)
        # Si el usuario lo ingresa como 70 (para 70%), aquí deberías hacer:
        # hprom_decimal = db_entry.hprom_entrada / 100.0
        hprom_decimal = db_entry.hprom_entrada # Asumiendo que ya es decimal

        ms_kg = db_entry.peso * (1 - hprom_decimal)
        db_entry.ms_kg = round(ms_kg, 3) if ms_kg is not None else None

        if db_entry.porc_n_entrada is not None and db_entry.ms_kg is not None and db_entry.ms_kg > 0:
            # n_decimal = db_entry.porc_n_entrada / 100.0 # Si porc_n_entrada es %
            n_decimal = db_entry.porc_n_entrada # Asumiendo que ya es decimal
            n_kg = db_entry.ms_kg * n_decimal
            db_entry.n_kg = round(n_kg, 3) if n_kg is not None else None
            db_entry.porc_n_ms = round((db_entry.n_kg / db_entry.ms_kg) * 100, 2) if db_entry.n_kg is not None else None
        else: # Resetea si los inputs no son válidos
            db_entry.n_kg = None
            db_entry.porc_n_ms = None

        if db_entry.porc_cz_entrada is not None and db_entry.ms_kg is not None and db_entry.ms_kg > 0:
            # cz_decimal = db_entry.porc_cz_entrada / 100.0 # Si porc_cz_entrada es %
            cz_decimal = db_entry.porc_cz_entrada # Asumiendo que ya es decimal
            cz_kg = db_entry.ms_kg * cz_decimal
            db_entry.cz_kg = round(cz_kg, 3) if cz_kg is not None else None
            db_entry.porc_cz_ms = round((db_entry.cz_kg / db_entry.ms_kg) * 100, 2) if db_entry.cz_kg is not None else None

            # Cálculo de C (kg) y C/N (asumiendo factor de conversión para C desde Cenizas o M.O.)
            # Esto es una suposición: C = M.O.S * factor (ej. 0.58) o C = (100 - %Cz) * M.S * factor_carbono_en_MO
            # Necesitarás tu fórmula específica para C (kg)
            # Por ahora, placeholder si C_kg se deriva de otra parte:
            # db_entry.c_kg = ... 
            if db_entry.cz_kg is not None : # Ejemplo simple: Materia Orgánica Seca (MOS)
                mos_kg = db_entry.ms_kg - db_entry.cz_kg # Suposición simple
                db_entry.mos_kg = round(mos_kg, 3) if mos_kg >=0 else None
                # Asumiendo que el carbono es un % de la M.O.S (ej. 50-58%)
                # factor_C_en_MOS = 0.58 
                # db_entry.c_kg = db_entry.mos_kg * factor_C_en_MOS if db_entry.mos_kg is not None else None


            if db_entry.c_kg is not None and db_entry.n_kg is not None and db_entry.n_kg > 0:
                db_entry.c_n_ratio = round(db_entry.c_kg / db_entry.n_kg, 2)
            else:
                db_entry.c_n_ratio = None
        else: # Resetea si los inputs no son válidos
            db_entry.cz_kg = None
            db_entry.porc_cz_ms = None
            db_entry.c_kg = None
            db_entry.c_n_ratio = None
            db_entry.mos_kg = None

        # Otros cálculos como %N m.o.s, %Cz m.o.s dependerán de M.O.S (kg)
        # if db_entry.mos_kg is not None and db_entry.mos_kg > 0:
        #    db_entry.porc_n_mos = round((db_entry.n_kg / db_entry.mos_kg) * 100, 2) if db_entry.n_kg is not None else None
        #    db_entry.porc_cz_mos = ... # Necesitas definir cómo se calcula %Cz en base a m.o.s.
    else: # Si no hay peso o humedad, resetea todos los campos calculados
        fields_to_reset = ["ms_kg", "n_kg", "porc_n_ms", "cz_kg", "porc_cz_ms", "c_kg", "c_n_ratio", "mos_kg", "porc_n_mos", "porc_cz_mos"]
        for field in fields_to_reset:
            setattr(db_entry, field, None)

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

# GETs permanecen igual
def get_formulacion_entries_by_ciclo(db: Session, ciclo: str) -> List[models.Formulacion]:
    return db.query(models.Formulacion).filter(models.Formulacion.ciclo == ciclo).all() # Devuelve lista

def get_single_formulacion_entry_by_ciclo(db: Session, ciclo: str) -> Optional[models.Formulacion]: # Nueva función
    return db.query(models.Formulacion).filter(models.Formulacion.ciclo == ciclo).first()

def get_all_formulacion_entries(db: Session, skip: int = 0, limit: int = 100) -> List[models.Formulacion]:
    return db.query(models.Formulacion).offset(skip).limit(limit).all()