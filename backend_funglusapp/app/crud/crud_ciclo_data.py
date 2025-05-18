# backend_funglusapp/app/crud/crud_ciclo_data.py
from typing import List

from app.db import models
from sqlalchemy import distinct
from sqlalchemy.orm import Session

# La lógica de get_or_create_placeholder ahora está dentro de los CRUDs específicos
# para cada tabla (ej. crud_laboratorio.get_or_create_materia_prima_entry)
# porque las claves necesarias (ciclo, origen, muestra) varían.

# La función initialize_cycle_placeholders que creaba para TODAS las tablas
# basado solo en ciclo_id ya no es el enfoque principal.
# Cada entidad se obtiene o crea a través de su propio endpoint POST .../entry


def get_distinct_ciclos(db: Session) -> List[str]:
    """
    Obtiene una lista de todos los IDs de ciclo únicos que existen.
    Se basa en la tabla MateriaPrima como referencia, asumiendo que un ciclo
    debe tener al menos una entrada de materia prima para ser considerado "existente".
    Puedes cambiar la tabla de referencia si otra es más apropiada.
    """
    results = (
        db.query(distinct(models.MateriaPrima.ciclo))
        .order_by(models.MateriaPrima.ciclo.desc())
        .all()
    )
    # Alternativamente, si quieres ciclos de cualquier tabla de laboratorio:
    # ciclos_mp = set(r[0] for r in db.query(distinct(models.MateriaPrima.ciclo)).all() if r[0])
    # ciclos_gubys = set(r[0] for r in db.query(distinct(models.Gubys.ciclo)).all() if r[0])
    # ciclos_th = set(r[0] for r in db.query(distinct(models.TamoHumedo.ciclo)).all() if r[0])
    # all_distinct_ciclos = sorted(list(ciclos_mp.union(ciclos_gubys).union(ciclos_th)), reverse=True)
    # return all_distinct_ciclos
    return [result[0] for result in results if result[0]]
