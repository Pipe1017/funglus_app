# backend_funglusapp/app/routers/laboratorio_router.py
from typing import List, Optional

from app.crud import crud_laboratorio as crud
from app.db import database
from app.schemas import laboratorio_schemas as schemas  # Usaremos los nuevos schemas
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/laboratorio",
    tags=["Laboratorio"],
)


# --- MATERIA PRIMA Endpoints ---
@router.post("/materia_prima/entry", response_model=schemas.MateriaPrimaInDB)
def get_or_create_materia_prima(
    keys: schemas.MateriaPrimaKeys,  # El POST sigue esperando solo las claves
    db: Session = Depends(database.get_db),
):
    if not all([keys.ciclo, keys.origen, keys.muestra]):
        raise HTTPException(
            status_code=400,
            detail="Ciclo, origen y muestra son requeridos para Materia Prima.",
        )
    db_entry = crud.get_or_create_materia_prima_entry(
        db, ciclo=keys.ciclo, origen=keys.origen, muestra=keys.muestra
    )
    return db_entry


@router.put("/materia_prima/entry", response_model=schemas.MateriaPrimaInDB)
def update_materia_prima_data_by_keys(
    payload: schemas.MateriaPrimaPutPayload,  # <--- CAMBIO AQUÍ: Recibe el payload combinado
    db: Session = Depends(database.get_db),
):
    # Extrae los datos de actualización del payload.
    # Los campos que no están en MateriaPrimaDataUpdate (como ciclo, origen, muestra, key)
    # no se pasarán a entry_data si usamos exclude_unset y el schema correcto.
    data_to_update_dict = payload.model_dump(
        exclude={"ciclo", "origen", "muestra"}, exclude_unset=True
    )

    updated_entry = crud.update_materia_prima_entry(
        db=db,
        ciclo=payload.ciclo,  # Toma las claves del payload
        origen=payload.origen,
        muestra=payload.muestra,
        entry_data=schemas.MateriaPrimaDataUpdate(
            **data_to_update_dict
        ),  # Pasa solo los datos actualizables
    )
    if not updated_entry:
        raise HTTPException(
            status_code=404,
            detail="Entrada Materia Prima no encontrada para actualizar (ciclo/origen/muestra no coinciden).",
        )
    return updated_entry


@router.get("/materia_prima/", response_model=List[schemas.MateriaPrimaInDB])
def read_all_materia_prima_data(
    skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)
):
    return crud.get_all_materia_prima_entries(db=db, skip=skip, limit=limit)


# --- GUBYS Endpoints ---
@router.post("/gubys/entry", response_model=schemas.GubysInDB)
def get_or_create_gubys(
    keys: schemas.GubysKeys,  # Cuerpo con ciclo, origen
    db: Session = Depends(database.get_db),
):
    if not all([keys.ciclo, keys.origen]):
        raise HTTPException(
            status_code=400, detail="Ciclo y origen son requeridos para Gubys."
        )
    db_entry = crud.get_or_create_gubys_entry(db, ciclo=keys.ciclo, origen=keys.origen)
    return db_entry


@router.put("/gubys/entry", response_model=schemas.GubysInDB)
def update_gubys_data_by_keys(
    payload: schemas.GubysPutPayload,  # <--- CAMBIO AQUÍ
    db: Session = Depends(database.get_db),
):
    data_to_update_dict = payload.model_dump(
        exclude={"ciclo", "origen"}, exclude_unset=True
    )
    updated_entry = crud.update_gubys_entry(
        db=db,
        ciclo=payload.ciclo,
        origen=payload.origen,
        entry_data=schemas.GubysDataUpdate(**data_to_update_dict),
    )
    if not updated_entry:
        raise HTTPException(
            status_code=404, detail="Entrada Gubys no encontrada para actualizar."
        )
    return updated_entry


@router.get("/gubys/", response_model=List[schemas.GubysInDB])
def read_all_gubys_data(
    skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)
):
    return crud.get_all_gubys_entries(db=db, skip=skip, limit=limit)


# --- TAMO HUMEDO Endpoints ---
@router.post("/tamo_humedo/entry", response_model=schemas.TamoHumedoInDB)
def get_or_create_tamo_humedo(
    keys: schemas.TamoHumedoKeys,  # Cuerpo con ciclo, origen
    db: Session = Depends(database.get_db),
):
    if not all([keys.ciclo, keys.origen]):
        raise HTTPException(
            status_code=400, detail="Ciclo y origen son requeridos para Tamo Humedo."
        )
    db_entry = crud.get_or_create_tamo_humedo_entry(
        db, ciclo=keys.ciclo, origen=keys.origen
    )
    return db_entry


@router.put("/tamo_humedo/entry", response_model=schemas.TamoHumedoInDB)
def update_tamo_humedo_data_by_keys(
    payload: schemas.TamoHumedoPutPayload,  # <--- CAMBIO AQUÍ
    db: Session = Depends(database.get_db),
):
    data_to_update_dict = payload.model_dump(
        exclude={"ciclo", "origen"}, exclude_unset=True
    )
    updated_entry = crud.update_tamo_humedo_entry(
        db=db,
        ciclo=payload.ciclo,
        origen=payload.origen,
        entry_data=schemas.TamoHumedoDataUpdate(**data_to_update_dict),
    )
    if not updated_entry:
        raise HTTPException(
            status_code=404, detail="Entrada Tamo Humedo no encontrada para actualizar."
        )
    return updated_entry


@router.get("/tamo_humedo/", response_model=List[schemas.TamoHumedoInDB])
def read_all_tamo_humedo_data(
    skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)
):
    return crud.get_all_tamo_humedo_entries(db=db, skip=skip, limit=limit)
