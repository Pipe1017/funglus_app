# backend_funglusapp/app/schemas/procesamiento_schemas.py
from datetime import datetime
from typing import List, Optional

# Importa los schemas InDB de tus catálogos (ya deberían estar aquí)
from app.schemas.catalogo_schemas import CicloInDB as CicloCatalogoInDB
from app.schemas.catalogo_schemas import EtapaInDB as EtapaCatalogoInDB
from app.schemas.catalogo_schemas import MuestraInDB as MuestraCatalogoInDB
from app.schemas.catalogo_schemas import OrigenInDB as OrigenCatalogoInDB
from pydantic import BaseModel, Field

# --- Schemas para CicloProcesamiento ---


class CicloProcesamientoBase(BaseModel):
    identificador_lote: str = Field(
        ...,
        description="Nombre o código identificador del ciclo/lote de procesamiento.",
    )
    fecha_hora_lote: datetime = Field(
        ..., description="Fecha y hora de inicio o identificación del ciclo/lote."
    )
    tipo_analisis: str = Field(
        ..., description="Tipo de análisis, ej: 'nitrogeno', 'cenizas'."
    )
    descripcion: Optional[str] = Field(
        None, description="Descripción adicional para el ciclo/lote."
    )


class CicloProcesamientoCreate(CicloProcesamientoBase):
    # tipo_analisis se pasará directamente al crear, no necesita estar en el payload si se define en el path/router.
    # O se puede mantener si el endpoint de creación es genérico para tipos.
    # Por ahora lo mantenemos, asumiendo que el endpoint puede ser /ciclos_procesamiento/ y el tipo va en el body.
    pass


class CicloProcesamientoUpdate(BaseModel):
    identificador_lote: Optional[str] = None
    fecha_hora_lote: Optional[datetime] = None
    descripcion: Optional[str] = None
    # tipo_analisis generalmente no se actualiza una vez creado el lote.


class CicloProcesamientoInDB(CicloProcesamientoBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Schemas para RegistroAnalisisNitrogeno ---


class RegistroAnalisisNitrogenoBase(BaseModel):
    # IDs para las relaciones de catálogo
    ciclo_catalogo_id: int = Field(
        ..., description="ID del Ciclo general del catálogo."
    )
    etapa_catalogo_id: int = Field(..., description="ID de la Etapa del catálogo.")
    muestra_catalogo_id: int = Field(..., description="ID de la Muestra del catálogo.")
    origen_catalogo_id: int = Field(..., description="ID del Origen del catálogo.")

    # Inputs del usuario
    peso_muestra_n_g: Optional[float] = Field(
        None, description="Peso N [g] (variable 'a')"
    )
    n_hcl_normalidad: Optional[float] = Field(None, description="N HCL (variable 'b')")
    vol_hcl_gastado_cm3: Optional[float] = Field(
        None, description="Vol HCL [cm3] (variable 'c')"
    )


class RegistroAnalisisNitrogenoCreate(RegistroAnalisisNitrogenoBase):
    ciclo_procesamiento_id: (
        int  # Se asignará al crear, vinculado al CicloProcesamiento activo
    )
    # Los campos calculados no se envían en el Create, se calculan en el backend.


class RegistroAnalisisNitrogenoUpdate(BaseModel):
    # Solo permitir actualizar los inputs, los IDs de catálogo y ciclo_procesamiento_id no deberían cambiar
    # una vez que el registro está creado y asociado. Si necesitan cambiar, es conceptualmente un nuevo registro.
    peso_muestra_n_g: Optional[float] = None
    n_hcl_normalidad: Optional[float] = None
    vol_hcl_gastado_cm3: Optional[float] = None
    # Considerar si se permite re-asociar a catálogos (lo cual sería complejo)
    # ciclo_catalogo_id: Optional[int] = None
    # etapa_catalogo_id: Optional[int] = None
    # muestra_catalogo_id: Optional[int] = None
    # origen_catalogo_id: Optional[int] = None


class RegistroAnalisisNitrogenoInDB(RegistroAnalisisNitrogenoBase):
    id: int
    ciclo_procesamiento_id: int

    # Campos calculados devueltos por el backend
    calc_nitrogeno_organico_total_porc: Optional[float] = None
    calc_humedad_usada_referencia_porc: Optional[float] = None
    calc_peso_seco_g: Optional[float] = None
    calc_nitrogeno_base_seca_porc: Optional[float] = None

    created_at: datetime
    updated_at: datetime

    # Referencias a los nombres de los catálogos (opcional, pero útil para el frontend)
    ciclo_catalogo_ref: Optional[CicloCatalogoInDB] = None
    etapa_catalogo_ref: Optional[EtapaCatalogoInDB] = None
    muestra_catalogo_ref: Optional[MuestraCatalogoInDB] = None
    origen_catalogo_ref: Optional[OrigenCatalogoInDB] = None
    # ciclo_procesamiento_ref: Optional[CicloProcesamientoInDB] = None # Si se quiere devolver el lote completo anidado

    class Config:
        from_attributes = True


# --- ¡NUEVOS SCHEMAS PARA REGISTRO ANÁLISIS DE CENIZAS! ---


class RegistroAnalisisCenizasBase(BaseModel):
    # IDs para las relaciones de catálogo
    ciclo_catalogo_id: int = Field(
        ..., description="ID del Ciclo general del catálogo."
    )
    etapa_catalogo_id: int = Field(..., description="ID de la Etapa del catálogo.")
    muestra_catalogo_id: int = Field(..., description="ID de la Muestra del catálogo.")
    origen_catalogo_id: int = Field(..., description="ID del Origen del catálogo.")

    # No hay fecha_analisis_cenizas aquí, se usa la del CicloProcesamiento.

    # Inputs del usuario para el análisis de cenizas
    peso_crisol_vacio_g: Optional[float] = Field(
        None, description="Peso Crisol vacío [g] (a)"
    )
    peso_crisol_mas_muestra_g: Optional[float] = Field(
        None, description="Peso crisol + muestra [g] (b)"
    )
    peso_crisol_mas_cenizas_g: Optional[float] = Field(
        None, description="Peso crisol + cenizas [g] (c)"
    )


class RegistroAnalisisCenizasCreate(RegistroAnalisisCenizasBase):
    ciclo_procesamiento_id: int = Field(
        ..., description="ID del Ciclo de Procesamiento al que pertenece este registro."
    )
    # El campo calc_cenizas_porc no se envía en Create, se calcula en el backend.


class RegistroAnalisisCenizasUpdate(BaseModel):
    # Permitir actualizar solo los inputs. Los IDs de catálogo y de ciclo_procesamiento_id
    # generalmente no deberían cambiar una vez creado el registro.
    peso_crisol_vacio_g: Optional[float] = None
    peso_crisol_mas_muestra_g: Optional[float] = None
    peso_crisol_mas_cenizas_g: Optional[float] = None
    # Si se permite cambiar los IDs de catálogo, añadir aquí:
    # ciclo_catalogo_id: Optional[int] = None
    # etapa_catalogo_id: Optional[int] = None
    # muestra_catalogo_id: Optional[int] = None
    # origen_catalogo_id: Optional[int] = None


class RegistroAnalisisCenizasInDB(RegistroAnalisisCenizasBase):
    id: int
    ciclo_procesamiento_id: int

    # Campo calculado devuelto por el backend
    calc_cenizas_porc: Optional[float] = Field(
        None, description="Calculado: ((c - a) / (b - a)) * 100"
    )

    created_at: datetime
    updated_at: datetime

    # Referencias a los nombres de los catálogos para fácil acceso en el frontend
    ciclo_catalogo_ref: Optional[CicloCatalogoInDB] = None
    etapa_catalogo_ref: Optional[EtapaCatalogoInDB] = None
    muestra_catalogo_ref: Optional[MuestraCatalogoInDB] = None
    origen_catalogo_ref: Optional[OrigenCatalogoInDB] = None
    # Opcional: si quieres devolver también el detalle del ciclo de procesamiento anidado
    # ciclo_procesamiento_ref: Optional[CicloProcesamientoInDB] = None

    class Config:
        from_attributes = True
