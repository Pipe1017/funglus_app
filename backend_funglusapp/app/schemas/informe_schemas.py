# backend_funglusapp/app/schemas/informe_schemas.py
from typing import Optional, List, Dict
from pydantic import BaseModel
from datetime import date

class InformeResumenRow(BaseModel):
    etapa_nombre: str
    muestra_nombre: str
    origen_nombre: str
    tipo_agregacion: str 
    secuencias_count: int
    resultado_humedad_prom_porc: Optional[float] = None
    resultado_cenizas_porc: Optional[float] = None
    resultado_nitrogeno_total_porc: Optional[float] = None
    resultado_nitrogeno_seca_porc: Optional[float] = None
    resultado_ph_valor: Optional[float] = None
    resultado_fdr_prom_kgf: Optional[float] = None
    fecha_ingreso: Optional[str] = None

    class Config:
        from_attributes = True

# --- ¡NUEVOS SCHEMAS PARA EL GRÁFICO HISTÓRICO! ---

class CombinacionCatalogoID(BaseModel):
    """Define una combinación de catálogos por sus IDs."""
    etapa_id: int
    muestra_id: int
    origen_id: int

class HistoricoRequest(BaseModel):
    """Define el cuerpo de la solicitud para el informe histórico."""
    metrica: str # El nombre de la columna en la BD, ej: "resultado_cenizas_porc"
    combinaciones: List[CombinacionCatalogoID]

class HistoricoDataPoint(BaseModel):
    """Define un punto en el eje X del gráfico (un ciclo)."""
    ciclo_nombre: str
    fecha_inicio: Optional[date] = None
    # Los resultados se devuelven en un diccionario. La clave es el nombre de la combinación.
    resultados: Dict[str, Optional[float]]

class HistoricoResponse(BaseModel):
    """Define la respuesta completa de la API."""
    data: List[HistoricoDataPoint]
    series_nombres: List[str] # Nombres de las líneas para la leyenda del gráfico