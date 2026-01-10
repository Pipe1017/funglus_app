# backend_funglusapp/app/crud/crud_informes.py
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, String

from app.db import models
from app.schemas import informe_schemas
from app.crud import crud_catalogos

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
            ).label("single_nitrogeno_seca"),
             func.first_value(models.DatosGeneralesLaboratorio.ph_valor).over(
                partition_by=[
                    models.DatosGeneralesLaboratorio.etapa_id,
                    models.DatosGeneralesLaboratorio.muestra_id,
                    models.DatosGeneralesLaboratorio.origen_id
                ]
            ).label("single_ph"),
             func.first_value(models.DatosGeneralesLaboratorio.fdr_prom_kgf).over(
                partition_by=[
                    models.DatosGeneralesLaboratorio.etapa_id,
                    models.DatosGeneralesLaboratorio.muestra_id,
                    models.DatosGeneralesLaboratorio.origen_id
                ]
            ).label("single_fdr")
        )
        .filter(models.DatosGeneralesLaboratorio.ciclo_id == ciclo_id)
        .subquery()
    )

    # Consulta principal que agrupa y calcula promedios
    query_results = (
        db.query(
            models.DatosGeneralesLaboratorio.ciclo_id,
            models.DatosGeneralesLaboratorio.etapa_id,
            models.DatosGeneralesLaboratorio.muestra_id,
            models.DatosGeneralesLaboratorio.origen_id,
            models.Etapa.nombre.label("etapa_nombre"),
            models.Muestra.nombre.label("muestra_nombre"),
            models.Origen.nombre.label("origen_nombre"),
            func.count(models.DatosGeneralesLaboratorio.secuencia_id).label("secuencias_count"),
            func.max(models.DatosGeneralesLaboratorio.fecha_ingreso).label("max_fecha_ingreso"),
            
            func.avg(models.DatosGeneralesLaboratorio.humedad_prom_porc).label("avg_humedad"),
            func.avg(models.DatosGeneralesLaboratorio.resultado_cenizas_porc).label("avg_cenizas"),
            func.avg(models.DatosGeneralesLaboratorio.resultado_nitrogeno_total_porc).label("avg_nitrogeno_total"),
            func.avg(models.DatosGeneralesLaboratorio.resultado_nitrogeno_seca_porc).label("avg_nitrogeno_seca"),
            func.avg(models.DatosGeneralesLaboratorio.ph_valor).label("avg_ph"),
            func.avg(models.DatosGeneralesLaboratorio.fdr_prom_kgf).label("avg_fdr"),
            subquery.c.single_humedad,
            subquery.c.single_cenizas,
            subquery.c.single_nitrogeno_total,
            subquery.c.single_nitrogeno_seca,
            subquery.c.single_ph,
            subquery.c.single_fdr
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
            models.DatosGeneralesLaboratorio.ciclo_id,
            models.DatosGeneralesLaboratorio.etapa_id,
            models.DatosGeneralesLaboratorio.muestra_id,
            models.DatosGeneralesLaboratorio.origen_id,
            models.Etapa.nombre,
            models.Muestra.nombre,
            models.Origen.nombre,
            subquery.c.single_humedad,
            subquery.c.single_cenizas,
            subquery.c.single_nitrogeno_total,
            subquery.c.single_nitrogeno_seca,
            subquery.c.single_ph,
            subquery.c.single_fdr 
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
            ciclo_id=row.ciclo_id,
            etapa_id=row.etapa_id,
            muestra_id=row.muestra_id,
            origen_id=row.origen_id,
            secuencia_id=None,  # Para promedios no hay secuencia específica
            etapa_nombre=row.etapa_nombre,
            muestra_nombre=row.muestra_nombre,
            origen_nombre=row.origen_nombre,
            tipo_agregacion="Promedio" if is_average else "Individual",
            secuencias_count=count,
            fecha_ingreso=row.max_fecha_ingreso,
            resultado_humedad_prom_porc=row.avg_humedad if is_average else row.single_humedad,
            resultado_cenizas_porc=row.avg_cenizas if is_average else row.single_cenizas,
            resultado_nitrogeno_total_porc=row.avg_nitrogeno_total if is_average else row.single_nitrogeno_total,
            resultado_nitrogeno_seca_porc=row.avg_nitrogeno_seca if is_average else row.single_nitrogeno_seca,
            resultado_ph_valor=row.avg_ph if is_average else row.single_ph,
            resultado_fdr_prom_kgf=row.avg_fdr if is_average else row.single_fdr
        )
        informe_final.append(informe_row)


    return informe_final

def get_informe_historico(db: Session, request: informe_schemas.HistoricoRequest) -> informe_schemas.HistoricoResponse:
    """
    Genera datos históricos reutilizando la lógica del informe de resumen para cada ciclo.
    """
    # 1. Obtener todos los ciclos ordenados por fecha
    ciclos = db.query(models.Ciclo).order_by(models.Ciclo.fecha_inicio).all()
    
    # 2. Obtener los nombres de las etapas, muestras y origenes para la leyenda
    series_nombres = []
    combinaciones_con_nombres = []
    for comb in request.combinaciones:
        etapa = crud_catalogos.get_etapa_by_id(db, comb.etapa_id)
        muestra = crud_catalogos.get_muestra_by_id(db, comb.muestra_id)
        origen = crud_catalogos.get_origen_by_id(db, comb.origen_id)
        
        if etapa and muestra and origen:
            nombre = f"{etapa.nombre}-{muestra.nombre}-{origen.nombre}"
            series_nombres.append(nombre)
            combinaciones_con_nombres.append({
                "ids": comb,
                "nombre_etapa": etapa.nombre,
                "nombre_muestra": muestra.nombre,
                "nombre_origen": origen.nombre
            })

    # 3. Recorrer cada ciclo para obtener los datos
    data_para_grafico = []
    for ciclo in ciclos:
        # --- ¡LÓGICA CLAVE! Se reutiliza la función del informe de resumen ---
        resumen_del_ciclo = get_informe_resumen_by_ciclo(db, ciclo.id)

        punto_del_grafico = {
            "ciclo_nombre": ciclo.nombre_ciclo,
            "fecha_inicio": ciclo.fecha_inicio,
            "resultados": {}
        }

        # Para cada combinación solicitada, buscarla en el resumen del ciclo actual
        for i, comb_info in enumerate(combinaciones_con_nombres):
            nombre_serie = series_nombres[i]
            
            valor_encontrado = None
            # Buscar la fila en el resumen que coincida con la combinación
            for fila_resumen in resumen_del_ciclo:
                if (fila_resumen.etapa_nombre == comb_info["nombre_etapa"] and
                    fila_resumen.muestra_nombre == comb_info["nombre_muestra"] and
                    fila_resumen.origen_nombre == comb_info["nombre_origen"]):
                    
                    # Obtener el valor de la métrica solicitada (ej. "resultado_cenizas_porc")
                    valor_encontrado = getattr(fila_resumen, request.metrica, None)
                    break # Salir del bucle una vez encontrada la fila
            
            punto_del_grafico["resultados"][nombre_serie] = valor_encontrado

        data_para_grafico.append(punto_del_grafico)

    return informe_schemas.HistoricoResponse(data=data_para_grafico, series_nombres=series_nombres)