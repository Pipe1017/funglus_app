# backend_funglusapp/app/schemas/formulacion_schemas.py
from pydantic import BaseModel
from typing import Optional, List

class FormulacionBase(BaseModel): # Usado para la respuesta y como base para Create
    ciclo: str # Sigue siendo requerido aquí para la respuesta completa
    peso: Optional[float] = None
    muestra: Optional[str] = None
    origen: Optional[str] = None
    porc_n_entrada: Optional[float] = None # %N (de entrada)
    porc_cz_entrada: Optional[float] = None # %Cz (de entrada)
    hprom_entrada: Optional[float] = None # Humedad promedio (de entrada)
    # Los campos calculados se definirán en FormulacionInDB

# class FormulacionCreate(FormulacionBase):
#     pass

class FormulacionUpdate(BaseModel): # Esquema para el cuerpo de la petición PUT
    peso: Optional[float] = None
    muestra: Optional[str] = None
    origen: Optional[str] = None
    porc_n_entrada: Optional[float] = None
    porc_cz_entrada: Optional[float] = None
    hprom_entrada: Optional[float] = None
    # No se envían campos calculados, se recalculan en el backend

class FormulacionInDB(FormulacionBase): # Para las respuestas de la API
    key: int
    # Campos calculados (devueltos por la API)
    ms_kg: Optional[float] = None
    n_kg: Optional[float] = None
    porc_n_ms: Optional[float] = None
    cz_kg: Optional[float] = None
    porc_cz_ms: Optional[float] = None
    c_kg: Optional[float] = None
    c_n_ratio: Optional[float] = None
    mos_kg: Optional[float] = None
    porc_n_mos: Optional[float] = None
    porc_cz_mos: Optional[float] = None
    class Config: from_attributes = True