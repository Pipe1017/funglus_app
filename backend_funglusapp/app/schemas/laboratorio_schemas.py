# backend_funglusapp/app/schemas/laboratorio_schemas.py
from pydantic import BaseModel
from typing import Optional, List

# --- GUBYS Schemas ---
# (Tu código de GubysBase, GubysUpdate, GubysInDB existente va aquí, sin cambios)
class GubysBase(BaseModel):
    ciclo: str
    fecha_i: Optional[str] = None
    fecha_p: Optional[str] = None
    origen: Optional[str] = None
    p1h1: Optional[float] = None
    p2h2: Optional[float] = None
    porc_h1: Optional[float] = None
    porc_h2: Optional[float] = None
    p_ph: Optional[float] = None
    ph: Optional[float] = None
    hprom: Optional[float] = None

class GubysUpdate(BaseModel):
    fecha_i: Optional[str] = None
    fecha_p: Optional[str] = None
    origen: Optional[str] = None
    p1h1: Optional[float] = None
    p2h2: Optional[float] = None
    porc_h1: Optional[float] = None
    porc_h2: Optional[float] = None
    p_ph: Optional[float] = None
    ph: Optional[float] = None
    hprom: Optional[float] = None

class GubysInDB(GubysBase):
    key: int
    class Config: from_attributes = True

# --- CENIZAS Schemas ---
# (Tu código de CenizasBase, CenizasUpdate, CenizasInDB existente va aquí, sin cambios)
class CenizasBase(BaseModel):
    ciclo: str
    fecha_i: Optional[str] = None
    muestra: Optional[str] = None
    origen: Optional[str] = None
    p1: Optional[float] = None
    p2: Optional[float] = None
    p3: Optional[float] = None
    porc_cz: Optional[float] = None

class CenizasUpdate(BaseModel):
    fecha_i: Optional[str] = None
    muestra: Optional[str] = None
    origen: Optional[str] = None
    p1: Optional[float] = None
    p2: Optional[float] = None
    p3: Optional[float] = None
    porc_cz: Optional[float] = None

class CenizasInDB(CenizasBase):
    key: int
    class Config: from_attributes = True

# --- MATERIA PRIMA Schemas --- (NUEVO)
class MateriaPrimaBase(BaseModel):
    ciclo: str # Para la respuesta completa
    fecha_i: Optional[str] = None
    fecha_p: Optional[str] = None
    muestra: Optional[str] = None
    origen: Optional[str] = None
    p1h1: Optional[float] = None
    p2h2: Optional[float] = None
    porc_h1: Optional[float] = None
    porc_h2: Optional[float] = None
    p_ph: Optional[float] = None
    ph: Optional[float] = None
    d1: Optional[float] = None
    d2: Optional[float] = None
    d3: Optional[float] = None
    hprom: Optional[float] = None # Campo calculado
    dprom: Optional[float] = None # Campo calculado

class MateriaPrimaUpdate(BaseModel): # Para el cuerpo del PUT
    fecha_i: Optional[str] = None
    fecha_p: Optional[str] = None
    muestra: Optional[str] = None
    origen: Optional[str] = None
    p1h1: Optional[float] = None
    p2h2: Optional[float] = None
    porc_h1: Optional[float] = None
    porc_h2: Optional[float] = None
    p_ph: Optional[float] = None
    ph: Optional[float] = None
    d1: Optional[float] = None
    d2: Optional[float] = None
    d3: Optional[float] = None
    # hprom y dprom no se envían, se calculan

class MateriaPrimaInDB(MateriaPrimaBase):
    key: int
    class Config: from_attributes = True
