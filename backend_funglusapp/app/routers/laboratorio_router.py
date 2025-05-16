# backend_funglusapp/app/routers/laboratorio_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db import database
from app.schemas import laboratorio_schemas as schemas
from app.crud import crud_laboratorio as crud

router = APIRouter(
    prefix="/laboratorio",
    tags=["Laboratorio"],
)

# --- GUBYS Endpoints ---
# (Tu código de endpoints para Gubys existente va aquí, sin cambios)
@router.put("/gubys/{ciclo_id}", response_model=schemas.GubysInDB)
def update_gubys_data(ciclo_id: str, entry_data: schemas.GubysUpdate, db: Session = Depends(database.get_db)):
    updated_entry = crud.update_gubys_entry_by_ciclo(db=db, ciclo_id=ciclo_id, entry_data=entry_data)
    if not updated_entry:
        raise HTTPException(status_code=404, detail=f"Entrada Gubys para ciclo '{ciclo_id}' no encontrada.")
    return updated_entry

@router.get("/gubys/ciclo/{ciclo_id}", response_model=schemas.GubysInDB)
def read_single_gubys_by_ciclo(ciclo_id: str, db: Session = Depends(database.get_db)):
    entry = crud.get_single_gubys_entry_by_ciclo(db, ciclo=ciclo_id)
    if not entry:
        raise HTTPException(status_code=404, detail=f"No hay entrada Gubys para el ciclo {ciclo_id}")
    return entry

@router.get("/gubys/", response_model=List[schemas.GubysInDB])
def read_all_gubys_data(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_all_gubys_entries(db=db, skip=skip, limit=limit)

# --- CENIZAS Endpoints ---
# (Tu código de endpoints para Cenizas existente va aquí, sin cambios)
@router.put("/cenizas/{ciclo_id}", response_model=schemas.CenizasInDB)
def update_cenizas_data(ciclo_id: str, entry_data: schemas.CenizasUpdate, db: Session = Depends(database.get_db)):
    updated_entry = crud.update_cenizas_entry_by_ciclo(db=db, ciclo_id=ciclo_id, entry_data=entry_data)
    if not updated_entry:
        raise HTTPException(status_code=404, detail=f"Entrada Cenizas para ciclo '{ciclo_id}' no encontrada.")
    return updated_entry

@router.get("/cenizas/ciclo/{ciclo_id}", response_model=schemas.CenizasInDB)
def read_single_cenizas_by_ciclo(ciclo_id: str, db: Session = Depends(database.get_db)):
    entry = crud.get_single_cenizas_entry_by_ciclo(db, ciclo=ciclo_id)
    if not entry:
        raise HTTPException(status_code=404, detail=f"No hay entrada Cenizas para el ciclo {ciclo_id}")
    return entry
    
@router.get("/cenizas/", response_model=List[schemas.CenizasInDB])
def read_all_cenizas_data(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_all_cenizas_entries(db=db, skip=skip, limit=limit)

# --- MATERIA PRIMA Endpoints --- (NUEVO)
@router.put("/materia_prima/{ciclo_id}", response_model=schemas.MateriaPrimaInDB)
def update_materia_prima_data(ciclo_id: str, entry_data: schemas.MateriaPrimaUpdate, db: Session = Depends(database.get_db)):
    updated_entry = crud.update_materia_prima_entry_by_ciclo(db=db, ciclo_id=ciclo_id, entry_data=entry_data)
    if not updated_entry:
        raise HTTPException(status_code=404, detail=f"Entrada Materia Prima para ciclo '{ciclo_id}' no encontrada.")
    return updated_entry

@router.get("/materia_prima/ciclo/{ciclo_id}", response_model=schemas.MateriaPrimaInDB)
def read_single_materia_prima_by_ciclo(ciclo_id: str, db: Session = Depends(database.get_db)):
    entry = crud.get_single_materia_prima_entry_by_ciclo(db, ciclo=ciclo_id)
    if not entry:
        raise HTTPException(status_code=404, detail=f"No hay entrada Materia Prima para el ciclo {ciclo_id}")
    return entry

@router.get("/materia_prima/", response_model=List[schemas.MateriaPrimaInDB])
def read_all_materia_prima_data(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_all_materia_prima_entries(db=db, skip=skip, limit=limit)
