# backend_funglusapp/app/crud/crud_informes.py
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db import models
from app.schemas import informe_schemas

def get_informe_resumen_by_ciclo(db: Session, ciclo_id: int) -> List[informe_schemas.InformeResumenRow]:
    """
    Genera un informe de resumen para un ciclo dado, promediando los resultados
    de múltiples secuencias para la misma combinación de catálogos.
    """
    
    # Subconsulta para obtener el primer valor no nulo de humedad, cenizas, etc.
    # Esto es para manejar el caso de una sola secuencia, donde AVG no es necesario.
    subquery = (
        db.query(
            models.DatosGeneralesLaboratorio.ciclo_id,
            models.DatosGeneralesLaboratorio.etapa_id,
            models.DatosGeneralesLaboratorio.muestra_id,
            models.DatosGeneralesLaboratorio.origen_id,
            # Obtener el valor de la primera fila en el grupo
            func.first_value(models.DatosGeneralesLaboratorio.humedad_prom_porc).over(
                partition_by=[
                    models.DatosGeneralesLaboratorio.etapa_id,
                    models.DatosGeneralesLaboratorio.muestra_id,
                    models.DatosGeneralesLaboratorio.origen_id
                ]
            ).label("single_humedad"),
            func.first_value(models.DatosGeneralesLaboratorio.resultado_cenizas_porc).over(
                partition_by=[
                    models.DatosGeneralesLaboratorio.etapa_id,
                    models.DatosGeneralesLaboratorio.muestra_id,
                    models.DatosGeneralesLaboratorio.origen_id
                ]
            ).label("single_cenizas"),
            func.first_value(models.DatosGeneralesLaboratorio.resultado_nitrogeno_total_porc).over(
                partition_by=[
                    models.DatosGeneralesLaboratorio.etapa_id,
                    models.DatosGeneralesLaboratorio.muestra_id,
                    models.DatosGeneralesLaboratorio.origen_id
                ]
            ).label("single_nitrogeno_total"),
             func.first_value(models.DatosGeneralesLaboratorio.resultado_nitrogeno_seca_porc).over(
                partition_by=[
                    models.DatosGeneralesLaboratorio.etapa_id,
                    models.DatosGeneralesLaboratorio.muestra_id,
                    models.DatosGeneralesLaboratorio.origen_id
                ]
            ).label("single_nitrogeno_seca")
        )
        .filter(models.DatosGeneralesLaboratorio.ciclo_id == ciclo_id)
        .subquery()
    )

    # Consulta principal que agrupa y calcula promedios
    query_results = (
        db.query(
            models.Etapa.nombre.label("etapa_nombre"),
            models.Muestra.nombre.label("muestra_nombre"),
            models.Origen.nombre.label("origen_nombre"),
            func.count(models.DatosGeneralesLaboratorio.secuencia_id).label("secuencias_count"),
            func.avg(models.DatosGeneralesLaboratorio.humedad_prom_porc).label("avg_humedad"),
            func.avg(models.DatosGeneralesLaboratorio.resultado_cenizas_porc).label("avg_cenizas"),
            func.avg(models.DatosGeneralesLaboratorio.resultado_nitrogeno_total_porc).label("avg_nitrogeno_total"),
            func.avg(models.DatosGeneralesLaboratorio.resultado_nitrogeno_seca_porc).label("avg_nitrogeno_seca"),
            subquery.c.single_humedad,
            subquery.c.single_cenizas,
            subquery.c.single_nitrogeno_total,
            subquery.c.single_nitrogeno_seca
        )
        .join(models.Etapa, models.DatosGeneralesLaboratorio.etapa_id == models.Etapa.id)
        .join(models.Muestra, models.DatosGeneralesLaboratorio.muestra_id == models.Muestra.id)
        .join(models.Origen, models.DatosGeneralesLaboratorio.origen_id == models.Origen.id)
        .join(
            subquery,
            (models.DatosGeneralesLaboratorio.ciclo_id == subquery.c.ciclo_id) &
            (models.DatosGeneralesLaboratorio.etapa_id == subquery.c.etapa_id) &
            (models.DatosGeneralesLaboratorio.muestra_id == subquery.c.muestra_id) &
            (models.DatosGeneralesLaboratorio.origen_id == subquery.c.origen_id)
        )
        .filter(models.DatosGeneralesLaboratorio.ciclo_id == ciclo_id)
        .group_by(
            models.DatosGeneralesLaboratorio.etapa_id,
            models.DatosGeneralesLaboratorio.muestra_id,
            models.DatosGeneralesLaboratorio.origen_id,
            models.Etapa.nombre,
            models.Muestra.nombre,
            models.Origen.nombre,
            subquery.c.single_humedad,
            subquery.c.single_cenizas,
            subquery.c.single_nitrogeno_total,
            subquery.c.single_nitrogeno_seca
        )
        .order_by(models.Etapa.nombre, models.Muestra.nombre, models.Origen.nombre)
        .all()
    )

    # Procesar los resultados para ajustarlos al schema de respuesta
    informe_final = []
    for row in query_results:
        count = row.secuencias_count
        is_average = count > 1

        informe_row = informe_schemas.InformeResumenRow(
            etapa_nombre=row.etapa_nombre,
            muestra_nombre=row.muestra_nombre,
            origen_nombre=row.origen_nombre,
            tipo_agregacion="Promedio" if is_average else "Individual",
            secuencias_count=count,
            resultado_humedad_prom_porc=row.avg_humedad if is_average else row.single_humedad,
            resultado_cenizas_porc=row.avg_cenizas if is_average else row.single_cenizas,
            resultado_nitrogeno_total_porc=row.avg_nitrogeno_total if is_average else row.single_nitrogeno_total,
            resultado_nitrogeno_seca_porc=row.avg_nitrogeno_seca if is_average else row.single_nitrogeno_seca,
        )
        informe_final.append(informe_row)

    return informe_final