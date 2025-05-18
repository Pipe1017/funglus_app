# backend_funglusapp/app/schemas/laboratorio_schemas.py
from typing import List, Optional

from pydantic import BaseModel


# --- MATERIA PRIMA Schemas ---
class MateriaPrimaKeys(BaseModel):
    ciclo: str
    origen: str
    muestra: str


class MateriaPrimaDataUpdate(BaseModel):
    fecha_i: Optional[str] = None
    fecha_p: Optional[str] = None
    p1h1: Optional[float] = None
    p2h2: Optional[float] = None
    porc_h1: Optional[float] = None
    porc_h2: Optional[float] = None
    p_ph: Optional[float] = None
    ph: Optional[float] = None
    d1: Optional[float] = None
    d2: Optional[float] = None
    d3: Optional[float] = None


class MateriaPrimaPutPayload(
    MateriaPrimaKeys, MateriaPrimaDataUpdate
):  # Combina claves y datos
    pass  # Hereda todos los campos


class MateriaPrimaInDB(MateriaPrimaKeys, MateriaPrimaDataUpdate):
    key: int
    hprom: Optional[float] = None
    dprom: Optional[float] = None

    class Config:
        from_attributes = True


# --- GUBYS Schemas ---
class GubysKeys(BaseModel):
    ciclo: str
    origen: str


class GubysDataUpdate(BaseModel):
    fecha_i: Optional[str] = None
    fecha_p: Optional[str] = None
    p1h1: Optional[float] = None
    p2h2: Optional[float] = None
    porc_h1: Optional[float] = None
    porc_h2: Optional[float] = None
    p_ph: Optional[float] = None
    ph: Optional[float] = None
    # 'muestra' no es un campo de datos para Gubys según nuestra última definición


class GubysPutPayload(GubysKeys, GubysDataUpdate):  # Combina claves y datos
    pass


class GubysInDB(GubysKeys, GubysDataUpdate):
    key: int
    hprom: Optional[float] = None

    class Config:
        from_attributes = True


# --- TAMO HUMEDO Schemas ---
class TamoHumedoKeys(BaseModel):
    ciclo: str
    origen: str


class TamoHumedoDataUpdate(BaseModel):
    fecha_i: Optional[str] = None
    fecha_p: Optional[str] = None
    p1h1: Optional[float] = None
    p2h2: Optional[float] = None
    porc_h1: Optional[float] = None
    porc_h2: Optional[float] = None
    p_ph: Optional[float] = None
    ph: Optional[float] = None
    d1: Optional[float] = None
    d2: Optional[float] = None
    d3: Optional[float] = None


class TamoHumedoPutPayload(
    TamoHumedoKeys, TamoHumedoDataUpdate
):  # Combina claves y datos
    pass


class TamoHumedoInDB(TamoHumedoKeys, TamoHumedoDataUpdate):
    key: int
    hprom: Optional[float] = None
    dprom: Optional[float] = None

    class Config:
        from_attributes = True
