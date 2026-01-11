--
-- PostgreSQL database dump
--

\restrict jWQvkWk182hzSivYYjWB0Fq4eeiOHIBMz6rKUKLRdjIdnM4P7HkcScZ0WCrSxiC

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: catalogo_ciclos; Type: TABLE; Schema: public; Owner: funglusapp
--

CREATE TABLE public.catalogo_ciclos (
    id integer NOT NULL,
    nombre_ciclo character varying NOT NULL,
    descripcion character varying,
    fecha_inicio character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.catalogo_ciclos OWNER TO funglusapp;

--
-- Name: catalogo_ciclos_id_seq; Type: SEQUENCE; Schema: public; Owner: funglusapp
--

CREATE SEQUENCE public.catalogo_ciclos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.catalogo_ciclos_id_seq OWNER TO funglusapp;

--
-- Name: catalogo_ciclos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: funglusapp
--

ALTER SEQUENCE public.catalogo_ciclos_id_seq OWNED BY public.catalogo_ciclos.id;


--
-- Name: catalogo_etapas; Type: TABLE; Schema: public; Owner: funglusapp
--

CREATE TABLE public.catalogo_etapas (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    descripcion character varying
);


ALTER TABLE public.catalogo_etapas OWNER TO funglusapp;

--
-- Name: catalogo_etapas_id_seq; Type: SEQUENCE; Schema: public; Owner: funglusapp
--

CREATE SEQUENCE public.catalogo_etapas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.catalogo_etapas_id_seq OWNER TO funglusapp;

--
-- Name: catalogo_etapas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: funglusapp
--

ALTER SEQUENCE public.catalogo_etapas_id_seq OWNED BY public.catalogo_etapas.id;


--
-- Name: catalogo_muestras; Type: TABLE; Schema: public; Owner: funglusapp
--

CREATE TABLE public.catalogo_muestras (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    descripcion character varying
);


ALTER TABLE public.catalogo_muestras OWNER TO funglusapp;

--
-- Name: catalogo_muestras_id_seq; Type: SEQUENCE; Schema: public; Owner: funglusapp
--

CREATE SEQUENCE public.catalogo_muestras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.catalogo_muestras_id_seq OWNER TO funglusapp;

--
-- Name: catalogo_muestras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: funglusapp
--

ALTER SEQUENCE public.catalogo_muestras_id_seq OWNED BY public.catalogo_muestras.id;


--
-- Name: catalogo_origenes; Type: TABLE; Schema: public; Owner: funglusapp
--

CREATE TABLE public.catalogo_origenes (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    descripcion character varying
);


ALTER TABLE public.catalogo_origenes OWNER TO funglusapp;

--
-- Name: catalogo_origenes_id_seq; Type: SEQUENCE; Schema: public; Owner: funglusapp
--

CREATE SEQUENCE public.catalogo_origenes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.catalogo_origenes_id_seq OWNER TO funglusapp;

--
-- Name: catalogo_origenes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: funglusapp
--

ALTER SEQUENCE public.catalogo_origenes_id_seq OWNED BY public.catalogo_origenes.id;


--
-- Name: catalogo_secuencias; Type: TABLE; Schema: public; Owner: funglusapp
--

CREATE TABLE public.catalogo_secuencias (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    descripcion character varying
);


ALTER TABLE public.catalogo_secuencias OWNER TO funglusapp;

--
-- Name: catalogo_secuencias_id_seq; Type: SEQUENCE; Schema: public; Owner: funglusapp
--

CREATE SEQUENCE public.catalogo_secuencias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.catalogo_secuencias_id_seq OWNER TO funglusapp;

--
-- Name: catalogo_secuencias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: funglusapp
--

ALTER SEQUENCE public.catalogo_secuencias_id_seq OWNED BY public.catalogo_secuencias.id;


--
-- Name: ciclos_procesamiento; Type: TABLE; Schema: public; Owner: funglusapp
--

CREATE TABLE public.ciclos_procesamiento (
    id integer NOT NULL,
    identificador_lote character varying NOT NULL,
    fecha_hora_lote timestamp without time zone NOT NULL,
    tipo_analisis character varying NOT NULL,
    descripcion character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ciclos_procesamiento OWNER TO funglusapp;

--
-- Name: TABLE ciclos_procesamiento; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON TABLE public.ciclos_procesamiento IS 'Agrupa análisis (Nitrógeno, Cenizas) bajo un lote o sesión de procesamiento específico.';


--
-- Name: COLUMN ciclos_procesamiento.identificador_lote; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.ciclos_procesamiento.identificador_lote IS 'Nombre o código del lote de procesamiento, ingresado por el usuario.';


--
-- Name: COLUMN ciclos_procesamiento.fecha_hora_lote; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.ciclos_procesamiento.fecha_hora_lote IS 'Fecha y hora de inicio o identificación del lote.';


--
-- Name: COLUMN ciclos_procesamiento.tipo_analisis; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.ciclos_procesamiento.tipo_analisis IS 'Tipo de análisis: ''nitrogeno'' o ''cenizas''.';


--
-- Name: COLUMN ciclos_procesamiento.descripcion; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.ciclos_procesamiento.descripcion IS 'Descripción adicional para el lote.';


--
-- Name: ciclos_procesamiento_id_seq; Type: SEQUENCE; Schema: public; Owner: funglusapp
--

CREATE SEQUENCE public.ciclos_procesamiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ciclos_procesamiento_id_seq OWNER TO funglusapp;

--
-- Name: ciclos_procesamiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: funglusapp
--

ALTER SEQUENCE public.ciclos_procesamiento_id_seq OWNED BY public.ciclos_procesamiento.id;


--
-- Name: datos_generales_laboratorio; Type: TABLE; Schema: public; Owner: funglusapp
--

CREATE TABLE public.datos_generales_laboratorio (
    id integer NOT NULL,
    ciclo_id integer NOT NULL,
    etapa_id integer NOT NULL,
    muestra_id integer NOT NULL,
    origen_id integer NOT NULL,
    secuencia_id integer NOT NULL,
    fecha_ingreso character varying,
    fecha_procesamiento character varying,
    peso_h1_g double precision,
    peso_h2_g double precision,
    humedad_1_porc double precision,
    humedad_2_porc double precision,
    humedad_prom_porc double precision,
    peso_ph_g double precision,
    ph_valor double precision,
    fdr_1_kgf double precision,
    fdr_2_kgf double precision,
    fdr_3_kgf double precision,
    fdr_prom_kgf double precision,
    resultado_cenizas_porc double precision,
    resultado_nitrogeno_total_porc double precision,
    resultado_nitrogeno_seca_porc double precision,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.datos_generales_laboratorio OWNER TO funglusapp;

--
-- Name: TABLE datos_generales_laboratorio; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON TABLE public.datos_generales_laboratorio IS 'Tabla central para metadatos y resultados consolidados por combinación de catálogos.';


--
-- Name: COLUMN datos_generales_laboratorio.humedad_1_porc; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.datos_generales_laboratorio.humedad_1_porc IS 'Humedad 1 (%)';


--
-- Name: COLUMN datos_generales_laboratorio.humedad_2_porc; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.datos_generales_laboratorio.humedad_2_porc IS 'Humedad 2 (%)';


--
-- Name: COLUMN datos_generales_laboratorio.humedad_prom_porc; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.datos_generales_laboratorio.humedad_prom_porc IS 'Humedad Promedio (calculada)';


--
-- Name: COLUMN datos_generales_laboratorio.fdr_prom_kgf; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.datos_generales_laboratorio.fdr_prom_kgf IS 'FDR Promedio (calculada)';


--
-- Name: datos_generales_laboratorio_id_seq; Type: SEQUENCE; Schema: public; Owner: funglusapp
--

CREATE SEQUENCE public.datos_generales_laboratorio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.datos_generales_laboratorio_id_seq OWNER TO funglusapp;

--
-- Name: datos_generales_laboratorio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: funglusapp
--

ALTER SEQUENCE public.datos_generales_laboratorio_id_seq OWNED BY public.datos_generales_laboratorio.id;


--
-- Name: notas_informe; Type: TABLE; Schema: public; Owner: funglusapp
--

CREATE TABLE public.notas_informe (
    id integer NOT NULL,
    ciclo_id integer NOT NULL,
    etapa_id integer NOT NULL,
    muestra_id integer NOT NULL,
    origen_id integer NOT NULL,
    secuencia_id integer,
    nota character varying NOT NULL,
    usuario_email character varying NOT NULL,
    usuario_nombre character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notas_informe OWNER TO funglusapp;

--
-- Name: TABLE notas_informe; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON TABLE public.notas_informe IS 'Notas y comentarios de usuarios sobre registros específicos del informe';


--
-- Name: notas_informe_id_seq; Type: SEQUENCE; Schema: public; Owner: funglusapp
--

CREATE SEQUENCE public.notas_informe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notas_informe_id_seq OWNER TO funglusapp;

--
-- Name: notas_informe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: funglusapp
--

ALTER SEQUENCE public.notas_informe_id_seq OWNED BY public.notas_informe.id;


--
-- Name: registros_analisis_cenizas; Type: TABLE; Schema: public; Owner: funglusapp
--

CREATE TABLE public.registros_analisis_cenizas (
    id integer NOT NULL,
    ciclo_procesamiento_id integer NOT NULL,
    ciclo_catalogo_id integer NOT NULL,
    etapa_catalogo_id integer NOT NULL,
    muestra_catalogo_id integer NOT NULL,
    origen_catalogo_id integer NOT NULL,
    secuencia_catalogo_id integer NOT NULL,
    peso_crisol_vacio_g double precision,
    peso_crisol_mas_muestra_g double precision,
    peso_crisol_mas_cenizas_g double precision,
    calc_cenizas_porc double precision,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.registros_analisis_cenizas OWNER TO funglusapp;

--
-- Name: TABLE registros_analisis_cenizas; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON TABLE public.registros_analisis_cenizas IS 'Registros individuales de análisis de cenizas. Únicos por combinación de catálogos dentro de un lote.';


--
-- Name: COLUMN registros_analisis_cenizas.peso_crisol_vacio_g; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.registros_analisis_cenizas.peso_crisol_vacio_g IS 'Peso Crisol vacío [g] (a)';


--
-- Name: COLUMN registros_analisis_cenizas.peso_crisol_mas_muestra_g; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.registros_analisis_cenizas.peso_crisol_mas_muestra_g IS 'Peso crisol + muestra [g] (b)';


--
-- Name: COLUMN registros_analisis_cenizas.peso_crisol_mas_cenizas_g; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.registros_analisis_cenizas.peso_crisol_mas_cenizas_g IS 'Peso crisol + cenizas [g] (c)';


--
-- Name: COLUMN registros_analisis_cenizas.calc_cenizas_porc; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.registros_analisis_cenizas.calc_cenizas_porc IS 'Calculado: ((c - a) / (b - a)) * 100';


--
-- Name: registros_analisis_cenizas_id_seq; Type: SEQUENCE; Schema: public; Owner: funglusapp
--

CREATE SEQUENCE public.registros_analisis_cenizas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.registros_analisis_cenizas_id_seq OWNER TO funglusapp;

--
-- Name: registros_analisis_cenizas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: funglusapp
--

ALTER SEQUENCE public.registros_analisis_cenizas_id_seq OWNED BY public.registros_analisis_cenizas.id;


--
-- Name: registros_analisis_nitrogeno; Type: TABLE; Schema: public; Owner: funglusapp
--

CREATE TABLE public.registros_analisis_nitrogeno (
    id integer NOT NULL,
    ciclo_procesamiento_id integer NOT NULL,
    ciclo_catalogo_id integer NOT NULL,
    etapa_catalogo_id integer NOT NULL,
    muestra_catalogo_id integer NOT NULL,
    origen_catalogo_id integer NOT NULL,
    secuencia_catalogo_id integer NOT NULL,
    peso_muestra_n_g double precision,
    n_hcl_normalidad double precision,
    vol_hcl_gastado_cm3 double precision,
    calc_nitrogeno_organico_total_porc double precision,
    calc_humedad_usada_referencia_porc double precision,
    calc_peso_seco_g double precision,
    calc_nitrogeno_base_seca_porc double precision,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.registros_analisis_nitrogeno OWNER TO funglusapp;

--
-- Name: TABLE registros_analisis_nitrogeno; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON TABLE public.registros_analisis_nitrogeno IS 'Registros individuales de análisis de nitrógeno.';


--
-- Name: COLUMN registros_analisis_nitrogeno.peso_muestra_n_g; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.registros_analisis_nitrogeno.peso_muestra_n_g IS 'Peso N [g] (a)';


--
-- Name: COLUMN registros_analisis_nitrogeno.n_hcl_normalidad; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.registros_analisis_nitrogeno.n_hcl_normalidad IS 'N HCL (b)';


--
-- Name: COLUMN registros_analisis_nitrogeno.vol_hcl_gastado_cm3; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.registros_analisis_nitrogeno.vol_hcl_gastado_cm3 IS 'Vol HCL [cm3] (c)';


--
-- Name: COLUMN registros_analisis_nitrogeno.calc_nitrogeno_organico_total_porc; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.registros_analisis_nitrogeno.calc_nitrogeno_organico_total_porc IS 'Calculado: (c*b*1.4)/a';


--
-- Name: COLUMN registros_analisis_nitrogeno.calc_humedad_usada_referencia_porc; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.registros_analisis_nitrogeno.calc_humedad_usada_referencia_porc IS 'H% de DatosGeneralesLaboratorio usada para este cálculo.';


--
-- Name: COLUMN registros_analisis_nitrogeno.calc_peso_seco_g; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.registros_analisis_nitrogeno.calc_peso_seco_g IS 'Calculado: a*(100-H%)/100 (d)';


--
-- Name: COLUMN registros_analisis_nitrogeno.calc_nitrogeno_base_seca_porc; Type: COMMENT; Schema: public; Owner: funglusapp
--

COMMENT ON COLUMN public.registros_analisis_nitrogeno.calc_nitrogeno_base_seca_porc IS 'Calculado: (c*b*1.4)/d';


--
-- Name: registros_analisis_nitrogeno_id_seq; Type: SEQUENCE; Schema: public; Owner: funglusapp
--

CREATE SEQUENCE public.registros_analisis_nitrogeno_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.registros_analisis_nitrogeno_id_seq OWNER TO funglusapp;

--
-- Name: registros_analisis_nitrogeno_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: funglusapp
--

ALTER SEQUENCE public.registros_analisis_nitrogeno_id_seq OWNED BY public.registros_analisis_nitrogeno.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: funglusapp
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    hashed_password character varying NOT NULL,
    full_name character varying,
    role character varying,
    is_active boolean,
    created_at timestamp without time zone DEFAULT now(),
    allowed_modules jsonb DEFAULT '["laboratorio"]'::jsonb
);


ALTER TABLE public.users OWNER TO funglusapp;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: funglusapp
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO funglusapp;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: funglusapp
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: catalogo_ciclos id; Type: DEFAULT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.catalogo_ciclos ALTER COLUMN id SET DEFAULT nextval('public.catalogo_ciclos_id_seq'::regclass);


--
-- Name: catalogo_etapas id; Type: DEFAULT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.catalogo_etapas ALTER COLUMN id SET DEFAULT nextval('public.catalogo_etapas_id_seq'::regclass);


--
-- Name: catalogo_muestras id; Type: DEFAULT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.catalogo_muestras ALTER COLUMN id SET DEFAULT nextval('public.catalogo_muestras_id_seq'::regclass);


--
-- Name: catalogo_origenes id; Type: DEFAULT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.catalogo_origenes ALTER COLUMN id SET DEFAULT nextval('public.catalogo_origenes_id_seq'::regclass);


--
-- Name: catalogo_secuencias id; Type: DEFAULT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.catalogo_secuencias ALTER COLUMN id SET DEFAULT nextval('public.catalogo_secuencias_id_seq'::regclass);


--
-- Name: ciclos_procesamiento id; Type: DEFAULT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.ciclos_procesamiento ALTER COLUMN id SET DEFAULT nextval('public.ciclos_procesamiento_id_seq'::regclass);


--
-- Name: datos_generales_laboratorio id; Type: DEFAULT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.datos_generales_laboratorio ALTER COLUMN id SET DEFAULT nextval('public.datos_generales_laboratorio_id_seq'::regclass);


--
-- Name: notas_informe id; Type: DEFAULT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.notas_informe ALTER COLUMN id SET DEFAULT nextval('public.notas_informe_id_seq'::regclass);


--
-- Name: registros_analisis_cenizas id; Type: DEFAULT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_cenizas ALTER COLUMN id SET DEFAULT nextval('public.registros_analisis_cenizas_id_seq'::regclass);


--
-- Name: registros_analisis_nitrogeno id; Type: DEFAULT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_nitrogeno ALTER COLUMN id SET DEFAULT nextval('public.registros_analisis_nitrogeno_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: catalogo_ciclos; Type: TABLE DATA; Schema: public; Owner: funglusapp
--

COPY public.catalogo_ciclos (id, nombre_ciclo, descripcion, fecha_inicio, created_at, updated_at) FROM stdin;
146	1274	\N	2024-08-12	2024-08-12 00:00:00	2024-08-12 00:00:00
147	1275	\N	2024-08-19	2024-08-19 00:00:00	2024-08-19 00:00:00
148	1276	\N	2024-08-26	2024-08-26 00:00:00	2024-08-26 00:00:00
149	1277	\N	2024-09-02	2024-09-02 00:00:00	2024-09-02 00:00:00
150	1278	\N	2024-09-09	2024-09-09 00:00:00	2024-09-09 00:00:00
151	1279	\N	2024-09-16	2024-09-16 00:00:00	2024-09-16 00:00:00
152	1280	\N	2024-09-23	2024-09-23 00:00:00	2024-09-23 00:00:00
153	1281	\N	2024-09-30	2024-09-30 00:00:00	2024-09-30 00:00:00
154	1282	\N	2024-10-07	2024-10-07 00:00:00	2024-10-07 00:00:00
155	1283	\N	2024-10-14	2024-10-14 00:00:00	2024-10-14 00:00:00
156	1284	\N	2024-10-21	2024-10-21 00:00:00	2024-10-21 00:00:00
157	1285	\N	2024-10-28	2024-10-28 00:00:00	2024-10-28 00:00:00
158	1286	\N	2024-11-04	2024-11-04 00:00:00	2024-11-04 00:00:00
159	1287	\N	2024-11-11	2024-11-11 00:00:00	2024-11-11 00:00:00
160	1288	\N	2024-11-18	2024-11-18 00:00:00	2024-11-18 00:00:00
161	1289	\N	2024-11-25	2024-11-25 00:00:00	2024-11-25 00:00:00
162	1290	\N	2024-12-02	2024-12-02 00:00:00	2024-12-02 00:00:00
163	1291	\N	2024-12-09	2024-12-09 00:00:00	2024-12-09 00:00:00
164	1292	\N	2024-12-16	2024-12-16 00:00:00	2024-12-16 00:00:00
165	1293	\N	2024-12-23	2024-12-23 00:00:00	2024-12-23 00:00:00
166	1294	\N	2024-12-30	2024-12-30 00:00:00	2024-12-30 00:00:00
167	1295	\N	2025-01-06	2025-01-06 00:00:00	2025-01-06 00:00:00
168	1296	\N	2025-01-13	2025-01-13 00:00:00	2025-01-13 00:00:00
169	1297	\N	2025-01-20	2025-01-20 00:00:00	2025-01-20 00:00:00
170	1298	\N	2025-01-27	2025-01-27 00:00:00	2025-01-27 00:00:00
171	1299	\N	2025-02-03	2025-02-03 00:00:00	2025-02-03 00:00:00
172	1300	\N	2025-02-10	2025-02-10 00:00:00	2025-02-10 00:00:00
173	1301	\N	2025-02-17	2025-02-17 00:00:00	2025-02-17 00:00:00
174	1302	\N	2025-02-24	2025-02-24 00:00:00	2025-02-24 00:00:00
175	1303	\N	2025-03-03	2025-03-03 00:00:00	2025-03-03 00:00:00
176	1304	\N	2025-03-10	2025-03-10 00:00:00	2025-03-10 00:00:00
177	1305	\N	2025-03-17	2025-03-17 00:00:00	2025-03-17 00:00:00
178	1306	\N	2025-03-24	2025-03-24 00:00:00	2025-03-24 00:00:00
179	1307	\N	2025-03-31	2025-03-31 00:00:00	2025-03-31 00:00:00
180	1308	\N	2025-04-07	2025-04-07 00:00:00	2025-04-07 00:00:00
181	1309	\N	2025-04-14	2025-04-14 00:00:00	2025-04-14 00:00:00
182	1310	\N	2025-04-21	2025-04-21 00:00:00	2025-04-21 00:00:00
183	1311	\N	2025-04-28	2025-04-28 00:00:00	2025-04-28 00:00:00
184	1312	\N	2025-05-05	2025-05-05 00:00:00	2025-05-05 00:00:00
185	1313	\N	2025-05-12	2025-05-12 00:00:00	2025-05-12 00:00:00
186	1314	\N	2025-05-19	2025-05-19 00:00:00	2025-05-19 00:00:00
187	1315	\N	2025-05-26	2025-05-26 00:00:00	2025-05-26 00:00:00
188	1316	\N	2025-06-02	2025-06-02 00:00:00	2025-06-02 00:00:00
189	1317	\N	2025-06-09	2025-06-09 00:00:00	2025-06-09 00:00:00
190	1318	\N	2025-06-16	2025-06-16 00:00:00	2025-06-16 00:00:00
191	1319	\N	2025-06-23	2025-06-23 00:00:00	2025-06-23 00:00:00
192	1320	\N	2025-06-30	2025-06-30 00:00:00	2025-06-30 00:00:00
193	1321	\N	2025-07-07	2025-07-07 00:00:00	2025-07-07 00:00:00
194	1322	\N	2025-07-14	2025-07-14 00:00:00	2025-07-14 00:00:00
195	1323	\N	2025-07-21	2025-07-21 00:00:00	2025-07-21 00:00:00
196	1324	\N	2025-07-28	2025-07-28 00:00:00	2025-07-28 00:00:00
197	1325	\N	2025-08-04	2025-08-04 00:00:00	2025-08-04 00:00:00
198	1326	\N	2025-08-11	2025-08-11 00:00:00	2025-08-11 00:00:00
199	1327	\N	2025-08-18	2025-08-18 00:00:00	2025-08-18 00:00:00
200	1328	\N	2025-08-25	2025-08-25 00:00:00	2025-08-25 00:00:00
201	1329	\N	2025-09-01	2025-09-01 00:00:00	2025-09-01 00:00:00
204	TEST		\N	2026-01-11 00:03:14.592978	2026-01-11 00:04:53.855629
\.


--
-- Data for Name: catalogo_etapas; Type: TABLE DATA; Schema: public; Owner: funglusapp
--

COPY public.catalogo_etapas (id, nombre, descripcion) FROM stdin;
1	Proceso	\N
2	Materia_prima	\N
3	No_Ap	\N
\.


--
-- Data for Name: catalogo_muestras; Type: TABLE DATA; Schema: public; Owner: funglusapp
--

COPY public.catalogo_muestras (id, nombre, descripcion) FROM stdin;
1	Bagazo	\N
2	Tamo_seco	\N
4	Gallinaza	\N
5	Cascarilla	\N
6	Tamo_humedo	\N
7	GUBYS	\N
8	Armada	\N
9	Volteo_1	\N
10	Volteo_2	\N
11	Recuperacion	\N
12	Cargue	\N
13	Siembra	\N
14	GUYS	\N
\.


--
-- Data for Name: catalogo_origenes; Type: TABLE DATA; Schema: public; Owner: funglusapp
--

COPY public.catalogo_origenes (id, nombre, descripcion) FROM stdin;
1	Tras_agua	\N
2	Muestreo	\N
3	Camión	\N
4	No_Ap	\N
5	Entrada	\N
6	Salida	\N
7	Bodega	\N
8	promedio	\N
9	Yali	\N
10	Volteo	\N
11	Carmelita	\N
12	Premezcla	\N
13	San_carlos	\N
14	TMO	\N
15	Alma_cafe	\N
\.


--
-- Data for Name: catalogo_secuencias; Type: TABLE DATA; Schema: public; Owner: funglusapp
--

COPY public.catalogo_secuencias (id, nombre, descripcion) FROM stdin;
1	1	\N
2	2	\N
3	3	\N
4	4	\N
5	5	\N
6	6	\N
7	7	\N
8	8	\N
9	9	\N
10	10	\N
11	No_Ap	\N
\.


--
-- Data for Name: ciclos_procesamiento; Type: TABLE DATA; Schema: public; Owner: funglusapp
--

COPY public.ciclos_procesamiento (id, identificador_lote, fecha_hora_lote, tipo_analisis, descripcion, created_at, updated_at) FROM stdin;
1	1	2025-08-03 00:00:00	nitrogeno	\N	2025-08-03 19:10:00	2025-08-03 19:10:00
2	1	2025-08-03 00:00:00	cenizas	\N	2025-08-03 19:10:00	2025-08-03 19:10:00
9	TEST	2026-01-11 00:04:00	nitrogeno	\N	2026-01-11 00:04:36.916279	2026-01-11 00:04:36.916279
10	TEST	2026-01-11 00:04:00	cenizas	\N	2026-01-11 00:04:46.452669	2026-01-11 00:04:46.452669
\.


--
-- Data for Name: datos_generales_laboratorio; Type: TABLE DATA; Schema: public; Owner: funglusapp
--

COPY public.datos_generales_laboratorio (id, ciclo_id, etapa_id, muestra_id, origen_id, secuencia_id, fecha_ingreso, fecha_procesamiento, peso_h1_g, peso_h2_g, humedad_1_porc, humedad_2_porc, humedad_prom_porc, peso_ph_g, ph_valor, fdr_1_kgf, fdr_2_kgf, fdr_3_kgf, fdr_prom_kgf, resultado_cenizas_porc, resultado_nitrogeno_total_porc, resultado_nitrogeno_seca_porc, created_at, updated_at) FROM stdin;
2	171	2	2	3	3	2025-02-03	2025-02-03	1.535	1.365	0.08800000000000001	0.0795	0.08380000000000001	\N	\N	7.57	0.78	11.24	6.53	\N	\N	\N	2025-02-03 00:00:00	2025-02-03 00:00:00
3	171	2	2	3	2	2025-02-03	2025-02-03	1.31	1.369	0.085	0.08470000000000001	0.0849	\N	\N	9.1	8.15	1.64	6.3	\N	\N	\N	2025-02-03 00:00:00	2025-02-03 00:00:00
1349	172	2	5	14	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.005	0.005	2025-12-26 19:49:28.678081	2025-12-26 19:49:28.692125
16	194	2	5	3	1	2025-07-14	2025-07-14	3.193	3.28	0.0973	0.0944	0.0959	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-14 00:00:00	2025-07-14 00:00:00
20	182	2	5	15	1	2025-04-24	2025-04-24	3.047	3.012	0.0977	0.09720000000000001	0.0975	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-24 00:00:00	2025-04-24 00:00:00
25	172	2	5	3	1	2025-02-14	2025-02-14	1.302	1.373	0.1013	0.09949999999999999	0.10039999999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-14 00:00:00	2025-02-14 00:00:00
28	188	2	5	15	1	2025-06-04	2025-06-04	3.003	3.278	0.102	0.1018	0.10189999999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-04 00:00:00	2025-06-04 00:00:00
34	190	2	5	7	1	2025-06-17	2025-06-17	3.326	3.424	0.1033	0.1057	0.1045	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-17 00:00:00	2025-06-17 00:00:00
37	174	2	5	7	1	2025-02-25	2025-02-25	3.303	3.175	0.1054	0.1065	0.106	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-25 00:00:00	2025-02-25 00:00:00
38	200	2	5	7	1	2025-08-28	2025-08-28	3.168	4.017	0.1067	0.1065	0.1066	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-28 00:00:00	2025-08-28 00:00:00
39	171	2	5	3	1	2025-02-08	2025-02-08	3.009	3.399	0.1079	0.10800000000000001	0.10800000000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-08 00:00:00	2025-02-08 00:00:00
40	171	2	5	7	1	2025-02-04	2025-02-04	3.287	3.95	0.1094	0.1067	0.1081	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-04 00:00:00	2025-02-04 00:00:00
43	174	2	2	7	1	2025-02-26	2025-02-26	1.56	1.45	0.1112	0.10769999999999999	0.10949999999999999	\N	\N	1.43	0.31	2.72	1.49	\N	\N	\N	2025-02-26 00:00:00	2025-02-26 00:00:00
44	171	2	2	3	1	2025-02-03	2025-02-03	1.382	1.267	0.10779999999999999	0.1117	0.10980000000000001	\N	\N	13.18	2.32	1.56	5.69	\N	\N	\N	2025-02-03 00:00:00	2025-02-03 00:00:00
46	172	2	5	7	1	2025-02-12	2025-02-12	3.153	3.024	0.11109999999999999	0.1096	0.1104	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-12 00:00:00	2025-02-12 00:00:00
1029	171	1	6	10	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.18579	\N	\N	2025-12-26 19:42:37.521724	2025-12-26 19:42:37.523836
32	181	2	5	7	1	2025-04-14	2025-04-14	3.234	3.263	0.10339999999999999	0.10279999999999999	0.103	\N	\N	\N	\N	\N	\N	0.18386	\N	\N	2025-04-14 00:00:00	2025-12-26 19:42:38.121682
26	183	2	5	7	1	2025-04-29	2025-04-29	3.428	3.129	0.1018	0.0999	0.101	\N	\N	\N	\N	\N	\N	0.01142	\N	\N	2025-04-29 00:00:00	2025-12-26 19:42:38.255985
23	183	2	5	3	1	2025-04-30	2025-04-30	3.456	3.138	0.09960000000000001	0.1003	0.1	\N	\N	\N	\N	\N	\N	0.15529	\N	\N	2025-04-30 00:00:00	2025-12-26 19:42:38.257805
47	188	2	2	3	2	2025-06-03	2025-06-03	1.507	1.673	0.1116	0.1115	0.112	\N	\N	1.61	1.23	0.65	1.163	0.18111	\N	\N	2025-06-03 00:00:00	2025-12-26 19:42:38.700637
33	189	2	5	7	1	2025-06-10	2025-06-10	3.448	3.539	0.1015	0.10710000000000001	0.104	\N	\N	\N	\N	\N	\N	0.00856	\N	\N	2025-06-10 00:00:00	2025-12-26 19:42:38.727393
30	189	2	5	3	1	2025-06-11	2025-06-11	3.572	3.199	0.10289999999999999	0.102	0.102	\N	\N	\N	\N	\N	\N	0.15439999999999998	\N	\N	2025-06-11 00:00:00	2025-12-26 19:42:38.729233
21	191	2	5	3	1	2025-06-26	2025-06-26	3.253	3.252	0.09910000000000001	0.0981	0.099	\N	\N	\N	\N	\N	\N	0.10867000000000002	\N	\N	2025-06-26 00:00:00	2025-12-26 19:42:38.883898
42	192	2	5	3	1	2025-07-02	2025-07-03	3.38	3.356	0.10949999999999999	0.10890000000000001	0.109	\N	\N	\N	\N	\N	\N	0.09337	\N	\N	2025-07-02 00:00:00	2025-12-26 19:42:38.950993
19	192	2	2	7	1	2025-07-02	2025-07-02	1.592	1.569	0.1001	0.0947	0.097	\N	\N	2.22	0.52	1.14	1.293	0.25366	\N	\N	2025-07-02 00:00:00	2025-12-26 19:42:38.99686
13	192	2	2	3	1	2025-06-28	2025-07-01	1.635	1.534	0.0928	0.0959	0.094	\N	\N	1.97	0.77	8.63	3.79	0.18278	\N	\N	2025-06-28 00:00:00	2025-12-26 19:42:38.998641
17	192	2	2	3	2	2025-06-28	2025-07-01	1.413	1.587	0.1011	0.0919	0.097	\N	\N	1.35	1.64	1.68	1.557	0.15134999999999998	\N	\N	2025-06-28 00:00:00	2025-12-26 19:42:39.000387
31	193	2	5	7	1	2025-07-09	2025-07-10	3.505	3.224	0.1009	0.1043	0.103	\N	\N	\N	\N	\N	\N	0.10615000000000002	\N	\N	2025-07-09 00:00:00	2025-12-26 19:42:39.032292
9	193	2	2	7	1	2025-07-10	2025-07-10	1.369	1.511	0.0889	0.0955	0.092	\N	\N	3.22	5.42	0.56	3.067	0.17588	\N	\N	2025-07-10 00:00:00	2025-12-26 19:42:39.061052
1	194	2	2	7	1	2025-07-17	2025-07-17	1.765	1.6	0.0784	0.0833	0.081	\N	\N	5.36	4.88	1.16	3.8	0.17515	\N	\N	2025-07-17 00:00:00	2025-12-26 19:42:39.110118
11	194	2	2	3	2	2025-07-12	2025-07-14	1.56	1.481	0.0926	0.0935	0.093	\N	\N	4.7	1.22	2.38	2.767	0.14077	\N	\N	2025-07-12 00:00:00	2025-12-26 19:42:39.113762
5	195	2	2	7	1	2025-07-23	2025-07-24	1.636	1.545	0.07980000000000001	0.0941	0.087	\N	\N	1.55	4.81	2.76	3.04	0.18335	\N	\N	2025-07-23 00:00:00	2025-12-26 19:42:39.158815
45	195	2	2	3	1	2025-07-18	2025-07-21	1.668	1.765	0.11349999999999999	0.10679999999999999	0.11	\N	\N	12.03	5	3.03	6.687	0.19257000000000002	\N	\N	2025-07-18 00:00:00	2025-12-26 19:42:39.160597
6	195	2	2	3	2	2025-07-18	2025-07-21	1.856	1.414	0.0875	0.0868	0.087	\N	\N	2.48	2.72	4.01	3.07	0.017390000000000003	\N	\N	2025-07-18 00:00:00	2025-12-26 19:42:39.16253
10	196	2	2	3	1	2025-07-28	2025-07-28	1.622	1.423	0.0935	0.0924	0.093	\N	\N	5.38	1.24	3.16	3.26	0.17768	\N	\N	2025-07-28 00:00:00	2025-12-26 19:42:39.190572
14	196	2	2	3	2	2025-07-28	2025-07-28	1.18	1.51	0.092	0.0971	0.095	\N	\N	7.59	1.8	1.24	3.543	0.16773	\N	\N	2025-07-28 00:00:00	2025-12-26 19:42:39.192661
7	196	2	2	3	3	2025-07-28	2025-07-28	1.683	1.877	0.09140000000000001	0.0895	0.09	\N	\N	5.24	4.84	6.18	5.42	0.22932999999999998	\N	\N	2025-07-28 00:00:00	2025-12-26 19:42:39.194748
18	196	2	5	3	1	2025-08-01	2025-08-01	3.334	3.225	0.09720000000000001	0.0974	0.097	\N	\N	\N	\N	\N	\N	0.17352	\N	\N	2025-08-01 00:00:00	2025-12-26 19:42:39.286387
4	197	2	2	3	1	2025-08-04	2025-08-04	1.469	1.318	0.0859	0.0852	0.086	\N	\N	0.48	0.89	0.78	0.717	0.14302	\N	\N	2025-08-04 00:00:00	2025-12-26 19:42:39.29369
27	197	2	2	3	3	2025-08-04	2025-08-04	1.461	1.548	0.10369999999999999	0.1	0.102	\N	\N	1.63	2.12	12.92	5.557	0.15802	\N	\N	2025-08-04 00:00:00	2025-12-26 19:42:39.295573
29	197	2	2	3	2	2025-08-04	2025-08-04	1.464	1.506	0.1018	0.1024	0.102	\N	\N	3.54	1.54	1.03	2.037	0.24462	\N	\N	2025-08-04 00:00:00	2025-12-26 19:42:39.327358
36	198	2	2	7	1	2025-08-13	2025-08-13	1.367	1.592	0.1052	0.1052	0.105	\N	\N	1.97	2.43	1.56	1.987	0.25242000000000003	\N	\N	2025-08-13 00:00:00	2025-12-26 19:42:39.359275
51	200	2	2	3	3	2025-08-25	2025-08-25	1.261	7.624	0.1116	0.1216	0.117	\N	\N	7.83	8.89	8.16	8.293	0.08170999999999999	\N	\N	2025-08-25 00:00:00	2025-12-26 19:42:39.410297
41	200	2	2	3	1	2025-08-25	2025-08-25	1.498	1.373	0.10779999999999999	0.10980000000000001	0.109	\N	\N	7.45	4.08	2.54	4.69	0.11111	\N	\N	2025-08-25 00:00:00	2025-12-26 19:42:39.414077
49	200	2	5	3	1	2025-08-22	2025-08-26	3.14	3.146	0.1112	0.11599999999999999	0.114	\N	\N	\N	\N	\N	\N	0.17845	\N	\N	2025-08-22 00:00:00	2025-12-26 19:42:39.417724
48	200	2	2	3	2	2025-08-25	2025-08-25	1.586	1.436	0.11720000000000001	0.10830000000000001	0.113	\N	\N	8.93	5.84	0.38	5.05	0.011850000000000001	\N	\N	2025-08-25 00:00:00	2025-12-26 19:42:39.419536
35	201	2	5	7	1	2025-09-01	2025-09-01	3.325	3.552	0.10529999999999999	0.1039	0.105	\N	\N	\N	\N	\N	\N	0.19143000000000002	\N	\N	2025-09-01 00:00:00	2025-12-26 19:42:39.42135
50	201	2	2	3	4	2025-09-01	2025-09-01	1.14	1.475	0.111	0.1188	0.115	\N	\N	1.96	4.51	0.93	2.467	0.20017	\N	\N	2025-09-01 00:00:00	2025-12-26 19:42:39.423177
15	201	2	2	7	1	2025-09-03	2025-09-03	1.806	1.588	0.09519999999999999	0.094	0.095	\N	\N	1.38	1.54	0.79	1.237	0.056420000000000005	\N	\N	2025-09-03 00:00:00	2025-12-26 19:42:39.430469
54	197	2	2	7	2	2025-08-07	2025-08-07	1.371	1.471	0.11710000000000001	0.1216	0.11939999999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-07 00:00:00	2025-08-07 00:00:00
60	179	2	5	3	1	2025-04-01	2025-04-01	3.35	3.031	0.1367	0.11710000000000001	0.12689999999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-01 00:00:00	2025-04-01 00:00:00
78	171	2	2	7	1	2025-02-06	2025-02-06	1.338	1.87	0.1451	0.15259999999999999	0.1489	\N	\N	12.46	1.42	3.81	5.9	\N	\N	\N	2025-02-06 00:00:00	2025-02-06 00:00:00
1350	166	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.008	0.02	2025-12-26 19:49:28.704286	2025-12-26 19:49:28.710396
82	174	2	2	3	1	2025-02-26	2025-02-26	1.458	1.418	0.1591	0.1552	0.1572	\N	\N	1.75	1.96	1.15	1.62	\N	\N	\N	2025-02-26 00:00:00	2025-02-26 00:00:00
88	182	2	2	3	1	2025-04-16	2025-04-16	1.671	1.768	0.1745	0.16670000000000001	0.17059999999999997	\N	\N	9.8	6.6	0.68	5.69	\N	\N	\N	2025-04-16 00:00:00	2025-04-16 00:00:00
1355	170	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.019	2025-12-26 19:49:28.795596	2025-12-26 19:49:28.797183
94	200	2	2	3	4	2025-08-27	2025-08-27	1.666	1.42	0.203	0.19579999999999997	0.19940000000000002	\N	\N	2.41	8.2	3.42	4.68	\N	\N	\N	2025-08-27 00:00:00	2025-08-27 00:00:00
96	180	2	2	7	1	2025-04-09	2025-04-09	1.682	1.704	0.2095	0.2122	0.2109	\N	\N	15.42	14.69	0.54	10.22	\N	\N	\N	2025-04-09 00:00:00	2025-04-09 00:00:00
99	172	2	2	3	3	2025-02-11	2025-02-11	1.26	1.365	0.22219999999999998	0.218	0.22	\N	\N	0.46	5.08	4.66	3.4	0.17462	\N	\N	2025-02-11 00:00:00	2025-12-26 19:42:37.595939
86	172	2	2	3	4	2025-02-11	2025-02-11	1.427	1.316	0.1751	0.1623	0.169	\N	\N	2.68	13.23	13.41	9.773	0.20567	\N	\N	2025-02-11 00:00:00	2025-12-26 19:42:37.597879
76	179	2	5	7	1	2025-04-02	2025-04-02	3.391	3.322	0.15869999999999998	0.1365	0.148	\N	\N	\N	\N	\N	\N	0.16508	\N	\N	2025-04-02 00:00:00	2025-12-26 19:42:38.013315
87	180	2	2	3	1	2025-04-08	2025-04-08	1.614	1.512	0.16699999999999998	0.1728	0.17	\N	\N	1.78	3.2	0.78	1.92	0.19799000000000003	\N	\N	2025-04-08 00:00:00	2025-12-26 19:42:38.093325
98	180	2	2	3	2	2025-04-08	2025-04-08	1.8111	1.636	0.2028	0.22519999999999998	0.214	\N	\N	3.09	6.6	1.37	3.687	0.18556999999999998	\N	\N	2025-04-08 00:00:00	2025-12-26 19:42:38.095191
92	180	2	2	3	3	2025-04-08	2025-04-08	1.361	1.501	0.1827	0.1859	0.184	\N	\N	0.89	3.42	1.34	1.883	0.2234	\N	\N	2025-04-08 00:00:00	2025-12-26 19:42:38.097122
67	181	2	2	7	1	2025-04-15	2025-04-15	1.393	1.357	0.13390000000000002	0.1362	0.135	\N	\N	0.49	0.68	6.79	2.653	0.31276	\N	\N	2025-04-15 00:00:00	2025-12-26 19:42:38.156482
89	182	2	2	7	1	2025-04-23	2025-04-24	1.351	1.681	0.1659	0.1766	0.171	\N	\N	8.14	1.95	14.41	8.167	0.18614	\N	\N	2025-04-23 00:00:00	2025-12-26 19:42:38.226553
84	182	2	2	3	2	2025-04-21	2025-04-21	1.895	1.577	0.16670000000000001	0.15960000000000002	0.163	\N	\N	9.62	1.97	5.48	5.69	0.13383	\N	\N	2025-04-21 00:00:00	2025-12-26 19:42:38.228477
61	182	2	2	3	3	2025-04-21	2025-04-21	1.645	1.251	0.128	0.1294	0.129	\N	\N	3.87	4.15	1.09	3.037	0.20158999999999996	\N	\N	2025-04-21 00:00:00	2025-12-26 19:42:38.230287
53	188	2	2	7	1	2025-06-04	2025-06-04	1.613	1.622	0.1173	0.1192	0.118	\N	\N	7.82	12.46	2.1	7.46	0.19252	\N	\N	2025-06-04 00:00:00	2025-12-26 19:42:38.696912
57	188	2	2	3	1	2025-05-31	2025-06-03	1.544	1.765	0.1232	0.1259	0.125	\N	\N	2.31	4.24	0.96	2.503	0.19728	\N	\N	2025-05-31 00:00:00	2025-12-26 19:42:38.698812
64	188	2	2	3	3	2025-06-03	2025-06-03	1.517	1.668	0.15109999999999998	0.1114	0.131	\N	\N	2.18	1.39	4.4	2.657	0.21306999999999998	\N	\N	2025-06-03 00:00:00	2025-12-26 19:42:38.702527
73	189	2	2	7	1	2025-06-11	2025-06-11	1.947	1.117	0.1458	0.1389	0.142	\N	\N	3.66	2.76	11.76	6.06	0.18927	\N	\N	2025-06-11 00:00:00	2025-12-26 19:42:38.775982
65	189	2	2	3	2	2025-06-07	2025-06-09	1.481	1.395	0.13570000000000002	0.1297	0.133	\N	\N	7.73	7.52	1.74	5.663	0.16477	\N	\N	2025-06-07 00:00:00	2025-12-26 19:42:38.779713
85	189	2	2	3	3	2025-06-07	2025-06-09	1.564	1.632	0.14980000000000002	0.1783	0.164	\N	\N	5.77	4.71	8.65	6.377	0.21428999999999998	\N	\N	2025-06-07 00:00:00	2025-12-26 19:42:38.781537
83	190	2	2	7	1	2025-06-18	2025-06-18	1.667	1.677	0.1582	0.16440000000000002	0.161	\N	\N	1.18	3.14	2.11	2.143	0.18367	\N	\N	2025-06-18 00:00:00	2025-12-26 19:42:38.853338
90	190	2	2	3	1	2025-06-16	2025-06-16	1.704	1.685	0.1729	0.1698	0.171	\N	\N	5.06	4.56	2.6	4.073	0.21161000000000002	\N	\N	2025-06-16 00:00:00	2025-12-26 19:42:38.855276
93	190	2	2	3	2	2025-06-16	2025-06-16	1.581	1.882	0.1857	0.18539999999999998	0.186	\N	\N	5.39	8.04	3.07	5.5	0.19613	\N	\N	2025-06-16 00:00:00	2025-12-26 19:42:38.857113
68	190	2	2	3	3	2025-06-16	2025-06-16	1.776	1.496	0.13949999999999999	0.1334	0.136	\N	\N	1.27	1.84	7.35	3.487	0.21641	\N	\N	2025-06-16 00:00:00	2025-12-26 19:42:38.858915
58	191	2	2	7	1	2025-06-25	2025-06-25	1.527	1.791	0.12689999999999999	0.1246	0.126	\N	\N	6.55	6.67	1.03	4.75	0.17711	\N	\N	2025-06-25 00:00:00	2025-12-26 19:42:38.924913
69	191	2	2	3	1	2025-06-23	2025-06-23	1.584	1.404	0.1383	0.1359	0.137	\N	\N	4.34	4.98	0.54	3.287	0.15988	\N	\N	2025-06-23 00:00:00	2025-12-26 19:42:38.926829
66	191	2	2	3	2	2025-06-24	2025-06-24	1.469	1.611	0.1334	0.1334	0.133	\N	\N	4.06	0.7	1.63	2.13	0.20487	\N	\N	2025-06-24 00:00:00	2025-12-26 19:42:38.928628
52	191	2	2	3	3	2025-06-24	2025-06-24	2.076	1.441	0.11460000000000001	0.1188	0.117	\N	\N	3.43	6.5	5.58	5.17	0.19632999999999998	\N	\N	2025-06-24 00:00:00	2025-12-26 19:42:38.930361
74	193	2	2	3	1	2025-07-07	2025-07-09	1.868	1.569	0.1457	0.1409	0.143	\N	\N	0.88	7.51	2.01	3.467	0.17764	\N	\N	2025-07-07 00:00:00	2025-12-26 19:42:39.062999
59	193	2	2	3	2	2025-07-07	2025-07-09	1.697	1.587	0.13019999999999998	0.122	0.126	\N	\N	0.3	3.01	7.6	3.637	0.18519	\N	\N	2025-07-07 00:00:00	2025-12-26 19:42:39.06484
72	193	2	2	3	3	2025-07-07	2025-07-09	1.673	1.689	0.142	0.1389	0.14	\N	\N	1.53	1.73	3.62	2.293	0.19743	\N	\N	2025-07-07 00:00:00	2025-12-26 19:42:39.066733
77	194	2	2	3	1	2025-07-12	2025-07-14	1.767	1.457	0.1461	0.1507	0.148	\N	\N	4.72	9.37	3.73	5.94	0.13296	\N	\N	2025-07-12 00:00:00	2025-12-26 19:42:39.11198
56	196	2	2	7	1	2025-07-29	2025-07-31	1.388	1.421	0.12390000000000001	0.1219	0.123	\N	\N	1.72	0.34	3.24	1.767	0.16713999999999998	\N	\N	2025-07-29 00:00:00	2025-12-26 19:42:39.188273
95	197	2	2	7	1	2025-08-06	2025-08-07	1.508	1.36	0.2161	0.2029	0.209	\N	\N	2.93	6.96	1.71	3.867	0.20111	\N	\N	2025-08-06 00:00:00	2025-12-26 19:42:39.297385
62	198	2	2	3	2	2025-08-11	2025-08-12	1.718	1.799	0.1268	0.1316	0.129	\N	\N	10.43	4.41	4.89	6.577	0.16587	\N	\N	2025-08-11 00:00:00	2025-12-26 19:42:39.357422
75	199	2	2	3	1	2025-08-19	2025-08-19	1.849	1.549	0.1421	0.1452	0.144	\N	\N	4.52	1.51	1.19	2.407	0.17647	\N	\N	2025-08-19 00:00:00	2025-12-26 19:42:39.379381
63	199	2	2	3	3	2025-08-19	2025-08-19	1.49	1.366	0.12789999999999999	0.13140000000000002	0.13	\N	\N	8.11	6.56	1.84	5.503	0.053470000000000004	\N	\N	2025-08-19 00:00:00	2025-12-26 19:42:39.392047
97	199	2	2	3	2	2025-08-19	2025-08-19	1.553	1.531	0.20800000000000002	0.2175	0.213	\N	\N	7.99	1.98	2.76	4.243	0.02387	\N	\N	2025-08-19 00:00:00	2025-12-26 19:42:39.395786
70	199	2	2	7	1	2025-08-19	2025-08-20	1.477	1.619	0.1376	0.1366	0.137	\N	\N	9.48	7.71	3.3	6.83	0.14905	\N	\N	2025-08-19 00:00:00	2025-12-26 19:42:39.401295
55	201	2	2	3	3	2025-08-29	2025-08-29	1.189	1.546	0.12710000000000002	0.11720000000000001	0.122	\N	\N	9.5	1.85	0.31	3.887	0.18364999999999998	\N	\N	2025-08-29 00:00:00	2025-12-26 19:42:39.425012
71	201	2	2	3	2	2025-08-29	2025-08-29	1.6	1.64	0.1391	0.1394	0.139	\N	\N	2.31	2.19	1.35	1.95	0.26208	\N	\N	2025-08-29 00:00:00	2025-12-26 19:42:39.426826
1351	167	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.008	0.02	2025-12-26 19:49:28.719309	2025-12-26 19:49:28.72179
103	179	2	2	7	1	2025-04-02	2025-04-02	1.653	1.584	0.251	0.2614	0.2562	\N	\N	0.75	3.32	1.8	1.96	\N	\N	\N	2025-04-02 00:00:00	2025-04-02 00:00:00
106	174	2	2	3	2	2025-02-26	2025-02-26	1.515	1.539	0.2773	0.3016	0.2895	\N	\N	2.12	0.95	6.84	3.3	\N	\N	\N	2025-02-26 00:00:00	2025-02-26 00:00:00
111	194	2	1	9	1	2025-07-11	2025-07-15	3.188	3.292	0.3884	0.3701	0.37929999999999997	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-11 00:00:00	2025-07-11 00:00:00
113	189	2	1	11	1	2025-06-08	2025-06-11	2.909	2.583	0.3908	0.3889	0.3899	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-08 00:00:00	2025-06-08 00:00:00
114	183	2	1	11	1	2025-04-28	2025-04-29	3.037	3.116	0.41490000000000005	0.39130000000000004	0.4031	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-28 00:00:00	2025-04-28 00:00:00
115	192	2	1	9	2	2025-07-01	2025-07-01	3.058	3.534	0.402	0.4143	0.4082	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-01 00:00:00	2025-07-01 00:00:00
116	195	2	1	7	1	2025-07-22	2025-07-24	3.709	3.179	0.4163	0.40270000000000006	0.40950000000000003	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-22 00:00:00	2025-07-22 00:00:00
119	193	2	1	9	1	2025-07-05	2025-07-09	3.043	3.133	0.39130000000000004	0.441	0.41619999999999996	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-05 00:00:00	2025-07-05 00:00:00
122	193	2	1	7	1	2025-07-09	2025-07-09	3.22	3.597	0.42700000000000005	0.41350000000000003	0.4203	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-09 00:00:00	2025-07-09 00:00:00
125	174	2	1	7	1	2025-02-26	2025-02-26	3.34	3.059	0.4168	0.4325	0.42469999999999997	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-26 00:00:00	2025-02-26 00:00:00
127	189	2	1	7	1	2025-06-11	2025-06-11	3.071	3.34	0.42369999999999997	0.4338	0.4288	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-11 00:00:00	2025-06-11 00:00:00
1358	172	1	13	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.02	2025-12-26 19:49:28.8395	2025-12-26 19:49:28.841659
129	201	1	14	2	1	2025-09-05	2025-09-05	7.517	7.2	0.44179999999999997	0.43799999999999994	0.4399	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-09-05 00:00:00	2025-09-05 00:00:00
131	172	2	1	7	1	2025-02-13	2025-02-13	3.03	2.977	0.4561	0.4264	0.4413	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-13 00:00:00	2025-02-13 00:00:00
132	195	1	7	6	1	2025-07-29	2025-07-29	5.656	5.148	0.4413	0.4413	0.4413	5.269	7.25	\N	\N	\N	\N	\N	\N	\N	2025-07-29 00:00:00	2025-07-29 00:00:00
133	191	2	1	11	1	2025-06-23	2025-06-23	3.05	2.758	0.44299999999999995	0.4411	0.4421	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-23 00:00:00	2025-06-23 00:00:00
134	196	2	1	7	1	2025-07-29	2025-07-29	3.272	3.088	0.4585	0.4324	0.44549999999999995	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-29 00:00:00	2025-07-29 00:00:00
135	194	2	1	9	3	2025-07-12	2025-07-15	3.922	3.456	0.44920000000000004	0.4517	0.45049999999999996	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-12 00:00:00	2025-07-12 00:00:00
136	191	2	1	7	1	2025-06-25	2025-06-25	3.678	3.052	0.49340000000000006	0.4092	0.45130000000000003	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-25 00:00:00	2025-06-25 00:00:00
137	171	2	1	9	1	2025-02-03	2025-02-03	2.966	3.146	0.44659999999999994	0.4617	0.4542	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-03 00:00:00	2025-02-03 00:00:00
138	192	2	1	9	1	2025-06-28	2025-07-01	3.468	3.041	0.46880000000000005	0.43979999999999997	0.4543	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-28 00:00:00	2025-06-28 00:00:00
139	188	2	1	11	1	2025-06-05	2025-06-05	3.062	3.994	0.45	0.4603	0.45520000000000005	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-05 00:00:00	2025-06-05 00:00:00
142	190	2	1	7	1	2025-06-18	2025-06-18	3.162	3.108	0.45640000000000003	0.47759999999999997	0.467	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-18 00:00:00	2025-06-18 00:00:00
143	172	2	1	11	1	2025-02-11	2025-02-11	3.676	3.212	0.47100000000000003	0.4664	0.46869999999999995	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-11 00:00:00	2025-02-11 00:00:00
144	194	2	1	9	2	2025-07-12	2025-07-15	3.341	3.167	0.4899	0.4523	0.4711	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-12 00:00:00	2025-07-12 00:00:00
145	188	2	1	7	1	2025-06-04	2025-06-04	3.68	3.243	0.47119999999999995	0.4714	0.47130000000000005	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-04 00:00:00	2025-06-04 00:00:00
146	195	2	1	9	3	2025-07-23	2025-07-25	3.825	3.615	0.4966	0.446	0.47130000000000005	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-23 00:00:00	2025-07-23 00:00:00
147	197	1	14	12	1	2025-08-08	2025-08-08	7.721	7.352	0.4889	0.4581	0.47350000000000003	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-08 00:00:00	2025-08-08 00:00:00
148	195	2	1	9	1	2025-07-21	2025-07-21	3.302	3.407	0.4767	0.4706	0.47369999999999995	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-21 00:00:00	2025-07-21 00:00:00
149	190	2	1	11	1	2025-06-17	2025-06-17	2.955	3.14	0.4816	0.4718	0.4767	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-17 00:00:00	2025-06-17 00:00:00
150	183	2	1	11	2	2025-04-30	2025-04-30	3.117	3.053	0.4836	0.47240000000000004	0.478	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-30 00:00:00	2025-04-30 00:00:00
151	194	2	1	7	1	2025-07-12	2025-07-15	3.349	3.44	0.4844	0.474	0.4792	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-12 00:00:00	2025-07-12 00:00:00
153	200	1	14	2	1	2025-08-29	2025-08-29	7.181	7.308	0.4877	0.4743	0.48100000000000004	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-29 00:00:00	2025-08-29 00:00:00
154	196	1	14	12	1	2025-08-01	2025-08-01	7.046	7.343	0.4975	0.465	0.4813	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-01 00:00:00	2025-08-01 00:00:00
1021	171	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01568	\N	\N	2025-12-26 19:42:37.492397	2025-12-26 19:42:37.494861
126	173	2	1	9	2	2025-02-19	2025-02-19	3.11	3.459	0.41609999999999997	0.4357	0.426	\N	\N	\N	\N	\N	\N	0.010740000000000001	\N	\N	2025-02-19 00:00:00	2025-12-26 19:42:37.623413
102	173	2	2	3	2	2025-02-19	2025-02-20	3.46	6.455	0.2488	0.2403	0.245	\N	\N	6.45	2.37	7.16	5.327	0.19862999999999997	\N	\N	2025-02-19 00:00:00	2025-12-26 19:42:37.648011
118	181	2	2	3	2	2025-04-15	2025-04-15	1.857	1.8	0.42340000000000005	0.4086	0.416	\N	\N	5.69	6.98	5.31	5.993	0.19457000000000002	\N	\N	2025-04-15 00:00:00	2025-12-26 19:42:38.160203
107	183	2	2	3	1	2025-04-28	2025-04-29	1.601	1.644	0.2967	0.2833	0.29	\N	\N	1.13	1.39	1.48	1.333	0.19786	\N	\N	2025-04-28 00:00:00	2025-12-26 19:42:38.310113
104	183	2	2	3	2	2025-04-30	2025-04-30	1.491	1.763	0.2658	0.2502	0.258	\N	\N	3.71	8.81	3.78	5.433	0.19742	\N	\N	2025-04-30 00:00:00	2025-12-26 19:42:38.311989
101	183	2	2	3	3	2025-04-30	2025-04-30	1.542	1.38	0.242	0.2432	0.243	\N	\N	1.45	8.12	5.13	4.9	0.20377	\N	\N	2025-04-30 00:00:00	2025-12-26 19:42:38.313786
108	183	2	2	3	4	2025-04-30	2025-04-30	1.356	1.457	0.31739999999999996	0.3151	0.316	\N	\N	0.86	0.23	2.29	1.127	0.23992999999999995	\N	\N	2025-04-30 00:00:00	2025-12-26 19:42:38.315619
109	188	1	1	9	2	2025-06-06	2025-06-06	3.605	3.418	0.3576	0.3578	0.358	\N	\N	\N	\N	\N	\N	0.01016	\N	\N	2025-06-06 00:00:00	2025-12-26 19:42:38.645336
123	190	2	1	13	1	2025-06-17	2025-06-17	3.074	3.099	0.4261	0.4182	0.422	\N	\N	\N	\N	\N	\N	0.01647	\N	\N	2025-06-17 00:00:00	2025-12-26 19:42:38.798131
152	197	2	1	9	1	2025-08-05	2025-08-05	3.145	3.663	0.47490000000000004	0.485	0.48	\N	\N	\N	\N	\N	\N	0.17949	\N	\N	2025-08-05 00:00:00	2025-12-26 19:42:39.308388
124	197	2	1	11	1	2025-08-04	2025-08-05	3.276	3.076	0.41729999999999995	0.42829999999999996	0.423	\N	\N	\N	\N	\N	\N	0.16213	\N	\N	2025-08-04 00:00:00	2025-12-26 19:42:39.315981
112	197	2	1	7	1	2025-08-06	2025-08-06	3.666	3.156	0.4003	0.3632	0.382	\N	\N	\N	\N	\N	\N	0.1362	\N	\N	2025-08-06 00:00:00	2025-12-26 19:42:39.325464
105	198	2	2	3	3	2025-08-11	2025-08-12	2.658	2.205	0.28190000000000004	0.2841	0.283	\N	\N	9.14	4.13	4.32	5.863	0.18403	\N	\N	2025-08-11 00:00:00	2025-12-26 19:42:39.349784
117	198	2	1	7	1	2025-08-12	2025-08-12	3.066	3.106	0.4337	0.3982	0.416	\N	\N	\N	\N	\N	\N	0.17010000000000003	\N	\N	2025-08-12 00:00:00	2025-12-26 19:42:39.353632
110	198	2	1	11	1	2025-08-11	2025-08-12	3.059	3.014	0.369	0.37450000000000006	0.372	\N	\N	\N	\N	\N	\N	0.095	\N	\N	2025-08-11 00:00:00	2025-12-26 19:42:39.37026
140	199	2	1	9	2	2025-08-19	2025-08-19	4.218	4.366	0.467	0.4532	0.46	\N	\N	\N	\N	\N	\N	0.16171	\N	\N	2025-08-19 00:00:00	2025-12-26 19:42:39.383044
130	199	2	1	7	1	2025-08-19	2025-08-19	3.028	3.268	0.4243	0.4571	0.441	\N	\N	\N	\N	\N	\N	0.15917	\N	\N	2025-08-19 00:00:00	2025-12-26 19:42:39.393832
121	200	2	1	13	1	2025-08-25	2025-08-25	3.27	3.116	0.4229	0.4157	0.419	\N	\N	\N	\N	\N	\N	0.14833	\N	\N	2025-08-25 00:00:00	2025-12-26 19:42:39.408525
141	201	2	1	13	1	2025-09-02	2025-09-02	3.135	3.407	0.4715	0.46149999999999997	0.466	\N	\N	\N	\N	\N	\N	0.01125	\N	\N	2025-09-02 00:00:00	2025-12-26 19:42:39.432307
155	181	2	1	9	1	2025-04-15	2025-04-16	3.24	3.23	0.49090000000000006	0.4829	0.4869	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-15 00:00:00	2025-04-15 00:00:00
156	171	2	1	9	2	2025-02-05	2025-02-06	3.424	3.434	0.4907	0.48560000000000003	0.4882	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-05 00:00:00	2025-02-05 00:00:00
158	194	2	14	2	1	2025-07-18	2025-07-18	7.444	7.587	0.5222	0.4573	0.48979999999999996	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-18 00:00:00	2025-07-18 00:00:00
159	174	2	1	9	1	2025-02-25	2025-02-26	3.211	3.151	0.4842	0.496	0.4901	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-25 00:00:00	2025-02-25 00:00:00
160	195	2	1	9	2	2025-07-22	2025-07-22	3.262	3.43	0.4876	0.4926	0.4901	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-22 00:00:00	2025-07-22 00:00:00
161	171	2	1	7	1	2025-02-05	2025-02-06	3.153	3.13	0.4964	0.484	0.4902	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-05 00:00:00	2025-02-05 00:00:00
162	180	2	1	7	1	2025-04-09	2025-04-09	3.452	3.014	0.4924	0.49119999999999997	0.4918	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-09 00:00:00	2025-04-09 00:00:00
165	180	2	1	9	1	2025-04-08	2025-04-08	3.271	3.463	0.5097	0.48960000000000004	0.4997	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-08 00:00:00	2025-04-08 00:00:00
166	194	1	7	6	1	2025-07-22	2025-07-22	6.827	6.989	0.5041	0.5024000000000001	0.5033	7.503	7.77	\N	\N	\N	\N	\N	\N	\N	2025-07-22 00:00:00	2025-07-22 00:00:00
168	183	2	4	7	2	2025-04-29	2025-04-29	7.29	6.639	0.5307	0.4796	0.5052	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-29 00:00:00	2025-04-29 00:00:00
169	191	2	1	9	2	2025-06-25	2025-06-25	3.279	3.022	0.54	0.4703	0.5052	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-25 00:00:00	2025-06-25 00:00:00
175	192	2	1	7	1	2025-07-02	2025-07-02	3.249	3.461	0.5143	0.5136	0.514	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-02 00:00:00	2025-07-02 00:00:00
176	193	2	1	9	2	2025-07-07	2025-07-09	3.723	3.673	0.5073	0.5233	0.5153	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-07 00:00:00	2025-07-07 00:00:00
177	200	2	4	3	1	2025-08-28	2025-08-29	7.552	7.18	0.5207	0.5111	0.5159	7.636	7.73	\N	\N	\N	\N	\N	\N	\N	2025-08-28 00:00:00	2025-08-28 00:00:00
178	172	2	1	9	1	2025-02-12	2025-02-12	3.124	3.178	0.5372	0.4975	0.5174	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-12 00:00:00	2025-02-12 00:00:00
179	182	2	1	7	2	2025-04-23	2025-04-23	3.283	3.386	0.5243	0.5146999999999999	0.5195000000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-23 00:00:00	2025-04-23 00:00:00
180	192	2	4	3	2	2025-07-03	2025-07-04	7.488	7.36	0.5039	0.5355	0.5196999999999999	7.807	8.27	\N	\N	\N	\N	\N	\N	\N	2025-07-03 00:00:00	2025-07-03 00:00:00
181	198	1	14	2	1	2025-08-17	2025-08-16	\N	\N	0.5399	0.5103	0.5251	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-17 00:00:00	2025-08-17 00:00:00
182	181	2	1	9	2	2025-04-15	2025-04-16	3.697	6.798	0.5328	0.5185	0.5257000000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-15 00:00:00	2025-04-15 00:00:00
183	200	2	4	7	2	2025-08-29	2025-08-29	7.171	7.921	0.5306000000000001	0.5244	0.5275	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-29 00:00:00	2025-08-29 00:00:00
184	188	2	1	9	1	2025-06-04	2025-06-04	3.122	3.132	0.5235	0.5331	0.5283	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-04 00:00:00	2025-06-04 00:00:00
185	188	2	1	9	2	2025-06-05	2025-06-05	3.743	3.845	0.5387	0.5199	0.5293	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-05 00:00:00	2025-06-05 00:00:00
186	200	2	4	7	1	2025-08-28	2025-08-28	7.211	7.677	0.5192	0.546	0.5326	7.667	8.08	\N	\N	\N	\N	\N	\N	\N	2025-08-28 00:00:00	2025-08-28 00:00:00
187	199	1	14	2	1	2025-08-22	2025-08-22	7.652	7.709	0.557	0.5105	0.5338	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-22 00:00:00	2025-08-22 00:00:00
188	189	2	1	9	2	2025-06-11	2025-06-11	3.993	3.966	0.5466	0.5247999999999999	0.5357	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-11 00:00:00	2025-06-11 00:00:00
190	196	2	1	9	2	2025-07-30	2025-07-30	3.215	3.418	0.5442	0.5305	0.5374	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-30 00:00:00	2025-07-30 00:00:00
192	189	2	1	9	1	2025-06-10	2025-06-10	4.492	3.912	0.5367999999999999	0.5531	0.545	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 00:00:00	2025-06-10 00:00:00
196	201	2	4	3	1	2025-09-04	2025-09-05	7.279	7.229	0.6026	0.4949	0.5488000000000001	7.756	8.95	\N	\N	\N	\N	\N	\N	\N	2025-09-04 00:00:00	2025-09-04 00:00:00
1352	168	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.02	2025-12-26 19:49:28.727825	2025-12-26 19:49:28.729989
199	198	2	4	3	1	2025-08-14	2025-08-14	7.169	7.215	0.5615	0.5524	0.557	7.722	8.21	\N	\N	\N	\N	\N	\N	\N	2025-08-14 00:00:00	2025-08-14 00:00:00
200	181	2	1	7	1	2025-04-15	2025-04-15	4.142	3.126	0.5425	0.5797	0.5611	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-15 00:00:00	2025-04-15 00:00:00
251	173	2	4	3	2	2025-02-24	2025-02-24	7.761	6.768	0.6238	0.6164000000000001	0.62	\N	\N	\N	\N	\N	\N	0.14286	0.019	0.049	2025-02-24 00:00:00	2025-12-26 19:49:28.783948
191	173	2	1	9	1	2025-02-18	2025-02-18	3.327	3.434	0.5106	0.5713	0.541	\N	\N	\N	\N	\N	\N	0.016579999999999998	\N	\N	2025-02-18 00:00:00	2025-12-26 19:42:37.625254
163	179	2	1	9	1	2025-04-02	2025-04-02	3.127	3.052	0.5077	0.4833	0.496	\N	\N	\N	\N	\N	\N	0.0317	\N	\N	2025-04-02 00:00:00	2025-12-26 19:42:38.010159
208	181	2	4	7	1	2025-04-15	2025-04-15	6.763	6.584	0.5669	0.5878	0.577	\N	\N	\N	\N	\N	\N	0.16957999999999998	\N	\N	2025-04-15 00:00:00	2025-12-26 19:42:38.125321
164	182	2	1	13	1	2025-04-22	2025-04-22	3.225	3.014	0.49560000000000004	0.5027	0.499	\N	\N	\N	\N	\N	\N	0.0179	\N	\N	2025-04-22 00:00:00	2025-12-26 19:42:38.184386
173	183	2	1	9	1	2025-04-29	2025-04-29	3.446	3.106	0.5158	0.5105	0.513	\N	\N	\N	\N	\N	\N	0.00971	\N	\N	2025-04-29 00:00:00	2025-12-26 19:42:38.254185
203	190	2	4	7	1	2025-06-17	2025-06-17	7.881	7.468	0.5706	0.5574	0.564	7.592	8.39	\N	\N	\N	\N	0.25478	\N	\N	2025-06-17 00:00:00	2025-12-26 19:42:38.812698
194	193	2	4	7	1	2025-07-09	2025-07-09	8.097	7.36	0.5422	0.5515	0.547	7.731	8.29	\N	\N	\N	\N	0.2275	\N	\N	2025-07-09 00:00:00	2025-12-26 19:42:39.035892
204	194	1	7	5	1	2025-07-18	2025-07-21	7.372	7.029	0.5718	0.5655	0.569	7.543	7.8	\N	\N	\N	\N	0.22404000000000002	\N	\N	2025-07-18 00:00:00	2025-12-26 19:42:39.090261
202	194	2	4	7	1	2025-07-15	2025-07-15	7.615	7.113	0.5566	0.5710000000000001	0.564	7.779	7.93	\N	\N	\N	\N	0.15794	\N	\N	2025-07-15 00:00:00	2025-12-26 19:42:39.092115
174	195	1	7	5	1	2025-07-26	2025-07-28	6.148	5.648	0.5092	0.5175	0.513	\N	\N	\N	\N	\N	\N	0.23541	\N	\N	2025-07-26 00:00:00	2025-12-26 19:42:39.142529
189	195	2	4	7	1	2025-07-22	2025-07-22	7.048	8.236	0.544	0.5299	0.537	7.558	7.66	\N	\N	\N	\N	0.13273	\N	\N	2025-07-22 00:00:00	2025-12-26 19:42:39.144319
195	197	2	1	9	2	2025-08-07	2025-08-07	3.488	3.356	0.5527000000000001	0.5424	0.548	\N	\N	\N	\N	\N	\N	0.17959	\N	\N	2025-08-07 00:00:00	2025-12-26 19:42:39.290039
210	197	2	4	3	1	2025-08-06	2025-08-07	7.991	7.732	0.5845	0.5908	0.588	7.54	8.82	\N	\N	\N	\N	0.24419000000000002	\N	\N	2025-08-06 00:00:00	2025-12-26 19:42:39.329182
206	197	2	4	7	1	2025-08-06	2025-08-06	7.372	7.679	0.586	0.5644	0.575	7.625	7.56	\N	\N	\N	\N	-0.6863800000000001	\N	\N	2025-08-06 00:00:00	2025-12-26 19:42:39.330981
201	198	2	1	9	2	2025-08-14	2025-08-14	3.037	3.127	0.5799	0.5429999999999999	0.561	\N	\N	\N	\N	\N	\N	0.17841	\N	\N	2025-08-14 00:00:00	2025-12-26 19:42:39.347907
171	198	2	1	9	1	2025-08-11	2025-08-12	3.218	3.528	0.5167	0.5074000000000001	0.512	\N	\N	\N	\N	\N	\N	0.18367	\N	\N	2025-08-11 00:00:00	2025-12-26 19:42:39.366603
207	199	2	4	3	2	2025-08-25	2025-08-25	7.329	7.737	0.5676	0.5845	0.576	\N	\N	\N	\N	\N	\N	0.14526999999999998	\N	\N	2025-08-25 00:00:00	2025-12-26 19:42:39.390217
193	199	2	1	9	1	2025-08-19	2025-08-19	4.972	4.373	0.5311	0.5619	0.546	\N	\N	\N	\N	\N	\N	0.17132000000000003	\N	\N	2025-08-19 00:00:00	2025-12-26 19:42:39.397704
167	200	2	1	13	3	2025-08-25	2025-08-25	3.718	3.09	0.49579999999999996	0.5115999999999999	0.504	\N	\N	\N	\N	\N	\N	0.01102	\N	\N	2025-08-25 00:00:00	2025-12-26 19:42:39.415916
157	201	2	4	7	1	2025-09-02	2025-09-02	7.857	7.25	0.5143	0.4637	0.489	7.52	7.61	\N	\N	\N	\N	0.11599	\N	\N	2025-09-02 00:00:00	2025-12-26 19:42:39.428674
172	201	2	1	9	2	2025-09-02	2025-09-02	3.215	3.072	0.5147999999999999	0.5102	0.512	\N	\N	\N	\N	\N	\N	0.00981	\N	\N	2025-09-02 00:00:00	2025-12-26 19:42:39.434112
170	201	2	1	9	1	2025-09-02	2025-09-02	3.46	3.366	0.5286	0.48829999999999996	0.508	\N	\N	\N	\N	\N	\N	0.25145	\N	\N	2025-09-02 00:00:00	2025-12-26 19:42:39.435991
212	199	2	4	3	1	2025-08-20	2025-08-21	7.361	7.265	0.5629	0.6147	0.5888	7.537	7.89	\N	\N	\N	\N	\N	\N	\N	2025-08-20 00:00:00	2025-08-20 00:00:00
213	174	2	4	7	1	2025-02-25	2025-02-25	7.287	7.012	0.5892000000000001	0.5917	0.5905	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-25 00:00:00	2025-02-25 00:00:00
224	172	2	4	3	1	2025-02-14	2025-02-15	7.153	6.354	0.6356	0.5740999999999999	0.605	7.568	8.16	\N	\N	\N	\N	\N	0.023	0.058	2025-02-14 00:00:00	2025-12-26 19:49:28.736039
216	180	2	4	7	1	2025-04-09	2025-04-09	7.211	7.653	0.6072	0.5753	0.5913	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-09 00:00:00	2025-04-09 00:00:00
219	190	2	1	9	1	2025-06-17	2025-06-17	3.311	3.403	0.5972	0.5916	0.5943999999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-17 00:00:00	2025-06-17 00:00:00
220	193	2	1	9	3	2025-07-09	2025-07-09	3.487	3.347	0.643	0.5529999999999999	0.598	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-09 00:00:00	2025-07-09 00:00:00
221	196	2	4	3	2	2025-07-30	2025-07-31	7.258	7.365	0.5891	0.6154999999999999	0.6023	7.687	7.46	\N	\N	\N	\N	\N	\N	\N	2025-07-30 00:00:00	2025-07-30 00:00:00
223	188	1	7	6	1	2025-06-10	2025-06-10	6.987	7.151	0.6141	0.5913	0.6027	7.632	7.6	\N	\N	\N	\N	\N	\N	\N	2025-06-10 00:00:00	2025-06-10 00:00:00
226	193	2	4	3	2	2025-07-10	2025-07-11	7.736	7.454	0.626	0.5851	0.6056	7.505	7.93	\N	\N	\N	\N	\N	\N	\N	2025-07-10 00:00:00	2025-07-10 00:00:00
228	196	2	1	9	1	2025-07-29	2025-07-30	4.396	5.562	0.6106	0.6019	0.6063000000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-29 00:00:00	2025-07-29 00:00:00
230	194	2	4	3	2	2025-07-17	2025-07-17	7.195	7.918	0.623	0.5961	0.6096	7.548	7.44	\N	\N	\N	\N	\N	\N	\N	2025-07-17 00:00:00	2025-07-17 00:00:00
233	188	2	4	3	2	2025-06-06	2025-06-09	7.319	7.697	0.5861	0.6402	0.6132	7.69	8.27	\N	\N	\N	\N	\N	\N	\N	2025-06-06 00:00:00	2025-06-06 00:00:00
234	192	1	7	6	1	2025-07-08	2025-07-09	7.588	7.531	0.6204999999999999	0.6081	0.6143	7.549	8.17	\N	\N	\N	\N	\N	\N	\N	2025-07-08 00:00:00	2025-07-08 00:00:00
237	179	2	1	7	1	2025-04-01	2025-04-01	4.36	4.59	0.6133	0.6167	0.615	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-01 00:00:00	2025-04-01 00:00:00
241	188	1	7	6	2	2025-06-10	2025-06-11	7.463	7.18	0.6169	0.6179	0.6174000000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 00:00:00	2025-06-10 00:00:00
245	185	1	13	3	2	2025-06-05	2025-06-05	7.277	7.222	0.6217	0.6157	0.6187	8.168	7.45	0.53	1.25	1.56	1.11	\N	\N	\N	2025-06-05 00:00:00	2025-06-05 00:00:00
246	193	1	7	6	1	2025-07-15	2025-07-15	7.249	7.61	0.6179	0.6195	0.6187	7.727	7.97	\N	\N	\N	\N	\N	\N	\N	2025-07-15 00:00:00	2025-07-15 00:00:00
247	185	1	13	3	7	2025-06-06	2025-06-06	7.219	7.822	0.6195	0.6186	0.6191	7.526	7.6	2.06	0.22	1.26	1.18	\N	\N	\N	2025-06-06 00:00:00	2025-06-06 00:00:00
249	187	1	13	3	10	2025-06-20	2025-06-20	6.037	7.321	0.6259	0.6133	0.6196	\N	7.41	1.3	0.68	0.96	0.98	\N	\N	\N	2025-06-20 00:00:00	2025-06-20 00:00:00
529	170	1	11	2	1	2025-02-14	2025-02-15	7.903	7.626	0.7162000000000001	0.7136	0.715	7.513	8.02	13.36	0.65	2.17	5.393	0.24391000000000002	0.005	0.017	2025-02-14 00:00:00	2025-12-26 19:49:28.757444
253	187	1	13	3	7	2025-06-20	2025-06-20	7.326	7.444	0.617	0.6249	0.621	7.559	7.75	6.69	0.54	1.97	3.07	\N	\N	\N	2025-06-20 00:00:00	2025-06-20 00:00:00
257	171	2	4	7	1	2025-02-04	2025-02-04	7.395	7.336	0.628	0.6153	0.6217	7.768	8.42	\N	\N	\N	\N	\N	\N	\N	2025-02-04 00:00:00	2025-02-04 00:00:00
259	169	1	13	3	6	2025-02-14	2025-02-15	6.971	7.256	0.625	0.6194	0.6222	\N	7.93	3.12	1.03	0.52	1.56	\N	\N	\N	2025-02-14 00:00:00	2025-02-14 00:00:00
260	190	1	7	6	1	2025-06-24	2025-06-24	7.07	7.264	0.6289	0.6165999999999999	0.6228	7.539	7.63	\N	\N	\N	\N	\N	\N	\N	2025-06-24 00:00:00	2025-06-24 00:00:00
261	188	1	13	3	7	2025-06-26	2025-06-26	7.157	7.758	0.6204999999999999	0.6257	0.6231	7.817	7.82	0.56	1.18	2.18	1.31	\N	\N	\N	2025-06-26 00:00:00	2025-06-26 00:00:00
1359	173	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.02	2025-12-26 19:49:28.867176	2025-12-26 19:49:28.868542
240	179	2	4	3	2	2025-04-03	2025-04-03	7.693	7.341	0.6221	0.6112	0.617	7.537	7.87	\N	\N	\N	\N	\N	0.019	0.05	2025-04-03 00:00:00	2025-12-26 19:49:28.945883
243	180	2	4	3	2	2025-04-09	2025-04-09	7.898	8.018	0.6333	0.6021	0.618	\N	\N	\N	\N	\N	\N	\N	0.022	0.056	2025-04-09 00:00:00	2025-12-26 19:49:29.068256
225	182	2	4	3	1	2025-04-23	2025-04-23	7.496	7.743	0.6545000000000001	0.5566	0.606	\N	\N	\N	\N	\N	\N	0.15346	0.021	0.054	2025-04-23 00:00:00	2025-12-26 19:49:29.12128
231	185	1	13	3	3	2025-06-05	2025-06-05	7.824	7.418	0.6104999999999999	0.6103000000000001	0.61	7.53	7.39	1.85	1.31	0.14	1.1	0.23077000000000003	\N	\N	2025-06-05 00:00:00	2025-12-26 19:42:38.548643
235	187	1	13	3	2	2025-06-19	2025-06-19	7.519	7.326	0.6113000000000001	0.6178	0.615	7.78	7.67	4.28	1.02	0.72	2.007	0.26517	\N	\N	2025-06-19 00:00:00	2025-12-26 19:42:38.609684
242	187	1	13	3	3	2025-06-19	2025-06-19	7.184	7.195	0.6138	0.6214	0.618	7.504	7.61	3.27	3.24	0.43	2.313	0.25082	\N	\N	2025-06-19 00:00:00	2025-12-26 19:42:38.611577
254	187	1	13	3	8	2025-06-20	2025-06-20	7.771	7.641	0.6249	0.6172	0.621	7.844	7.47	1.79	0.8	0.56	1.05	0.26726	\N	\N	2025-06-20 00:00:00	2025-12-26 19:42:38.622292
244	187	1	13	3	9	2025-06-20	2025-06-20	7.088	7.781	0.62	0.6164999999999999	0.618	7.664	7.34	0.8	0.56	1.36	0.907	0.21422	\N	\N	2025-06-20 00:00:00	2025-12-26 19:42:38.624094
232	188	2	4	7	1	2025-06-04	2025-06-04	7.435	7.681	0.6247	0.5981000000000001	0.611	8.696	7.98	\N	\N	\N	\N	0.11433000000000001	\N	\N	2025-06-04 00:00:00	2025-12-26 19:42:38.652543
250	188	2	4	3	1	2025-06-05	2025-06-05	7.865	7.697	0.6165999999999999	0.6233	0.62	7.742	7.97	\N	\N	\N	\N	0.25521	\N	\N	2025-06-05 00:00:00	2025-12-26 19:42:38.658114
215	189	2	4	3	1	2025-06-11	2025-06-11	7.201	7.308	0.5884	0.5937	0.591	8.265	8.21	\N	\N	\N	\N	0.25582	\N	\N	2025-06-11 00:00:00	2025-12-26 19:42:38.738064
211	191	2	1	9	1	2025-06-23	2025-06-24	3.511	3.22	0.588	0.5892000000000001	0.589	\N	\N	\N	\N	\N	\N	0.01917	\N	\N	2025-06-23 00:00:00	2025-12-26 19:42:38.878421
218	191	2	4	7	1	2025-06-25	2025-06-25	7.659	7.401	0.6323	0.5549000000000001	0.594	7.599	8.09	\N	\N	\N	\N	0.12883	\N	\N	2025-06-25 00:00:00	2025-12-26 19:42:38.88746
239	192	2	4	7	1	2025-07-01	2025-07-01	7.573	7.958	0.6419	0.5912	0.617	7.896	7.91	\N	\N	\N	\N	0.14892	\N	\N	2025-07-01 00:00:00	2025-12-26 19:42:38.954882
229	192	2	4	3	1	2025-07-03	2025-07-03	7.2	7.697	0.6099	0.6046	0.607	7.506	8.27	\N	\N	\N	\N	0.30341	\N	\N	2025-07-03 00:00:00	2025-12-26 19:42:38.960705
222	194	2	4	3	1	2025-07-16	2025-07-16	8.049	7.995	0.6142	0.5906	0.602	7.555	8.24	\N	\N	\N	\N	0.28734000000000004	\N	\N	2025-07-16 00:00:00	2025-12-26 19:42:39.09763
236	196	2	4	3	1	2025-07-30	2025-07-30	7.685	7.153	0.6088	0.6211	0.615	7.597	7.66	\N	\N	\N	\N	0.25092	\N	\N	2025-07-30 00:00:00	2025-12-26 19:42:39.18017
258	193	1	13	3	9	2025-08-01	2025-08-04	7.637	7.343	0.6225	0.6212	0.622	7.802	7.08	0.81	0.94	0.1	0.617	0.22184	\N	\N	2025-08-01 00:00:00	2025-12-26 19:42:39.206681
238	198	2	4	7	1	2025-08-13	2025-08-13	7.93	7.086	0.6318	0.5984	0.615	7.833	8.15	\N	\N	\N	\N	0.10747999999999999	\N	\N	2025-08-13 00:00:00	2025-12-26 19:42:39.361087
217	198	2	4	3	2	2025-08-14	2025-08-15	7.487	7.158	0.5899	0.5953	0.593	7.577	7.9	\N	\N	\N	\N	0.1727	\N	\N	2025-08-14 00:00:00	2025-12-26 19:42:39.375786
255	180	2	4	3	1	2025-04-09	2025-04-09	7.732	7.08	0.6396999999999999	0.6026	0.621	\N	\N	\N	\N	\N	\N	0.23695	0.021	0.054	2025-04-09 00:00:00	2025-12-26 19:49:29.061211
248	181	2	4	3	1	2025-04-15	2025-04-15	8.259	7.291	0.6114	0.627	0.619	\N	\N	\N	\N	\N	\N	0.25029	0.023	0.061	2025-04-15 00:00:00	2025-12-26 19:49:29.093468
264	200	1	7	6	1	2025-09-02	2025-09-03	7.456	6.984	0.6202000000000001	0.6277	0.624	7.512	8.48	\N	\N	\N	\N	\N	\N	\N	2025-09-02 00:00:00	2025-09-02 00:00:00
265	185	1	13	3	8	2025-06-06	2025-06-06	\N	\N	0.6249	0.6233	0.6241	\N	7.54	2.61	0.59	2.65	1.95	\N	\N	\N	2025-06-06 00:00:00	2025-06-06 00:00:00
267	176	1	13	3	5	2025-04-02	2025-04-02	7.453	7.48	0.6371	0.6133	0.6252	7.595	7.55	12.09	7.29	1.38	6.92	\N	\N	\N	2025-04-02 00:00:00	2025-04-02 00:00:00
268	168	1	13	3	3	2025-02-07	2025-02-08	6.904	7.373	0.6244	0.6262	0.6253	7.504	7.76	\N	\N	\N	\N	\N	\N	\N	2025-02-07 00:00:00	2025-02-07 00:00:00
266	172	2	4	3	2	2025-02-14	2025-02-15	6.928	7.965	0.6393	0.6095	0.624	7.539	7.88	\N	\N	\N	\N	\N	0.024	0.064	2025-02-14 00:00:00	2025-12-26 19:49:28.742492
271	185	1	13	3	1	2025-06-05	2025-06-05	7.863	7.443	0.6294	0.6215999999999999	0.6255	7.512	7.77	2.32	1.07	3.57	2.32	\N	\N	\N	2025-06-05 00:00:00	2025-06-05 00:00:00
272	177	1	13	3	7	2025-04-10	2025-04-10	7.149	7.765	0.6275	0.6239	0.6257	\N	7.92	13.31	0.29	0.85	4.82	\N	\N	\N	2025-04-10 00:00:00	2025-04-10 00:00:00
274	185	1	13	3	9	2025-06-06	2025-06-06	\N	\N	0.6253	0.6265	0.6259	\N	7.52	2.05	0.83	2.41	1.76	\N	\N	\N	2025-06-06 00:00:00	2025-06-06 00:00:00
276	187	1	13	3	4	2025-06-19	2025-06-19	7.81	7.492	0.6242	0.6281	0.6262	7.521	7.6	2.1	2.4	0.22	1.57	\N	\N	\N	2025-06-19 00:00:00	2025-06-19 00:00:00
279	177	1	13	3	8	2025-04-10	2025-04-10	7.209	7.487	0.6272	0.6264	0.6268	7.541	7.85	0.22	0.44	1.87	0.84	\N	\N	\N	2025-04-10 00:00:00	2025-04-10 00:00:00
281	169	1	13	3	7	2025-02-15	2025-02-15	7.088	7.007	0.6269	0.6282	0.6275999999999999	7.927	7.91	0.72	1.27	0.38	0.79	\N	\N	\N	2025-02-15 00:00:00	2025-02-15 00:00:00
282	185	1	13	3	10	2025-06-06	2025-06-06	7.106	7.604	0.6256	0.6297	0.6277	\N	7.51	1.56	1.21	\N	1.39	\N	\N	\N	2025-06-06 00:00:00	2025-06-06 00:00:00
283	187	1	7	6	1	2025-06-03	2025-06-03	7.167	6.968	0.6257	0.6304	0.6281	7.524	7.76	\N	\N	\N	\N	\N	\N	\N	2025-06-03 00:00:00	2025-06-03 00:00:00
284	190	2	4	3	2	2025-06-19	2025-06-19	7.609	7.509	0.632	0.6242	0.6281	7.502	8.19	\N	\N	\N	\N	\N	\N	\N	2025-06-19 00:00:00	2025-06-19 00:00:00
285	168	1	13	3	1	2025-02-07	2025-02-07	8.002	7.786	0.6288	0.6275	0.6282	8.437	7.77	\N	\N	\N	\N	\N	\N	\N	2025-02-07 00:00:00	2025-02-07 00:00:00
287	185	1	13	3	6	2025-06-05	2025-06-06	7.294	7.434	0.6302	0.628	0.6291	7.52	7.65	3.16	0.96	4.04	2.72	\N	\N	\N	2025-06-05 00:00:00	2025-06-05 00:00:00
290	177	1	13	3	1	2025-04-09	2025-04-09	7.333	7.513	0.6342	0.6246	0.6294	7.507	8.29	0.62	8.99	1.75	3.79	\N	\N	\N	2025-04-09 00:00:00	2025-04-09 00:00:00
291	176	1	13	3	8	2025-04-03	2025-04-03	7.861	7.362	0.6371	0.6219	0.6295000000000001	7.833	7.51	10.66	0.56	0.28	3.83	\N	\N	\N	2025-04-03 00:00:00	2025-04-03 00:00:00
292	168	1	13	3	4	2025-02-08	2025-02-08	6.971	6.18	0.6302	0.6294	0.6297999999999999	8.679	8.12	\N	\N	\N	\N	\N	\N	\N	2025-02-08 00:00:00	2025-02-08 00:00:00
294	189	2	4	3	2	2025-06-12	2025-06-12	7.808	7.514	0.6373	0.6225	0.6299	7.99	8.26	\N	\N	\N	\N	\N	\N	\N	2025-06-12 00:00:00	2025-06-12 00:00:00
295	168	1	13	3	8	2025-02-08	2025-02-10	7.179	7.829	0.6283	0.6318	0.6301	7.526	8.17	\N	\N	\N	\N	\N	\N	\N	2025-02-08 00:00:00	2025-02-08 00:00:00
296	190	1	13	3	10	2025-07-10	2025-07-10	7.311	7.461	0.6303	0.6297999999999999	0.6301	\N	7.99	0.64	1.62	1.17	1.14	\N	\N	\N	2025-07-10 00:00:00	2025-07-10 00:00:00
297	192	1	13	3	10	2025-07-25	2025-07-25	7.474	7.078	0.6271	0.6338	0.6305	\N	7.91	0.93	1.51	3.23	1.89	\N	\N	\N	2025-07-25 00:00:00	2025-07-25 00:00:00
298	193	1	13	3	10	2025-08-01	2025-08-04	\N	\N	0.6305	0.6307	0.6306	\N	7.63	3.08	1.92	1.23	2.08	\N	\N	\N	2025-08-01 00:00:00	2025-08-01 00:00:00
299	185	1	13	3	4	2025-06-05	2025-06-05	7.451	7.781	0.6344	0.6269	0.6307	7.786	7.39	1.43	1.16	2.56	1.72	\N	\N	\N	2025-06-05 00:00:00	2025-06-05 00:00:00
301	171	2	4	3	1	2025-02-07	2025-02-07	7.108	7.748	0.6331	0.6286999999999999	0.6309	7.716	8.25	\N	\N	\N	\N	\N	\N	\N	2025-02-07 00:00:00	2025-02-07 00:00:00
304	168	1	13	3	9	2025-02-08	2025-01-02	7.131	7.628	0.6364	0.6265999999999999	0.6315	7.727	7.95	\N	\N	\N	\N	\N	\N	\N	2025-02-08 00:00:00	2025-02-08 00:00:00
305	187	1	13	3	1	2025-06-19	2025-06-19	7.34	7.62	0.6315	0.6315999999999999	0.6315999999999999	7.714	7.89	2.15	6.46	0.15	2.92	\N	\N	\N	2025-06-19 00:00:00	2025-06-19 00:00:00
306	176	1	13	3	4	2025-04-02	2025-04-02	7.113	7.449	0.6388	0.6247	0.6318	7.67	7.56	0.17	2.07	11.05	4.43	\N	\N	\N	2025-04-02 00:00:00	2025-04-02 00:00:00
307	177	1	13	3	6	2025-04-10	2025-04-10	8.347	7.215	0.624	0.6395000000000001	0.6318	7.579	7.96	0.47	12.48	0.22	4.39	\N	\N	\N	2025-04-10 00:00:00	2025-04-10 00:00:00
308	176	1	13	3	9	2025-04-03	2025-04-03	7.344	7.229	0.632	0.6315999999999999	0.6318	8.338	7.54	9.88	0.26	0.41	3.52	\N	\N	\N	2025-04-03 00:00:00	2025-04-03 00:00:00
263	177	1	13	3	5	2025-04-10	2025-04-10	7.836	7.638	0.6171	0.6307	0.624	\N	7.82	1.31	0.22	0.45	0.66	0.26669	\N	\N	2025-04-10 00:00:00	2025-12-26 19:42:37.967954
286	179	1	13	3	5	2025-04-23	2025-04-23	8.618	7.423	0.6329	0.6244	0.629	7.789	7.7	0.42	2.19	4.79	2.467	0.27236	\N	\N	2025-04-23 00:00:00	2025-12-26 19:42:38.041055
293	187	1	13	3	5	2025-06-19	2025-06-19	7.583	7.432	0.6193	0.6403	0.63	7.568	7.5	2.29	0.37	8.12	3.593	0.25428999999999996	\N	\N	2025-06-19 00:00:00	2025-12-26 19:42:38.616942
269	188	1	13	3	5	2025-06-25	2025-06-25	7.702	7.383	0.6391	0.6115999999999999	0.625	7.546	7.58	0.38	0.77	4.01	1.72	0.24129	\N	\N	2025-06-25 00:00:00	2025-12-26 19:42:38.680118
277	188	1	13	3	8	2025-06-26	2025-06-26	7.586	7.396	0.6297	0.6227	0.626	7.608	7.5	1.85	2.56	1.26	1.89	0.24711	\N	\N	2025-06-26 00:00:00	2025-12-26 19:42:38.689304
262	189	2	4	7	1	2025-06-10	2025-06-11	7.815	7.203	0.6275999999999999	0.6199	0.624	7.803	8.21	\N	\N	\N	\N	0.09101000000000001	\N	\N	2025-06-10 00:00:00	2025-12-26 19:42:38.732786
300	190	1	13	3	9	2025-07-10	2025-07-10	7.295	7.458	0.6343	0.6273	0.631	\N	8.06	0.82	0.88	1.91	1.203	0.22432	\N	\N	2025-07-10 00:00:00	2025-12-26 19:42:38.845985
278	196	2	4	7	1	2025-07-29	2025-07-29	7.654	7.492	0.6235	0.6295000000000001	0.627	7.508	7.69	\N	\N	\N	\N	0.25782	\N	\N	2025-07-29 00:00:00	2025-12-26 19:42:39.178145
288	193	1	13	3	3	2025-07-31	2025-08-01	7.46	7.474	0.6229	0.6356	0.629	\N	7.99	1.82	2.03	0.65	1.5	0.20626999999999998	\N	\N	2025-07-31 00:00:00	2025-12-26 19:42:39.196604
275	193	1	13	3	8	2025-08-01	2025-08-04	7.26	7.244	0.6231	0.6286999999999999	0.626	7.893	7.17	2.2	0.22	4.1	2.173	0.22748	\N	\N	2025-08-01 00:00:00	2025-12-26 19:42:39.198507
273	194	1	13	3	1	2025-08-06	2025-08-06	7.503	7.961	0.6247	0.627	0.626	7.671	8.02	1.45	2.05	0.79	1.43	0.23925000000000002	\N	\N	2025-08-06 00:00:00	2025-12-26 19:42:39.210748
280	194	1	13	3	2	2025-08-06	2025-08-06	7.883	7.947	0.6277	0.6267	0.627	7.792	7.76	0.72	1.02	0.64	0.793	0.24166	\N	\N	2025-08-06 00:00:00	2025-12-26 19:42:39.218573
303	196	1	7	6	1	2025-08-05	2025-08-05	7.978	7.972	0.6406000000000001	0.6217	0.631	\N	\N	\N	\N	\N	\N	0.21483000000000002	\N	\N	2025-08-05 00:00:00	2025-12-26 19:42:39.26119
1353	169	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.019	2025-12-26 19:49:28.763237	2025-12-26 19:49:28.765678
309	179	2	4	7	1	2025-04-01	2025-04-01	7.05	7.411	0.6455	0.6182	0.6319	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-01 00:00:00	2025-04-01 00:00:00
311	168	1	13	3	2	2025-02-07	2025-02-07	7.263	7.925	0.6351	0.6286999999999999	0.6319	8.035	7.82	\N	\N	\N	\N	\N	\N	\N	2025-02-07 00:00:00	2025-02-07 00:00:00
312	177	1	13	3	4	2025-04-09	2025-04-09	7.929	7.684	0.6461	0.6177	0.6319	8.14	7.847	4.67	6.31	2.14	4.37	\N	\N	\N	2025-04-09 00:00:00	2025-04-09 00:00:00
313	169	1	13	3	5	2025-02-14	2025-02-15	\N	\N	0.6354	0.6292	0.6323	\N	7.96	5.75	0.97	0.68	2.47	\N	\N	\N	2025-02-14 00:00:00	2025-02-14 00:00:00
315	190	1	13	3	1	2025-07-09	2025-07-09	7.842	7.67	0.635	0.63	0.6325	7.502	8.08	0.24	1.1	3.01	1.45	\N	\N	\N	2025-07-09 00:00:00	2025-07-09 00:00:00
318	179	1	13	3	4	2025-04-23	2025-04-23	7.572	7.878	0.6461	0.6213000000000001	0.6336999999999999	7.653	7.79	3.54	3.52	3.86	3.64	\N	\N	\N	2025-04-23 00:00:00	2025-04-23 00:00:00
321	176	1	13	3	3	2025-04-02	2025-04-02	8.169	7.809	0.6459999999999999	0.6233	0.6347	7.79	7.62	0.7	0.53	6.74	2.66	\N	\N	\N	2025-04-02 00:00:00	2025-04-02 00:00:00
322	186	1	13	3	1	2025-06-12	2025-06-12	7.094	7.277	0.6285000000000001	0.6408	0.6347	7.527	7.52	1.06	11.24	2.18	4.83	\N	\N	\N	2025-06-12 00:00:00	2025-06-12 00:00:00
323	179	1	13	3	2	2025-04-23	2025-04-23	7.472	7.22	0.6467	0.6225999999999999	0.6347	7.883	7.75	0.68	2.25	10	4.31	\N	\N	\N	2025-04-23 00:00:00	2025-04-23 00:00:00
325	188	1	13	3	1	2025-06-25	2025-06-25	7.39	7.311	0.6515000000000001	0.6183	0.6349	7.679	7.88	2.35	1.68	0.95	1.66	\N	\N	\N	2025-06-25 00:00:00	2025-06-25 00:00:00
326	168	1	13	3	5	2025-02-08	2025-02-08	7.534	7.433	0.6426000000000001	0.6277	0.6352	7.687	7.89	\N	\N	\N	\N	\N	\N	\N	2025-02-08 00:00:00	2025-02-08 00:00:00
1354	169	1	13	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.018	2025-12-26 19:49:28.771576	2025-12-26 19:49:28.773762
330	168	1	13	3	6	2025-02-08	2025-02-08	7.267	7.916	0.6342	0.6365	0.6354	7.513	7.9	\N	\N	\N	\N	\N	\N	\N	2025-02-08 00:00:00	2025-02-08 00:00:00
332	176	1	13	3	1	2025-04-02	2025-04-02	7.543	7.316	0.6429	0.6297999999999999	0.6364	7.782	7.68	0.87	0.46	1.28	0.87	\N	\N	\N	2025-04-02 00:00:00	2025-04-02 00:00:00
334	177	1	13	3	2	2025-04-09	2025-04-09	7.625	7.817	0.6472	0.6259	0.6365999999999999	8.055	7.85	10.17	9.7	0.17	6.68	\N	\N	\N	2025-04-09 00:00:00	2025-04-09 00:00:00
336	190	1	13	3	7	2025-07-10	2025-07-10	7.038	7.134	0.6332	0.6403	0.6368	7.749	8.08	0.47	0.37	0.44	0.43	\N	\N	\N	2025-07-10 00:00:00	2025-07-10 00:00:00
337	169	1	13	3	9	2025-02-15	2025-02-15	6.262	7.914	0.6424	0.6313	0.6369	\N	7.94	3.73	2.97	1.05	2.58	\N	\N	\N	2025-02-15 00:00:00	2025-02-15 00:00:00
338	170	1	7	6	1	2025-02-05	2025-02-06	6.157	6.864	0.6351	0.6389	0.637	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-05 00:00:00	2025-02-05 00:00:00
340	179	1	13	3	6	2025-04-23	2025-04-24	\N	\N	0.6445000000000001	0.6309	0.6377	\N	7.84	2.17	1.4	3.23	2.27	\N	\N	\N	2025-04-23 00:00:00	2025-04-23 00:00:00
349	192	1	13	3	4	2025-07-24	2025-07-24	7.534	8.066	0.64	0.6378	0.6389	\N	7.87	0.98	0.92	5.05	2.32	\N	\N	\N	2025-07-24 00:00:00	2025-07-24 00:00:00
350	188	1	13	3	10	2025-06-26	2025-06-26	7.632	7.232	0.6393	0.6386999999999999	0.639	7.515	7.48	0.93	1.51	2.98	1.81	\N	\N	\N	2025-06-26 00:00:00	2025-06-26 00:00:00
351	188	1	13	3	4	2025-06-25	2025-06-25	7.654	7.636	0.6537000000000001	0.6245	0.6391	7.584	7.55	1.01	0.58	2.18	1.26	\N	\N	\N	2025-06-25 00:00:00	2025-06-25 00:00:00
352	176	1	13	3	7	2025-04-03	2025-04-03	7.334	7.012	0.6342	0.6444	0.6393	7.622	7.81	0.18	0.38	0.56	0.37	\N	\N	\N	2025-04-03 00:00:00	2025-04-03 00:00:00
353	180	1	13	3	2	2025-04-30	2025-04-30	7.237	7.251	0.6459	0.633	0.6395000000000001	7.831	7.86	2.63	0.22	0.97	1.27	\N	\N	\N	2025-04-30 00:00:00	2025-04-30 00:00:00
343	179	1	13	3	3	2025-04-23	2025-04-23	7.616	7.466	0.6498999999999999	0.6261	0.638	8.061	7.84	0.17	0.81	0.52	0.5	0.27563	\N	\N	2025-04-23 00:00:00	2025-12-26 19:42:38.038634
317	185	1	13	3	5	2025-06-05	2025-06-05	7.222	7.134	0.6302	0.6356	0.633	7.53	7.58	1.56	0.99	1.95	1.5	0.23966	\N	\N	2025-06-05 00:00:00	2025-12-26 19:42:38.550474
335	186	1	13	3	8	2025-06-13	2025-06-13	7.277	7.43	0.6368	0.6365	0.637	7.54	7.62	3.71	0.36	1.35	1.807	0.28351	\N	\N	2025-06-13 00:00:00	2025-12-26 19:42:38.577665
333	189	1	13	3	8	2025-07-04	2025-07-04	7.373	7.268	0.6422	0.6308	0.637	\N	7.95	2.4	1.56	0.33	1.43	0.23487	\N	\N	2025-07-04 00:00:00	2025-12-26 19:42:38.764883
339	190	1	13	3	3	2025-07-09	2025-07-10	7.375	7.55	0.6323	0.6425	0.637	7.574	8.12	0.18	0.26	1.35	0.597	0.23373	\N	\N	2025-07-09 00:00:00	2025-12-26 19:42:38.831019
344	192	1	13	3	2	2025-07-24	2025-07-24	6.871	7.249	0.638	0.6384000000000001	0.638	7.569	7.65	1.2	0.39	11.28	4.29	0.27535	\N	\N	2025-07-24 00:00:00	2025-12-26 19:42:38.976139
329	192	1	13	3	3	2025-07-24	2025-07-24	7.852	8.072	0.6341	0.6364	0.635	7.365	7.81	0.77	0.57	7.72	3.02	0.26675	\N	\N	2025-07-24 00:00:00	2025-12-26 19:42:38.978286
331	192	1	13	3	5	2025-07-24	2025-07-24	7.255	8.214	0.6305	0.6406999999999999	0.636	\N	7.89	1.23	0.99	4.08	2.1	0.24953000000000003	\N	\N	2025-07-24 00:00:00	2025-12-26 19:42:38.983986
327	192	1	13	3	9	2025-07-25	2025-07-25	7.731	7.616	0.6379	0.6324000000000001	0.635	7.713	7.61	1.01	1.38	3.43	1.94	0.19512000000000002	\N	\N	2025-07-25 00:00:00	2025-12-26 19:42:38.991353
316	195	2	4	3	1	2025-07-23	2025-07-23	7.473	7.216	0.6419	0.6236	0.633	7.622	7.33	\N	\N	\N	\N	0.22293000000000002	\N	\N	2025-07-23 00:00:00	2025-12-26 19:42:39.149607
345	193	1	13	3	6	2025-07-31	2025-08-01	7.503	7.257	0.6406999999999999	0.6357	0.638	\N	7.99	1.44	0.79	0.52	0.917	0.22646	\N	\N	2025-07-31 00:00:00	2025-12-26 19:42:39.200407
341	193	1	13	3	7	2025-08-01	2025-08-01	7.691	7.883	0.6434000000000001	0.6322	0.638	7.585	7.95	9.1	5.64	0.79	5.177	0.21954	\N	\N	2025-08-01 00:00:00	2025-12-26 19:42:39.202649
320	194	1	13	3	6	2025-08-06	2025-08-07	7.428	7.129	0.6347999999999999	0.6343	0.635	7.582	7.99	6.4	2.83	0.82	3.35	0.21905000000000002	\N	\N	2025-08-06 00:00:00	2025-12-26 19:42:39.220434
319	194	1	13	3	3	2025-08-06	2025-08-06	7.334	7.978	0.6351	0.6339	0.635	7.553	7.42	1.37	1.49	0.64	1.167	0.23875	\N	\N	2025-08-06 00:00:00	2025-12-26 19:42:39.222278
324	195	1	13	3	8	2025-08-14	2025-08-15	6.352	7.131	0.6372	0.6322	0.635	\N	7.89	1.52	1.03	0.56	1.037	0.22963999999999996	\N	\N	2025-08-14 00:00:00	2025-12-26 19:42:39.230794
342	195	1	13	3	6	2025-08-14	2025-08-14	7.505	7.592	0.6355	0.6405	0.638	\N	8.05	4.57	0.32	0.62	1.837	0.21417000000000003	\N	\N	2025-08-14 00:00:00	2025-12-26 19:42:39.232963
348	195	1	13	3	9	2025-08-15	2025-08-15	7.228	7.433	0.6404000000000001	0.6373	0.639	7.696	7.47	6.01	0.95	1.03	2.663	0.20796	\N	\N	2025-08-15 00:00:00	2025-12-26 19:42:39.237477
347	195	1	13	3	10	2025-08-15	2025-08-15	7.423	6.69	0.6385000000000001	0.6386999999999999	0.639	\N	7.99	13.21	1.09	0.95	5.083	0.23035	\N	\N	2025-08-15 00:00:00	2025-12-26 19:42:39.24361
310	195	1	13	3	5	2025-08-14	2025-08-14	6.867	6.407	0.6314	0.6323	0.632	7.676	8.31	2.89	0.85	1.03	1.59	0.21101000000000003	\N	\N	2025-08-14 00:00:00	2025-12-26 19:42:39.245563
1356	170	1	13	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.019	2025-12-26 19:49:28.802486	2025-12-26 19:49:28.80409
1362	174	1	13	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.018	2025-12-26 19:49:28.905722	2025-12-26 19:49:28.907106
355	192	1	13	3	6	2025-07-24	2025-07-24	7.417	7.033	0.638	0.6426999999999999	0.6404000000000001	\N	8.01	0.95	0.78	3.24	1.66	\N	\N	\N	2025-07-24 00:00:00	2025-07-24 00:00:00
359	198	1	13	3	10	2025-09-04	2025-09-05	7.129	7.134	0.6456000000000001	0.6389	0.6423000000000001	7.607	7.98	1.12	2.56	0.87	1.52	\N	\N	\N	2025-09-04 00:00:00	2025-09-04 00:00:00
360	179	1	13	3	7	2025-04-24	2025-04-24	7.925	7.4	0.6383	0.6464	0.6424	7.622	7.95	2.21	0.23	1.39	1.28	\N	\N	\N	2025-04-24 00:00:00	2025-04-24 00:00:00
362	169	1	13	3	8	2025-02-15	2025-02-15	6.805	7.104	0.6474	0.6377	0.6426000000000001	\N	7.95	5.35	0.79	0.67	2.27	\N	\N	\N	2025-02-15 00:00:00	2025-02-15 00:00:00
365	198	1	13	3	4	2025-09-03	2025-09-03	7.147	7.446	0.6431999999999999	0.6428	0.643	7.817	7.76	1.87	5.89	1.16	2.97	\N	\N	\N	2025-09-03 00:00:00	2025-09-03 00:00:00
366	192	1	13	3	1	2025-07-24	2025-07-24	7.4	7.34	0.643	0.6434000000000001	0.6431999999999999	7.694	8.15	0.35	0.75	4.17	1.76	\N	\N	\N	2025-07-24 00:00:00	2025-07-24 00:00:00
367	179	1	13	3	8	2025-04-24	2025-04-24	7.417	7.342	0.6431999999999999	0.6433	0.6433	8.122	7.79	7.59	0.28	1.95	3.27	\N	\N	\N	2025-04-24 00:00:00	2025-04-24 00:00:00
368	179	1	13	3	1	2025-04-23	2025-04-23	7.794	7.458	0.6542	0.6325	0.6434000000000001	7.503	8.07	0.61	0.52	0.11	0.41	\N	\N	\N	2025-04-23 00:00:00	2025-04-23 00:00:00
1357	172	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.019	2025-12-26 19:49:28.832129	2025-12-26 19:49:28.834582
371	169	1	13	3	1	2025-02-14	2025-02-14	1.844	1.863	0.6556000000000001	0.6324000000000001	0.644	8.855	8.21	3.11	5.49	0.67	3.09	\N	\N	\N	2025-02-14 00:00:00	2025-02-14 00:00:00
374	168	1	13	3	7	2025-02-08	2025-02-10	7.185	6.888	0.6461	0.6420999999999999	0.6441	7.796	7.88	\N	\N	\N	\N	\N	\N	\N	2025-02-08 00:00:00	2025-02-08 00:00:00
379	186	1	13	3	7	2025-06-13	2025-06-13	7.118	7.456	0.6428	0.647	0.6448999999999999	7.746	7.96	6.97	0.24	2.19	3.13	\N	\N	\N	2025-06-13 00:00:00	2025-06-13 00:00:00
380	178	1	7	6	1	2025-04-01	2025-04-01	7.262	7.955	0.6463	0.6441	0.6452	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-01 00:00:00	2025-04-01 00:00:00
381	190	1	13	3	6	2025-07-10	2025-07-10	7.959	7.555	0.6452	0.6454000000000001	0.6453	\N	8.05	0.48	1.39	1.68	1.18	\N	\N	\N	2025-07-10 00:00:00	2025-07-10 00:00:00
950	176	1	8	2	1	2025-03-20	2025-03-20	7.77	7.791	0.7653	0.7635	0.764	7.644	8.29	2.44	1.94	7.97	4.117	0.10189999999999999	0.004	0.019	2025-03-20 00:00:00	2025-12-26 19:49:28.889241
385	180	1	13	3	1	2025-04-30	2025-04-30	7.922	7.42	0.6467	0.6457999999999999	0.6463	7.539	7.99	1.81	3	10.05	4.95	\N	\N	\N	2025-04-30 00:00:00	2025-04-30 00:00:00
386	173	1	7	6	1	2025-02-25	2025-02-25	6.819	6.877	0.6539	0.6391	0.6465000000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-25 00:00:00	2025-02-25 00:00:00
389	193	1	13	3	1	2025-07-31	2025-07-31	7.635	7.477	0.6442	0.6505	0.6474	7.748	7.95	8.97	0.7	1.1	3.59	\N	\N	\N	2025-07-31 00:00:00	2025-07-31 00:00:00
390	194	1	13	3	9	2025-08-07	2025-08-07	7.287	7.896	0.6487999999999999	0.6464	0.6476000000000001	7.947	7.99	0.65	0.2	0.83	0.56	\N	\N	\N	2025-08-07 00:00:00	2025-08-07 00:00:00
391	186	1	13	3	10	2025-06-13	2025-06-13	\N	\N	0.6464	0.6502	0.6483	\N	7.68	4.52	0.51	1.35	2.13	\N	\N	\N	2025-06-13 00:00:00	2025-06-13 00:00:00
395	188	1	13	3	6	2025-06-26	2025-06-26	7.905	7.399	0.6468	0.6525	0.6496999999999999	7.596	7.58	1.56	2.13	0.94	1.54	\N	\N	\N	2025-06-26 00:00:00	2025-06-26 00:00:00
398	191	1	13	3	10	2025-07-17	2025-07-17	7.509	7.759	0.6545000000000001	0.6481999999999999	0.6514	7.505	7.97	14.18	0.69	0.38	5.08	\N	\N	\N	2025-07-17 00:00:00	2025-07-17 00:00:00
394	169	1	13	3	3	2025-02-14	2025-02-14	7.153	7.535	0.6648999999999999	0.6336999999999999	0.649	7.548	7.97	2.21	1.31	0.5	1.34	0.24301999999999999	\N	\N	2025-02-14 00:00:00	2025-12-26 19:42:37.401409
373	170	1	13	3	1	2025-02-21	2025-02-21	7.148	7.44	0.643	0.6451	0.644	8.081	7.92	6.65	1.35	3.13	3.71	0.23144999999999996	\N	\N	2025-02-21 00:00:00	2025-12-26 19:42:37.461362
396	170	1	13	3	5	2025-02-21	2025-02-21	7.017	7.02	0.6509	0.6487999999999999	0.65	7.594	7.3	0.53	4.18	5.23	3.313	0.23535	\N	\N	2025-02-21 00:00:00	2025-12-26 19:42:37.469025
378	180	1	7	5	1	2025-04-14	2025-04-14	7.095	7.796	0.6514	0.6374	0.644	7.64	8.34	\N	\N	\N	\N	0.21592	\N	\N	2025-04-14 00:00:00	2025-12-26 19:42:38.066787
384	188	1	13	3	2	2025-06-25	2025-06-25	7.363	7.496	0.6567000000000001	0.6355	0.646	7.817	7.57	0.98	0.18	0.26	0.473	0.23873999999999995	\N	\N	2025-06-25 00:00:00	2025-12-26 19:42:38.672652
361	188	1	13	3	9	2025-06-26	2025-06-26	7.249	7.381	0.6425	0.6422	0.642	7.499	7.68	0.85	0.92	5.04	2.27	0.17565999999999998	\N	\N	2025-06-26 00:00:00	2025-12-26 19:42:38.691196
388	189	1	13	3	9	2025-07-04	2025-07-04	7.53	7.359	0.6454000000000001	0.6492	0.647	7.801	8.02	2.5	0.6	0.85	1.317	0.19625000000000004	\N	\N	2025-07-04 00:00:00	2025-12-26 19:42:38.766766
375	190	2	4	3	1	2025-06-18	2025-06-19	7.276	7.425	0.6397999999999999	0.6484000000000001	0.644	7.763	8.26	\N	\N	\N	\N	0.30154	\N	\N	2025-06-18 00:00:00	2025-12-26 19:42:38.814564
372	190	1	13	3	2	2025-07-09	2025-07-09	7.498	7.363	0.6437	0.6443000000000001	0.644	7.745	8.03	0.44	3.51	0.48	1.477	0.29767	\N	\N	2025-07-09 00:00:00	2025-12-26 19:42:38.829127
387	191	2	4	3	1	2025-06-26	2025-06-26	7.588	7.946	0.6448	0.6484000000000001	0.647	7.844	7.99	\N	\N	\N	\N	0.23107000000000003	\N	\N	2025-06-26 00:00:00	2025-12-26 19:42:38.892797
358	192	1	13	3	8	2025-07-25	2025-07-25	7.344	7.607	0.6437	0.6396000000000001	0.642	7.587	8.19	0.85	2.37	3.04	2.087	0.23166000000000003	\N	\N	2025-07-25 00:00:00	2025-12-26 19:42:38.989464
376	193	1	7	5	1	2025-07-12	2025-07-14	7.65	7.434	0.6561	0.6325	0.644	6.534	8.18	\N	\N	\N	\N	0.25297000000000003	\N	\N	2025-07-12 00:00:00	2025-12-26 19:42:39.034141
393	193	1	13	3	2	2025-07-31	2025-07-31	7.244	7.343	0.6472	0.6513	0.649	7.742	7.46	10.64	0.79	1.25	4.227	0.18389	\N	\N	2025-07-31 00:00:00	2025-12-26 19:42:39.048693
370	193	1	13	3	5	2025-07-31	2025-07-31	7.144	7.223	0.6425	0.6445000000000001	0.643	8.055	7.4	9.81	0.75	1.17	3.91	0.22737000000000002	\N	\N	2025-07-31 00:00:00	2025-12-26 19:42:39.204692
356	194	1	13	3	8	2025-08-07	2025-08-07	7.639	7.82	0.6402	0.6406999999999999	0.64	7.513	8.17	5.47	0.3	0.43	2.067	0.2097	\N	\N	2025-08-07 00:00:00	2025-12-26 19:42:39.212697
383	194	1	13	3	10	2025-08-07	2025-08-08	7.258	7.629	0.6459	0.6461	0.646	\N	8.08	0.85	1.16	1.79	1.267	0.24309000000000003	\N	\N	2025-08-07 00:00:00	2025-12-26 19:42:39.216479
354	194	1	13	3	7	2025-08-06	2025-08-07	7.163	7.93	0.6386999999999999	0.6406999999999999	0.64	7.607	7.49	10.8	1.21	0.32	4.11	0.25653	\N	\N	2025-08-06 00:00:00	2025-12-26 19:42:39.224106
377	195	1	13	3	7	2025-08-14	2025-08-14	6.626	7.255	0.6424	0.6462	0.644	\N	7.99	1.07	1.09	1.71	1.29	0.20842999999999998	\N	\N	2025-08-14 00:00:00	2025-12-26 19:42:39.23538
364	195	1	13	3	1	2025-08-13	2025-08-13	6.8	7.115	0.6459999999999999	0.64	0.643	7.665	7.65	0.52	1.67	2.54	1.577	0.17306000000000002	\N	\N	2025-08-13 00:00:00	2025-12-26 19:42:39.251337
397	196	1	13	3	8	2025-08-21	2025-08-21	1.352	7.261	0.6485	0.6518	0.65	7.744	7.66	0.52	7.21	0.87	2.867	0.23735	\N	\N	2025-08-21 00:00:00	2025-12-26 19:42:39.280733
392	198	1	13	3	8	2025-09-04	2025-09-04	7	7.25	0.6437999999999999	0.6528	0.648	7.558	7.95	0.98	4.26	2.87	2.703	0.23276	\N	\N	2025-09-04 00:00:00	2025-12-26 19:42:39.439701
363	198	1	13	3	6	2025-09-03	2025-09-04	7.056	7.107	0.6423000000000001	0.6434000000000001	0.643	7.584	7.89	0.95	2.56	3.21	2.24	0.22976	\N	\N	2025-09-03 00:00:00	2025-12-26 19:42:39.441482
402	198	1	13	3	3	2025-09-03	2025-09-03	7.438	7.049	0.6481999999999999	0.6555	0.6518999999999999	7.728	7.76	3.59	8.04	1.67	4.43	\N	\N	\N	2025-09-03 00:00:00	2025-09-03 00:00:00
404	169	1	13	3	4	2025-02-14	2025-02-14	7.314	7.227	0.6553	0.6491	0.6522	7.937	7.96	4.14	0.39	0.68	1.74	\N	\N	\N	2025-02-14 00:00:00	2025-02-14 00:00:00
406	198	1	13	3	1	2025-09-03	2025-09-03	7.368	7.932	0.6553	0.6496999999999999	0.6525	7.574	7.76	1.09	8.09	1.14	3.44	\N	\N	\N	2025-09-03 00:00:00	2025-09-03 00:00:00
407	179	1	7	6	1	2025-04-08	2025-04-08	7.215	7.883	0.6603	0.6453	0.6528	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-08 00:00:00	2025-04-08 00:00:00
408	195	2	4	3	2	2025-07-23	2025-07-24	7.319	7.286	0.6625	0.6434000000000001	0.653	7.947	7.69	\N	\N	\N	\N	\N	\N	\N	2025-07-23 00:00:00	2025-07-23 00:00:00
412	189	1	13	3	7	2025-07-04	2025-07-04	7.422	7.302	0.648	0.6595	0.6537999999999999	7.704	8.02	1.15	1.29	0.98	1.14	\N	\N	\N	2025-07-04 00:00:00	2025-07-04 00:00:00
413	180	1	13	3	4	2025-04-30	2025-04-30	7.27	7.438	0.6543000000000001	0.6536	0.654	\N	7.89	5.42	1.46	4.26	3.71	\N	\N	\N	2025-04-30 00:00:00	2025-04-30 00:00:00
417	191	1	7	6	1	2025-07-01	2025-07-01	7.821	7.322	0.6701	0.6404000000000001	0.6553	7.65	7.15	\N	\N	\N	\N	\N	\N	\N	2025-07-01 00:00:00	2025-07-01 00:00:00
418	190	1	13	3	4	2025-07-09	2025-07-09	7.531	7.54	0.6573	0.6537000000000001	0.6555	7.677	7.95	3.41	0.3	3.17	2.29	\N	\N	\N	2025-07-09 00:00:00	2025-07-09 00:00:00
420	189	1	13	3	10	2025-07-04	2025-07-04	7.512	7.805	0.6618999999999999	0.6501	0.6559999999999999	\N	8.03	11.03	1.63	0.51	4.39	\N	\N	\N	2025-07-04 00:00:00	2025-07-04 00:00:00
1360	173	1	13	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.018	2025-12-26 19:49:28.873327	2025-12-26 19:49:28.874779
1361	174	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.018	2025-12-26 19:49:28.90033	2025-12-26 19:49:28.901669
429	189	1	13	3	4	2025-07-03	2025-07-03	7.901	7.355	0.6507	0.6663	0.6585	7.457	8.14	1.24	1.44	4.97	2.55	\N	\N	\N	2025-07-03 00:00:00	2025-07-03 00:00:00
432	182	2	4	7	1	2025-04-21	2025-04-21	7.731	7.317	0.6511	0.6681	0.6596	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-21 00:00:00	2025-04-21 00:00:00
434	198	1	13	3	2	2025-09-03	2025-09-03	7.306	7.205	0.6568999999999999	0.6633	0.6601	7.615	7.98	0.95	1.55	0.68	1.06	\N	\N	\N	2025-09-03 00:00:00	2025-09-03 00:00:00
436	189	1	13	3	6	2025-07-03	2025-07-04	7.961	7.792	0.6617000000000001	0.6597	0.6607	7.56	7.87	5.67	1.62	0.66	2.65	\N	\N	\N	2025-07-03 00:00:00	2025-07-03 00:00:00
438	191	1	13	3	7	2025-07-17	2025-07-17	7.324	7.577	0.6713	0.6531999999999999	0.6623	7.561	8.11	0.38	0.44	2.8	1.21	\N	\N	\N	2025-07-17 00:00:00	2025-07-17 00:00:00
439	191	1	13	3	6	2025-07-16	2025-07-16	7.817	7.767	0.655	0.67	0.6625	\N	7.96	1.23	1.17	0.68	1.03	\N	\N	\N	2025-07-16 00:00:00	2025-07-16 00:00:00
443	186	1	13	3	6	2025-06-12	2025-06-13	7.374	7.118	0.6597	0.6667000000000001	0.6631999999999999	7.72	7.66	0.45	0.48	0.51	0.48	\N	\N	\N	2025-06-12 00:00:00	2025-06-12 00:00:00
433	170	1	13	3	4	2025-02-21	2025-02-21	7.755	7.155	0.66	0.66	0.66	7.681	7.48	2.81	1.1	0.81	1.573	0.25115	\N	\N	2025-02-21 00:00:00	2025-12-26 19:42:37.467161
422	170	1	13	3	8	2025-02-22	2025-02-22	6.978	7.375	0.6622	0.6520999999999999	0.657	7.669	7.5	1.45	0.25	3.08	1.593	0.22954	\N	\N	2025-02-22 00:00:00	2025-12-26 19:42:37.47459
423	170	1	13	3	9	2025-02-22	2025-02-24	7.324	7.017	0.6552	0.6598	0.657	\N	7.75	0.88	2.67	1.95	1.833	0.20123999999999997	\N	\N	2025-02-22 00:00:00	2025-12-26 19:42:37.476333
442	179	1	7	5	1	2025-04-04	2025-04-07	7.894	7.448	0.6624	0.6637000000000001	0.663	\N	\N	\N	\N	\N	\N	0.299	\N	\N	2025-04-04 00:00:00	2025-12-26 19:42:38.017314
410	180	1	13	3	5	2025-04-30	2025-04-30	7.248	7.384	0.6636	0.6434000000000001	0.653	\N	7.91	7.2	1.31	3.02	3.843	0.27799	\N	\N	2025-04-30 00:00:00	2025-12-26 19:42:38.085855
409	186	1	13	3	2	2025-06-12	2025-06-12	7.399	7.403	0.6537000000000001	0.6524	0.653	7.534	7.74	0.24	0.47	15.27	5.327	0.2526	\N	\N	2025-06-12 00:00:00	2025-12-26 19:42:38.561378
430	186	1	13	3	3	2025-06-12	2025-06-12	7.941	7.752	0.6592	0.6578	0.659	7.649	7.67	9.74	1.68	12.53	7.983	0.24552	\N	\N	2025-06-12 00:00:00	2025-12-26 19:42:38.563184
401	186	1	13	3	9	2025-06-13	2025-06-13	7.92	7.471	0.6531	0.6505	0.652	\N	7.74	2.98	0.95	2.74	2.223	0.18204	\N	\N	2025-06-13 00:00:00	2025-12-26 19:42:38.579463
424	189	1	13	3	2	2025-07-03	2025-07-03	7.699	7.761	0.6586	0.6568	0.658	7.494	8.24	1.62	1.16	12.09	4.957	0.24114000000000002	\N	\N	2025-07-03 00:00:00	2025-12-26 19:42:38.748542
414	189	1	13	3	3	2025-07-03	2025-07-03	7.593	7.29	0.6579	0.6502	0.654	7.558	7.99	1.65	1.52	2.22	1.797	0.28018	\N	\N	2025-07-03 00:00:00	2025-12-26 19:42:38.750373
416	190	1	13	3	5	2025-07-10	2025-07-10	7.477	7.236	0.6545000000000001	0.6554000000000001	0.655	7.691	8.08	15.36	1.49	1.32	6.057	0.26244	\N	\N	2025-07-10 00:00:00	2025-12-26 19:42:38.836775
415	191	1	13	3	2	2025-07-16	2025-07-16	7.315	7.668	0.6577	0.6518	0.655	7.916	8.09	0.58	0.36	0.49	0.477	0.25214	\N	\N	2025-07-16 00:00:00	2025-12-26 19:42:38.903325
428	191	1	13	3	3	2025-07-16	2025-07-16	7.334	7.864	0.6559999999999999	0.6605	0.658	7.733	7.94	0.86	0.57	0.58	0.67	0.26089	\N	\N	2025-07-16 00:00:00	2025-12-26 19:42:38.905095
411	191	1	13	3	9	2025-07-17	2025-07-17	7.836	7.618	0.6585	0.6485	0.653	7.649	7.31	0.83	1.02	1.48	1.11	0.17434000000000002	\N	\N	2025-07-17 00:00:00	2025-12-26 19:42:38.919543
399	194	1	13	3	5	2025-08-06	2025-08-06	7.39	7.417	0.6487999999999999	0.6541	0.651	7.685	7.79	0.85	1.03	0.79	0.89	0.22158	\N	\N	2025-08-06 00:00:00	2025-12-26 19:42:39.208593
435	195	1	13	3	3	2025-08-14	2025-08-14	6.21	6.324	0.6668000000000001	0.6536	0.66	7.662	7.99	3.61	0.12	0.13	1.287	0.21248	\N	\N	2025-08-14 00:00:00	2025-12-26 19:42:39.24147
441	195	1	10	2	1	2025-08-04	2025-08-04	6.935	6.638	0.6602	0.6658	0.663	6.611	7.74	4.76	4.12	1.44	3.44	0.20209	\N	\N	2025-08-04 00:00:00	2025-12-26 19:42:39.24744
426	196	1	13	3	2	2025-08-20	2025-08-20	7.148	7.166	0.6615000000000001	0.6544	0.658	7.538	7.73	0.41	0.72	0.75	0.627	0.23602000000000004	\N	\N	2025-08-20 00:00:00	2025-12-26 19:42:39.263084
400	196	1	13	3	7	2025-08-21	2025-08-21	7.536	7.561	0.6464	0.6567000000000001	0.652	7.518	7.83	0.27	0.34	0.67	0.427	0.24018	\N	\N	2025-08-21 00:00:00	2025-12-26 19:42:39.274801
440	196	1	7	5	1	2025-08-02	2025-08-04	7.761	7.82	0.6648999999999999	0.6609999999999999	0.663	7.491	7.54	\N	\N	\N	\N	0.23002999999999998	\N	\N	2025-08-02 00:00:00	2025-12-26 19:42:39.278834
431	196	1	13	3	3	2025-08-20	2025-08-20	7.833	7.497	0.6604000000000001	0.6584	0.659	\N	7.76	3.52	2.31	0.25	2.027	0.22094999999999998	\N	\N	2025-08-20 00:00:00	2025-12-26 19:42:39.282626
425	196	1	13	3	10	2025-08-21	2025-08-21	7.771	8.036	0.6606000000000001	0.6551	0.658	\N	7.73	0.53	4.38	0.74	1.883	0.006660000000000001	\N	\N	2025-08-21 00:00:00	2025-12-26 19:42:39.284489
437	197	1	13	3	9	2025-08-28	2025-08-28	7.56	7.218	0.6665000000000001	0.6578	0.662	\N	7.32	1.59	0.56	0.78	0.977	1.12459	\N	\N	2025-08-28 00:00:00	2025-12-26 19:42:39.332824
405	198	1	13	3	7	2025-09-04	2025-09-04	7.739	7.682	0.6437999999999999	0.6607999999999999	0.652	7.607	7.49	1.17	5.81	1.71	2.897	0.23667000000000002	\N	\N	2025-09-04 00:00:00	2025-12-26 19:42:39.443299
403	198	1	13	3	5	2025-09-03	2025-09-03	6.994	7.974	0.6523	0.6514	0.652	\N	7.81	1.13	7.79	3.34	4.087	0	\N	\N	2025-09-03 00:00:00	2025-12-26 19:42:39.445271
1363	175	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.018	2025-12-26 19:49:28.927627	2025-12-26 19:49:28.928976
448	195	1	10	2	2	2025-08-04	2025-08-04	7.953	7.338	0.6648999999999999	0.6647	0.6648000000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-04 00:00:00	2025-08-04 00:00:00
449	186	1	13	3	4	2025-06-12	2025-06-12	7.875	7.94	0.6686	0.6615000000000001	0.6651	7.54	7.72	5.38	0.34	3.42	3.05	\N	\N	\N	2025-06-12 00:00:00	2025-06-12 00:00:00
1364	175	1	13	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.02	2025-12-26 19:49:28.933988	2025-12-26 19:49:28.935687
289	181	2	4	3	2	2025-04-16	2025-04-16	7.767	7.368	0.6347999999999999	0.6239	0.629	\N	\N	\N	\N	\N	\N	\N	0.021	0.057	2025-04-16 00:00:00	2025-12-26 19:49:29.09898
456	191	1	13	3	4	2025-07-16	2025-07-16	7.841	7.15	0.6679999999999999	0.6694	0.6687000000000001	\N	8.01	0.93	0.53	1.24	0.9	\N	\N	\N	2025-07-16 00:00:00	2025-07-16 00:00:00
457	182	1	7	6	1	2025-04-29	2025-04-29	7.016	7.023	0.6652	0.6723	0.6688	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-29 00:00:00	2025-04-29 00:00:00
459	189	1	13	3	1	2025-07-03	2025-07-03	7.299	7.313	0.6679999999999999	0.6726000000000001	0.6703	7.702	7.97	0.45	1.63	0.6	0.89	\N	\N	\N	2025-07-03 00:00:00	2025-07-03 00:00:00
464	178	1	13	3	6	2025-04-16	2025-04-16	7.145	7.432	0.6724	0.6711	0.6718000000000001	\N	7.63	7.29	0.75	1.59	3.21	\N	\N	\N	2025-04-16 00:00:00	2025-04-16 00:00:00
465	178	1	13	3	2	2025-04-16	2025-04-16	7.511	7.413	0.6748999999999999	0.6689	0.6718999999999999	7.719	7.63	1.3	0.33	0.19	0.61	\N	\N	\N	2025-04-16 00:00:00	2025-04-16 00:00:00
466	171	1	7	5	1	2025-02-10	2025-02-10	7.268	6.898	0.6718000000000001	0.6731999999999999	0.6725	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-10 00:00:00	2025-02-10 00:00:00
469	200	1	7	2	1	2025-08-30	2025-09-01	7.298	7.933	0.6817	0.6642	0.6729999999999999	7.521	8.31	\N	\N	\N	\N	\N	\N	\N	2025-08-30 00:00:00	2025-08-30 00:00:00
472	178	1	13	3	4	2025-04-16	2025-04-16	7.872	7.258	0.6851999999999999	0.6659	0.6756	7.698	7.53	12.32	0.62	3.89	5.61	\N	\N	\N	2025-04-16 00:00:00	2025-04-16 00:00:00
475	178	1	13	3	1	2025-04-16	2025-04-16	1.325	1.385	0.6811	0.6804000000000001	0.6808	8.236	7.92	6.38	0.72	0.11	2.4	\N	\N	\N	2025-04-16 00:00:00	2025-04-16 00:00:00
476	191	1	13	3	1	2025-07-16	2025-07-16	7.144	7.402	0.6845	0.6819	0.6831999999999999	7.537	7.95	1.15	0.42	0.37	0.65	\N	\N	\N	2025-07-16 00:00:00	2025-07-16 00:00:00
477	173	1	7	6	2	2025-02-25	2025-02-26	6.901	6.827	0.6968000000000001	0.6701999999999999	0.6835	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-25 00:00:00	2025-02-25 00:00:00
479	180	1	7	6	1	2025-04-15	2025-04-15	7.231	7.195	0.6786	0.6939	0.6862999999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-15 00:00:00	2025-04-15 00:00:00
482	194	1	10	2	1	2025-07-28	2025-07-28	7.526	7.319	0.6889	0.6886	0.6888	7.573	7.34	2.38	0.7	16.52	6.53	\N	\N	\N	2025-07-28 00:00:00	2025-07-28 00:00:00
483	194	1	10	2	2	2025-07-28	2025-07-28	7.222	7.331	0.6901	0.6919	0.691	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-28 00:00:00	2025-07-28 00:00:00
485	190	1	10	2	2	2025-06-30	2025-06-30	7.54	7.02	0.6912	0.6937000000000001	0.6925	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-30 00:00:00	2025-06-30 00:00:00
488	180	1	10	2	2	2025-04-21	2025-04-21	8.487	7.887	0.6984	0.6912999999999999	0.6949	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-21 00:00:00	2025-04-21 00:00:00
489	193	1	10	2	2	2025-07-21	2025-07-21	7.8	6.986	0.6962999999999999	0.7012999999999999	0.6988	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-21 00:00:00	2025-07-21 00:00:00
490	169	1	11	2	2	2025-02-08	2025-02-08	6.921	6.918	0.6969	0.7018000000000001	0.6994	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-08 00:00:00	2025-02-08 00:00:00
444	170	1	13	3	7	2025-02-22	2025-02-22	6.95	6.965	0.6634	0.6638	0.664	7.516	7.9	8.57	1.15	0.1	3.273	0.24942000000000003	\N	\N	2025-02-22 00:00:00	2025-12-26 19:42:37.472746
463	178	1	13	3	3	2025-04-16	2025-04-16	7.31	7.471	0.6835	0.6595	0.671	7.604	7.52	2.44	0.46	0.22	1.04	0.23588999999999996	\N	\N	2025-04-16 00:00:00	2025-12-26 19:42:37.996604
462	178	1	13	3	5	2025-04-16	2025-04-16	7.2	7.616	0.6620999999999999	0.6793	0.671	\N	7.65	7.13	1.19	0.68	3	0.2039	\N	\N	2025-04-16 00:00:00	2025-12-26 19:42:37.998372
446	186	1	13	3	5	2025-06-12	2025-06-12	7.435	7.22	0.6662	0.6629	0.665	7.606	7.64	5.12	3.43	1.88	3.477	0.24301999999999999	\N	\N	2025-06-12 00:00:00	2025-12-26 19:42:38.568717
487	187	1	7	5	1	2025-05-31	2025-06-02	7.402	7.363	0.6999	0.6890000000000001	0.694	7.508	7.68	\N	\N	\N	\N	0.18639	\N	\N	2025-05-31 00:00:00	2025-12-26 19:42:38.595389
480	189	1	7	5	1	2025-06-13	2025-06-16	7.907	7.545	0.6896	0.6854	0.688	7.82	8.05	1.64	5.04	1.18	2.62	0.30015000000000003	\N	\N	2025-06-13 00:00:00	2025-12-26 19:42:38.731009
470	190	1	7	5	1	2025-06-20	2025-06-20	7.045	7.451	0.6883	0.6577	0.673	7.505	7.34	\N	\N	\N	\N	0.35847	\N	\N	2025-06-20 00:00:00	2025-12-26 19:42:38.810838
473	191	1	7	5	1	2025-06-28	2025-06-30	7.629	7.57	0.6674	0.6883	0.678	7.3546	7.86	\N	\N	\N	\N	0.30369	\N	\N	2025-06-28 00:00:00	2025-12-26 19:42:38.885674
467	191	1	13	3	5	2025-07-16	2025-07-16	7.427	7.954	0.6781999999999999	0.6668000000000001	0.672	\N	7.99	0.88	1.45	0.98	1.103	0.22795000000000004	\N	\N	2025-07-16 00:00:00	2025-12-26 19:42:38.910513
486	196	1	11	2	1	2025-08-14	2025-08-14	6.735	7.632	0.6984999999999999	0.6890999999999999	0.694	7.697	8.6	1.38	1.4	0.95	1.243	0.19841999999999999	\N	\N	2025-08-14 00:00:00	2025-12-26 19:42:39.255369
451	196	1	13	3	5	2025-08-20	2025-08-20	7.376	7.267	0.6683	0.6635	0.666	7.569	7.33	2.74	1.91	0.51	1.72	0.18691	\N	\N	2025-08-20 00:00:00	2025-12-26 19:42:39.264924
478	196	1	13	3	9	2025-08-21	2025-08-21	7.295	7.448	0.6797	0.6873999999999999	0.684	7.607	7.7	0.81	5.51	0.68	2.333	0.22832999999999998	\N	\N	2025-08-21 00:00:00	2025-12-26 19:42:39.272774
458	196	1	13	3	1	2025-08-20	2025-08-20	1.462	1.491	0.6707	0.6688	0.67	7.629	7.79	5.17	0.37	0.11	1.883	0.11635999999999999	\N	\N	2025-08-20 00:00:00	2025-12-26 19:42:39.276935
474	197	1	13	3	2	2025-08-27	2025-08-27	7.2	7.934	0.6835	0.6765000000000001	0.68	7.541	6.97	1.41	0.39	0.42	0.74	0.01355	\N	\N	2025-08-27 00:00:00	2025-12-26 19:42:39.306602
481	197	1	7	5	1	2025-08-08	2025-08-11	7.348	7.918	0.6827	0.6928	0.688	7.567	8.45	\N	\N	\N	\N	0.24229	\N	\N	2025-08-08 00:00:00	2025-12-26 19:42:39.312173
460	197	1	13	3	3	2025-08-27	2025-08-27	7.498	7.394	0.6727	0.6679999999999999	0.67	7.586	7.26	2.41	0.99	0.42	1.273	0.03198	\N	\N	2025-08-27 00:00:00	2025-12-26 19:42:39.314046
453	197	1	13	3	4	2025-08-27	2025-08-27	7.617	7.904	0.6624	0.6712	0.667	\N	7.15	1.91	0.69	0.58	1.06	0.24278	\N	\N	2025-08-27 00:00:00	2025-12-26 19:42:39.321761
471	197	1	13	3	1	2025-08-27	2025-08-27	7.518	7.744	0.672	0.679	0.675	7.52	7.79	0.57	0.75	8.11	3.143	0.06606	\N	\N	2025-08-27 00:00:00	2025-12-26 19:42:39.323634
461	197	1	13	3	10	2025-08-28	2025-08-28	7.938	7.434	0.6759000000000001	0.6651	0.671	7.538	6.81	2.53	1.09	0.51	1.377	0.24849	\N	\N	2025-08-28 00:00:00	2025-12-26 19:42:39.334633
447	197	1	13	3	8	2025-08-28	2025-08-28	7.937	7.583	0.6652	0.664	0.665	7.568	7.24	7.49	1.52	0.65	3.22	0.25739999999999996	\N	\N	2025-08-28 00:00:00	2025-12-26 19:42:39.336506
450	197	1	13	3	5	2025-08-27	2025-08-28	7.47	7.852	0.6681	0.6636	0.666	7.584	7.21	1.51	0.71	2.38	1.533	0.26128	\N	\N	2025-08-27 00:00:00	2025-12-26 19:42:39.338393
455	197	1	13	3	7	2025-08-28	2025-08-28	7.232	7.832	0.6681999999999999	0.6672	0.668	7.784	7.49	4.2	1.25	0.52	1.99	0.13472	\N	\N	2025-08-28 00:00:00	2025-12-26 19:42:39.34216
445	198	1	7	6	1	2025-08-19	2025-08-19	7.026	7.936	0.6629	0.6645	0.664	7.529	7.71	\N	\N	\N	\N	0.21558	\N	\N	2025-08-19 00:00:00	2025-12-26 19:42:39.362959
484	199	1	7	6	1	2025-08-26	2025-08-27	7.297	7.489	0.6883	0.6939	0.691	7.516	6.81	\N	\N	\N	\N	0.31420000000000003	\N	\N	2025-08-26 00:00:00	2025-12-26 19:42:39.38846
491	188	1	10	2	1	2025-06-16	2025-06-16	7.285	7.172	0.7009000000000001	0.6988	0.6999	7.669	8.14	0.92	16.24	1.16	6.11	\N	\N	\N	2025-06-16 00:00:00	2025-06-16 00:00:00
493	189	1	7	6	1	2025-06-17	2025-06-17	8.045	7.295	0.7088	0.6916	0.7001999999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-17 00:00:00	2025-06-17 00:00:00
496	190	1	10	2	1	2025-06-30	2025-06-30	6.998	7.086	0.7044	0.6992	0.7018000000000001	7.681	7.66	2.71	0.94	0.28	1.31	\N	\N	\N	2025-06-30 00:00:00	2025-06-30 00:00:00
498	186	1	10	2	1	2025-06-02	2025-06-02	7.419	7.024	0.7061	0.698	0.7021	7.566	7.91	2.05	0.17	0.56	0.93	\N	\N	\N	2025-06-02 00:00:00	2025-06-02 00:00:00
640	172	1	8	2	1	2025-02-19	2025-02-19	7.818	6.217	0.7609	0.7625	0.762	7.841	7.87	0.44	7.94	0.29	2.89	0.10342000000000001	0.006	0.023	2025-02-19 00:00:00	2025-12-26 19:49:28.790445
500	196	1	11	2	2	2025-08-14	2025-08-14	7.206	7.427	0.6984	0.7089	0.7037	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-14 00:00:00	2025-08-14 00:00:00
501	196	1	10	2	2	2025-08-11	2025-08-11	7.539	7.043	0.7099	0.6995999999999999	0.7048000000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-11 00:00:00	2025-08-11 00:00:00
227	179	2	4	3	1	2025-04-02	2025-04-02	7.586	7.482	0.6129	0.5991	0.606	7.664	7.82	\N	\N	\N	\N	0.27671	0.018	0.046	2025-04-02 00:00:00	2025-12-26 19:49:28.940674
504	180	1	10	2	1	2025-04-21	2025-04-21	7.15	7.989	0.7071999999999999	0.7031999999999999	0.7051999999999999	7.534	8.22	1.64	0.37	3.99	2	\N	\N	\N	2025-04-21 00:00:00	2025-04-21 00:00:00
505	181	1	10	2	2	2025-04-28	2025-04-28	7.593	7.663	0.7073	0.7031999999999999	0.7053	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-28 00:00:00	2025-04-28 00:00:00
506	194	1	8	12	1	2025-07-22	2025-07-22	7.31	7.079	0.7051999999999999	0.7056	0.7054	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-22 00:00:00	2025-07-22 00:00:00
507	195	1	9	12	3	2025-08-01	2025-08-01	5.432	6.334	0.7062999999999999	0.7065	0.7064	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-01 00:00:00	2025-08-01 00:00:00
509	194	1	11	2	2	2025-07-31	2025-07-31	7.753	7.316	0.7062999999999999	0.7077	0.7070000000000001	\N	\N	3.49	0.16	7.74	3.8	\N	\N	\N	2025-07-31 00:00:00	2025-07-31 00:00:00
510	188	1	10	2	2	2025-06-16	2025-06-16	7.409	7.229	0.7231000000000001	0.6938	0.7084999999999999	7.639	7.91	\N	\N	\N	\N	\N	\N	\N	2025-06-16 00:00:00	2025-06-16 00:00:00
511	193	1	11	2	2	2025-07-25	2025-07-25	7.088	6.888	0.7059000000000001	0.7114	0.7087	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-25 00:00:00	2025-07-25 00:00:00
525	180	1	11	2	1	2025-04-24	2025-04-24	8.216	7.357	0.7126	0.7121999999999999	0.712	7.796	8.05	0.65	2.94	3.36	2.317	0.2883	0.006	0.02	2025-04-24 00:00:00	2025-12-26 19:49:29.147487
513	198	1	11	1	1	2025-08-28	2025-08-29	7.256	7.049	0.7155	0.7037	0.7095999999999999	7.632	7.79	2.91	9.83	0.16	4.3	\N	\N	\N	2025-08-28 00:00:00	2025-08-28 00:00:00
514	170	1	12	2	1	2025-02-15	2025-02-17	8.226	8.025	0.7090000000000001	0.7103	0.7097	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-15 00:00:00	2025-02-15 00:00:00
516	172	1	10	2	1	2025-02-24	2025-02-24	6.445	7.154	0.7069	0.7137	0.7103	7.619	7.83	10.02	1.61	1.96	4.53	\N	\N	\N	2025-02-24 00:00:00	2025-02-24 00:00:00
518	179	1	10	2	1	2025-04-14	2025-04-14	7.752	7.756	0.7129000000000001	0.7095	0.7112	7.631	8.19	1.39	1.69	0.28	1.12	\N	\N	\N	2025-04-14 00:00:00	2025-04-14 00:00:00
519	192	1	11	2	2	2025-07-17	2025-07-17	7.899	7.125	0.7094	0.7137	0.7116	7.624	8.57	\N	\N	\N	\N	\N	\N	\N	2025-07-17 00:00:00	2025-07-17 00:00:00
520	186	1	11	2	2	2025-06-05	2025-06-05	7.615	7.2	0.7137	0.7095	0.7116	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-05 00:00:00	2025-06-05 00:00:00
521	180	1	11	2	2	2025-04-24	2025-04-24	7.824	7.723	0.7087	0.7148	0.7118000000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-24 00:00:00	2025-04-24 00:00:00
522	171	1	11	2	2	2025-02-21	2025-02-21	6.919	7.632	0.7170000000000001	0.7066	0.7118000000000001	7.742	7.58	3.79	2.77	0.25	2.27	\N	\N	\N	2025-02-21 00:00:00	2025-02-21 00:00:00
523	197	1	10	2	2	2025-08-18	2025-08-18	7.204	7.409	0.7184	0.7059000000000001	0.7121999999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-18 00:00:00	2025-08-18 00:00:00
526	197	1	11	1	2	2025-08-21	2025-08-22	7.233	7.733	0.7105	0.7148	0.7127	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-21 00:00:00	2025-08-21 00:00:00
527	172	1	10	2	2	2025-02-24	2025-02-24	6.7	6.724	0.7112999999999999	0.7143999999999999	0.7129000000000001	\N	\N	0.4	0.61	12.33	4.45	\N	\N	\N	2025-02-24 00:00:00	2025-02-24 00:00:00
530	195	1	11	2	2	2025-08-07	2025-08-07	7.296	7.098	0.7193	0.7105	0.7149	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-07 00:00:00	2025-08-07 00:00:00
532	192	1	10	2	2	2025-07-14	2025-07-14	7.897	7.456	0.7206	0.7094	0.715	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-14 00:00:00	2025-07-14 00:00:00
534	170	1	10	2	1	2025-02-11	2025-02-11	6.803	7.566	0.7173	0.7132	0.7153	7.697	8.04	1.09	0.92	0.66	0.89	\N	\N	\N	2025-02-11 00:00:00	2025-02-11 00:00:00
537	193	1	10	2	1	2025-07-21	2025-07-21	7.378	7.58	0.7164	0.7151000000000001	0.7158	7.72	7.37	0.45	1.61	4.1	2.05	\N	\N	\N	2025-07-21 00:00:00	2025-07-21 00:00:00
538	170	1	10	2	2	2025-02-11	2025-02-11	7.818	7.837	0.7117	0.7202	0.716	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-11 00:00:00	2025-02-11 00:00:00
539	199	1	11	2	2	2025-09-04	2025-09-05	7.715	7.42	0.7212999999999999	0.7106	0.716	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-09-04 00:00:00	2025-09-04 00:00:00
1022	171	1	1	9	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.0233	\N	\N	2025-12-26 19:42:37.49637	2025-12-26 19:42:37.498532
1025	171	1	4	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21513000000000002	\N	\N	2025-12-26 19:42:37.507303	2025-12-26 19:42:37.509452
515	181	1	7	5	1	2025-04-18	2025-04-21	7.841	7.607	0.7098	0.7101999999999999	0.71	7.519	8.21	\N	\N	\N	\N	0.21512000000000003	\N	\N	2025-04-18 00:00:00	2025-12-26 19:42:38.123499
524	186	1	9	2	1	2025-05-30	2025-06-02	7.857	7.552	0.7143	0.7101999999999999	0.712	7.94	7.71	0.3	1.35	0.6	0.75	0.23079999999999998	\N	\N	2025-05-30 00:00:00	2025-12-26 19:42:38.584688
531	187	1	11	2	1	2025-06-12	2025-06-12	7.906	7.596	0.7191	0.7109000000000001	0.715	\N	\N	\N	\N	\N	\N	0.25928	\N	\N	2025-06-12 00:00:00	2025-12-26 19:42:38.600846
533	188	1	7	5	1	2025-06-06	2025-06-09	7.862	7.625	0.7056999999999999	0.7245	0.715	7.516	7.84	\N	\N	\N	\N	0.26681	\N	\N	2025-06-06 00:00:00	2025-12-26 19:42:38.650749
492	189	1	11	2	1	2025-06-27	2025-06-27	7.664	7.614	0.6988	0.701	0.7	\N	\N	\N	\N	\N	\N	0.22995000000000004	\N	\N	2025-06-27 00:00:00	2025-12-26 19:42:38.743268
528	192	1	7	5	1	2025-07-05	2025-07-07	8.213	7.813	0.7190000000000001	0.7093	0.714	7.51	7.79	\N	\N	\N	\N	0.253	\N	\N	2025-07-05 00:00:00	2025-12-26 19:42:38.952939
503	192	1	11	2	1	2025-07-17	2025-07-17	7.384	7.576	0.7069	0.7033	0.705	7.709	8.48	3.6	0.96	1.6	2.053	0.25146	\N	\N	2025-07-17 00:00:00	2025-12-26 19:42:38.966409
517	193	1	11	2	1	2025-07-25	2025-07-25	7.413	7.283	0.7176	0.7047	0.711	7.653	7.46	2.58	2.41	2.91	2.633	0.25169	\N	\N	2025-07-25 00:00:00	2025-12-26 19:42:39.043212
508	194	1	11	2	1	2025-07-31	2025-07-31	7.111	7.114	0.7053	0.7082999999999999	0.707	7.701	7.45	\N	\N	\N	\N	0.2443	\N	\N	2025-07-31 00:00:00	2025-12-26 19:42:39.214589
535	195	1	11	2	1	2025-08-07	2025-08-07	7.575	7.872	0.7117	0.7190000000000001	0.715	7.743	8.29	0.81	3.34	7.49	3.88	0.21015999999999999	\N	\N	2025-08-07 00:00:00	2025-12-26 19:42:39.239455
494	196	1	10	2	1	2025-08-11	2025-08-11	7.568	7.528	0.7067	0.695	0.701	7.5798	7.36	3.08	0.58	1.25	1.637	0.22896000000000002	\N	\N	2025-08-11 00:00:00	2025-12-26 19:42:39.270793
495	197	1	11	2	1	2025-08-21	2025-08-21	7.751	7.331	0.7097	0.6926000000000001	0.701	7.711	7.97	0.55	1.68	0.55	0.927	0.20377	\N	\N	2025-08-21 00:00:00	2025-12-26 19:42:39.302797
536	198	1	10	2	1	2025-08-25	2025-08-25	7.294	7.328	0.7173	0.7139	0.716	7.584	7.95	2.78	1.09	0.42	1.43	0.023719999999999998	\N	\N	2025-08-25 00:00:00	2025-12-26 19:42:39.364806
541	172	1	10	1	1	2025-02-25	2025-02-25	7.252	7.152	0.7237	0.7117	0.7177	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-25 00:00:00	2025-02-25 00:00:00
542	199	1	11	2	1	2025-09-04	2025-09-04	7.518	7.894	0.7156	0.7199	0.7178	7.652	8.15	0.95	5.59	3.4	3.31	\N	\N	\N	2025-09-04 00:00:00	2025-09-04 00:00:00
543	198	1	10	2	2	2025-08-25	2025-08-25	7.432	7.85	0.7192000000000001	0.7176	0.7184	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-25 00:00:00	2025-08-25 00:00:00
544	192	1	10	2	1	2025-07-14	2025-07-14	7.267	7.334	0.7173	0.7197	0.7184999999999999	7.557	7.97	10.39	1.61	3.86	5.29	\N	\N	\N	2025-07-14 00:00:00	2025-07-14 00:00:00
546	195	1	9	12	2	2025-08-01	2025-08-01	7.551	7.227	0.722	0.7155	0.7188	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-01 00:00:00	2025-08-01 00:00:00
547	198	1	7	2	1	2025-08-16	2025-08-18	7.802	7.422	0.7362000000000001	0.7017	0.7190000000000001	7.901	8.11	\N	\N	\N	\N	\N	\N	\N	2025-08-16 00:00:00	2025-08-16 00:00:00
549	169	1	11	2	1	2025-02-08	2025-02-08	7.172	7.37	0.7182	0.7206	0.7193999999999999	8.014	7.97	0.61	1.01	0.48	0.7	\N	\N	\N	2025-02-08 00:00:00	2025-02-08 00:00:00
550	181	1	7	6	1	2025-04-22	2025-04-22	7.241	8.106	0.7193	0.7195999999999999	0.7195	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-22 00:00:00	2025-04-22 00:00:00
552	191	1	10	2	2	2025-07-07	2025-07-07	7.304	7.407	0.7259	0.7137	0.7198	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-07 00:00:00	2025-07-07 00:00:00
553	188	1	11	2	2	2025-06-19	2025-06-19	7.694	7.827	0.7268000000000001	0.7132	0.72	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-19 00:00:00	2025-06-19 00:00:00
554	191	1	11	2	2	2025-07-11	2025-07-11	7.324	7.764	0.7162000000000001	0.7245999999999999	0.7204	7.631	8.14	\N	\N	\N	\N	\N	\N	\N	2025-07-11 00:00:00	2025-07-11 00:00:00
557	191	1	10	2	1	2025-07-07	2025-07-07	7.344	7.722	0.7177	0.7259	0.7218000000000001	7.56	7.56	0.14	7.08	1.66	2.96	\N	\N	\N	2025-07-07 00:00:00	2025-07-07 00:00:00
559	187	1	10	2	1	2025-06-09	2025-06-09	7.132	7.584	0.7223	0.7225	0.7223999999999999	7.65	7.63	0.4	0.53	7.52	2.82	\N	\N	\N	2025-06-09 00:00:00	2025-06-09 00:00:00
562	190	1	11	2	2	2025-07-04	2025-07-04	7.904	7.274	0.7261	0.7215	0.7238	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-04 00:00:00	2025-07-04 00:00:00
563	172	1	9	2	1	2025-02-22	2025-02-24	7.987	7.717	0.7216	0.7278	0.7247	7.712	8.13	0.56	2.47	13.62	5.55	\N	\N	\N	2025-02-22 00:00:00	2025-02-22 00:00:00
564	194	1	10	1	1	2025-07-28	2025-07-29	7.332	7.344	0.7248	0.7248	0.7248	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-28 00:00:00	2025-07-28 00:00:00
565	169	1	10	2	2	2025-02-03	2025-02-04	6.85	7.143	0.7219	0.7284	0.7252	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-03 00:00:00	2025-02-03 00:00:00
566	181	1	10	2	1	2025-04-28	2025-04-28	7.588	7.478	0.7271	0.7234	0.7253000000000001	7.51	8.36	13.02	0.99	0.25	4.75	\N	\N	\N	2025-04-28 00:00:00	2025-04-28 00:00:00
574	181	1	8	2	1	2025-04-22	2025-04-23	7.115	7.34	0.7359	0.721	0.728	7.642	8.24	1.38	5.05	1.51	2.647	0.10188	0.004	0.014	2025-04-22 00:00:00	2025-12-26 19:49:29.131203
568	171	1	11	2	1	2025-02-21	2025-02-21	6.971	7.158	0.7319	0.7206	0.7263	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-21 00:00:00	2025-02-21 00:00:00
572	189	1	10	2	2	2025-06-23	2025-06-23	7.072	7.421	0.7225	0.7328	0.7277	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-23 00:00:00	2025-06-23 00:00:00
575	199	1	10	2	1	2025-09-01	2025-09-01	7.499	7.516	0.7315999999999999	0.7253000000000001	0.7284999999999999	7.513	7.51	1.22	0.93	2.16	1.44	\N	\N	\N	2025-09-01 00:00:00	2025-09-01 00:00:00
576	199	1	10	2	2	2025-09-01	2025-09-01	7.27	7.312	0.7276	0.7293999999999999	0.7284999999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-09-01 00:00:00	2025-09-01 00:00:00
578	180	1	10	1	1	2025-04-21	2025-04-21	7.038	7.837	0.731	0.7276	0.7293000000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-21 00:00:00	2025-04-21 00:00:00
579	197	1	11	1	1	2025-08-21	2025-08-22	7.438	7.162	0.7292000000000001	0.7302	0.7297	\N	\N	0.48	1.15	3.18	1.6	\N	\N	\N	2025-08-21 00:00:00	2025-08-21 00:00:00
580	172	1	10	1	2	2025-02-25	2025-02-25	7.038	6.935	0.7304999999999999	0.73	0.7303000000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-25 00:00:00	2025-02-25 00:00:00
583	192	1	10	1	1	2025-07-14	2025-07-14	7.254	7.655	0.7323999999999999	0.7295999999999999	0.731	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-14 00:00:00	2025-07-14 00:00:00
584	171	2	6	10	1	2025-02-06	2025-02-06	4.888	4.046	0.7349	0.7273000000000001	0.7311	\N	\N	4.86	0.56	2.58	2.67	\N	\N	\N	2025-02-06 00:00:00	2025-02-06 00:00:00
585	187	1	10	2	2	2025-06-09	2025-06-09	7.15	7.722	0.7347	0.7278	0.7313	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-09 00:00:00	2025-06-09 00:00:00
587	173	1	7	5	1	2025-02-22	2025-02-24	7.563	7.05	0.7348	0.7299	0.7323999999999999	7.613	7.74	\N	\N	\N	\N	\N	\N	\N	2025-02-22 00:00:00	2025-02-22 00:00:00
1024	171	1	5	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21424	\N	\N	2025-12-26 19:42:37.503544	2025-12-26 19:42:37.505804
556	171	1	10	1	1	2025-02-18	2025-02-18	6.833	7.283	0.7249	0.7176	0.721	\N	\N	\N	\N	\N	\N	0.20942999999999998	\N	\N	2025-02-18 00:00:00	2025-12-26 19:42:37.54568
548	171	1	10	2	2	2025-02-17	2025-02-17	7.614	7.293	0.72	0.7184999999999999	0.719	\N	\N	2.27	1.21	3.05	2.177	0.21383000000000002	\N	\N	2025-02-17 00:00:00	2025-12-26 19:42:37.549567
570	180	1	9	2	1	2025-04-17	2025-04-21	7.379	7.889	0.7334	0.7211	0.727	7.704	8.33	3.65	1.83	4.52	3.333	0.23619	\N	\N	2025-04-17 00:00:00	2025-12-26 19:42:38.09894
555	188	1	11	2	1	2025-06-19	2025-06-19	7.261	7.661	0.7245	0.7178	0.721	7.768	7.63	0.97	1.31	0.87	1.05	0.30097	\N	\N	2025-06-19 00:00:00	2025-12-26 19:42:38.663511
581	188	1	9	2	1	2025-06-13	2025-06-13	7.62	7.868	0.7284	0.7322	0.73	6.61	7.76	1.02	0.56	0.72	0.767	0.24753000000000003	\N	\N	2025-06-13 00:00:00	2025-12-26 19:42:38.704345
551	190	1	11	2	1	2025-07-04	2025-07-04	7.299	7.669	0.7241	0.7153	0.72	7.824	8.07	1.38	1.15	0.69	1.073	0.28314	\N	\N	2025-07-04 00:00:00	2025-12-26 19:42:38.82004
571	190	1	9	2	1	2025-06-28	2025-06-30	7.941	7.765	0.7326	0.7226	0.728	8.145	7.96	12.46	4.86	0.49	5.937	0.23837	\N	\N	2025-06-28 00:00:00	2025-12-26 19:42:38.860686
573	191	1	11	2	1	2025-07-11	2025-07-11	7.33	7.477	0.7349	0.7217	0.728	7.602	7.7	1.11	1.35	2.67	1.71	0.24071	\N	\N	2025-07-11 00:00:00	2025-12-26 19:42:38.894606
561	192	2	6	10	1	2025-07-03	2025-07-03	5.25	4.938	0.7323000000000001	0.7148	0.724	\N	\N	3.15	3.64	0.98	2.59	0.20769	\N	\N	2025-07-03 00:00:00	2025-12-26 19:42:38.993161
582	192	1	9	2	1	2025-07-12	2025-07-14	7.434	7.765	0.7268000000000001	0.7338	0.73	7.522	8.35	11.12	1.63	1.24	4.663	0.21406	\N	\N	2025-07-12 00:00:00	2025-12-26 19:42:39.004055
569	193	1	9	2	1	2025-07-18	2025-07-21	7.074	7.094	0.7278	0.726	0.727	7.613	8.38	3.3	1.49	7.32	4.037	0.19818000000000002	\N	\N	2025-07-18 00:00:00	2025-12-26 19:42:39.068567
558	194	1	9	2	1	2025-07-26	2025-07-28	7.419	7.916	0.7168000000000001	0.7269	0.722	7.566	8.35	1.14	0.58	5.25	2.323	0.21280000000000002	\N	\N	2025-07-26 00:00:00	2025-12-26 19:42:39.117696
540	195	1	9	2	1	2025-08-01	2025-08-04	7.056	7.343	0.7206	0.7139	0.717	5.856	8.27	1.44	1.54	0.69	1.223	0.22311000000000003	\N	\N	2025-08-01 00:00:00	2025-12-26 19:42:39.228469
560	197	1	10	2	1	2025-08-18	2025-08-18	7.791	7.081	0.7384999999999999	0.7079000000000001	0.723	7.631	8.15	2.58	1.05	0.52	1.383	0.21677	\N	\N	2025-08-18 00:00:00	2025-12-26 19:42:39.300963
586	198	2	6	10	1	2025-08-14	2025-08-14	4.722	4.324	0.733	0.7315999999999999	0.732	\N	\N	1.61	3.25	0.59	1.817	0.16344999999999998	\N	\N	2025-08-14 00:00:00	2025-12-26 19:42:39.355633
545	198	1	9	2	1	2025-08-22	2025-08-22	7.698	7.201	0.7232999999999999	0.7137	0.718	7.66	8.02	0.52	0.39	1.69	0.867	0.0526	\N	\N	2025-08-22 00:00:00	2025-12-26 19:42:39.368426
589	187	1	11	2	2	2025-06-12	2025-06-12	7.302	7.823	0.7341	0.7315	0.7328	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-12 00:00:00	2025-06-12 00:00:00
590	178	1	10	2	2	2025-04-07	2025-04-07	7.519	7.103	0.7343999999999999	0.7318000000000001	0.7331	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-07 00:00:00	2025-04-07 00:00:00
594	169	1	10	1	1	2025-02-04	2025-02-04	6.884	7.283	0.7354	0.7336	0.7345	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-04 00:00:00	2025-02-04 00:00:00
595	169	1	10	2	1	2025-02-03	2025-02-03	7.3017	7.182	0.7341	0.7351000000000001	0.7345999999999999	7.65	8.16	8.25	9.5	6.74	8.16	\N	\N	\N	2025-02-03 00:00:00	2025-02-03 00:00:00
596	195	1	8	12	1	2025-07-29	2025-07-29	6.093	6.113	0.7278	0.7419	0.7349	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-29 00:00:00	2025-07-29 00:00:00
597	201	2	6	10	1	2025-09-04	2025-09-04	4.612	4.132	0.7384000000000001	0.7334	0.7359	\N	\N	4.38	1.07	4.87	3.44	\N	\N	\N	2025-09-04 00:00:00	2025-09-04 00:00:00
598	170	1	10	1	1	2025-02-12	2025-02-12	7.212	7.827	0.7413	0.7315999999999999	0.7365	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-12 00:00:00	2025-02-12 00:00:00
599	189	1	10	2	1	2025-06-23	2025-06-23	7.481	7.389	0.738	0.735	0.7365	7.678	8.28	2.31	1.81	0.21	1.44	\N	\N	\N	2025-06-23 00:00:00	2025-06-23 00:00:00
600	198	1	11	1	2	2025-08-28	2025-08-29	7.458	7.507	0.7381	0.736	0.7371	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-28 00:00:00	2025-08-28 00:00:00
602	190	1	10	1	1	2025-07-01	2025-07-01	7.309	7.972	0.7391	0.7365	0.7378	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-01 00:00:00	2025-07-01 00:00:00
603	179	1	10	2	2	2025-04-15	2025-04-15	7.254	7.237	0.7411	0.7359	0.7384999999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-15 00:00:00	2025-04-15 00:00:00
605	181	1	10	1	1	2025-04-29	2025-04-29	7.936	7.976	0.7462000000000001	0.7333	0.7398	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-04-29 00:00:00	2025-04-29 00:00:00
606	170	1	7	5	1	2025-02-01	2025-02-03	7.053	7.03	0.7445	0.7381	0.7413	7.714	8.24	\N	\N	\N	\N	\N	\N	\N	2025-02-01 00:00:00	2025-02-01 00:00:00
607	199	1	9	2	1	2025-08-29	2025-09-01	7.495	7.195	0.7409	0.7451000000000001	0.743	7.739	8.03	4.51	1.51	1.62	2.55	\N	\N	\N	2025-08-29 00:00:00	2025-08-29 00:00:00
610	197	1	8	2	1	2025-08-13	2025-08-13	7.399	7.35	0.7468	0.7412000000000001	0.7440000000000001	7.572	8.34	1.95	2.01	2.98	2.31	\N	\N	\N	2025-08-13 00:00:00	2025-08-13 00:00:00
613	193	1	10	1	1	2025-07-21	2025-07-22	7.632	7.17	0.7454999999999999	0.7459	0.7456999999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-21 00:00:00	2025-07-21 00:00:00
630	182	1	8	2	1	2025-04-30	2025-04-30	7.694	7.101	0.7597	0.7492	0.754	7.634	7.92	2.84	1.92	9.1	4.62	0.07266	0.005	0.02	2025-04-30 00:00:00	2025-12-26 19:49:29.174452
615	199	1	7	2	1	2025-08-22	2025-08-25	7.744	7.783	0.7491	0.7437999999999999	0.7465	7.739	8.13	\N	\N	\N	\N	\N	\N	\N	2025-08-22 00:00:00	2025-08-22 00:00:00
617	170	1	9	2	1	2025-02-08	2025-02-10	6.66	6.846	0.7478	0.7487	0.7483	7.611	7.85	1.31	0.69	5.51	2.5	\N	\N	\N	2025-02-08 00:00:00	2025-02-08 00:00:00
619	200	1	8	2	1	2025-09-03	2025-09-03	7.435	7.105	0.7413	0.7562000000000001	0.7487999999999999	7.829	8.46	3.08	4.52	3.43	3.68	\N	\N	\N	2025-09-03 00:00:00	2025-09-03 00:00:00
621	188	1	10	1	1	2025-06-16	2025-06-16	7.995	7.256	0.7502	0.748	0.7491	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-16 00:00:00	2025-06-16 00:00:00
622	179	1	9	2	1	2025-04-11	2025-04-11	7.843	7.557	0.7514	0.7492	0.7503	7.763	8.44	0.34	2.38	0.43	1.05	\N	\N	\N	2025-04-11 00:00:00	2025-04-11 00:00:00
623	173	1	8	2	1	2025-02-26	2025-02-26	6.757	6.71	0.7526	0.7491	0.7509	7.952	8.26	3.81	1.43	4.05	3.1	\N	\N	\N	2025-02-26 00:00:00	2025-02-26 00:00:00
626	178	1	10	2	1	2025-04-07	2025-04-07	7.203	7.792	0.7526	0.7519	0.7523000000000001	\N	\N	0.57	1.99	1.67	1.41	\N	\N	\N	2025-04-07 00:00:00	2025-04-07 00:00:00
629	200	2	6	10	1	2025-08-28	2025-08-29	7.17	4.499	0.7613	0.7461	0.7537	\N	\N	8.13	0.92	2.69	3.91	\N	\N	\N	2025-08-28 00:00:00	2025-08-28 00:00:00
631	190	1	8	12	1	2025-06-24	2025-06-24	7.218	7.246	0.7511	0.7584000000000001	0.7548	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-24 00:00:00	2025-06-24 00:00:00
632	186	1	10	1	1	2025-06-02	2025-06-03	7.253	7.195	0.7506999999999999	0.7595999999999999	0.7552	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-02 00:00:00	2025-06-02 00:00:00
633	196	1	8	12	1	2025-08-05	2025-08-05	6.982	7.003	0.7556	0.7559999999999999	0.7558	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-08-05 00:00:00	2025-08-05 00:00:00
634	191	1	8	12	1	2025-07-01	2025-07-01	7.231	7.705	0.7645000000000001	0.7481	0.7563	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-01 00:00:00	2025-07-01 00:00:00
1026	171	1	4	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.15401	\N	\N	2025-12-26 19:42:37.510913	2025-12-26 19:42:37.512993
618	187	1	9	2	1	2025-06-06	2025-06-06	7.537	7.601	0.7465	0.7509	0.749	7.566	7.95	0.82	0.76	1.11	0.897	0.2225	\N	\N	2025-06-06 00:00:00	2025-12-26 19:42:38.627757
588	189	1	9	2	1	2025-06-20	2025-06-20	7.743	7.604	0.7314	0.7339	0.733	7.561	7.98	2.73	1.24	0.78	1.583	0.20901	\N	\N	2025-06-20 00:00:00	2025-12-26 19:42:38.783413
604	190	1	8	2	1	2025-06-25	2025-06-25	7.653	7.61	0.742	0.7356999999999999	0.739	7.772	8.18	0.74	3.33	0.63	1.567	0.02321	\N	\N	2025-06-25 00:00:00	2025-12-26 19:42:38.789019
624	191	1	8	2	1	2025-07-01	2025-07-02	7.17	7.664	0.7501000000000001	0.7517	0.751	7.551	8.32	14.12	1.49	1.99	5.867	0.07065	\N	\N	2025-07-01 00:00:00	2025-12-26 19:42:38.869699
616	191	1	9	2	1	2025-07-04	2025-07-04	7.592	7.72	0.7489	0.7453	0.747	7.564	8.02	6.85	2.2	6.3	5.117	0.19829000000000002	\N	\N	2025-07-04 00:00:00	2025-12-26 19:42:38.932164
627	193	1	8	2	1	2025-07-15	2025-07-16	7.787	7.683	0.7490000000000001	0.7563	0.753	7.645	8.48	1.15	0.79	0.67	0.87	0.05151	\N	\N	2025-07-15 00:00:00	2025-12-26 19:42:39.013005
620	194	2	6	10	1	2025-07-17	2025-07-17	5.402	5.695	0.7574	0.7404000000000001	0.749	\N	\N	3.7	2.69	6.66	4.35	0.15457	\N	\N	2025-07-17 00:00:00	2025-12-26 19:42:39.102931
592	195	1	8	2	1	2025-07-29	2025-07-30	7.253	7.721	0.7343000000000001	0.7332	0.734	7.526	8.29	4.69	2.26	0.72	2.557	0.0406	\N	\N	2025-07-29 00:00:00	2025-12-26 19:42:39.126596
635	196	2	6	10	1	2025-07-31	2025-07-31	4.358	4.282	0.7575	0.7554000000000001	0.756	\N	\N	6.83	4.58	1.68	4.363	0.2043	\N	\N	2025-07-31 00:00:00	2025-12-26 19:42:39.186097
628	195	1	10	1	1	2025-08-04	2025-08-05	7.208	7.104	0.7534000000000001	0.7528	0.753	\N	\N	\N	\N	\N	\N	0.24552	\N	\N	2025-08-04 00:00:00	2025-12-26 19:42:39.249268
611	196	1	9	2	1	2025-08-08	2025-08-11	7.581	7.478	0.7448	0.7437999999999999	0.744	7.69	7.56	4.69	4.52	1.06	3.423	0.18431999999999998	\N	\N	2025-08-08 00:00:00	2025-12-26 19:42:39.268818
601	196	1	10	1	1	2025-08-11	2025-08-12	7.491	7.851	0.7379000000000001	0.7363	0.737	7.633	8.34	0.73	4.91	2.84	2.827	0.022770000000000002	\N	\N	2025-08-11 00:00:00	2025-12-26 19:42:39.288264
593	197	2	6	10	1	2025-08-07	2025-08-08	7.323	7.524	0.7397	0.7284999999999999	0.734	\N	\N	0.53	0.93	3.96	1.807	0.21265	\N	\N	2025-08-07 00:00:00	2025-12-26 19:42:39.299149
591	197	1	9	2	1	2025-08-16	2025-08-18	7.537	7.258	0.7361	0.7304	0.733	7.255	7.96	0.89	3.31	4.23	2.81	0.23173	\N	\N	2025-08-16 00:00:00	2025-12-26 19:42:39.304713
608	197	1	7	6	1	2025-08-12	2025-08-12	7.715	7.202	0.7517	0.7356	0.744	7.516	8.32	\N	\N	\N	\N	0.25769	\N	\N	2025-08-12 00:00:00	2025-12-26 19:42:39.319828
609	198	1	8	2	1	2025-08-19	2025-08-20	7.102	6.912	0.7417	0.7456	0.744	7.536	7.99	4.01	4.68	0.38	3.023	0.07386999999999999	\N	\N	2025-08-19 00:00:00	2025-12-26 19:42:39.351672
497	177	1	11	2	1	2025-04-03	2025-04-03	7.163	7.018	0.7026	0.7012999999999999	0.702	7.815	7.62	0.56	9.68	3.89	4.71	\N	0.006	0.019	2025-04-03 00:00:00	2025-12-26 19:49:28.956049
1366	176	1	13	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.006	0.017	2025-12-26 19:49:29.051134	2025-12-26 19:49:29.054376
641	195	1	9	12	1	2025-07-31	2025-07-31	7.993	7.637	0.7689	0.763	0.7659999999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-31 00:00:00	2025-07-31 00:00:00
642	189	1	8	12	1	2025-06-17	2025-06-17	7.52	7.3	0.7665000000000001	0.7668	0.7667	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-17 00:00:00	2025-06-17 00:00:00
644	169	1	9	2	1	2025-02-01	2025-02-03	7.768	7.791	0.7691	0.7663	0.7676999999999999	7.651	7.88	0.47	14.38	0.39	5.08	\N	\N	\N	2025-02-01 00:00:00	2025-02-01 00:00:00
651	189	2	8	2	1	2025-06-17	2025-06-18	7.649	7.454	0.7831999999999999	0.7643000000000001	0.7737999999999999	7.621	8.51	2.81	0.28	8.87	3.99	\N	\N	\N	2025-06-17 00:00:00	2025-06-17 00:00:00
658	172	2	6	10	4	2025-02-18	2025-02-18	5.209	4.059	0.7886	0.7713	0.78	\N	\N	1.25	0.5	2.32	1.36	\N	\N	\N	2025-02-18 00:00:00	2025-02-18 00:00:00
660	201	2	6	10	2	2025-09-05	2025-09-05	5.331	6.871	0.7879999999999999	0.7818	0.7848999999999999	\N	\N	5.59	0.79	2.01	2.8	\N	\N	\N	2025-09-05 00:00:00	2025-09-05 00:00:00
664	170	1	8	2	1	2025-02-05	2025-02-06	7.067	6.967	0.7885	0.7856000000000001	0.7870999999999999	7.796	8.66	2.94	1.91	5.64	3.5	\N	\N	\N	2025-02-05 00:00:00	2025-02-05 00:00:00
668	171	2	6	10	2	2025-02-07	2025-02-07	4.743	4.301	0.7962	0.785	0.7906	\N	\N	6.98	1.37	3.08	3.81	\N	\N	\N	2025-02-07 00:00:00	2025-02-07 00:00:00
674	200	2	6	10	4	2025-09-02	2025-09-03	4.47	3.583	0.7948999999999999	0.7972	0.7961	\N	\N	1.34	0.95	4.68	2.32	\N	\N	\N	2025-09-02 00:00:00	2025-09-02 00:00:00
675	182	2	6	10	2	2025-04-25	2025-04-25	4.514	4.003	0.8007	0.7961	0.7984	\N	\N	3.44	2.84	1.75	2.68	\N	\N	\N	2025-04-25 00:00:00	2025-04-25 00:00:00
677	180	2	6	10	2	2025-04-11	2025-04-11	4.835	5.919	0.8042	0.7962	0.8001999999999999	\N	\N	0.31	2.43	0.79	1.18	\N	\N	\N	2025-04-11 00:00:00	2025-04-11 00:00:00
679	179	2	6	10	2	2025-04-04	2025-04-07	5.302	5.094	0.7998999999999999	0.8036	0.8018000000000001	\N	\N	0.92	2.62	5.31	2.95	\N	\N	\N	2025-04-04 00:00:00	2025-04-04 00:00:00
1027	171	1	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.16827999999999999	\N	\N	2025-12-26 19:42:37.514605	2025-12-26 19:42:37.516678
1030	171	1	6	10	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.15975	\N	\N	2025-12-26 19:42:37.525199	2025-12-26 19:42:37.527282
1032	171	1	2	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.16143000000000002	\N	\N	2025-12-26 19:42:37.532279	2025-12-26 19:42:37.534282
1033	171	1	2	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.16413	\N	\N	2025-12-26 19:42:37.535702	2025-12-26 19:42:37.538044
1036	172	1	1	11	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01581	\N	\N	2025-12-26 19:42:37.557078	2025-12-26 19:42:37.559224
91	172	2	2	3	2	2025-02-11	2025-02-11	1.401	1.453	0.1795	0.17550000000000002	0.177	\N	\N	7.36	19.16	0.5	9.007	0.17047	\N	\N	2025-02-11 00:00:00	2025-12-26 19:42:37.594044
643	178	1	9	2	1	2025-04-04	2025-04-07	7.534	7.759	0.7662	0.7683	0.767	\N	\N	2.97	2.15	3.56	2.893	0.20408	\N	\N	2025-04-04 00:00:00	2025-12-26 19:42:38.001991
673	179	2	6	10	1	2025-04-03	2025-04-03	4.627	5.081	0.7907	0.7968999999999999	0.794	\N	\N	0.7	2.2	8.28	3.727	0.21303999999999998	\N	\N	2025-04-03 00:00:00	2025-12-26 19:42:38.054705
662	180	2	6	10	1	2025-04-10	2025-04-10	4.458	4.496	0.7859	0.7868999999999999	0.786	\N	\N	0.17	1.77	1.35	1.097	0.19521999999999998	\N	\N	2025-04-10 00:00:00	2025-12-26 19:42:38.091439
639	182	1	7	5	1	2025-04-25	2025-04-28	7.348	7.542	0.7585999999999999	0.7631999999999999	0.761	7.531	8.34	\N	\N	\N	\N	0.14228	\N	\N	2025-04-25 00:00:00	2025-12-26 19:42:38.193576
654	182	2	6	10	1	2025-04-24	2025-04-24	4.351	5.033	0.7606999999999999	0.7918999999999999	0.776	\N	\N	8.47	0.55	5.24	4.753	0.18710000000000002	\N	\N	2025-04-24 00:00:00	2025-12-26 19:42:38.222813
680	182	2	6	10	4	2025-04-29	2025-04-29	6.004	6.1	0.804	0.8049	0.804	\N	\N	2.39	2.34	0.14	1.623	0.12804000000000001	\N	\N	2025-04-29 00:00:00	2025-12-26 19:42:38.224736
681	187	2	6	10	4	2025-06-03	2025-06-03	5.207	7.161	0.8053	0.8037000000000001	0.804	\N	\N	0.96	3.06	0.18	1.4	0.22021999999999997	\N	\N	2025-06-03 00:00:00	2025-12-26 19:42:38.625946
637	188	2	6	10	1	2025-06-05	2025-06-06	4.133	4.016	0.7633	0.7542	0.759	\N	\N	5.16	0.99	1.28	2.477	0.11849999999999998	\N	\N	2025-06-05 00:00:00	2025-12-26 19:42:38.693075
665	188	2	6	10	4	2025-06-10	2025-06-10	5.49	5.56	0.7831999999999999	0.7918999999999999	0.788	\N	\N	3.19	1.32	2.85	2.453	0.15496000000000001	\N	\N	2025-06-10 00:00:00	2025-12-26 19:42:38.695023
652	189	2	6	10	1	2025-06-12	2025-06-12	4.437	4.245	0.7837999999999999	0.7648	0.774	\N	\N	1.54	1.37	5.53	2.813	0.16777999999999998	\N	\N	2025-06-12 00:00:00	2025-12-26 19:42:38.768596
636	190	2	6	10	1	2025-06-19	2025-06-19	4.55	4.822	0.7576	0.7573000000000001	0.757	\N	\N	5.22	10.26	4.51	6.663	0.21960000000000002	\N	\N	2025-06-19 00:00:00	2025-12-26 19:42:38.847896
663	191	2	6	10	1	2025-06-26	2025-06-26	5.473	5.568	0.7886	0.7843000000000001	0.786	\N	\N	9.86	1.85	0.5	4.07	0.20352	\N	\N	2025-06-26 00:00:00	2025-12-26 19:42:38.921295
661	191	2	6	10	4	2025-07-01	2025-07-01	7.391	7.289	0.8061	0.7661	0.786	\N	\N	5.41	3.44	9.18	6.01	0.19512000000000002	\N	\N	2025-07-01 00:00:00	2025-12-26 19:42:38.923106
647	192	1	8	2	1	2025-07-09	2025-07-09	7.609	7.781	0.7725	0.7718	0.772	7.822	7.42	0.28	1.4	5.18	2.287	0.03239	\N	\N	2025-07-09 00:00:00	2025-12-26 19:42:38.937622
650	193	2	6	10	1	2025-07-10	2025-07-11	5.253	4.875	0.7720999999999999	0.7752	0.774	\N	\N	4.45	9.11	2.3	5.287	0.19017	\N	\N	2025-07-10 00:00:00	2025-12-26 19:42:39.051516
672	193	2	6	10	2	2025-07-11	2025-07-11	4.577	4.98	0.7894	0.7979	0.794	\N	\N	1.18	2.99	3.11	2.427	0.20899	\N	\N	2025-07-11 00:00:00	2025-12-26 19:42:39.053483
656	194	1	8	2	1	2025-07-22	2025-07-24	7.708	7.685	0.7809	0.778	0.779	7.656	8.37	1.53	1.27	2.39	1.73	0.04734	\N	\N	2025-07-22 00:00:00	2025-12-26 19:42:39.077743
676	194	2	6	10	2	2025-07-18	2025-07-18	5.307	4.9	0.8005	0.7997	0.8	\N	\N	7.24	3.18	4.02	4.813	0.15032	\N	\N	2025-07-18 00:00:00	2025-12-26 19:42:39.104737
659	194	2	6	10	3	2025-07-21	2025-07-21	5.971	5.237	0.7897	0.7707999999999999	0.78	\N	\N	3.06	0.69	5.68	3.143	0.16232	\N	\N	2025-07-21 00:00:00	2025-12-26 19:42:39.106573
671	194	2	6	10	4	2025-07-22	2025-07-22	6.949	5.138	0.7990999999999999	0.7846	0.792	\N	\N	4.21	2.65	2.84	3.233	0.12398999999999999	\N	\N	2025-07-22 00:00:00	2025-12-26 19:42:39.108332
678	196	2	6	10	4	2025-08-05	2025-08-06	5.608	5.221	0.8026000000000001	0.7995	0.801	\N	\N	4.51	4.18	2.03	3.573	0.22960999999999998	\N	\N	2025-08-05 00:00:00	2025-12-26 19:42:39.253406
667	197	2	6	10	2	2025-08-08	2025-08-08	5.629	5.323	0.7936	0.7856000000000001	0.79	\N	\N	3.6	3.12	1.84	2.853	0.16394999999999998	\N	\N	2025-08-08 00:00:00	2025-12-26 19:42:39.291909
653	197	2	6	10	4	2025-08-12	2025-08-13	5.418	4.618	0.7722	0.779	0.776	\N	\N	1.27	3.19	5.89	3.45	0.11064	\N	\N	2025-08-12 00:00:00	2025-12-26 19:42:39.310205
648	198	2	6	10	4	2025-08-19	2025-08-19	4.804	4.239	0.7837000000000001	0.7619	0.773	\N	\N	5.14	7.05	2.08	4.757	0.01957	\N	\N	2025-08-19 00:00:00	2025-12-26 19:42:39.346007
657	199	1	8	2	1	2025-08-27	2025-08-27	7.199	7.629	0.7776000000000001	0.7814	0.78	7.503	7.7	5.28	1.99	1.26	2.843	0.01845	\N	\N	2025-08-27 00:00:00	2025-12-26 19:42:39.381175
669	199	2	6	10	2	2025-08-22	2025-08-22	6.1	6.829	0.7962	0.7853	0.791	\N	\N	1.11	4.99	3.09	3.063	0.15541	\N	\N	2025-08-22 00:00:00	2025-12-26 19:42:39.38481
645	199	2	6	10	1	2025-08-21	2025-08-21	5.369	5.801	0.7773	0.7622	0.77	\N	\N	1.8	5.91	1.01	2.907	0.12827	\N	\N	2025-08-21 00:00:00	2025-12-26 19:42:39.386603
682	187	2	6	10	3	2025-06-02	2025-06-02	7.656	7.241	0.8029999999999999	0.8062999999999999	0.8047	\N	\N	1.31	5.26	0.38	2.32	\N	\N	\N	2025-06-02 00:00:00	2025-06-02 00:00:00
691	200	2	6	10	3	2025-09-01	2025-09-02	7.744	6.699	0.8119	0.8126000000000001	0.8123	\N	\N	3.73	6.54	0.76	3.68	\N	\N	\N	2025-09-01 00:00:00	2025-09-01 00:00:00
693	180	2	6	10	4	2025-04-15	2025-04-15	7.291	7.223	0.8183	0.8136	0.816	\N	\N	5.36	0.42	4.67	3.48	\N	\N	\N	2025-04-15 00:00:00	2025-04-15 00:00:00
694	192	2	6	10	3	2025-07-14	2025-07-14	7.033	7.688	0.8148000000000001	0.818	0.8164	\N	\N	6.85	1.79	2.34	3.66	\N	\N	\N	2025-07-14 00:00:00	2025-07-14 00:00:00
696	188	2	6	10	3	2025-06-09	2025-06-09	5.492	5.844	0.8203	0.8148000000000001	0.8176000000000001	\N	\N	3.26	0.85	1.82	1.98	\N	\N	\N	2025-06-09 00:00:00	2025-06-09 00:00:00
701	180	2	6	10	3	2025-04-14	2025-04-14	6.565	7.653	0.8317	0.8075	0.8195999999999999	\N	\N	1.47	0.33	0.49	0.76	\N	\N	\N	2025-04-14 00:00:00	2025-04-14 00:00:00
702	170	2	6	10	4	2025-02-05	2025-02-06	6.397	4.597	0.8315	0.8092	0.8204	\N	\N	2.31	0.71	0.12	1.05	\N	\N	\N	2025-02-05 00:00:00	2025-02-05 00:00:00
1365	176	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.019	2025-12-26 19:49:28.960181	2025-12-26 19:49:28.961736
707	179	2	6	10	3	2025-04-07	2025-04-07	6.173	5.33	0.8320000000000001	0.8212	0.8266	\N	\N	1.73	9.63	7.4	6.25	\N	\N	\N	2025-04-07 00:00:00	2025-04-07 00:00:00
708	181	2	6	10	3	2025-04-21	2025-04-21	8.825	6.783	0.8245999999999999	0.8292	0.8269	\N	\N	6.68	9.78	8.42	8.29	\N	\N	\N	2025-04-21 00:00:00	2025-04-21 00:00:00
710	171	2	6	10	4	2025-02-10	2025-02-10	6.118	5.665	0.8227	0.8325	0.8276	\N	\N	0.97	1.91	0.24	1.04	\N	\N	\N	2025-02-10 00:00:00	2025-02-10 00:00:00
713	182	2	6	10	3	2025-04-28	2025-04-28	6.938	5.893	0.8308	0.8276	0.8292	\N	\N	9.72	2.42	1.76	4.63	\N	\N	\N	2025-04-28 00:00:00	2025-04-28 00:00:00
714	170	2	6	10	3	2025-02-03	2025-02-03	6.05	6.284	0.8432	0.8351000000000001	0.8392000000000001	\N	\N	0.39	6.69	8.13	5.07	\N	\N	\N	2025-02-03 00:00:00	2025-02-03 00:00:00
1367	177	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.019	2025-12-26 19:49:29.080061	2025-12-26 19:49:29.081956
724	174	2	5	3	1	2025-02-28	2025-03-03	3.346	3.102	0.0993	0.1017	0.1005	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-28 00:00:00	2025-02-28 00:00:00
725	175	2	5	7	1	2025-03-06	2025-03-06	3.178	3.263	0.1052	0.1016	0.10339999999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-06 00:00:00	2025-03-06 00:00:00
729	178	2	5	3	1	2025-03-26	2025-03-26	3.226	2.987	0.10880000000000001	0.1107	0.10980000000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-26 00:00:00	2025-03-26 00:00:00
720	167	2	5	7	1	2025-01-03	2025-01-09	4.645	4.008	0.1005	0.0967	0.099	\N	\N	\N	\N	\N	\N	0.04922000000000001	\N	\N	2025-01-03 00:00:00	2025-12-26 19:42:37.194139
726	168	2	2	3	1	2025-01-13	2025-01-13	1.605	1.356	0.10679999999999999	0.10679999999999999	0.107	\N	\N	5.42	1.49	2.59	3.167	0.17128	\N	\N	2025-01-13 00:00:00	2025-12-26 19:42:37.271213
718	168	2	2	3	2	2025-01-13	2025-01-13	1.376	1.477	0.0966	0.09820000000000001	0.097	\N	\N	3.83	2.91	4.15	3.63	0.17892	\N	\N	2025-01-13 00:00:00	2025-12-26 19:42:37.273009
715	168	2	2	3	4	2025-01-15	2025-01-15	1.547	1.532	0.0818	0.0799	0.081	\N	\N	1.45	1.24	2.54	1.743	0.22002	\N	\N	2025-01-15 00:00:00	2025-12-26 19:42:37.276601
723	169	2	2	7	1	2025-01-22	2025-01-22	1.438	1.436	0.10060000000000001	0.09960000000000001	0.1	\N	\N	0.28	1.19	13.41	4.96	0.14007	\N	\N	2025-01-22 00:00:00	2025-12-26 19:42:37.312391
719	170	2	5	7	1	2025-01-28	2025-01-28	3.153	3.615	0.1008	0.0942	0.098	\N	\N	\N	\N	\N	\N	0.01884	\N	\N	2025-01-28 00:00:00	2025-12-26 19:42:37.325041
722	170	2	5	3	1	2025-01-29	2025-01-29	3.26	3.143	0.10400000000000001	0.0956	0.1	\N	\N	\N	\N	\N	\N	0.24527000000000004	\N	\N	2025-01-29 00:00:00	2025-12-26 19:42:37.326867
728	170	2	2	3	1	2025-01-27	2025-01-27	1.304	1.357	0.1081	0.10800000000000001	0.108	\N	\N	6.24	2.29	2.78	3.77	0.14917	\N	\N	2025-01-27 00:00:00	2025-12-26 19:42:37.335863
727	170	2	2	3	2	2025-01-27	2025-01-27	1.47	1.578	0.1067	0.10830000000000001	0.108	\N	\N	7.31	3.94	8.66	6.637	0.14144	\N	\N	2025-01-27 00:00:00	2025-12-26 19:42:37.337633
717	170	2	2	3	3	2025-01-27	2025-01-27	1.555	1.428	0.1016	0.0925	0.097	\N	\N	12.12	0.75	4.1	5.657	0.30883	\N	\N	2025-01-27 00:00:00	2025-12-26 19:42:37.339434
1028	171	1	6	10	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.17937	\N	\N	2025-12-26 19:42:37.518128	2025-12-26 19:42:37.520291
1031	171	1	2	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.15068	\N	\N	2025-12-26 19:42:37.528684	2025-12-26 19:42:37.530824
703	172	2	6	10	3	2025-02-15	2025-02-18	4.553	5.053	0.8187000000000001	0.8229000000000001	0.821	\N	\N	0.91	1.88	0.4	1.063	0.17939	\N	\N	2025-02-15 00:00:00	2025-12-26 19:42:37.590163
686	173	2	6	10	3	2025-02-22	2025-02-22	4.578	4.958	0.8068000000000001	0.8104	0.809	\N	\N	0.41	1.68	1.94	1.343	0.19793	\N	\N	2025-02-22 00:00:00	2025-12-26 19:42:37.640517
695	173	2	6	10	4	2025-02-25	2025-02-25	4.823	4.325	0.8256	0.8095	0.818	\N	\N	2.94	1.85	1.49	2.093	0.16107	\N	\N	2025-02-25 00:00:00	2025-12-26 19:42:37.642403
721	177	2	5	3	1	2025-03-19	2025-03-19	3.321	3.402	0.09949999999999999	0.099	0.099	\N	\N	\N	\N	\N	\N	0.18031	\N	\N	2025-03-19 00:00:00	2025-12-26 19:42:37.907325
705	178	2	6	10	4	2025-04-01	2025-04-01	5.119	4.611	0.8258	0.8176000000000001	0.822	\N	\N	3.3	0.41	0.16	1.29	0.20750999999999997	\N	\N	2025-04-01 00:00:00	2025-12-26 19:42:38.000197
689	179	2	6	10	4	2025-04-08	2025-04-08	6.738	6.578	0.8116	0.8065000000000001	0.809	\N	\N	9.1	0.75	7.17	5.673	0.24097000000000002	\N	\N	2025-04-08 00:00:00	2025-12-26 19:42:38.056884
711	181	2	6	10	4	2025-04-22	2025-04-22	5.474	5.262	0.8271999999999999	0.8295999999999999	0.828	\N	\N	0.71	7.81	2.81	3.777	0.16608	\N	\N	2025-04-22 00:00:00	2025-12-26 19:42:38.15462
688	189	2	6	10	2	2025-06-13	2025-06-16	6.279	6.238	0.8118000000000001	0.8062	0.809	\N	\N	5.09	1.15	0.95	2.397	0.18913	\N	\N	2025-06-13 00:00:00	2025-12-26 19:42:38.770441
699	189	2	6	10	3	2025-06-16	2025-06-16	6.713	7.679	0.8294	0.8077	0.819	\N	\N	0.68	4.35	0.29	1.773	0.20925999999999995	\N	\N	2025-06-16 00:00:00	2025-12-26 19:42:38.772273
690	189	2	6	10	4	2025-06-17	2025-06-17	6.714	6.814	0.8086	0.8136	0.811	\N	\N	4.42	6.27	0.97	3.887	0.19179	\N	\N	2025-06-17 00:00:00	2025-12-26 19:42:38.774126
712	190	2	6	10	3	2025-06-24	2025-06-24	7.714	7.638	0.8378	0.8193	0.829	\N	\N	0.33	0.98	3.62	1.643	0.20575	\N	\N	2025-06-24 00:00:00	2025-12-26 19:42:38.849721
698	190	2	6	10	4	2025-06-24	2025-06-24	6.284	6.303	0.8134999999999999	0.8231	0.818	\N	\N	5.56	0.68	2.48	2.907	0.18939	\N	\N	2025-06-24 00:00:00	2025-12-26 19:42:38.851511
685	192	2	6	10	4	2025-07-08	2025-07-09	7.004	7.401	0.8073	0.8078	0.808	\N	\N	0.56	1.05	1.52	1.043	0.18975	\N	\N	2025-07-08 00:00:00	2025-12-26 19:42:38.99502
700	193	2	6	10	4	2025-07-15	2025-07-15	5.592	5.291	0.8173999999999999	0.8203	0.819	\N	\N	2.89	3.41	2.19	2.83	0.1253	\N	\N	2025-07-15 00:00:00	2025-12-26 19:42:39.059191
697	195	2	6	10	3	2025-07-28	2025-07-28	5.589	5.856	0.8157	0.82	0.818	\N	\N	2.35	3.28	8.64	4.757	0.1568	\N	\N	2025-07-28 00:00:00	2025-12-26 19:42:39.155073
684	196	2	6	10	3	2025-08-04	2025-08-04	6.476	5.932	0.8062999999999999	0.8061	0.806	\N	\N	3.78	4.55	1.18	3.17	0.17584	\N	\N	2025-08-04 00:00:00	2025-12-26 19:42:39.266739
687	197	2	6	10	3	2025-08-11	2025-08-11	6.287	5.887	0.8089	0.809	0.809	\N	\N	1.56	3.91	0.98	2.15	0.17283	\N	\N	2025-08-11 00:00:00	2025-12-26 19:42:39.31784
709	199	2	6	10	3	2025-08-25	2025-08-25	5.474	5.672	0.826	0.8288	0.827	\N	\N	2.78	3.77	2.78	3.11	0.145	\N	\N	2025-08-25 00:00:00	2025-12-26 19:42:39.377574
683	199	2	6	10	4	2025-08-26	2025-08-27	6.48	5.739	0.8046	0.8053	0.805	\N	\N	2.02	3	6.01	3.677	0.16652	\N	\N	2025-08-26 00:00:00	2025-12-26 19:42:39.399531
1378	181	1	13	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.006	0.018	2025-12-26 19:49:29.221551	2025-12-26 19:49:29.223014
737	176	2	5	3	1	2025-03-11	2025-03-12	3.093	3.273	0.1316	0.1085	0.1201	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-11 00:00:00	2025-03-11 00:00:00
738	178	2	5	7	1	2025-03-26	2025-03-26	3.207	3.582	0.1195	0.1243	0.1219	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-26 00:00:00	2025-03-26 00:00:00
739	178	2	2	3	2	2025-03-25	2025-03-25	1.354	1.554	0.12480000000000001	0.1217	0.1233	\N	\N	0.27	1.52	2.58	1.46	\N	\N	\N	2025-03-25 00:00:00	2025-03-25 00:00:00
741	175	2	5	3	1	2025-03-07	2025-03-07	3.446	2.996	0.1325	0.1286	0.1306	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-07 00:00:00	2025-03-07 00:00:00
666	179	1	8	2	1	2025-04-08	2025-04-08	7.757	8.017	0.7890999999999999	0.7898000000000001	0.789	\N	\N	1.636	1.44	1.57	1.549	0.12355000000000001	0.004	0.019	2025-04-08 00:00:00	2025-12-26 19:49:29.074171
744	175	2	2	3	3	2025-03-05	2025-03-06	1.665	1.445	0.1417	0.1338	0.1378	\N	\N	2.66	10.26	8.05	6.99	\N	\N	\N	2025-03-05 00:00:00	2025-03-05 00:00:00
745	166	2	2	7	1	2025-01-02	2025-01-02	1.406	1.466	0.14300000000000002	0.13390000000000002	0.13849999999999998	\N	\N	1.01	2.61	2.24	1.95	\N	\N	\N	2025-01-02 00:00:00	2025-01-02 00:00:00
748	178	2	2	3	1	2025-03-25	2025-03-25	1.361	1.321	0.1401	0.1413	0.1407	\N	\N	5.17	1.71	1.17	2.68	\N	\N	\N	2025-03-25 00:00:00	2025-03-25 00:00:00
1368	177	1	13	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.006	0.015	2025-12-26 19:49:29.086823	2025-12-26 19:49:29.088769
752	174	2	2	3	3	2025-02-28	2025-03-03	1.557	1.761	0.1412	0.15439999999999998	0.1478	\N	\N	9.03	0.58	3.93	4.51	\N	\N	\N	2025-02-28 00:00:00	2025-02-28 00:00:00
754	175	2	2	3	2	2025-03-05	2025-03-05	1.95	1.479	0.1607	0.1507	0.1557	\N	\N	1.76	1.45	5.33	2.85	\N	\N	\N	2025-03-05 00:00:00	2025-03-05 00:00:00
755	179	2	2	3	1	2025-03-31	2025-03-31	1.582	1.681	0.1572	0.1547	0.156	\N	\N	3.28	0.54	5.73	3.18	\N	\N	\N	2025-03-31 00:00:00	2025-03-31 00:00:00
756	175	2	2	3	4	2025-03-06	2025-03-06	1.637	1.306	0.1631	0.1593	0.1612	\N	\N	3.04	8.51	2.74	4.76	\N	\N	\N	2025-03-06 00:00:00	2025-03-06 00:00:00
759	179	2	2	3	2	2025-03-31	2025-03-31	1.526	1.562	0.19899999999999998	0.1967	0.1979	\N	\N	1.81	7.76	2.6	4.06	\N	\N	\N	2025-03-31 00:00:00	2025-03-31 00:00:00
761	175	2	2	3	1	2025-03-05	2025-03-06	1.421	1.419	0.2132	0.21969999999999998	0.2165	\N	\N	3.58	10.43	2.33	5.45	\N	\N	\N	2025-03-05 00:00:00	2025-03-05 00:00:00
762	176	2	2	3	3	2025-03-13	2025-03-13	1.678	1.487	0.2938	0.3193	0.3066	\N	\N	4.72	3.76	2.16	3.55	\N	\N	\N	2025-03-13 00:00:00	2025-03-13 00:00:00
765	178	2	2	7	1	2025-03-26	2025-03-26	1.289	1.582	0.3862	0.40340000000000004	0.3948	\N	\N	0.73	8.12	2.58	3.81	\N	\N	\N	2025-03-26 00:00:00	2025-03-26 00:00:00
767	168	2	1	11	1	2025-01-13	2025-01-13	2.995	3.085	0.41850000000000004	0.4118	0.4152	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-01-13 00:00:00	2025-01-13 00:00:00
768	175	2	1	7	1	2025-03-05	2025-03-05	2.971	3.492	0.4115	0.4349	0.4232	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-05 00:00:00	2025-03-05 00:00:00
769	168	2	1	11	2	2025-01-13	2025-01-13	3.916	3.181	0.46950000000000003	0.45030000000000003	0.45990000000000003	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-01-13 00:00:00	2025-01-13 00:00:00
770	175	2	1	9	2	2025-03-05	2025-03-06	3.585	3.247	0.4777	0.45990000000000003	0.46880000000000005	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-05 00:00:00	2025-03-05 00:00:00
771	176	2	1	11	1	2025-03-12	2025-03-12	3.011	3.018	0.4855	0.4711	0.4783	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-12 00:00:00	2025-03-12 00:00:00
775	176	2	1	9	2	2025-03-13	2025-03-13	3.125	3.848	0.4928	0.5085000000000001	0.5007	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-13 00:00:00	2025-03-13 00:00:00
781	176	2	1	9	1	2025-03-12	2025-03-12	3.08	3.287	0.516	0.5372	0.5266	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-12 00:00:00	2025-03-12 00:00:00
776	167	2	1	3	2	2025-01-06	2025-01-08	2.425	2.454	0.5143	0.4943	0.504	\N	4.64	\N	\N	\N	\N	0.0718	\N	\N	2025-01-06 00:00:00	2025-12-26 19:42:37.190216
764	167	2	1	3	3	2025-01-06	2025-01-08	1.792	1.358	0.35619999999999996	0.3542	0.355	\N	\N	\N	\N	\N	\N	0.00487	\N	\N	2025-01-06 00:00:00	2025-12-26 19:42:37.192169
750	167	2	2	7	1	2025-01-08	2025-01-08	1.779	1.404	0.1404	0.1435	0.142	\N	\N	1.58	1.01	2.35	1.647	0.22222	\N	\N	2025-01-08 00:00:00	2025-12-26 19:42:37.224268
731	167	2	2	3	1	2025-01-08	2025-01-07	1.352	1.393	0.1158	0.111	0.113	\N	\N	1.27	0.56	3.71	1.847	0.21143	\N	\N	2025-01-08 00:00:00	2025-12-26 19:42:37.226129
736	167	2	2	3	2	2025-01-08	2025-01-07	1.128	1.278	0.121	0.1183	0.12	\N	\N	\N	\N	\N	\N	0.21549999999999997	\N	\N	2025-01-08 00:00:00	2025-12-26 19:42:37.227916
779	168	2	1	9	1	2025-01-15	2025-01-15	3.152	3.506	0.5173	0.516	0.517	6.729	3.47	\N	\N	\N	\N	0.02428	\N	\N	2025-01-15 00:00:00	2025-12-26 19:42:37.247022
753	168	2	5	3	1	2025-01-15	2025-01-15	4.062	3.054	0.184	0.1183	0.151	7.567	7.96	\N	\N	\N	\N	0.26205	\N	\N	2025-01-15 00:00:00	2025-12-26 19:42:37.251108
730	168	2	2	3	3	2025-01-13	2025-01-13	1.408	1.432	0.1142	0.1117	0.113	\N	\N	0.45	3.89	0.95	1.763	0.17098	\N	\N	2025-01-13 00:00:00	2025-12-26 19:42:37.274796
766	169	2	1	7	1	2025-01-23	2025-01-23	3.139	3.168	0.44549999999999995	0.3776	0.412	\N	\N	\N	\N	\N	\N	0.01125	\N	\N	2025-01-23 00:00:00	2025-12-26 19:42:37.285606
773	169	2	1	9	1	2025-01-22	2025-01-22	\N	\N	0.49090000000000006	0.489	0.49	\N	\N	\N	\N	\N	\N	0.04721	\N	\N	2025-01-22 00:00:00	2025-12-26 19:42:37.291099
758	169	2	5	7	1	2025-01-21	2025-01-21	3	3.019	0.19579999999999997	0.16949999999999998	0.183	\N	\N	\N	\N	\N	\N	0.03676	\N	\N	2025-01-21 00:00:00	2025-12-26 19:42:37.292854
740	169	2	5	3	1	2025-01-23	2025-01-24	3.242	3.272	0.12960000000000002	0.1186	0.124	\N	\N	\N	\N	\N	\N	0.22960999999999998	\N	\N	2025-01-23 00:00:00	2025-12-26 19:42:37.294649
734	169	2	2	3	2	2025-01-20	2025-01-20	1.438	1.63	0.1188	0.11230000000000001	0.116	\N	\N	2.08	0.77	3.93	2.26	0.14945	\N	\N	2025-01-20 00:00:00	2025-12-26 19:42:37.31615
733	169	2	2	3	3	2025-01-20	2025-01-20	1.429	1.259	0.1176	0.11259999999999999	0.115	\N	\N	14.56	1.72	3.03	6.437	0.08795	\N	\N	2025-01-20 00:00:00	2025-12-26 19:42:37.317892
777	170	2	1	7	1	2025-01-29	2025-01-29	3.574	3.357	0.5156000000000001	0.5003	0.508	\N	\N	\N	\N	\N	\N	0.01714	\N	\N	2025-01-29 00:00:00	2025-12-26 19:42:37.319674
772	170	2	1	9	2	2025-01-29	2025-01-29	3.226	3.007	0.47729999999999995	0.4867	0.482	\N	\N	\N	\N	\N	\N	0.014129999999999998	\N	\N	2025-01-29 00:00:00	2025-12-26 19:42:37.323262
742	170	2	2	7	1	2025-01-30	2025-01-30	1.81	1.632	0.1307	0.138	0.134	\N	\N	1.19	0.57	2.96	1.573	0.12982	\N	\N	2025-01-30 00:00:00	2025-12-26 19:42:37.333999
760	176	2	2	3	1	2025-03-12	2025-03-12	1.691	1.471	0.22460000000000002	0.2075	0.216	\N	\N	0.42	3.25	7.09	3.587	0.17895	\N	\N	2025-03-12 00:00:00	2025-12-26 19:42:37.889327
747	176	2	2	3	2	2025-03-12	2025-03-12	1.451	1.527	0.1387	0.14	0.139	\N	\N	10	1.22	6.98	6.067	0.16094	\N	\N	2025-03-12 00:00:00	2025-12-26 19:42:37.891296
735	176	2	2	3	4	2025-03-12	2025-03-13	1.543	1.497	0.1159	0.11699999999999999	0.116	\N	\N	1.42	7.28	6.39	5.03	0.20243000000000003	\N	\N	2025-03-12 00:00:00	2025-12-26 19:42:37.893115
763	177	2	1	7	1	2025-03-17	2025-03-17	3.047	3.037	0.3356	0.3247	0.33	\N	\N	\N	\N	\N	\N	0.01587	\N	\N	2025-03-17 00:00:00	2025-12-26 19:42:37.901917
778	177	2	1	9	1	2025-03-18	2025-03-18	4.309	3.102	0.5097999999999999	0.5157	0.513	\N	\N	\N	\N	\N	\N	0.010360000000000001	\N	\N	2025-03-18 00:00:00	2025-12-26 19:42:37.903751
780	177	2	1	9	2	2025-03-19	2025-03-19	3.567	3.471	0.5291	0.5199	0.524	\N	\N	\N	\N	\N	\N	0.00951	\N	\N	2025-03-19 00:00:00	2025-12-26 19:42:37.905543
746	177	2	2	3	1	2025-03-18	2025-03-18	1.698	1.635	0.1369	0.1409	0.139	\N	\N	10.69	4.56	1.31	5.52	0.14372	\N	\N	2025-03-18 00:00:00	2025-12-26 19:42:37.909105
751	177	2	2	3	2	2025-03-19	2025-03-19	2.031	1.431	0.138	0.1493	0.144	\N	\N	3.44	6.94	0.6	3.66	0.18878	\N	\N	2025-03-19 00:00:00	2025-12-26 19:42:37.910889
732	177	2	2	3	4	2025-03-20	2025-03-20	1.526	1.429	0.1161	0.11380000000000001	0.115	\N	\N	8.29	1.82	0.62	3.577	0.03381	\N	\N	2025-03-20 00:00:00	2025-12-26 19:42:37.914524
783	174	2	1	9	2	2025-02-28	2025-03-03	3.323	3.458	0.4986	0.5587	0.5287	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-28 00:00:00	2025-02-28 00:00:00
784	178	2	1	7	1	2025-03-26	2025-03-26	3.241	3.761	0.5344	0.5379999999999999	0.5362	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-26 00:00:00	2025-03-26 00:00:00
790	175	2	1	9	1	2025-03-05	2025-03-05	3.052	3.076	0.5617	0.6206	0.5912	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-05 00:00:00	2025-03-05 00:00:00
787	174	2	4	3	1	2025-02-28	2025-03-03	7.619	7.272	0.5711999999999999	0.5937	0.582	7.94	8.09	\N	\N	\N	\N	\N	0.014	0.034	2025-02-28 00:00:00	2025-12-26 19:49:28.809473
794	178	2	4	7	1	2025-03-26	2025-03-26	6.999	7.621	0.6054999999999999	0.6082	0.6069	7.521	8.24	\N	\N	\N	\N	\N	\N	\N	2025-03-26 00:00:00	2025-03-26 00:00:00
810	166	1	7	5	1	2025-01-03	2025-01-07	5.669	6.099	0.6437	0.6018	0.6228	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-01-03 00:00:00	2025-01-03 00:00:00
788	174	2	4	3	2	2025-03-01	2025-03-03	6.948	6.646	0.5811999999999999	0.5882999999999999	0.585	7.702	8.45	\N	\N	\N	\N	\N	0.017	0.04	2025-03-01 00:00:00	2025-12-26 19:49:28.815587
820	166	1	13	3	7	2025-01-23	2025-01-24	\N	\N	0.6304	0.6253	0.6279	\N	7.86	1.92	5.1	1.84	2.95	\N	\N	\N	2025-01-23 00:00:00	2025-01-23 00:00:00
821	174	1	13	3	8	2025-03-20	2025-03-20	7.188	7.263	0.6325	0.6241	0.6283	\N	\N	0.37	0.58	2.63	1.19	\N	\N	\N	2025-03-20 00:00:00	2025-03-20 00:00:00
822	173	1	13	3	8	2025-03-14	2025-03-14	6.781	7.823	0.6311	0.6275	0.6293	7.76	7.67	1.73	0.28	3.77	1.93	\N	\N	\N	2025-03-14 00:00:00	2025-03-14 00:00:00
825	173	1	13	3	4	2025-03-13	2025-03-13	7.661	7.54	0.638	0.6213000000000001	0.6297	7.59	7.62	0.6	0.41	1.77	0.93	\N	\N	\N	2025-03-13 00:00:00	2025-03-13 00:00:00
785	175	2	4	3	2	2025-03-06	2025-03-06	7.937	7.67	0.5718	0.5302	0.551	8.108	8	\N	\N	\N	\N	\N	0.021	0.046	2025-03-06 00:00:00	2025-12-26 19:49:28.826058
830	174	1	13	3	5	2025-03-20	2025-03-20	7.183	7.342	0.633	0.6295000000000001	0.6313	7.666	7.51	0.42	0.57	0.68	0.56	\N	\N	\N	2025-03-20 00:00:00	2025-03-20 00:00:00
831	175	1	13	3	7	2025-03-27	2025-03-27	7.135	7.531	0.6339	0.6299	0.6319	7.553	7.39	1.85	0.42	3.39	1.89	\N	\N	\N	2025-03-27 00:00:00	2025-03-27 00:00:00
803	176	2	4	3	1	2025-03-12	2025-03-12	7.213	6.995	0.6239	0.6114	0.618	\N	\N	\N	\N	\N	\N	\N	0.019	0.05	2025-03-12 00:00:00	2025-12-26 19:49:28.847119
828	163	1	13	3	5	2025-01-03	2025-01-03	6.754	7.035	0.635	0.6251	0.63	\N	\N	0.65	1.33	0.41	0.797	0.23388999999999996	\N	\N	2025-01-03 00:00:00	2025-12-26 19:42:37.078442
827	164	1	13	3	1	2025-01-09	2025-01-09	5.495	6.928	0.6361	0.6236	0.63	\N	8.12	\N	\N	\N	\N	0.27141	\N	\N	2025-01-09 00:00:00	2025-12-26 19:42:37.091846
801	164	1	13	3	2	2025-01-09	2025-01-09	5.77	5.491	0.6217	0.6106	0.616	\N	7.85	\N	\N	\N	\N	0.27159	\N	\N	2025-01-09 00:00:00	2025-12-26 19:42:37.094399
795	164	1	13	3	3	2025-01-09	2025-01-09	6.362	6.183	0.6275999999999999	0.5898	0.609	\N	7.9	\N	\N	\N	\N	0.25988	\N	\N	2025-01-09 00:00:00	2025-12-26 19:42:37.096804
807	164	1	13	3	9	2025-01-10	2025-01-10	5.42	5.677	0.6159	0.6273	0.622	\N	\N	\N	\N	\N	\N	0.25703	\N	\N	2025-01-10 00:00:00	2025-12-26 19:42:37.111203
789	166	1	7	6	1	2025-01-07	2025-01-07	5.823	5.578	0.6106	0.563	0.587	\N	\N	\N	\N	\N	\N	0.25257	\N	\N	2025-01-07 00:00:00	2025-12-26 19:42:37.148449
829	166	1	13	3	1	2025-01-22	2025-01-22	7.47	7.09	0.6384000000000001	0.624	0.631	7.523	8.06	0.35	0.38	1.41	0.713	0.27863	\N	\N	2025-01-22 00:00:00	2025-12-26 19:42:37.154683
802	166	1	13	3	3	2025-01-23	2025-01-23	6.236	6.836	0.6209	0.6124	0.617	8.371	7.82	1.34	7.11	2.32	3.59	0.28371999999999997	\N	\N	2025-01-23 00:00:00	2025-12-26 19:42:37.15864
812	166	1	13	3	4	2025-01-23	2025-01-23	6.843	6.933	0.6297	0.6183	0.624	7.514	7.96	1.01	4.87	2.02	2.633	0.27649	\N	\N	2025-01-23 00:00:00	2025-12-26 19:42:37.16071
823	166	1	13	3	5	2025-01-23	2025-01-23	7.022	7.173	0.6302	0.629	0.63	7.658	7.8	4.26	2.94	1.71	2.97	0.27791	\N	\N	2025-01-23 00:00:00	2025-12-26 19:42:37.162805
824	166	1	13	3	6	2025-01-23	2025-01-23	7.001	7.69	0.6315	0.6277	0.63	7.589	7.89	2.8	5.02	2.17	3.33	0.28489000000000003	\N	\N	2025-01-23 00:00:00	2025-12-26 19:42:37.164754
817	166	1	13	3	8	2025-01-23	2025-01-23	7.333	6.68	0.6296	0.6229	0.626	\N	7.81	2.07	6.05	0.66	2.927	0.27879000000000004	\N	\N	2025-01-23 00:00:00	2025-12-26 19:42:37.166656
819	167	2	4	7	1	2025-01-02	2025-01-08	8.942	9.362	0.6306	0.625	0.628	\N	8.76	\N	\N	\N	\N	0.19890999999999998	\N	\N	2025-01-02 00:00:00	2025-12-26 19:42:37.198265
816	167	2	4	3	1	2025-01-10	2025-01-10	6.367	\N	0.6518999999999999	0.6001	0.626	\N	\N	\N	\N	\N	\N	0.24153	\N	\N	2025-01-10 00:00:00	2025-12-26 19:42:37.204177
791	167	1	13	3	1	2025-01-30	2025-01-30	7.081	7.483	0.5936	0.6018	0.598	7.717	7.78	\N	\N	\N	\N	0.32	\N	\N	2025-01-30 00:00:00	2025-12-26 19:42:37.211662
792	167	1	13	3	7	2025-01-31	2025-01-31	7.309	7.646	0.599	0.6021	0.601	7.824	7.93	\N	\N	\N	\N	0.32397	\N	\N	2025-01-31 00:00:00	2025-12-26 19:42:37.215191
798	167	1	13	3	8	2025-01-31	2025-01-31	6.932	6.925	0.6104999999999999	0.6097	0.61	8.074	7.8	\N	\N	\N	\N	0.21899999999999997	\N	\N	2025-01-31 00:00:00	2025-12-26 19:42:37.217037
808	168	2	4	7	1	2025-01-16	2025-01-16	7.078	7.54	0.6297999999999999	0.6148	0.622	7.744	7.91	\N	\N	\N	\N	0.13475	\N	\N	2025-01-16 00:00:00	2025-12-26 19:42:37.252977
818	168	2	4	3	1	2025-01-16	2025-01-16	7.51	6.655	0.6402	0.6147	0.627	7.664	8.09	\N	\N	\N	\N	0.25615	\N	\N	2025-01-16 00:00:00	2025-12-26 19:42:37.258422
805	168	2	4	3	2	2025-01-17	2025-01-20	6.864	7.241	0.6303	0.6082	0.619	7.774	8.14	\N	\N	\N	\N	0.25812	\N	\N	2025-01-17 00:00:00	2025-12-26 19:42:37.260204
796	169	2	4	7	1	2025-01-21	2025-01-21	6.682	7.04	0.6208	0.5968	0.609	7.522	8.19	\N	\N	\N	\N	0.11188999999999999	\N	\N	2025-01-21 00:00:00	2025-12-26 19:42:37.296397
782	170	2	1	9	1	2025-01-28	2025-01-29	3.341	3.391	0.5389	0.518	0.528	\N	\N	\N	\N	\N	\N	0.02154	\N	\N	2025-01-28 00:00:00	2025-12-26 19:42:37.321443
806	167	1	13	3	5	2025-01-31	2025-01-31	7.203	7.072	0.6209	0.6188	0.62	7.646	8.06	\N	\N	\N	\N	0.31745	\N	\N	2025-01-31 00:00:00	2025-12-26 19:42:37.34118
800	167	1	13	3	6	2025-01-31	2025-01-31	7.125	7.326	0.6106	0.6131	0.612	7.85	7.97	\N	\N	\N	\N	0.32155	\N	\N	2025-01-31 00:00:00	2025-12-26 19:42:37.343011
804	167	1	13	3	3	2025-01-30	2025-01-30	7.068	6.95	0.624	0.6128	0.618	\N	7.81	\N	\N	\N	\N	0.32699	\N	\N	2025-01-30 00:00:00	2025-12-26 19:42:37.344816
797	167	1	13	3	4	2025-01-30	2025-01-31	7.509	7.702	0.6082	0.6101	0.609	7.59	7.78	\N	\N	\N	\N	0.31608	\N	\N	2025-01-30 00:00:00	2025-12-26 19:42:37.346614
813	172	1	13	3	3	2025-03-06	2025-03-06	7.02	7.51	0.6282	0.62	0.624	7.582	7.56	1.54	10.23	2.91	4.893	0.24353	\N	\N	2025-03-06 00:00:00	2025-12-26 19:42:37.721996
786	177	2	4	7	1	2025-03-19	2025-03-20	7.31	7.84	0.5875	0.5740999999999999	0.581	8.411	8.41	\N	\N	\N	\N	0.12908	\N	\N	2025-03-19 00:00:00	2025-12-26 19:42:37.953428
814	177	2	4	3	2	2025-03-20	2025-03-20	6.94	6.243	0.63	0.6198	0.625	\N	\N	\N	\N	\N	\N	\N	0.019	0.051	2025-03-20 00:00:00	2025-12-26 19:49:28.884469
811	176	2	4	3	2	2025-03-13	2025-03-13	7.543	7.622	0.6236	0.6228	0.623	\N	\N	\N	\N	\N	\N	\N	0.021	0.057	2025-03-13 00:00:00	2025-12-26 19:49:28.852169
809	177	2	4	3	1	2025-03-20	2025-03-20	6.753	7.142	0.6224000000000001	0.623	0.623	7.613	7.7	\N	\N	\N	\N	0.21969000000000002	0.02	0.052	2025-03-20 00:00:00	2025-12-26 19:49:28.879394
799	178	2	4	3	1	2025-03-27	2025-03-28	7.516	7.415	0.6167	0.6043999999999999	0.611	\N	\N	\N	\N	\N	\N	\N	0.018	0.045	2025-03-27 00:00:00	2025-12-26 19:49:28.913032
832	173	1	13	3	5	2025-03-13	2025-03-13	7.209	7.998	0.6338	0.6309	0.6324000000000001	\N	7.63	1.35	0.33	3.1	1.59	\N	\N	\N	2025-03-13 00:00:00	2025-03-13 00:00:00
833	174	1	13	3	7	2025-03-20	2025-03-20	7.281	7.583	0.6309	0.634	0.6325	\N	7.51	6.66	1.18	0.72	2.85	\N	\N	\N	2025-03-20 00:00:00	2025-03-20 00:00:00
834	173	1	13	3	9	2025-03-14	2025-03-14	8.221	7.117	0.6342	0.6314	0.6328	7.585	7.59	1.78	3.69	0.74	2.07	\N	\N	\N	2025-03-14 00:00:00	2025-03-14 00:00:00
836	173	1	13	3	6	2025-03-13	2025-03-14	\N	\N	0.6336999999999999	0.6335000000000001	0.6335999999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-13 00:00:00	2025-03-13 00:00:00
835	175	2	4	3	1	2025-03-05	2025-03-06	7.132	7.174	0.6501	0.6164999999999999	0.633	7.542	8.11	\N	\N	\N	\N	\N	0.017	0.048	2025-03-05 00:00:00	2025-12-26 19:49:28.82048
841	173	1	13	3	2	2025-03-13	2025-03-13	7.38	7.745	0.6267	0.6442	0.6355	7.506	7.63	2.74	0.39	0.55	1.23	\N	\N	\N	2025-03-13 00:00:00	2025-03-13 00:00:00
842	175	1	13	3	8	2025-03-27	2025-03-27	7.332	6.932	0.6467	0.626	0.6364	7.492	7.31	0.27	0.43	1.26	0.65	\N	\N	\N	2025-03-27 00:00:00	2025-03-27 00:00:00
844	178	2	4	3	2	2025-03-27	2025-03-28	7.2	7.156	0.6339	0.6391	0.637	\N	\N	\N	\N	\N	\N	\N	0.018	0.05	2025-03-27 00:00:00	2025-12-26 19:49:28.91761
846	174	1	13	3	6	2025-03-20	2025-03-20	7.186	7.182	0.6376	0.6382	0.6379	7.538	7.58	9.88	0.4	0.6	3.63	\N	\N	\N	2025-03-20 00:00:00	2025-03-20 00:00:00
850	175	1	13	3	2	2025-03-26	2025-03-26	7.031	7.442	0.6445000000000001	0.6335999999999999	0.6391	8.233	7.69	0.19	0.45	14.79	5.14	\N	\N	\N	2025-03-26 00:00:00	2025-03-26 00:00:00
852	173	1	13	3	7	2025-03-13	2025-03-14	\N	\N	0.6376	0.6409	0.6393	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-13 00:00:00	2025-03-13 00:00:00
853	173	1	13	3	1	2025-03-13	2025-03-13	7.377	6.976	0.6392	0.6404000000000001	0.6397999999999999	8.013	7.8	13.85	1.47	9.69	8.34	\N	\N	\N	2025-03-13 00:00:00	2025-03-13 00:00:00
855	172	1	13	3	4	2025-03-06	2025-03-07	7.445	7.157	0.636	0.6455	0.6408	7.618	7.77	1.66	4.09	2.48	2.74	\N	\N	\N	2025-03-06 00:00:00	2025-03-06 00:00:00
856	178	1	7	2	1	2025-03-31	2025-03-31	7.119	7.141	0.6396000000000001	0.6419	0.6408	7.533	7.79	\N	\N	\N	\N	\N	\N	\N	2025-03-31 00:00:00	2025-03-31 00:00:00
860	173	1	13	3	3	2025-03-13	2025-03-13	7.393	7.215	0.6486	0.6377	0.6431999999999999	7.547	7.62	0.72	0.18	7	2.63	\N	\N	\N	2025-03-13 00:00:00	2025-03-13 00:00:00
861	175	1	13	3	3	2025-03-26	2025-03-26	7.578	7.372	0.6462	0.6406999999999999	0.6435	7.678	7.51	3.02	0.41	0.31	1.25	\N	\N	\N	2025-03-26 00:00:00	2025-03-26 00:00:00
612	180	1	8	2	1	2025-04-15	2025-04-15	7.785	7.385	0.7436	0.7474	0.746	7.839	8.27	6.87	2.85	8.54	6.087	\N	0.005	0.019	2025-04-15 00:00:00	2025-12-26 19:49:29.104035
863	175	1	13	3	1	2025-03-26	2025-03-26	7.709	7.415	0.6389	0.6493000000000001	0.6441	7.772	7.89	0.52	6.34	0.87	2.58	\N	\N	\N	2025-03-26 00:00:00	2025-03-26 00:00:00
866	174	1	13	3	3	2025-03-19	2025-03-19	7.128	7.076	0.6476000000000001	0.6431	0.6454000000000001	7.596	7.21	10.8	2.3	0.4	4.5	\N	\N	\N	2025-03-19 00:00:00	2025-03-19 00:00:00
867	174	1	13	3	1	2025-03-19	2025-03-19	7.004	7.048	0.6489	0.6419	0.6454000000000001	7.716	7.68	0.38	4.18	6.94	3.83	\N	\N	\N	2025-03-19 00:00:00	2025-03-19 00:00:00
870	174	1	13	3	4	2025-03-20	2025-03-20	7.649	7.285	0.6456000000000001	0.6463	0.6459999999999999	7.51	7.42	9.69	2.58	0.89	4.39	\N	\N	\N	2025-03-20 00:00:00	2025-03-20 00:00:00
871	175	1	13	3	4	2025-03-26	2025-03-26	7.835	7.339	0.6469	0.6453	0.6461	7.43	7.44	1.6	0.43	7.55	3.19	\N	\N	\N	2025-03-26 00:00:00	2025-03-26 00:00:00
872	175	1	13	3	5	2025-03-26	2025-03-26	7.467	7.105	0.6446999999999999	0.6475	0.6461	8.42	7.41	0.47	2.87	0.42	1.25	\N	\N	\N	2025-03-26 00:00:00	2025-03-26 00:00:00
873	172	1	13	3	8	2025-03-07	2025-03-10	\N	\N	0.6484000000000001	0.6451	0.6468	\N	7.71	\N	\N	\N	3.21	\N	\N	\N	2025-03-07 00:00:00	2025-03-07 00:00:00
868	163	1	13	3	4	2025-01-02	2025-01-03	6.974	7.077	0.6399	0.6513	0.646	\N	\N	0.43	2.42	0.47	1.107	0.22304	\N	\N	2025-01-02 00:00:00	2025-12-26 19:42:37.073893
847	163	1	13	3	8	2025-01-03	2025-01-03	7.121	6.906	0.6376	0.6385000000000001	0.638	\N	\N	2.27	0.38	7.27	3.307	0.26568	\N	\N	2025-01-03 00:00:00	2025-12-26 19:42:37.089034
851	164	1	13	3	4	2025-01-09	2025-01-09	6.354	7.096	0.6448999999999999	0.6333	0.639	\N	8.23	\N	\N	\N	\N	0.27014	\N	\N	2025-01-09 00:00:00	2025-12-26 19:42:37.099194
849	164	1	13	3	5	2025-01-09	2025-01-09	6.161	5.484	0.6433	0.6334000000000001	0.638	\N	7.98	\N	\N	\N	\N	0.27876999999999996	\N	\N	2025-01-09 00:00:00	2025-12-26 19:42:37.101751
875	164	1	13	3	6	2025-01-10	2025-01-10	6.362	5.935	0.6401	0.6544	0.647	\N	8.35	\N	\N	\N	\N	0.27091	\N	\N	2025-01-10 00:00:00	2025-12-26 19:42:37.104326
865	165	1	13	3	1	2025-01-15	2025-01-15	7.32	7.063	0.6576000000000001	0.6328	0.645	7.864	7.68	0.33	0.39	0.33	0.35	0.27908	\N	\N	2025-01-15 00:00:00	2025-12-26 19:42:37.115541
877	165	1	13	3	2	2025-01-15	2025-01-15	7.525	6.937	0.6616	0.6357	0.649	7.711	7.58	6.25	0.39	0.17	2.27	0.28736999999999996	\N	\N	2025-01-15 00:00:00	2025-12-26 19:42:37.117673
878	165	1	13	3	3	2025-01-15	2025-01-16	6.975	6.885	0.6559999999999999	0.6423000000000001	0.649	7.674	7.98	1.64	1.67	0.17	1.16	0.28224	\N	\N	2025-01-15 00:00:00	2025-12-26 19:42:37.119858
876	165	1	13	3	4	2025-01-16	2025-01-16	6.981	6.589	0.649	0.6463	0.648	7.593	7.91	1.96	1.03	0.38	1.123	0.27915	\N	\N	2025-01-16 00:00:00	2025-12-26 19:42:37.121931
840	165	1	13	3	5	2025-01-16	2025-01-16	6.95	6.854	0.6334000000000001	0.6359	0.635	7.519	7.56	1.54	1.03	2.19	1.587	0.28215	\N	\N	2025-01-16 00:00:00	2025-12-26 19:42:37.124007
869	165	1	13	3	6	2025-01-16	2025-01-16	1.604	1.334	0.6509	0.6403	0.646	\N	7.58	1.71	1.24	0.91	1.287	0.27924	\N	\N	2025-01-16 00:00:00	2025-12-26 19:42:37.126139
864	165	1	13	3	7	2025-01-16	2025-01-17	7.423	6.978	0.6479	0.6408	0.644	7.74	7.83	2.5	2.08	0.26	1.613	0.26272	\N	\N	2025-01-16 00:00:00	2025-12-26 19:42:37.128268
857	165	1	13	3	8	2025-01-17	2025-01-17	6.925	7.216	0.6369	0.6485	0.643	7.516	7.93	0.47	1.45	0.26	0.727	0.19712	\N	\N	2025-01-17 00:00:00	2025-12-26 19:42:37.130249
859	166	2	4	3	1	2025-01-02	2025-01-02	7.215	6.915	0.6357	0.6506000000000001	0.643	7.535	8.47	\N	\N	\N	\N	0.22830999999999996	\N	\N	2025-01-02 00:00:00	2025-12-26 19:42:37.144424
858	166	2	4	3	2	2025-01-03	2025-01-03	6.927	7.128	0.6489	0.6367	0.643	7.7	8.43	\N	\N	\N	\N	0.18728999999999998	\N	\N	2025-01-03 00:00:00	2025-12-26 19:42:37.14648
839	166	1	13	3	9	2025-01-23	2025-01-24	6.983	7.497	0.6353	0.6325	0.634	\N	7.9	1.99	5.55	1.25	2.93	0.19106	\N	\N	2025-01-23 00:00:00	2025-12-26 19:42:37.168674
874	167	2	4	3	2	2025-01-14	2025-01-14	6.761	6.676	0.6483	0.6454000000000001	0.647	7.828	8	\N	\N	\N	\N	0.30358	\N	\N	2025-01-14 00:00:00	2025-12-26 19:42:37.206051
848	169	2	4	3	1	2025-01-24	2025-01-24	6.695	7.615	0.6408	0.6357	0.638	\N	\N	\N	\N	\N	\N	0.21216999999999997	\N	\N	2025-01-24 00:00:00	2025-12-26 19:42:37.301732
854	170	2	4	3	1	2025-01-31	2025-01-31	6.903	7.44	0.6385000000000001	0.6413	0.64	7.701	7.9	\N	\N	\N	\N	0.16146999999999997	\N	\N	2025-01-31 00:00:00	2025-12-26 19:42:37.330491
838	172	1	13	3	1	2025-03-06	2025-03-06	6.855	7.135	0.6395000000000001	0.6281	0.634	7.885	7.6	1.42	1.78	0.96	1.387	0.26719000000000004	\N	\N	2025-03-06 00:00:00	2025-12-26 19:42:37.71825
845	175	1	13	3	9	2025-03-27	2025-03-27	7.428	7.856	0.6548	0.6204	0.638	7.951	7.37	0.27	0.59	1.35	0.737	0.24006000000000002	\N	\N	2025-03-27 00:00:00	2025-12-26 19:42:37.944458
879	172	1	13	3	7	2025-03-07	2025-03-07	7.438	7.207	0.6511	0.6483	0.6496999999999999	\N	7.67	1.71	5.43	2.08	3.07	\N	\N	\N	2025-03-07 00:00:00	2025-03-07 00:00:00
880	172	1	13	3	5	2025-03-07	2025-03-07	7.242	7.952	0.6581	0.6415000000000001	0.6498	7.743	7.7	1.6	7.16	2.69	3.82	\N	\N	\N	2025-03-07 00:00:00	2025-03-07 00:00:00
883	174	1	13	3	2	2025-03-19	2025-03-19	1.213	1.203	0.6551	0.6525	0.6537999999999999	8.019	7.54	2.28	5.56	3.83	3.89	\N	\N	\N	2025-03-19 00:00:00	2025-03-19 00:00:00
911	175	1	11	2	1	2025-03-20	2025-03-20	7.981	7.984	0.7059000000000001	0.7087	0.707	7.858	7.82	0.67	0.42	3.62	1.57	0.02848	0.006	0.019	2025-03-20 00:00:00	2025-12-26 19:49:28.89476
892	176	1	11	2	1	2025-03-27	2025-03-27	7.747	7.184	0.6968000000000001	0.6515000000000001	0.6742	7.871	7.48	1.61	8.25	2.64	4.17	\N	\N	\N	2025-03-27 00:00:00	2025-03-27 00:00:00
894	177	1	7	6	1	2025-03-25	2025-03-25	6.392	6.442	0.672	0.6812999999999999	0.6767	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-25 00:00:00	2025-03-25 00:00:00
898	173	1	10	2	1	2025-03-03	2025-03-03	6.475	6.753	0.6812	0.691	0.6861	7.83	7.71	0.46	1.22	6.71	2.8	\N	\N	\N	2025-03-03 00:00:00	2025-03-03 00:00:00
899	173	1	11	2	1	2025-03-07	2025-03-07	7.267	7.699	0.7021999999999999	0.6729	0.6876000000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-07 00:00:00	2025-03-07 00:00:00
1369	178	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.006	0.018	2025-12-26 19:49:29.10923	2025-12-26 19:49:29.110838
904	165	1	7	6	1	2025-12-31	2025-01-02	6.968	6.909	0.685	0.7009000000000001	0.693	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-31 00:00:00	2025-12-31 00:00:00
907	176	1	10	2	1	2025-03-24	2025-03-24	7.913	7.752	0.7021999999999999	0.7012	0.7017	7.867	7.77	2.82	12.25	1.7	5.59	\N	\N	\N	2025-03-24 00:00:00	2025-03-24 00:00:00
908	172	1	11	2	1	2025-02-28	2025-03-03	6.953	7.142	0.7011	0.7023999999999999	0.7018000000000001	7.554	7.85	2.06	1.62	0.51	1.4	\N	\N	\N	2025-02-28 00:00:00	2025-02-28 00:00:00
910	174	1	11	2	1	2025-03-14	2025-03-14	7.303	7.217	0.7015	0.7077	0.7045999999999999	7.721	8.27	1.08	1.82	2.86	1.92	\N	\N	\N	2025-03-14 00:00:00	2025-03-14 00:00:00
912	164	1	11	2	2	2025-01-02	2025-01-02	6.983	7.061	0.7056999999999999	0.7145999999999999	0.7101999999999999	7.553	7.82	2.2	0.79	0.66	1.22	\N	\N	\N	2025-01-02 00:00:00	2025-01-02 00:00:00
914	176	1	7	6	1	2025-03-19	2025-03-19	7.626	7.207	0.7139	0.7106999999999999	0.7123	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-19 00:00:00	2025-03-19 00:00:00
915	177	1	10	2	1	2025-03-31	2025-03-31	7.32	7.534	0.7143999999999999	0.711	0.7127	7.728	7.85	3.83	15.24	2.05	7.04	\N	\N	\N	2025-03-31 00:00:00	2025-03-31 00:00:00
916	177	1	8	12	1	2025-03-25	2025-03-25	7.574	8.005	0.7162000000000001	0.7095999999999999	0.7129000000000001	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-25 00:00:00	2025-03-25 00:00:00
918	176	1	10	2	2	2025-03-24	2025-03-24	6.413	7.886	0.7088	0.7171	0.713	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-24 00:00:00	2025-03-24 00:00:00
921	164	1	11	2	1	2025-01-02	2025-01-02	7.116	7.389	0.7173999999999999	0.7147	0.7161	7.665	8.1	\N	\N	\N	\N	\N	\N	\N	2025-01-02 00:00:00	2025-01-02 00:00:00
923	174	1	10	2	1	2025-03-10	2025-03-10	7.191	7.869	0.7201000000000001	0.7172	0.7187	8.204	7.85	5.13	3.29	2.01	3.48	\N	\N	\N	2025-03-10 00:00:00	2025-03-10 00:00:00
884	163	1	13	3	6	2025-01-03	2025-01-03	7.087	6.986	0.6670999999999999	0.6463	0.657	\N	\N	1.62	0.57	7.68	3.29	0.22577999999999998	\N	\N	2025-01-03 00:00:00	2025-12-26 19:42:37.082656
888	163	1	13	3	7	2025-01-03	2025-01-03	6.921	6.911	0.6639	0.6553	0.66	\N	\N	1.14	0.95	4.05	2.047	0.24468000000000004	\N	\N	2025-01-03 00:00:00	2025-12-26 19:42:37.086218
881	164	1	13	3	8	2025-01-10	2025-01-10	4.909	4.793	0.6502	0.6507	0.65	\N	8.2	\N	\N	\N	\N	0.2505	\N	\N	2025-01-10 00:00:00	2025-12-26 19:42:37.108974
909	165	1	11	2	1	2025-01-09	2025-01-09	6.015	6.119	0.7021	0.7039	0.703	\N	8.31	\N	\N	\N	\N	0.28422000000000003	\N	\N	2025-01-09 00:00:00	2025-12-26 19:42:37.113308
903	166	1	11	2	2	2025-01-16	2025-01-16	6.843	7.104	0.6957	0.6899	0.693	\N	\N	\N	\N	\N	\N	0.26691	\N	\N	2025-01-16 00:00:00	2025-12-26 19:42:37.152748
925	166	1	10	1	1	2025-01-13	2025-01-13	6.503	6.966	0.7273999999999999	0.7153	0.721	\N	\N	\N	\N	\N	\N	0.23880999999999997	\N	\N	2025-01-13 00:00:00	2025-12-26 19:42:37.180791
919	166	1	10	2	1	2025-01-13	2025-01-13	6.923	6.924	0.7170000000000001	0.7093	0.713	7.806	8.26	2.52	0.51	3.45	2.16	0.25701	\N	\N	2025-01-13 00:00:00	2025-12-26 19:42:37.182656
913	166	1	10	2	2	2025-01-13	2025-01-13	6.895	6.846	0.7155	0.7054	0.71	\N	\N	\N	\N	\N	\N	0.24048	\N	\N	2025-01-13 00:00:00	2025-12-26 19:42:37.184628
893	167	1	7	5	1	2025-01-13	2025-01-13	6.708	6.878	0.687	0.6622	0.675	7.871	7.93	\N	\N	\N	\N	0.21909	\N	\N	2025-01-13 00:00:00	2025-12-26 19:42:37.200308
891	167	1	7	6	1	2025-01-14	2025-01-14	6.758	7.158	0.6705	0.6762	0.673	\N	\N	\N	\N	\N	\N	0.21777000000000002	\N	\N	2025-01-14 00:00:00	2025-12-26 19:42:37.20222
900	167	1	11	2	1	2025-01-23	2025-01-23	7.045	6.938	0.6812999999999999	0.6959000000000001	0.689	7.579	8.02	0.38	0.89	1.26	0.843	0.2799	\N	\N	2025-01-23 00:00:00	2025-12-26 19:42:37.207936
896	167	1	11	2	2	2025-01-23	2025-01-23	6.953	7.099	0.6828	0.6759999999999999	0.679	\N	\N	\N	\N	\N	\N	0.33215000000000006	\N	\N	2025-01-23 00:00:00	2025-12-26 19:42:37.209782
927	167	1	10	2	1	2025-01-20	2025-01-20	8.01	6.44	0.7259	0.7212999999999999	0.724	7.538	8.16	1.84	1.45	3.04	2.11	0.22498	\N	\N	2025-01-20 00:00:00	2025-12-26 19:42:37.235863
917	168	1	7	5	1	2025-01-20	2025-01-20	7.102	7.266	0.7279000000000001	0.6979000000000001	0.713	7.627	7.13	\N	\N	\N	\N	0.15265	\N	\N	2025-01-20 00:00:00	2025-12-26 19:42:37.254791
895	168	1	7	6	1	2025-01-21	2025-01-21	6.855	7.285	0.679	0.6756	0.677	\N	\N	\N	\N	\N	\N	0.23206	\N	\N	2025-01-21 00:00:00	2025-12-26 19:42:37.256584
905	168	1	11	2	1	2025-01-31	2025-01-31	6.947	7.571	0.7019	0.6904	0.696	7.755	7.88	1.75	0.85	11.8	4.8	0.19515000000000002	\N	\N	2025-01-31 00:00:00	2025-12-26 19:42:37.262064
920	168	1	9	2	1	2025-01-24	2025-01-24	6.919	7.091	0.71	0.7193	0.715	\N	\N	0.33	1.81	0.47	0.87	0.22585	\N	\N	2025-01-24 00:00:00	2025-12-26 19:42:37.27838
889	169	1	7	5	1	2025-01-24	2025-01-27	7.3	7.158	0.6658	0.6553	0.661	7.705	6.56	\N	\N	\N	\N	0.15273	\N	\N	2025-01-24 00:00:00	2025-12-26 19:42:37.298136
890	169	1	7	6	1	2025-01-29	2025-01-29	6.782	7.385	0.6631	0.6635	0.663	\N	\N	\N	\N	\N	\N	0.24442999999999998	\N	\N	2025-01-29 00:00:00	2025-12-26 19:42:37.299978
882	169	2	4	3	2	2025-01-24	2025-01-27	6.679	7.739	0.6548	0.6472	0.651	\N	\N	\N	\N	\N	\N	0.21519	\N	\N	2025-01-24 00:00:00	2025-12-26 19:42:37.303515
886	170	2	4	7	1	2025-01-28	2025-01-28	7.467	7.158	0.6506000000000001	0.6629999999999999	0.657	\N	\N	\N	\N	\N	\N	0.22509	\N	\N	2025-01-28 00:00:00	2025-12-26 19:42:37.328724
922	173	1	10	2	2	2025-03-03	2025-03-03	6.925	6.927	0.7132	0.7234999999999999	0.718	\N	\N	\N	\N	\N	\N	0.20539	\N	\N	2025-03-03 00:00:00	2025-12-26 19:42:37.65366
928	174	1	7	5	1	2025-03-01	2025-03-03	7.447	7.761	0.7265999999999999	0.7215	0.724	7.495	7.53	\N	\N	\N	\N	0.13313	\N	\N	2025-03-01 00:00:00	2025-12-26 19:42:37.690141
902	174	1	7	6	1	2025-03-05	2025-03-05	6.432	6.483	0.6895	0.691	0.69	\N	\N	\N	\N	\N	\N	0.19460999999999998	\N	\N	2025-03-05 00:00:00	2025-12-26 19:42:37.692001
924	175	1	7	5	1	2025-03-08	2025-03-10	7.544	7.198	0.7284999999999999	0.7128	0.721	\N	\N	\N	\N	\N	\N	0.14614000000000002	\N	\N	2025-03-08 00:00:00	2025-12-26 19:42:37.813682
897	175	1	7	6	1	2025-03-11	2025-03-12	6.368	6.33	0.6837000000000001	0.6854	0.685	\N	\N	\N	\N	\N	\N	0.22462	\N	\N	2025-03-11 00:00:00	2025-12-26 19:42:37.815512
887	177	1	7	5	1	2025-03-22	2025-03-24	6.781	6.383	0.6633	0.6551	0.659	8.069	8.08	\N	\N	\N	\N	0.23518999999999995	\N	\N	2025-03-22 00:00:00	2025-12-26 19:42:37.9552
906	177	1	9	2	1	2025-03-28	2025-03-28	7.397	7.739	0.7045999999999999	0.6976	0.701	\N	\N	0.19	15.53	2.38	6.033	0.21789999999999998	\N	\N	2025-03-28 00:00:00	2025-12-26 19:42:37.977048
932	173	1	9	2	1	2025-03-01	2025-03-03	6.534	6.302	0.7353000000000001	0.7293999999999999	0.7323999999999999	7.507	7.9	1.17	3.65	3.34	2.72	\N	\N	\N	2025-03-01 00:00:00	2025-03-01 00:00:00
934	176	1	10	1	1	2025-03-25	2025-03-25	7.064	7.69	0.7339	0.736	0.735	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-25 00:00:00	2025-03-25 00:00:00
959	174	1	8	2	1	2025-03-07	2025-03-07	7.579	7.615	0.8029000000000001	0.7872	0.795	8.287	7.9	2.87	1.12	0.92	1.637	\N	0.003	0.017	2025-03-07 00:00:00	2025-12-26 19:49:28.857009
936	174	1	9	2	1	2025-03-08	2025-03-10	7.103	7.056	0.7406999999999999	0.7340000000000001	0.7373999999999999	7.846	7.93	\N	\N	\N	\N	\N	\N	\N	2025-03-08 00:00:00	2025-03-08 00:00:00
939	166	2	6	10	1	2025-01-02	2025-01-02	4.039	4.539	0.7349	0.7483	0.7415999999999999	\N	\N	6.55	1.75	9.59	5.96	\N	\N	\N	2025-01-02 00:00:00	2025-01-02 00:00:00
953	175	1	8	2	1	2025-03-12	2025-03-13	7.305	7.425	0.7685	0.7709999999999999	0.77	8.088	8.16	1.51	1.41	1.17	1.363	0.01081	0.004	0.016	2025-03-12 00:00:00	2025-12-26 19:49:28.863073
942	176	1	9	2	1	2025-03-24	2025-03-24	8.202	7.785	0.7468	0.7483	0.7476	8.041	8.05	7.53	2.43	2.42	4.13	\N	\N	\N	2025-03-24 00:00:00	2025-03-24 00:00:00
946	174	2	6	10	4	2025-03-05	2025-03-05	4.572	3.771	0.7634000000000001	0.7561	0.7598	\N	\N	5.66	7.61	0.93	4.73	\N	\N	\N	2025-03-05 00:00:00	2025-03-05 00:00:00
941	177	1	8	2	1	2025-03-26	2025-03-26	7.507	6.975	0.7441	0.7436	0.744	7.761	8.12	1.97	0.52	5.45	2.647	0.2036	0.005	0.019	2025-03-26 00:00:00	2025-12-26 19:49:28.922648
948	178	2	6	10	1	2025-03-27	2025-03-27	6.986	6.585	0.7655	0.7605	0.763	\N	\N	3.81	0.45	1.84	2.03	\N	\N	\N	2025-03-27 00:00:00	2025-03-27 00:00:00
1370	178	1	13	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.006	0.019	2025-12-26 19:49:29.115926	2025-12-26 19:49:29.117382
958	174	2	6	10	1	2025-02-28	2025-03-03	4.995	4.572	0.7781999999999999	0.7805	0.7794	\N	\N	9.34	0.58	7.32	5.75	\N	\N	\N	2025-02-28 00:00:00	2025-02-28 00:00:00
963	175	2	6	10	1	2025-03-07	2025-03-10	5.72	4.091	0.8008	0.7951999999999999	0.7979999999999999	\N	\N	5.49	5.98	0.69	4.05	\N	\N	\N	2025-03-07 00:00:00	2025-03-07 00:00:00
964	165	2	6	10	4	2025-12-31	2025-01-02	4.701	6.087	0.7963	0.8029000000000001	0.7996	\N	\N	3.03	4.35	2	3.13	\N	\N	\N	2025-12-31 00:00:00	2025-12-31 00:00:00
965	165	1	8	2	1	2025-12-31	2025-01-02	7.008	7.158	0.8055	0.7981	0.8018000000000001	7.623	8.54	5.83	4.45	1.99	4.09	\N	\N	\N	2025-12-31 00:00:00	2025-12-31 00:00:00
966	177	2	6	10	2	2025-03-24	2025-03-24	5.45	4.821	0.8001999999999999	0.8059999999999999	0.8031	\N	\N	1.5	7.26	0.82	3.19	\N	\N	\N	2025-03-24 00:00:00	2025-03-24 00:00:00
968	174	2	6	10	2	2025-02-28	2025-03-03	5.868	5.763	0.8107	0.8112	0.8109999999999999	\N	\N	0.42	1.1	0.92	0.81	\N	\N	\N	2025-02-28 00:00:00	2025-02-28 00:00:00
969	177	2	6	10	3	2025-03-24	2025-03-24	6.377	7.301	0.8068000000000001	0.8175	0.8122	\N	\N	5.53	0.57	5.89	4	\N	\N	\N	2025-03-24 00:00:00	2025-03-24 00:00:00
971	175	2	6	10	4	2025-03-11	2025-03-12	5.001	4.853	0.8184999999999999	0.8120999999999999	0.8153	\N	\N	1.71	0.53	1.5	1.25	\N	\N	\N	2025-03-11 00:00:00	2025-03-11 00:00:00
976	175	2	6	10	3	2025-03-10	2025-03-10	6.184	6.275	0.8205	0.8249	0.8227	\N	\N	4.05	3.35	0.53	2.64	\N	\N	\N	2025-03-10 00:00:00	2025-03-10 00:00:00
944	166	1	8	2	1	2025-01-08	2025-01-07	7.25	7.377	0.7545999999999999	0.7472	0.751	\N	8.28	\N	\N	\N	\N	0.24489999999999998	\N	\N	2025-01-08 00:00:00	2025-12-26 19:42:37.142272
960	166	2	6	10	2	2025-01-03	2025-01-03	5.601	5.851	0.7998999999999999	0.7929	0.796	\N	\N	4.71	1.32	5.05	3.693	0.14889	\N	\N	2025-01-03 00:00:00	2025-12-26 19:42:37.170643
973	166	2	6	10	4	2025-01-07	2025-01-07	7.31	6.473	0.8286	0.8088	0.819	\N	\N	\N	\N	\N	\N	0.13233	\N	\N	2025-01-07 00:00:00	2025-12-26 19:42:37.172529
938	166	1	9	2	1	2025-01-10	2025-01-10	5.594	5.234	0.7415	0.7402	0.741	\N	8.19	\N	\N	\N	\N	0.22521000000000005	\N	\N	2025-01-10 00:00:00	2025-12-26 19:42:37.178987
945	167	1	8	2	1	2025-01-15	2025-01-15	7.293	6.944	0.7746999999999999	0.7403	0.757	8.37	4.11	4.01	1.96	0.17	2.047	0.18089	\N	\N	2025-01-15 00:00:00	2025-12-26 19:42:37.186456
956	167	2	6	10	1	2025-01-09	2025-01-09	5.19	\N	0.7728	0.77	0.771	\N	8.99	\N	\N	\N	\N	0.22259000000000004	\N	\N	2025-01-09 00:00:00	2025-12-26 19:42:37.218849
970	167	2	6	10	3	2025-01-13	2025-01-13	4.031	4.832	0.8212999999999999	0.8065000000000001	0.814	\N	\N	3.22	0.71	3.72	2.55	0.2535	\N	\N	2025-01-13 00:00:00	2025-12-26 19:42:37.220676
967	167	2	6	10	4	2025-01-14	2025-01-15	5.207	5.046	0.8123999999999999	0.8044	0.808	\N	\N	1.66	2.23	0.16	1.35	0.16908	\N	\N	2025-01-14 00:00:00	2025-12-26 19:42:37.222484
962	168	1	8	2	1	2025-01-21	2025-01-21	6.341	7.12	0.7946	0.8008	0.798	7.877	7.88	0.67	2.09	0.75	1.17	0.06799000000000001	\N	\N	2025-01-21 00:00:00	2025-12-26 19:42:37.2377
957	168	2	6	10	1	2025-01-16	2025-01-16	3.916	4.152	0.7746999999999999	0.7706000000000001	0.773	\N	\N	2.59	2.61	1.96	2.387	0.17890999999999999	\N	\N	2025-01-16 00:00:00	2025-12-26 19:42:37.263881
931	168	1	10	1	1	2025-01-28	2025-01-28	6.823	6.92	0.7272	0.7297	0.728	\N	\N	\N	\N	\N	\N	0.12636	\N	\N	2025-01-28 00:00:00	2025-12-26 19:42:37.281973
951	169	1	8	2	1	2025-01-29	2025-01-29	8.037	7.285	0.7643000000000001	0.7656000000000001	0.765	7.671	7.91	0.75	6.94	1	2.897	0.02741	\N	\N	2025-01-29 00:00:00	2025-12-26 19:42:37.283768
943	169	2	6	10	1	2025-01-23	2025-01-23	6.489	6.827	0.7471	0.7543000000000001	0.751	\N	\N	5.25	0.24	1.96	2.483	0.17129999999999998	\N	\N	2025-01-23 00:00:00	2025-12-26 19:42:37.305278
972	169	2	6	10	2	2025-01-24	2025-01-24	4.231	4.411	0.8223999999999999	0.8107	0.817	\N	\N	0.36	2.31	8.86	3.843	0.17602	\N	\N	2025-01-24 00:00:00	2025-12-26 19:42:37.307063
974	169	2	6	10	3	2025-01-27	2025-01-27	6.328	6.328	0.8204	0.8197	0.82	\N	\N	2.71	3.69	3.92	3.44	0.20433	\N	\N	2025-01-27 00:00:00	2025-12-26 19:42:37.308873
954	170	2	6	10	1	2025-01-30	2025-01-30	5.242	5.688	0.7712	0.7705	0.771	\N	\N	1.26	0.67	4.47	2.133	0.16858	\N	\N	2025-01-30 00:00:00	2025-12-26 19:42:37.332272
1020	171	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.026279999999999998	\N	\N	2025-12-26 19:42:37.488466	2025-12-26 19:42:37.490968
1023	171	1	5	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01423	\N	\N	2025-12-26 19:42:37.499976	2025-12-26 19:42:37.502102
1373	183	2	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.02	0.055	2025-12-26 19:49:29.168936	2025-12-26 19:49:29.170552
937	175	1	9	2	1	2025-03-15	2025-03-17	7.797	6.974	0.7441	0.7359	0.74	7.506	8.55	9.57	1.16	0.61	3.78	0.21045999999999998	\N	\N	2025-03-15 00:00:00	2025-12-26 19:42:37.844471
930	175	1	10	2	1	2025-03-17	2025-03-17	6.939	7.239	0.7225	0.7273999999999999	0.725	7.883	7.87	1.29	4.35	3.88	3.173	0.19619	\N	\N	2025-03-17 00:00:00	2025-12-26 19:42:37.846364
952	176	1	7	5	1	2025-03-15	2025-03-17	7.667	8.15	0.7654000000000001	0.7687	0.767	7.948	8.02	\N	\N	\N	\N	0.14137	\N	\N	2025-03-15 00:00:00	2025-12-26 19:42:37.871736
961	176	2	6	10	4	2025-03-19	2025-03-19	5.589	5.22	0.7975	0.7978000000000001	0.798	\N	\N	3.29	6.7	1.34	3.777	0.16408999999999999	\N	\N	2025-03-19 00:00:00	2025-12-26 19:42:37.884015
933	176	2	6	10	1	2025-03-13	2025-03-13	4.607	4.887	0.7347	0.7345	0.735	\N	\N	2.76	0.36	4.31	2.477	0.19058	\N	\N	2025-03-13 00:00:00	2025-12-26 19:42:37.885792
955	176	2	6	10	2	2025-03-14	2025-03-14	4.575	4.479	0.7733	0.7687999999999999	0.771	\N	\N	0.81	4.94	9.35	5.033	0.15483	\N	\N	2025-03-14 00:00:00	2025-12-26 19:42:37.887593
949	177	2	6	10	1	2025-03-20	2025-03-20	5.252	4.287	0.7696	0.7583	0.764	\N	\N	0.42	6.84	3.58	3.613	0.23162999999999997	\N	\N	2025-03-20 00:00:00	2025-12-26 19:42:37.973386
975	177	2	6	10	4	2025-03-25	2025-03-25	5.948	6.748	0.8206	0.8245999999999999	0.823	\N	\N	5.83	1.58	8.28	5.23	0.27879000000000004	\N	\N	2025-03-25 00:00:00	2025-12-26 19:42:37.975174
978	178	2	6	10	3	2025-03-31	2025-03-31	6.011	6.463	0.8323	0.8398	0.8361	\N	\N	3.69	2.26	0.81	2.25	\N	\N	\N	2025-03-31 00:00:00	2025-03-31 00:00:00
980	198	2	12	2	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-26 18:17:02.063397	2025-12-26 18:17:02.063397
981	185	2	5	13	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-26 19:05:26.1164	2025-12-26 19:05:26.1164
982	199	3	5	3	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-26 19:13:36.501881	2025-12-26 19:13:36.501881
646	171	1	8	2	1	2025-02-13	2025-02-13	7.971	7.33	0.7723	0.7704000000000001	0.771	8.248	8.04	2.89	1.45	2.27	2.203	0.042069999999999996	0.004	0.016	2025-02-13 00:00:00	2025-12-26 19:49:28.750399
885	163	1	13	3	1	2025-01-02	2025-01-02	7.201	7.136	0.6542	0.6594	0.657	7.596	7.89	1.13	0.32	0.57	0.673	0.25424	\N	\N	2025-01-02 00:00:00	2025-12-26 19:42:37.0387
837	163	1	13	3	2	2025-01-02	2025-01-02	7.065	7.009	0.6342	0.6331	0.634	7.602	7.81	0.59	0.17	0.12	0.293	0.24169000000000002	\N	\N	2025-01-02 00:00:00	2025-12-26 19:42:37.062462
815	163	1	13	3	3	2025-01-02	2025-01-02	7.103	6.983	0.6246	0.6271	0.626	\N	\N	0.86	0.24	0.35	0.483	0.24749	\N	\N	2025-01-02 00:00:00	2025-12-26 19:42:37.068766
862	164	1	13	3	7	2025-01-10	2025-01-10	5.651	5.08	0.6372	0.6506000000000001	0.644	\N	8.26	\N	\N	\N	\N	0.24790999999999996	\N	\N	2025-01-10 00:00:00	2025-12-26 19:42:37.106653
984	165	2	6	10	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22259000000000004	\N	\N	2025-12-26 19:42:37.132265	2025-12-26 19:42:37.1366
947	165	1	9	2	1	2025-01-03	2025-01-03	7.056	7.158	0.7663	0.7545000000000001	0.76	7.653	8.38	4.93	1.92	1.84	2.897	0.2228	\N	\N	2025-01-03 00:00:00	2025-12-26 19:42:37.138112
929	165	1	10	2	1	2025-01-07	2025-01-07	5.861	5.676	0.7297	0.7192000000000001	0.724	\N	\N	\N	\N	\N	\N	0.21886000000000003	\N	\N	2025-01-07 00:00:00	2025-12-26 19:42:37.140235
901	166	1	11	2	1	2025-01-16	2025-01-16	7.698	6.692	0.6884	0.6901	0.689	7.741	7.78	0.68	1.96	1.86	1.5	0.23414999999999997	\N	\N	2025-01-16 00:00:00	2025-12-26 19:42:37.150413
843	166	1	13	3	2	2025-01-22	2025-01-22	7.111	7.144	0.6375	0.6354	0.636	7.75	7.68	1.67	9.36	2.63	4.553	0.30095	\N	\N	2025-01-22 00:00:00	2025-12-26 19:42:37.156591
985	166	2	2	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.2084	\N	\N	2025-12-26 19:42:37.17437	2025-12-26 19:42:37.177415
774	167	2	1	3	1	2025-01-04	2025-01-08	2.088	2.362	0.4739	0.5239	0.499	\N	4.57	\N	\N	\N	\N	0.13895	\N	\N	2025-01-04 00:00:00	2025-12-26 19:42:37.188336
757	167	2	5	14	1	2025-01-10	2025-01-10	2.527	2.139	0.1727	0.1564	0.165	\N	4.2	\N	\N	\N	\N	0.23035	\N	\N	2025-01-10 00:00:00	2025-12-26 19:42:37.196434
793	167	1	13	3	2	2025-01-30	2025-01-30	7.022	7.723	0.5992999999999999	0.6065999999999999	0.603	7.512	7.83	\N	\N	\N	\N	0.30998000000000003	\N	\N	2025-01-30 00:00:00	2025-12-26 19:42:37.213435
986	167	2	2	3	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25639	\N	\N	2025-12-26 19:42:37.229781	2025-12-26 19:42:37.232506
940	167	1	9	2	1	2025-01-17	2025-01-17	7.018	7.569	0.7436	0.743	0.743	7.65	7.99	0.88	0.69	1.28	0.95	0.26702000000000004	\N	\N	2025-01-17 00:00:00	2025-12-26 19:42:37.234034
987	168	2	1	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.06682	\N	\N	2025-12-26 19:42:37.239477	2025-12-26 19:42:37.241955
988	168	2	1	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.022189999999999998	\N	\N	2025-12-26 19:42:37.243352	2025-12-26 19:42:37.24558
716	168	2	5	7	1	2025-01-15	2025-01-15	3.663	3.069	0.10859999999999999	0.0843	0.096	7.533	4.07	\N	\N	\N	\N	0.058550000000000005	\N	\N	2025-01-15 00:00:00	2025-12-26 19:42:37.248904
989	168	2	6	10	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20526	\N	\N	2025-12-26 19:42:37.265772	2025-12-26 19:42:37.267956
979	168	2	6	10	4	2025-01-21	2025-01-21	6.152	7.208	0.8356999999999999	0.8365	0.836	\N	\N	5.08	1.91	1.16	2.717	0.13712	\N	\N	2025-01-21 00:00:00	2025-12-26 19:42:37.26934
926	168	1	10	2	1	2025-01-27	2025-01-27	6.399	6.45	0.7236	0.7225	0.723	7.632	7.96	1.8	0.75	2.5	1.683	0.22374	\N	\N	2025-01-27 00:00:00	2025-12-26 19:42:37.280173
990	169	2	1	9	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.02024	\N	\N	2025-12-26 19:42:37.287458	2025-12-26 19:42:37.289628
977	169	2	6	10	4	2025-01-29	2025-01-29	7.481	7.133	0.833	0.835	0.834	\N	\N	0.61	0.25	3.69	1.517	0.18652000000000002	\N	\N	2025-01-29 00:00:00	2025-12-26 19:42:37.310648
743	169	2	2	3	1	2025-01-20	2025-01-20	1.391	1.456	0.1358	0.1378	0.137	\N	\N	2.14	4.38	1.39	2.637	0.13009	\N	\N	2025-01-20 00:00:00	2025-12-26 19:42:37.314146
991	168	2	12	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.27458	\N	\N	2025-12-26 19:42:37.34841	2025-12-26 19:42:37.350593
992	168	2	13	3	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.27606	\N	\N	2025-12-26 19:42:37.351998	2025-12-26 19:42:37.354144
993	168	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.2845	\N	\N	2025-12-26 19:42:37.355616	2025-12-26 19:42:37.358099
994	168	2	13	3	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.28473	\N	\N	2025-12-26 19:42:37.35952	2025-12-26 19:42:37.361655
995	168	2	13	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.28608	\N	\N	2025-12-26 19:42:37.363083	2025-12-26 19:42:37.365265
996	168	2	13	3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.28972000000000003	\N	\N	2025-12-26 19:42:37.366809	2025-12-26 19:42:37.369669
997	168	2	13	3	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.29091	\N	\N	2025-12-26 19:42:37.371275	2025-12-26 19:42:37.373633
998	168	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.29463	\N	\N	2025-12-26 19:42:37.375319	2025-12-26 19:42:37.378153
999	168	2	13	3	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.30957999999999997	\N	\N	2025-12-26 19:42:37.379812	2025-12-26 19:42:37.382092
1000	168	2	13	3	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22579000000000002	\N	\N	2025-12-26 19:42:37.38367	2025-12-26 19:42:37.385958
1001	169	2	11	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20257999999999998	\N	\N	2025-12-26 19:42:37.387439	2025-12-26 19:42:37.389751
1002	169	2	11	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23926	\N	\N	2025-12-26 19:42:37.391609	2025-12-26 19:42:37.393905
1003	169	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24061999999999997	\N	\N	2025-12-26 19:42:37.39547	2025-12-26 19:42:37.397786
357	169	1	13	3	2	2025-02-14	2025-02-14	7.756	7.488	0.6475	0.6358	0.642	7.353	7.96	11.94	0.68	0.86	4.493	0.22447999999999999	\N	\N	2025-02-14 00:00:00	2025-12-26 19:42:37.399304
1004	169	2	13	3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23975000000000002	\N	\N	2025-12-26 19:42:37.403356	2025-12-26 19:42:37.405624
1005	169	2	13	3	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25407	\N	\N	2025-12-26 19:42:37.407066	2025-12-26 19:42:37.409273
1006	169	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.2594	\N	\N	2025-12-26 19:42:37.410742	2025-12-26 19:42:37.412958
1007	169	2	13	3	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23277000000000003	\N	\N	2025-12-26 19:42:37.414447	2025-12-26 19:42:37.416635
1008	169	2	13	3	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21453000000000003	\N	\N	2025-12-26 19:42:37.418451	2025-12-26 19:42:37.420964
1009	169	2	9	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21308	\N	\N	2025-12-26 19:42:37.42249	2025-12-26 19:42:37.425096
1010	169	2	10	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23184999999999997	\N	\N	2025-12-26 19:42:37.426606	2025-12-26 19:42:37.428876
1011	169	2	10	1	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21597	\N	\N	2025-12-26 19:42:37.430443	2025-12-26 19:42:37.432625
1012	169	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20975999999999997	\N	\N	2025-12-26 19:42:37.434153	2025-12-26 19:42:37.436322
1013	169	2	10	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.18645	\N	\N	2025-12-26 19:42:37.437866	2025-12-26 19:42:37.440039
1014	170	2	8	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22122999999999998	\N	\N	2025-12-26 19:42:37.441584	2025-12-26 19:42:37.444295
1015	170	2	12	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.36837000000000003	\N	\N	2025-12-26 19:42:37.445843	2025-12-26 19:42:37.448049
205	170	2	4	3	2	2025-01-31	2025-02-03	6.857	6.759	0.5818	0.568	0.575	7.731	7.89	\N	\N	\N	\N	0.09831	\N	\N	2025-01-31 00:00:00	2025-12-26 19:42:37.449536
1016	170	2	7	5	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.0947	\N	\N	2025-12-26 19:42:37.451525	2025-12-26 19:42:37.454191
1017	170	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.2186	\N	\N	2025-12-26 19:42:37.455686	2025-12-26 19:42:37.45801
369	170	1	13	3	2	2025-02-21	2025-02-21	7.53	7.101	0.6391	0.6479	0.643	8.14	7.65	0.35	5.13	1.45	2.31	0.24693	\N	\N	2025-02-21 00:00:00	2025-12-26 19:42:37.463229
421	170	1	13	3	3	2025-02-21	2025-02-21	7.226	7.253	0.6581	0.6561	0.657	7.612	7.47	0.12	4.65	6.5	3.757	0.25678	\N	\N	2025-02-21 00:00:00	2025-12-26 19:42:37.465101
468	170	1	13	3	6	2025-02-21	2025-02-22	7.435	7.312	0.6787000000000001	0.667	0.673	8.174	7.87	1.87	0.96	1.86	1.563	0.24857999999999997	\N	\N	2025-02-21 00:00:00	2025-12-26 19:42:37.470909
1018	170	1	6	10	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.218	\N	\N	2025-12-26 19:42:37.478189	2025-12-26 19:42:37.480548
1019	170	1	6	10	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.17684	\N	\N	2025-12-26 19:42:37.482009	2025-12-26 19:42:37.484533
1034	171	1	2	3	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19711	\N	\N	2025-12-26 19:42:37.539878	2025-12-26 19:42:37.542177
1035	172	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.08123	\N	\N	2025-12-26 19:42:37.553392	2025-12-26 19:42:37.555621
1038	172	1	5	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00244	\N	\N	2025-12-26 19:42:37.564536	2025-12-26 19:42:37.566686
1041	172	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.13215	\N	\N	2025-12-26 19:42:37.575154	2025-12-26 19:42:37.57722
670	172	2	6	10	1	2025-02-13	2025-02-13	4.434	4.03	0.8101	0.7729	0.792	\N	\N	5.5	2.52	2.5	3.507	0.19152000000000002	\N	\N	2025-02-13 00:00:00	2025-12-26 19:42:37.586448
1053	174	1	1	9	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.07697	\N	\N	2025-12-26 19:42:37.664341	2025-12-26 19:42:37.666698
1056	174	1	5	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22539	\N	\N	2025-12-26 19:42:37.675577	2025-12-26 19:42:37.677742
1059	174	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.12140000000000001	\N	\N	2025-12-26 19:42:37.686587	2025-12-26 19:42:37.68874
1061	174	1	6	10	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.18300999999999998	\N	\N	2025-12-26 19:42:37.697327	2025-12-26 19:42:37.699415
1064	174	1	2	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.16232	\N	\N	2025-12-26 19:42:37.707765	2025-12-26 19:42:37.709832
1089	175	1	5	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.2096	\N	\N	2025-12-26 19:42:37.803326	2025-12-26 19:42:37.805393
1101	176	1	1	9	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.02374	\N	\N	2025-12-26 19:42:37.857656	2025-12-26 19:42:37.859843
1104	176	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.12889	\N	\N	2025-12-26 19:42:37.868239	2025-12-26 19:42:37.870337
419	180	1	13	3	3	2025-04-30	2025-04-30	7.667	7.112	0.6601	0.6512	0.656	7.649	7.82	11.84	1.17	1.78	4.93	0.23773000000000002	\N	\N	2025-04-30 00:00:00	2025-12-26 19:42:38.083878
1141	181	1	1	9	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00903	\N	\N	2025-12-26 19:42:38.117575	2025-12-26 19:42:38.120107
1145	181	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.29347999999999996	\N	\N	2025-12-26 19:42:38.14006	2025-12-26 19:42:38.142262
1148	181	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22107	\N	\N	2025-12-26 19:42:38.151023	2025-12-26 19:42:38.153154
1149	181	2	2	3	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22591	\N	\N	2025-12-26 19:42:38.162023	2025-12-26 19:42:38.16419
1156	182	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24503	\N	\N	2025-12-26 19:42:38.195411	2025-12-26 19:42:38.197601
1165	182	2	10	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.12689999999999999	\N	\N	2025-12-26 19:42:38.239691	2025-12-26 19:42:38.241846
1168	183	2	1	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.0206	\N	\N	2025-12-26 19:42:38.250649	2025-12-26 19:42:38.252782
1249	186	2	13	3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25675000000000003	\N	\N	2025-12-26 19:42:38.565119	2025-12-26 19:42:38.567279
1253	186	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21024999999999996	\N	\N	2025-12-26 19:42:38.586517	2025-12-26 19:42:38.588612
1255	187	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23132	\N	\N	2025-12-26 19:42:38.597171	2025-12-26 19:42:38.599407
1259	187	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21966999999999998	\N	\N	2025-12-26 19:42:38.618771	2025-12-26 19:42:38.6209
1260	187	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.17421	\N	\N	2025-12-26 19:42:38.629665	2025-12-26 19:42:38.631669
1272	188	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20951	\N	\N	2025-12-26 19:42:38.706184	2025-12-26 19:42:38.708302
1275	189	1	1	11	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01646	\N	\N	2025-12-26 19:42:38.716932	2025-12-26 19:42:38.719144
1288	190	2	5	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.11382999999999999	\N	\N	2025-12-26 19:42:38.80365	2025-12-26 19:42:38.805824
1292	190	2	13	3	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25397	\N	\N	2025-12-26 19:42:38.825538	2025-12-26 19:42:38.82767
1300	191	1	1	9	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.010409999999999999	\N	\N	2025-12-26 19:42:38.880299	2025-12-26 19:42:38.882473
1305	191	2	13	3	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24795	\N	\N	2025-12-26 19:42:38.912362	2025-12-26 19:42:38.91455
1307	191	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20224999999999999	\N	\N	2025-12-26 19:42:38.933945	2025-12-26 19:42:38.93607
1311	192	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.27061	\N	\N	2025-12-26 19:42:38.956896	2025-12-26 19:42:38.959157
1313	192	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24914000000000003	\N	\N	2025-12-26 19:42:38.968388	2025-12-26 19:42:38.970593
1315	192	2	13	3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25373999999999997	\N	\N	2025-12-26 19:42:38.980357	2025-12-26 19:42:38.982582
8	192	2	2	3	3	2025-06-28	2025-07-01	1.497	1.685	0.09230000000000001	0.0919	0.092	\N	\N	0.34	0.45	2.66	1.15	0.20817000000000002	\N	\N	2025-06-28 00:00:00	2025-12-26 19:42:39.002255
1325	193	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.26331	\N	\N	2025-12-26 19:42:39.045002	2025-12-26 19:42:39.047119
1329	194	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.015	\N	\N	2025-12-26 19:42:39.079521	2025-12-26 19:42:39.081659
1335	194	2	10	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.16327000000000003	\N	\N	2025-12-26 19:42:39.123056	2025-12-26 19:42:39.125165
12	198	2	2	3	1	2025-08-11	2025-08-12	1.662	1.497	0.09609999999999999	0.0916	0.094	\N	\N	5.41	0.8	12.31	6.173	0.17647	\N	\N	2025-08-11 00:00:00	2025-12-26 19:42:39.344008
270	173	2	4	3	1	2025-02-22	2025-02-24	7.11	7.153	0.616	0.6347999999999999	0.625	\N	\N	\N	\N	\N	\N	0.23169	0.02	0.055	2025-02-22 00:00:00	2025-12-26 19:49:28.778525
198	182	2	4	3	2	2025-04-25	2025-04-25	7.385	7.079	0.5602	0.5484	0.554	\N	\N	\N	\N	\N	\N	\N	0.018	0.039	2025-04-25 00:00:00	2025-12-26 19:49:29.126115
1371	179	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.006	0.017	2025-12-26 19:49:29.152529	2025-12-26 19:49:29.154413
1375	180	1	13	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.006	0.017	2025-12-26 19:49:29.189811	2025-12-26 19:49:29.191404
1376	184	2	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.021	0.054	2025-12-26 19:49:29.200602	2025-12-26 19:49:29.202148
1377	181	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.006	0.017	2025-12-26 19:49:29.215279	2025-12-26 19:49:29.216797
567	171	1	9	2	1	2025-02-15	2025-02-17	6.708	7.073	0.7249	0.7273999999999999	0.726	8.09	8.65	1.14	1.64	2.42	1.733	0.21236999999999998	\N	\N	2025-02-15 00:00:00	2025-12-26 19:42:37.543729
704	172	2	6	10	2	2025-02-14	2025-02-15	5.549	4.64	0.8304	0.8120999999999999	0.821	\N	\N	4.44	0.57	1.5	2.17	0.20353000000000004	\N	\N	2025-02-14 00:00:00	2025-12-26 19:42:37.5883
1043	172	2	9	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25232	\N	\N	2025-12-26 19:42:37.599761	2025-12-26 19:42:37.601961
1046	172	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20677	\N	\N	2025-12-26 19:42:37.610617	2025-12-26 19:42:37.612708
128	173	2	1	11	1	2025-02-17	2025-02-18	3.313	3.628	0.4276	0.4388	0.433	\N	\N	\N	\N	\N	\N	0.0227	\N	\N	2025-02-17 00:00:00	2025-12-26 19:42:37.621567
22	173	2	2	7	1	2025-02-19	2025-02-19	2.013	1.716	0.09380000000000001	0.10439999999999999	0.099	\N	\N	0.79	1.04	12.34	4.723	0.19394999999999998	\N	\N	2025-02-19 00:00:00	2025-12-26 19:42:37.644298
935	173	1	10	1	1	2025-03-04	2025-03-05	7.674	8.056	0.7394	0.7352	0.737	\N	\N	\N	\N	\N	\N	0.10304999999999999	\N	\N	2025-03-04 00:00:00	2025-12-26 19:42:37.655469
826	172	1	13	3	2	2025-03-06	2025-03-06	6.183	6.168	0.6431	0.6164000000000001	0.63	7.524	7.64	2.02	0.27	3.59	1.96	0.25194	\N	\N	2025-03-06 00:00:00	2025-12-26 19:42:37.720163
1069	172	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20531	\N	\N	2025-12-26 19:42:37.731072	2025-12-26 19:42:37.733136
1072	173	2	13	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.2349	\N	\N	2025-12-26 19:42:37.741702	2025-12-26 19:42:37.743793
1075	173	2	13	3	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23596	\N	\N	2025-12-26 19:42:37.752115	2025-12-26 19:42:37.75416
1078	174	2	8	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24045000000000005	\N	\N	2025-12-26 19:42:37.762622	2025-12-26 19:42:37.764687
1081	174	2	13	3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22015999999999997	\N	\N	2025-12-26 19:42:37.773197	2025-12-26 19:42:37.775629
1084	174	2	13	3	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.18819	\N	\N	2025-12-26 19:42:37.783968	2025-12-26 19:42:37.786067
1094	175	1	6	10	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20324000000000003	\N	\N	2025-12-26 19:42:37.826095	2025-12-26 19:42:37.828233
1097	175	1	2	3	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.15989	\N	\N	2025-12-26 19:42:37.8373	2025-12-26 19:42:37.83936
1107	176	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21497	\N	\N	2025-12-26 19:42:37.880522	2025-12-26 19:42:37.8826
749	177	2	2	3	3	2025-03-19	2025-03-19	1.399	1.497	0.1355	0.147	0.141	\N	\N	1.43	19.42	4.74	8.53	0.17357	\N	\N	2025-03-19 00:00:00	2025-12-26 19:42:37.912698
1112	178	1	4	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20727	\N	\N	2025-12-26 19:42:37.923294	2025-12-26 19:42:37.925417
1115	179	1	2	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20757000000000003	\N	\N	2025-12-26 19:42:37.93372	2025-12-26 19:42:37.935976
252	177	1	13	3	3	2025-04-09	2025-04-09	7.151	7.137	0.6396000000000001	0.601	0.62	8.219	7.78	3.23	0.25	4.51	2.663	0.24788	\N	\N	2025-04-09 00:00:00	2025-12-26 19:42:37.965968
1124	178	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23668	\N	\N	2025-12-26 19:42:37.987614	2025-12-26 19:42:37.989673
1128	179	1	11	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.28098	\N	\N	2025-12-26 19:42:38.028634	2025-12-26 19:42:38.032002
1130	179	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19283999999999998	\N	\N	2025-12-26 19:42:38.04559	2025-12-26 19:42:38.053007
1132	180	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.18198	\N	\N	2025-12-26 19:42:38.063023	2025-12-26 19:42:38.065308
1134	180	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.27931	\N	\N	2025-12-26 19:42:38.074383	2025-12-26 19:42:38.076601
1152	181	2	6	10	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19651	\N	\N	2025-12-26 19:42:38.175149	2025-12-26 19:42:38.177344
1154	182	2	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.005620000000000001	\N	\N	2025-12-26 19:42:38.186274	2025-12-26 19:42:38.18843
1159	182	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24216000000000004	\N	\N	2025-12-26 19:42:38.208322	2025-12-26 19:42:38.210469
1162	182	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23318000000000003	\N	\N	2025-12-26 19:42:38.219254	2025-12-26 19:42:38.221354
1170	183	1	7	5	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19399999999999998	\N	\N	2025-12-26 19:42:38.263244	2025-12-26 19:42:38.265319
1173	183	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23413	\N	\N	2025-12-26 19:42:38.273958	2025-12-26 19:42:38.276063
1176	183	1	13	3	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23936000000000002	\N	\N	2025-12-26 19:42:38.284706	2025-12-26 19:42:38.286889
1179	183	1	13	3	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21544	\N	\N	2025-12-26 19:42:38.295627	2025-12-26 19:42:38.29781
1182	183	2	6	10	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.16797	\N	\N	2025-12-26 19:42:38.306482	2025-12-26 19:42:38.308607
1183	183	1	9	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20794000000000004	\N	\N	2025-12-26 19:42:38.317436	2025-12-26 19:42:38.31955
1186	184	2	1	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01541	\N	\N	2025-12-26 19:42:38.328163	2025-12-26 19:42:38.330295
1189	184	2	5	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.14363	\N	\N	2025-12-26 19:42:38.341195	2025-12-26 19:42:38.34332
1192	184	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24505	\N	\N	2025-12-26 19:42:38.352164	2025-12-26 19:42:38.354348
1195	184	1	11	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19519999999999998	\N	\N	2025-12-26 19:42:38.362894	2025-12-26 19:42:38.365081
1198	184	2	2	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.15408	\N	\N	2025-12-26 19:42:38.373486	2025-12-26 19:42:38.375556
1201	184	1	9	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22272	\N	\N	2025-12-26 19:42:38.384324	2025-12-26 19:42:38.386456
1204	185	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.10354	\N	\N	2025-12-26 19:42:38.394979	2025-12-26 19:42:38.397103
1207	185	1	12	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00898	\N	\N	2025-12-26 19:42:38.405448	2025-12-26 19:42:38.407499
1210	185	2	4	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.12605	\N	\N	2025-12-26 19:42:38.416032	2025-12-26 19:42:38.418107
1213	185	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21308999999999997	\N	\N	2025-12-26 19:42:38.426661	2025-12-26 19:42:38.428751
1216	185	2	6	10	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.14622	\N	\N	2025-12-26 19:42:38.437237	2025-12-26 19:42:38.439294
1219	185	2	2	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21675000000000003	\N	\N	2025-12-26 19:42:38.447894	2025-12-26 19:42:38.450104
1222	186	1	8	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.11696000000000001	\N	\N	2025-12-26 19:42:38.458764	2025-12-26 19:42:38.461022
1225	186	2	5	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.15153	\N	\N	2025-12-26 19:42:38.469892	2025-12-26 19:42:38.472001
1228	186	2	4	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21905000000000002	\N	\N	2025-12-26 19:42:38.480733	2025-12-26 19:42:38.482844
1231	186	2	2	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.18012	\N	\N	2025-12-26 19:42:38.491657	2025-12-26 19:42:38.493742
1234	187	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.0174	\N	\N	2025-12-26 19:42:38.502445	2025-12-26 19:42:38.504544
1237	187	2	4	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24853000000000003	\N	\N	2025-12-26 19:42:38.513478	2025-12-26 19:42:38.515577
1240	187	2	2	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24749	\N	\N	2025-12-26 19:42:38.524163	2025-12-26 19:42:38.52628
1243	184	2	13	3	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.26306999999999997	\N	\N	2025-12-26 19:42:38.534636	2025-12-26 19:42:38.536722
1246	185	2	13	3	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.26685	\N	\N	2025-12-26 19:42:38.545148	2025-12-26 19:42:38.547195
512	186	1	11	2	1	2025-06-05	2025-06-05	7.394	7.522	0.7069	0.7119	0.709	7.507	7.85	2.08	3.11	0.65	1.947	0.24236000000000002	\N	\N	2025-06-05 00:00:00	2025-12-26 19:42:38.556067
1263	188	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01697	\N	\N	2025-12-26 19:42:38.641877	2025-12-26 19:42:38.643906
314	188	1	13	3	3	2025-06-25	2025-06-25	7.511	7.803	0.6463	0.6186	0.632	7.518	7.46	0.31	2.21	0.35	0.957	0.24645999999999998	\N	\N	2025-06-25 00:00:00	2025-12-26 19:42:38.67455
1271	188	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25329999999999997	\N	\N	2025-12-26 19:42:38.685641	2025-12-26 19:42:38.687868
1279	189	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22125	\N	\N	2025-12-26 19:42:38.739821	2025-12-26 19:42:38.741902
1283	189	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.26468	\N	\N	2025-12-26 19:42:38.761287	2025-12-26 19:42:38.763479
1286	190	1	1	11	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.06853	\N	\N	2025-12-26 19:42:38.794556	2025-12-26 19:42:38.796648
1290	190	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25062	\N	\N	2025-12-26 19:42:38.816453	2025-12-26 19:42:38.818603
1294	190	2	13	3	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.26686	\N	\N	2025-12-26 19:42:38.83871	2025-12-26 19:42:38.840835
1298	191	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.09874000000000001	\N	\N	2025-12-26 19:42:38.871527	2025-12-26 19:42:38.873599
1310	192	1	1	9	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.016819999999999998	\N	\N	2025-12-26 19:42:38.947267	2025-12-26 19:42:38.949487
1319	193	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.018349999999999998	\N	\N	2025-12-26 19:42:39.014845	2025-12-26 19:42:39.016911
1322	193	1	1	9	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.006840000000000001	\N	\N	2025-12-26 19:42:39.025278	2025-12-26 19:42:39.027361
1327	193	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19391999999999998	\N	\N	2025-12-26 19:42:39.070476	2025-12-26 19:42:39.072739
1338	195	1	1	9	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.015080000000000001	\N	\N	2025-12-26 19:42:39.135424	2025-12-26 19:42:39.13749
1340	195	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.27543	\N	\N	2025-12-26 19:42:39.146093	2025-12-26 19:42:39.14818
692	195	2	6	10	4	2025-07-29	2025-07-29	5.665	6.668	0.8170999999999999	0.8143	0.816	\N	\N	0.72	8.59	7.71	5.673	0.13959	\N	\N	2025-07-29 00:00:00	2025-12-26 19:42:39.156927
1343	196	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.014890000000000002	\N	\N	2025-12-26 19:42:39.168893	2025-12-26 19:42:39.171686
1345	196	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.18709	\N	\N	2025-12-26 19:42:39.18213	2025-12-26 19:42:39.18449
120	200	2	1	13	2	2025-08-25	2025-08-25	3.348	3.07	0.41700000000000004	0.4202	0.419	\N	\N	\N	\N	\N	\N	0.15571	\N	\N	2025-08-25 00:00:00	2025-12-26 19:42:39.412148
1372	179	1	13	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.019	2025-12-26 19:49:29.158644	2025-12-26 19:49:29.160317
1374	180	1	13	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.007	0.021	2025-12-26 19:49:29.184517	2025-12-26 19:49:29.186147
499	171	1	10	2	1	2025-02-17	2025-02-17	6.85	6.615	0.6999	0.7067	0.703	7.555	7.8	\N	\N	\N	\N	0.19324000000000002	\N	\N	2025-02-17 00:00:00	2025-12-26 19:42:37.547659
1039	172	1	5	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21789999999999998	\N	\N	2025-12-26 19:42:37.568068	2025-12-26 19:42:37.570204
346	172	1	7	6	1	2025-02-18	2025-02-18	6.726	6.854	0.6319	0.6451	0.639	\N	\N	\N	\N	\N	\N	0.19933	\N	\N	2025-02-18 00:00:00	2025-12-26 19:42:37.580723
80	172	2	2	3	1	2025-02-11	2025-02-11	1.369	1.305	0.1509	0.1586	0.155	\N	\N	0.94	1.64	0.56	1.047	0.15773	\N	\N	2025-02-11 00:00:00	2025-12-26 19:42:37.591979
1044	172	2	9	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20952	\N	\N	2025-12-26 19:42:37.603389	2025-12-26 19:42:37.605508
1047	172	2	10	2	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19487	\N	\N	2025-12-26 19:42:37.614141	2025-12-26 19:42:37.616299
1067	172	2	13	3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.26269	\N	\N	2025-12-26 19:42:37.723845	2025-12-26 19:42:37.72611
1070	173	2	11	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21889999999999998	\N	\N	2025-12-26 19:42:37.734554	2025-12-26 19:42:37.736685
1073	173	2	13	3	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22324000000000002	\N	\N	2025-12-26 19:42:37.745159	2025-12-26 19:42:37.747212
1076	173	2	13	3	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.2416	\N	\N	2025-12-26 19:42:37.755609	2025-12-26 19:42:37.757695
1079	174	2	11	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25806	\N	\N	2025-12-26 19:42:37.766091	2025-12-26 19:42:37.768183
1082	174	2	13	3	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23767	\N	\N	2025-12-26 19:42:37.77702	2025-12-26 19:42:37.779064
1085	174	2	9	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21194	\N	\N	2025-12-26 19:42:37.787527	2025-12-26 19:42:37.789632
1092	175	1	6	10	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.18133	\N	\N	2025-12-26 19:42:37.819033	2025-12-26 19:42:37.821151
1095	175	1	2	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.12416	\N	\N	2025-12-26 19:42:37.829739	2025-12-26 19:42:37.832067
1098	175	1	2	3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19843999999999998	\N	\N	2025-12-26 19:42:37.840843	2025-12-26 19:42:37.843017
1105	176	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23006000000000004	\N	\N	2025-12-26 19:42:37.873527	2025-12-26 19:42:37.875623
1108	176	2	9	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.2207	\N	\N	2025-12-26 19:42:37.894896	2025-12-26 19:42:37.897106
1110	178	1	5	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.012310000000000001	\N	\N	2025-12-26 19:42:37.91628	2025-12-26 19:42:37.918302
1113	178	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.034910000000000004	\N	\N	2025-12-26 19:42:37.926813	2025-12-26 19:42:37.928913
1116	179	1	2	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.255	\N	\N	2025-12-26 19:42:37.937435	2025-12-26 19:42:37.939485
1118	176	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.1942	\N	\N	2025-12-26 19:42:37.948116	2025-12-26 19:42:37.950186
1119	177	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.26311	\N	\N	2025-12-26 19:42:37.958834	2025-12-26 19:42:37.960897
1121	177	1	13	3	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19608	\N	\N	2025-12-26 19:42:37.969861	2025-12-26 19:42:37.971978
614	178	1	11	2	1	2025-04-10	2025-04-10	7.557	7.525	0.754	0.7389	0.746	7.729	8.2	1.52	2.36	0.28	1.387	0.23471	\N	\N	2025-04-10 00:00:00	2025-12-26 19:42:37.991055
1129	179	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.26347000000000004	\N	\N	2025-12-26 19:42:38.033916	2025-12-26 19:42:38.036843
1137	180	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.2528	\N	\N	2025-12-26 19:42:38.100823	2025-12-26 19:42:38.103032
1150	181	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.26311	\N	\N	2025-12-26 19:42:38.167684	2025-12-26 19:42:38.169894
1155	182	2	5	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.11685000000000001	\N	\N	2025-12-26 19:42:38.189958	2025-12-26 19:42:38.192095
1157	182	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22336999999999999	\N	\N	2025-12-26 19:42:38.200981	2025-12-26 19:42:38.203162
1160	182	1	13	3	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25905	\N	\N	2025-12-26 19:42:38.211942	2025-12-26 19:42:38.214133
1171	183	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.17296	\N	\N	2025-12-26 19:42:38.266782	2025-12-26 19:42:38.268939
1174	183	1	11	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.28147	\N	\N	2025-12-26 19:42:38.277542	2025-12-26 19:42:38.279632
1177	183	1	13	3	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24886	\N	\N	2025-12-26 19:42:38.28833	2025-12-26 19:42:38.290487
1180	183	2	6	10	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20416	\N	\N	2025-12-26 19:42:38.299352	2025-12-26 19:42:38.301502
1184	184	1	8	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.04386	\N	\N	2025-12-26 19:42:38.321056	2025-12-26 19:42:38.323098
1187	184	2	1	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.02048	\N	\N	2025-12-26 19:42:38.331752	2025-12-26 19:42:38.333914
1190	184	1	7	5	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20977	\N	\N	2025-12-26 19:42:38.344761	2025-12-26 19:42:38.346878
1196	184	2	6	10	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20355	\N	\N	2025-12-26 19:42:38.366471	2025-12-26 19:42:38.368508
1199	184	2	2	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19226	\N	\N	2025-12-26 19:42:38.377029	2025-12-26 19:42:38.379114
1202	184	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.1875	\N	\N	2025-12-26 19:42:38.387914	2025-12-26 19:42:38.390065
1205	185	2	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.014539999999999999	\N	\N	2025-12-26 19:42:38.398522	2025-12-26 19:42:38.400587
1208	185	2	5	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.12554	\N	\N	2025-12-26 19:42:38.408965	2025-12-26 19:42:38.411023
1211	185	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22746	\N	\N	2025-12-26 19:42:38.4195	2025-12-26 19:42:38.42178
1214	185	1	11	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.18774999999999997	\N	\N	2025-12-26 19:42:38.430149	2025-12-26 19:42:38.432263
1217	185	2	2	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.17217	\N	\N	2025-12-26 19:42:38.440757	2025-12-26 19:42:38.442842
1220	185	1	9	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20800000000000002	\N	\N	2025-12-26 19:42:38.451546	2025-12-26 19:42:38.453762
1223	186	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00996	\N	\N	2025-12-26 19:42:38.462491	2025-12-26 19:42:38.464637
1226	186	1	7	5	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21194999999999997	\N	\N	2025-12-26 19:42:38.473544	2025-12-26 19:42:38.475711
1229	186	2	6	10	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.16189	\N	\N	2025-12-26 19:42:38.484303	2025-12-26 19:42:38.486595
1232	186	2	2	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.09856999999999999	\N	\N	2025-12-26 19:42:38.495176	2025-12-26 19:42:38.497404
1235	187	1	1	9	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.02437	\N	\N	2025-12-26 19:42:38.505995	2025-12-26 19:42:38.508197
1238	187	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.16168	\N	\N	2025-12-26 19:42:38.517028	2025-12-26 19:42:38.519188
1241	184	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23562000000000002	\N	\N	2025-12-26 19:42:38.527679	2025-12-26 19:42:38.529741
1244	184	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24058000000000002	\N	\N	2025-12-26 19:42:38.538118	2025-12-26 19:42:38.540176
1250	186	2	13	3	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24355000000000002	\N	\N	2025-12-26 19:42:38.570541	2025-12-26 19:42:38.572652
1252	186	2	6	10	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21050000000000002	\N	\N	2025-12-26 19:42:38.581255	2025-12-26 19:42:38.583271
1256	187	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25117	\N	\N	2025-12-26 19:42:38.602717	2025-12-26 19:42:38.604773
1258	187	2	13	3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25585	\N	\N	2025-12-26 19:42:38.613419	2025-12-26 19:42:38.615569
1261	188	1	1	11	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.10278000000000001	\N	\N	2025-12-26 19:42:38.634902	2025-12-26 19:42:38.636956
1295	190	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.28362	\N	\N	2025-12-26 19:42:38.842303	2025-12-26 19:42:38.844501
1299	191	1	1	11	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01833	\N	\N	2025-12-26 19:42:38.875016	2025-12-26 19:42:38.877022
1302	191	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25238	\N	\N	2025-12-26 19:42:38.896343	2025-12-26 19:42:38.898431
1304	191	2	13	3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23417999999999997	\N	\N	2025-12-26 19:42:38.906926	2025-12-26 19:42:38.909066
1308	192	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01336	\N	\N	2025-12-26 19:42:38.939595	2025-12-26 19:42:38.941897
1312	192	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24306999999999995	\N	\N	2025-12-26 19:42:38.962657	2025-12-26 19:42:38.964912
1316	192	2	13	3	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23087	\N	\N	2025-12-26 19:42:38.985892	2025-12-26 19:42:38.987992
1320	193	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.02144	\N	\N	2025-12-26 19:42:39.018299	2025-12-26 19:42:39.020357
1323	193	2	5	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00987	\N	\N	2025-12-26 19:42:39.028788	2025-12-26 19:42:39.030882
1324	193	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20498	\N	\N	2025-12-26 19:42:39.039553	2025-12-26 19:42:39.04179
1328	193	2	10	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.18395	\N	\N	2025-12-26 19:42:39.074173	2025-12-26 19:42:39.076285
1336	195	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.02388	\N	\N	2025-12-26 19:42:39.128403	2025-12-26 19:42:39.130482
1339	195	1	1	9	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.09647	\N	\N	2025-12-26 19:42:39.138984	2025-12-26 19:42:39.141087
1344	196	1	1	9	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23395	\N	\N	2025-12-26 19:42:39.173459	2025-12-26 19:42:39.176306
427	196	1	13	3	4	2025-08-20	2025-08-20	7.169	7.164	0.6603	0.6557999999999999	0.658	7.502	7.53	1.96	1.51	0.55	1.34	0.11715	\N	\N	2025-08-20 00:00:00	2025-12-26 19:42:39.259307
1346	198	1	7	5	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.28287	\N	\N	2025-12-26 19:42:39.372137	2025-12-26 19:42:39.37433
328	198	1	13	3	9	2025-09-04	2025-09-04	7.125	7.114	0.639	0.6314	0.635	7.658	7.64	1.1	0.75	2.09	1.313	0.24122	\N	\N	2025-09-04 00:00:00	2025-12-26 19:42:39.437859
1193	184	2	4	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21966999999999998	0.022	0.059	2025-12-26 19:42:38.355784	2025-12-26 19:49:29.196563
1381	201	2	1	3	2			\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-26 21:06:58.85368	2025-12-26 21:07:02.298975
1382	204	2	8	15	1	2026-01-10	2026-01-12	4	23	23	45	34	6	5	235	223	234	230.667	\N	2.813	4.262	2026-01-11 00:05:11.701415	2026-01-11 00:07:11.523575
1383	204	2	8	15	2	2026-01-10	2026-01-13	23	3	32	34	33	41	32	3	3	3	3	\N	32.2	48.06	2026-01-11 00:33:17.793101	2026-01-11 00:33:57.877016
1037	172	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.02075	\N	\N	2025-12-26 19:42:37.560756	2025-12-26 19:42:37.562995
1040	172	1	4	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25643	\N	\N	2025-12-26 19:42:37.571653	2025-12-26 19:42:37.573746
1042	172	2	11	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.16917000000000001	\N	\N	2025-12-26 19:42:37.582711	2025-12-26 19:42:37.584976
1045	172	2	10	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21347000000000002	\N	\N	2025-12-26 19:42:37.606988	2025-12-26 19:42:37.609154
1048	173	2	8	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.1084	\N	\N	2025-12-26 19:42:37.617781	2025-12-26 19:42:37.620102
256	173	2	4	7	1	2025-02-18	2025-02-18	7.809	7.362	0.6368	0.6062	0.621	7.641	7.96	\N	\N	\N	\N	0.20363	\N	\N	2025-02-18 00:00:00	2025-12-26 19:42:37.62909
1068	172	2	13	3	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.27727	\N	\N	2025-12-26 19:42:37.727543	2025-12-26 19:42:37.729675
1071	173	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23292000000000002	\N	\N	2025-12-26 19:42:37.738058	2025-12-26 19:42:37.740229
1074	173	2	13	3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.27826	\N	\N	2025-12-26 19:42:37.748665	2025-12-26 19:42:37.750719
1077	173	2	13	3	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.16027999999999998	\N	\N	2025-12-26 19:42:37.759087	2025-12-26 19:42:37.761192
1080	174	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22926000000000002	\N	\N	2025-12-26 19:42:37.769628	2025-12-26 19:42:37.771789
1083	174	2	13	3	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22544000000000003	\N	\N	2025-12-26 19:42:37.780492	2025-12-26 19:42:37.78256
1086	174	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20245000000000002	\N	\N	2025-12-26 19:42:37.791004	2025-12-26 19:42:37.793055
1093	175	1	6	10	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.17146	\N	\N	2025-12-26 19:42:37.822558	2025-12-26 19:42:37.824675
1096	175	1	2	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20845	\N	\N	2025-12-26 19:42:37.833565	2025-12-26 19:42:37.835807
1106	176	2	11	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.26657	\N	\N	2025-12-26 19:42:37.877032	2025-12-26 19:42:37.87907
1109	176	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.05277000000000001	\N	\N	2025-12-26 19:42:37.89851	2025-12-26 19:42:37.900537
1111	178	1	5	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20128000000000004	\N	\N	2025-12-26 19:42:37.919769	2025-12-26 19:42:37.921855
1114	179	1	5	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.17390999999999998	\N	\N	2025-12-26 19:42:37.93026	2025-12-26 19:42:37.932325
1117	175	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23541	\N	\N	2025-12-26 19:42:37.9409	2025-12-26 19:42:37.942999
1120	177	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23787	\N	\N	2025-12-26 19:42:37.962267	2025-12-26 19:42:37.964495
1123	178	1	7	5	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.17044	\N	\N	2025-12-26 19:42:37.984132	2025-12-26 19:42:37.98621
1126	179	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01448	\N	\N	2025-12-26 19:42:38.005579	2025-12-26 19:42:38.008092
1127	179	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22784	\N	\N	2025-12-26 19:42:38.023678	2025-12-26 19:42:38.026538
1131	179	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.023700000000000002	\N	\N	2025-12-26 19:42:38.059055	2025-12-26 19:42:38.061376
1138	180	2	10	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21368999999999996	\N	\N	2025-12-26 19:42:38.104532	2025-12-26 19:42:38.106696
1142	181	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24925	\N	\N	2025-12-26 19:42:38.127248	2025-12-26 19:42:38.129405
1151	181	2	10	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21498999999999996	\N	\N	2025-12-26 19:42:38.171409	2025-12-26 19:42:38.173692
1158	182	1	11	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23939	\N	\N	2025-12-26 19:42:38.204712	2025-12-26 19:42:38.206899
1161	182	1	13	3	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23614000000000002	\N	\N	2025-12-26 19:42:38.215629	2025-12-26 19:42:38.217792
1169	183	2	4	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.15574	\N	\N	2025-12-26 19:42:38.259659	2025-12-26 19:42:38.261837
1175	183	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.26029	\N	\N	2025-12-26 19:42:38.281112	2025-12-26 19:42:38.283224
1178	183	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.26979	\N	\N	2025-12-26 19:42:38.291932	2025-12-26 19:42:38.294198
1181	183	2	6	10	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22402999999999998	\N	\N	2025-12-26 19:42:38.302916	2025-12-26 19:42:38.305073
1185	184	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.11264999999999999	\N	\N	2025-12-26 19:42:38.324562	2025-12-26 19:42:38.326741
1188	184	2	1	3	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00872	\N	\N	2025-12-26 19:42:38.336534	2025-12-26 19:42:38.33974
1194	184	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22697	\N	\N	2025-12-26 19:42:38.359361	2025-12-26 19:42:38.361438
1197	184	2	6	10	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.17271999999999998	\N	\N	2025-12-26 19:42:38.369932	2025-12-26 19:42:38.371997
1200	184	2	2	3	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21292000000000003	\N	\N	2025-12-26 19:42:38.380528	2025-12-26 19:42:38.3829
1203	185	1	8	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.04841	\N	\N	2025-12-26 19:42:38.391478	2025-12-26 19:42:38.393599
1206	185	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21559	\N	\N	2025-12-26 19:42:38.401981	2025-12-26 19:42:38.404019
1209	185	1	7	5	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.26791	\N	\N	2025-12-26 19:42:38.412469	2025-12-26 19:42:38.414636
1215	185	2	6	10	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20038	\N	\N	2025-12-26 19:42:38.433698	2025-12-26 19:42:38.435776
1218	185	2	2	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20552	\N	\N	2025-12-26 19:42:38.444291	2025-12-26 19:42:38.446443
1221	185	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20433	\N	\N	2025-12-26 19:42:38.455173	2025-12-26 19:42:38.457299
1224	186	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01272	\N	\N	2025-12-26 19:42:38.466094	2025-12-26 19:42:38.46841
1227	186	2	4	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23940999999999996	\N	\N	2025-12-26 19:42:38.477122	2025-12-26 19:42:38.479258
1230	186	2	2	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.16873000000000002	\N	\N	2025-12-26 19:42:38.488	2025-12-26 19:42:38.49019
1233	187	1	1	11	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.0057799999999999995	\N	\N	2025-12-26 19:42:38.498868	2025-12-26 19:42:38.50098
1236	187	1	1	9	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.251	\N	\N	2025-12-26 19:42:38.509665	2025-12-26 19:42:38.511978
1239	187	2	2	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.17794000000000001	\N	\N	2025-12-26 19:42:38.52063	2025-12-26 19:42:38.522744
1242	184	2	13	3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25942	\N	\N	2025-12-26 19:42:38.531126	2025-12-26 19:42:38.533243
1245	185	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22684000000000004	\N	\N	2025-12-26 19:42:38.541639	2025-12-26 19:42:38.543746
1247	185	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23274999999999996	\N	\N	2025-12-26 19:42:38.552309	2025-12-26 19:42:38.554677
1251	186	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24959	\N	\N	2025-12-26 19:42:38.574135	2025-12-26 19:42:38.576268
1257	187	2	13	3	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.28137	\N	\N	2025-12-26 19:42:38.606155	2025-12-26 19:42:38.608266
1266	188	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21746000000000001	\N	\N	2025-12-26 19:42:38.65995	2025-12-26 19:42:38.662062
1270	188	2	13	3	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24188	\N	\N	2025-12-26 19:42:38.681962	2025-12-26 19:42:38.68415
1282	189	2	13	3	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25291	\N	\N	2025-12-26 19:42:38.757563	2025-12-26 19:42:38.759858
1285	190	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.08093	\N	\N	2025-12-26 19:42:38.790977	2025-12-26 19:42:38.793066
1301	191	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25328	\N	\N	2025-12-26 19:42:38.88926	2025-12-26 19:42:38.891393
1303	191	2	13	3	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25149	\N	\N	2025-12-26 19:42:38.899835	2025-12-26 19:42:38.90191
1309	192	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01473	\N	\N	2025-12-26 19:42:38.943395	2025-12-26 19:42:38.945762
1321	193	1	1	9	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.014419999999999999	\N	\N	2025-12-26 19:42:39.021815	2025-12-26 19:42:39.023864
1326	193	2	6	10	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24778999999999998	\N	\N	2025-12-26 19:42:39.055399	2025-12-26 19:42:39.057762
1333	194	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.17361000000000001	\N	\N	2025-12-26 19:42:39.099477	2025-12-26 19:42:39.101537
1337	195	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01836	\N	\N	2025-12-26 19:42:39.131917	2025-12-26 19:42:39.133998
1342	196	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.02706	\N	\N	2025-12-26 19:42:39.164549	2025-12-26 19:42:39.166919
382	195	1	13	3	4	2025-08-14	2025-08-14	6.633	6.284	0.6466	0.6441	0.645	7.753	8.15	3.08	1.72	0.9	1.9	0.20518999999999998	\N	\N	2025-08-14 00:00:00	2025-12-26 19:42:39.226113
1172	183	2	4	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23883	0.02	0.057	2025-12-26 19:42:38.270354	2025-12-26 19:49:29.164071
1191	184	2	4	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.14952	0.014	0.041	2025-12-26 19:42:38.348374	2025-12-26 19:49:29.205577
1212	185	2	4	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24561000000000002	0.021	0.055	2025-12-26 19:42:38.423135	2025-12-26 19:49:29.226273
1262	188	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.008239999999999999	3.319	\N	2025-12-26 19:42:38.638364	2026-01-11 00:33:57.862624
502	172	1	7	5	1	2025-02-15	2025-02-17	6.513	6.91	0.7056	0.7040000000000001	0.705	8.036	8.05	\N	\N	\N	\N	0.1294	\N	\N	2025-02-15 00:00:00	2025-12-26 19:42:37.578637
1049	173	2	7	5	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19058	\N	\N	2025-12-26 19:42:37.634938	2025-12-26 19:42:37.637111
100	173	2	2	3	1	2025-02-17	2025-02-18	1.425	1.456	0.23149999999999998	0.24170000000000003	0.237	\N	\N	1.44	4.14	2.97	2.85	0.12857	\N	\N	2025-02-17 00:00:00	2025-12-26 19:42:37.646123
1051	174	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01307	\N	\N	2025-12-26 19:42:37.657255	2025-12-26 19:42:37.659271
1054	175	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00695	\N	\N	2025-12-26 19:42:37.668289	2025-12-26 19:42:37.670453
1057	174	1	4	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20952	\N	\N	2025-12-26 19:42:37.679247	2025-12-26 19:42:37.681397
1062	174	1	6	10	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.17332	\N	\N	2025-12-26 19:42:37.700808	2025-12-26 19:42:37.70286
1065	174	1	2	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.18201	\N	\N	2025-12-26 19:42:37.711212	2025-12-26 19:42:37.713325
1087	175	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00932	\N	\N	2025-12-26 19:42:37.796283	2025-12-26 19:42:37.798316
1090	175	1	4	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19405999999999998	\N	\N	2025-12-26 19:42:37.806767	2025-12-26 19:42:37.808829
1099	176	1	1	11	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01292	\N	\N	2025-12-26 19:42:37.850165	2025-12-26 19:42:37.852314
1102	176	1	5	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22991999999999999	\N	\N	2025-12-26 19:42:37.861208	2025-12-26 19:42:37.863348
302	176	1	13	3	2	2025-04-02	2025-04-02	7.535	7.484	0.6404000000000001	0.6214	0.631	\N	7.72	1.58	0.95	1.86	1.463	0.25275	\N	\N	2025-04-02 00:00:00	2025-12-26 19:42:37.946224
1122	177	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21948	\N	\N	2025-12-26 19:42:37.978909	2025-12-26 19:42:37.980929
1136	180	1	13	3	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21311	\N	\N	2025-12-26 19:42:38.087816	2025-12-26 19:42:38.089978
1139	181	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01651	\N	\N	2025-12-26 19:42:38.109995	2025-12-26 19:42:38.112179
1143	181	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.2826	\N	\N	2025-12-26 19:42:38.132848	2025-12-26 19:42:38.135027
1146	181	1	13	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.3061	\N	\N	2025-12-26 19:42:38.143775	2025-12-26 19:42:38.145969
577	181	1	9	2	1	2025-04-25	2025-04-25	7.312	7.435	0.7354	0.7222	0.729	8.034	8.14	0.66	3.38	0.33	1.457	0.26013000000000003	\N	\N	2025-04-25 00:00:00	2025-12-26 19:42:38.165651
1163	182	1	9	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22106	\N	\N	2025-12-26 19:42:38.232139	2025-12-26 19:42:38.234338
1248	186	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.27686	\N	\N	2025-12-26 19:42:38.557888	2025-12-26 19:42:38.559995
1254	186	2	10	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22230000000000003	\N	\N	2025-12-26 19:42:38.590032	2025-12-26 19:42:38.592073
625	188	1	8	2	1	2025-06-10	2025-06-11	7.117	7.752	0.7508	0.7522	0.752	7.513	7.82	0.15	4.33	1.72	2.067	0.057229999999999996	\N	\N	2025-06-10 00:00:00	2025-12-26 19:42:38.633066
1265	188	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25914000000000004	\N	\N	2025-12-26 19:42:38.654377	2025-12-26 19:42:38.656647
1267	188	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23277000000000003	\N	\N	2025-12-26 19:42:38.665357	2025-12-26 19:42:38.667485
1269	188	2	13	3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.27221	\N	\N	2025-12-26 19:42:38.67655	2025-12-26 19:42:38.67865
1273	188	2	10	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19638000000000003	\N	\N	2025-12-26 19:42:38.709743	2025-12-26 19:42:38.711884
1276	189	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01693	\N	\N	2025-12-26 19:42:38.72056	2025-12-26 19:42:38.72258
1281	189	2	13	3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24574000000000001	\N	\N	2025-12-26 19:42:38.752139	2025-12-26 19:42:38.754272
1284	189	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.13457	\N	\N	2025-12-26 19:42:38.785214	2025-12-26 19:42:38.787563
1289	190	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.13391999999999998	\N	\N	2025-12-26 19:42:38.807278	2025-12-26 19:42:38.809367
1296	190	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.28367000000000003	\N	\N	2025-12-26 19:42:38.862569	2025-12-26 19:42:38.864708
1306	191	2	13	3	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24841000000000005	\N	\N	2025-12-26 19:42:38.91602	2025-12-26 19:42:38.918095
1314	192	2	13	3	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24692	\N	\N	2025-12-26 19:42:38.972059	2025-12-26 19:42:38.974339
1317	192	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19039	\N	\N	2025-12-26 19:42:39.005918	2025-12-26 19:42:39.00804
214	193	2	4	3	1	2025-07-08	2025-07-09	8.006	7.65	0.6079	0.573	0.59	7.587	8.23	\N	\N	\N	\N	0.21003	\N	\N	2025-07-08 00:00:00	2025-12-26 19:42:39.037743
1330	194	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01836	\N	\N	2025-12-26 19:42:39.083028	2025-12-26 19:42:39.085205
1332	194	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.30812	\N	\N	2025-12-26 19:42:39.093996	2025-12-26 19:42:39.09618
79	194	2	2	3	3	2025-07-12	2025-07-14	1.788	1.659	0.1081	0.1998	0.154	\N	\N	4.53	8.18	17.38	10.03	0.19297	\N	\N	2025-07-12 00:00:00	2025-12-26 19:42:39.11559
638	196	1	8	2	1	2025-08-06	2025-08-06	6.334	7.07	0.7597	0.7615999999999999	0.761	7.506	7.96	3.36	1.78	4.63	3.257	0.22997	\N	\N	2025-08-06 00:00:00	2025-12-26 19:42:39.257189
1347	199	1	7	5	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23609000000000005	\N	\N	2025-12-26 19:42:39.403085	2025-12-26 19:42:39.405255
1166	183	1	8	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.09236000000000001	0.004	0.017	2025-12-26 19:42:38.243329	2025-12-26 19:49:29.211303
24	173	2	5	7	1	2025-02-19	2025-02-20	3.454	3.109	0.1012	0.099	0.1	\N	\N	\N	\N	\N	\N	0.22481000000000004	\N	\N	2025-02-19 00:00:00	2025-12-26 19:42:37.627124
706	173	2	6	10	2	2025-02-21	2025-02-21	4.971	5.263	0.8210999999999999	0.8273999999999999	0.824	\N	\N	0.99	0.79	2.63	1.47	0.17409	\N	\N	2025-02-21 00:00:00	2025-12-26 19:42:37.638623
1050	173	2	9	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20210999999999996	\N	\N	2025-12-26 19:42:37.649997	2025-12-26 19:42:37.652221
1052	174	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.014029999999999999	\N	\N	2025-12-26 19:42:37.660655	2025-12-26 19:42:37.662885
1055	174	1	5	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.010860000000000002	\N	\N	2025-12-26 19:42:37.671935	2025-12-26 19:42:37.674082
1058	174	1	4	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.18547999999999998	\N	\N	2025-12-26 19:42:37.682927	2025-12-26 19:42:37.685071
1060	174	1	6	10	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.20695000000000002	\N	\N	2025-12-26 19:42:37.693782	2025-12-26 19:42:37.695895
1063	174	1	2	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.15248	\N	\N	2025-12-26 19:42:37.704263	2025-12-26 19:42:37.706343
1066	174	1	2	3	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23288000000000003	\N	\N	2025-12-26 19:42:37.714729	2025-12-26 19:42:37.716883
1088	175	1	5	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.025970000000000003	\N	\N	2025-12-26 19:42:37.799746	2025-12-26 19:42:37.801832
1091	175	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.14461000000000002	\N	\N	2025-12-26 19:42:37.810221	2025-12-26 19:42:37.812293
1100	176	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.021419999999999998	\N	\N	2025-12-26 19:42:37.85391	2025-12-26 19:42:37.85614
1103	176	1	4	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.23747	\N	\N	2025-12-26 19:42:37.864754	2025-12-26 19:42:37.866861
1125	178	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25605	\N	\N	2025-12-26 19:42:37.993007	2025-12-26 19:42:37.995177
1133	180	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24704	\N	\N	2025-12-26 19:42:38.068742	2025-12-26 19:42:38.070983
1135	180	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.30145	\N	\N	2025-12-26 19:42:38.079953	2025-12-26 19:42:38.082319
1140	181	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01259	\N	\N	2025-12-26 19:42:38.113681	2025-12-26 19:42:38.116058
1147	181	1	13	3	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.27114	\N	\N	2025-12-26 19:42:38.147433	2025-12-26 19:42:38.14952
197	181	2	2	3	1	2025-04-15	2025-04-15	3.629	3.066	0.5706	0.5364	0.553	\N	\N	2.66	0.32	11.22	4.733	0.25743	\N	\N	2025-04-15 00:00:00	2025-12-26 19:42:38.158265
1153	182	1	1	7	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.10592	\N	\N	2025-12-26 19:42:38.180767	2025-12-26 19:42:38.182943
1164	182	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22405	\N	\N	2025-12-26 19:42:38.235843	2025-12-26 19:42:38.23824
1167	183	2	1	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.1462	\N	\N	2025-12-26 19:42:38.247016	2025-12-26 19:42:38.249193
655	187	1	8	2	1	2025-06-03	2025-06-04	7.528	7.44	0.7778	0.7762	0.777	7.523	8.25	1.16	0.37	2.47	1.333	0.1474	\N	\N	2025-06-03 00:00:00	2025-12-26 19:42:38.59351
1264	188	2	5	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.13257	\N	\N	2025-12-26 19:42:38.647162	2025-12-26 19:42:38.649292
1268	188	2	13	3	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.22762000000000004	\N	\N	2025-12-26 19:42:38.668925	2025-12-26 19:42:38.671109
1274	189	1	8	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.11954000000000001	\N	\N	2025-12-26 19:42:38.713344	2025-12-26 19:42:38.715518
1277	189	1	1	9	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.01659	\N	\N	2025-12-26 19:42:38.723959	2025-12-26 19:42:38.725997
1278	189	2	7	6	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.24966000000000002	\N	\N	2025-12-26 19:42:38.734597	2025-12-26 19:42:38.736632
1280	189	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.27385000000000004	\N	\N	2025-12-26 19:42:38.745049	2025-12-26 19:42:38.747132
454	189	1	13	3	5	2025-07-03	2025-07-04	7.178	7.205	0.6698999999999999	0.6654000000000001	0.668	7.825	7.96	5.37	1.52	0.75	2.547	0.27174	\N	\N	2025-07-03 00:00:00	2025-12-26 19:42:38.755687
81	189	2	2	3	1	2025-06-07	2025-06-09	1.445	1.609	0.152	0.1592	0.156	\N	\N	2.12	1.18	1.96	1.753	0.18279	\N	\N	2025-06-07 00:00:00	2025-12-26 19:42:38.777866
1287	190	1	1	9	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.014369999999999999	\N	\N	2025-12-26 19:42:38.800044	2025-12-26 19:42:38.802175
1291	190	2	13	3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.25889	\N	\N	2025-12-26 19:42:38.821949	2025-12-26 19:42:38.824063
1293	190	2	13	3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.26543	\N	\N	2025-12-26 19:42:38.832923	2025-12-26 19:42:38.835273
1297	190	2	10	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.19821	\N	\N	2025-12-26 19:42:38.866174	2025-12-26 19:42:38.868291
1318	192	2	10	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.18411999999999998	\N	\N	2025-12-26 19:42:39.009425	2025-12-26 19:42:39.011577
1331	194	1	1	9	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.12563000000000002	\N	\N	2025-12-26 19:42:39.08662	2025-12-26 19:42:39.088759
1334	194	2	10	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21755	\N	\N	2025-12-26 19:42:39.11949	2025-12-26 19:42:39.121598
1341	195	1	4	3	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.21532	\N	\N	2025-12-26 19:42:39.151403	2025-12-26 19:42:39.153645
452	197	1	13	3	6	2025-08-27	2025-08-28	7.775	7.425	0.665	0.6668999999999999	0.666	7.755	7.34	1.95	0.52	0.35	0.94	0.23818	\N	\N	2025-08-27 00:00:00	2025-12-26 19:42:39.340316
209	199	2	4	7	1	2025-08-19	2025-08-19	7.403	7.156	0.6	0.5738	0.587	7.535	7.86	\N	\N	\N	\N	0.08681	\N	\N	2025-08-19 00:00:00	2025-12-26 19:42:39.406716
649	178	1	8	2	1	2025-04-02	2025-04-02	7.664	7.496	0.7967	0.7498	0.773	7.774	7.81	0.28	0.46	2.91	1.217	0.13714	0.004	0.017	2025-04-02 00:00:00	2025-12-26 19:49:28.951017
1144	181	1	11	2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.28723	0.004	0.015	2025-12-26 19:42:38.136465	2025-12-26 19:49:29.17907
\.


--
-- Data for Name: notas_informe; Type: TABLE DATA; Schema: public; Owner: funglusapp
--

COPY public.notas_informe (id, ciclo_id, etapa_id, muestra_id, origen_id, secuencia_id, nota, usuario_email, usuario_nombre, created_at, updated_at) FROM stdin;
1	191	2	1	7	\N	HOla	admin@funglus.com	Felipe	2026-01-10 21:01:45.163589	2026-01-10 21:01:45.163589
2	191	2	1	7	\N	HOla	admin@funglus.com	Felipe	2026-01-10 21:01:56.595463	2026-01-10 21:01:56.595463
5	201	2	1	3	\N	Hola	admin@funglus.com	Felipe	2026-01-10 22:23:25.726943	2026-01-10 22:23:25.726943
6	185	2	1	7	\N	HOLA	admin@funglus.com	Felipe	2026-01-10 23:47:08.163597	2026-01-10 23:47:08.163597
\.


--
-- Data for Name: registros_analisis_cenizas; Type: TABLE DATA; Schema: public; Owner: funglusapp
--

COPY public.registros_analisis_cenizas (id, ciclo_procesamiento_id, ciclo_catalogo_id, etapa_catalogo_id, muestra_catalogo_id, origen_catalogo_id, secuencia_catalogo_id, peso_crisol_vacio_g, peso_crisol_mas_muestra_g, peso_crisol_mas_cenizas_g, calc_cenizas_porc, created_at, updated_at) FROM stdin;
1	2	163	1	13	3	1	45.358	47.519	45.878	0.25424	2025-09-06 00:00:00	2025-09-06 00:00:00
2	2	163	1	13	3	2	27.357	28.773	27.717	0.24169000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
3	2	163	1	13	3	3	25.102	26.426	25.422	0.24749	2025-09-06 00:00:00	2025-09-06 00:00:00
4	2	163	1	13	3	4	47.287	48.382	47.558	0.22304	2025-09-06 00:00:00	2025-09-06 00:00:00
5	2	163	1	13	3	5	25.101	26.594	25.434	0.23388999999999996	2025-09-06 00:00:00	2025-09-06 00:00:00
6	2	163	1	13	3	6	47.286	48.962	47.678	0.22577999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
7	2	163	1	13	3	7	45.355	47.543	45.849	0.24468000000000004	2025-09-06 00:00:00	2025-09-06 00:00:00
8	2	163	1	13	3	8	25.092	26.596	25.46	0.26568	2025-09-06 00:00:00	2025-09-06 00:00:00
9	2	164	1	13	3	1	47.285	49.788	47.95	0.27141	2025-09-06 00:00:00	2025-09-06 00:00:00
10	2	164	1	13	3	2	45.362	47.429	45.923	0.27159	2025-09-06 00:00:00	2025-09-06 00:00:00
11	2	164	1	13	3	3	27.357	29.36	27.901	0.25988	2025-09-06 00:00:00	2025-09-06 00:00:00
12	2	164	1	13	3	4	47.288	49.489	47.86	0.27014	2025-09-06 00:00:00	2025-09-06 00:00:00
13	2	164	1	13	3	5	45.362	47.261	45.875	0.27876999999999996	2025-09-06 00:00:00	2025-09-06 00:00:00
14	2	164	1	13	3	6	45.361	47.09	45.843	0.27091	2025-09-06 00:00:00	2025-09-06 00:00:00
15	2	164	1	13	3	7	25.099	26.701	25.533	0.24790999999999996	2025-09-06 00:00:00	2025-09-06 00:00:00
16	2	164	1	13	3	8	25.102	26.78	25.518	0.2505	2025-09-06 00:00:00	2025-09-06 00:00:00
17	2	164	1	13	3	9	27.361	28.87	27.739	0.25703	2025-09-06 00:00:00	2025-09-06 00:00:00
18	2	165	1	11	2	1	27.355	29.347	27.867	0.28422000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
19	2	165	1	13	3	1	47.293	49.777	47.999	0.27908	2025-09-06 00:00:00	2025-09-06 00:00:00
20	2	165	1	13	3	2	25.105	27.065	25.652	0.28736999999999996	2025-09-06 00:00:00	2025-09-06 00:00:00
21	2	165	1	13	3	3	45.364	47.518	45.983	0.28224	2025-09-06 00:00:00	2025-09-06 00:00:00
22	2	165	1	13	3	4	27.371	29.015	27.835	0.27915	2025-09-06 00:00:00	2025-09-06 00:00:00
23	2	165	1	13	3	5	25.102	26.929	25.612	0.28215	2025-09-06 00:00:00	2025-09-06 00:00:00
24	2	165	1	13	3	6	27.37	29.252	27.901	0.27924	2025-09-06 00:00:00	2025-09-06 00:00:00
25	2	165	1	13	3	7	25.104	26.78	25.572	0.26272	2025-09-06 00:00:00	2025-09-06 00:00:00
26	2	165	1	13	3	8	45.366	47.528	45.934	0.19712	2025-09-06 00:00:00	2025-09-06 00:00:00
27	2	165	2	6	10	2	27.353	28.393	27.558	0.22259000000000004	2025-09-06 00:00:00	2025-09-06 00:00:00
28	2	165	1	9	2	1	27.353	28.265	27.556	0.2228	2025-09-06 00:00:00	2025-09-06 00:00:00
29	2	165	1	10	2	1	25.1	26.056	25.313	0.21886000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
30	2	166	1	8	2	1	25.102	25.929	25.283	0.24489999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
31	2	166	2	4	3	1	27.359	29.515	27.887	0.22830999999999996	2025-09-06 00:00:00	2025-09-06 00:00:00
32	2	166	2	4	3	2	47.275	49.719	47.833	0.18728999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
33	2	166	1	7	6	1	27.354	28.55	27.578	0.25257	2025-09-06 00:00:00	2025-09-06 00:00:00
34	2	166	1	11	2	1	45.365	47.507	45.906	0.23414999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
35	2	166	1	11	2	2	25.103	26.491	25.428	0.26691	2025-09-06 00:00:00	2025-09-06 00:00:00
36	2	166	1	13	3	1	47.3	49.754	47.955	0.27863	2025-09-06 00:00:00	2025-09-06 00:00:00
37	2	166	1	13	3	2	27.361	29.195	27.872	0.30095	2025-09-06 00:00:00	2025-09-06 00:00:00
38	2	166	1	13	3	3	25.109	27.518	25.834	0.28371999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
39	2	166	1	13	3	4	45.376	47.815	46.068	0.27649	2025-09-06 00:00:00	2025-09-06 00:00:00
40	2	166	1	13	3	5	47.296	49.325	47.857	0.27791	2025-09-06 00:00:00	2025-09-06 00:00:00
41	2	166	1	13	3	6	27.364	29.451	27.944	0.28489000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
42	2	166	1	13	3	8	45.371	47.979	46.114	0.27879000000000004	2025-09-06 00:00:00	2025-09-06 00:00:00
43	2	166	1	13	3	9	47.297	49.503	47.912	0.19106	2025-09-06 00:00:00	2025-09-06 00:00:00
44	2	166	2	6	10	2	47.28	48.332	47.481	0.14889	2025-09-06 00:00:00	2025-09-06 00:00:00
45	2	166	2	6	10	4	45.356	46.303	45.497	0.13233	2025-09-06 00:00:00	2025-09-06 00:00:00
46	2	166	2	2	3	1	45.364	46.49	45.513	0.2084	2025-09-06 00:00:00	2025-09-06 00:00:00
47	2	166	1	9	2	1	47.308	48.642	47.586	0.22521000000000005	2025-09-06 00:00:00	2025-09-06 00:00:00
48	2	166	1	10	1	1	45.366	47.191	45.777	0.23880999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
49	2	166	1	10	2	1	45.374	47.116	45.79	0.25701	2025-09-06 00:00:00	2025-09-06 00:00:00
50	2	166	1	10	2	2	25.105	26.603	25.49	0.24048	2025-09-06 00:00:00	2025-09-06 00:00:00
51	2	167	1	8	2	1	47.298	48.558	47.601	0.18089	2025-09-06 00:00:00	2025-09-06 00:00:00
52	2	167	2	1	3	1	45.363	46.347	45.541	0.13895	2025-09-06 00:00:00	2025-09-06 00:00:00
53	2	167	2	1	3	2	27.362	28.348	27.499	0.0718	2025-09-06 00:00:00	2025-09-06 00:00:00
54	2	167	2	1	3	3	47.288	48.43	47.37	0.00487	2025-09-06 00:00:00	2025-09-06 00:00:00
55	2	167	2	5	7	1	25.106	27.158	25.116	0.04922000000000001	2025-09-06 00:00:00	2025-09-06 00:00:00
56	2	167	2	5	14	1	47.285	48.951	47.367	0.23035	2025-09-06 00:00:00	2025-09-06 00:00:00
57	2	167	2	4	7	1	25.102	28.232	25.823	0.19890999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
58	2	167	1	7	5	1	27.36	29.195	27.725	0.21909	2025-09-06 00:00:00	2025-09-06 00:00:00
59	2	167	1	7	6	1	47.296	49.496	47.778	0.21777000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
60	2	167	2	4	3	1	45.358	47.53	45.831	0.24153	2025-09-06 00:00:00	2025-09-06 00:00:00
61	2	167	2	4	3	2	27.369	29.406	27.861	0.30358	2025-09-06 00:00:00	2025-09-06 00:00:00
62	2	167	1	11	2	1	25.105	26.472	25.52	0.2799	2025-09-06 00:00:00	2025-09-06 00:00:00
63	2	167	1	11	2	2	27.364	28.986	27.818	0.33215000000000006	2025-09-06 00:00:00	2025-09-06 00:00:00
64	2	167	1	13	3	1	27.369	29.338	28.023	0.32	2025-09-06 00:00:00	2025-09-06 00:00:00
65	2	167	1	13	3	2	45.396	47.796	46.164	0.30998000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
66	2	167	1	13	3	7	27.37	29.254	27.954	0.32397	2025-09-06 00:00:00	2025-09-06 00:00:00
67	2	167	1	13	3	8	47.316	49.807	48.123	0.21899999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
68	2	167	2	6	10	1	25.102	26.207	25.344	0.22259000000000004	2025-09-06 00:00:00	2025-09-06 00:00:00
69	2	167	2	6	10	3	27.358	27.969	27.494	0.2535	2025-09-06 00:00:00	2025-09-06 00:00:00
70	2	167	2	6	10	4	27.375	28.018	27.538	0.16908	2025-09-06 00:00:00	2025-09-06 00:00:00
71	2	167	2	2	7	1	45.363	46.055	45.48	0.22222	2025-09-06 00:00:00	2025-09-06 00:00:00
72	2	167	2	2	3	1	45.359	46.079	45.519	0.21143	2025-09-06 00:00:00	2025-09-06 00:00:00
73	2	167	2	2	3	2	25.096	25.971	25.281	0.21549999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
74	2	167	2	2	3	3	47.277	48.219	47.48	0.25639	2025-09-06 00:00:00	2025-09-06 00:00:00
75	2	167	1	9	2	1	47.295	48.859	47.696	0.26702000000000004	2025-09-06 00:00:00	2025-09-06 00:00:00
76	2	167	1	10	2	1	47.298	49.354	47.847	0.22498	2025-09-06 00:00:00	2025-09-06 00:00:00
77	2	168	1	8	2	1	25.108	26.197	25.353	0.06799000000000001	2025-09-06 00:00:00	2025-09-06 00:00:00
78	2	168	2	1	3	1	45.367	46.985	45.477	0.06682	2025-09-06 00:00:00	2025-09-06 00:00:00
79	2	168	2	1	3	2	25.11	26.457	25.2	0.022189999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
80	2	168	2	1	9	1	45.361	46.713	45.391	0.02428	2025-09-06 00:00:00	2025-09-06 00:00:00
81	2	168	2	5	7	1	25.103	27.492	25.161	0.058550000000000005	2025-09-06 00:00:00	2025-09-06 00:00:00
82	2	168	2	5	3	1	27.359	29.067	27.459	0.26205	2025-09-06 00:00:00	2025-09-06 00:00:00
83	2	168	2	4	7	1	27.371	29.508	27.931	0.13475	2025-09-06 00:00:00	2025-09-06 00:00:00
84	2	168	1	7	5	1	47.302	48.853	47.511	0.15265	2025-09-06 00:00:00	2025-09-06 00:00:00
85	2	168	1	7	6	1	47.297	49.105	47.573	0.23206	2025-09-06 00:00:00	2025-09-06 00:00:00
86	2	168	2	4	3	1	47.294	49.328	47.766	0.25615	2025-09-06 00:00:00	2025-09-06 00:00:00
87	2	168	2	4	3	2	27.368	29.117	27.816	0.25812	2025-09-06 00:00:00	2025-09-06 00:00:00
88	2	168	1	11	2	1	45.392	47.302	45.885	0.19515000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
89	2	168	2	6	10	1	47.298	48.082	47.451	0.17890999999999999	2025-09-06 00:00:00	2025-09-06 00:00:00
90	2	168	2	6	10	3	25.099	25.943	25.25	0.20526	2025-09-06 00:00:00	2025-09-06 00:00:00
91	2	168	2	6	10	4	27.364	28.163	27.528	0.13712	2025-09-06 00:00:00	2025-09-06 00:00:00
92	2	168	2	2	3	1	47.3	48.62	47.481	0.17128	2025-09-06 00:00:00	2025-09-06 00:00:00
93	2	168	2	2	3	2	25.101	25.895	25.237	0.17892	2025-09-06 00:00:00	2025-09-06 00:00:00
94	2	168	2	2	3	3	47.294	48.423	47.496	0.17098	2025-09-06 00:00:00	2025-09-06 00:00:00
95	2	168	2	2	3	4	45.363	46.445	45.548	0.22002	2025-09-06 00:00:00	2025-09-06 00:00:00
96	2	168	1	9	2	1	47.299	48.967	47.666	0.22585	2025-09-06 00:00:00	2025-09-06 00:00:00
97	2	168	1	10	2	1	45.386	46.763	45.697	0.22374	2025-09-06 00:00:00	2025-09-06 00:00:00
98	2	168	1	10	1	1	25.113	26.065	25.326	0.12636	2025-09-06 00:00:00	2025-09-06 00:00:00
99	2	169	1	8	2	1	47.308	49.603	47.598	0.02741	2025-09-06 00:00:00	2025-09-06 00:00:00
100	2	169	2	1	7	1	45.375	46.944	45.418	0.01125	2025-09-06 00:00:00	2025-09-06 00:00:00
101	2	169	2	1	9	2	45.385	46.807	45.401	0.02024	2025-09-06 00:00:00	2025-09-06 00:00:00
102	2	169	2	1	9	1	45.36	46.595	45.385	0.04721	2025-09-06 00:00:00	2025-09-06 00:00:00
103	2	169	2	5	7	1	45.366	47.357	45.46	0.03676	2025-09-06 00:00:00	2025-09-06 00:00:00
104	2	169	2	5	3	1	25.111	27.369	25.194	0.22960999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
105	2	169	2	4	7	1	25.103	27.285	25.604	0.11188999999999999	2025-09-06 00:00:00	2025-09-06 00:00:00
106	2	169	1	7	5	1	27.365	28.652	27.509	0.15273	2025-09-06 00:00:00	2025-09-06 00:00:00
107	2	169	1	7	6	1	45.388	46.56	45.567	0.24442999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
108	2	169	2	4	3	1	45.38	47.221	45.83	0.21216999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
109	2	169	2	4	3	2	47.304	48.619	47.583	0.21519	2025-09-06 00:00:00	2025-09-06 00:00:00
110	2	169	2	6	10	1	47.299	48.326	47.52	0.17129999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
111	2	169	2	6	10	2	25.114	25.762	25.225	0.17602	2025-09-06 00:00:00	2025-09-06 00:00:00
112	2	169	2	6	10	3	25.113	25.772	25.229	0.20433	2025-09-06 00:00:00	2025-09-06 00:00:00
113	2	169	2	6	10	4	27.366	28.198	27.536	0.18652000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
114	2	169	2	2	7	1	27.367	28.198	27.522	0.14007	2025-09-06 00:00:00	2025-09-06 00:00:00
115	2	169	2	2	3	1	25.104	26.282	25.269	0.13009	2025-09-06 00:00:00	2025-09-06 00:00:00
116	2	169	2	2	3	2	27.367	28.374	27.498	0.14945	2025-09-06 00:00:00	2025-09-06 00:00:00
117	2	169	2	2	3	3	45.368	46.365	45.517	0.08795	2025-09-06 00:00:00	2025-09-06 00:00:00
118	2	170	2	1	7	1	27.368	28.596	27.476	0.01714	2025-09-06 00:00:00	2025-09-06 00:00:00
119	2	170	2	1	9	1	47.311	48.653	47.334	0.02154	2025-09-06 00:00:00	2025-09-06 00:00:00
120	2	170	2	1	9	2	25.107	26.5	25.137	0.014129999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
121	2	170	2	5	7	1	27.37	29.422	27.399	0.01884	2025-09-06 00:00:00	2025-09-06 00:00:00
122	2	170	2	5	3	1	45.386	47.668	45.429	0.24527000000000004	2025-09-06 00:00:00	2025-09-06 00:00:00
123	2	170	2	4	7	1	45.379	47.018	45.781	0.22509	2025-09-06 00:00:00	2025-09-06 00:00:00
124	2	170	2	4	3	1	25.116	27.284	25.604	0.16146999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
125	2	170	2	6	10	1	47.315	48.052	47.434	0.16858	2025-09-06 00:00:00	2025-09-06 00:00:00
126	2	170	2	2	7	1	25.114	25.986	25.261	0.12982	2025-09-06 00:00:00	2025-09-06 00:00:00
127	2	170	2	2	3	1	25.111	25.966	25.222	0.14917	2025-09-06 00:00:00	2025-09-06 00:00:00
128	2	170	2	2	3	2	47.299	48.385	47.461	0.14144	2025-09-06 00:00:00	2025-09-06 00:00:00
129	2	170	2	2	3	3	27.366	28.377	27.509	0.30883	2025-09-06 00:00:00	2025-09-06 00:00:00
130	2	167	1	13	3	5	47.314	49.545	48.003	0.31745	2025-09-06 00:00:00	2025-09-06 00:00:00
131	2	167	1	13	3	6	45.387	47.611	46.093	0.32155	2025-09-06 00:00:00	2025-09-06 00:00:00
132	2	167	1	13	3	3	25.117	26.955	25.708	0.32699	2025-09-06 00:00:00	2025-09-06 00:00:00
133	2	167	1	13	3	4	27.371	29.368	28.024	0.31608	2025-09-06 00:00:00	2025-09-06 00:00:00
134	2	168	2	12	2	1	45.386	47.531	46.064	0.27458	2025-09-06 00:00:00	2025-09-06 00:00:00
135	2	168	2	13	3	5	25.112	26.536	25.503	0.27606	2025-09-06 00:00:00	2025-09-06 00:00:00
136	2	168	2	13	3	7	27.374	29.254	27.893	0.2845	2025-09-06 00:00:00	2025-09-06 00:00:00
137	2	168	2	13	3	3	25.111	27.227	25.713	0.28473	2025-09-06 00:00:00	2025-09-06 00:00:00
138	2	168	2	13	3	2	27.371	29.552	27.992	0.28608	2025-09-06 00:00:00	2025-09-06 00:00:00
139	2	168	2	13	3	4	47.32	49.683	47.996	0.28972000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
140	2	168	2	13	3	6	27.371	29.473	27.98	0.29091	2025-09-06 00:00:00	2025-09-06 00:00:00
141	2	168	2	13	3	1	47.319	50.124	48.135	0.29463	2025-09-06 00:00:00	2025-09-06 00:00:00
142	2	168	2	13	3	9	25.115	27.053	25.686	0.30957999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
143	2	168	2	13	3	8	45.398	47.559	46.067	0.22579000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
144	2	169	2	11	2	2	45.393	47.293	45.822	0.20257999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
145	2	169	2	11	2	1	47.324	49.027	47.669	0.23926	2025-09-06 00:00:00	2025-09-06 00:00:00
146	2	169	2	13	3	1	45.396	47.841	45.981	0.24061999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
147	2	169	1	13	3	2	45.407	47.859	45.997	0.22447999999999999	2025-09-06 00:00:00	2025-09-06 00:00:00
148	2	169	1	13	3	3	47.326	49.687	47.856	0.24301999999999999	2025-09-06 00:00:00	2025-09-06 00:00:00
149	2	169	2	13	3	4	45.409	47.129	45.827	0.23975000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
150	2	169	2	13	3	6	45.404	47.452	45.895	0.25407	2025-09-06 00:00:00	2025-09-06 00:00:00
151	2	169	2	13	3	7	45.413	47.747	46.006	0.2594	2025-09-06 00:00:00	2025-09-06 00:00:00
152	2	169	2	13	3	8	25.114	27.161	25.645	0.23277000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
153	2	169	2	13	3	9	25.119	26.425	25.423	0.21453000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
154	2	169	2	9	2	1	47.317	48.762	47.627	0.21308	2025-09-06 00:00:00	2025-09-06 00:00:00
155	2	169	2	10	1	1	47.314	48.675	47.604	0.23184999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
156	2	169	2	10	1	2	47.317	48.956	47.697	0.21597	2025-09-06 00:00:00	2025-09-06 00:00:00
157	2	169	2	10	2	1	27.377	28.604	27.642	0.20975999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
158	2	169	2	10	2	2	45.395	47.035	45.739	0.18645	2025-09-06 00:00:00	2025-09-06 00:00:00
159	2	170	2	8	2	1	47.318	48.632	47.563	0.22122999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
160	2	170	2	12	2	1	45.411	47.531	45.88	0.36837000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
161	2	170	2	4	3	2	45.386	47.403	46.129	0.09831	2025-09-06 00:00:00	2025-09-06 00:00:00
162	2	170	2	7	5	1	27.376	28.851	27.521	0.0947	2025-09-06 00:00:00	2025-09-06 00:00:00
163	2	170	2	7	6	1	45.397	47.361	45.583	0.2186	2025-09-06 00:00:00	2025-09-06 00:00:00
164	2	170	1	11	2	1	47.33	49.05	47.706	0.24391000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
165	2	170	1	13	3	1	25.116	27.211	25.627	0.23144999999999996	2025-09-06 00:00:00	2025-09-06 00:00:00
166	2	170	1	13	3	2	47.335	49.707	47.884	0.24693	2025-09-06 00:00:00	2025-09-06 00:00:00
167	2	170	1	13	3	3	45.419	47.861	46.022	0.25678	2025-09-06 00:00:00	2025-09-06 00:00:00
168	2	170	1	13	3	4	47.339	49.625	47.926	0.25115	2025-09-06 00:00:00	2025-09-06 00:00:00
169	2	170	1	13	3	5	45.424	47.825	46.027	0.23535	2025-09-06 00:00:00	2025-09-06 00:00:00
170	2	170	1	13	3	6	45.419	47.654	45.945	0.24857999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
171	2	170	1	13	3	7	25.122	26.711	25.517	0.24942000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
172	2	170	1	13	3	8	47.34	49.481	47.874	0.22954	2025-09-06 00:00:00	2025-09-06 00:00:00
173	2	170	1	13	3	9	25.126	26.25	25.384	0.20123999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
174	2	170	1	6	10	3	25.113	25.918	25.275	0.218	2025-09-06 00:00:00	2025-09-06 00:00:00
175	2	170	1	6	10	4	27.377	28.166	27.549	0.17684	2025-09-06 00:00:00	2025-09-06 00:00:00
176	2	171	1	8	2	1	25.115	26.393	25.341	0.042069999999999996	2025-09-06 00:00:00	2025-09-06 00:00:00
177	2	171	1	1	7	1	25.108	26.439	25.164	0.026279999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
178	2	171	1	1	9	1	47.312	48.796	47.351	0.01568	2025-09-06 00:00:00	2025-09-06 00:00:00
179	2	171	1	1	9	2	27.371	28.71	27.392	0.0233	2025-09-06 00:00:00	2025-09-06 00:00:00
180	2	171	1	5	7	1	25.104	27.078	25.15	0.01423	2025-09-06 00:00:00	2025-09-06 00:00:00
181	2	171	1	5	3	1	45.392	47.64	45.424	0.21424	2025-09-06 00:00:00	2025-09-06 00:00:00
182	2	171	1	4	7	1	47.314	48.929	47.66	0.21513000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
183	2	171	1	4	3	1	25.106	27.472	25.615	0.15401	2025-09-06 00:00:00	2025-09-06 00:00:00
184	2	171	1	7	6	1	47.315	48.763	47.538	0.16827999999999999	2025-09-06 00:00:00	2025-09-06 00:00:00
185	2	171	1	6	10	1	45.381	46.207	45.52	0.17937	2025-09-06 00:00:00	2025-09-06 00:00:00
186	2	171	1	6	10	2	27.369	28.038	27.489	0.18579	2025-09-06 00:00:00	2025-09-06 00:00:00
187	2	171	1	6	10	4	25.119	25.851	25.255	0.15975	2025-09-06 00:00:00	2025-09-06 00:00:00
188	2	171	1	2	7	1	25.109	26.242	25.29	0.15068	2025-09-06 00:00:00	2025-09-06 00:00:00
189	2	171	1	2	3	1	25.114	25.99	25.246	0.16143000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
190	2	171	1	2	3	2	45.382	46.336	45.536	0.16413	2025-09-06 00:00:00	2025-09-06 00:00:00
191	2	171	1	2	3	3	27.374	28.294	27.525	0.19711	2025-09-06 00:00:00	2025-09-06 00:00:00
192	2	171	1	9	2	1	47.328	49.129	47.683	0.21236999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
193	2	171	1	10	1	1	45.415	47.242	45.803	0.20942999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
194	2	171	1	10	2	1	25.119	26.413	25.39	0.19324000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
195	2	171	1	10	2	2	47.325	49.188	47.685	0.21383000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
196	2	172	1	8	2	1	47.329	48.573	47.595	0.10342000000000001	2025-09-06 00:00:00	2025-09-06 00:00:00
197	2	172	1	1	7	1	25.119	26.289	25.24	0.08123	2025-09-06 00:00:00	2025-09-06 00:00:00
198	2	172	1	1	11	1	45.4	47.025	45.532	0.01581	2025-09-06 00:00:00	2025-09-06 00:00:00
199	2	172	1	1	9	1	27.381	28.583	27.4	0.02075	2025-09-06 00:00:00	2025-09-06 00:00:00
200	2	172	1	5	7	1	25.116	27.333	25.162	0.00244	2025-09-06 00:00:00	2025-09-06 00:00:00
201	2	172	1	5	3	1	47.336	49.389	47.341	0.21789999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
202	2	172	1	4	3	1	25.12	26.818	25.49	0.25643	2025-09-06 00:00:00	2025-09-06 00:00:00
203	2	172	1	4	3	2	47.327	48.649	47.666	0.13215	2025-09-06 00:00:00	2025-09-06 00:00:00
204	2	172	1	7	5	1	45.395	46.969	45.603	0.1294	2025-09-06 00:00:00	2025-09-06 00:00:00
205	2	172	1	7	6	1	47.33	49.061	47.554	0.19933	2025-09-06 00:00:00	2025-09-06 00:00:00
206	2	172	2	11	2	1	25.131	26.029	25.31	0.16917000000000001	2025-09-06 00:00:00	2025-09-06 00:00:00
207	2	172	2	6	10	1	47.327	48.125	47.462	0.19152000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
208	2	172	2	6	10	2	25.115	25.846	25.255	0.20353000000000004	2025-09-06 00:00:00	2025-09-06 00:00:00
209	2	172	2	6	10	3	25.117	25.967	25.29	0.17939	2025-09-06 00:00:00	2025-09-06 00:00:00
210	2	172	2	2	3	1	27.382	28.207	27.53	0.15773	2025-09-06 00:00:00	2025-09-06 00:00:00
211	2	172	2	2	3	2	47.326	48.296	47.479	0.17047	2025-09-06 00:00:00	2025-09-06 00:00:00
212	2	172	2	2	3	3	25.114	25.859	25.241	0.17462	2025-09-06 00:00:00	2025-09-06 00:00:00
213	2	172	2	2	3	4	47.318	48.177	47.468	0.20567	2025-09-06 00:00:00	2025-09-06 00:00:00
214	2	172	2	9	2	1	47.333	48.991	47.674	0.25232	2025-09-06 00:00:00	2025-09-06 00:00:00
215	2	172	2	9	2	2	45.425	47.474	45.942	0.20952	2025-09-06 00:00:00	2025-09-06 00:00:00
216	2	172	2	10	1	1	45.427	47.107	45.779	0.21347000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
217	2	172	2	10	2	1	47.344	48.829	47.661	0.20677	2025-09-06 00:00:00	2025-09-06 00:00:00
218	2	172	2	10	2	2	25.128	26.458	25.403	0.19487	2025-09-06 00:00:00	2025-09-06 00:00:00
219	2	173	2	8	2	1	25.128	26.375	25.371	0.1084	2025-09-06 00:00:00	2025-09-06 00:00:00
220	2	173	2	1	11	1	47.326	48.885	47.495	0.0227	2025-09-06 00:00:00	2025-09-06 00:00:00
221	2	173	2	1	9	2	25.119	26.088	25.141	0.010740000000000001	2025-09-06 00:00:00	2025-09-06 00:00:00
222	2	173	2	1	9	1	45.416	46.44	45.427	0.016579999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
223	2	173	2	5	7	1	45.411	47.22	45.441	0.22481000000000004	2025-09-06 00:00:00	2025-09-06 00:00:00
224	2	173	2	4	7	1	25.112	25.757	25.257	0.20363	2025-09-06 00:00:00	2025-09-06 00:00:00
225	2	173	2	4	3	1	47.349	49.554	47.798	0.23169	2025-09-06 00:00:00	2025-09-06 00:00:00
226	2	173	2	4	3	2	47.339	50.179	47.997	0.14286	2025-09-06 00:00:00	2025-09-06 00:00:00
227	2	173	2	7	5	1	45.412	46.938	45.63	0.19058	2025-09-06 00:00:00	2025-09-06 00:00:00
228	2	173	2	6	10	2	25.121	26.034	25.295	0.17409	2025-09-06 00:00:00	2025-09-06 00:00:00
229	2	173	2	6	10	3	25.117	25.858	25.246	0.19793	2025-09-06 00:00:00	2025-09-06 00:00:00
230	2	173	2	6	10	4	25.125	25.802	25.259	0.16107	2025-09-06 00:00:00	2025-09-06 00:00:00
231	2	173	2	2	7	1	47.331	48.374	47.499	0.19394999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
232	2	173	2	2	3	1	45.399	46.358	45.585	0.12857	2025-09-06 00:00:00	2025-09-06 00:00:00
233	2	173	2	2	3	2	45.42	46.33	45.537	0.19862999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
234	2	173	2	9	2	1	45.423	46.883	45.713	0.20210999999999996	2025-09-06 00:00:00	2025-09-06 00:00:00
235	2	173	1	10	2	2	45.427	47.134	45.772	0.20539	2025-09-06 00:00:00	2025-09-06 00:00:00
236	2	173	1	10	1	1	45.424	47.352	45.82	0.10304999999999999	2025-09-06 00:00:00	2025-09-06 00:00:00
237	2	174	1	1	7	1	45.425	46.968	45.584	0.01307	2025-09-06 00:00:00	2025-09-06 00:00:00
238	2	174	1	1	9	1	45.432	46.733	45.449	0.014029999999999999	2025-09-06 00:00:00	2025-09-06 00:00:00
239	2	174	1	1	9	2	45.421	46.633	45.438	0.07697	2025-09-06 00:00:00	2025-09-06 00:00:00
240	2	175	1	1	7	1	25.15	26.67	25.267	0.00695	2025-09-06 00:00:00	2025-09-06 00:00:00
241	2	174	1	5	7	1	25.132	27.146	25.146	0.010860000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
242	2	174	1	5	3	1	47.352	49.746	47.378	0.22539	2025-09-06 00:00:00	2025-09-06 00:00:00
243	2	174	1	4	7	1	47.365	49.681	47.887	0.20952	2025-09-06 00:00:00	2025-09-06 00:00:00
244	2	174	1	4	3	1	25.132	27.59	25.647	0.18547999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
245	2	174	1	4	3	2	25.128	26.643	25.409	0.12140000000000001	2025-09-06 00:00:00	2025-09-06 00:00:00
246	2	174	1	7	5	1	47.359	48.99	47.557	0.13313	2025-09-06 00:00:00	2025-09-06 00:00:00
247	2	174	1	7	6	1	47.353	49.028	47.576	0.19460999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
248	2	174	1	6	10	1	45.416	46.233	45.575	0.20695000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
249	2	174	1	6	10	2	47.357	49.314	47.762	0.18300999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
250	2	174	1	6	10	4	47.348	48.266	47.516	0.17332	2025-09-06 00:00:00	2025-09-06 00:00:00
251	2	174	1	2	7	1	25.128	26.155	25.306	0.15248	2025-09-06 00:00:00	2025-09-06 00:00:00
252	2	174	1	2	3	1	47.353	48.363	47.507	0.16232	2025-09-06 00:00:00	2025-09-06 00:00:00
253	2	174	1	2	3	2	47.363	48.207	47.5	0.18201	2025-09-06 00:00:00	2025-09-06 00:00:00
254	2	174	1	2	3	3	25.133	26.1	25.309	0.23288000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
255	2	172	1	13	3	1	45.424	47.279	45.856	0.26719000000000004	2025-09-06 00:00:00	2025-09-06 00:00:00
256	2	172	1	13	3	2	47.355	49.507	47.93	0.25194	2025-09-06 00:00:00	2025-09-06 00:00:00
257	2	172	1	13	3	3	47.362	49.557	47.915	0.24353	2025-09-06 00:00:00	2025-09-06 00:00:00
258	2	172	2	13	3	4	45.428	47.321	45.889	0.26269	2025-09-06 00:00:00	2025-09-06 00:00:00
259	2	172	2	13	3	5	47.359	49.704	47.975	0.27727	2025-09-06 00:00:00	2025-09-06 00:00:00
260	2	172	2	13	3	7	45.435	47.498	46.007	0.20531	2025-09-06 00:00:00	2025-09-06 00:00:00
261	2	173	2	11	2	1	25.144	26.688	25.461	0.21889999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
262	2	173	2	13	3	1	47.376	49.482	47.837	0.23292000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
263	2	173	2	13	3	2	47.36	49.395	47.834	0.2349	2025-09-06 00:00:00	2025-09-06 00:00:00
264	2	173	2	13	3	3	25.144	26.783	25.529	0.22324000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
265	2	173	2	13	3	4	47.375	49.337	47.813	0.27826	2025-09-06 00:00:00	2025-09-06 00:00:00
266	2	173	2	13	3	5	45.445	47.763	46.09	0.23596	2025-09-06 00:00:00	2025-09-06 00:00:00
267	2	173	2	13	3	8	47.371	49.757	47.934	0.2416	2025-09-06 00:00:00	2025-09-06 00:00:00
268	2	173	2	13	3	9	25.145	26.9	25.569	0.16027999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
269	2	174	2	8	2	1	45.432	46.555	45.612	0.24045000000000005	2025-09-06 00:00:00	2025-09-06 00:00:00
270	2	174	2	11	2	1	47.373	49.415	47.864	0.25806	2025-09-06 00:00:00	2025-09-06 00:00:00
271	2	174	2	13	3	1	47.377	49.268	47.865	0.22926000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
272	2	174	2	13	3	4	45.443	47.323	45.874	0.22015999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
273	2	174	2	13	3	5	45.448	47.283	45.852	0.23767	2025-09-06 00:00:00	2025-09-06 00:00:00
274	2	174	2	13	3	6	47.378	49.284	47.831	0.22544000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
275	2	174	2	13	3	8	47.384	49.837	47.937	0.18819	2025-09-06 00:00:00	2025-09-06 00:00:00
276	2	174	2	9	2	1	45.43	47.157	45.755	0.21194	2025-09-06 00:00:00	2025-09-06 00:00:00
277	2	174	2	10	2	1	25.139	26.328	25.391	0.20245000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
278	2	175	1	8	2	1	25.141	25.956	25.306	0.01081	2025-09-06 00:00:00	2025-09-06 00:00:00
279	2	175	1	1	9	1	45.429	46.816	45.444	0.00932	2025-09-06 00:00:00	2025-09-06 00:00:00
280	2	175	1	5	7	1	25.129	27.06	25.147	0.025970000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
281	2	175	1	5	3	1	25.135	27.445	25.195	0.2096	2025-09-06 00:00:00	2025-09-06 00:00:00
282	2	175	1	4	3	1	25.127	26.94	25.507	0.19405999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
283	2	175	1	4	3	2	25.133	26.782	25.453	0.14461000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
284	2	175	1	7	5	1	47.357	49.148	47.616	0.14614000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
285	2	175	1	7	6	1	47.365	49.021	47.607	0.22462	2025-09-06 00:00:00	2025-09-06 00:00:00
286	2	175	1	11	2	1	45.453	47.63	45.942	0.02848	2025-09-06 00:00:00	2025-09-06 00:00:00
287	2	175	1	6	10	3	45.436	46.384	45.463	0.18133	2025-09-06 00:00:00	2025-09-06 00:00:00
288	2	175	1	6	10	4	47.361	48.1	47.495	0.17146	2025-09-06 00:00:00	2025-09-06 00:00:00
289	2	175	1	6	10	1	47.357	48.296	47.518	0.20324000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
290	2	175	1	2	3	1	25.131	25.81	25.269	0.12416	2025-09-06 00:00:00	2025-09-06 00:00:00
291	2	175	1	2	3	2	47.359	48.696	47.525	0.20845	2025-09-06 00:00:00	2025-09-06 00:00:00
292	2	175	1	2	3	3	25.144	25.854	25.292	0.15989	2025-09-06 00:00:00	2025-09-06 00:00:00
293	2	175	1	2	3	4	45.42	46.527	45.597	0.19843999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
294	2	175	1	9	2	1	25.144	26.424	25.398	0.21045999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
295	2	175	1	10	2	1	45.441	46.99	45.767	0.19619	2025-09-06 00:00:00	2025-09-06 00:00:00
296	2	176	1	8	2	1	47.38	48.797	47.658	0.10189999999999999	2025-09-06 00:00:00	2025-09-06 00:00:00
297	2	176	1	1	11	1	45.439	46.705	45.568	0.01292	2025-09-06 00:00:00	2025-09-06 00:00:00
298	2	176	1	1	9	1	25.145	26.461	25.162	0.021419999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
299	2	176	1	1	9	2	45.431	47.065	45.466	0.02374	2025-09-06 00:00:00	2025-09-06 00:00:00
300	2	176	1	5	3	1	25.141	27.289	25.192	0.22991999999999999	2025-09-06 00:00:00	2025-09-06 00:00:00
301	2	176	1	4	3	1	47.358	49.437	47.836	0.23747	2025-09-06 00:00:00	2025-09-06 00:00:00
302	2	176	1	4	3	2	45.436	47.63	45.957	0.12889	2025-09-06 00:00:00	2025-09-06 00:00:00
303	2	176	1	7	5	1	47.371	49.008	47.582	0.14137	2025-09-06 00:00:00	2025-09-06 00:00:00
304	2	176	2	7	6	1	47.379	48.624	47.555	0.23006000000000004	2025-09-06 00:00:00	2025-09-06 00:00:00
305	2	176	2	11	2	1	47.388	49.244	47.815	0.26657	2025-09-06 00:00:00	2025-09-06 00:00:00
306	2	176	2	13	3	1	45.47	47.462	46.001	0.21497	2025-09-06 00:00:00	2025-09-06 00:00:00
307	2	176	2	6	10	4	25.146	25.774	25.281	0.16408999999999999	2025-09-06 00:00:00	2025-09-06 00:00:00
308	2	176	2	6	10	1	25.145	25.986	25.283	0.19058	2025-09-06 00:00:00	2025-09-06 00:00:00
309	2	176	2	6	10	2	45.432	46.345	45.606	0.15483	2025-09-06 00:00:00	2025-09-06 00:00:00
310	2	176	2	2	3	1	45.429	46.372	45.575	0.17895	2025-09-06 00:00:00	2025-09-06 00:00:00
311	2	176	2	2	3	2	25.142	26.187	25.329	0.16094	2025-09-06 00:00:00	2025-09-06 00:00:00
312	2	176	2	2	3	4	45.435	46.454	45.599	0.20243000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
313	2	176	2	9	2	1	45.465	46.206	45.615	0.2207	2025-09-06 00:00:00	2025-09-06 00:00:00
314	2	176	2	10	2	1	47.381	48.618	47.654	0.05277000000000001	2025-09-06 00:00:00	2025-09-06 00:00:00
315	2	177	2	1	7	1	45.442	46.977	45.523	0.01587	2025-09-06 00:00:00	2025-09-06 00:00:00
316	2	177	2	1	9	1	47.372	48.632	47.392	0.010360000000000001	2025-09-06 00:00:00	2025-09-06 00:00:00
317	2	177	2	1	9	2	45.447	46.895	45.462	0.00951	2025-09-06 00:00:00	2025-09-06 00:00:00
318	2	177	2	5	3	1	45.448	46.92	45.462	0.18031	2025-09-06 00:00:00	2025-09-06 00:00:00
319	2	177	2	2	3	1	45.446	46.533	45.642	0.14372	2025-09-06 00:00:00	2025-09-06 00:00:00
320	2	177	2	2	3	2	25.151	25.979	25.27	0.18878	2025-09-06 00:00:00	2025-09-06 00:00:00
321	2	177	2	2	3	3	47.372	48.299	47.547	0.17357	2025-09-06 00:00:00	2025-09-06 00:00:00
322	2	177	2	2	3	4	45.453	46.588	45.65	0.03381	2025-09-06 00:00:00	2025-09-06 00:00:00
323	2	178	1	5	7	1	45.453	47.849	45.534	0.012310000000000001	2025-09-06 00:00:00	2025-09-06 00:00:00
324	2	178	1	5	3	1	47.379	49.735	47.408	0.20128000000000004	2025-09-06 00:00:00	2025-09-06 00:00:00
325	2	178	1	4	3	1	47.388	50.041	47.922	0.20727	2025-09-06 00:00:00	2025-09-06 00:00:00
326	2	178	1	4	3	2	45.461	47.772	45.94	0.034910000000000004	2025-09-06 00:00:00	2025-09-06 00:00:00
327	2	179	1	5	3	1	45.464	47.498	45.535	0.17390999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
328	2	179	1	2	3	1	47.393	48.221	47.537	0.20757000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
329	2	179	1	2	3	2	45.474	46.24	45.633	0.255	2025-09-06 00:00:00	2025-09-06 00:00:00
330	2	175	2	13	3	1	47.387	49.438	47.91	0.23541	2025-09-06 00:00:00	2025-09-06 00:00:00
331	2	175	1	13	3	9	45.467	48.003	46.064	0.24006000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
332	2	176	1	13	3	2	47.413	49.35	47.878	0.25275	2025-09-06 00:00:00	2025-09-06 00:00:00
333	2	176	2	13	3	7	45.495	47.766	46.069	0.1942	2025-09-06 00:00:00	2025-09-06 00:00:00
334	2	177	1	8	2	1	47.421	49.007	47.729	0.2036	2025-09-06 00:00:00	2025-09-06 00:00:00
335	2	177	2	4	7	1	53.611	55.443	53.984	0.12908	2025-09-06 00:00:00	2025-09-06 00:00:00
336	2	177	1	7	5	1	45.487	47.354	45.728	0.23518999999999995	2025-09-06 00:00:00	2025-09-06 00:00:00
337	2	177	2	4	3	1	45.475	47.248	45.892	0.21969000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
338	2	177	1	4	3	2	47.409	49.958	47.969	0.26311	2025-09-06 00:00:00	2025-09-06 00:00:00
339	2	177	2	13	3	1	45.46	47.634	46.032	0.23787	2025-09-06 00:00:00	2025-09-06 00:00:00
340	2	177	1	13	3	3	45.475	48.031	46.083	0.24788	2025-09-06 00:00:00	2025-09-06 00:00:00
341	2	177	1	13	3	5	45.486	46.668	45.779	0.26669	2025-09-06 00:00:00	2025-09-06 00:00:00
342	2	177	1	13	3	9	47.406	50.012	48.101	0.19608	2025-09-06 00:00:00	2025-09-06 00:00:00
343	2	177	2	6	10	1	53.609	54.425	53.769	0.23162999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
344	2	177	2	6	10	4	45.491	46.648	45.759	0.27879000000000004	2025-09-06 00:00:00	2025-09-06 00:00:00
345	2	177	1	9	2	1	45.473	47.783	46.117	0.21789999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
346	2	177	2	10	2	1	47.401	48.686	47.681	0.21948	2025-09-06 00:00:00	2025-09-06 00:00:00
347	2	178	1	8	2	1	45.475	46.81	45.768	0.13714	2025-09-06 00:00:00	2025-09-06 00:00:00
348	2	178	1	7	5	1	45.489	47.939	45.825	0.17044	2025-09-06 00:00:00	2025-09-06 00:00:00
349	2	178	2	7	6	1	47.429	49.817	47.836	0.23668	2025-09-06 00:00:00	2025-09-06 00:00:00
350	2	178	1	11	2	1	47.419	49.371	47.881	0.23471	2025-09-06 00:00:00	2025-09-06 00:00:00
351	2	178	2	13	3	1	45.494	47.816	46.039	0.25605	2025-09-06 00:00:00	2025-09-06 00:00:00
352	2	178	1	13	3	3	47.42	49.818	48.034	0.23588999999999996	2025-09-06 00:00:00	2025-09-06 00:00:00
353	2	178	1	13	3	5	45.479	47.641	45.989	0.2039	2025-09-06 00:00:00	2025-09-06 00:00:00
354	2	178	2	6	10	4	53.617	54.848	53.868	0.20750999999999997	2025-09-06 00:00:00	2025-09-06 00:00:00
355	2	178	1	9	2	1	45.46	46.819	45.742	0.20408	2025-09-06 00:00:00	2025-09-06 00:00:00
356	2	179	1	8	2	1	47.416	48.641	47.666	0.12355000000000001	2025-09-06 00:00:00	2025-09-06 00:00:00
357	2	179	1	1	7	1	47.392	48.768	47.562	0.01448	2025-09-06 00:00:00	2025-09-06 00:00:00
358	2	179	2	1	9	1	47.38	48.554	47.397	0.0317	2025-09-06 00:00:00	2025-09-06 00:00:00
359	2	179	2	5	7	1	45.474	46.862	45.518	0.16508	2025-09-06 00:00:00	2025-09-06 00:00:00
360	2	179	1	7	5	1	47.401	49.709	47.782	0.299	2025-09-06 00:00:00	2025-09-06 00:00:00
361	2	179	2	4	3	1	47.393	50.393	48.29	0.27671	2025-09-06 00:00:00	2025-09-06 00:00:00
362	2	179	1	4	3	2	45.475	47.618	46.068	0.22784	2025-09-06 00:00:00	2025-09-06 00:00:00
363	2	179	1	11	2	1	47.409	49.327	47.846	0.28098	2025-09-06 00:00:00	2025-09-06 00:00:00
364	2	179	2	13	3	1	47.411	50.066	48.157	0.26347000000000004	2025-09-06 00:00:00	2025-09-06 00:00:00
365	2	179	1	13	3	3	45.485	47.007	45.886	0.27563	2025-09-06 00:00:00	2025-09-06 00:00:00
366	2	179	1	13	3	5	53.614	55.74	54.2	0.27236	2025-09-06 00:00:00	2025-09-06 00:00:00
367	2	179	2	13	3	7	47.426	49.662	48.035	0.19283999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
368	2	179	2	6	10	1	47.414	48.42	47.608	0.21303999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
369	2	179	2	6	10	4	45.482	46.402	45.678	0.24097000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
370	2	179	2	10	2	1	47.399	49.586	47.926	0.023700000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
371	2	180	1	1	9	1	47.393	48.743	47.425	0.18198	2025-09-06 00:00:00	2025-09-06 00:00:00
372	2	180	1	7	5	1	47.435	49.677	47.843	0.21592	2025-09-06 00:00:00	2025-09-06 00:00:00
373	2	180	2	7	6	1	45.505	47.075	45.844	0.24704	2025-09-06 00:00:00	2025-09-06 00:00:00
374	2	180	2	4	3	1	47.392	49.845	47.998	0.23695	2025-09-06 00:00:00	2025-09-06 00:00:00
375	2	180	1	4	3	2	47.41	50.073	48.041	0.27931	2025-09-06 00:00:00	2025-09-06 00:00:00
376	2	180	1	11	2	1	53.61	54.949	53.984	0.2883	2025-09-06 00:00:00	2025-09-06 00:00:00
377	2	180	2	13	3	1	53.614	55.435	54.139	0.30145	2025-09-06 00:00:00	2025-09-06 00:00:00
378	2	180	1	13	3	3	47.419	50.169	48.248	0.23773000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
379	2	180	1	13	3	5	45.493	47.979	46.084	0.27799	2025-09-06 00:00:00	2025-09-06 00:00:00
380	2	180	1	13	3	8	45.488	48.15	46.228	0.21311	2025-09-06 00:00:00	2025-09-06 00:00:00
381	2	180	2	6	10	1	53.627	54.359	53.783	0.19521999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
382	2	180	2	2	3	1	45.467	46.681	45.704	0.19799000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
383	2	180	2	2	3	2	47.396	48.593	47.633	0.18556999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
384	2	180	2	2	3	3	45.465	46.532	45.663	0.2234	2025-09-06 00:00:00	2025-09-06 00:00:00
385	2	180	1	9	2	1	47.428	49.402	47.869	0.23619	2025-09-06 00:00:00	2025-09-06 00:00:00
386	2	180	2	10	2	1	45.501	47.203	45.903	0.2528	2025-09-06 00:00:00	2025-09-06 00:00:00
387	2	180	2	10	1	1	53.623	55.32	54.052	0.21368999999999996	2025-09-06 00:00:00	2025-09-06 00:00:00
388	2	181	1	8	2	1	45.479	46.925	45.788	0.10188	2025-09-06 00:00:00	2025-09-06 00:00:00
389	2	181	1	1	7	1	47.413	48.797	47.554	0.01651	2025-09-06 00:00:00	2025-09-06 00:00:00
390	2	181	1	1	9	1	47.425	48.879	47.449	0.01259	2025-09-06 00:00:00	2025-09-06 00:00:00
391	2	181	1	1	9	2	45.472	47.219	45.494	0.00903	2025-09-06 00:00:00	2025-09-06 00:00:00
392	2	181	2	5	7	1	53.625	56.614	53.652	0.18386	2025-09-06 00:00:00	2025-09-06 00:00:00
393	2	181	1	7	5	1	53.622	55.444	53.957	0.21512000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
394	2	181	2	4	7	1	45.517	47.818	46.012	0.16957999999999998	2025-09-06 00:00:00	2025-09-06 00:00:00
395	2	181	2	7	6	1	45.489	47.376	45.809	0.24925	2025-09-06 00:00:00	2025-09-06 00:00:00
396	2	181	2	4	3	1	45.481	48.133	46.142	0.25029	2025-09-06 00:00:00	2025-09-06 00:00:00
397	2	181	1	4	3	2	53.611	56.2	54.259	0.2826	2025-09-06 00:00:00	2025-09-06 00:00:00
398	2	181	1	11	2	1	45.493	47.648	46.102	0.28723	2025-09-06 00:00:00	2025-09-06 00:00:00
399	2	181	2	13	3	1	45.5	47.864	46.179	0.29347999999999996	2025-09-06 00:00:00	2025-09-06 00:00:00
400	2	181	1	13	3	2	47.419	50.012	48.18	0.3061	2025-09-06 00:00:00	2025-09-06 00:00:00
401	2	181	1	13	3	5	53.624	56.035	54.362	0.27114	2025-09-06 00:00:00	2025-09-06 00:00:00
402	2	181	2	13	3	7	47.419	49.595	48.009	0.22107	2025-09-06 00:00:00	2025-09-06 00:00:00
403	2	181	2	6	10	4	53.619	54.587	53.833	0.16608	2025-09-06 00:00:00	2025-09-06 00:00:00
404	2	181	2	2	7	1	53.63	54.774	53.82	0.31276	2025-09-06 00:00:00	2025-09-06 00:00:00
405	2	181	2	2	3	1	47.409	48.835	47.855	0.25743	2025-09-06 00:00:00	2025-09-06 00:00:00
406	2	181	2	2	3	2	45.481	46.557	45.758	0.19457000000000002	2025-09-06 00:00:00	2025-09-06 00:00:00
407	2	181	2	2	3	3	47.4	48.762	47.665	0.22591	2025-09-06 00:00:00	2025-09-06 00:00:00
408	2	181	1	9	2	1	53.61	55.146	53.957	0.26013000000000003	2025-09-06 00:00:00	2025-09-06 00:00:00
409	2	181	2	10	2	1	47.41	49.409	47.93	0.26311	2025-09-06 00:00:00	2025-09-06 00:00:00
410	2	181	2	10	1	1	47.416	49.438	47.948	0.21498999999999996	2025-09-06 00:00:00	2025-09-06 00:00:00
411	2	181	2	6	10	1	45.511	46.418	45.706	0.19651	2025-09-06 00:00:00	2025-09-06 00:00:00
412	2	182	1	8	2	1	47.426	49.258	47.786	0.07266	2025-09-06 00:00:00	2025-09-06 00:00:00
413	2	182	1	1	7	1	53.613	54.948	53.71	0.10592	2025-09-06 00:00:00	2025-09-06 00:00:00
414	2	182	2	1	13	1	53.608	54.656	53.719	0.0179	2025-09-06 00:00:00	2025-09-06 00:00:00
415	2	182	2	1	9	1	47.421	48.929	47.448	0.005620000000000001	2025-09-06 00:00:00	2025-09-06 00:00:00
416	2	182	2	5	3	1	45.489	48.334	45.505	0.11685000000000001	2025-09-06 00:00:00	2025-09-06 00:00:00
417	2	182	1	7	5	1	47.424	49.05	47.614	0.14228	2025-09-06 00:00:00	2025-09-06 00:00:00
418	2	182	2	7	6	1	53.618	55.839	53.934	0.24503	2025-09-06 00:00:00	2025-09-06 00:00:00
419	2	182	2	4	3	1	47.416	49.983	48.045	0.15346	2025-09-06 00:00:00	2025-09-06 00:00:00
420	2	182	1	4	3	2	53.615	56.417	54.045	0.22336999999999999	2025-09-06 00:00:00	2025-09-06 00:00:00
421	2	182	1	11	2	1	45.507	47.535	45.96	0.23939	2025-09-07 00:00:00	2025-09-07 00:00:00
422	2	182	2	13	3	1	45.501	47.928	46.082	0.24216000000000004	2025-09-08 00:00:00	2025-09-08 00:00:00
423	2	182	1	13	3	3	53.624	56.015	54.203	0.25905	2025-09-09 00:00:00	2025-09-09 00:00:00
424	2	182	1	13	3	5	53.629	55.065	54.001	0.23614000000000002	2025-09-10 00:00:00	2025-09-10 00:00:00
425	2	182	2	13	3	7	53.63	55.506	54.073	0.23318000000000003	2025-09-11 00:00:00	2025-09-11 00:00:00
426	2	182	2	6	10	1	45.483	46.152	45.639	0.18710000000000002	2025-09-12 00:00:00	2025-09-12 00:00:00
427	2	182	2	6	10	4	53.615	54.39	53.76	0.12804000000000001	2025-09-13 00:00:00	2025-09-13 00:00:00
428	2	182	2	2	7	1	47.425	48.784	47.599	0.18614	2025-09-14 00:00:00	2025-09-14 00:00:00
429	2	182	2	2	3	2	45.475	46.947	45.749	0.13383	2025-09-15 00:00:00	2025-09-15 00:00:00
430	2	182	2	2	3	3	53.61	54.559	53.737	0.20158999999999996	2025-09-16 00:00:00	2025-09-16 00:00:00
431	2	182	1	9	2	1	53.618	55.255	53.948	0.22106	2025-09-17 00:00:00	2025-09-17 00:00:00
432	2	182	2	10	2	1	47.417	49.145	47.799	0.22405	2025-09-18 00:00:00	2025-09-18 00:00:00
433	2	182	2	10	1	1	45.5	47.321	45.908	0.12689999999999999	2025-09-19 00:00:00	2025-09-19 00:00:00
434	2	183	1	8	2	1	45.5	47.478	45.751	0.09236000000000001	2025-09-20 00:00:00	2025-09-20 00:00:00
435	2	183	2	1	3	1	53.616	54.991	53.743	0.1462	2025-09-21 00:00:00	2025-09-21 00:00:00
436	2	183	2	1	3	2	47.423	48.62	47.598	0.0206	2025-09-22 00:00:00	2025-09-22 00:00:00
437	2	183	2	1	9	1	45.488	46.944	45.518	0.00971	2025-09-23 00:00:00	2025-09-23 00:00:00
438	2	183	2	5	7	1	53.616	56.81	53.647	0.01142	2025-09-24 00:00:00	2025-09-24 00:00:00
439	2	183	2	5	3	1	45.484	48.373	45.517	0.15529	2025-09-25 00:00:00	2025-09-25 00:00:00
440	2	183	2	4	7	1	47.412	50.812	47.94	0.15574	2025-09-26 00:00:00	2025-09-26 00:00:00
441	2	183	1	7	5	1	53.63	55.781	53.965	0.19399999999999998	2025-09-27 00:00:00	2025-09-27 00:00:00
442	2	183	2	7	6	1	53.627	55.194	53.931	0.17296	2025-09-28 00:00:00	2025-09-28 00:00:00
443	2	183	2	4	3	1	47.422	49.833	47.839	0.23883	2025-09-29 00:00:00	2025-09-29 00:00:00
444	2	183	1	4	3	2	53.626	55.975	54.187	0.23413	2025-09-30 00:00:00	2025-09-30 00:00:00
445	2	183	1	11	2	1	47.416	49.59	47.925	0.28147	2025-10-01 00:00:00	2025-10-01 00:00:00
446	2	183	2	13	3	1	47.403	50.16	48.179	0.26029	2025-10-02 00:00:00	2025-10-02 00:00:00
447	2	183	1	13	3	3	53.633	55.673	54.164	0.23936000000000002	2025-10-03 00:00:00	2025-10-03 00:00:00
448	2	183	1	13	3	5	45.513	48.12	46.137	0.24886	2025-10-04 00:00:00	2025-10-04 00:00:00
449	2	183	2	13	3	7	53.628	55.83	54.176	0.26979	2025-10-05 00:00:00	2025-10-05 00:00:00
450	2	183	1	13	3	9	45.503	48.068	46.195	0.21544	2025-10-06 00:00:00	2025-10-06 00:00:00
451	2	183	2	6	10	1	45.493	46.361	45.68	0.20416	2025-10-07 00:00:00	2025-10-07 00:00:00
452	2	183	2	6	10	3	47.411	48.758	47.686	0.22402999999999998	2025-10-08 00:00:00	2025-10-08 00:00:00
453	2	183	2	6	10	4	47.415	49.071	47.786	0.16797	2025-10-09 00:00:00	2025-10-09 00:00:00
454	2	183	2	2	3	1	53.614	54.382	53.743	0.19786	2025-10-10 00:00:00	2025-10-10 00:00:00
455	2	183	2	2	3	2	45.493	46.615	45.715	0.19742	2025-10-11 00:00:00	2025-10-11 00:00:00
456	2	183	2	2	3	3	53.613	54.312	53.751	0.20377	2025-10-12 00:00:00	2025-10-12 00:00:00
457	2	183	2	2	3	4	47.415	48.21	47.577	0.23992999999999995	2025-10-13 00:00:00	2025-10-13 00:00:00
458	2	183	1	9	2	1	45.498	47.261	45.921	0.20794000000000004	2025-10-14 00:00:00	2025-10-14 00:00:00
459	2	184	1	8	2	1	45.504	47.192	45.855	0.04386	2025-10-15 00:00:00	2025-10-15 00:00:00
460	2	184	1	1	7	1	47.42	48.674	47.475	0.11264999999999999	2025-10-16 00:00:00	2025-10-16 00:00:00
461	2	184	2	1	3	1	53.616	54.841	53.754	0.01541	2025-10-17 00:00:00	2025-10-17 00:00:00
462	2	184	2	1	3	2	45.499	47.121	45.524	0.02048	2025-10-18 00:00:00	2025-10-18 00:00:00
463	2	184	2	1	3	3	47.424	49.035	47.457	0.00872	2025-10-19 00:00:00	2025-10-19 00:00:00
464	2	184	2	5	7	1	45.508	48.376	45.533	0.14363	2025-10-20 00:00:00	2025-10-20 00:00:00
465	2	184	1	7	5	1	53.636	55.857	53.955	0.20977	2025-10-21 00:00:00	2025-10-21 00:00:00
466	2	184	2	4	7	1	53.623	55.792	54.078	0.14952	2025-10-22 00:00:00	2025-10-22 00:00:00
467	2	184	2	7	6	1	53.629	55.495	53.908	0.24505	2025-10-23 00:00:00	2025-10-23 00:00:00
468	2	184	2	4	3	1	53.626	56.756	54.393	0.21966999999999998	2025-10-24 00:00:00	2025-10-24 00:00:00
469	2	184	1	4	3	2	47.435	50.567	48.123	0.22697	2025-10-25 00:00:00	2025-10-25 00:00:00
470	2	184	1	11	2	1	53.631	54.847	53.907	0.19519999999999998	2025-10-26 00:00:00	2025-10-26 00:00:00
471	2	184	2	6	10	1	47.417	48.626	47.653	0.20355	2025-10-27 00:00:00	2025-10-27 00:00:00
472	2	184	2	6	10	4	45.506	46.916	45.793	0.17271999999999998	2025-10-28 00:00:00	2025-10-28 00:00:00
473	2	184	2	2	3	1	45.492	46.621	45.687	0.15408	2025-10-29 00:00:00	2025-10-29 00:00:00
474	2	184	2	2	3	2	47.418	48.424	47.573	0.19226	2025-10-30 00:00:00	2025-10-30 00:00:00
475	2	184	2	2	3	3	53.616	54.417	53.77	0.21292000000000003	2025-10-31 00:00:00	2025-10-31 00:00:00
476	2	184	1	9	2	1	47.407	49.342	47.819	0.22272	2025-11-01 00:00:00	2025-11-01 00:00:00
477	2	184	2	10	2	1	45.505	47.274	45.899	0.1875	2025-11-02 00:00:00	2025-11-02 00:00:00
478	2	185	1	8	2	1	45.501	47.421	45.861	0.04841	2025-11-03 00:00:00	2025-11-03 00:00:00
479	2	185	1	1	7	1	47.425	48.871	47.495	0.10354	2025-11-04 00:00:00	2025-11-04 00:00:00
480	2	185	2	1	7	1	45.513	46.585	45.624	0.014539999999999999	2025-11-05 00:00:00	2025-11-05 00:00:00
481	2	185	1	1	9	1	53.626	54.589	53.64	0.21559	2025-11-06 00:00:00	2025-11-06 00:00:00
482	2	185	1	12	2	1	45.515	47.709	45.988	0.00898	2025-11-07 00:00:00	2025-11-07 00:00:00
483	2	185	2	5	3	1	47.417	50.534	47.445	0.12554	2025-11-08 00:00:00	2025-11-08 00:00:00
484	2	185	1	7	5	1	53.63	55.47	53.861	0.26791	2025-11-09 00:00:00	2025-11-09 00:00:00
485	2	185	2	4	7	1	45.499	48.388	46.273	0.12605	2025-11-10 00:00:00	2025-11-10 00:00:00
486	2	185	2	7	6	1	45.513	48.123	45.842	0.22746	2025-11-11 00:00:00	2025-11-11 00:00:00
487	2	185	2	4	3	1	47.42	50.071	48.023	0.24561000000000002	2025-11-12 00:00:00	2025-11-12 00:00:00
488	2	185	1	4	3	2	45.505	47.61	46.022	0.21308999999999997	2025-11-13 00:00:00	2025-11-13 00:00:00
489	2	185	1	11	2	1	47.422	49.454	47.855	0.18774999999999997	2025-11-14 00:00:00	2025-11-14 00:00:00
490	2	185	2	6	10	1	47.412	48.898	47.691	0.20038	2025-11-15 00:00:00	2025-11-15 00:00:00
491	2	185	2	6	10	4	47.414	48.457	47.623	0.14622	2025-11-16 00:00:00	2025-11-16 00:00:00
492	2	185	2	2	7	1	45.517	46.748	45.697	0.17217	2025-11-17 00:00:00	2025-11-17 00:00:00
493	2	185	2	2	3	1	47.434	48.555	47.627	0.20552	2025-11-18 00:00:00	2025-11-18 00:00:00
494	2	185	2	2	3	2	53.622	54.6	53.823	0.21675000000000003	2025-11-19 00:00:00	2025-11-19 00:00:00
495	2	185	1	9	2	1	47.408	49.295	47.817	0.20800000000000002	2025-11-20 00:00:00	2025-11-20 00:00:00
496	2	185	2	10	2	1	47.411	49.411	47.827	0.20433	2025-11-21 00:00:00	2025-11-21 00:00:00
497	2	186	1	8	2	1	45.502	46.98	45.804	0.11696000000000001	2025-11-22 00:00:00	2025-11-22 00:00:00
498	2	186	1	1	7	1	45.498	47.302	45.709	0.00996	2025-11-23 00:00:00	2025-11-23 00:00:00
499	2	186	1	1	9	1	53.63	54.433	53.638	0.01272	2025-11-24 00:00:00	2025-11-24 00:00:00
500	2	186	2	5	7	1	53.624	56.532	53.661	0.15153	2025-11-25 00:00:00	2025-11-25 00:00:00
501	2	186	1	7	5	1	47.42	49.941	47.802	0.21194999999999997	2025-11-26 00:00:00	2025-11-26 00:00:00
502	2	186	2	4	7	1	45.507	48.536	46.149	0.23940999999999996	2025-11-27 00:00:00	2025-11-27 00:00:00
503	2	186	2	4	3	1	45.492	48.019	46.097	0.21905000000000002	2025-11-28 00:00:00	2025-11-28 00:00:00
504	2	186	2	6	10	4	53.629	54.469	53.813	0.16189	2025-11-29 00:00:00	2025-11-29 00:00:00
505	2	186	2	2	7	1	47.403	48.694	47.612	0.16873000000000002	2025-11-30 00:00:00	2025-11-30 00:00:00
506	2	186	2	2	3	1	45.522	46.731	45.726	0.18012	2025-12-01 00:00:00	2025-12-01 00:00:00
507	2	186	2	2	3	2	47.432	48.72	47.664	0.09856999999999999	2025-12-02 00:00:00	2025-12-02 00:00:00
508	2	187	1	1	11	1	53.627	55.23	53.785	0.0057799999999999995	2025-12-03 00:00:00	2025-12-03 00:00:00
509	2	187	1	1	9	1	47.432	48.815	47.44	0.0174	2025-12-04 00:00:00	2025-12-04 00:00:00
510	2	187	1	1	9	2	53.625	55.119	53.651	0.02437	2025-12-05 00:00:00	2025-12-05 00:00:00
511	2	187	1	1	9	3	47.41	48.928	47.447	0.251	2025-12-06 00:00:00	2025-12-06 00:00:00
512	2	187	2	4	3	1	45.514	48.02	46.143	0.24853000000000003	2025-12-07 00:00:00	2025-12-07 00:00:00
513	2	187	1	4	3	2	47.409	50.302	48.128	0.16168	2025-12-08 00:00:00	2025-12-08 00:00:00
514	2	187	2	2	7	1	45.506	46.91	45.733	0.17794000000000001	2025-12-09 00:00:00	2025-12-09 00:00:00
515	2	187	2	2	3	1	45.509	46.633	45.709	0.24749	2025-12-10 00:00:00	2025-12-10 00:00:00
516	2	184	2	13	3	1	47.424	50.216	48.115	0.23562000000000002	2025-12-11 00:00:00	2025-12-11 00:00:00
517	2	184	2	13	3	4	53.625	56.006	54.186	0.25942	2025-12-12 00:00:00	2025-12-12 00:00:00
518	2	184	2	13	3	6	47.416	50.176	48.132	0.26306999999999997	2025-12-13 00:00:00	2025-12-13 00:00:00
519	2	184	2	13	3	7	45.51	47.958	46.154	0.24058000000000002	2025-12-14 00:00:00	2025-12-14 00:00:00
520	2	185	2	13	3	1	45.518	47.721	46.048	0.22684000000000004	2025-12-15 00:00:00	2025-12-15 00:00:00
521	2	185	2	13	3	10	53.626	55.429	54.035	0.26685	2025-12-16 00:00:00	2025-12-16 00:00:00
522	2	185	1	13	3	3	45.505	48.383	46.273	0.23077000000000003	2025-12-17 00:00:00	2025-12-17 00:00:00
523	2	185	1	13	3	5	47.427	50.131	48.051	0.23966	2025-12-18 00:00:00	2025-12-18 00:00:00
524	2	185	2	13	3	7	45.513	48.73	46.284	0.23274999999999996	2025-12-19 00:00:00	2025-12-19 00:00:00
525	2	186	1	11	2	1	45.51	47.452	45.962	0.24236000000000002	2025-12-20 00:00:00	2025-12-20 00:00:00
526	2	186	2	13	3	1	45.522	47.519	46.006	0.27686	2025-12-21 00:00:00	2025-12-21 00:00:00
527	2	186	1	13	3	2	34.177	35.564	34.561	0.2526	2025-12-22 00:00:00	2025-12-22 00:00:00
528	2	186	1	13	3	3	33.983	35.713	34.42	0.24552	2025-12-23 00:00:00	2025-12-23 00:00:00
529	2	186	2	13	3	4	45.513	47.521	46.006	0.25675000000000003	2025-12-24 00:00:00	2025-12-24 00:00:00
530	2	186	1	13	3	5	34.178	36.363	34.739	0.24301999999999999	2025-12-25 00:00:00	2025-12-25 00:00:00
531	2	186	2	13	3	6	33.986	36.134	34.508	0.24355000000000002	2025-12-26 00:00:00	2025-12-26 00:00:00
532	2	186	2	13	3	7	47.432	49.641	47.97	0.24959	2025-12-27 00:00:00	2025-12-27 00:00:00
533	2	186	1	13	3	8	45.524	47.948	46.129	0.28351	2025-12-28 00:00:00	2025-12-28 00:00:00
534	2	186	1	13	3	9	53.632	55.833	54.256	0.18204	2025-12-29 00:00:00	2025-12-29 00:00:00
535	2	186	2	6	10	1	53.627	54.462	53.779	0.21050000000000002	2025-12-30 00:00:00	2025-12-30 00:00:00
536	2	186	1	9	2	1	47.419	49.362	47.828	0.23079999999999998	2025-12-31 00:00:00	2025-12-31 00:00:00
537	2	186	2	10	2	1	45.515	48.028	46.095	0.21024999999999996	2026-01-01 00:00:00	2026-01-01 00:00:00
538	2	186	2	10	1	1	47.425	49.123	47.782	0.22230000000000003	2026-01-02 00:00:00	2026-01-02 00:00:00
539	2	187	1	8	2	1	45.514	46.886	45.819	0.1474	2026-01-03 00:00:00	2026-01-03 00:00:00
540	2	187	1	7	5	1	34.153	36.324	34.473	0.18639	2026-01-04 00:00:00	2026-01-04 00:00:00
541	2	187	2	7	6	1	53.631	55.262	53.935	0.23132	2026-01-05 00:00:00	2026-01-05 00:00:00
542	2	187	1	11	2	1	47.419	49.36	47.868	0.25928	2026-01-06 00:00:00	2026-01-06 00:00:00
543	2	187	2	13	3	1	45.514	47.535	46.038	0.25117	2026-01-07 00:00:00	2026-01-07 00:00:00
544	2	187	2	13	3	10	45.525	47.229	45.953	0.28137	2026-01-08 00:00:00	2026-01-08 00:00:00
545	2	187	1	13	3	2	34.182	35.728	34.617	0.26517	2026-01-09 00:00:00	2026-01-09 00:00:00
546	2	187	1	13	3	3	47.419	49.874	48.07	0.25082	2026-01-10 00:00:00	2026-01-10 00:00:00
547	2	187	2	13	3	4	53.633	55.455	54.09	0.25585	2026-01-11 00:00:00	2026-01-11 00:00:00
548	2	187	1	13	3	5	34.183	36.02	34.653	0.25428999999999996	2026-01-12 00:00:00	2026-01-12 00:00:00
549	2	187	2	13	3	7	34.001	35.924	34.49	0.21966999999999998	2026-01-13 00:00:00	2026-01-13 00:00:00
550	2	187	1	13	3	8	34.004	36.18	34.482	0.26726	2026-01-14 00:00:00	2026-01-14 00:00:00
551	2	187	1	13	3	9	34.193	35.772	34.615	0.21422	2026-01-15 00:00:00	2026-01-15 00:00:00
552	2	187	2	6	10	4	33.97	34.997	34.19	0.22021999999999997	2026-01-16 00:00:00	2026-01-16 00:00:00
553	2	187	1	9	2	1	47.426	49.365	47.853	0.2225	2026-01-17 00:00:00	2026-01-17 00:00:00
554	2	187	2	10	2	1	45.517	47.117	45.873	0.17421	2026-01-18 00:00:00	2026-01-18 00:00:00
555	2	188	1	8	2	1	47.428	48.886	47.682	0.057229999999999996	2026-01-19 00:00:00	2026-01-19 00:00:00
556	2	188	1	1	11	1	53.629	55.184	53.718	0.10278000000000001	2026-01-20 00:00:00	2026-01-20 00:00:00
557	2	188	1	1	7	1	53.623	55.316	53.797	0.008239999999999999	2026-01-21 00:00:00	2026-01-21 00:00:00
558	2	188	1	1	9	1	45.517	46.974	45.529	0.01697	2026-01-22 00:00:00	2026-01-22 00:00:00
559	2	188	1	1	9	2	47.425	49.488	47.46	0.01016	2026-01-23 00:00:00	2026-01-23 00:00:00
560	2	188	2	5	3	1	45.511	48.169	45.538	0.13257	2026-01-24 00:00:00	2026-01-24 00:00:00
561	2	188	1	7	5	1	33.976	35.907	34.232	0.26681	2026-01-25 00:00:00	2026-01-25 00:00:00
562	2	188	2	4	7	1	53.623	55.051	54.004	0.11433000000000001	2026-01-26 00:00:00	2026-01-26 00:00:00
563	2	188	2	7	6	1	34.173	36.517	34.441	0.25914000000000004	2026-01-27 00:00:00	2026-01-27 00:00:00
564	2	188	2	4	3	1	53.626	56.636	54.406	0.25521	2026-01-28 00:00:00	2026-01-28 00:00:00
565	2	188	1	4	3	2	34.153	36.982	34.875	0.21746000000000001	2026-01-29 00:00:00	2026-01-29 00:00:00
566	2	188	1	11	2	1	45.509	47.514	45.945	0.30097	2026-01-30 00:00:00	2026-01-30 00:00:00
567	2	188	2	13	3	1	34.194	35.121	34.473	0.23277000000000003	2026-01-31 00:00:00	2026-01-31 00:00:00
568	2	188	2	13	3	10	47.435	49.974	48.026	0.22762000000000004	2026-02-01 00:00:00	2026-02-01 00:00:00
569	2	188	1	13	3	2	53.636	55.468	54.053	0.23873999999999995	2026-02-02 00:00:00	2026-02-02 00:00:00
570	2	188	1	13	3	3	47.427	49.869	48.01	0.24645999999999998	2026-02-03 00:00:00	2026-02-03 00:00:00
571	2	188	2	13	3	4	34.009	35.989	34.497	0.27221	2026-02-04 00:00:00	2026-02-04 00:00:00
572	2	188	1	13	3	5	34.194	36.31	34.77	0.24129	2026-02-05 00:00:00	2026-02-05 00:00:00
573	2	188	2	13	3	6	45.525	47.046	45.892	0.24188	2026-02-06 00:00:00	2026-02-06 00:00:00
574	2	188	2	13	3	7	47.434	49.311	47.888	0.25329999999999997	2026-02-07 00:00:00	2026-02-07 00:00:00
575	2	188	1	13	3	8	45.523	47.647	46.061	0.24711	2026-02-08 00:00:00	2026-02-08 00:00:00
576	2	188	1	13	3	9	34.193	35.925	34.621	0.17565999999999998	2026-02-09 00:00:00	2026-02-09 00:00:00
577	2	188	2	6	10	1	33.972	34.843	34.125	0.11849999999999998	2026-02-10 00:00:00	2026-02-10 00:00:00
578	2	188	2	6	10	4	47.528	48.701	47.667	0.15496000000000001	2026-02-11 00:00:00	2026-02-11 00:00:00
579	2	188	2	2	7	1	47.423	48.875	47.648	0.19252	2026-02-12 00:00:00	2026-02-12 00:00:00
580	2	188	2	2	3	1	53.629	54.699	53.835	0.19728	2026-02-13 00:00:00	2026-02-13 00:00:00
581	2	188	2	2	3	2	45.512	46.911	45.788	0.18111	2026-02-14 00:00:00	2026-02-14 00:00:00
582	2	188	2	2	3	3	47.423	48.577	47.632	0.21306999999999998	2026-02-15 00:00:00	2026-02-15 00:00:00
583	2	188	1	9	2	1	53.629	54.685	53.854	0.24753000000000003	2026-02-16 00:00:00	2026-02-16 00:00:00
584	2	188	2	10	2	1	34.176	35.796	34.577	0.20951	2026-02-17 00:00:00	2026-02-17 00:00:00
585	2	188	2	10	1	1	45.515	47.071	45.841	0.19638000000000003	2026-02-18 00:00:00	2026-02-18 00:00:00
586	2	189	1	8	2	1	33.996	35.432	34.278	0.11954000000000001	2026-02-19 00:00:00	2026-02-19 00:00:00
587	2	189	1	1	11	1	45.515	46.728	45.66	0.01646	2026-02-20 00:00:00	2026-02-20 00:00:00
588	2	189	1	1	9	1	47.426	48.155	47.438	0.01693	2026-02-21 00:00:00	2026-02-21 00:00:00
589	2	189	1	1	9	2	34.17	35.115	34.186	0.01659	2026-02-22 00:00:00	2026-02-22 00:00:00
590	2	189	2	5	7	1	53.627	56.822	53.68	0.00856	2026-02-23 00:00:00	2026-02-23 00:00:00
591	2	189	2	5	3	1	33.977	36.079	33.995	0.15439999999999998	2026-02-24 00:00:00	2026-02-24 00:00:00
592	2	189	1	7	5	1	34.179	36.135	34.481	0.30015000000000003	2026-02-25 00:00:00	2026-02-25 00:00:00
593	2	189	2	4	7	1	53.629	55.578	54.214	0.09101000000000001	2026-02-26 00:00:00	2026-02-26 00:00:00
594	2	189	2	7	6	1	47.429	49.187	47.589	0.24966000000000002	2026-02-27 00:00:00	2026-02-27 00:00:00
595	2	189	2	4	3	1	34.171	37.091	34.9	0.25582	2026-02-28 00:00:00	2026-02-28 00:00:00
596	2	189	1	4	3	2	53.634	55.78	54.183	0.22125	2026-03-01 00:00:00	2026-03-01 00:00:00
597	2	189	1	11	2	1	34.013	35.5	34.342	0.22995000000000004	2026-03-02 00:00:00	2026-03-02 00:00:00
598	2	189	2	13	3	1	45.528	47.511	45.984	0.27385000000000004	2026-03-03 00:00:00	2026-03-03 00:00:00
599	2	189	1	13	3	2	47.436	49.532	48.01	0.24114000000000002	2026-03-04 00:00:00	2026-03-04 00:00:00
600	2	189	1	13	3	3	47.438	49.752	47.996	0.28018	2026-03-05 00:00:00	2026-03-05 00:00:00
601	2	189	2	13	3	4	45.533	47.803	46.169	0.24574000000000001	2026-03-06 00:00:00	2026-03-06 00:00:00
602	2	189	1	13	3	5	47.445	49.439	47.935	0.27174	2026-03-07 00:00:00	2026-03-07 00:00:00
603	2	189	2	13	3	6	45.536	48.123	46.239	0.25291	2026-03-08 00:00:00	2026-03-08 00:00:00
604	2	189	2	13	3	7	53.632	55.352	54.067	0.26468	2026-03-09 00:00:00	2026-03-09 00:00:00
605	2	189	1	13	3	8	34.02	36.166	34.588	0.23487	2026-03-10 00:00:00	2026-03-10 00:00:00
606	2	189	1	13	3	9	34.212	36.558	34.763	0.19625000000000004	2026-03-11 00:00:00	2026-03-11 00:00:00
607	2	189	2	6	10	1	53.634	54.434	53.791	0.16777999999999998	2026-03-12 00:00:00	2026-03-12 00:00:00
608	2	189	2	6	10	2	53.633	54.533	53.784	0.18913	2026-03-13 00:00:00	2026-03-13 00:00:00
609	2	189	2	6	10	3	33.99	34.91	34.164	0.20925999999999995	2026-03-14 00:00:00	2026-03-14 00:00:00
610	2	189	2	6	10	4	34.182	35.176	34.39	0.19179	2026-03-15 00:00:00	2026-03-15 00:00:00
611	2	189	2	2	7	1	33.981	35.175	34.21	0.18927	2026-03-16 00:00:00	2026-03-16 00:00:00
612	2	189	2	2	3	1	53.633	54.658	53.827	0.18279	2026-03-17 00:00:00	2026-03-17 00:00:00
613	2	189	2	2	3	2	33.974	35.008	34.163	0.16477	2026-03-18 00:00:00	2026-03-18 00:00:00
614	2	189	2	2	3	3	34.158	35.39	34.361	0.21428999999999998	2026-03-19 00:00:00	2026-03-19 00:00:00
615	2	189	1	9	2	1	45.519	47.101	45.858	0.20901	2026-03-20 00:00:00	2026-03-20 00:00:00
616	2	189	2	10	2	1	47.434	49.233	47.81	0.13457	2026-03-21 00:00:00	2026-03-21 00:00:00
617	2	190	1	8	2	1	47.436	48.35	47.559	0.02321	2026-03-22 00:00:00	2026-03-22 00:00:00
618	2	190	1	1	7	1	47.426	48.805	47.458	0.08093	2026-03-23 00:00:00	2026-03-23 00:00:00
619	2	190	1	1	11	1	47.425	48.673	47.526	0.06853	2026-03-24 00:00:00	2026-03-24 00:00:00
620	2	190	2	1	13	1	45.52	46.775	45.606	0.01647	2026-03-25 00:00:00	2026-03-25 00:00:00
621	2	190	1	1	9	1	34.176	35.451	34.197	0.014369999999999999	2026-03-26 00:00:00	2026-03-26 00:00:00
622	2	190	2	5	3	1	53.625	55.782	53.656	0.11382999999999999	2026-03-27 00:00:00	2026-03-27 00:00:00
623	2	190	2	7	6	1	45.522	47.648	45.764	0.13391999999999998	2026-03-28 00:00:00	2026-03-28 00:00:00
624	2	190	1	7	5	1	53.637	55.123	53.836	0.35847	2026-03-29 00:00:00	2026-03-29 00:00:00
625	2	190	2	4	7	1	33.989	36.363	34.84	0.25478	2026-03-30 00:00:00	2026-03-30 00:00:00
626	2	190	2	4	3	1	33.992	36.19	34.552	0.30154	2026-03-31 00:00:00	2026-03-31 00:00:00
627	2	190	1	4	3	2	53.628	55.316	54.137	0.25062	2026-04-01 00:00:00	2026-04-01 00:00:00
628	2	190	1	11	2	1	34.022	35.63	34.425	0.28314	2026-04-02 00:00:00	2026-04-02 00:00:00
629	2	190	2	13	3	1	34.214	36.319	34.81	0.25889	2026-04-03 00:00:00	2026-04-03 00:00:00
630	2	190	2	13	3	10	53.637	55.464	54.11	0.25397	2026-04-04 00:00:00	2026-04-04 00:00:00
631	2	190	1	13	3	2	47.441	49.52	47.969	0.29767	2026-04-05 00:00:00	2026-04-05 00:00:00
632	2	190	1	13	3	3	45.54	47.989	46.269	0.23373	2026-04-06 00:00:00	2026-04-06 00:00:00
633	2	190	2	13	3	4	34.211	36.162	34.667	0.26543	2026-04-07 00:00:00	2026-04-07 00:00:00
634	2	190	1	13	3	5	34.018	35.898	34.517	0.26244	2026-04-08 00:00:00	2026-04-08 00:00:00
635	2	190	2	13	3	6	47.438	49.869	48.076	0.26686	2026-04-09 00:00:00	2026-04-09 00:00:00
636	2	190	2	13	3	7	34.218	35.953	34.681	0.28362	2026-04-10 00:00:00	2026-04-10 00:00:00
637	2	190	1	13	3	9	47.434	50.029	48.17	0.22432	2026-04-11 00:00:00	2026-04-11 00:00:00
638	2	190	2	6	10	1	47.429	48.49	47.667	0.21960000000000002	2026-04-12 00:00:00	2026-04-12 00:00:00
639	2	190	2	6	10	3	47.427	48.529	47.669	0.20575	2026-04-13 00:00:00	2026-04-13 00:00:00
640	2	190	2	6	10	4	45.531	46.401	45.71	0.18939	2026-04-14 00:00:00	2026-04-14 00:00:00
641	2	190	2	2	7	1	53.636	54.56	53.811	0.18367	2026-04-15 00:00:00	2026-04-15 00:00:00
642	2	190	2	2	3	1	33.988	35.017	34.177	0.21161000000000002	2026-04-16 00:00:00	2026-04-16 00:00:00
643	2	190	2	2	3	2	45.513	46.581	45.739	0.19613	2026-04-17 00:00:00	2026-04-17 00:00:00
644	2	190	2	2	3	3	47.422	48.61	47.655	0.21641	2026-04-18 00:00:00	2026-04-18 00:00:00
645	2	190	1	9	2	1	34.201	35.749	34.536	0.23837	2026-04-19 00:00:00	2026-04-19 00:00:00
646	2	190	2	10	2	1	45.528	46.904	45.856	0.28367000000000003	2026-04-20 00:00:00	2026-04-20 00:00:00
647	2	190	2	10	1	1	47.442	49.395	47.996	0.19821	2026-04-21 00:00:00	2026-04-21 00:00:00
648	2	191	1	8	2	1	53.636	54.529	53.813	0.07065	2026-04-22 00:00:00	2026-04-22 00:00:00
649	2	191	1	1	7	1	34.004	35.292	34.095	0.09874000000000001	2026-04-23 00:00:00	2026-04-23 00:00:00
650	2	191	1	1	11	1	34.004	35.351	34.137	0.01833	2026-04-24 00:00:00	2026-04-24 00:00:00
651	2	191	2	1	9	1	34.19	35.39	34.212	0.01917	2026-04-25 00:00:00	2026-04-25 00:00:00
652	2	191	1	1	9	2	34.19	35.494	34.215	0.010409999999999999	2026-04-26 00:00:00	2026-04-26 00:00:00
653	2	191	2	5	3	1	53.633	55.266	53.65	0.10867000000000002	2026-04-27 00:00:00	2026-04-27 00:00:00
654	2	191	1	7	5	1	53.637	55.321	53.82	0.30369	2026-04-28 00:00:00	2026-04-28 00:00:00
655	2	191	2	4	7	1	53.629	55.226	54.114	0.12883	2026-04-29 00:00:00	2026-04-29 00:00:00
656	2	191	2	7	6	1	34.014	35.45	34.199	0.25328	2026-04-30 00:00:00	2026-04-30 00:00:00
657	2	191	2	4	3	1	34.007	35.606	34.412	0.23107000000000003	2026-05-01 00:00:00	2026-05-01 00:00:00
658	2	191	1	11	2	1	47.451	49.234	47.863	0.24071	2026-05-02 00:00:00	2026-05-02 00:00:00
659	2	191	2	13	3	1	34.221	36.373	34.739	0.25238	2026-05-03 00:00:00	2026-05-03 00:00:00
660	2	191	2	13	3	10	45.538	47.432	46.016	0.25149	2026-05-04 00:00:00	2026-05-04 00:00:00
661	2	191	1	13	3	2	34.029	36.049	34.537	0.25214	2026-05-05 00:00:00	2026-05-05 00:00:00
662	2	191	1	13	3	3	47.442	49.544	47.972	0.26089	2026-05-06 00:00:00	2026-05-06 00:00:00
663	2	191	2	13	3	4	45.533	47.806	46.126	0.23417999999999997	2026-05-07 00:00:00	2026-05-07 00:00:00
664	2	191	1	13	3	5	45.544	47.662	46.04	0.22795000000000004	2026-05-08 00:00:00	2026-05-08 00:00:00
665	2	191	2	13	3	6	47.449	49.524	47.922	0.24795	2026-05-09 00:00:00	2026-05-09 00:00:00
666	2	191	2	13	3	7	34.035	36.108	34.549	0.24841000000000005	2026-05-10 00:00:00	2026-05-10 00:00:00
667	2	191	1	13	3	9	47.443	49.335	47.913	0.17434000000000002	2026-05-11 00:00:00	2026-05-11 00:00:00
668	2	191	2	6	10	1	47.433	48.15	47.558	0.20352	2026-05-12 00:00:00	2026-05-12 00:00:00
669	2	191	2	6	10	4	45.53	46.665	45.761	0.19512000000000002	2026-05-13 00:00:00	2026-05-13 00:00:00
670	2	191	2	2	7	1	45.52	46.627	45.736	0.17711	2026-05-14 00:00:00	2026-05-14 00:00:00
671	2	191	2	2	3	1	53.632	54.733	53.827	0.15988	2026-05-15 00:00:00	2026-05-15 00:00:00
672	2	191	2	2	3	2	34.004	35.968	34.318	0.20487	2026-05-16 00:00:00	2026-05-16 00:00:00
673	2	191	2	2	3	3	53.634	54.415	53.794	0.19632999999999998	2026-05-17 00:00:00	2026-05-17 00:00:00
674	2	191	1	9	2	1	53.643	54.896	53.889	0.19829000000000002	2026-05-18 00:00:00	2026-05-18 00:00:00
675	2	191	2	10	2	1	34.211	35.613	34.489	0.20224999999999999	2026-05-19 00:00:00	2026-05-19 00:00:00
676	2	192	1	8	2	1	45.534	46.958	45.822	0.03239	2026-05-20 00:00:00	2026-05-20 00:00:00
677	2	192	1	1	7	1	34.209	35.475	34.25	0.01336	2026-05-21 00:00:00	2026-05-21 00:00:00
678	2	192	1	1	9	1	47.437	49.009	47.458	0.01473	2026-05-22 00:00:00	2026-05-22 00:00:00
679	2	192	1	1	9	2	45.528	46.886	45.548	0.016819999999999998	2026-05-23 00:00:00	2026-05-23 00:00:00
680	2	192	2	5	3	1	34.2	36.222	34.234	0.09337	2026-05-24 00:00:00	2026-05-24 00:00:00
681	2	192	1	7	5	1	45.541	47.533	45.727	0.253	2026-05-25 00:00:00	2026-05-25 00:00:00
682	2	192	2	4	7	1	53.634	55.298	54.055	0.14892	2026-05-26 00:00:00	2026-05-26 00:00:00
683	2	192	2	7	6	1	34.026	36.43	34.384	0.27061	2026-05-27 00:00:00	2026-05-27 00:00:00
684	2	192	2	4	3	1	34.201	36.3	34.769	0.30341	2026-05-28 00:00:00	2026-05-28 00:00:00
685	2	192	1	4	3	2	53.636	55.864	54.312	0.24306999999999995	2026-05-29 00:00:00	2026-05-29 00:00:00
686	2	192	1	11	2	1	53.64	54.903	53.947	0.25146	2026-05-30 00:00:00	2026-05-30 00:00:00
687	2	192	2	13	3	1	45.548	47.946	46.151	0.24914000000000003	2026-05-31 00:00:00	2026-05-31 00:00:00
688	2	192	2	13	3	10	47.451	49.49	47.959	0.24692	2026-06-01 00:00:00	2026-06-01 00:00:00
689	2	192	1	13	3	2	45.548	48.148	46.19	0.27535	2026-06-02 00:00:00	2026-06-02 00:00:00
690	2	192	1	13	3	3	47.451	49.187	47.929	0.26675	2026-06-03 00:00:00	2026-06-03 00:00:00
691	2	192	2	13	3	4	45.539	47.837	46.152	0.25373999999999997	2026-06-04 00:00:00	2026-06-04 00:00:00
692	2	192	1	13	3	5	53.647	55.251	54.054	0.24953000000000003	2026-06-05 00:00:00	2026-06-05 00:00:00
693	2	192	2	13	3	6	45.548	48.217	46.214	0.23087	2026-06-06 00:00:00	2026-06-06 00:00:00
694	2	192	1	13	3	8	34.048	35.538	34.392	0.23166000000000003	2026-06-07 00:00:00	2026-06-07 00:00:00
695	2	192	1	13	3	9	34.234	36.483	34.755	0.19512000000000002	2026-06-08 00:00:00	2026-06-08 00:00:00
696	2	192	2	6	10	1	34.019	35.167	34.243	0.20769	2026-06-09 00:00:00	2026-06-09 00:00:00
697	2	192	2	6	10	4	34.217	35.257	34.433	0.18975	2026-06-10 00:00:00	2026-06-10 00:00:00
698	2	192	2	2	7	1	34.014	35.126	34.225	0.25366	2026-06-11 00:00:00	2026-06-11 00:00:00
699	2	192	2	2	3	1	53.632	54.657	53.892	0.18278	2026-06-12 00:00:00	2026-06-12 00:00:00
700	2	192	2	2	3	2	34.011	34.766	34.149	0.15134999999999998	2026-06-13 00:00:00	2026-06-13 00:00:00
701	2	192	2	2	3	3	34.199	35.276	34.362	0.20817000000000002	2026-06-14 00:00:00	2026-06-14 00:00:00
702	2	192	1	9	2	1	47.452	49.532	47.885	0.21406	2026-06-15 00:00:00	2026-06-15 00:00:00
703	2	192	2	10	2	1	45.533	47.411	45.935	0.19039	2026-06-16 00:00:00	2026-06-16 00:00:00
704	2	192	2	10	1	1	45.539	47.288	45.872	0.18411999999999998	2026-06-17 00:00:00	2026-06-17 00:00:00
705	2	193	1	8	2	1	53.641	54.863	53.866	0.05151	2026-06-18 00:00:00	2026-06-18 00:00:00
706	2	193	1	1	7	1	34.021	35.516	34.098	0.018349999999999998	2026-06-19 00:00:00	2026-06-19 00:00:00
707	2	193	1	1	9	1	47.446	48.863	47.472	0.02144	2026-06-20 00:00:00	2026-06-20 00:00:00
708	2	193	1	1	9	2	45.533	46.932	45.563	0.014419999999999999	2026-06-21 00:00:00	2026-06-21 00:00:00
709	2	193	1	1	9	3	34.021	35.339	34.04	0.006840000000000001	2026-06-22 00:00:00	2026-06-22 00:00:00
710	2	193	2	5	3	1	53.638	55.978	53.654	0.00987	2026-06-23 00:00:00	2026-06-23 00:00:00
711	2	193	2	5	7	1	53.637	55.765	53.658	0.10615000000000002	2026-06-24 00:00:00	2026-06-24 00:00:00
712	2	193	1	7	5	1	34.033	36.162	34.259	0.25297000000000003	2026-06-25 00:00:00	2026-06-25 00:00:00
713	2	193	2	4	7	1	53.636	55.49	54.105	0.2275	2026-06-26 00:00:00	2026-06-26 00:00:00
714	2	193	2	4	3	1	45.536	47.558	45.996	0.21003	2026-06-27 00:00:00	2026-06-27 00:00:00
715	2	193	1	4	3	2	47.448	50	47.984	0.20498	2026-06-28 00:00:00	2026-06-28 00:00:00
716	2	193	1	11	2	1	47.45	49.177	47.804	0.25169	2026-06-29 00:00:00	2026-06-29 00:00:00
717	2	193	2	13	3	1	47.453	49.813	48.047	0.26331	2026-06-30 00:00:00	2026-06-30 00:00:00
718	2	193	1	13	3	2	45.553	47.695	46.117	0.18389	2026-07-01 00:00:00	2026-07-01 00:00:00
719	2	193	2	6	10	1	34.031	34.863	34.184	0.19017	2026-07-02 00:00:00	2026-07-02 00:00:00
720	2	193	2	6	10	2	45.539	46.475	45.717	0.20899	2026-07-03 00:00:00	2026-07-03 00:00:00
721	2	193	2	6	10	3	34.222	35.179	34.422	0.24778999999999998	2026-07-04 00:00:00	2026-07-04 00:00:00
722	2	193	2	6	10	4	45.534	46.212	45.702	0.1253	2026-07-05 00:00:00	2026-07-05 00:00:00
723	2	193	2	2	7	1	53.641	54.463	53.744	0.17588	2026-07-06 00:00:00	2026-07-06 00:00:00
724	2	193	2	2	3	1	47.437	48.631	47.647	0.17764	2026-07-07 00:00:00	2026-07-07 00:00:00
725	2	193	2	2	3	2	34.209	35.47	34.433	0.18519	2026-07-08 00:00:00	2026-07-08 00:00:00
726	2	193	2	2	3	3	53.634	54.579	53.809	0.19743	2026-07-09 00:00:00	2026-07-09 00:00:00
727	2	193	1	9	2	1	45.545	47.181	45.868	0.19818000000000002	2026-07-10 00:00:00	2026-07-10 00:00:00
728	2	193	2	10	2	1	47.452	49.319	47.822	0.19391999999999998	2026-07-11 00:00:00	2026-07-11 00:00:00
729	2	193	2	10	1	1	45.544	47.385	45.901	0.18395	2026-07-12 00:00:00	2026-07-12 00:00:00
730	2	194	1	8	2	1	47.452	48.686	47.679	0.04734	2026-07-13 00:00:00	2026-07-13 00:00:00
731	2	194	1	1	7	1	47.445	48.818	47.51	0.015	2026-07-14 00:00:00	2026-07-14 00:00:00
732	2	194	1	1	9	1	34.033	35.633	34.057	0.01836	2026-07-15 00:00:00	2026-07-15 00:00:00
733	2	194	1	1	9	2	34.218	35.634	34.244	0.12563000000000002	2026-07-16 00:00:00	2026-07-16 00:00:00
734	2	194	1	7	5	1	34.23	36.602	34.528	0.22404000000000002	2026-07-17 00:00:00	2026-07-17 00:00:00
735	2	194	2	4	7	1	53.637	55.043	53.952	0.15794	2026-07-18 00:00:00	2026-07-18 00:00:00
736	2	194	2	7	6	1	53.639	55.817	53.983	0.30812	2026-07-19 00:00:00	2026-07-19 00:00:00
737	2	194	2	4	3	1	34.226	36.936	35.061	0.28734000000000004	2026-07-20 00:00:00	2026-07-20 00:00:00
738	2	194	1	4	3	2	53.636	55.571	54.192	0.17361000000000001	2026-07-21 00:00:00	2026-07-21 00:00:00
739	2	194	2	6	10	1	34.227	35.091	34.377	0.15457	2026-07-22 00:00:00	2026-07-22 00:00:00
740	2	194	2	6	10	2	34.036	34.89	34.168	0.15032	2026-07-23 00:00:00	2026-07-23 00:00:00
741	2	194	2	6	10	3	34.227	35.318	34.391	0.16232	2026-07-24 00:00:00	2026-07-24 00:00:00
742	2	194	2	6	10	4	47.45	48.639	47.643	0.12398999999999999	2026-07-25 00:00:00	2026-07-25 00:00:00
743	2	194	2	2	7	1	34.034	35.147	34.172	0.17515	2026-07-26 00:00:00	2026-07-26 00:00:00
744	2	194	2	2	3	1	53.634	54.656	53.813	0.13296	2026-07-27 00:00:00	2026-07-27 00:00:00
745	2	194	2	2	3	2	34.218	35.301	34.362	0.14077	2026-07-28 00:00:00	2026-07-28 00:00:00
746	2	194	2	2	3	3	34.03	35.195	34.194	0.19297	2026-07-29 00:00:00	2026-07-29 00:00:00
747	2	194	1	9	2	1	34.233	35.798	34.535	0.21280000000000002	2026-07-30 00:00:00	2026-07-30 00:00:00
748	2	194	2	10	2	1	34.048	35.251	34.304	0.21755	2026-07-31 00:00:00	2026-07-31 00:00:00
749	2	194	2	10	1	1	34.05	36.284	34.536	0.16327000000000003	2026-08-01 00:00:00	2026-08-01 00:00:00
750	2	195	1	8	2	1	45.552	47.071	45.8	0.0406	2026-08-02 00:00:00	2026-08-02 00:00:00
751	2	195	1	1	7	1	34.235	36.304	34.319	0.02388	2026-08-03 00:00:00	2026-08-03 00:00:00
752	2	195	1	1	9	1	47.453	49.212	47.495	0.01836	2026-08-04 00:00:00	2026-08-04 00:00:00
753	2	195	1	1	9	2	53.641	54.676	53.66	0.015080000000000001	2026-08-05 00:00:00	2026-08-05 00:00:00
754	2	195	1	1	9	3	45.548	47.206	45.573	0.09647	2026-08-06 00:00:00	2026-08-06 00:00:00
755	2	195	1	7	5	1	53.641	55.144	53.786	0.23541	2026-08-07 00:00:00	2026-08-07 00:00:00
756	2	195	2	4	7	1	34.042	35.087	34.288	0.13273	2026-08-08 00:00:00	2026-08-08 00:00:00
757	2	195	2	7	6	1	34.237	35.013	34.34	0.27543	2026-08-09 00:00:00	2026-08-09 00:00:00
758	2	195	2	4	3	1	34.234	35.512	34.586	0.22293000000000002	2026-08-10 00:00:00	2026-08-10 00:00:00
759	2	195	1	4	3	2	53.641	55.987	54.164	0.21532	2026-08-11 00:00:00	2026-08-11 00:00:00
760	2	195	2	6	10	3	47.456	48.84	47.754	0.1568	2026-08-12 00:00:00	2026-08-12 00:00:00
761	2	195	2	6	10	4	45.551	46.463	45.694	0.13959	2026-08-13 00:00:00	2026-08-13 00:00:00
762	2	195	2	2	7	1	34.047	35.272	34.218	0.18335	2026-08-14 00:00:00	2026-08-14 00:00:00
763	2	195	2	2	3	1	53.641	54.71	53.837	0.19257000000000002	2026-08-15 00:00:00	2026-08-15 00:00:00
764	2	195	2	2	3	2	34.032	35.377	34.291	0.017390000000000003	2026-08-16 00:00:00	2026-08-16 00:00:00
765	2	196	1	1	7	1	47.457	48.952	47.483	0.02706	2026-08-17 00:00:00	2026-08-17 00:00:00
766	2	196	1	1	9	1	34.054	35.495	34.093	0.014890000000000002	2026-08-18 00:00:00	2026-08-18 00:00:00
767	2	196	1	1	9	2	34.24	35.516	34.259	0.23395	2026-08-19 00:00:00	2026-08-19 00:00:00
768	2	196	2	4	7	1	53.646	55.796	54.149	0.25782	2026-08-20 00:00:00	2026-08-20 00:00:00
769	2	196	2	4	3	1	53.644	55.785	54.196	0.25092	2026-08-21 00:00:00	2026-08-21 00:00:00
770	2	196	1	4	3	2	53.645	56.104	54.262	0.18709	2026-08-22 00:00:00	2026-08-22 00:00:00
771	2	196	2	6	10	1	34.239	34.843	34.352	0.2043	2026-08-23 00:00:00	2026-08-23 00:00:00
772	2	196	2	2	7	1	34.049	34.886	34.22	0.16713999999999998	2026-08-24 00:00:00	2026-08-24 00:00:00
773	2	196	2	2	3	1	53.645	54.704	53.822	0.17768	2026-08-25 00:00:00	2026-08-25 00:00:00
774	2	196	2	2	3	2	34.238	35.403	34.445	0.16773	2026-08-26 00:00:00	2026-08-26 00:00:00
775	2	196	2	2	3	3	34.05	35.308	34.261	0.22932999999999998	2026-08-27 00:00:00	2026-08-27 00:00:00
776	2	193	1	13	3	3	34.054	36.025	34.506	0.20626999999999998	2026-08-28 00:00:00	2026-08-28 00:00:00
777	2	193	1	13	3	8	34.057	36.481	34.557	0.22748	2026-08-29 00:00:00	2026-08-29 00:00:00
778	2	193	1	13	3	6	34.243	36.23	34.695	0.22646	2026-08-30 00:00:00	2026-08-30 00:00:00
779	2	193	1	13	3	7	45.565	48.029	46.123	0.21954	2026-08-31 00:00:00	2026-08-31 00:00:00
780	2	193	1	13	3	5	47.464	49.705	47.956	0.22737000000000002	2026-09-01 00:00:00	2026-09-01 00:00:00
781	2	193	1	13	3	9	47.462	49.903	48.017	0.22184	2026-09-02 00:00:00	2026-09-02 00:00:00
782	2	194	1	13	3	5	34.064	35.795	34.448	0.22158	2026-09-03 00:00:00	2026-09-03 00:00:00
783	2	194	1	13	3	1	34.253	35.458	34.52	0.23925000000000002	2026-09-04 00:00:00	2026-09-04 00:00:00
784	2	194	1	13	3	8	34.254	36.323	34.749	0.2097	2026-09-05 00:00:00	2026-09-05 00:00:00
785	2	194	1	11	2	1	45.56	47.148	45.893	0.2443	2026-09-06 00:00:00	2026-09-06 00:00:00
786	2	194	1	13	3	10	45.568	47.586	46.061	0.24309000000000003	2026-09-07 00:00:00	2026-09-07 00:00:00
787	2	194	1	13	3	2	45.559	47.731	46.087	0.24166	2026-09-08 00:00:00	2026-09-08 00:00:00
788	2	194	1	13	3	6	45.561	47.899	46.126	0.21905000000000002	2026-09-09 00:00:00	2026-09-09 00:00:00
789	2	194	1	13	3	3	47.456	49.241	47.847	0.23875	2026-09-10 00:00:00	2026-09-10 00:00:00
790	2	194	1	13	3	7	47.468	49.491	47.951	0.25653	2026-09-11 00:00:00	2026-09-11 00:00:00
791	2	195	1	13	3	4	34.069	35.983	34.56	0.20518999999999998	2026-09-12 00:00:00	2026-09-12 00:00:00
792	2	195	1	9	2	1	34.246	36.171	34.641	0.22311000000000003	2026-09-13 00:00:00	2026-09-13 00:00:00
793	2	195	1	13	3	8	34.258	36.387	34.733	0.22963999999999996	2026-09-14 00:00:00	2026-09-14 00:00:00
794	2	195	1	13	3	6	45.568	47.68	46.053	0.21417000000000003	2026-09-15 00:00:00	2026-09-15 00:00:00
795	2	195	1	13	3	7	45.58	48.022	46.103	0.20842999999999998	2026-09-16 00:00:00	2026-09-16 00:00:00
796	2	195	1	13	3	9	45.588	48.078	46.107	0.20796	2026-09-17 00:00:00	2026-09-17 00:00:00
797	2	195	1	11	2	1	47.466	49.024	47.79	0.21015999999999999	2026-09-18 00:00:00	2026-09-18 00:00:00
798	2	195	1	13	3	3	47.474	49.344	47.867	0.21248	2026-09-19 00:00:00	2026-09-19 00:00:00
799	2	195	1	13	3	10	47.485	49.504	47.914	0.23035	2026-09-20 00:00:00	2026-09-20 00:00:00
800	2	195	1	13	3	5	47.466	49.476	47.929	0.21101000000000003	2026-09-21 00:00:00	2026-09-21 00:00:00
801	2	195	1	10	2	1	53.648	54.629	53.855	0.20209	2026-09-22 00:00:00	2026-09-22 00:00:00
802	2	195	1	10	1	1	53.648	54.89	53.899	0.24552	2026-09-23 00:00:00	2026-09-23 00:00:00
803	2	195	1	13	3	1	53.644	55.485	54.096	0.17306000000000002	2026-09-24 00:00:00	2026-09-24 00:00:00
804	2	196	2	6	10	4	34.062	35.027	34.229	0.22960999999999998	2026-09-25 00:00:00	2026-09-25 00:00:00
805	2	196	1	11	2	1	34.072	35.727	34.452	0.19841999999999999	2026-09-26 00:00:00	2026-09-26 00:00:00
806	2	196	1	8	2	1	34.057	36.088	34.46	0.22997	2026-09-27 00:00:00	2026-09-27 00:00:00
807	2	196	1	13	3	4	34.077	36.099	34.542	0.11715	2026-09-28 00:00:00	2026-09-28 00:00:00
808	2	196	1	7	6	1	34.253	36.882	34.561	0.21483000000000002	2026-09-29 00:00:00	2026-09-29 00:00:00
809	2	196	1	13	3	2	34.26	36.35	34.709	0.23602000000000004	2026-09-30 00:00:00	2026-09-30 00:00:00
810	2	196	1	13	3	5	34.263	36.212	34.723	0.18691	2026-10-01 00:00:00	2026-10-01 00:00:00
811	2	196	2	6	10	3	45.558	46.505	45.735	0.17584	2026-10-02 00:00:00	2026-10-02 00:00:00
812	2	196	1	9	2	1	45.569	47.332	45.879	0.18431999999999998	2026-10-03 00:00:00	2026-10-03 00:00:00
813	2	196	1	10	2	1	45.568	47.418	45.909	0.22896000000000002	2026-10-04 00:00:00	2026-10-04 00:00:00
814	2	196	1	13	3	9	45.591	47.587	46.048	0.22832999999999998	2026-10-05 00:00:00	2026-10-05 00:00:00
815	2	196	1	13	3	7	45.588	47.791	46.091	0.24018	2026-10-06 00:00:00	2026-10-06 00:00:00
816	2	196	1	13	3	1	45.582	48.026	46.169	0.11635999999999999	2026-10-07 00:00:00	2026-10-07 00:00:00
817	2	196	1	7	5	1	47.462	49.473	47.696	0.23002999999999998	2026-10-08 00:00:00	2026-10-08 00:00:00
818	2	196	1	13	3	8	47.482	49.673	47.986	0.23735	2026-10-09 00:00:00	2026-10-09 00:00:00
819	2	196	1	13	3	3	47.478	49.85	48.041	0.22094999999999998	2026-10-10 00:00:00	2026-10-10 00:00:00
820	2	196	1	13	3	10	47.488	50.027	48.049	0.006660000000000001	2026-10-11 00:00:00	2026-10-11 00:00:00
821	2	196	2	5	3	1	53.652	56.506	53.671	0.17352	2026-10-12 00:00:00	2026-10-12 00:00:00
822	2	196	1	10	1	1	53.647	54.984	53.879	0.022770000000000002	2026-10-13 00:00:00	2026-10-13 00:00:00
823	2	197	2	1	9	2	34.072	35.214	34.098	0.17959	2026-10-14 00:00:00	2026-10-14 00:00:00
824	2	197	2	6	10	2	34.061	34.796	34.193	0.16394999999999998	2026-10-15 00:00:00	2026-10-15 00:00:00
825	2	197	2	2	3	1	34.054	34.914	34.195	0.14302	2026-10-16 00:00:00	2026-10-16 00:00:00
826	2	197	2	2	3	3	34.246	35.148	34.375	0.15802	2026-10-17 00:00:00	2026-10-17 00:00:00
827	2	197	2	2	7	1	34.258	35.068	34.386	0.20111	2026-10-18 00:00:00	2026-10-18 00:00:00
828	2	197	2	6	10	1	34.252	35.152	34.433	0.21265	2026-10-19 00:00:00	2026-10-19 00:00:00
829	2	197	1	10	2	1	34.076	35.783	34.439	0.21677	2026-10-20 00:00:00	2026-10-20 00:00:00
830	2	197	1	11	2	1	34.078	36.094	34.515	0.20377	2026-10-21 00:00:00	2026-10-21 00:00:00
831	2	197	1	9	2	1	34.26	35.639	34.541	0.23173	2026-10-22 00:00:00	2026-10-22 00:00:00
832	2	197	1	13	3	2	34.265	36.276	34.731	0.01355	2026-10-23 00:00:00	2026-10-23 00:00:00
833	2	197	2	1	9	1	45.568	47.192	45.59	0.17949	2026-10-24 00:00:00	2026-10-24 00:00:00
834	2	197	2	6	10	4	45.576	46.356	45.716	0.11064	2026-10-25 00:00:00	2026-10-25 00:00:00
835	2	197	1	7	5	1	45.576	47.239	45.76	0.24229	2026-10-26 00:00:00	2026-10-26 00:00:00
836	2	197	1	13	3	3	45.581	47.917	46.147	0.03198	2026-10-27 00:00:00	2026-10-27 00:00:00
837	2	197	2	1	11	1	47.468	48.844	47.512	0.16213	2026-10-28 00:00:00	2026-10-28 00:00:00
838	2	197	2	6	10	3	47.471	48.316	47.608	0.17283	2026-10-29 00:00:00	2026-10-29 00:00:00
839	2	197	1	7	6	1	47.472	49.04	47.743	0.25769	2026-10-30 00:00:00	2026-10-30 00:00:00
840	2	197	1	13	3	4	47.482	49.399	47.976	0.24278	2026-10-31 00:00:00	2026-10-31 00:00:00
841	2	197	1	13	3	1	47.49	49.809	48.053	0.06606	2026-11-01 00:00:00	2026-11-01 00:00:00
842	2	197	2	1	7	1	53.648	54.965	53.735	0.1362	2026-11-02 00:00:00	2026-11-02 00:00:00
843	2	197	2	2	3	2	53.651	54.51	53.768	0.24462	2026-11-03 00:00:00	2026-11-03 00:00:00
844	2	197	2	4	3	1	53.653	55.186	54.028	0.24419000000000002	2026-11-04 00:00:00	2026-11-04 00:00:00
845	2	197	2	4	7	1	53.647	56.186	54.267	-0.6863800000000001	2026-11-05 00:00:00	2026-11-05 00:00:00
846	2	197	1	13	3	9	47.488	49.5	46.107	1.12459	2026-11-06 00:00:00	2026-11-06 00:00:00
847	2	197	1	13	3	10	45.586	47.721	47.987	0.24849	2026-11-07 00:00:00	2026-11-07 00:00:00
848	2	197	1	13	3	8	34.272	36.586	34.847	0.25739999999999996	2026-11-08 00:00:00	2026-11-08 00:00:00
849	2	197	1	13	3	5	34.083	36.212	34.631	0.26128	2026-11-09 00:00:00	2026-11-09 00:00:00
850	2	197	1	13	3	6	53.644	55.638	54.165	0.23818	2026-11-10 00:00:00	2026-11-10 00:00:00
851	2	197	1	13	3	7	45.593	47.772	46.112	0.13472	2026-11-11 00:00:00	2026-11-11 00:00:00
852	2	198	2	2	3	1	34.066	35.12	34.208	0.17647	2026-11-12 00:00:00	2026-11-12 00:00:00
853	2	198	2	6	10	4	34.076	34.943	34.229	0.01957	2026-11-13 00:00:00	2026-11-13 00:00:00
854	2	198	2	1	9	2	34.253	35.326	34.274	0.17841	2026-11-14 00:00:00	2026-11-14 00:00:00
855	2	198	2	2	3	3	34.062	35.368	34.295	0.18403	2026-11-15 00:00:00	2026-11-15 00:00:00
856	2	198	1	8	2	1	34.073	35.638	34.361	0.07386999999999999	2026-11-16 00:00:00	2026-11-16 00:00:00
857	2	198	2	1	7	1	34.262	35.724	34.37	0.17010000000000003	2026-11-17 00:00:00	2026-11-17 00:00:00
858	2	198	2	6	10	1	34.253	34.982	34.377	0.16344999999999998	2026-11-18 00:00:00	2026-11-18 00:00:00
859	2	198	2	2	3	2	34.256	35.449	34.451	0.16587	2026-11-19 00:00:00	2026-11-19 00:00:00
860	2	198	2	2	7	1	34.255	35.503	34.462	0.25242000000000003	2026-11-20 00:00:00	2026-11-20 00:00:00
861	2	198	2	4	7	1	34.066	36.542	34.691	0.10747999999999999	2026-11-21 00:00:00	2026-11-21 00:00:00
862	2	198	1	7	6	1	45.584	47.51	45.791	0.21558	2026-11-22 00:00:00	2026-11-22 00:00:00
863	2	198	1	10	2	1	45.594	47.519	46.009	0.023719999999999998	2026-11-23 00:00:00	2026-11-23 00:00:00
864	2	198	2	1	9	1	47.471	48.989	47.507	0.18367	2026-11-24 00:00:00	2026-11-24 00:00:00
865	2	198	1	9	2	1	47.491	49.304	47.824	0.0526	2026-11-25 00:00:00	2026-11-25 00:00:00
866	2	198	2	1	11	1	53.649	55.17	53.729	0.095	2026-11-26 00:00:00	2026-11-26 00:00:00
867	2	198	1	7	5	1	53.652	54.831	53.764	0.28287	2026-11-27 00:00:00	2026-11-27 00:00:00
868	2	198	2	4	3	2	53.648	55.557	54.188	0.1727	2026-11-28 00:00:00	2026-11-28 00:00:00
869	2	199	2	6	10	3	34.082	34.8	34.206	0.145	2026-11-29 00:00:00	2026-11-29 00:00:00
870	2	199	2	2	3	1	34.073	35.342	34.257	0.17647	2026-11-30 00:00:00	2026-11-30 00:00:00
871	2	199	1	8	2	1	34.081	35.135	34.267	0.01845	2026-12-01 00:00:00	2026-12-01 00:00:00
872	2	199	2	1	9	2	34.262	35.996	34.294	0.16171	2026-12-02 00:00:00	2026-12-02 00:00:00
873	2	199	2	6	10	2	34.264	35.037	34.389	0.15541	2026-12-03 00:00:00	2026-12-03 00:00:00
874	2	199	2	6	10	1	34.265	35.346	34.433	0.12827	2026-12-04 00:00:00	2026-12-04 00:00:00
875	2	199	1	7	6	1	34.267	35.912	34.478	0.31420000000000003	2026-12-05 00:00:00	2026-12-05 00:00:00
876	2	199	2	4	3	2	34.079	37.023	35.004	0.14526999999999998	2026-12-06 00:00:00	2026-12-06 00:00:00
877	2	199	2	2	3	3	45.587	46.654	45.742	0.053470000000000004	2026-12-07 00:00:00	2026-12-07 00:00:00
878	2	199	2	1	7	1	47.483	48.923	47.56	0.15917	2026-12-08 00:00:00	2026-12-08 00:00:00
879	2	199	2	2	3	2	47.484	48.64	47.668	0.02387	2026-12-09 00:00:00	2026-12-09 00:00:00
880	2	199	2	1	9	1	53.645	55.153	53.681	0.17132000000000003	2026-12-10 00:00:00	2026-12-10 00:00:00
881	2	199	2	6	10	4	53.645	54.433	53.78	0.16652	2026-12-11 00:00:00	2026-12-11 00:00:00
882	2	199	2	2	7	1	53.644	54.743	53.827	0.14905	2026-12-12 00:00:00	2026-12-12 00:00:00
883	2	199	1	7	5	1	53.653	55.29	53.897	0.23609000000000005	2026-12-13 00:00:00	2026-12-13 00:00:00
884	2	199	2	4	7	1	53.645	55.928	54.184	0.08681	2026-12-14 00:00:00	2026-12-14 00:00:00
885	2	200	2	1	13	1	34.083	35.615	34.216	0.14833	2026-12-15 00:00:00	2026-12-15 00:00:00
886	2	200	2	2	3	3	34.265	35.519	34.451	0.08170999999999999	2026-12-16 00:00:00	2026-12-16 00:00:00
887	2	200	2	1	13	2	45.594	46.977	45.707	0.15571	2026-12-17 00:00:00	2026-12-17 00:00:00
888	2	200	2	2	3	1	45.591	46.458	45.726	0.11111	2026-12-18 00:00:00	2026-12-18 00:00:00
889	2	200	2	1	13	3	47.493	48.789	47.637	0.01102	2026-12-19 00:00:00	2026-12-19 00:00:00
890	2	200	2	5	3	1	53.647	55.915	53.672	0.17845	2026-12-20 00:00:00	2026-12-20 00:00:00
891	2	200	2	2	3	2	53.649	54.568	53.813	0.011850000000000001	2026-12-21 00:00:00	2026-12-21 00:00:00
892	2	201	2	5	7	1	53.649	55.844	53.675	0.19143000000000002	2026-12-22 00:00:00	2026-12-22 00:00:00
893	2	201	2	2	3	4	47.497	48.547	47.698	0.20017	2026-12-23 00:00:00	2026-12-23 00:00:00
894	2	201	2	2	3	3	34.087	35.266	34.323	0.18364999999999998	2026-12-24 00:00:00	2026-12-24 00:00:00
895	2	201	2	2	3	2	34.276	35.12	34.431	0.26208	2026-12-25 00:00:00	2026-12-25 00:00:00
896	2	201	2	4	7	1	53.647	56.131	54.298	0.11599	2026-12-26 00:00:00	2026-12-26 00:00:00
897	2	201	2	2	7	1	34.089	35.227	34.221	0.056420000000000005	2026-12-27 00:00:00	2026-12-27 00:00:00
898	2	201	2	1	13	1	34.279	35.626	34.355	0.01125	2026-12-28 00:00:00	2026-12-28 00:00:00
899	2	201	2	1	9	2	47.493	48.915	47.509	0.00981	2026-12-29 00:00:00	2026-12-29 00:00:00
900	2	201	2	1	9	1	45.6	47.129	45.615	0.25145	2026-12-30 00:00:00	2026-12-30 00:00:00
901	2	198	1	13	3	9	47.486	49.562	48.008	0.24122	2026-12-31 00:00:00	2026-12-31 00:00:00
902	2	198	1	13	3	8	45.585	47.977	46.162	0.23276	2027-01-01 00:00:00	2027-01-01 00:00:00
903	2	198	1	13	3	6	34.264	36.425	34.767	0.22976	2027-01-02 00:00:00	2027-01-02 00:00:00
904	2	198	1	13	3	7	34.091	35.993	34.528	0.23667000000000002	2027-01-03 00:00:00	2027-01-03 00:00:00
905	2	198	1	13	3	5	53.649	55.318	54.044	0	2027-01-04 00:00:00	2027-01-04 00:00:00
\.


--
-- Data for Name: registros_analisis_nitrogeno; Type: TABLE DATA; Schema: public; Owner: funglusapp
--

COPY public.registros_analisis_nitrogeno (id, ciclo_procesamiento_id, ciclo_catalogo_id, etapa_catalogo_id, muestra_catalogo_id, origen_catalogo_id, secuencia_catalogo_id, peso_muestra_n_g, n_hcl_normalidad, vol_hcl_gastado_cm3, calc_nitrogeno_organico_total_porc, calc_humedad_usada_referencia_porc, calc_peso_seco_g, calc_nitrogeno_base_seca_porc, created_at, updated_at) FROM stdin;
1	1	172	2	5	14	1	1.323	0.0955	4.7	0.004699999999999999	0.10039999999999999	1.1902	0.00527983042	2025-02-14 00:00:00	2025-02-14 00:00:00
2	1	166	1	13	2	1	1.411	0.0955	8	0.0076	0.6284000000000001	0.5243	0.020399460180000002	2025-02-14 00:00:00	2025-02-14 00:00:00
3	1	167	1	13	2	1	1.338	0.0955	7.8	0.0078000000000000005	0.6088	0.5234	0.01992374848	2025-02-14 00:00:00	2025-02-14 00:00:00
4	1	168	1	13	2	1	1.396	0.0955	7.7	0.0074	0.6324000000000001	0.5132	0.0200613988	2025-02-14 00:00:00	2025-02-14 00:00:00
5	1	172	2	4	3	1	1.488	0.0955	23.7	0.0213	0.6049	0.5879	0.05389764535	2025-02-15 00:00:00	2025-02-15 00:00:00
6	1	172	2	4	3	1	1.395	0.0955	26	0.024900000000000002	0.6049	0.5512	0.06307009976	2025-02-15 00:00:00	2025-02-15 00:00:00
7	1	172	2	4	3	2	1.31	0.0955	23.8	0.024300000000000002	0.6244	0.492	0.06467128421	2025-02-15 00:00:00	2025-02-15 00:00:00
8	1	172	2	4	3	2	1.353	0.0955	23.8	0.0235	0.6244	0.5082	0.06261595146	2025-02-15 00:00:00	2025-02-15 00:00:00
9	1	171	1	8	2	1	1.308	0.0955	3.5	0.0036	0.7714	0.299	0.01565004107	2025-02-15 00:00:00	2025-02-15 00:00:00
10	1	170	1	11	2	1	1.416	0.0955	5.1	0.0048	0.7149	0.4037	0.01689044581	2025-02-15 00:00:00	2025-02-15 00:00:00
11	1	169	1	13	2	1	1.334	0.0955	6.8	0.0068000000000000005	0.6468	0.4712	0.01929584472	2025-02-15 00:00:00	2025-02-15 00:00:00
12	1	169	1	13	2	2	1.414	0.0955	6.9	0.006500000000000001	0.6468	0.4994	0.01847185002	2025-02-15 00:00:00	2025-02-15 00:00:00
13	1	173	2	4	3	1	1.409	0.0955	22.3	0.0212	0.6254	0.5278	0.05648816983	2025-02-24 00:00:00	2025-02-24 00:00:00
14	1	173	2	4	3	1	1.31	0.0955	19.3	0.0197	0.6254	0.4907	0.052583519110000004	2025-02-24 00:00:00	2025-02-24 00:00:00
15	1	173	2	4	3	2	1.315	0.0955	17.5	0.0178	0.6201	0.4996	0.046835418969999994	2025-02-24 00:00:00	2025-02-24 00:00:00
16	1	173	2	4	3	2	1.368	0.0955	19.8	0.0194	0.6201	0.5197	0.05093791995	2025-02-24 00:00:00	2025-02-24 00:00:00
17	1	172	1	8	2	1	1.404	0.0955	5.8	0.0055000000000000005	0.7617	0.3346	0.02317758864	2025-02-24 00:00:00	2025-02-24 00:00:00
18	1	170	1	13	2	1	1.329	0.0955	6.5	0.006500000000000001	0.6562	0.4569	0.01902014882	2025-02-24 00:00:00	2025-02-24 00:00:00
19	1	170	1	13	2	2	1.302	0.0955	6.5	0.0067	0.6562	0.4476	0.01941457587	2025-02-24 00:00:00	2025-02-24 00:00:00
20	1	174	2	4	3	1	1.481	0.0955	13.4	0.0121	0.5825	0.6183	0.02897508157	2025-03-03 00:00:00	2025-03-03 00:00:00
21	1	174	2	4	3	1	1.538	0.0955	18.8	0.0163	0.5825	0.6421	0.03914501296	2025-03-03 00:00:00	2025-03-03 00:00:00
22	1	174	2	4	3	2	1.53	0.0955	18.1	0.0158	0.5848	0.6353	0.03809440603	2025-03-03 00:00:00	2025-03-03 00:00:00
23	1	174	2	4	3	2	1.344	0.0955	17.9	0.0178	0.5848	0.558	0.04288721299	2025-03-03 00:00:00	2025-03-03 00:00:00
24	1	175	2	4	3	1	1.516	0.0955	19.8	0.0175	0.6333	0.5559	0.04761968149	2025-03-07 00:00:00	2025-03-07 00:00:00
25	1	175	2	4	3	1	1.521	0.0955	19.8	0.0174	0.6333	0.5578	0.047463140790000004	2025-03-07 00:00:00	2025-03-07 00:00:00
26	1	175	2	4	3	2	1.349	0.0955	18.8	0.018600000000000002	0.551	0.6057	0.04149836305	2025-03-07 00:00:00	2025-03-07 00:00:00
27	1	175	2	4	3	2	1.471	0.0955	24.9	0.0226	0.551	0.6605	0.05040478198	2025-03-07 00:00:00	2025-03-07 00:00:00
28	1	172	1	13	2	1	1.509	0.0955	7.8	0.0069	0.6292	0.5595	0.0186379029	2025-03-07 00:00:00	2025-03-07 00:00:00
29	1	172	1	13	2	2	1.464	0.0955	8.1	0.0074	0.6292	0.5429	0.01994966576	2025-03-07 00:00:00	2025-03-07 00:00:00
30	1	176	2	4	3	1	1.661	0.0955	23.4	0.018799999999999997	0.6177	0.635	0.0492689531	2025-03-14 00:00:00	2025-03-14 00:00:00
31	1	176	2	4	3	1	1.648	0.0955	23.5	0.0191	0.6177	0.63	0.04986981581	2025-03-14 00:00:00	2025-03-14 00:00:00
32	1	176	2	4	3	2	1.543	0.0955	24.8	0.0215	0.6232	0.5814	0.057030380340000006	2025-03-14 00:00:00	2025-03-14 00:00:00
33	1	176	2	4	3	2	1.562	0.0955	24.8	0.0212	0.6232	0.5886	0.05633666892	2025-03-14 00:00:00	2025-03-14 00:00:00
34	1	174	1	8	2	1	1.497	0.0955	3.8	0.0034000000000000002	0.7951	0.3067	0.01656346694	2025-03-14 00:00:00	2025-03-14 00:00:00
35	1	175	1	8	2	1	1.492	0.0955	4	0.0036	0.7698	0.3435	0.01557102694	2025-03-14 00:00:00	2025-03-14 00:00:00
36	1	173	1	13	2	1	1.417	0.0955	7.9	0.0075	0.6361	0.5156	0.02048361445	2025-03-14 00:00:00	2025-03-14 00:00:00
37	1	173	1	13	2	2	1.568	0.0955	7.8	0.0067	0.6361	0.5706	0.018276704749999997	2025-03-14 00:00:00	2025-03-14 00:00:00
38	1	177	2	4	3	1	1.339	0.0955	20.5	0.020499999999999997	0.6227	0.5052	0.05425226646	2025-03-21 00:00:00	2025-03-21 00:00:00
39	1	177	2	4	3	1	1.494	0.0955	21.1	0.0189	0.6227	0.5637	0.05004681683	2025-03-21 00:00:00	2025-03-21 00:00:00
40	1	177	2	4	3	2	1.356	0.0955	19.4	0.0191	0.6249	0.5086	0.05099485761999999	2025-03-21 00:00:00	2025-03-21 00:00:00
41	1	177	2	4	3	2	1.55	0.0955	22.5	0.0194	0.6249	0.5814	0.0517410411	2025-03-21 00:00:00	2025-03-21 00:00:00
42	1	176	1	8	2	1	1.464	0.0955	4.8	0.0044	0.7644	0.3449	0.018606139889999998	2025-03-21 00:00:00	2025-03-21 00:00:00
43	1	175	1	11	2	1	1.61	0.0955	6.8	0.005600000000000001	0.7073	0.4712	0.019292642710000002	2025-03-21 00:00:00	2025-03-21 00:00:00
44	1	174	1	13	2	1	1.344	0.0955	6.6	0.0066	0.6401	0.4837	0.018242914699999998	2025-03-21 00:00:00	2025-03-21 00:00:00
45	1	174	1	13	2	2	1.332	0.0955	6.5	0.006500000000000001	0.6401	0.4794	0.01812836732	2025-03-21 00:00:00	2025-03-21 00:00:00
46	1	178	2	4	3	1	1.436	0.0955	18.2	0.0169	0.6104999999999999	0.5593	0.043505172329999994	2025-03-28 00:00:00	2025-03-28 00:00:00
47	1	178	2	4	3	1	1.589	0.0955	21.8	0.0183	0.6104999999999999	0.6189	0.04709301997	2025-03-28 00:00:00	2025-03-28 00:00:00
48	1	178	2	4	3	2	1.484	0.0955	19.2	0.0173	0.6365	0.5394	0.04758765669	2025-03-28 00:00:00	2025-03-28 00:00:00
49	1	178	2	4	3	2	1.449	0.0955	20.5	0.0189	0.6365	0.5267	0.052037025960000004	2025-03-28 00:00:00	2025-03-28 00:00:00
50	1	177	1	8	2	1	1.477	0.0955	5.3	0.0048	0.7437999999999999	0.3784	0.018726113710000002	2025-03-28 00:00:00	2025-03-28 00:00:00
51	1	175	1	13	2	1	1.527	0.0955	7.5	0.0066	0.6404000000000001	0.5491	0.018261395	2025-03-28 00:00:00	2025-03-28 00:00:00
52	1	175	1	13	2	2	1.305	0.0955	6.9	0.0070999999999999995	0.6404000000000001	0.4693	0.01965849667	2025-03-28 00:00:00	2025-03-28 00:00:00
53	1	179	2	4	3	1	1.456	0.0955	19	0.0174	0.606	0.5737	0.04428201874	2025-04-03 00:00:00	2025-04-03 00:00:00
54	1	179	2	4	3	1	1.546	0.0955	21.6	0.0187	0.606	0.6091	0.047411036180000005	2025-04-03 00:00:00	2025-04-03 00:00:00
55	1	179	2	4	3	2	1.427	0.0955	20.3	0.019	0.6167	0.547	0.0496209018	2025-04-03 00:00:00	2025-04-03 00:00:00
56	1	179	2	4	3	2	1.337	0.0955	19.4	0.0194	0.6167	0.5125	0.05061309679	2025-04-03 00:00:00	2025-04-03 00:00:00
57	1	178	1	8	2	1	1.598	0.0955	4.5	0.0038	0.7733	0.3623	0.0166079346	2025-04-03 00:00:00	2025-04-03 00:00:00
58	1	177	1	11	2	1	1.356	0.0955	5.8	0.005699999999999999	0.7020000000000001	0.4041	0.01919037437	2025-04-03 00:00:00	2025-04-03 00:00:00
59	1	176	1	13	2	1	1.613	0.0955	8.6	0.0070999999999999995	0.6325	0.5928	0.019397159980000002	2025-04-03 00:00:00	2025-04-03 00:00:00
60	1	176	1	13	2	2	1.435	0.0955	6.9	0.0064	0.6325	0.5274	0.01749328024	2025-04-03 00:00:00	2025-04-03 00:00:00
61	1	180	2	4	3	1	1.4	0.0955	22.4	0.021400000000000002	0.6212	0.5303	0.05647307286	2025-04-10 00:00:00	2025-04-10 00:00:00
62	1	180	2	4	3	1	1.322	0.0955	19.4	0.0196	0.6212	0.5008	0.051795462060000005	2025-04-10 00:00:00	2025-04-10 00:00:00
63	1	180	2	4	3	2	1.437	0.0955	23	0.021400000000000002	0.6177	0.5494	0.0559755252	2025-04-10 00:00:00	2025-04-10 00:00:00
64	1	180	2	4	3	2	1.639	0.0955	26.5	0.0216	0.6177	0.6266	0.05654497672	2025-04-10 00:00:00	2025-04-10 00:00:00
65	1	179	1	8	2	1	1.346	0.0955	4.1	0.0040999999999999995	0.7895	0.2833	0.01934719923	2025-04-10 00:00:00	2025-04-10 00:00:00
66	1	177	1	13	2	1	1.429	0.0955	6.7	0.0063	0.6282	0.5313	0.01686027274	2025-04-10 00:00:00	2025-04-10 00:00:00
67	1	177	1	13	2	2	1.486	0.0955	6.2	0.005600000000000001	0.6282	0.5525	0.01500358012	2025-04-10 00:00:00	2025-04-10 00:00:00
68	1	181	2	4	3	1	1.473	0.0955	25.6	0.0232	0.6192	0.5609	0.06101992732	2025-04-16 00:00:00	2025-04-16 00:00:00
69	1	181	2	4	3	1	1.32	0.0955	22.6	0.0229	0.6192	0.5027	0.060113079320000005	2025-04-16 00:00:00	2025-04-16 00:00:00
70	1	181	2	4	3	2	1.446	0.0955	22.5	0.0208	0.6294	0.5359	0.05613583893	2025-04-16 00:00:00	2025-04-16 00:00:00
71	1	181	2	4	3	2	1.485	0.0955	23.7	0.0213	0.6294	0.5503	0.05757684781	2025-04-16 00:00:00	2025-04-16 00:00:00
72	1	180	1	8	2	1	1.335	0.0955	4.9	0.0049	0.7454999999999999	0.3398	0.01928228222	2025-04-16 00:00:00	2025-04-16 00:00:00
73	1	178	1	13	2	1	1.609	0.0955	7.1	0.0059	0.6748999999999999	0.5231	0.01814749738	2025-04-16 00:00:00	2025-04-16 00:00:00
74	1	178	1	13	2	2	1.381	0.0955	6.3	0.0060999999999999995	0.6748999999999999	0.449	0.01876123004	2025-04-16 00:00:00	2025-04-16 00:00:00
75	1	177	1	13	2	1	1.338	0.0955	7.6	0.0076	0.6282	0.4975	0.020425820009999998	2025-04-16 00:00:00	2025-04-16 00:00:00
76	1	182	2	4	3	1	1.485	0.0955	23.1	0.0208	0.6056	0.5857	0.05273270228	2025-04-25 00:00:00	2025-04-25 00:00:00
77	1	182	2	4	3	1	1.367	0.0955	22.3	0.0218	0.6056	0.5391	0.05530072812	2025-04-25 00:00:00	2025-04-25 00:00:00
78	1	182	2	4	3	2	1.447	0.0955	19.9	0.0184	0.5543	0.6449	0.041254689090000005	2025-04-25 00:00:00	2025-04-25 00:00:00
79	1	182	2	4	3	2	1.3	0.0955	16.1	0.0166	0.5543	0.5794	0.03715106747	2025-04-25 00:00:00	2025-04-25 00:00:00
80	1	181	1	8	2	1	1.34	0.0955	3.7	0.0037	0.7284999999999999	0.3638	0.0135974822	2025-04-25 00:00:00	2025-04-25 00:00:00
81	1	180	1	11	2	1	1.355	0.0955	5.8	0.005699999999999999	0.7121	0.3901	0.019878263389999998	2025-04-25 00:00:00	2025-04-25 00:00:00
82	1	179	1	13	2	1	1.332	0.0955	6.1	0.0060999999999999995	0.6377	0.4826	0.016900077	2025-04-25 00:00:00	2025-04-25 00:00:00
83	1	179	1	13	2	2	1.362	0.0955	6.9	0.0068000000000000005	0.6377	0.4935	0.01869541269	2025-04-25 00:00:00	2025-04-25 00:00:00
84	1	183	2	4	3	1	1.39	0.0955	22.5	0.0216	0.6553	0.4791	0.06278528091	2025-05-05 00:00:00	2025-05-05 00:00:00
85	1	183	2	4	3	1	1.388	0.0955	18.3	0.0176	0.6553	0.4784	0.05113894302	2025-05-05 00:00:00	2025-05-05 00:00:00
86	1	183	2	4	3	2	1.317	0.0955	19.4	0.0197	0.6431999999999999	0.4699	0.055197895069999996	2025-05-05 00:00:00	2025-05-05 00:00:00
87	1	183	2	4	3	2	1.319	0.0955	19.6	0.0199	0.6431999999999999	0.4706	0.0556823861	2025-05-05 00:00:00	2025-05-05 00:00:00
88	1	182	1	8	2	1	1.379	0.0955	5	0.0048	0.7545000000000001	0.3385	0.01974629628	2025-05-05 00:00:00	2025-05-05 00:00:00
89	1	181	1	11	2	1	1.415	0.0955	4.5	0.0043	0.7143	0.4043	0.01488254625	2025-05-05 00:00:00	2025-05-05 00:00:00
90	1	180	1	13	2	1	1.413	0.0955	7.8	0.0074	0.6446999999999999	0.502	0.020772493920000003	2025-05-05 00:00:00	2025-05-05 00:00:00
91	1	180	1	13	2	2	1.368	0.0955	6.1	0.006	0.6446999999999999	0.4861	0.016779535619999997	2025-05-05 00:00:00	2025-05-05 00:00:00
92	1	184	2	4	3	1	1.429	0.09803	23.5	0.0226	0.6173	0.5469	0.05897449213	2025-05-09 00:00:00	2025-05-09 00:00:00
93	1	184	2	4	3	1	1.37	0.09803	22.4	0.022400000000000003	0.6173	0.5243	0.05863487819	2025-05-09 00:00:00	2025-05-09 00:00:00
94	1	184	2	4	3	2	1.35	0.09803	21	0.0213	0.6058	0.5322	0.05415716782	2025-05-09 00:00:00	2025-05-09 00:00:00
95	1	184	2	4	3	2	1.37	0.09803	21.1	0.021099999999999997	0.6058	0.5401	0.053620678670000005	2025-05-09 00:00:00	2025-05-09 00:00:00
96	1	184	2	4	7	1	1.447	0.09803	15.3	0.014499999999999999	0.6437999999999999	0.5154	0.0407395308	2025-05-09 00:00:00	2025-05-09 00:00:00
97	1	183	1	8	2	1	1.342	0.09803	4	0.0040999999999999995	0.7576999999999999	0.3252	0.01688266876	2025-05-09 00:00:00	2025-05-09 00:00:00
98	1	181	1	13	2	1	1.392	0.09803	6	0.0059	0.6469	0.4915	0.01675333743	2025-05-09 00:00:00	2025-05-09 00:00:00
99	1	181	1	13	2	2	1.363	0.09803	6.3	0.0063	0.6469	0.4813	0.017965280990000002	2025-05-09 00:00:00	2025-05-09 00:00:00
100	1	185	2	4	3	1	1.363	0.09803	20.3	0.0204	0.6225	0.5145	0.05414648443	2025-05-16 00:00:00	2025-05-16 00:00:00
101	1	185	2	4	3	1	1.361	0.09803	20.8	0.021	0.6225	0.5138	0.05556167018	2025-05-16 00:00:00	2025-05-16 00:00:00
102	1	185	2	4	3	2	1.431	0.09803	19.3	0.018500000000000003	0.6204	0.5432	0.048761663129999994	2025-05-16 00:00:00	2025-05-16 00:00:00
103	1	185	2	4	3	2	1.377	0.09803	21.3	0.0212	0.6204	0.5227	0.05592506503	2025-05-16 00:00:00	2025-05-16 00:00:00
104	1	184	1	8	2	1	1.392	0.09803	4.5	0.0044	0.7484000000000001	0.3502	0.017633953049999998	2025-05-16 00:00:00	2025-05-16 00:00:00
105	1	182	1	13	2	1	1.442	0.09803	7.3	0.0069	0.6539	0.4991	0.020074421500000002	2025-05-16 00:00:00	2025-05-16 00:00:00
106	1	182	1	13	2	2	1.383	0.09803	6.2	0.0062	0.6539	0.4787	0.01777685575	2025-05-16 00:00:00	2025-05-16 00:00:00
107	1	178	1	13	2	3	1.329	0.09803	7.1	0.0073	0.6793	0.4262	0.022862380380000002	2025-05-16 00:00:00	2025-05-16 00:00:00
108	1	186	2	4	3	1	1.391	0.09803	21.7	0.021400000000000002	0.644	0.4952	0.060140861399999995	2025-05-23 00:00:00	2025-05-23 00:00:00
109	1	186	2	4	3	1	1.349	0.09803	21.6	0.022000000000000002	0.644	0.4802	0.06172752184	2025-05-23 00:00:00	2025-05-23 00:00:00
110	1	184	1	11	2	1	1.485	0.09803	5.9	0.0055000000000000005	0.6956	0.452	0.01791298442	2025-05-23 00:00:00	2025-05-23 00:00:00
111	1	183	1	13	2	1	1.302	0.09803	5.2	0.0055000000000000005	0.6464	0.4604	0.015501265019999998	2025-05-23 00:00:00	2025-05-23 00:00:00
112	1	183	1	13	2	2	1.354	0.09803	5.9	0.006	0.6464	0.4788	0.01691251245	2025-05-23 00:00:00	2025-05-23 00:00:00
113	1	184	1	10	2	1	1.359	0.09803	3.9	0.0039000000000000003	0.7253000000000001	0.3733	0.01433750324	2025-05-23 00:00:00	2025-05-23 00:00:00
114	1	187	2	4	3	1	1.337	0.09803	20.8	0.021400000000000002	0.6274000000000001	0.4982	0.05730283588	2025-05-30 00:00:00	2025-05-30 00:00:00
115	1	187	2	4	3	1	1.589	0.09803	25.5	0.022000000000000002	0.6274000000000001	0.5921	0.059109933530000006	2025-05-30 00:00:00	2025-05-30 00:00:00
116	1	187	2	4	3	2	1.574	0.09803	27.9	0.024300000000000002	0.6263000000000001	0.5882	0.06509736591	2025-05-30 00:00:00	2025-05-30 00:00:00
117	1	187	2	4	3	2	1.547	0.09803	24.8	0.022000000000000002	0.6263000000000001	0.5781	0.05887423914	2025-05-30 00:00:00	2025-05-30 00:00:00
118	1	186	1	8	2	1	1.639	0.09803	3.5	0.0029	0.7356999999999999	0.4332	0.011088657410000001	2025-05-30 00:00:00	2025-05-30 00:00:00
119	1	185	1	11	2	1	1.44	0.09803	5.8	0.0055000000000000005	0.7	0.432	0.01842600926	2025-05-30 00:00:00	2025-05-30 00:00:00
120	1	184	1	13	2	1	1.559	0.09803	9	0.0079	0.6329	0.5723	0.021582365750000002	2025-05-30 00:00:00	2025-05-30 00:00:00
121	1	184	1	13	2	2	1.348	0.09803	7.7	0.0078000000000000005	0.6329	0.4949	0.02135519231	2025-05-30 00:00:00	2025-05-30 00:00:00
122	1	188	2	4	3	1	1.62	0.09803	20.7	0.0175	0.62	0.6156	0.04614862573	2025-06-09 00:00:00	2025-06-09 00:00:00
123	1	188	2	4	3	1	1.38	0.09803	21.5	0.021400000000000002	0.62	0.5244	0.05626817315	2025-06-09 00:00:00	2025-06-09 00:00:00
124	1	188	2	4	3	2	1.325	0.09803	24.2	0.025099999999999997	0.6132	0.5125	0.06480373846	2025-06-09 00:00:00	2025-06-09 00:00:00
125	1	188	2	4	3	2	1.313	0.09803	23.5	0.0246	0.6132	0.5079	0.06350438421	2025-06-09 00:00:00	2025-06-09 00:00:00
126	1	185	1	13	2	1	1.357	0.09803	7.2	0.0073	0.6244	0.5097	0.01938715594	2025-06-09 00:00:00	2025-06-09 00:00:00
127	1	185	1	13	2	2	1.408	0.09803	7.1	0.0069	0.6244	0.5288	0.0184254095	2025-06-09 00:00:00	2025-06-09 00:00:00
128	1	189	2	4	3	1	1.327	0.09803	22.9	0.023700000000000002	0.5911	0.5426	0.057920791400000005	2025-06-13 00:00:00	2025-06-13 00:00:00
129	1	189	2	4	3	1	1.344	0.09803	24.1	0.0246	0.5911	0.5496	0.060184921950000005	2025-06-13 00:00:00	2025-06-13 00:00:00
130	1	189	2	4	3	2	1.438	0.09803	22.2	0.0212	0.6299	0.5322	0.05724822709	2025-06-13 00:00:00	2025-06-13 00:00:00
131	1	189	2	4	3	2	1.318	0.09803	21.5	0.022400000000000003	0.6299	0.4878	0.06049103326	2025-06-13 00:00:00	2025-06-13 00:00:00
132	1	188	1	8	2	1	1.409	0.09803	4.2	0.0040999999999999995	0.7515000000000001	0.3501	0.01646261958	2025-06-13 00:00:00	2025-06-13 00:00:00
133	1	187	1	11	2	1	1.392	0.09803	4.8	0.004699999999999999	0.7273000000000001	0.3796	0.0173541722	2025-06-13 00:00:00	2025-06-13 00:00:00
134	1	186	1	13	2	1	1.327	0.09803	6.5	0.0067	0.6548	0.4581	0.01947415781	2025-06-13 00:00:00	2025-06-13 00:00:00
135	1	186	1	13	2	2	1.466	0.09803	6.7	0.0063	0.6548	0.5061	0.01817009022	2025-06-13 00:00:00	2025-06-13 00:00:00
136	1	191	2	4	3	1	1.401	0.09803	22.5	0.022000000000000002	0.6466	0.4951	0.06236843923	2025-06-27 00:00:00	2025-06-27 00:00:00
137	1	191	2	4	3	1	1.401	0.09803	22.4	0.0219	0.6466	0.4951	0.062091246169999996	2025-06-27 00:00:00	2025-06-27 00:00:00
138	1	190	1	8	2	1	1.31	0.09803	4.6	0.0048	0.7389	0.342	0.01845723758	2025-06-27 00:00:00	2025-06-27 00:00:00
139	1	189	1	11	2	1	1.454	0.09803	5.2	0.0049	0.71	0.4217	0.01692497273	2025-06-27 00:00:00	2025-06-27 00:00:00
140	1	188	1	13	2	1	1.434	0.09803	7	0.0067	0.6355	0.5227	0.01837969898	2025-06-27 00:00:00	2025-06-27 00:00:00
141	1	188	1	13	2	2	1.314	0.09803	6.3	0.0066	0.6355	0.479	0.01805238927	2025-06-27 00:00:00	2025-06-27 00:00:00
142	1	192	2	4	3	1	1.317	0.09803	19.9	0.020499999999999997	0.6073	0.5172	0.05214465437	2025-07-04 00:00:00	2025-07-04 00:00:00
143	1	192	2	4	3	1	1.404	0.09803	21.53	0.0208	0.6073	0.5514	0.05291994861	2025-07-04 00:00:00	2025-07-04 00:00:00
144	1	192	2	4	3	2	1.408	0.09803	23.3	0.022400000000000003	0.5355	0.654	0.04828040904	2025-07-04 00:00:00	2025-07-04 00:00:00
145	1	192	2	4	3	2	1.316	0.09803	22.5	0.0232	0.5355	0.6113	0.049882051159999996	2025-07-04 00:00:00	2025-07-04 00:00:00
146	1	191	1	8	2	1	1.327	0.09803	3.8	0.0039000000000000003	0.7509	0.3306	0.01557909907	2025-07-04 00:00:00	2025-07-04 00:00:00
147	1	190	1	11	2	1	1.486	0.09803	5.4	0.0049	0.7238	0.4104	0.01783013655	2025-07-04 00:00:00	2025-07-04 00:00:00
148	1	189	1	13	2	1	1.402	0.09803	6.5	0.0063	0.6592	0.4778	0.01843610402	2025-07-04 00:00:00	2025-07-04 00:00:00
149	1	189	1	13	2	2	1.346	0.09803	6.1	0.0060999999999999995	0.6592	0.4587	0.01802140231	2025-07-04 00:00:00	2025-07-04 00:00:00
150	1	193	2	4	3	1	1.379	0.09803	22.8	0.0227	0.5905	0.5647	0.05541198565	2025-07-11 00:00:00	2025-07-11 00:00:00
151	1	193	2	4	3	1	1.303	0.09803	21.1	0.0222	0.5905	0.5336	0.05427141836	2025-07-11 00:00:00	2025-07-11 00:00:00
152	1	193	2	4	3	2	1.354	0.09803	21	0.0213	0.6056	0.534	0.053969794249999994	2025-07-11 00:00:00	2025-07-11 00:00:00
153	1	193	2	4	3	2	1.302	0.09803	19.4	0.0204	0.6056	0.5135	0.05184905887	2025-07-11 00:00:00	2025-07-11 00:00:00
154	1	192	1	8	2	1	1.338	0.09803	4	0.0040999999999999995	0.7722	0.3048	0.01801097388	2025-07-11 00:00:00	2025-07-11 00:00:00
155	1	191	1	11	2	1	1.32	0.09803	4.1	0.0043	0.7283	0.3586	0.01568943576	2025-07-11 00:00:00	2025-07-11 00:00:00
156	1	190	1	13	2	1	1.326	0.09803	7.3	0.0076	0.6408	0.4763	0.02103439603	2025-07-11 00:00:00	2025-07-11 00:00:00
157	1	190	1	13	2	2	1.394	0.09803	6.7	0.0066	0.6408	0.5007	0.01836380782	2025-07-11 00:00:00	2025-07-11 00:00:00
158	1	194	2	4	3	1	1.375	0.09803	23	0.023	0.6024	0.5467	0.057738540330000004	2025-07-18 00:00:00	2025-07-18 00:00:00
159	1	194	2	4	3	1	1.326	0.09803	21.5	0.0223	0.6024	0.5272	0.05596746012	2025-07-18 00:00:00	2025-07-18 00:00:00
160	1	194	2	4	3	2	1.389	0.09803	22.9	0.0226	0.6096	0.5423	0.057957609699999996	2025-07-18 00:00:00	2025-07-18 00:00:00
161	1	194	2	4	3	2	1.38	0.09803	22.5	0.022400000000000003	0.6096	0.5388	0.057316631769999994	2025-07-18 00:00:00	2025-07-18 00:00:00
162	1	193	1	8	2	1	1.346	0.09803	5.5	0.005600000000000001	0.7082999999999999	0.3926	0.019225083679999998	2025-07-18 00:00:00	2025-07-18 00:00:00
163	1	192	1	11	2	1	1.386	0.09803	4.9	0.0049	0.7526999999999999	0.3428	0.01961985402	2025-07-18 00:00:00	2025-07-18 00:00:00
164	1	191	1	13	2	1	1.372	0.09803	5.8	0.0058	0.6629999999999999	0.4624	0.01721595107	2025-07-18 00:00:00	2025-07-18 00:00:00
165	1	191	1	13	2	2	1.355	0.09803	5.4	0.0055000000000000005	0.6629999999999999	0.4566	0.01622974148	2025-07-18 00:00:00	2025-07-18 00:00:00
166	1	190	2	4	3	1	1.457	0.09803	22.8	0.0215	0.6441	0.5185	0.060344034850000006	2025-07-20 00:00:00	2025-07-20 00:00:00
167	1	190	2	4	3	1	1.494	0.09803	24.6	0.0226	0.6441	0.5317	0.06349558955	2025-07-20 00:00:00	2025-07-20 00:00:00
168	1	190	2	4	3	2	1.384	0.09803	20.7	0.020499999999999997	0.6281	0.5147	0.05519441254	2025-07-20 00:00:00	2025-07-20 00:00:00
169	1	190	2	4	3	2	1.394	0.09803	22.3	0.022000000000000002	0.6281	0.5184	0.05903410036	2025-07-20 00:00:00	2025-07-20 00:00:00
170	1	189	1	8	2	1	1.314	0.09803	4.8	0.005	0.7737999999999999	0.2972	0.022163600319999997	2025-07-20 00:00:00	2025-07-20 00:00:00
171	1	188	1	11	2	1	1.42	0.09803	4.7	0.0045000000000000005	0.7206	0.3967	0.01625811346	2025-07-20 00:00:00	2025-07-20 00:00:00
172	1	187	1	13	2	1	1.436	0.09803	8.7	0.0083	0.6232	0.5411	0.0220668812	2025-07-20 00:00:00	2025-07-20 00:00:00
173	1	187	1	13	2	2	1.369	0.09803	7.7	0.0077	0.6232	0.5158	0.02048629495	2025-07-20 00:00:00	2025-07-20 00:00:00
174	1	195	2	4	3	1	1.378	0.09803	25.7	0.0256	0.6328	0.506	0.06970569657999999	2025-07-25 00:00:00	2025-07-25 00:00:00
175	1	195	2	4	3	2	1.38	0.09803	22.4	0.0223	0.653	0.4789	0.06419873866999999	2025-07-25 00:00:00	2025-07-25 00:00:00
176	1	195	2	4	3	2	1.392	0.09803	23.5	0.0232	0.653	0.483	0.06677074017	2025-07-25 00:00:00	2025-07-25 00:00:00
177	1	194	1	8	2	1	1.41	0.09803	3.8	0.0037	0.7795000000000001	0.3109	0.01677424294	2025-07-25 00:00:00	2025-07-25 00:00:00
178	1	193	1	11	2	1	1.35	0.09803	5.5	0.005600000000000001	0.7099	0.3916	0.01927383916	2025-07-25 00:00:00	2025-07-25 00:00:00
179	1	192	1	13	2	1	1.383	0.09803	7	0.0069	0.6376	0.5012	0.01916790769	2025-07-25 00:00:00	2025-07-25 00:00:00
180	1	192	1	13	2	2	1.344	0.09803	6.5	0.0066	0.6376	0.4871	0.01831525363	2025-07-25 00:00:00	2025-07-25 00:00:00
181	1	196	2	4	3	1	1.324	0.09803	21.3	0.022099999999999998	0.615	0.5097	0.05734795386	2025-08-01 00:00:00	2025-08-01 00:00:00
182	1	196	2	4	3	1	1.337	0.09803	21.8	0.022400000000000003	0.615	0.5147	0.05812345142	2025-08-01 00:00:00	2025-08-01 00:00:00
183	1	196	2	4	3	2	1.336	0.09803	23.3	0.0239	0.6023	0.5313	0.06018398079	2025-08-01 00:00:00	2025-08-01 00:00:00
184	1	196	2	4	3	2	1.316	0.09803	21.4	0.0223	0.6023	0.5234	0.05611633916	2025-08-01 00:00:00	2025-08-01 00:00:00
185	1	195	1	8	2	1	1.386	0.09803	5.1	0.0051	0.7338	0.369	0.01897081256	2025-08-01 00:00:00	2025-08-01 00:00:00
186	1	194	1	11	2	1	1.422	0.09803	5	0.0048	0.7069	0.4168	0.01646423771	2025-08-01 00:00:00	2025-08-01 00:00:00
187	1	193	1	13	2	1	1.352	0.09803	6.8	0.0069	0.6467	0.4777	0.01953779831	2025-08-01 00:00:00	2025-08-01 00:00:00
188	1	193	1	13	2	2	1.333	0.09803	6.8	0.006999999999999999	0.6467	0.4709	0.01981628155	2025-08-01 00:00:00	2025-08-01 00:00:00
189	1	197	2	4	3	1	1.35	0.09803	22.6	0.023	0.5877	0.5566	0.05572478149	2025-08-08 00:00:00	2025-08-08 00:00:00
190	1	197	2	4	3	1	1.391	0.09803	25.6	0.0253	0.5877	0.5735	0.06126134659	2025-08-08 00:00:00	2025-08-08 00:00:00
191	1	196	1	8	2	1	1.391	\N	4.6	0.0045000000000000005	0.7606999999999999	0.3329	0.01896596922	2025-08-08 00:00:00	2025-08-08 00:00:00
192	1	196	1	7	2	1	1.336	\N	7.2	0.0074	0.6470999999999999	0.4715	0.02095855894	2025-08-08 00:00:00	2025-08-08 00:00:00
193	1	195	1	11	2	1	1.377	\N	5.3	0.0053	0.7151000000000001	0.3923	0.01854114364	2025-08-08 00:00:00	2025-08-08 00:00:00
194	1	194	1	13	2	1	1.385	\N	6.7	0.0066	0.6383	0.501	0.01835538757	2025-08-08 00:00:00	2025-08-08 00:00:00
195	1	194	1	13	2	1	1.308	\N	6.2	0.006500000000000001	0.6386	0.4727	0.01800042817	2025-08-08 00:00:00	2025-08-08 00:00:00
196	1	190	1	13	2	6	1.34	\N	7.1	0.0073	0.6566	0.4602	0.021175822979999998	2025-08-08 00:00:00	2025-08-08 00:00:00
197	1	198	2	4	3	1	1.31	\N	21.5	0.0225	0.557	0.5803	0.05084526046	2025-08-15 00:00:00	2025-08-15 00:00:00
198	1	198	2	4	3	1	1.342	\N	22.7	0.0232	0.557	0.5945	0.052403060689999996	2025-08-15 00:00:00	2025-08-15 00:00:00
199	1	198	2	4	3	2	1.372	\N	22	0.022000000000000002	0.5926	0.559	0.054017512749999996	2025-08-15 00:00:00	2025-08-15 00:00:00
200	1	198	2	4	3	2	1.346	\N	21.1	0.0215	0.5926	0.5484	0.0528084486	2025-08-15 00:00:00	2025-08-15 00:00:00
201	1	197	1	8	2	1	1.39	\N	4.5	0.0044	0.7440000000000001	0.3558	0.01735580598	2025-08-15 00:00:00	2025-08-15 00:00:00
202	1	196	1	11	2	1	1.394	\N	5.5	0.0054	0.7049	0.4114	0.01834922578	2025-08-15 00:00:00	2025-08-15 00:00:00
203	1	195	1	13	2	1	1.318	\N	6	0.0062	0.6437999999999999	0.4695	0.01753997473	2025-08-15 00:00:00	2025-08-15 00:00:00
204	1	195	1	13	2	2	1.38	\N	6.5	0.006500000000000001	0.6437999999999999	0.4916	0.01814794245	2025-08-15 00:00:00	2025-08-15 00:00:00
205	1	199	2	4	3	1	1.464	\N	25.1	0.0235	0.5888	0.602	0.05722246696	2025-08-25 00:00:00	2025-08-25 00:00:00
206	1	199	2	4	3	1	1.346	\N	23.8	0.024300000000000002	0.5888	0.5535	0.05901546447	2025-08-25 00:00:00	2025-08-25 00:00:00
207	1	199	2	4	3	2	1.464	\N	22.1	0.0207	0.5761	0.6206	0.04887365499	2025-08-25 00:00:00	2025-08-25 00:00:00
208	1	199	2	4	3	2	1.337	\N	19.5	0.02	0.5761	0.5668	0.047220091670000006	2025-08-25 00:00:00	2025-08-25 00:00:00
209	1	198	1	8	2	1	1.5	\N	5.3	0.0048	0.7437	0.3845	0.01892008324	2025-08-25 00:00:00	2025-08-25 00:00:00
210	1	197	1	11	2	1	1.381	\N	5.1	0.0051	0.7212000000000001	0.385	0.01817903251	2025-08-25 00:00:00	2025-08-25 00:00:00
211	1	196	1	13	2	1	1.309	\N	6.1	0.0064	0.6616	0.443	0.0188993502	2025-08-25 00:00:00	2025-08-25 00:00:00
212	1	196	1	13	2	2	1.558	\N	7.1	0.0063	0.6616	0.5272	0.01848194099	2025-08-25 00:00:00	2025-08-25 00:00:00
213	1	200	2	4	3	1	1.345	\N	18.6	0.019	0.5159	0.6511	0.03920510448	2025-09-01 00:00:00	2025-09-01 00:00:00
214	1	200	2	4	3	1	1.318	\N	17.5	0.0182	0.5159	0.638	0.037642165	2025-09-01 00:00:00	2025-09-01 00:00:00
215	1	197	1	13	2	1	1.312	\N	5.7	0.006	0.6689	0.4344	0.01800814082	2025-09-01 00:00:00	2025-09-01 00:00:00
216	1	197	1	13	2	2	1.384	\N	6.3	0.0062	0.6689	0.4582	0.01886828019	2025-09-01 00:00:00	2025-09-01 00:00:00
217	1	199	1	8	2	1	1.35	\N	3.5	0.0036	0.7795000000000001	0.2977	0.01613662551	2025-09-01 00:00:00	2025-09-01 00:00:00
218	1	198	1	11	2	1	1.385	\N	5.1	0.0051	0.7232999999999999	0.3832	0.01826410023	2025-09-01 00:00:00	2025-09-01 00:00:00
219	9	204	2	8	15	1	324	21	31	2.813	34	213.84	4.262	2026-01-11 00:06:51.462697	2026-01-11 00:06:51.462697
220	9	188	1	1	7	1	432	32	32	3.319	\N	\N	\N	2026-01-11 00:32:23.06494	2026-01-11 00:32:23.06494
221	9	204	2	8	15	2	32	32	23	32.2	33	21.44	48.06	2026-01-11 00:33:46.492215	2026-01-11 00:33:46.492215
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: funglusapp
--

COPY public.users (id, email, hashed_password, full_name, role, is_active, created_at, allowed_modules) FROM stdin;
7	admin@funglus.com	$2b$12$6B8e8SqzT4armkZXic7ULekS9GNj9nku2WJXftpChnqFD3CPatm8u	Felipe	admin	t	2026-01-10 17:42:52.598401	["laboratorio", "informes", "siembra", "incubacion"]
8	1017felip@gmail.com	$2b$12$CR48q7RuzE5WBy3fRpa23OmEVQLmwCkSII2zPe.rqwiU/lijlC0wi	Felipe Ruiz	admin	f	2026-01-10 17:46:05.799399	[]
9	felipe.ruiz1@udea.edu.co	$2b$12$0ytyYsBev0VeOkTjZP/nau8XePdxkAGkvx03iuRgGFg/zl19cHdHC	GERENTE	viewer	t	2026-01-11 01:19:19.082183	["informes"]
\.


--
-- Name: catalogo_ciclos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: funglusapp
--

SELECT pg_catalog.setval('public.catalogo_ciclos_id_seq', 204, true);


--
-- Name: catalogo_etapas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: funglusapp
--

SELECT pg_catalog.setval('public.catalogo_etapas_id_seq', 3, true);


--
-- Name: catalogo_muestras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: funglusapp
--

SELECT pg_catalog.setval('public.catalogo_muestras_id_seq', 14, true);


--
-- Name: catalogo_origenes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: funglusapp
--

SELECT pg_catalog.setval('public.catalogo_origenes_id_seq', 15, true);


--
-- Name: catalogo_secuencias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: funglusapp
--

SELECT pg_catalog.setval('public.catalogo_secuencias_id_seq', 11, true);


--
-- Name: ciclos_procesamiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: funglusapp
--

SELECT pg_catalog.setval('public.ciclos_procesamiento_id_seq', 10, true);


--
-- Name: datos_generales_laboratorio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: funglusapp
--

SELECT pg_catalog.setval('public.datos_generales_laboratorio_id_seq', 1383, true);


--
-- Name: notas_informe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: funglusapp
--

SELECT pg_catalog.setval('public.notas_informe_id_seq', 6, true);


--
-- Name: registros_analisis_cenizas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: funglusapp
--

SELECT pg_catalog.setval('public.registros_analisis_cenizas_id_seq', 905, true);


--
-- Name: registros_analisis_nitrogeno_id_seq; Type: SEQUENCE SET; Schema: public; Owner: funglusapp
--

SELECT pg_catalog.setval('public.registros_analisis_nitrogeno_id_seq', 221, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: funglusapp
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: ciclos_procesamiento _ciclo_proc_ident_fecha_tipo_uc; Type: CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.ciclos_procesamiento
    ADD CONSTRAINT _ciclo_proc_ident_fecha_tipo_uc UNIQUE (identificador_lote, fecha_hora_lote, tipo_analisis);


--
-- Name: datos_generales_laboratorio _datos_laboratorio_claves_uc; Type: CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.datos_generales_laboratorio
    ADD CONSTRAINT _datos_laboratorio_claves_uc UNIQUE (ciclo_id, etapa_id, muestra_id, origen_id, secuencia_id);


--
-- Name: registros_analisis_cenizas _registro_cenizas_lote_catalogo_uc; Type: CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_cenizas
    ADD CONSTRAINT _registro_cenizas_lote_catalogo_uc UNIQUE (ciclo_procesamiento_id, ciclo_catalogo_id, etapa_catalogo_id, muestra_catalogo_id, origen_catalogo_id, secuencia_catalogo_id);


--
-- Name: catalogo_ciclos catalogo_ciclos_pkey; Type: CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.catalogo_ciclos
    ADD CONSTRAINT catalogo_ciclos_pkey PRIMARY KEY (id);


--
-- Name: catalogo_etapas catalogo_etapas_pkey; Type: CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.catalogo_etapas
    ADD CONSTRAINT catalogo_etapas_pkey PRIMARY KEY (id);


--
-- Name: catalogo_muestras catalogo_muestras_pkey; Type: CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.catalogo_muestras
    ADD CONSTRAINT catalogo_muestras_pkey PRIMARY KEY (id);


--
-- Name: catalogo_origenes catalogo_origenes_pkey; Type: CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.catalogo_origenes
    ADD CONSTRAINT catalogo_origenes_pkey PRIMARY KEY (id);


--
-- Name: catalogo_secuencias catalogo_secuencias_pkey; Type: CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.catalogo_secuencias
    ADD CONSTRAINT catalogo_secuencias_pkey PRIMARY KEY (id);


--
-- Name: ciclos_procesamiento ciclos_procesamiento_pkey; Type: CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.ciclos_procesamiento
    ADD CONSTRAINT ciclos_procesamiento_pkey PRIMARY KEY (id);


--
-- Name: datos_generales_laboratorio datos_generales_laboratorio_pkey; Type: CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.datos_generales_laboratorio
    ADD CONSTRAINT datos_generales_laboratorio_pkey PRIMARY KEY (id);


--
-- Name: notas_informe notas_informe_pkey; Type: CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.notas_informe
    ADD CONSTRAINT notas_informe_pkey PRIMARY KEY (id);


--
-- Name: registros_analisis_cenizas registros_analisis_cenizas_pkey; Type: CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_cenizas
    ADD CONSTRAINT registros_analisis_cenizas_pkey PRIMARY KEY (id);


--
-- Name: registros_analisis_nitrogeno registros_analisis_nitrogeno_pkey; Type: CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_nitrogeno
    ADD CONSTRAINT registros_analisis_nitrogeno_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_catalogo_ciclos_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_catalogo_ciclos_id ON public.catalogo_ciclos USING btree (id);


--
-- Name: ix_catalogo_ciclos_nombre_ciclo; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE UNIQUE INDEX ix_catalogo_ciclos_nombre_ciclo ON public.catalogo_ciclos USING btree (nombre_ciclo);


--
-- Name: ix_catalogo_etapas_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_catalogo_etapas_id ON public.catalogo_etapas USING btree (id);


--
-- Name: ix_catalogo_etapas_nombre; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE UNIQUE INDEX ix_catalogo_etapas_nombre ON public.catalogo_etapas USING btree (nombre);


--
-- Name: ix_catalogo_muestras_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_catalogo_muestras_id ON public.catalogo_muestras USING btree (id);


--
-- Name: ix_catalogo_muestras_nombre; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE UNIQUE INDEX ix_catalogo_muestras_nombre ON public.catalogo_muestras USING btree (nombre);


--
-- Name: ix_catalogo_origenes_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_catalogo_origenes_id ON public.catalogo_origenes USING btree (id);


--
-- Name: ix_catalogo_origenes_nombre; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE UNIQUE INDEX ix_catalogo_origenes_nombre ON public.catalogo_origenes USING btree (nombre);


--
-- Name: ix_catalogo_secuencias_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_catalogo_secuencias_id ON public.catalogo_secuencias USING btree (id);


--
-- Name: ix_catalogo_secuencias_nombre; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE UNIQUE INDEX ix_catalogo_secuencias_nombre ON public.catalogo_secuencias USING btree (nombre);


--
-- Name: ix_ciclos_procesamiento_fecha_hora_lote; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_ciclos_procesamiento_fecha_hora_lote ON public.ciclos_procesamiento USING btree (fecha_hora_lote);


--
-- Name: ix_ciclos_procesamiento_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_ciclos_procesamiento_id ON public.ciclos_procesamiento USING btree (id);


--
-- Name: ix_ciclos_procesamiento_identificador_lote; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_ciclos_procesamiento_identificador_lote ON public.ciclos_procesamiento USING btree (identificador_lote);


--
-- Name: ix_ciclos_procesamiento_tipo_analisis; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_ciclos_procesamiento_tipo_analisis ON public.ciclos_procesamiento USING btree (tipo_analisis);


--
-- Name: ix_datos_generales_laboratorio_ciclo_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_datos_generales_laboratorio_ciclo_id ON public.datos_generales_laboratorio USING btree (ciclo_id);


--
-- Name: ix_datos_generales_laboratorio_etapa_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_datos_generales_laboratorio_etapa_id ON public.datos_generales_laboratorio USING btree (etapa_id);


--
-- Name: ix_datos_generales_laboratorio_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_datos_generales_laboratorio_id ON public.datos_generales_laboratorio USING btree (id);


--
-- Name: ix_datos_generales_laboratorio_muestra_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_datos_generales_laboratorio_muestra_id ON public.datos_generales_laboratorio USING btree (muestra_id);


--
-- Name: ix_datos_generales_laboratorio_origen_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_datos_generales_laboratorio_origen_id ON public.datos_generales_laboratorio USING btree (origen_id);


--
-- Name: ix_datos_generales_laboratorio_secuencia_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_datos_generales_laboratorio_secuencia_id ON public.datos_generales_laboratorio USING btree (secuencia_id);


--
-- Name: ix_notas_informe_ciclo_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_notas_informe_ciclo_id ON public.notas_informe USING btree (ciclo_id);


--
-- Name: ix_notas_informe_etapa_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_notas_informe_etapa_id ON public.notas_informe USING btree (etapa_id);


--
-- Name: ix_notas_informe_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_notas_informe_id ON public.notas_informe USING btree (id);


--
-- Name: ix_notas_informe_muestra_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_notas_informe_muestra_id ON public.notas_informe USING btree (muestra_id);


--
-- Name: ix_notas_informe_origen_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_notas_informe_origen_id ON public.notas_informe USING btree (origen_id);


--
-- Name: ix_notas_informe_secuencia_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_notas_informe_secuencia_id ON public.notas_informe USING btree (secuencia_id);


--
-- Name: ix_notas_informe_usuario_email; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_notas_informe_usuario_email ON public.notas_informe USING btree (usuario_email);


--
-- Name: ix_registros_analisis_cenizas_ciclo_catalogo_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_registros_analisis_cenizas_ciclo_catalogo_id ON public.registros_analisis_cenizas USING btree (ciclo_catalogo_id);


--
-- Name: ix_registros_analisis_cenizas_ciclo_procesamiento_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_registros_analisis_cenizas_ciclo_procesamiento_id ON public.registros_analisis_cenizas USING btree (ciclo_procesamiento_id);


--
-- Name: ix_registros_analisis_cenizas_etapa_catalogo_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_registros_analisis_cenizas_etapa_catalogo_id ON public.registros_analisis_cenizas USING btree (etapa_catalogo_id);


--
-- Name: ix_registros_analisis_cenizas_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_registros_analisis_cenizas_id ON public.registros_analisis_cenizas USING btree (id);


--
-- Name: ix_registros_analisis_cenizas_muestra_catalogo_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_registros_analisis_cenizas_muestra_catalogo_id ON public.registros_analisis_cenizas USING btree (muestra_catalogo_id);


--
-- Name: ix_registros_analisis_cenizas_origen_catalogo_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_registros_analisis_cenizas_origen_catalogo_id ON public.registros_analisis_cenizas USING btree (origen_catalogo_id);


--
-- Name: ix_registros_analisis_cenizas_secuencia_catalogo_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_registros_analisis_cenizas_secuencia_catalogo_id ON public.registros_analisis_cenizas USING btree (secuencia_catalogo_id);


--
-- Name: ix_registros_analisis_nitrogeno_ciclo_catalogo_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_registros_analisis_nitrogeno_ciclo_catalogo_id ON public.registros_analisis_nitrogeno USING btree (ciclo_catalogo_id);


--
-- Name: ix_registros_analisis_nitrogeno_ciclo_procesamiento_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_registros_analisis_nitrogeno_ciclo_procesamiento_id ON public.registros_analisis_nitrogeno USING btree (ciclo_procesamiento_id);


--
-- Name: ix_registros_analisis_nitrogeno_etapa_catalogo_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_registros_analisis_nitrogeno_etapa_catalogo_id ON public.registros_analisis_nitrogeno USING btree (etapa_catalogo_id);


--
-- Name: ix_registros_analisis_nitrogeno_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_registros_analisis_nitrogeno_id ON public.registros_analisis_nitrogeno USING btree (id);


--
-- Name: ix_registros_analisis_nitrogeno_muestra_catalogo_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_registros_analisis_nitrogeno_muestra_catalogo_id ON public.registros_analisis_nitrogeno USING btree (muestra_catalogo_id);


--
-- Name: ix_registros_analisis_nitrogeno_origen_catalogo_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_registros_analisis_nitrogeno_origen_catalogo_id ON public.registros_analisis_nitrogeno USING btree (origen_catalogo_id);


--
-- Name: ix_registros_analisis_nitrogeno_secuencia_catalogo_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_registros_analisis_nitrogeno_secuencia_catalogo_id ON public.registros_analisis_nitrogeno USING btree (secuencia_catalogo_id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: funglusapp
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: datos_generales_laboratorio datos_generales_laboratorio_ciclo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.datos_generales_laboratorio
    ADD CONSTRAINT datos_generales_laboratorio_ciclo_id_fkey FOREIGN KEY (ciclo_id) REFERENCES public.catalogo_ciclos(id);


--
-- Name: datos_generales_laboratorio datos_generales_laboratorio_etapa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.datos_generales_laboratorio
    ADD CONSTRAINT datos_generales_laboratorio_etapa_id_fkey FOREIGN KEY (etapa_id) REFERENCES public.catalogo_etapas(id);


--
-- Name: datos_generales_laboratorio datos_generales_laboratorio_muestra_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.datos_generales_laboratorio
    ADD CONSTRAINT datos_generales_laboratorio_muestra_id_fkey FOREIGN KEY (muestra_id) REFERENCES public.catalogo_muestras(id);


--
-- Name: datos_generales_laboratorio datos_generales_laboratorio_origen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.datos_generales_laboratorio
    ADD CONSTRAINT datos_generales_laboratorio_origen_id_fkey FOREIGN KEY (origen_id) REFERENCES public.catalogo_origenes(id);


--
-- Name: datos_generales_laboratorio datos_generales_laboratorio_secuencia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.datos_generales_laboratorio
    ADD CONSTRAINT datos_generales_laboratorio_secuencia_id_fkey FOREIGN KEY (secuencia_id) REFERENCES public.catalogo_secuencias(id);


--
-- Name: notas_informe notas_informe_ciclo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.notas_informe
    ADD CONSTRAINT notas_informe_ciclo_id_fkey FOREIGN KEY (ciclo_id) REFERENCES public.catalogo_ciclos(id);


--
-- Name: notas_informe notas_informe_etapa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.notas_informe
    ADD CONSTRAINT notas_informe_etapa_id_fkey FOREIGN KEY (etapa_id) REFERENCES public.catalogo_etapas(id);


--
-- Name: notas_informe notas_informe_muestra_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.notas_informe
    ADD CONSTRAINT notas_informe_muestra_id_fkey FOREIGN KEY (muestra_id) REFERENCES public.catalogo_muestras(id);


--
-- Name: notas_informe notas_informe_origen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.notas_informe
    ADD CONSTRAINT notas_informe_origen_id_fkey FOREIGN KEY (origen_id) REFERENCES public.catalogo_origenes(id);


--
-- Name: notas_informe notas_informe_secuencia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.notas_informe
    ADD CONSTRAINT notas_informe_secuencia_id_fkey FOREIGN KEY (secuencia_id) REFERENCES public.catalogo_secuencias(id);


--
-- Name: registros_analisis_cenizas registros_analisis_cenizas_ciclo_catalogo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_cenizas
    ADD CONSTRAINT registros_analisis_cenizas_ciclo_catalogo_id_fkey FOREIGN KEY (ciclo_catalogo_id) REFERENCES public.catalogo_ciclos(id);


--
-- Name: registros_analisis_cenizas registros_analisis_cenizas_ciclo_procesamiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_cenizas
    ADD CONSTRAINT registros_analisis_cenizas_ciclo_procesamiento_id_fkey FOREIGN KEY (ciclo_procesamiento_id) REFERENCES public.ciclos_procesamiento(id);


--
-- Name: registros_analisis_cenizas registros_analisis_cenizas_etapa_catalogo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_cenizas
    ADD CONSTRAINT registros_analisis_cenizas_etapa_catalogo_id_fkey FOREIGN KEY (etapa_catalogo_id) REFERENCES public.catalogo_etapas(id);


--
-- Name: registros_analisis_cenizas registros_analisis_cenizas_muestra_catalogo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_cenizas
    ADD CONSTRAINT registros_analisis_cenizas_muestra_catalogo_id_fkey FOREIGN KEY (muestra_catalogo_id) REFERENCES public.catalogo_muestras(id);


--
-- Name: registros_analisis_cenizas registros_analisis_cenizas_origen_catalogo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_cenizas
    ADD CONSTRAINT registros_analisis_cenizas_origen_catalogo_id_fkey FOREIGN KEY (origen_catalogo_id) REFERENCES public.catalogo_origenes(id);


--
-- Name: registros_analisis_cenizas registros_analisis_cenizas_secuencia_catalogo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_cenizas
    ADD CONSTRAINT registros_analisis_cenizas_secuencia_catalogo_id_fkey FOREIGN KEY (secuencia_catalogo_id) REFERENCES public.catalogo_secuencias(id);


--
-- Name: registros_analisis_nitrogeno registros_analisis_nitrogeno_ciclo_catalogo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_nitrogeno
    ADD CONSTRAINT registros_analisis_nitrogeno_ciclo_catalogo_id_fkey FOREIGN KEY (ciclo_catalogo_id) REFERENCES public.catalogo_ciclos(id);


--
-- Name: registros_analisis_nitrogeno registros_analisis_nitrogeno_ciclo_procesamiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_nitrogeno
    ADD CONSTRAINT registros_analisis_nitrogeno_ciclo_procesamiento_id_fkey FOREIGN KEY (ciclo_procesamiento_id) REFERENCES public.ciclos_procesamiento(id);


--
-- Name: registros_analisis_nitrogeno registros_analisis_nitrogeno_etapa_catalogo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_nitrogeno
    ADD CONSTRAINT registros_analisis_nitrogeno_etapa_catalogo_id_fkey FOREIGN KEY (etapa_catalogo_id) REFERENCES public.catalogo_etapas(id);


--
-- Name: registros_analisis_nitrogeno registros_analisis_nitrogeno_muestra_catalogo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_nitrogeno
    ADD CONSTRAINT registros_analisis_nitrogeno_muestra_catalogo_id_fkey FOREIGN KEY (muestra_catalogo_id) REFERENCES public.catalogo_muestras(id);


--
-- Name: registros_analisis_nitrogeno registros_analisis_nitrogeno_origen_catalogo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_nitrogeno
    ADD CONSTRAINT registros_analisis_nitrogeno_origen_catalogo_id_fkey FOREIGN KEY (origen_catalogo_id) REFERENCES public.catalogo_origenes(id);


--
-- Name: registros_analisis_nitrogeno registros_analisis_nitrogeno_secuencia_catalogo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: funglusapp
--

ALTER TABLE ONLY public.registros_analisis_nitrogeno
    ADD CONSTRAINT registros_analisis_nitrogeno_secuencia_catalogo_id_fkey FOREIGN KEY (secuencia_catalogo_id) REFERENCES public.catalogo_secuencias(id);


--
-- PostgreSQL database dump complete
--

\unrestrict jWQvkWk182hzSivYYjWB0Fq4eeiOHIBMz6rKUKLRdjIdnM4P7HkcScZ0WCrSxiC

