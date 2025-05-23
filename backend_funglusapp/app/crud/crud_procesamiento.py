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

    keys_tabla_general = schemas_datos.DatosGeneralesKeys(
        ciclo_id=ciclo_catalogo_id,
        etapa_id=etapa_catalogo_id,
        muestra_id=muestra_catalogo_id,
        origen_id=origen_catalogo_id,
    )
    # CAMBIO: Usar get_datos_generales_entry en lugar de get_or_create
    db_datos_generales = crud_datos_generales.get_datos_generales_entry(
        db,
        ciclo_id=keys_tabla_general.ciclo_id,
        etapa_id=keys_tabla_general.etapa_id,
        muestra_id=keys_tabla_general.muestra_id,
        origen_id=keys_tabla_general.origen_id,
    )

    humedad_prom_porc = None
    if db_datos_generales and db_datos_generales.humedad_prom_porc is not None:
        humedad_prom_porc = db_datos_generales.humedad_prom_porc
        resultados["calc_humedad_usada_referencia_porc"] = humedad_prom_porc
    elif db_datos_generales is None:
        # La entrada general no existe. H% es desconocido.
        # El frontend debería haber prevenido esto si H% es mandatorio.
        print(
            f"Advertencia: No existe entrada en DatosGeneralesLaboratorio para claves {keys_tabla_general.model_dump()} al calcular N."
        )
        pass  # humedad_prom_porc sigue siendo None

    # ... (resto de los cálculos de nitrógeno, que ya manejan humedad_prom_porc siendo None) ...
    a = peso_muestra_n_g
    b = n_hcl_normalidad
    c = vol_hcl_gastado_cm3

    if a is not None and a != 0 and b is not None and c is not None:
        try:
            n_org_total = (c * b * 1.4) / a
            resultados["calc_nitrogeno_organico_total_porc"] = round(n_org_total, 2)

            if humedad_prom_porc is not None:  # Solo calcular si H% existe
                peso_seco = a * (100.0 - humedad_prom_porc) / 100.0
                resultados["calc_peso_seco_g"] = round(peso_seco, 3)
                if peso_seco != 0:
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
    # La verificación de existencia de DatosGeneralesLaboratorio y la obtención de H%
    # ahora está encapsulada en _calculate_nitrogeno_valores.
    # Si el frontend permite continuar sin una entrada general existente (y por tanto sin H%),
    # algunos campos calculados serán None.

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
    # ... (resto de la creación de db_registro y commit, como estaba) ...
    db_registro = models.RegistroAnalisisNitrogeno(
        ciclo_procesamiento_id=registro_create.ciclo_procesamiento_id,
        ciclo_catalogo_id=registro_create.ciclo_catalogo_id,
        etapa_catalogo_id=registro_create.etapa_catalogo_id,
        muestra_catalogo_id=registro_create.muestra_catalogo_id,
        origen_catalogo_id=registro_create.origen_catalogo_id,
        peso_muestra_n_g=registro_create.peso_muestra_n_g,
        n_hcl_normalidad=registro_create.n_hcl_normalidad,
        vol_hcl_gastado_cm3=registro_create.vol_hcl_gastado_cm3,
        **calculos,
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
    db_registro = get_registro_nitrogeno_by_id(
        db, registro_id, eager_load_catalogs=False
    )
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
        # Re-verificar la existencia de la entrada general y H% es crucial si los IDs de catálogo pudieran cambiar (no lo hacen aquí)
        # o si H% en la tabla general pudiera haber cambiado por otra acción.
        # _calculate_nitrogeno_valores ya hace la consulta a DatosGeneralesLaboratorio.
        calculos = _calculate_nitrogeno_valores(
            db=db,
            ciclo_catalogo_id=db_registro.ciclo_catalogo_id,
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


# --- ¡NUEVAS OPERACIONES CRUD PARA REGISTRO ANÁLISIS DE CENIZAS! ---


def _calculate_cenizas_porc(
    peso_crisol_vacio_g: Optional[float],  # (a)
    peso_crisol_mas_muestra_g: Optional[float],  # (b)
    peso_crisol_mas_cenizas_g: Optional[float],  # (c)
) -> Optional[float]:
    """
    Helper para calcular el porcentaje de cenizas.
    Fórmula: Cenizas [%] = ((c - a) / (b - a)) * 100
    """
    a = peso_crisol_vacio_g
    b = peso_crisol_mas_muestra_g
    c = peso_crisol_mas_cenizas_g

    if a is not None and b is not None and c is not None:
        denominador = b - a
        if denominador != 0:
            try:
                cenizas_porc = ((c - a) / denominador) * 100
                return round(cenizas_porc, 2)  # Redondear a 2 decimales
            except Exception as e:
                print(f"Error en el cálculo de cenizas: {e}")
                return None
        else:
            print(
                "Advertencia: División por cero (peso muestra es cero) al calcular cenizas."
            )
            return None
    return None


def create_registro_cenizas(
    db: Session, registro_create: schemas_proc.RegistroAnalisisCenizasCreate
) -> models.RegistroAnalisisCenizas:
    # CAMBIO: Verificar primero si la entrada en DatosGeneralesLaboratorio existe.
    # Si no existe, no se debería permitir crear el registro de cenizas.
    db_datos_generales = crud_datos_generales.get_datos_generales_entry(
        db,
        ciclo_id=registro_create.ciclo_catalogo_id,
        etapa_id=registro_create.etapa_catalogo_id,
        muestra_id=registro_create.muestra_catalogo_id,
        origen_id=registro_create.origen_catalogo_id,
    )
    if not db_datos_generales:
        # Este error será capturado por el router y devuelto como HTTP 4xx/5xx
        raise ValueError(
            "No existe una entrada en la Tabla General para la combinación de catálogos seleccionada. "
            "Por favor, créela primero en 'Laboratorio General'."
        )

    calc_cenizas = _calculate_cenizas_porc(
        # ... (como estaba) ...
        peso_crisol_vacio_g=registro_create.peso_crisol_vacio_g,
        peso_crisol_mas_muestra_g=registro_create.peso_crisol_mas_muestra_g,
        peso_crisol_mas_cenizas_g=registro_create.peso_crisol_mas_cenizas_g,
    )
    # ... (creación de db_registro_cenizas, try-except para commit, como estaba) ...
    db_registro_cenizas = models.RegistroAnalisisCenizas(  # ... asignaciones ...
        ciclo_procesamiento_id=registro_create.ciclo_procesamiento_id,
        ciclo_catalogo_id=registro_create.ciclo_catalogo_id,
        etapa_catalogo_id=registro_create.etapa_catalogo_id,
        muestra_catalogo_id=registro_create.muestra_catalogo_id,
        origen_catalogo_id=registro_create.origen_catalogo_id,
        peso_crisol_vacio_g=registro_create.peso_crisol_vacio_g,
        peso_crisol_mas_muestra_g=registro_create.peso_crisol_mas_muestra_g,
        peso_crisol_mas_cenizas_g=registro_create.peso_crisol_mas_cenizas_g,
        calc_cenizas_porc=calc_cenizas,
    )
    try:
        db.add(db_registro_cenizas)
        db.commit()
        db.refresh(db_registro_cenizas)
    except exc.IntegrityError as e:
        db.rollback()
        print(f"Error de Integridad al crear registro de cenizas: {e.orig}")
        raise ValueError(
            f"Ya existe un registro de cenizas para esta combinación de lote y catálogos. Detalle: {e.orig}"
        )
    except Exception as e:
        db.rollback()
        print(f"Error general al crear registro de cenizas: {e}")
        raise

    # Actualizar tabla general después de crear el registro de cenizas
    if db_registro_cenizas.calc_cenizas_porc is not None:
        actualizar_cenizas_en_tabla_general(
            db=db,
            ciclo_catalogo_id=db_registro_cenizas.ciclo_catalogo_id,
            etapa_catalogo_id=db_registro_cenizas.etapa_catalogo_id,
            muestra_catalogo_id=db_registro_cenizas.muestra_catalogo_id,
            origen_catalogo_id=db_registro_cenizas.origen_catalogo_id,
            resultado_cenizas_porc=db_registro_cenizas.calc_cenizas_porc,
        )

    return db_registro_cenizas


def get_registro_cenizas_by_id(
    db: Session, registro_id: int, eager_load_catalogs: bool = True
) -> Optional[models.RegistroAnalisisCenizas]:
    """
    Obtiene un registro de análisis de cenizas por su ID.
    """
    query = db.query(models.RegistroAnalisisCenizas)
    if eager_load_catalogs:
        query = query.options(
            joinedload(models.RegistroAnalisisCenizas.ciclo_catalogo_ref),
            joinedload(models.RegistroAnalisisCenizas.etapa_catalogo_ref),
            joinedload(models.RegistroAnalisisCenizas.muestra_catalogo_ref),
            joinedload(models.RegistroAnalisisCenizas.origen_catalogo_ref),
            # Opcional: joinedload(models.RegistroAnalisisCenizas.ciclo_procesamiento_ref)
        )
    return query.filter(models.RegistroAnalisisCenizas.id == registro_id).first()


def get_registros_cenizas_by_ciclo_procesamiento_id(
    db: Session,
    ciclo_proc_id: int,
    skip: int = 0,
    limit: int = 100,
    eager_load_catalogs: bool = True,
) -> List[models.RegistroAnalisisCenizas]:
    """
    Obtiene todos los registros de análisis de cenizas para un ciclo_procesamiento_id específico.
    """
    query = db.query(models.RegistroAnalisisCenizas)
    if eager_load_catalogs:
        query = query.options(
            joinedload(models.RegistroAnalisisCenizas.ciclo_catalogo_ref),
            joinedload(models.RegistroAnalisisCenizas.etapa_catalogo_ref),
            joinedload(models.RegistroAnalisisCenizas.muestra_catalogo_ref),
            joinedload(models.RegistroAnalisisCenizas.origen_catalogo_ref),
        )
    return (
        query.filter(
            models.RegistroAnalisisCenizas.ciclo_procesamiento_id == ciclo_proc_id
        )
        .order_by(models.RegistroAnalisisCenizas.id)  # O por otro campo como created_at
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

    # Verificar que la entrada general exista (no debería ser necesario si no se pueden cambiar los IDs de catálogo aquí)
    # db_datos_generales = crud_datos_generales.get_datos_generales_entry(...)
    # if not db_datos_generales: raise ValueError("La entrada general asociada no existe.")

    # ... (resto de la lógica de actualización de campos y recalculo como estaba) ...
    # (y la llamada a actualizar_cenizas_en_tabla_general) ...
    update_data = registro_update.model_dump(exclude_unset=True)
    made_changes_to_inputs = False

    for key, value in update_data.items():
        if hasattr(db_registro, key) and getattr(db_registro, key) != value:
            setattr(db_registro, key, value)
            if key in [
                "peso_crisol_vacio_g",
                "peso_crisol_mas_muestra_g",
                "peso_crisol_mas_cenizas_g",
            ]:
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
    except exc.IntegrityError as e:
        db.rollback()
        print(
            f"Error de Integridad al actualizar registro de cenizas {registro_id}: {e.orig}"
        )
        raise ValueError(
            f"Error de integridad al actualizar registro de cenizas. Detalle: {e.orig}"
        )
    except Exception as e:
        db.rollback()
        print(f"Error general al actualizar registro de cenizas {registro_id}: {e}")
        raise

    if made_changes_to_inputs and db_registro.calc_cenizas_porc is not None:
        actualizar_cenizas_en_tabla_general(
            db=db,
            ciclo_catalogo_id=db_registro.ciclo_catalogo_id,
            etapa_catalogo_id=db_registro.etapa_catalogo_id,
            muestra_catalogo_id=db_registro.muestra_catalogo_id,
            origen_catalogo_id=db_registro.origen_catalogo_id,
            resultado_cenizas_porc=db_registro.calc_cenizas_porc,
        )
    return db_registro


def delete_registro_cenizas(db: Session, registro_id: int) -> bool:
    """
    Borra un registro de análisis de cenizas.
    """
    db_registro = get_registro_cenizas_by_id(db, registro_id, eager_load_catalogs=False)
    if not db_registro:
        return False
    try:
        db.delete(db_registro)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        print(f"Error al borrar RegistroAnalisisCenizas {registro_id}: {e}")
        return False


# --- Lógica para Actualizar Resultado de Cenizas en Tabla General ---


def actualizar_cenizas_en_tabla_general(
    db: Session,
    ciclo_catalogo_id: int,
    etapa_catalogo_id: int,
    muestra_catalogo_id: int,
    origen_catalogo_id: int,
    resultado_cenizas_porc: Optional[float],  # El valor calculado de calc_cenizas_porc
) -> bool:
    """
    Actualiza el campo resultado_cenizas_porc en DatosGeneralesLaboratorio
    para una combinación de catálogos específica.
    """
    keys_tabla_general = schemas_datos.DatosGeneralesKeys(
        ciclo_id=ciclo_catalogo_id,
        etapa_id=etapa_catalogo_id,
        muestra_id=muestra_catalogo_id,
        origen_id=origen_catalogo_id,
    )
    # Asegurar que la entrada general exista (aunque create_registro_cenizas ya debería haberlo hecho)
    crud_datos_generales.get_or_create_datos_generales_entry(
        db, keys=keys_tabla_general
    )

    datos_update_general = schemas_datos.DatosGeneralesUpdate(
        resultado_cenizas_porc=resultado_cenizas_porc
    )

    updated_general_entry = crud_datos_generales.update_datos_generales_entry(
        db, keys=keys_tabla_general, data_update=datos_update_general
    )

    return updated_general_entry is not None


# --- Puedes añadir aquí la función para promediar y actualizar nitrógeno que ya teníamos ---
# def promediar_y_actualizar_nitrogeno_en_tabla_general(...): ...
