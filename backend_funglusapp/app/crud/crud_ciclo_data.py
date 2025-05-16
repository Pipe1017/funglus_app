# backend_funglusapp/app/crud/crud_ciclo_data.py
from sqlalchemy.orm import Session
from sqlalchemy import distinct
from app.db import models
from typing import Tuple, Optional, List # Asegúrate que List esté aquí

# get_or_create_placeholder no necesita cambios
def get_or_create_placeholder(db: Session, model_class, ciclo_id: str):
    instance = db.query(model_class).filter(model_class.ciclo == ciclo_id).first()
    if not instance:
        print(f"Creando placeholder para {model_class.__tablename__} con ciclo_id: {ciclo_id}")
        instance_data = {"ciclo": ciclo_id}
        db_instance = model_class(**instance_data)
        db.add(db_instance)
        db.commit()
        db.refresh(db_instance)
        return db_instance
    return instance

def initialize_cycle_placeholders(db: Session, ciclo_id: str) -> dict:
    """
    Asegura que existan entradas placeholder para un ciclo_id en todas las tablas relevantes.
    """
    materia_prima_entry = get_or_create_placeholder(db, models.MateriaPrima, ciclo_id) # <--- AÑADIDO
    gubys_entry = get_or_create_placeholder(db, models.Gubys, ciclo_id)
    cenizas_entry = get_or_create_placeholder(db, models.Cenizas, ciclo_id)
    formulacion_entry = get_or_create_placeholder(db, models.Formulacion, ciclo_id)
    
    # Aquí añadirías llamadas para otros modelos (Armada, Volteo, etc.)
    # armada_entry = get_or_create_placeholder(db, models.Armada, ciclo_id)

    return {
        "message": f"Placeholders para ciclo '{ciclo_id}' verificados/creados.",
        "materia_prima_key": materia_prima_entry.key, # <--- AÑADIDO
        "gubys_key": gubys_entry.key,
        "cenizas_key": cenizas_entry.key,
        "formulacion_key": formulacion_entry.key,
        # "armada_key": armada_entry.key,
    }

def get_distinct_ciclos(db: Session) -> List[str]:
    # Podemos seguir usando Gubys como referencia, o cambiar a MateriaPrima si es el primero
    # O incluso hacer un UNION de ciclos de varias tablas si fuera necesario, pero una es suficiente.
    results = db.query(distinct(models.MateriaPrima.ciclo)).order_by(models.MateriaPrima.ciclo.desc()).all() # Cambiado a MateriaPrima como referencia
    return [result[0] for result in results if result[0]]
