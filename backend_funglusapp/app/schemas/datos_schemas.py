# backend_funglusapp/app/schemas/datos_schemas.py
from typing import List, Optional

from pydantic import BaseModel, Field

# --- DatosGeneralesLaboratorio Schemas ---


class DatosGeneralesKeys(BaseModel):
    """Claves para identificar una entrada única en DatosGeneralesLaboratorio."""

    ciclo_id: int
    etapa_id: int
    muestra_id: int
    origen_id: int


class DatosGeneralesMetadataBase(
    BaseModel
):  # Cambiado de ...Update a ...Base para claridad
    """Campos de metadatos base que pueden ser enviados o recibidos."""

    fecha_ingreso: Optional[str] = None
    fecha_procesamiento: Optional[str] = None

    peso_h1_g: Optional[float] = None
    peso_h2_g: Optional[float] = None
    humedad_1_porc: Optional[float] = None  # H1%
    humedad_2_porc: Optional[float] = None  # H2%
    # humedad_prom_porc es calculado en el backend

    peso_ph_g: Optional[float] = None
    ph_valor: Optional[float] = None

    fdr_1_kgf: Optional[float] = None
    fdr_2_kgf: Optional[float] = None
    fdr_3_kgf: Optional[float] = None
    # fdr_prom_kgf es calculado en el backend

    resultado_cenizas_porc: Optional[float] = None
    resultado_nitrogeno_total_porc: Optional[float] = None
    resultado_nitrogeno_seca_porc: Optional[float] = None

    # Añade aquí más campos de metadatos según tu tabla "TABLA GENERAL"
    # Ejemplo:
    # temperatura_max: Optional[float] = None
    # observaciones_generales: Optional[str] = None


class DatosGeneralesCreate(DatosGeneralesKeys):
    """Schema para el cuerpo de la petición POST /entry (get_or_create)."""

    pass


class DatosGeneralesUpdatePayload(DatosGeneralesKeys, DatosGeneralesMetadataBase):
    """Schema para el cuerpo de la petición PUT /entry (update), combina claves y metadata."""

    pass


class DatosGeneralesUpdate(DatosGeneralesMetadataBase):
    """Schema para pasar solo los datos de metadata a la función CRUD de actualización."""

    pass


class DatosGeneralesInDB(DatosGeneralesKeys, DatosGeneralesMetadataBase):
    """Schema para la respuesta de la API (DatosGeneralesLaboratorio completo)."""

    id: int
    humedad_prom_porc: Optional[float] = None
    fdr_prom_kgf: Optional[float] = None

    class Config:
        from_attributes = True


# --- DatosCenizas Schemas ---


class DatosCenizasKeys(BaseModel):
    ciclo_id: int
    etapa_id: int
    muestra_id: int
    origen_id: int
    fecha_analisis_cenizas: str


class DatosCenizasBase(BaseModel):
    peso_crisol_vacio_g: Optional[float] = None
    peso_crisol_mas_muestra_g: Optional[float] = None
    peso_crisol_mas_cenizas_g: Optional[float] = None


class DatosCenizasCreate(DatosCenizasKeys, DatosCenizasBase):
    pass


class DatosCenizasUpdate(DatosCenizasBase):
    pass


class DatosCenizasInDB(DatosCenizasKeys, DatosCenizasBase):
    id: int
    cenizas_porc: Optional[float] = None

    class Config:
        from_attributes = True


# --- DatosNitrogeno Schemas ---


class DatosNitrogenoKeys(BaseModel):
    ciclo_id: int
    etapa_id: int
    muestra_id: int
    origen_id: int
    fecha_analisis_nitrogeno: str
    numero_repeticion: int = Field(default=1, ge=1)


class DatosNitrogenoBase(BaseModel):
    peso_muestra_n_g: Optional[float] = None
    n_hcl_normalidad: Optional[float] = None
    vol_hcl_gastado_cm3: Optional[float] = None


class DatosNitrogenoCreate(DatosNitrogenoKeys, DatosNitrogenoBase):
    pass


class DatosNitrogenoUpdate(DatosNitrogenoBase):
    pass


class DatosNitrogenoInDB(DatosNitrogenoKeys, DatosNitrogenoBase):
    id: int
    peso_seco_g: Optional[float] = None
    nitrogeno_organico_total_porc: Optional[float] = None
    nitrogeno_base_seca_porc: Optional[float] = None

    class Config:
        from_attributes = True
