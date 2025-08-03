# backend_funglusapp/app/schemas/informe_schemas.py
from typing import Optional
from pydantic import BaseModel

class InformeResumenRow(BaseModel):
    # Identificadores
    etapa_nombre: str
    muestra_nombre: str
    origen_nombre: str
    
    # Campo clave para el frontend
    tipo_agregacion: str # "Individual" o "Promedio"
    secuencias_count: int # Cuántas secuencias se promediaron

    # Resultados (pueden ser nulos si no hay datos)
    resultado_humedad_prom_porc: Optional[float] = None
    resultado_cenizas_porc: Optional[float] = None
    resultado_nitrogeno_total_porc: Optional[float] = None
    resultado_nitrogeno_seca_porc: Optional[float] = None
    resultado_ph_valor: Optional[float] = None # <-- ¡NUEVO!
    resultado_fdr_prom_kgf: Optional[float] = None # <-- ¡NUEVO!
    fecha_ingreso: Optional[str] = None # Usamos string para compatibilidad

    class Config:
        from_attributes = True