# backend_funglusapp/app/routers/formulacion_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional # Asegúrate que Optional esté aquí
from app.db import database
from app.schemas import formulacion_schemas as schemas
from app.crud import crud_formulacion as crud

router = APIRouter(
    prefix="/formulacion",
    tags=["Formulación"],
)

@router.put("/{ciclo_id}", response_model=schemas.FormulacionInDB) # Cambiado de POST
def update_formulacion_data(ciclo_id: str, entry_data: schemas.FormulacionUpdate, db: Session = Depends(database.get_db)):
    updated_entry = crud.update_formulacion_entry_by_ciclo(db=db, ciclo_id=ciclo_id, entry_data=entry_data)
    if not updated_entry:
        raise HTTPException(status_code=404, detail=f"Entrada de formulación para ciclo '{ciclo_id}' no encontrada.")
    return updated_entry

@router.get("/ciclo/{ciclo_id}", response_model=schemas.FormulacionInDB) # Devuelve un objeto
def read_single_formulacion_by_ciclo(ciclo_id: str, db: Session = Depends(database.get_db)):
    entry = crud.get_single_formulacion_entry_by_ciclo(db, ciclo=ciclo_id) # Usa la nueva función CRUD
    if not entry:
        raise HTTPException(status_code=404, detail=f"No hay entrada de formulación para el ciclo {ciclo_id}")
    return entry

@router.get("/", response_model=List[schemas.FormulacionInDB]) # Para obtener todas
def read_all_formulaciones_data(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_all_formulacion_entries(db=db, skip=skip, limit=limit)