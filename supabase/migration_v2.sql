-- ─── SISP · Migration v2 ────────────────────────────────────────────────────
-- Ejecutar este script en el SQL Editor de Supabase
-- URL: https://supabase.com/dashboard/project/_/sql/new

-- ════════════════════════════════════════════════════════════════════════════
-- 1. ALTERACIONES DE ESQUEMA
-- ════════════════════════════════════════════════════════════════════════════

-- 1a. Agregar campos sociodemográficos y clínicos a paciente
ALTER TABLE paciente
  ADD COLUMN IF NOT EXISTS genero     CHAR(1)       NOT NULL DEFAULT 'M',
  ADD COLUMN IF NOT EXISTS telefono   VARCHAR(50),
  ADD COLUMN IF NOT EXISTS direccion  VARCHAR(500),
  ADD COLUMN IF NOT EXISTS condicion  VARCHAR(255),
  ADD COLUMN IF NOT EXISTS doctor     VARCHAR(255),
  ADD COLUMN IF NOT EXISTS notas_medicas TEXT;

-- 1b. Agregar tipo de alerta y lectura a alertacritica
ALTER TABLE alertacritica
  ADD COLUMN IF NOT EXISTS alerttype  VARCHAR(255),
  ADD COLUMN IF NOT EXISTS reading    VARCHAR(255),
  ADD COLUMN IF NOT EXISTS riesgo     VARCHAR(255);

-- 1c. Agregar metadatos de reporte a reporteepidemiologico
ALTER TABLE reporteepidemiologico
  ADD COLUMN IF NOT EXISTS titulo          VARCHAR(500),
  ADD COLUMN IF NOT EXISTS tipo            VARCHAR(50),
  ADD COLUMN IF NOT EXISTS periodo         VARCHAR(255),
  ADD COLUMN IF NOT EXISTS totalpacientes  INT,
  ADD COLUMN IF NOT EXISTS totalalertas    INT,
  ADD COLUMN IF NOT EXISTS totalcriticos   INT,
  ADD COLUMN IF NOT EXISTS riesgopromedio  VARCHAR(50),
  ADD COLUMN IF NOT EXISTS estado          VARCHAR(50),
  ADD COLUMN IF NOT EXISTS tamano          VARCHAR(20);

-- 1d. Puntaje de salud general en evaluacionpredictiva (0–100, mayor = mejor salud)
ALTER TABLE evaluacionpredictiva
  ADD COLUMN IF NOT EXISTS scoregeneral    NUMERIC(5,1);

-- ════════════════════════════════════════════════════════════════════════════
-- 2. RESET DE DATOS (limpia e reinicia IDs)
-- ════════════════════════════════════════════════════════════════════════════

TRUNCATE TABLE
  reporteepidemiologico,
  alertacritica,
  signovital,
  evaluacionpredictiva,
  umbralpersonalizado,
  dispositivoiomt,
  personalmedico,
  paciente
RESTART IDENTITY CASCADE;

-- ════════════════════════════════════════════════════════════════════════════
-- 3. SEED DATA
-- ════════════════════════════════════════════════════════════════════════════

-- 3a. Pacientes (con todos los campos)
INSERT INTO paciente (nombres, apellidos, fechanacimiento, genero, telefono, direccion, condicion, doctor, notas_medicas) VALUES
('Ariana',    'Rojas',     '1995-04-12', 'F', '555-101-2233', 'Av. Principal 101, Lima',      'Hipertensión',          'Dr. Carlos Monzón',  'Paciente con tratamiento de Enalapril. Mantiene presión controlada.'),
('Ashly',     'Mendoza',   '1998-08-25', 'F', '555-102-3344', 'Calle Las Flores 45, Lima',    'EPOC leve',             'Dr. Julio Vega',     'Sintomatología leve. Se recomienda monitorear SpO2 nocturna.'),
('Gerald',    'Fernández', '1985-11-03', 'M', '555-103-4455', 'Jr. Loreto 203, Lima',         'Diabetes T2',           'Dra. Elena Silva',   'Paciente requiere ajuste de dosis de Metformina. Glucosa inestable.'),
('Juan',      'Pérez',     '1970-02-14', 'M', '555-104-5566', 'Av. Arequipa 500, Lima',       'EPOC severo',           'Dr. Julio Vega',     'Uso de oxígeno suplementario domiciliario. Monitoreo clínico crítico.'),
('Luis',      'Serrano',   '1960-05-20', 'M', '555-105-6677', 'Jr. Lampa 330, Lima',          'Arritmia Cardíaca',     'Dr. Carlos Monzón',  'Bajo tratamiento con Betabloqueadores. Monitorear ritmo cardíaco activo.'),
('María',     'Castillo',  '1955-09-30', 'F', '555-106-7788', 'Av. Brasil 720, Lima',         'Hipotiroidismo',        'Dra. Elena Silva',   'Dosis de Levotiroxina estable. Reporta buena tolerancia general.'),
('Pedro',     'Vargas',    '1982-12-11', 'M', '555-107-8899', 'Calle Miraflores 12, Lima',    'Fibrilación Auricular', 'Dr. Carlos Monzón',  'Episodios ocasionales de palpitaciones. Requiere control Holter.'),
('Verónica',  'Cachique',  '1990-07-07', 'F', '555-108-9900', 'Av. Salaverry 890, Lima',      'Asma Bronquial',        'Dr. Julio Vega',     'Tratamiento con Salbutamol condicional. Espirometría estable.'),
('Francisco', 'Curto',     '2001-01-15', 'M', '555-109-0011', 'Jr. Carabaya 55, Lima',        'Hipertensión leve',     'Dr. Martín Torres',  'Mapeo de presión arterial por 24 horas normal. Sin sintomatología aguda.'),
('David',     'López',     '1988-03-22', 'M', '555-110-1122', 'Av. Tacna 400, Lima',          'Hipertensión + DM2',    'Dr. Martín Torres',  'Paciente con doble terapia. Mantiene controles glucémicos aceptables.');

-- 3b. Personal Médico
INSERT INTO personalmedico (nombres, especialidad) VALUES
('Dr. Carlos Monzón',  'Cardiología'),
('Dr. Julio Vega',     'Neumología'),
('Dra. Elena Silva',   'Medicina Interna'),
('Dr. Martín Torres',  'Cuidados Intensivos');

-- 3c. Dispositivos IoMT asignados a pacientes
INSERT INTO dispositivoiomt (idpaciente, tipo, estado) VALUES
(1,  'Smartwatch Médico',          'Activo'),
(2,  'Monitor Multiparámetro',     'Activo'),
(3,  'Sensor de Parche (Glucosa)', 'Activo'),
(4,  'Oxímetro Bluetooth',         'Mantenimiento'),
(5,  'Monitor Multiparámetro',     'Activo'),
(6,  'Smartwatch Médico',          'Activo'),
(7,  'Holter ECG',                 'Activo'),
(8,  'Monitor Multiparámetro',     'Activo'),
(9,  'Smartwatch Médico',          'Activo'),
(10, 'Sensor de Presión',          'Inactivo');

-- 3d. Umbrales personalizados por paciente
INSERT INTO umbralpersonalizado (idpaciente, valorminimo, valormaximo) VALUES
(1,  60.0, 100.0),   -- Ariana:    Ritmo Cardíaco normal
(2,  95.0, 100.0),   -- Ashly:     SpO2
(3,  70.0, 110.0),   -- Gerald:    Glucosa
(4,  90.0, 100.0),   -- Juan:      SpO2 (paciente EPOC severo)
(5,  60.0,  90.0),   -- Luis:      Ritmo Cardíaco
(6,  36.1,  37.2),   -- María:     Temperatura corporal
(7,  60.0, 100.0),   -- Pedro:     Ritmo Cardíaco
(8,  95.0, 100.0),   -- Verónica:  SpO2
(9,  60.0, 100.0),   -- Francisco: Ritmo Cardíaco
(10, 90.0, 120.0);   -- David:     Presión Sistólica

-- 3e. Evaluaciones predictivas (con scoregeneral: 0–100, mayor = mejor salud)
INSERT INTO evaluacionpredictiva (idumbral, nivelriesgo, fechaevaluacion, scoregeneral) VALUES
(1,  'Normal',       NOW() - INTERVAL '10 minutes', 88.5),  -- Ariana: hipertensión controlada
(2,  'Normal',       NOW() - INTERVAL '15 minutes', 91.0),  -- Ashly: EPOC leve estable
(3,  'Riesgo Medio', NOW() - INTERVAL '5 minutes',  64.0),  -- Gerald: glucosa elevada
(4,  'Riesgo Alto',  NOW() - INTERVAL '2 minutes',  38.5),  -- Juan: EPOC severo + hipoxia
(5,  'Riesgo Alto',  NOW() - INTERVAL '1 minute',   31.0),  -- Luis: taquicardia activa
(6,  'Normal',       NOW() - INTERVAL '20 minutes', 85.0),  -- María: hipotiroidismo estable
(7,  'Riesgo Medio', NOW() - INTERVAL '8 minutes',  58.5),  -- Pedro: fibrilación moderada
(8,  'Normal',       NOW() - INTERVAL '30 minutes', 93.0),  -- Verónica: asma controlada
(9,  'Normal',       NOW() - INTERVAL '1 hour',     90.0),  -- Francisco: hipertensión leve
(10,  'Normal',       NOW() - INTERVAL '2 hours',    82.0),  -- David: HTA + DM2 controlados

-- Evaluaciones Históricas Adicionales (para gráficos temporales)
-- Ariana (idumbral 1)
(1,  'Normal',       NOW() - INTERVAL '1 hour',     87.0),
(1,  'Normal',       NOW() - INTERVAL '2 hours',    85.5),
(1,  'Normal',       NOW() - INTERVAL '4 hours',    89.0),
(1,  'Normal',       NOW() - INTERVAL '8 hours',    84.0),
(1,  'Normal',       NOW() - INTERVAL '12 hours',   86.5),
-- Gerald (idumbral 3)
(3,  'Riesgo Medio', NOW() - INTERVAL '1 hour',     65.0),
(3,  'Normal',       NOW() - INTERVAL '2 hours',    75.0),
(3,  'Normal',       NOW() - INTERVAL '4 hours',    82.0),
(3,  'Normal',       NOW() - INTERVAL '8 hours',    88.0),
(3,  'Normal',       NOW() - INTERVAL '12 hours',   86.0),
-- Juan (idumbral 4)
(4,  'Riesgo Medio', NOW() - INTERVAL '1 hour',     55.0),
(4,  'Normal',       NOW() - INTERVAL '2 hours',    72.0),
(4,  'Normal',       NOW() - INTERVAL '4 hours',    80.0),
(4,  'Normal',       NOW() - INTERVAL '8 hours',    85.0),
(4,  'Normal',       NOW() - INTERVAL '12 hours',   84.5),
-- Luis (idumbral 5)
(5,  'Riesgo Medio', NOW() - INTERVAL '1 hour',     58.0),
(5,  'Normal',       NOW() - INTERVAL '2 hours',    70.0),
(5,  'Normal',       NOW() - INTERVAL '4 hours',    81.0),
(5,  'Normal',       NOW() - INTERVAL '8 hours',    85.0),
(5,  'Normal',       NOW() - INTERVAL '12 hours',   83.0),
-- Pedro (idumbral 7)
(7,  'Normal',       NOW() - INTERVAL '1 hour',     78.0),
(7,  'Normal',       NOW() - INTERVAL '2 hours',    82.0),
(7,  'Normal',       NOW() - INTERVAL '4 hours',    85.0),
(7,  'Normal',       NOW() - INTERVAL '8 hours',    84.0),
(7,  'Normal',       NOW() - INTERVAL '12 hours',   80.0);

-- 3f. Signos Vitales — TODOS los pacientes tienen medición completa
--     (Ritmo Cardíaco · SpO2 · Glucosa · Temperatura · Presión Sistólica)
INSERT INTO signovital (iddispositivo, idevaluacion, tipo, valor, fechahora) VALUES

-- Ariana (dispositivo 1) — Normal · Hipertensión controlada
(1, 1, 'Ritmo Cardíaco',    75.0, NOW() - INTERVAL '10 minutes'),
(1, 1, 'SpO2',              98.0, NOW() - INTERVAL '10 minutes'),
(1, 1, 'Glucosa',           92.0, NOW() - INTERVAL '10 minutes'),
(1, 1, 'Temperatura',       36.6, NOW() - INTERVAL '10 minutes'),
(1, 1, 'Presión Sistólica', 118.0, NOW() - INTERVAL '10 minutes'),

-- Ashly (dispositivo 2) — Normal · EPOC leve estable
(2, 2, 'Ritmo Cardíaco',    72.0, NOW() - INTERVAL '15 minutes'),
(2, 2, 'SpO2',              98.0, NOW() - INTERVAL '15 minutes'),
(2, 2, 'Glucosa',           88.0, NOW() - INTERVAL '15 minutes'),
(2, 2, 'Temperatura',       36.5, NOW() - INTERVAL '15 minutes'),
(2, 2, 'Presión Sistólica', 120.0, NOW() - INTERVAL '15 minutes'),

-- Gerald (dispositivo 3) — Riesgo Medio · Diabetes T2
(3, 3, 'Ritmo Cardíaco',    80.0, NOW() - INTERVAL '5 minutes'),
(3, 3, 'SpO2',              96.0, NOW() - INTERVAL '5 minutes'),
(3, 3, 'Glucosa',           115.0, NOW() - INTERVAL '5 minutes'),
(3, 3, 'Temperatura',       36.9, NOW() - INTERVAL '5 minutes'),
(3, 3, 'Presión Sistólica', 128.0, NOW() - INTERVAL '5 minutes'),

-- Juan (dispositivo 4) — Riesgo Alto · EPOC severo + Hipoxia
(4, 4, 'Ritmo Cardíaco',    95.0, NOW() - INTERVAL '2 minutes'),
(4, 4, 'SpO2',              85.0, NOW() - INTERVAL '2 minutes'),
(4, 4, 'Glucosa',           98.0, NOW() - INTERVAL '2 minutes'),
(4, 4, 'Temperatura',       37.4, NOW() - INTERVAL '2 minutes'),
(4, 4, 'Presión Sistólica', 145.0, NOW() - INTERVAL '2 minutes'),

-- Luis (dispositivo 5) — Riesgo Alto · Taquicardia / Arritmia
(5, 5, 'Ritmo Cardíaco',   135.0, NOW() - INTERVAL '1 minute'),
(5, 5, 'SpO2',              92.0, NOW() - INTERVAL '1 minute'),
(5, 5, 'Glucosa',          102.0, NOW() - INTERVAL '1 minute'),
(5, 5, 'Temperatura',       37.1, NOW() - INTERVAL '1 minute'),
(5, 5, 'Presión Sistólica', 155.0, NOW() - INTERVAL '1 minute'),

-- María (dispositivo 6) — Normal · Hipotiroidismo estable
(6, 6, 'Ritmo Cardíaco',    68.0, NOW() - INTERVAL '20 minutes'),
(6, 6, 'SpO2',              97.0, NOW() - INTERVAL '20 minutes'),
(6, 6, 'Glucosa',           85.0, NOW() - INTERVAL '20 minutes'),
(6, 6, 'Temperatura',       36.8, NOW() - INTERVAL '20 minutes'),
(6, 6, 'Presión Sistólica', 112.0, NOW() - INTERVAL '20 minutes'),

-- Pedro (dispositivo 7) — Riesgo Medio · Fibrilación Auricular
(7, 7, 'Ritmo Cardíaco',   105.0, NOW() - INTERVAL '8 minutes'),
(7, 7, 'SpO2',              96.0, NOW() - INTERVAL '8 minutes'),
(7, 7, 'Glucosa',           110.0, NOW() - INTERVAL '8 minutes'),
(7, 7, 'Temperatura',       36.7, NOW() - INTERVAL '8 minutes'),
(7, 7, 'Presión Sistólica', 132.0, NOW() - INTERVAL '8 minutes'),

-- Verónica (dispositivo 8) — Normal · Asma controlada
(8, 8, 'Ritmo Cardíaco',    74.0, NOW() - INTERVAL '30 minutes'),
(8, 8, 'SpO2',              99.0, NOW() - INTERVAL '30 minutes'),
(8, 8, 'Glucosa',           82.0, NOW() - INTERVAL '30 minutes'),
(8, 8, 'Temperatura',       36.4, NOW() - INTERVAL '30 minutes'),
(8, 8, 'Presión Sistólica', 115.0, NOW() - INTERVAL '30 minutes'),

-- Francisco (dispositivo 9) — Normal · Hipertensión leve
(9, 9, 'Ritmo Cardíaco',    82.0, NOW() - INTERVAL '1 hour'),
(9, 9, 'SpO2',              97.0, NOW() - INTERVAL '1 hour'),
(9, 9, 'Glucosa',           95.0, NOW() - INTERVAL '1 hour'),
(9, 9, 'Temperatura',       36.6, NOW() - INTERVAL '1 hour'),
(9, 9, 'Presión Sistólica', 122.0, NOW() - INTERVAL '1 hour'),

-- David (dispositivo 10) — Normal · Hipertensión + DM2 controlados
(10, 10, 'Ritmo Cardíaco',    78.0, NOW() - INTERVAL '2 hours'),
(10, 10, 'SpO2',              96.0, NOW() - INTERVAL '2 hours'),
(10, 10, 'Glucosa',           108.0, NOW() - INTERVAL '2 hours'),
(10, 10, 'Temperatura',       36.7, NOW() - INTERVAL '2 hours'),
(10, 10, 'Presión Sistólica', 110.0, NOW() - INTERVAL '2 hours'),

-- Signos Vitales Históricos Adicionales (para graficación)
-- Ariana (dispositivo 1, evaluaciones 11-15)
(1, 11, 'Ritmo Cardíaco',    78.0, NOW() - INTERVAL '1 hour'),
(1, 11, 'SpO2',              97.0, NOW() - INTERVAL '1 hour'),
(1, 11, 'Glucosa',           95.0, NOW() - INTERVAL '1 hour'),
(1, 11, 'Presión Sistólica', 122.0, NOW() - INTERVAL '1 hour'),

(1, 12, 'Ritmo Cardíaco',    80.0, NOW() - INTERVAL '2 hours'),
(1, 12, 'SpO2',              98.0, NOW() - INTERVAL '2 hours'),
(1, 12, 'Glucosa',           90.0, NOW() - INTERVAL '2 hours'),
(1, 12, 'Presión Sistólica', 125.0, NOW() - INTERVAL '2 hours'),

(1, 13, 'Ritmo Cardíaco',    72.0, NOW() - INTERVAL '4 hours'),
(1, 13, 'SpO2',              99.0, NOW() - INTERVAL '4 hours'),
(1, 13, 'Glucosa',           88.0, NOW() - INTERVAL '4 hours'),
(1, 13, 'Presión Sistólica', 115.0, NOW() - INTERVAL '4 hours'),

(1, 14, 'Ritmo Cardíaco',    85.0, NOW() - INTERVAL '8 hours'),
(1, 14, 'SpO2',              96.0, NOW() - INTERVAL '8 hours'),
(1, 14, 'Glucosa',           102.0, NOW() - INTERVAL '8 hours'),
(1, 14, 'Presión Sistólica', 130.0, NOW() - INTERVAL '8 hours'),

(1, 15, 'Ritmo Cardíaco',    76.0, NOW() - INTERVAL '12 hours'),
(1, 15, 'SpO2',              98.0, NOW() - INTERVAL '12 hours'),
(1, 15, 'Glucosa',           94.0, NOW() - INTERVAL '12 hours'),
(1, 15, 'Presión Sistólica', 119.0, NOW() - INTERVAL '12 hours'),

-- Gerald (dispositivo 3, evaluaciones 16-20)
(3, 16, 'Ritmo Cardíaco',    82.0, NOW() - INTERVAL '1 hour'),
(3, 16, 'SpO2',              96.0, NOW() - INTERVAL '1 hour'),
(3, 16, 'Glucosa',           120.0, NOW() - INTERVAL '1 hour'),
(3, 16, 'Presión Sistólica', 130.0, NOW() - INTERVAL '1 hour'),

(3, 17, 'Ritmo Cardíaco',    75.0, NOW() - INTERVAL '2 hours'),
(3, 17, 'SpO2',              98.0, NOW() - INTERVAL '2 hours'),
(3, 17, 'Glucosa',           105.0, NOW() - INTERVAL '2 hours'),
(3, 17, 'Presión Sistólica', 124.0, NOW() - INTERVAL '2 hours'),

(3, 18, 'Ritmo Cardíaco',    70.0, NOW() - INTERVAL '4 hours'),
(3, 18, 'SpO2',              99.0, NOW() - INTERVAL '4 hours'),
(3, 18, 'Glucosa',           92.0, NOW() - INTERVAL '4 hours'),
(3, 18, 'Presión Sistólica', 120.0, NOW() - INTERVAL '4 hours'),

(3, 19, 'Ritmo Cardíaco',    72.0, NOW() - INTERVAL '8 hours'),
(3, 19, 'SpO2',              98.0, NOW() - INTERVAL '8 hours'),
(3, 19, 'Glucosa',           85.0, NOW() - INTERVAL '8 hours'),
(3, 19, 'Presión Sistólica', 118.0, NOW() - INTERVAL '8 hours'),

(3, 20, 'Ritmo Cardíaco',    74.0, NOW() - INTERVAL '12 hours'),
(3, 20, 'SpO2',              97.0, NOW() - INTERVAL '12 hours'),
(3, 20, 'Glucosa',           89.0, NOW() - INTERVAL '12 hours'),
(3, 20, 'Presión Sistólica', 121.0, NOW() - INTERVAL '12 hours'),

-- Juan (dispositivo 4, evaluaciones 21-25)
(4, 21, 'Ritmo Cardíaco',    90.0, NOW() - INTERVAL '1 hour'),
(4, 21, 'SpO2',              88.0, NOW() - INTERVAL '1 hour'),
(4, 21, 'Glucosa',           102.0, NOW() - INTERVAL '1 hour'),
(4, 21, 'Presión Sistólica', 138.0, NOW() - INTERVAL '1 hour'),

(4, 22, 'Ritmo Cardíaco',    85.0, NOW() - INTERVAL '2 hours'),
(4, 22, 'SpO2',              92.0, NOW() - INTERVAL '2 hours'),
(4, 22, 'Glucosa',           95.0, NOW() - INTERVAL '2 hours'),
(4, 22, 'Presión Sistólica', 130.0, NOW() - INTERVAL '2 hours'),

(4, 23, 'Ritmo Cardíaco',    78.0, NOW() - INTERVAL '4 hours'),
(4, 23, 'SpO2',              95.0, NOW() - INTERVAL '4 hours'),
(4, 23, 'Glucosa',           90.0, NOW() - INTERVAL '4 hours'),
(4, 23, 'Presión Sistólica', 122.0, NOW() - INTERVAL '4 hours'),

(4, 24, 'Ritmo Cardíaco',    72.0, NOW() - INTERVAL '8 hours'),
(4, 24, 'SpO2',              96.0, NOW() - INTERVAL '8 hours'),
(4, 24, 'Glucosa',           88.0, NOW() - INTERVAL '8 hours'),
(4, 24, 'Presión Sistólica', 118.0, NOW() - INTERVAL '8 hours'),

(4, 25, 'Ritmo Cardíaco',    75.0, NOW() - INTERVAL '12 hours'),
(4, 25, 'SpO2',              95.0, NOW() - INTERVAL '12 hours'),
(4, 25, 'Glucosa',           92.0, NOW() - INTERVAL '12 hours'),
(4, 25, 'Presión Sistólica', 120.0, NOW() - INTERVAL '12 hours'),

-- Luis (dispositivo 5, evaluaciones 26-30)
(5, 26, 'Ritmo Cardíaco',   120.0, NOW() - INTERVAL '1 hour'),
(5, 26, 'SpO2',              93.0, NOW() - INTERVAL '1 hour'),
(5, 26, 'Glucosa',           99.0, NOW() - INTERVAL '1 hour'),
(5, 26, 'Presión Sistólica', 148.0, NOW() - INTERVAL '1 hour'),

(5, 27, 'Ritmo Cardíaco',   105.0, NOW() - INTERVAL '2 hours'),
(5, 27, 'SpO2',              95.0, NOW() - INTERVAL '2 hours'),
(5, 27, 'Glucosa',           92.0, NOW() - INTERVAL '2 hours'),
(5, 27, 'Presión Sistólica', 135.0, NOW() - INTERVAL '2 hours'),

(5, 28, 'Ritmo Cardíaco',    92.0, NOW() - INTERVAL '4 hours'),
(5, 28, 'SpO2',              96.0, NOW() - INTERVAL '4 hours'),
(5, 28, 'Glucosa',           96.0, NOW() - INTERVAL '4 hours'),
(5, 28, 'Presión Sistólica', 128.0, NOW() - INTERVAL '4 hours'),

(5, 29, 'Ritmo Cardíaco',    80.0, NOW() - INTERVAL '8 hours'),
(5, 29, 'SpO2',              97.0, NOW() - INTERVAL '8 hours'),
(5, 29, 'Glucosa',           105.0, NOW() - INTERVAL '8 hours'),
(5, 29, 'Presión Sistólica', 122.0, NOW() - INTERVAL '8 hours'),

(5, 30, 'Ritmo Cardíaco',    75.0, NOW() - INTERVAL '12 hours'),
(5, 30, 'SpO2',              98.0, NOW() - INTERVAL '12 hours'),
(5, 30, 'Glucosa',           101.0, NOW() - INTERVAL '12 hours'),
(5, 30, 'Presión Sistólica', 120.0, NOW() - INTERVAL '12 hours'),

-- Pedro (dispositivo 7, evaluaciones 31-35)
(7, 31, 'Ritmo Cardíaco',    98.0, NOW() - INTERVAL '1 hour'),
(7, 31, 'SpO2',              97.0, NOW() - INTERVAL '1 hour'),
(7, 31, 'Glucosa',           105.0, NOW() - INTERVAL '1 hour'),
(7, 31, 'Presión Sistólica', 128.0, NOW() - INTERVAL '1 hour'),

(7, 32, 'Ritmo Cardíaco',    92.0, NOW() - INTERVAL '2 hours'),
(7, 32, 'SpO2',              98.0, NOW() - INTERVAL '2 hours'),
(7, 32, 'Glucosa',           100.0, NOW() - INTERVAL '2 hours'),
(7, 32, 'Presión Sistólica', 124.0, NOW() - INTERVAL '2 hours'),

(7, 33, 'Ritmo Cardíaco',    85.0, NOW() - INTERVAL '4 hours'),
(7, 33, 'SpO2',              98.0, NOW() - INTERVAL '4 hours'),
(7, 33, 'Glucosa',           95.0, NOW() - INTERVAL '4 hours'),
(7, 33, 'Presión Sistólica', 120.0, NOW() - INTERVAL '4 hours'),

(7, 34, 'Ritmo Cardíaco',    80.0, NOW() - INTERVAL '8 hours'),
(7, 34, 'SpO2',              99.0, NOW() - INTERVAL '8 hours'),
(7, 34, 'Glucosa',           98.0, NOW() - INTERVAL '8 hours'),
(7, 34, 'Presión Sistólica', 118.0, NOW() - INTERVAL '8 hours'),

(7, 35, 'Ritmo Cardíaco',    78.0, NOW() - INTERVAL '12 hours'),
(7, 35, 'SpO2',              98.0, NOW() - INTERVAL '12 hours'),
(7, 35, 'Glucosa',           92.0, NOW() - INTERVAL '12 hours'),
(7, 35, 'Presión Sistólica', 116.0, NOW() - INTERVAL '12 hours');

-- 3g. Alertas Críticas (con tipo y lectura)
INSERT INTO alertacritica (idevaluacion, idpersonal, prioridad, estado, fechageneracion, alerttype, reading, riesgo) VALUES
(4, 2, 'Alta',    'Pendiente',   NOW() - INTERVAL '2 minutes',  'Hipoxia Severa',         'SpO2: 85%',        'Riesgo de Insuficiencia Respiratoria'),
(5, 1, 'Critica', 'Pendiente',   NOW() - INTERVAL '1 minute',   'Taquicardia',            'FC: 135 bpm',      'Riesgo de Paro Cardiorrespiratorio'),
(3, 3, 'Media',   'En Revisión', NOW() - INTERVAL '5 minutes',  'Glucosa en Límite Alto', 'Glucosa: 115 mg/dL', 'Hiperglucemia leve'),
(7, 4, 'Baja',    'Resuelta',    NOW() - INTERVAL '8 minutes',  'Taquicardia Leve',       'FC: 105 bpm',      'Arritmia Moderada'),
(21, 2, 'Alta',    'Resuelta',    NOW() - INTERVAL '1 hour',     'Hipoxia Moderada',       'SpO2: 88%',        'Riesgo de deficiencia pulmonar'),
(26, 1, 'Alta',    'Resuelta',    NOW() - INTERVAL '1 hour',     'Taquicardia en Reposo',  'FC: 120 bpm',      'Esfuerzo cardíaco elevado'),
(16, 3, 'Media',   'Resuelta',    NOW() - INTERVAL '1 hour',     'Hiperglucemia',          'Glucosa: 120 mg/dL', 'Tendencia al alza en ayuno');

-- 3h. Reportes Epidemiológicos (con metadatos completos)
INSERT INTO reporteepidemiologico
  (idpersonal, descripcion, fechageneracion, titulo, tipo, periodo, totalpacientes, totalalertas, totalcriticos, riesgopromedio, estado, tamano)
VALUES
(1, 'Aumento de casos de arritmia detectados en el pabellón B durante el turno nocturno.',
   NOW() - INTERVAL '1 day',
   'Reporte Semanal de Monitoreo', 'Semanal', '15 jun – 22 jun 2026', 10, 4, 2, 'Moderado', 'Listo', '2.4 MB'),

(2, 'Monitoreo de pacientes con deficiencia respiratoria estable, sin picos anómalos en las últimas 48 horas.',
   NOW() - INTERVAL '2 days',
   'Análisis Respiratorio — Junio', 'Específico', 'Junio 2026', 10, 2, 0, 'Bajo', 'Listo', '1.1 MB'),

(3, 'Evaluación mensual de pacientes con patologías crónicas monitoreadas vía IoMT.',
   NOW() - INTERVAL '3 days',
   'Reporte Mensual — Mayo 2026', 'Mensual', 'Mayo 2026', 10, 8, 3, 'Moderado', 'Listo', '5.7 MB'),

(4, 'Análisis predictivo de riesgo cardiovascular usando modelo ML sobre datos de los últimos 30 días.',
   NOW() - INTERVAL '5 days',
   'Análisis Predictivo ML — Junio', 'ML', 'Junio 2026', 10, 12, 4, 'Alto', 'Listo', '8.2 MB');
