# backend_funglusapp/app/schemas/catalogo_schemas.py
from typing import List, Optional

from pydantic import BaseModel

# --- Schemas Genéricos para Catálogos Simples ---
class CatalogoSimpleBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None

class CatalogoSimpleCreate(CatalogoSimpleBase):
    pass

class CatalogoSimpleUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None

class CatalogoSimpleInDB(CatalogoSimpleBase):
    id: int
    class Config:
        from_attributes = True

# --- Ciclo Schemas (Sin cambios) ---
class CicloBase(BaseModel):
    nombre_ciclo: str
    descripcion: Optional[str] = None
    fecha_inicio: Optional[str] = None

class CicloCreate(CicloBase):
    pass

class CicloUpdate(BaseModel):
    nombre_ciclo: Optional[str] = None
    descripcion: Optional[str] = None
    fecha_inicio: Optional[str] = None

class CicloInDB(CicloBase):
    id: int
    class Config:
        from_attributes = True

# --- Schemas para Etapa, Muestra, Origen (Sin cambios) ---
class EtapaCreate(CatalogoSimpleCreate): pass
class EtapaUpdate(CatalogoSimpleUpdate): pass
class EtapaInDB(CatalogoSimpleInDB): pass

class MuestraCreate(CatalogoSimpleCreate): pass
class MuestraUpdate(CatalogoSimpleUpdate): pass
class MuestraInDB(CatalogoSimpleInDB): pass

class OrigenCreate(CatalogoSimpleCreate): pass
class OrigenUpdate(CatalogoSimpleUpdate): pass
class OrigenInDB(CatalogoSimpleInDB): pass

# --- ¡NUEVO! Schemas para Secuencia ---
class SecuenciaCreate(CatalogoSimpleCreate):
    """Schema para crear una nueva secuencia."""
    pass

class SecuenciaUpdate(CatalogoSimpleUpdate):
    """Schema para actualizar una secuencia existente."""
    pass

class SecuenciaInDB(CatalogoSimpleInDB):
    """Schema para devolver una secuencia desde la BD, incluye el ID."""
    pass

# --- Schema para Mensajes ---
class Msg(BaseModel):
    message: str