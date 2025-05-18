# backend_funglusapp/app/routers/ciclo_data_router.py
from typing import List

from app.crud import (
    crud_ciclo_data,  # Sigue importando el CRUD para get_distinct_ciclos
)
from app.db import database
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/ciclos",
    tags=["Ciclos - Utilidades"],  # Tag actualizado para reflejar su propósito
)

# El endpoint POST /{ciclo_id}/initialize_placeholders que teníamos aquí
# ya no es necesario porque la lógica de "get_or_create"
# se maneja en los routers de cada entidad específica
# (ej. POST /laboratorio/materia_prima/entry).


@router.get("/distinct", response_model=List[str])
def list_distinct_ciclos(db: Session = Depends(database.get_db)):
    """
    Devuelve una lista de todos los IDs de ciclo únicos que existen.
    Se basa en la tabla de referencia definida en crud_ciclo_data.get_distinct_ciclos
    (ej. MateriaPrima).
    """
    ciclos = crud_ciclo_data.get_distinct_ciclos(db)
    return ciclos


# Si en el futuro necesitas otros endpoints generales para "Ciclos"
# (que no sean específicos de una tabla de datos como Gubys o MateriaPrima),
# los podrías añadir aquí. Por ejemplo, si "Ciclo" se convierte en una entidad
# propia con una tabla "ciclos_maestro" para guardar información sobre cada ciclo.
