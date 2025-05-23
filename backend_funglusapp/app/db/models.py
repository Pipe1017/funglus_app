# backend_funglusapp/app/db/models.py
from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base

# --- TABLAS DE CATÁLOGO / LOOKUP ---


class Ciclo(Base):
    __tablename__ = "catalogo_ciclos"
    id = Column(Integer, primary_key=True, index=True)
    nombre_ciclo = Column(String, unique=True, index=True, nullable=False)
    descripcion = Column(String, nullable=True)
    fecha_inicio = Column(
        String, nullable=True
    )  # Considera cambiar a Date o DateTime si es apropiado

    # Relaciones
    datos_generales_lab = relationship(
        "DatosGeneralesLaboratorio", back_populates="ciclo_ref"
    )
    registros_nitrogeno = relationship(
        "RegistroAnalisisNitrogeno", back_populates="ciclo_catalogo_ref"
    )
    # TODO: Cuando se implemente RegistroAnalisisCenizas, actualizar o añadir la relación aquí.
    # datos_cenizas = relationship("DatosCenizas", back_populates="ciclo_ref") # Comentado si DatosCenizas ya no existe o será reemplazado


class Etapa(Base):
    __tablename__ = "catalogo_etapas"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True, nullable=False)
    descripcion = Column(String, nullable=True)

    # Relaciones
    datos_generales_lab = relationship(
        "DatosGeneralesLaboratorio", back_populates="etapa_ref"
    )
    registros_nitrogeno = relationship(
        "RegistroAnalisisNitrogeno", back_populates="etapa_catalogo_ref"
    )
    # TODO: Actualizar para RegistroAnalisisCenizas
    # datos_cenizas = relationship("DatosCenizas", back_populates="etapa_ref") # Comentado


class Muestra(Base):
    __tablename__ = "catalogo_muestras"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True, nullable=False)
    descripcion = Column(String, nullable=True)

    # Relaciones
    datos_generales_lab = relationship(
        "DatosGeneralesLaboratorio", back_populates="muestra_ref"
    )
    registros_nitrogeno = relationship(
        "RegistroAnalisisNitrogeno", back_populates="muestra_catalogo_ref"
    )
    # TODO: Actualizar para RegistroAnalisisCenizas
    # datos_cenizas = relationship("DatosCenizas", back_populates="muestra_ref") # Comentado


class Origen(Base):
    __tablename__ = "catalogo_origenes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True, nullable=False)
    descripcion = Column(String, nullable=True)

    # Relaciones
    datos_generales_lab = relationship(
        "DatosGeneralesLaboratorio", back_populates="origen_ref"
    )
    registros_nitrogeno = relationship(
        "RegistroAnalisisNitrogeno", back_populates="origen_catalogo_ref"
    )
    # TODO: Actualizar para RegistroAnalisisCenizas
    # datos_cenizas = relationship("DatosCenizas", back_populates="origen_ref") # Comentado


# --- TABLA DE DATOS GENERALES DE LABORATORIO (PRINCIPAL) ---


class DatosGeneralesLaboratorio(Base):
    __tablename__ = "datos_generales_laboratorio"
    __table_args__ = {
        "comment": "Tabla central para metadatos y resultados consolidados por combinación de catálogos."
    }

    id = Column(Integer, primary_key=True, index=True)

    ciclo_id = Column(
        Integer, ForeignKey("catalogo_ciclos.id"), nullable=False, index=True
    )
    etapa_id = Column(
        Integer, ForeignKey("catalogo_etapas.id"), nullable=False, index=True
    )
    muestra_id = Column(
        Integer, ForeignKey("catalogo_muestras.id"), nullable=False, index=True
    )
    origen_id = Column(
        Integer, ForeignKey("catalogo_origenes.id"), nullable=False, index=True
    )

    # Referencias a los catálogos
    ciclo_ref = relationship("Ciclo", back_populates="datos_generales_lab")
    etapa_ref = relationship("Etapa", back_populates="datos_generales_lab")
    muestra_ref = relationship("Muestra", back_populates="datos_generales_lab")
    origen_ref = relationship("Origen", back_populates="datos_generales_lab")

    # Campos de metadatos y resultados
    fecha_ingreso = Column(String, nullable=True)  # Considerar DateTime
    fecha_procesamiento = Column(String, nullable=True)  # Considerar DateTime
    peso_h1_g = Column(Float, nullable=True)
    peso_h2_g = Column(Float, nullable=True)
    humedad_1_porc = Column(Float, nullable=True, comment="Humedad 1 (%)")
    humedad_2_porc = Column(Float, nullable=True, comment="Humedad 2 (%)")
    humedad_prom_porc = Column(
        Float, nullable=True, comment="Humedad Promedio (calculada)"
    )
    peso_ph_g = Column(Float, nullable=True)
    ph_valor = Column(Float, nullable=True)
    fdr_1_kgf = Column(Float, nullable=True)
    fdr_2_kgf = Column(Float, nullable=True)
    fdr_3_kgf = Column(Float, nullable=True)
    fdr_prom_kgf = Column(Float, nullable=True, comment="FDR Promedio (calculada)")

    # Resultados consolidados de análisis específicos
    resultado_cenizas_porc = Column(Float, nullable=True)
    resultado_nitrogeno_total_porc = Column(Float, nullable=True)
    resultado_nitrogeno_seca_porc = Column(Float, nullable=True)

    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "ciclo_id",
            "etapa_id",
            "muestra_id",
            "origen_id",
            name="_datos_laboratorio_claves_uc",
        ),
        {
            "comment": "Tabla central para metadatos y resultados consolidados por combinación de catálogos."
        },  # Moví el comentario aquí
    )


# --- TABLAS PARA CICLOS DE PROCESAMIENTO Y REGISTROS DE ANÁLISIS ---


class CicloProcesamiento(Base):
    __tablename__ = "ciclos_procesamiento"
    __table_args__ = (
        UniqueConstraint(
            "identificador_lote",
            "fecha_hora_lote",
            "tipo_analisis",
            name="_ciclo_proc_ident_fecha_tipo_uc",
        ),
        {
            "comment": "Agrupa análisis (Nitrógeno, Cenizas) bajo un lote o sesión de procesamiento específico."
        },
    )

    id = Column(Integer, primary_key=True, index=True)
    identificador_lote = Column(
        String,
        nullable=False,
        index=True,
        comment="Nombre o código del lote de procesamiento, ingresado por el usuario.",
    )
    fecha_hora_lote = Column(
        DateTime,
        nullable=False,
        index=True,
        comment="Fecha y hora de inicio o identificación del lote.",
    )
    tipo_analisis = Column(
        String,
        nullable=False,
        index=True,
        comment="Tipo de análisis: 'nitrogeno' o 'cenizas'.",
    )
    descripcion = Column(
        String, nullable=True, comment="Descripción adicional para el lote."
    )

    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    registros_nitrogeno = relationship(
        "RegistroAnalisisNitrogeno",
        back_populates="ciclo_procesamiento_ref",
        cascade="all, delete-orphan",  # Si se borra un CicloProcesamiento, se borran sus registros asociados
    )

    registros_cenizas = relationship(
        "RegistroAnalisisCenizas",
        back_populates="ciclo_procesamiento_ref",
        cascade="all, delete-orphan",
    )
    # TODO: Futuro: registros_cenizas = relationship("RegistroAnalisisCenizas", back_populates="ciclo_procesamiento_ref", cascade="all, delete-orphan")


class RegistroAnalisisNitrogeno(Base):
    __tablename__ = "registros_analisis_nitrogeno"
    __table_args__ = {"comment": "Registros individuales de análisis de nitrógeno."}

    id = Column(Integer, primary_key=True, index=True)

    ciclo_procesamiento_id = Column(
        Integer, ForeignKey("ciclos_procesamiento.id"), nullable=False, index=True
    )

    ciclo_catalogo_id = Column(
        Integer, ForeignKey("catalogo_ciclos.id"), nullable=False, index=True
    )
    etapa_catalogo_id = Column(
        Integer, ForeignKey("catalogo_etapas.id"), nullable=False, index=True
    )
    muestra_catalogo_id = Column(
        Integer, ForeignKey("catalogo_muestras.id"), nullable=False, index=True
    )
    origen_catalogo_id = Column(
        Integer, ForeignKey("catalogo_origenes.id"), nullable=False, index=True
    )

    # Relaciones
    ciclo_procesamiento_ref = relationship(
        "CicloProcesamiento", back_populates="registros_nitrogeno"
    )
    ciclo_catalogo_ref = relationship("Ciclo", back_populates="registros_nitrogeno")
    etapa_catalogo_ref = relationship("Etapa", back_populates="registros_nitrogeno")
    muestra_catalogo_ref = relationship("Muestra", back_populates="registros_nitrogeno")
    origen_catalogo_ref = relationship("Origen", back_populates="registros_nitrogeno")

    # Inputs del Usuario
    peso_muestra_n_g = Column(Float, nullable=True, comment="Peso N [g] (a)")
    n_hcl_normalidad = Column(Float, nullable=True, comment="N HCL (b)")
    vol_hcl_gastado_cm3 = Column(Float, nullable=True, comment="Vol HCL [cm3] (c)")

    # Campos Calculados por el Backend
    calc_nitrogeno_organico_total_porc = Column(
        Float, nullable=True, comment="Calculado: (c*b*1.4)/a"
    )
    calc_humedad_usada_referencia_porc = Column(
        Float,
        nullable=True,
        comment="H% de DatosGeneralesLaboratorio usada para este cálculo.",
    )
    calc_peso_seco_g = Column(
        Float, nullable=True, comment="Calculado: a*(100-H%)/100 (d)"
    )
    calc_nitrogeno_base_seca_porc = Column(
        Float, nullable=True, comment="Calculado: (c*b*1.4)/d"
    )

    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )


# Regitro ANalisis Cenizas


class RegistroAnalisisCenizas(Base):
    __tablename__ = "registros_analisis_cenizas"
    __table_args__ = (
        UniqueConstraint(
            "ciclo_procesamiento_id",
            "ciclo_catalogo_id",
            "etapa_catalogo_id",
            "muestra_catalogo_id",
            "origen_catalogo_id",
            name="_registro_cenizas_lote_catalogo_uc",
        ),
        {
            "comment": "Registros individuales de análisis de cenizas. Únicos por combinación de catálogos dentro de un lote."
        },
    )

    id = Column(Integer, primary_key=True, index=True)

    # Clave foránea al Ciclo de Procesamiento
    ciclo_procesamiento_id = Column(
        Integer, ForeignKey("ciclos_procesamiento.id"), nullable=False, index=True
    )
    ciclo_procesamiento_ref = relationship(
        "CicloProcesamiento", back_populates="registros_cenizas"
    )

    # Claves foráneas a los Catálogos Generales
    ciclo_catalogo_id = Column(
        Integer, ForeignKey("catalogo_ciclos.id"), nullable=False, index=True
    )
    etapa_catalogo_id = Column(
        Integer, ForeignKey("catalogo_etapas.id"), nullable=False, index=True
    )
    muestra_catalogo_id = Column(
        Integer, ForeignKey("catalogo_muestras.id"), nullable=False, index=True
    )
    origen_catalogo_id = Column(
        Integer, ForeignKey("catalogo_origenes.id"), nullable=False, index=True
    )

    # Referencias unidireccionales a los catálogos (para cargar nombres, etc.)
    ciclo_catalogo_ref = relationship("Ciclo")
    etapa_catalogo_ref = relationship("Etapa")
    muestra_catalogo_ref = relationship("Muestra")
    origen_catalogo_ref = relationship("Origen")

    # Ya no hay 'fecha_analisis_cenizas' aquí, se usa la del CicloProcesamiento.

    # Inputs del Usuario para el Análisis de Cenizas
    peso_crisol_vacio_g = Column(
        Float, nullable=True, comment="Peso Crisol vacío [g] (a)"
    )
    peso_crisol_mas_muestra_g = Column(
        Float, nullable=True, comment="Peso crisol + muestra [g] (b)"
    )
    peso_crisol_mas_cenizas_g = Column(
        Float, nullable=True, comment="Peso crisol + cenizas [g] (c)"
    )

    # Campo Calculado (se guarda en esta tabla, calculado por el backend)
    calc_cenizas_porc = Column(
        Float, nullable=True, comment="Calculado: ((c - a) / (b - a)) * 100"
    )

    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )
