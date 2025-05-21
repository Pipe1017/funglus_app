# backend_funglusapp/app/crud/crud_procesamiento.py
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.crud import crud_datos_generales  # Para obtener H% y actualizar tabla general
from app.db import models
from app.schemas import (
    datos_schemas as schemas_datos,  # Para interactuar con DatosGeneralesLaboratorio
)
from app.schemas import procesamiento_schemas as schemas_proc
from sqlalchemy import desc  # Para ordenar descendente
from sqlalchemy.orm import Session, joinedload

# --- Operaciones CRUD para CicloProcesamiento ---


def create_ciclo_procesamiento(
    db: Session, ciclo_proc_create: schemas_proc.CicloProcesamientoCreate
) -> models.CicloProcesamiento:
    """
    Crea un nuevo ciclo de procesamiento.
    """
    db_ciclo_procesamiento = models.CicloProcesamiento(
        identificador_lote=ciclo_proc_create.identificador_lote,
        fecha_hora_lote=ciclo_proc_create.fecha_hora_lote,
        tipo_analisis=ciclo_proc_create.tipo_analisis,  # ej. "nitrogeno"
        descripcion=ciclo_proc_create.descripcion,
    )
    db.add(db_ciclo_procesamiento)
    db.commit()
    db.refresh(db_ciclo_procesamiento)
    return db_ciclo_procesamiento


def get_ciclo_procesamiento_by_id(
    db: Session, ciclo_proc_id: int
) -> Optional[models.CicloProcesamiento]:
    """
    Obtiene un ciclo de procesamiento por su ID.
    """
    return (
        db.query(models.CicloProcesamiento)
        .filter(models.CicloProcesamiento.id == ciclo_proc_id)
        .first()
    )


def get_ciclo_procesamiento_by_identificador(
    db: Session,
    identificador_lote: str,
    tipo_analisis: str,
    # fecha_hora_lote: datetime # La fecha_hora_lote es parte de la UniqueConstraint, pero puede ser difícil de matchear exactamente.
    # Usualmente se busca por identificador_lote y tipo_analisis, y se manejan múltiples fechas en la UI.
    # Si es estrictamente necesario, se puede añadir.
) -> List[
    models.CicloProcesamiento
]:  # Podrían existir varios con el mismo identificador pero diferentes fechas
    """
    Obtiene ciclos de procesamiento por identificador_lote y tipo_analisis.
    Devuelve una lista ya que identificador_lote solo no es único sin la fecha.
    """
    return (
        db.query(models.CicloProcesamiento)
        .filter(
            models.CicloProcesamiento.identificador_lote == identificador_lote,
            models.CicloProcesamiento.tipo_analisis == tipo_analisis,
        )
        .order_by(desc(models.CicloProcesamiento.fecha_hora_lote))
        .all()
    )


def get_ciclos_procesamiento_by_tipo(
    db: Session, tipo_analisis: str, skip: int = 0, limit: int = 100
) -> List[models.CicloProcesamiento]:
    """
    Obtiene una lista de ciclos de procesamiento de un tipo específico,
    ordenados por fecha_hora_lote descendente (los más recientes primero).
    """
    return (
        db.query(models.CicloProcesamiento)
        .filter(models.CicloProcesamiento.tipo_analisis == tipo_analisis)
        .order_by(desc(models.CicloProcesamiento.fecha_hora_lote))
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_ciclo_procesamiento(
    db: Session,
    ciclo_proc_id: int,
    ciclo_proc_update: schemas_proc.CicloProcesamientoUpdate,
) -> Optional[models.CicloProcesamiento]:
    """
    Actualiza un ciclo de procesamiento existente.
    """
    db_ciclo_proc = get_ciclo_procesamiento_by_id(db, ciclo_proc_id)
    if not db_ciclo_proc:
        return None

    update_data = ciclo_proc_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_ciclo_proc, key, value)

    db.commit()
    db.refresh(db_ciclo_proc)
    return db_ciclo_proc


def delete_ciclo_procesamiento(db: Session, ciclo_proc_id: int) -> bool:
    """
    Borra un ciclo de procesamiento.
    La relación con registros_nitrogeno tiene cascade="all, delete-orphan",
    por lo que los registros asociados también se borrarán.
    """
    db_ciclo_proc = get_ciclo_procesamiento_by_id(db, ciclo_proc_id)
    if not db_ciclo_proc:
        return False
    try:
        db.delete(db_ciclo_proc)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        print(f"Error al borrar CicloProcesamiento {ciclo_proc_id}: {e}")
        return False


# --- Operaciones CRUD para RegistroAnalisisNitrogeno ---


def _calculate_nitrogeno_valores(
    db: Session,
    ciclo_catalogo_id: int,
    etapa_catalogo_id: int,
    muestra_catalogo_id: int,
    origen_catalogo_id: int,
    peso_muestra_n_g: Optional[float],  # (a)
    n_hcl_normalidad: Optional[float],  # (b)
    vol_hcl_gastado_cm3: Optional[float],  # (c)
) -> Dict[str, Optional[float]]:
    """
    Helper para calcular los valores de nitrógeno y obtener H%.
    Obtiene H% de DatosGeneralesLaboratorio (creando la entrada si no existe).
    """
    resultados = {
        "calc_nitrogeno_organico_total_porc": None,
        "calc_humedad_usada_referencia_porc": None,
        "calc_peso_seco_g": None,
        "calc_nitrogeno_base_seca_porc": None,
    }

    # 1. Obtener H% de DatosGeneralesLaboratorio
    # Esto también asegura que la entrada en DatosGeneralesLaboratorio exista
    keys_tabla_general = schemas_datos.DatosGeneralesKeys(
        ciclo_id=ciclo_catalogo_id,
        etapa_id=etapa_catalogo_id,
        muestra_id=muestra_catalogo_id,
        origen_id=origen_catalogo_id,
    )
    # Usamos get_or_create para asegurar que la entrada exista
    db_datos_generales = crud_datos_generales.get_or_create_datos_generales_entry(
        db, keys=keys_tabla_general
    )

    humedad_prom_porc = None
    if db_datos_generales and db_datos_generales.humedad_prom_porc is not None:
        humedad_prom_porc = db_datos_generales.humedad_prom_porc
        resultados["calc_humedad_usada_referencia_porc"] = humedad_prom_porc

    # 2. Realizar cálculos de nitrógeno
    a = peso_muestra_n_g
    b = n_hcl_normalidad
    c = vol_hcl_gastado_cm3

    if a is not None and a != 0 and b is not None and c is not None:
        try:
            # Nitrógeno Orgánico Total [%] = (c * b * 1.4) / a
            n_org_total = (c * b * 1.4) / a
            resultados["calc_nitrogeno_organico_total_porc"] = round(n_org_total, 2)

            if humedad_prom_porc is not None:
                # Peso seco [g] (d) = a * (100 - H%) / 100
                peso_seco = a * (100.0 - humedad_prom_porc) / 100.0
                resultados["calc_peso_seco_g"] = round(peso_seco, 3)

                if peso_seco != 0:
                    # Nitrógeno base seca [%] = (c * b * 1.4) / d
                    n_base_seca = (c * b * 1.4) / peso_seco
                    resultados["calc_nitrogeno_base_seca_porc"] = round(n_base_seca, 2)
        except ZeroDivisionError:
            print("Advertencia: División por cero durante cálculos de nitrógeno.")
        except Exception as e:
            print(f"Error durante cálculos de nitrógeno: {e}")

    return resultados


def create_registro_nitrogeno(
    db: Session, registro_create: schemas_proc.RegistroAnalisisNitrogenoCreate
) -> models.RegistroAnalisisNitrogeno:
    """
    Crea un nuevo registro de análisis de nitrógeno.
    Calcula los valores derivados y obtiene H% de la tabla general.
    """
    calculos = _calculate_nitrogeno_valores(
        db=db,
        ciclo_catalogo_id=registro_create.ciclo_catalogo_id,
        etapa_catalogo_id=registro_create.etapa_catalogo_id,
        muestra_catalogo_id=registro_create.muestra_catalogo_id,
        origen_catalogo_id=registro_create.origen_catalogo_id,
        peso_muestra_n_g=registro_create.peso_muestra_n_g,
        n_hcl_normalidad=registro_create.n_hcl_normalidad,
        vol_hcl_gastado_cm3=registro_create.vol_hcl_gastado_cm3,
    )

    db_registro = models.RegistroAnalisisNitrogeno(
        ciclo_procesamiento_id=registro_create.ciclo_procesamiento_id,
        ciclo_catalogo_id=registro_create.ciclo_catalogo_id,
        etapa_catalogo_id=registro_create.etapa_catalogo_id,
        muestra_catalogo_id=registro_create.muestra_catalogo_id,
        origen_catalogo_id=registro_create.origen_catalogo_id,
        peso_muestra_n_g=registro_create.peso_muestra_n_g,
        n_hcl_normalidad=registro_create.n_hcl_normalidad,
        vol_hcl_gastado_cm3=registro_create.vol_hcl_gastado_cm3,
        **calculos,  # Desempaqueta los resultados calculados
    )
    db.add(db_registro)
    db.commit()
    db.refresh(db_registro)
    return db_registro


def get_registro_nitrogeno_by_id(
    db: Session, registro_id: int, eager_load_catalogs: bool = True
) -> Optional[models.RegistroAnalisisNitrogeno]:
    """
    Obtiene un registro de análisis de nitrógeno por su ID.
    """
    query = db.query(models.RegistroAnalisisNitrogeno)
    if eager_load_catalogs:
        query = query.options(
            joinedload(models.RegistroAnalisisNitrogeno.ciclo_catalogo_ref),
            joinedload(models.RegistroAnalisisNitrogeno.etapa_catalogo_ref),
            joinedload(models.RegistroAnalisisNitrogeno.muestra_catalogo_ref),
            joinedload(models.RegistroAnalisisNitrogeno.origen_catalogo_ref),
            # joinedload(models.RegistroAnalisisNitrogeno.ciclo_procesamiento_ref) # Si también lo necesitas
        )
    return query.filter(models.RegistroAnalisisNitrogeno.id == registro_id).first()


def get_registros_nitrogeno_by_ciclo_procesamiento_id(
    db: Session,
    ciclo_proc_id: int,
    skip: int = 0,
    limit: int = 100,
    eager_load_catalogs: bool = True,
) -> List[models.RegistroAnalisisNitrogeno]:
    """
    Obtiene todos los registros de análisis de nitrógeno para un ciclo_procesamiento_id específico.
    """
    query = db.query(models.RegistroAnalisisNitrogeno)
    if eager_load_catalogs:
        query = query.options(
            joinedload(models.RegistroAnalisisNitrogeno.ciclo_catalogo_ref),
            joinedload(models.RegistroAnalisisNitrogeno.etapa_catalogo_ref),
            joinedload(models.RegistroAnalisisNitrogeno.muestra_catalogo_ref),
            joinedload(models.RegistroAnalisisNitrogeno.origen_catalogo_ref),
            # joinedload(models.RegistroAnalisisNitrogeno.ciclo_procesamiento_ref)
        )
    return (
        query.filter(
            models.RegistroAnalisisNitrogeno.ciclo_procesamiento_id == ciclo_proc_id
        )
        .order_by(
            models.RegistroAnalisisNitrogeno.id
        )  # O por otro campo relevante como created_at
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_registro_nitrogeno(
    db: Session,
    registro_id: int,
    registro_update: schemas_proc.RegistroAnalisisNitrogenoUpdate,
) -> Optional[models.RegistroAnalisisNitrogeno]:
    """
    Actualiza un registro de análisis de nitrógeno existente.
    Recalcula los valores si los inputs relevantes cambian.
    """
    db_registro = get_registro_nitrogeno_by_id(
        db, registro_id, eager_load_catalogs=False
    )  # No necesitamos los refs para actualizar
    if not db_registro:
        return None

    update_data = registro_update.model_dump(exclude_unset=True)

    # Actualizar campos de input
    made_changes_to_inputs = False
    for key, value in update_data.items():
        if hasattr(db_registro, key) and getattr(db_registro, key) != value:
            setattr(db_registro, key, value)
            if key in ["peso_muestra_n_g", "n_hcl_normalidad", "vol_hcl_gastado_cm3"]:
                made_changes_to_inputs = True

    # Si los inputs cambiaron, recalcular
    if made_changes_to_inputs:
        calculos = _calculate_nitrogeno_valores(
            db=db,
            ciclo_catalogo_id=db_registro.ciclo_catalogo_id,  # Usar los IDs existentes del registro
            etapa_catalogo_id=db_registro.etapa_catalogo_id,
            muestra_catalogo_id=db_registro.muestra_catalogo_id,
            origen_catalogo_id=db_registro.origen_catalogo_id,
            peso_muestra_n_g=db_registro.peso_muestra_n_g,
            n_hcl_normalidad=db_registro.n_hcl_normalidad,
            vol_hcl_gastado_cm3=db_registro.vol_hcl_gastado_cm3,
        )
        for key_calc, value_calc in calculos.items():
            setattr(db_registro, key_calc, value_calc)

    db.commit()
    db.refresh(db_registro)
    # Para devolver con refs, podríamos recargarlo con eager_load_catalogs=True, o confiar en que la sesión los cargue si el schema InDB los pide.
    # Por consistencia con get_registro_nitrogeno_by_id, podemos hacer un segundo fetch si es necesario.
    # O, más simple, la función de router puede llamar a get_registro_nitrogeno_by_id después de actualizar.
    return db_registro


def delete_registro_nitrogeno(db: Session, registro_id: int) -> bool:
    """
    Borra un registro de análisis de nitrógeno.
    """
    db_registro = get_registro_nitrogeno_by_id(
        db, registro_id, eager_load_catalogs=False
    )
    if not db_registro:
        return False
    try:
        db.delete(db_registro)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        print(f"Error al borrar RegistroAnalisisNitrogeno {registro_id}: {e}")
        return False


# --- Lógica para Promediar y Actualizar Tabla General ---


def promediar_y_actualizar_nitrogeno_en_tabla_general(
    db: Session,
    ciclo_catalogo_id: int,
    etapa_catalogo_id: int,
    muestra_catalogo_id: int,
    origen_catalogo_id: int,
    ciclo_procesamiento_id: Optional[
        int
    ] = None,  # Opcional: para promediar solo de un lote específico
) -> bool:
    """
    Calcula los promedios de los resultados de nitrógeno para una combinación de catálogos
    (opcionalmente filtrado por un ciclo_procesamiento_id) y actualiza la entrada
    correspondiente en DatosGeneralesLaboratorio.
    """
    query = db.query(models.RegistroAnalisisNitrogeno).filter(
        models.RegistroAnalisisNitrogeno.ciclo_catalogo_id == ciclo_catalogo_id,
        models.RegistroAnalisisNitrogeno.etapa_catalogo_id == etapa_catalogo_id,
        models.RegistroAnalisisNitrogeno.muestra_catalogo_id == muestra_catalogo_id,
        models.RegistroAnalisisNitrogeno.origen_catalogo_id == origen_catalogo_id,
    )

    if ciclo_procesamiento_id:
        query = query.filter(
            models.RegistroAnalisisNitrogeno.ciclo_procesamiento_id
            == ciclo_procesamiento_id
        )

    registros_para_promediar = query.all()

    if not registros_para_promediar:
        print(
            f"No se encontraron registros de nitrógeno para promediar para la combinación de catálogos dada."
        )
        return False  # O podrías optar por poner a None los valores en DatosGenerales si no hay registros

    sum_n_org_total = 0
    count_n_org_total = 0
    sum_n_base_seca = 0
    count_n_base_seca = 0

    for reg in registros_para_promediar:
        if reg.calc_nitrogeno_organico_total_porc is not None:
            sum_n_org_total += reg.calc_nitrogeno_organico_total_porc
            count_n_org_total += 1
        if reg.calc_nitrogeno_base_seca_porc is not None:
            sum_n_base_seca += reg.calc_nitrogeno_base_seca_porc
            count_n_base_seca += 1

    avg_n_org_total = (
        round(sum_n_org_total / count_n_org_total, 2) if count_n_org_total > 0 else None
    )
    avg_n_base_seca = (
        round(sum_n_base_seca / count_n_base_seca, 2) if count_n_base_seca > 0 else None
    )

    # Actualizar DatosGeneralesLaboratorio
    keys_tabla_general = schemas_datos.DatosGeneralesKeys(
        ciclo_id=ciclo_catalogo_id,
        etapa_id=etapa_catalogo_id,
        muestra_id=muestra_catalogo_id,
        origen_id=origen_catalogo_id,
    )
    # Asegurarnos que la entrada general exista (aunque _calculate_nitrogeno_valores ya lo hace al crear registros)
    crud_datos_generales.get_or_create_datos_generales_entry(
        db, keys=keys_tabla_general
    )

    datos_update_general = schemas_datos.DatosGeneralesUpdate(
        resultado_nitrogeno_total_porc=avg_n_org_total,
        resultado_nitrogeno_seca_porc=avg_n_base_seca,
    )

    updated_general_entry = crud_datos_generales.update_datos_generales_entry(
        db, keys=keys_tabla_general, data_update=datos_update_general
    )

    return updated_general_entry is not None
