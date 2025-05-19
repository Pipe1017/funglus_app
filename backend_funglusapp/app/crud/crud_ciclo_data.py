# backend_funglusapp/app/crud/crud_ciclo_data.py
from typing import List

from app.db import models  # Necesario para get_distinct_ciclos
from sqlalchemy import distinct
from sqlalchemy.orm import Session


def get_distinct_ciclos(db: Session) -> List[str]:
    """
    Obtiene una lista de todos los IDs de ciclo únicos que existen en la tabla catalogo_ciclos.
    """
    # Ahora que tenemos una tabla catalogo_ciclos, es mejor consultarla directamente.
    results = (
        db.query(distinct(models.Ciclo.nombre_ciclo))
        .order_by(models.Ciclo.nombre_ciclo.asc())
        .all()
    )
    return [result[0] for result in results if result[0]]
