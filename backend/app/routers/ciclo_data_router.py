# backend_funglusapp/app/routers/ciclo_data_router.py
from typing import List

from app.crud import crud_ciclo_data
from app.db import database
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/ciclos",
    tags=["Ciclos - Utilidades"],
)


@router.get("/distinct", response_model=List[str])
def list_distinct_ciclos(db: Session = Depends(database.get_db)):
    """
    Devuelve una lista de todos los nombres de ciclo únicos del catálogo.
    """
    ciclos = crud_ciclo_data.get_distinct_ciclos(db)
    return ciclos
