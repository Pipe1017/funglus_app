# backend_funglusapp/app/routers/ciclo_data_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import database
from app.crud import crud_ciclo_data # Importamos el CRUD
from typing import List

# Solo UNA definición del router
router = APIRouter(
    prefix="/ciclos", 
    tags=["Ciclos - Gestión de Datos"],
)

# Endpoint para inicializar placeholders
@router.post("/{ciclo_id}/initialize_placeholders", response_model=dict)
def initialize_data_for_cycle(ciclo_id: str, db: Session = Depends(database.get_db)):
    """
    Asegura que las entradas placeholder para las tablas principales
    (Gubys, Cenizas, Formulacion, etc.) sean creadas para el ciclo_id dado
    si no existen ya. Devuelve un mensaje y las keys de los registros.
    """
    if not ciclo_id.strip():
        raise HTTPException(status_code=400, detail="El ciclo_id no puede estar vacío.")
    
    try:
        result = crud_ciclo_data.initialize_cycle_placeholders(db, ciclo_id=ciclo_id)
        return result
    except Exception as e:
        print(f"Error inicializando placeholders para ciclo {ciclo_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno al inicializar datos del ciclo: {str(e)}")

# Endpoint para obtener ciclos distintos
@router.get("/distinct", response_model=List[str])
def list_distinct_ciclos(db: Session = Depends(database.get_db)):
    """
    Devuelve una lista de todos los IDs de ciclo únicos que han sido inicializados.
    """
    ciclos = crud_ciclo_data.get_distinct_ciclos(db)
    return ciclos
