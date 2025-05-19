# backend_funglusapp/app/db/models.py
from sqlalchemy import (
    Column,
    Date,
    Float,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from .database import Base


# --- TABLAS DE CATÁLOGO / LOOKUP ---
# (Ciclo, Etapa, Muestra, Origen sin cambios respecto al artifact anterior)
class Ciclo(Base):
    __tablename__ = "catalogo_ciclos"
    id = Column(Integer, primary_key=True, index=True)
    nombre_ciclo = Column(String, unique=True, index=True, nullable=False)
    descripcion = Column(String, nullable=True)
    fecha_inicio = Column(String, nullable=True)

    datos_generales_lab = relationship(
        "DatosGeneralesLaboratorio", back_populates="ciclo_ref"
    )
    datos_nitrogeno = relationship("DatosNitrogeno", back_populates="ciclo_ref")
    datos_cenizas = relationship("DatosCenizas", back_populates="ciclo_ref")


class Etapa(Base):
    __tablename__ = "catalogo_etapas"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True, nullable=False)
    descripcion = Column(String, nullable=True)
    # fase_id = Column(Integer, ForeignKey("catalogo_fases.id"), nullable=True) # Si tuvieras Fases

    # fase_ref = relationship("Fase", back_populates="etapas") # Si tuvieras Fases
    datos_generales_lab = relationship(
        "DatosGeneralesLaboratorio", back_populates="etapa_ref"
    )
    datos_cenizas = relationship("DatosCenizas", back_populates="etapa_ref")
    datos_nitrogeno = relationship("DatosNitrogeno", back_populates="etapa_ref")


class Muestra(Base):
    __tablename__ = "catalogo_muestras"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True, nullable=False)
    descripcion = Column(String, nullable=True)

    datos_generales_lab = relationship(
        "DatosGeneralesLaboratorio", back_populates="muestra_ref"
    )
    datos_cenizas = relationship("DatosCenizas", back_populates="muestra_ref")
    datos_nitrogeno = relationship("DatosNitrogeno", back_populates="muestra_ref")


class Origen(Base):
    __tablename__ = "catalogo_origenes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True, nullable=False)
    descripcion = Column(String, nullable=True)

    datos_generales_lab = relationship(
        "DatosGeneralesLaboratorio", back_populates="origen_ref"
    )
    datos_cenizas = relationship("DatosCenizas", back_populates="origen_ref")
    datos_nitrogeno = relationship("DatosNitrogeno", back_populates="origen_ref")


# --- TABLA DE DATOS PRINCIPAL ---
class DatosGeneralesLaboratorio(Base):
    __tablename__ = "datos_generales_laboratorio"
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

    ciclo_ref = relationship("Ciclo", back_populates="datos_generales_lab")
    etapa_ref = relationship("Etapa", back_populates="datos_generales_lab")
    muestra_ref = relationship("Muestra", back_populates="datos_generales_lab")
    origen_ref = relationship("Origen", back_populates="datos_generales_lab")

    fecha_ingreso = Column(String, nullable=True)
    fecha_procesamiento = Column(String, nullable=True)
    peso_h1_g = Column(Float, nullable=True)
    peso_h2_g = Column(Float, nullable=True)
    humedad_1_porc = Column(Float, nullable=True)  # Este es H1%
    humedad_2_porc = Column(Float, nullable=True)  # Este es H2%
    humedad_prom_porc = Column(Float, nullable=True)  # Este es H% (Promedio H1% y H2%)
    peso_ph_g = Column(Float, nullable=True)
    ph_valor = Column(Float, nullable=True)
    fdr_1_kgf = Column(Float, nullable=True)
    fdr_2_kgf = Column(Float, nullable=True)
    fdr_3_kgf = Column(Float, nullable=True)
    fdr_prom_kgf = Column(Float, nullable=True)
    resultado_cenizas_porc = Column(Float, nullable=True)
    resultado_nitrogeno_total_porc = Column(Float, nullable=True)
    resultado_nitrogeno_seca_porc = Column(Float, nullable=True)

    __table_args__ = (
        UniqueConstraint(
            "ciclo_id",
            "etapa_id",
            "muestra_id",
            "origen_id",
            name="_datos_laboratorio_claves_uc",
        ),
    )


# --- TABLAS ESPECÍFICAS PARA ANÁLISIS DETALLADOS ---
class DatosCenizas(Base):
    __tablename__ = "datos_cenizas"
    # ... (sin cambios respecto al artifact anterior)
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
    fecha_analisis_cenizas = Column(String, nullable=False, index=True)
    peso_crisol_vacio_g = Column(Float, nullable=True)
    peso_crisol_mas_muestra_g = Column(Float, nullable=True)
    peso_crisol_mas_cenizas_g = Column(Float, nullable=True)
    cenizas_porc = Column(Float, nullable=True)
    ciclo_ref = relationship("Ciclo", back_populates="datos_cenizas")
    etapa_ref = relationship("Etapa", back_populates="datos_cenizas")
    muestra_ref = relationship("Muestra", back_populates="datos_cenizas")
    origen_ref = relationship("Origen", back_populates="datos_cenizas")
    __table_args__ = (
        UniqueConstraint(
            "ciclo_id",
            "etapa_id",
            "muestra_id",
            "origen_id",
            "fecha_analisis_cenizas",
            name="_analisis_cenizas_claves_uc",
        ),
    )


class DatosNitrogeno(Base):
    __tablename__ = "datos_nitrogeno"
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
    fecha_analisis_nitrogeno = Column(String, nullable=False, index=True)
    numero_repeticion = Column(Integer, nullable=False, default=1, index=True)

    peso_muestra_n_g = Column(Float, nullable=True)  # a
    n_hcl_normalidad = Column(Float, nullable=True)  # b
    vol_hcl_gastado_cm3 = Column(Float, nullable=True)  # c

    # ELIMINADO: humedad_muestra_analisis_n_porc

    peso_seco_g = Column(
        Float, nullable=True
    )  # d = a*(100-H%)/100 <--- NUEVO CAMPO (CALCULADO)

    nitrogeno_organico_total_porc = Column(
        Float, nullable=True
    )  # Calculado: (c * b * 1.4) / a
    nitrogeno_base_seca_porc = Column(
        Float, nullable=True
    )  # Calculado: (c * b * 1.4) / d

    ciclo_ref = relationship("Ciclo", back_populates="datos_nitrogeno")
    etapa_ref = relationship("Etapa", back_populates="datos_nitrogeno")
    muestra_ref = relationship("Muestra", back_populates="datos_nitrogeno")
    origen_ref = relationship("Origen", back_populates="datos_nitrogeno")

    __table_args__ = (
        UniqueConstraint(
            "ciclo_id",
            "etapa_id",
            "muestra_id",
            "origen_id",
            "fecha_analisis_nitrogeno",
            "numero_repeticion",
            name="_analisis_nitrogeno_rep_claves_uc",
        ),
    )
