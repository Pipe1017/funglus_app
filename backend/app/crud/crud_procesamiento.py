#
from typing import Any, Dict, List, Optional

from sqlalchemy import desc, exc
from sqlalchemy.orm import Session, joinedload

from app.crud import crud_datos_generales
from app.db import models
from app.schemas import datos_schemas as schemas_datos
from app.schemas import procesamiento_schemas as schemas_proc

# ------------------------------------------------------------------
# Operaciones CRUD para CicloProcesamiento
# ------------------------------------------------------------------

def create_ciclo_procesamiento(
    db: Session, ciclo_proc_create: schemas_proc.CicloProcesamientoCreate
) -> models.CicloProcesamiento:
    db_ciclo_procesamiento = models.CicloProcesamiento(
        identificador_lote=ciclo_proc_create.identificador_lote,
        fecha_hora_lote=ciclo_proc_create.fecha_hora_lote,
        tipo_analisis=ciclo_proc_create.tipo_analisis,
        descripcion=ciclo_proc_create.descripcion,
    )
    db.add(db_ciclo_procesamiento)
    db.commit()
    db.refresh(db_ciclo_procesamiento)
    return db_ciclo_procesamiento

def get_ciclo_procesamiento_by_id(
    db: Session, ciclo_proc_id: int
) -> Optional[models.CicloProcesamiento]:
    return (
        db.query(models.CicloProcesamiento)
        .filter(models.CicloProcesamiento.id == ciclo_proc_id)
        .first()
    )

def get_ciclos_procesamiento_by_tipo(
    db: Session, tipo_analisis: str, skip: int = 0, limit: int = 100
) -> List[models.CicloProcesamiento]:
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


# ------------------------------------------------------------------
# Operaciones CRUD para RegistroAnalisisNitrogeno
# ------------------------------------------------------------------

def _calculate_nitrogeno_valores(
    db: Session,
    keys_generales: schemas_datos.DatosGeneralesKeys,
    peso_muestra_n_g: Optional[float],
    n_hcl_normalidad: Optional[float],
    vol_hcl_gastado_cm3: Optional[float],
) -> Dict[str, Optional[float]]:
    resultados = {
        "calc_nitrogeno_organico_total_porc": None,
        "calc_humedad_usada_referencia_porc": None,
        "calc_peso_seco_g": None,
        "calc_nitrogeno_base_seca_porc": None,
    }
    db_datos_generales = crud_datos_generales.get_datos_generales_entry(db, **keys_generales.model_dump())
    humedad_prom_porc = None
    if db_datos_generales and db_datos_generales.humedad_prom_porc is not None:
        humedad_prom_porc = db_datos_generales.humedad_prom_porc
        resultados["calc_humedad_usada_referencia_porc"] = humedad_prom_porc

    a, b, c = peso_muestra_n_g, n_hcl_normalidad, vol_hcl_gastado_cm3
    if a is not None and a != 0 and b is not None and c is not None:
        try:
            n_org_total = (c * b * 1.4) / a
            resultados["calc_nitrogeno_organico_total_porc"] = round(n_org_total, 3)
            if humedad_prom_porc is not None:
                peso_seco = a * (100.0 - humedad_prom_porc) / 100.0
                resultados["calc_peso_seco_g"] = round(peso_seco, 3)
                if peso_seco > 0:
                    n_base_seca = (c * b * 1.4) / peso_seco
                    resultados["calc_nitrogeno_base_seca_porc"] = round(n_base_seca, 3)
        except (ZeroDivisionError, TypeError):
            pass
    return resultados


def create_registro_nitrogeno(
    db: Session, registro_create: schemas_proc.RegistroAnalisisNitrogenoCreate
) -> models.RegistroAnalisisNitrogeno:
    # 1. Asegurar Datos Generales (Incluyendo Secuencia)
    keys_generales = schemas_datos.DatosGeneralesKeys(
        ciclo_id=registro_create.ciclo_catalogo_id,
        etapa_id=registro_create.etapa_catalogo_id,
        muestra_id=registro_create.muestra_catalogo_id,
        origen_id=registro_create.origen_catalogo_id,
        secuencia_id=registro_create.secuencia_catalogo_id, 
    )
    crud_datos_generales.get_or_create_datos_generales_entry(db, keys=keys_generales)

    # 2. Calcular
    calculos = _calculate_nitrogeno_valores(
        db=db,
        keys_generales=keys_generales,
        peso_muestra_n_g=registro_create.peso_muestra_n_g,
        n_hcl_normalidad=registro_create.n_hcl_normalidad,
        vol_hcl_gastado_cm3=registro_create.vol_hcl_gastado_cm3,
    )
    
    # 3. Guardar
    db_registro = models.RegistroAnalisisNitrogeno(**registro_create.model_dump(), **calculos)
    db.add(db_registro)
    db.commit()
    db.refresh(db_registro)
    return db_registro


def get_registro_nitrogeno_by_id(
    db: Session, registro_id: int, eager_load_catalogs: bool = True
) -> Optional[models.RegistroAnalisisNitrogeno]:
    query = db.query(models.RegistroAnalisisNitrogeno)
    if eager_load_catalogs:
        query = query.options(
            joinedload(models.RegistroAnalisisNitrogeno.ciclo_catalogo_ref),
            joinedload(models.RegistroAnalisisNitrogeno.etapa_catalogo_ref),
            joinedload(models.RegistroAnalisisNitrogeno.muestra_catalogo_ref),
            joinedload(models.RegistroAnalisisNitrogeno.origen_catalogo_ref),
            joinedload(models.RegistroAnalisisNitrogeno.secuencia_catalogo_ref),
        )
    return query.filter(models.RegistroAnalisisNitrogeno.id == registro_id).first()


def get_registros_nitrogeno_by_ciclo_procesamiento_id(
    db: Session,
    ciclo_proc_id: int,
    skip: int = 0,
    limit: int = 100,
    eager_load_catalogs: bool = True,
) -> List[models.RegistroAnalisisNitrogeno]:
    query = db.query(models.RegistroAnalisisNitrogeno)
    if eager_load_catalogs:
        query = query.options(
            joinedload(models.RegistroAnalisisNitrogeno.ciclo_catalogo_ref),
            joinedload(models.RegistroAnalisisNitrogeno.etapa_catalogo_ref),
            joinedload(models.RegistroAnalisisNitrogeno.muestra_catalogo_ref),
            joinedload(models.RegistroAnalisisNitrogeno.origen_catalogo_ref),
            joinedload(models.RegistroAnalisisNitrogeno.secuencia_catalogo_ref),
        )
    return (
        query.filter(models.RegistroAnalisisNitrogeno.ciclo_procesamiento_id == ciclo_proc_id)
        .order_by(models.RegistroAnalisisNitrogeno.id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_registro_nitrogeno(
    db: Session, registro_id: int, registro_update: schemas_proc.RegistroAnalisisNitrogenoUpdate,
) -> Optional[models.RegistroAnalisisNitrogeno]:
    db_registro = get_registro_nitrogeno_by_id(db, registro_id, eager_load_catalogs=False)
    if not db_registro:
        return None

    update_data = registro_update.model_dump(exclude_unset=True)
    made_changes_to_inputs = False
    for key, value in update_data.items():
        if hasattr(db_registro, key) and getattr(db_registro, key) != value:
            setattr(db_registro, key, value)
            if key in ["peso_muestra_n_g", "n_hcl_normalidad", "vol_hcl_gastado_cm3"]:
                made_changes_to_inputs = True

    if made_changes_to_inputs:
        keys_generales = schemas_datos.DatosGeneralesKeys(
            ciclo_id=db_registro.ciclo_catalogo_id,
            etapa_id=db_registro.etapa_catalogo_id,
            muestra_id=db_registro.muestra_catalogo_id,
            origen_id=db_registro.origen_catalogo_id,
            secuencia_id=db_registro.secuencia_catalogo_id,
        )
        calculos = _calculate_nitrogeno_valores(
            db=db,
            keys_generales=keys_generales,
            peso_muestra_n_g=db_registro.peso_muestra_n_g,
            n_hcl_normalidad=db_registro.n_hcl_normalidad,
            vol_hcl_gastado_cm3=db_registro.vol_hcl_gastado_cm3,
        )
        for key_calc, value_calc in calculos.items():
            setattr(db_registro, key_calc, value_calc)

    db.commit()
    db.refresh(db_registro)
    return db_registro


def delete_registro_nitrogeno(db: Session, registro_id: int) -> bool:
    db_registro = get_registro_nitrogeno_by_id(db, registro_id, eager_load_catalogs=False)
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


# ------------------------------------------------------------------
# Lógica para Promediar y Actualizar Tabla General (NITRÓGENO)
# ------------------------------------------------------------------

def promediar_y_actualizar_nitrogeno_en_tabla_general(
    db: Session,
    ciclo_catalogo_id: int,
    etapa_catalogo_id: int,
    muestra_catalogo_id: int,
    origen_catalogo_id: int,
    secuencia_catalogo_id: int, # <--- ¡CAMPO AÑADIDO!
    ciclo_procesamiento_id: Optional[int] = None,
) -> bool:
    """
    Calcula los promedios de nitrógeno para una combinación de catálogos y actualiza DatosGenerales.
    """
    query = db.query(models.RegistroAnalisisNitrogeno).filter(
        models.RegistroAnalisisNitrogeno.ciclo_catalogo_id == ciclo_catalogo_id,
        models.RegistroAnalisisNitrogeno.etapa_catalogo_id == etapa_catalogo_id,
        models.RegistroAnalisisNitrogeno.muestra_catalogo_id == muestra_catalogo_id,
        models.RegistroAnalisisNitrogeno.origen_catalogo_id == origen_catalogo_id,
        models.RegistroAnalisisNitrogeno.secuencia_catalogo_id == secuencia_catalogo_id, # <--- Filtro Corregido
    )

    if ciclo_procesamiento_id:
        query = query.filter(models.RegistroAnalisisNitrogeno.ciclo_procesamiento_id == ciclo_procesamiento_id)

    registros = query.all()

    if not registros:
        return False 

    sum_n_org = 0
    count_n_org = 0
    sum_n_base = 0
    count_n_base = 0

    for reg in registros:
        if reg.calc_nitrogeno_organico_total_porc is not None:
            sum_n_org += reg.calc_nitrogeno_organico_total_porc
            count_n_org += 1
        if reg.calc_nitrogeno_base_seca_porc is not None:
            sum_n_base += reg.calc_nitrogeno_base_seca_porc
            count_n_base += 1

    avg_n_org = round(sum_n_org / count_n_org, 3) if count_n_org > 0 else None
    avg_n_base = round(sum_n_base / count_n_base, 3) if count_n_base > 0 else None

    # Actualizar DatosGeneralesLaboratorio
    keys = schemas_datos.DatosGeneralesKeys(
        ciclo_id=ciclo_catalogo_id,
        etapa_id=etapa_catalogo_id,
        muestra_id=muestra_catalogo_id,
        origen_id=origen_catalogo_id,
        secuencia_id=secuencia_catalogo_id # <--- Campo Obligatorio
    )
    
    crud_datos_generales.get_or_create_datos_generales_entry(db, keys=keys)

    datos_update = schemas_datos.DatosGeneralesUpdate(
        resultado_nitrogeno_total_porc=avg_n_org,
        resultado_nitrogeno_seca_porc=avg_n_base,
    )

    updated = crud_datos_generales.update_datos_generales_entry(
        db, keys=keys, data_update=datos_update
    )

    return updated is not None


# ------------------------------------------------------------------
# Operaciones CRUD para RegistroAnalisisCenizas
# ------------------------------------------------------------------

def _calculate_cenizas_porc(
    peso_crisol_vacio_g: Optional[float],
    peso_crisol_mas_muestra_g: Optional[float],
    peso_crisol_mas_cenizas_g: Optional[float],
) -> Optional[float]:
    a = peso_crisol_vacio_g
    b = peso_crisol_mas_muestra_g
    c = peso_crisol_mas_cenizas_g

    if a is not None and b is not None and c is not None:
        denominador = b - a
        if denominador != 0:
            try:
                cenizas_porc = ((c - a) / denominador) * 100
                return round(cenizas_porc, 3)
            except Exception:
                return None
    return None

def create_registro_cenizas(
    db: Session, registro_create: schemas_proc.RegistroAnalisisCenizasCreate
) -> models.RegistroAnalisisCenizas:
    keys_generales = schemas_datos.DatosGeneralesKeys(
        ciclo_id=registro_create.ciclo_catalogo_id,
        etapa_id=registro_create.etapa_catalogo_id,
        muestra_id=registro_create.muestra_catalogo_id,
        origen_id=registro_create.origen_catalogo_id,
        secuencia_id=registro_create.secuencia_catalogo_id,
    )
    crud_datos_generales.get_or_create_datos_generales_entry(db, keys=keys_generales)

    calc_cenizas = _calculate_cenizas_porc(
        registro_create.peso_crisol_vacio_g,
        registro_create.peso_crisol_mas_muestra_g,
        registro_create.peso_crisol_mas_cenizas_g,
    )
    
    db_registro = models.RegistroAnalisisCenizas(**registro_create.model_dump(), calc_cenizas_porc=calc_cenizas)
    db.add(db_registro)
    db.commit()
    db.refresh(db_registro)

    if db_registro.calc_cenizas_porc is not None:
        update_payload = schemas_datos.DatosGeneralesUpdate(resultado_cenizas_porc=db_registro.calc_cenizas_porc)
        crud_datos_generales.update_datos_generales_entry(db, keys=keys_generales, data_update=update_payload)
        
    return db_registro

def get_registro_cenizas_by_id(
    db: Session, registro_id: int, eager_load_catalogs: bool = True
) -> Optional[models.RegistroAnalisisCenizas]:
    query = db.query(models.RegistroAnalisisCenizas)
    if eager_load_catalogs:
        query = query.options(
            joinedload(models.RegistroAnalisisCenizas.ciclo_catalogo_ref),
            joinedload(models.RegistroAnalisisCenizas.etapa_catalogo_ref),
            joinedload(models.RegistroAnalisisCenizas.muestra_catalogo_ref),
            joinedload(models.RegistroAnalisisCenizas.origen_catalogo_ref),
            joinedload(models.RegistroAnalisisCenizas.secuencia_catalogo_ref),
        )
    return query.filter(models.RegistroAnalisisCenizas.id == registro_id).first()

def get_registros_cenizas_by_ciclo_procesamiento_id(
    db: Session,
    ciclo_proc_id: int,
    skip: int = 0,
    limit: int = 100,
    eager_load_catalogs: bool = True,
) -> List[models.RegistroAnalisisCenizas]:
    query = db.query(models.RegistroAnalisisCenizas)
    if eager_load_catalogs:
        query = query.options(
            joinedload(models.RegistroAnalisisCenizas.ciclo_catalogo_ref),
            joinedload(models.RegistroAnalisisCenizas.etapa_catalogo_ref),
            joinedload(models.RegistroAnalisisCenizas.muestra_catalogo_ref),
            joinedload(models.RegistroAnalisisCenizas.origen_catalogo_ref),
            joinedload(models.RegistroAnalisisCenizas.secuencia_catalogo_ref),
        )
    return (
        query.filter(models.RegistroAnalisisCenizas.ciclo_procesamiento_id == ciclo_proc_id)
        .order_by(models.RegistroAnalisisCenizas.id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def update_registro_cenizas(
    db: Session,
    registro_id: int,
    registro_update: schemas_proc.RegistroAnalisisCenizasUpdate,
) -> Optional[models.RegistroAnalisisCenizas]:
    db_registro = get_registro_cenizas_by_id(db, registro_id, eager_load_catalogs=False)
    if not db_registro:
        return None

    update_data = registro_update.model_dump(exclude_unset=True)
    made_changes_to_inputs = False

    for key, value in update_data.items():
        if hasattr(db_registro, key) and getattr(db_registro, key) != value:
            setattr(db_registro, key, value)
            if key in ["peso_crisol_vacio_g", "peso_crisol_mas_muestra_g", "peso_crisol_mas_cenizas_g"]:
                made_changes_to_inputs = True

    if made_changes_to_inputs:
        calc_cenizas = _calculate_cenizas_porc(
            peso_crisol_vacio_g=db_registro.peso_crisol_vacio_g,
            peso_crisol_mas_muestra_g=db_registro.peso_crisol_mas_muestra_g,
            peso_crisol_mas_cenizas_g=db_registro.peso_crisol_mas_cenizas_g,
        )
        db_registro.calc_cenizas_porc = calc_cenizas

    try:
        db.commit()
        db.refresh(db_registro)
    except Exception as e:
        db.rollback()
        raise e

    if made_changes_to_inputs and db_registro.calc_cenizas_porc is not None:
        keys = schemas_datos.DatosGeneralesKeys(
            ciclo_id=db_registro.ciclo_catalogo_id,
            etapa_id=db_registro.etapa_catalogo_id,
            muestra_id=db_registro.muestra_catalogo_id,
            origen_id=db_registro.origen_catalogo_id,
            secuencia_id=db_registro.secuencia_catalogo_id,
        )
        update_payload = schemas_datos.DatosGeneralesUpdate(
            resultado_cenizas_porc=db_registro.calc_cenizas_porc
        )
        crud_datos_generales.update_datos_generales_entry(
            db, keys=keys, data_update=update_payload
        )
        
    return db_registro

def delete_registro_cenizas(db: Session, registro_id: int) -> bool:
    db_registro = get_registro_cenizas_by_id(db, registro_id, eager_load_catalogs=False)
    if not db_registro:
        return False
    try:
        db.delete(db_registro)
        db.commit()
        return True
    except Exception:
        db.rollback()
        return False

def resincronizar_cenizas_en_tabla_general(db: Session, ciclo_proc_id: int) -> int:
    registros = get_registros_cenizas_by_ciclo_procesamiento_id(db, ciclo_proc_id=ciclo_proc_id, limit=1000, eager_load_catalogs=False)
    if not registros:
        return 0

    count = 0
    for reg in registros:
        keys = schemas_datos.DatosGeneralesKeys(
            ciclo_id=reg.ciclo_catalogo_id,
            etapa_id=reg.etapa_catalogo_id,
            muestra_id=reg.muestra_catalogo_id,
            origen_id=reg.origen_catalogo_id,
            secuencia_id=reg.secuencia_catalogo_id,
        )
        payload = schemas_datos.DatosGeneralesUpdate(resultado_cenizas_porc=reg.calc_cenizas_porc)
        if crud_datos_generales.update_datos_generales_entry(db, keys=keys, data_update=payload):
            count += 1
    return count