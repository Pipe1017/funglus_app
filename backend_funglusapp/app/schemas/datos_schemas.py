# backend_funglusapp/app/schemas/datos_schemas.py
from typing import List, Optional, Any # <-- MODIFICADO
from pydantic import BaseModel, Field, field_validator # <-- MODIFICADO

# Importa los schemas InDB de tus catálogos
from app.schemas.catalogo_schemas import (
    EtapaInDB,
    MuestraInDB,
    OrigenInDB,
    SecuenciaInDB,
)

# --- DatosGeneralesLaboratorio Schemas ---

class DatosGeneralesKeys(BaseModel):
    ciclo_id: int
    etapa_id: int
    muestra_id: int
    origen_id: int
    secuencia_id: int

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
    
    # --- ¡NUEVO VALIDADOR AÑADIDO! ---
    # Esto soluciona el error de "float_parsing"
    @field_validator(
        'peso_h1_g', 'peso_h2_g', 'humedad_1_porc', 'humedad_2_porc', 
        'peso_ph_g', 'ph_valor', 'fdr_1_kgf', 'fdr_2_kgf', 'fdr_3_kgf',
        'resultado_cenizas_porc', 'resultado_nitrogeno_total_porc', 
        'resultado_nitrogeno_seca_porc', 
        mode='before' # Se ejecuta ANTES de que Pydantic intente convertir a float
    )
    @classmethod
    def clean_empty_strings(cls, v: Any) -> Any:
        """
        Toma cualquier valor. Si es un string y está en blanco o es solo espacios,
        lo convierte a None. Si no, devuelve el valor original.
        """
        if isinstance(v, str) and v.strip() == '':
            return None # Convierte ' ' a None
        return v
    # --- FIN DEL NUEVO VALIDADOR ---

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
    etapa_ref: Optional[EtapaInDB] = None
    muestra_ref: Optional[MuestraInDB] = None
    origen_ref: Optional[OrigenInDB] = None
    secuencia_ref: Optional[SecuenciaInDB] = None

    class Config:
        from_attributes = True

# --- Schemas Obsoletos (Se mantienen como estaban) ---
# --- DatosCenizas Schemas ---
class DatosCenizasKeys(BaseModel):
    ciclo_procesamiento_id: int
    ciclo_catalogo_id: int
    etapa_catalogo_id: int
    muestra_catalogo_id: int
    origen_catalogo_id: int
    secuencia_catalogo_id: int

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
    ciclo_procesamiento_id: int
    ciclo_catalogo_id: int
    etapa_catalogo_id: int
    muestra_catalogo_id: int
    origen_catalogo_id: int
    secuencia_catalogo_id: int

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