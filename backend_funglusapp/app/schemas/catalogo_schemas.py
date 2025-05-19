# backend_funglusapp/app/schemas/catalogo_schemas.py
from typing import List, Optional

from pydantic import BaseModel


# --- Ciclo Schemas ---
class CicloBase(BaseModel):
    nombre_ciclo: str
    descripcion: Optional[str] = None
    fecha_inicio: Optional[str] = None  # Mantener como string por ahora


class CicloCreate(CicloBase):
    pass  # Los mismos campos que Base para la creación


class CicloUpdate(BaseModel):  # Para actualizaciones parciales
    nombre_ciclo: Optional[str] = None
    descripcion: Optional[str] = None
    fecha_inicio: Optional[str] = None


class CicloInDB(CicloBase):
    id: int  # El ID de la base de datos se incluye en la respuesta

    class Config:
        from_attributes = True  # Para Pydantic V2, reemplaza orm_mode = True


# --- Schemas Genéricos para Catálogos Simples (Etapa, Muestra, Origen) ---
# Estos catálogos solo tienen 'nombre' y 'descripcion' como campos principales


class CatalogoSimpleBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None


class CatalogoSimpleCreate(CatalogoSimpleBase):
    pass


class CatalogoSimpleUpdate(BaseModel):  # Para actualizaciones parciales
    nombre: Optional[str] = None
    descripcion: Optional[str] = None


class CatalogoSimpleInDB(CatalogoSimpleBase):
    id: int

    class Config:
        from_attributes = True


# --- Etapa Schemas (usa los genéricos) ---
class EtapaBase(CatalogoSimpleBase):
    # Si 'fase_id' fuera un campo que se envía o se muestra directamente, iría aquí.
    # Pero como en los modelos lo relacionamos con 'Fase' y eliminamos Fase,
    # ya no es necesario aquí a menos que decidas reintroducir Fase o una FK explícita.
    # Por ahora, Etapa solo tiene nombre y descripción.
    pass


class EtapaCreate(CatalogoSimpleCreate):
    # fase_id: Optional[int] = None # Si una etapa se crea asociada a una fase
    pass


class EtapaUpdate(CatalogoSimpleUpdate):
    # fase_id: Optional[int] = None
    pass


class EtapaInDB(CatalogoSimpleInDB):
    # Si quieres devolver la información de la fase a la que pertenece:
    # fase: Optional[FaseInDB] = None # Necesitarías definir FaseInDB si Fase existiera
    pass


# --- Muestra Schemas (usa los genéricos) ---
class MuestraBase(CatalogoSimpleBase):
    pass


class MuestraCreate(CatalogoSimpleCreate):
    pass


class MuestraUpdate(CatalogoSimpleUpdate):
    pass


class MuestraInDB(CatalogoSimpleInDB):
    pass


# --- Origen Schemas (usa los genéricos) ---
class OrigenBase(CatalogoSimpleBase):
    pass


class OrigenCreate(CatalogoSimpleCreate):
    pass


class OrigenUpdate(CatalogoSimpleUpdate):
    pass


class OrigenInDB(CatalogoSimpleInDB):
    pass


# --- Schema para Respuestas de Borrado o Mensajes Simples ---
class Msg(BaseModel):
    message: str
