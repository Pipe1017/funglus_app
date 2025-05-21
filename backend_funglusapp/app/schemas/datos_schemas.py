# backend_funglusapp/app/schemas/datos_schemas.py
from typing import List, Optional

# Importa los schemas InDB de tus catálogos
from app.schemas.catalogo_schemas import (  # Ajusta si el nombre es diferente
    EtapaInDB,
    MuestraInDB,
    OrigenInDB,
)
from pydantic import BaseModel, Field

# --- DatosGeneralesLaboratorio Schemas ---


class DatosGeneralesKeys(BaseModel):
    ciclo_id: int
    etapa_id: int
    muestra_id: int
    origen_id: int


class DatosGeneralesMetadataBase(BaseModel):
    fecha_ingreso: Optional[str] = None
    fecha_procesamiento: Optional[str] = None
    peso_h1_g: Optional[float] = None
    peso_h2_g: Optional[float] = None
    humedad_1_porc: Optional[float] = None
    humedad_2_porc: Optional[float] = None
    peso_ph_g: Optional[float] = None
    ph_valor: Optional[float] = None
    fdr_1_kgf: Optional[float] = None
    fdr_2_kgf: Optional[float] = None
    fdr_3_kgf: Optional[float] = None
    resultado_cenizas_porc: Optional[float] = None
    resultado_nitrogeno_total_porc: Optional[float] = None
    resultado_nitrogeno_seca_porc: Optional[float] = None
    # observaciones_generales: Optional[str] = None  # Si lo tienes en tu modelo y lo quieres


class DatosGeneralesCreate(DatosGeneralesKeys):
    pass


class DatosGeneralesUpdatePayload(DatosGeneralesKeys, DatosGeneralesMetadataBase):
    pass


class DatosGeneralesUpdate(DatosGeneralesMetadataBase):
    pass


class DatosGeneralesInDB(DatosGeneralesKeys, DatosGeneralesMetadataBase):
    """Schema para la respuesta de la API (DatosGeneralesLaboratorio completo)."""

    id: int
    humedad_prom_porc: Optional[float] = None
    fdr_prom_kgf: Optional[float] = None

    # --- Relaciones ---
    etapa_ref: Optional[EtapaInDB] = None
    muestra_ref: Optional[MuestraInDB] = None
    origen_ref: Optional[OrigenInDB] = None
    # Podrías añadir ciclo_ref también si necesitas el nombre del ciclo aquí:
    # from app.schemas.catalogo_schemas import CicloInDB
    # ciclo_ref: Optional[CicloInDB] = None

    class Config:
        from_attributes = True  # Para Pydantic V2


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
