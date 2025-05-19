# backend_funglusapp/app/crud/crud_datos_nitrogeno.py
from typing import List, Optional

from app.crud import crud_datos_generales  # Para actualizar el resumen y obtener H%
from app.db import models  # Tus modelos SQLAlchemy
from app.schemas import datos_schemas as schemas  # Tus schemas Pydantic para datos
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

# --- CRUD para DatosNitrogeno ---


def get_datos_nitrogeno_by_id(
    db: Session, analisis_id: int
) -> Optional[models.DatosNitrogeno]:
    """Obtiene un análisis de nitrógeno específico por su ID de análisis (PK de la tabla)."""
    return (
        db.query(models.DatosNitrogeno)
        .filter(models.DatosNitrogeno.id == analisis_id)
        .first()
    )


def get_datos_nitrogeno_by_keys(
    db: Session,
    ciclo_id: int,
    etapa_id: int,
    muestra_id: int,
    origen_id: int,
    fecha_analisis_nitrogeno: str,
    numero_repeticion: int,
) -> Optional[models.DatosNitrogeno]:
    """Obtiene una repetición de análisis de nitrógeno específica por su conjunto de claves únicas."""
    return (
        db.query(models.DatosNitrogeno)
        .filter(
            models.DatosNitrogeno.ciclo_id == ciclo_id,
            models.DatosNitrogeno.etapa_id == etapa_id,
            models.DatosNitrogeno.muestra_id == muestra_id,
            models.DatosNitrogeno.origen_id == origen_id,
            models.DatosNitrogeno.fecha_analisis_nitrogeno == fecha_analisis_nitrogeno,
            models.DatosNitrogeno.numero_repeticion == numero_repeticion,
        )
        .first()
    )


def get_all_datos_nitrogeno_for_context(
    db: Session,
    ciclo_id: int,
    etapa_id: int,
    muestra_id: int,
    origen_id: int,
    skip: int = 0,
    limit: int = 100,
) -> List[models.DatosNitrogeno]:
    """
    Obtiene todos los análisis de nitrógeno (todas las fechas, todas las repeticiones)
    para una combinación de Ciclo/Etapa/Muestra/Origen.
    """
    return (
        db.query(models.DatosNitrogeno)
        .filter(
            models.DatosNitrogeno.ciclo_id == ciclo_id,
            models.DatosNitrogeno.etapa_id == etapa_id,
            models.DatosNitrogeno.muestra_id == muestra_id,
            models.DatosNitrogeno.origen_id == origen_id,
        )
        .order_by(
            models.DatosNitrogeno.fecha_analisis_nitrogeno.desc(),
            models.DatosNitrogeno.numero_repeticion.asc(),
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def _calculate_and_set_nitrogeno_fields(db: Session, db_entry: models.DatosNitrogeno):
    """Función auxiliar para calcular y asignar campos de nitrógeno."""
    a = db_entry.peso_muestra_n_g  # Peso N [g]
    b = db_entry.n_hcl_normalidad  # N HCL
    c = db_entry.vol_hcl_gastado_cm3  # Vol HCL [cm3]

    # Calcular Nitrogeno Orgánico total [%]
    if a is not None and b is not None and c is not None and a != 0:
        try:
            db_entry.nitrogeno_organico_total_porc = round(
                ((c * b * 1.4) / a), 2
            )  # Resultado en %
            print(
                f"CRUD DatosNitrogeno: %N Orgánico Total calculado: {db_entry.nitrogeno_organico_total_porc}"
            )
        except Exception as e:
            print(f"CRUD DatosNitrogeno: Error al calcular %N Orgánico Total: {e}")
            db_entry.nitrogeno_organico_total_porc = None
    else:
        db_entry.nitrogeno_organico_total_porc = None
        print(
            f"CRUD DatosNitrogeno: Faltan datos para calcular %N Orgánico Total (a,b,c): a={a}, b={b}, c={c}"
        )

    # Calcular Peso seco [g] y Nitrogeno base seca [%]
    # Necesitamos H% de DatosGeneralesLaboratorio
    datos_generales_keys = schemas.DatosGeneralesKeys(
        ciclo_id=db_entry.ciclo_id,
        etapa_id=db_entry.etapa_id,
        muestra_id=db_entry.muestra_id,
        origen_id=db_entry.origen_id,
    )
    datos_generales_entry = crud_datos_generales.get_datos_generales_entry(
        db, **datos_generales_keys.model_dump()
    )

    humedad_prom_porc = None
    if datos_generales_entry and datos_generales_entry.humedad_prom_porc is not None:
        humedad_prom_porc = datos_generales_entry.humedad_prom_porc
        print(
            f"CRUD DatosNitrogeno: Humedad de referencia (H%) obtenida de DatosGenerales: {humedad_prom_porc}%"
        )
    else:
        print(
            f"CRUD DatosNitrogeno: No se encontró humedad_prom_porc en DatosGenerales para el contexto."
        )

    if a is not None and humedad_prom_porc is not None:
        try:
            # Asumimos que humedad_prom_porc está como porcentaje (ej. 10 para 10%)
            db_entry.peso_seco_g = round(
                (a * (100.0 - humedad_prom_porc) / 100.0), 3
            )  # d = a*(100-H%)/100
            print(
                f"CRUD DatosNitrogeno: Peso Seco (d) calculado: {db_entry.peso_seco_g}"
            )

            if (
                db_entry.peso_seco_g is not None
                and db_entry.peso_seco_g != 0
                and db_entry.nitrogeno_organico_total_porc is not None
                and b is not None
                and c is not None
            ):  # N HCL y Vol HCL también son necesarios para el numerador
                # Usamos el numerador original (c*b*1.4) para mayor precisión antes de dividir por d
                numerador_n_base_seca = c * b * 1.4
                db_entry.nitrogeno_base_seca_porc = round(
                    (numerador_n_base_seca / db_entry.peso_seco_g), 2
                )  # Resultado en %
                print(
                    f"CRUD DatosNitrogeno: %N Base Seca calculado: {db_entry.nitrogeno_base_seca_porc}"
                )
            else:
                db_entry.nitrogeno_base_seca_porc = None
                print(
                    f"CRUD DatosNitrogeno: Faltan datos para calcular %N Base Seca (d o numerador)."
                )
        except Exception as e:
            print(
                f"CRUD DatosNitrogeno: Error al calcular Peso Seco o %N Base Seca: {e}"
            )
            db_entry.peso_seco_g = None
            db_entry.nitrogeno_base_seca_porc = None
    else:
        db_entry.peso_seco_g = None
        db_entry.nitrogeno_base_seca_porc = None
        print(
            f"CRUD DatosNitrogeno: Faltan datos para calcular Peso Seco (a o H%). a={a}, H%={humedad_prom_porc}"
        )


def create_datos_nitrogeno_entry(
    db: Session, entry_create: schemas.DatosNitrogenoCreate
) -> models.DatosNitrogeno:
    """Crea una nueva repetición de análisis de nitrógeno."""

    existing_entry = get_datos_nitrogeno_by_keys(
        db,
        ciclo_id=entry_create.ciclo_id,
        etapa_id=entry_create.etapa_id,
        muestra_id=entry_create.muestra_id,
        origen_id=entry_create.origen_id,
        fecha_analisis_nitrogeno=entry_create.fecha_analisis_nitrogeno,
        numero_repeticion=entry_create.numero_repeticion,
    )
    if existing_entry:
        raise IntegrityError(  # Levantar error si la combinación de claves ya existe
            "Entrada duplicada para DatosNitrogeno con las mismas claves (incluyendo numero_repeticion).",
            params=entry_create.model_dump(),
            orig=None,
        )

    db_entry_data = entry_create.model_dump()
    db_entry = models.DatosNitrogeno(**db_entry_data)

    _calculate_and_set_nitrogeno_fields(db, db_entry)  # Calcula los campos

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)

    # Opcional: Actualizar el resumen en DatosGeneralesLaboratorio
    # Esto es más complejo si hay múltiples repeticiones.
    # Deberías decidir cómo promediar/manejar los resultados de múltiples repeticiones.
    # Por ahora, solo actualizaremos si este es el único o el más reciente.
    # O podrías tener un proceso separado/endpoint para recalcular y actualizar promedios.
    if (
        db_entry.nitrogeno_organico_total_porc is not None
        or db_entry.nitrogeno_base_seca_porc is not None
    ):
        # Aquí necesitarías una lógica para promediar si hay varias repeticiones para la misma fecha/contexto
        # Por simplicidad, actualizaremos con el valor de esta repetición.
        keys_generales = schemas.DatosGeneralesKeys(
            ciclo_id=db_entry.ciclo_id,
            etapa_id=db_entry.etapa_id,
            muestra_id=db_entry.muestra_id,
            origen_id=db_entry.origen_id,
        )
        update_payload_dict = {}
        if db_entry.nitrogeno_organico_total_porc is not None:
            update_payload_dict["resultado_nitrogeno_total_porc"] = (
                db_entry.nitrogeno_organico_total_porc
            )
        if db_entry.nitrogeno_base_seca_porc is not None:
            update_payload_dict["resultado_nitrogeno_seca_porc"] = (
                db_entry.nitrogeno_base_seca_porc
            )

        if update_payload_dict:
            update_payload = schemas.DatosGeneralesUpdate(**update_payload_dict)
            crud_datos_generales.update_datos_generales_entry(
                db, keys=keys_generales, data_update=update_payload
            )
            print(
                f"CRUD DatosNitrogeno: Resumen de nitrógeno actualizado en DatosGeneralesLaboratorio."
            )

    return db_entry


def update_datos_nitrogeno_entry(
    db: Session, analisis_id: int, entry_update: schemas.DatosNitrogenoUpdate
) -> Optional[models.DatosNitrogeno]:
    """Actualiza una repetición de análisis de nitrógeno existente por su ID de análisis."""
    db_entry = get_datos_nitrogeno_by_id(db, analisis_id)
    if not db_entry:
        return None

    update_data_dict = entry_update.model_dump(exclude_unset=True)
    print(
        f"CRUD DatosNitrogeno: Actualizando entrada id={analisis_id} con datos: {update_data_dict}"
    )

    for key, value in update_data_dict.items():
        if hasattr(db_entry, key):
            setattr(db_entry, key, value)

    _calculate_and_set_nitrogeno_fields(db, db_entry)  # Recalcula los campos

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)

    # Opcional: Actualizar el resumen en DatosGeneralesLaboratorio (similar a create)
    if (
        db_entry.nitrogeno_organico_total_porc is not None
        or db_entry.nitrogeno_base_seca_porc is not None
    ):
        keys_generales = schemas.DatosGeneralesKeys(
            ciclo_id=db_entry.ciclo_id,
            etapa_id=db_entry.etapa_id,
            muestra_id=db_entry.muestra_id,
            origen_id=db_entry.origen_id,
        )
        update_payload_dict = {}
        if db_entry.nitrogeno_organico_total_porc is not None:
            update_payload_dict["resultado_nitrogeno_total_porc"] = (
                db_entry.nitrogeno_organico_total_porc
            )
        if db_entry.nitrogeno_base_seca_porc is not None:
            update_payload_dict["resultado_nitrogeno_seca_porc"] = (
                db_entry.nitrogeno_base_seca_porc
            )

        if update_payload_dict:
            update_payload = schemas.DatosGeneralesUpdate(**update_payload_dict)
            crud_datos_generales.update_datos_generales_entry(
                db, keys=keys_generales, data_update=update_payload
            )
            print(
                f"CRUD DatosNitrogeno: Resumen de nitrógeno actualizado en DatosGeneralesLaboratorio."
            )
    return db_entry


def delete_datos_nitrogeno_entry(db: Session, analisis_id: int) -> bool:
    """Borra una repetición de análisis de nitrógeno específica por su ID de análisis."""
    db_entry = get_datos_nitrogeno_by_id(db, analisis_id)
    if not db_entry:
        return False
    try:
        # Opcional: Antes de borrar, podrías querer recalcular el promedio en DatosGeneralesLaboratorio
        # si este era el único registro o si el promedio cambia.
        db.delete(db_entry)
        db.commit()
        print(f"CRUD DatosNitrogeno: Entrada id={analisis_id} BORRADA.")
        return True
    except Exception as e:
        db.rollback()
        print(f"CRUD DatosNitrogeno: ERROR AL BORRAR entrada id={analisis_id}: {e}")
        return False
