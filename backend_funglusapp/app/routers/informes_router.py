# backend_funglusapp/app/routers/informes_router.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import database
from app.crud import crud_informes
from app.schemas import informe_schemas

router = APIRouter(
    prefix="/informes",
    tags=["Informes"],
)

@router.get(
    "/resumen/{ciclo_id}",
    response_model=List[informe_schemas.InformeResumenRow],
    summary="Obtener el resumen de resultados para un ciclo"
)
def get_resumen_ciclo(ciclo_id: int, db: Session = Depends(database.get_db)):
    """
    Genera y devuelve un informe de resumen para un ciclo específico.
    
    - Agrupa los datos por Etapa, Muestra y Origen.
    - Si para una combinación hay múltiples secuencias, calcula el **promedio** de los resultados.
    - Si solo hay una secuencia, muestra el **valor individual**.
    """
    informe_data = crud_informes.get_informe_resumen_by_ciclo(db=db, ciclo_id=ciclo_id)
    if not informe_data:
        # Devolver una lista vacía es aceptable, no necesariamente un error 404.
        return []
    return informe_data