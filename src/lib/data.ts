// ─── SISP · Datos Hardcodeados Compartidos ──────────────────────────────────
// Fuente única de verdad para todas las páginas. Sin base de datos.

export type RiskLevel = "Bajo" | "Moderado" | "Alto";
export type DeviceStatus = "Conectado" | "Sin Conexión";
export type AlertSeverity = "critical" | "high" | "medium";
export type AlertStatus = "Activa" | "Atendida" | "Descartada";

// ── Pacientes ────────────────────────────────────────────────────────────────
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F";
  condition: string;
  phone: string;
  address: string;
  doctor: string;
  bp: string;
  hr: string;
  glucose: string;
  spo2: string;
  weight: string;
  risk: RiskLevel;
  device: DeviceStatus;
  deviceModel: string;
  lastUpdate: string;
  enrolledDate: string;
  notes: string;
}

export const patients: Patient[] = [
  {
    id: "PAC-00101",
    name: "Ana Martínez",
    age: 52,
    gender: "F",
    condition: "Hipertensión",
    phone: "555-102-3344",
    address: "Av. Insurgentes Norte 342, CDMX",
    doctor: "Dr. Ramírez",
    bp: "135/88",
    hr: "78",
    glucose: "102",
    spo2: "97",
    weight: "68 kg",
    risk: "Bajo",
    device: "Conectado",
    deviceModel: "BioWatch Pro X2",
    lastUpdate: "hace 1 min",
    enrolledDate: "2024-02-14",
    notes: "Control estable. Continuar con Amlodipino 5mg.",
  },
  {
    id: "PAC-00312",
    name: "Carlos Mendoza",
    age: 58,
    gender: "M",
    condition: "Hipertensión + DM2",
    phone: "555-312-7788",
    address: "Calle Nogal 89, Col. Guerrero, CDMX",
    doctor: "Dr. Ramírez",
    bp: "180/120",
    hr: "92",
    glucose: "178",
    spo2: "95",
    weight: "94 kg",
    risk: "Alto",
    device: "Conectado",
    deviceModel: "BioWatch Pro X3",
    lastUpdate: "hace 4 min",
    enrolledDate: "2023-09-01",
    notes: "ALERTA ACTIVA. Pico hipertensivo. Requiere atención inmediata.",
  },
  {
    id: "PAC-00445",
    name: "Laura Pérez",
    age: 44,
    gender: "F",
    condition: "Diabetes T2",
    phone: "555-445-9900",
    address: "Privada Rosal 12, Coyoacán, CDMX",
    doctor: "Dr. Ramírez",
    bp: "122/80",
    hr: "71",
    glucose: "134",
    spo2: "98",
    weight: "72 kg",
    risk: "Moderado",
    device: "Conectado",
    deviceModel: "GlucoSense IoT",
    lastUpdate: "hace 3 min",
    enrolledDate: "2024-01-20",
    notes: "Glucosa en límite superior. Ajustar dieta.",
  },
  {
    id: "PAC-00589",
    name: "María González",
    age: 65,
    gender: "F",
    condition: "Diabetes T1",
    phone: "555-589-1122",
    address: "Blvd. Puerto Aéreo 56, Venustiano Carranza, CDMX",
    doctor: "Dr. Ramírez",
    bp: "118/76",
    hr: "88",
    glucose: "48",
    spo2: "94",
    weight: "58 kg",
    risk: "Alto",
    device: "Conectado",
    deviceModel: "GlucoSense IoT",
    lastUpdate: "hace 11 min",
    enrolledDate: "2023-06-10",
    notes: "ALERTA ACTIVA. Hipoglucemia severa. Requiere glucosa inmediata.",
  },
  {
    id: "PAC-00620",
    name: "Jorge Herrera",
    age: 61,
    gender: "M",
    condition: "Insuf. Cardíaca",
    phone: "555-620-3344",
    address: "Eje 3 Sur 201, Iztapalapa, CDMX",
    doctor: "Dr. Ramírez",
    bp: "128/84",
    hr: "66",
    glucose: "98",
    spo2: "93",
    weight: "88 kg",
    risk: "Moderado",
    device: "Sin Conexión",
    deviceModel: "CardioMon V1",
    lastUpdate: "hace 42 min",
    enrolledDate: "2023-11-05",
    notes: "Dispositivo sin señal. Llamar al paciente.",
  },
  {
    id: "PAC-00741",
    name: "Roberto Sánchez",
    age: 71,
    gender: "M",
    condition: "Arritmia",
    phone: "555-741-5566",
    address: "Av. Revolución 900, Álvaro Obregón, CDMX",
    doctor: "Dr. Ramírez",
    bp: "142/90",
    hr: "142",
    glucose: "110",
    spo2: "96",
    weight: "79 kg",
    risk: "Alto",
    device: "Conectado",
    deviceModel: "CardioMon V2",
    lastUpdate: "hace 23 min",
    enrolledDate: "2023-04-22",
    notes: "ALERTA ACTIVA. Fibrilación auricular detectada.",
  },
  {
    id: "PAC-00803",
    name: "Patricia López",
    age: 39,
    gender: "F",
    condition: "Hipertensión leve",
    phone: "555-803-7788",
    address: "Calzada de los Misterios 44, Gustavo A. Madero, CDMX",
    doctor: "Dr. Ramírez",
    bp: "130/82",
    hr: "74",
    glucose: "95",
    spo2: "99",
    weight: "61 kg",
    risk: "Bajo",
    device: "Conectado",
    deviceModel: "BioWatch Pro X2",
    lastUpdate: "hace 6 min",
    enrolledDate: "2024-03-08",
    notes: "Evolución favorable. Mantener tratamiento.",
  },
  {
    id: "PAC-00957",
    name: "Eduardo Vargas",
    age: 55,
    gender: "M",
    condition: "Obesidad + HTA",
    phone: "555-957-9900",
    address: "Av. Tlalpan 2300, Coyoacán, CDMX",
    doctor: "Dr. Ramírez",
    bp: "148/96",
    hr: "84",
    glucose: "148",
    spo2: "95",
    weight: "112 kg",
    risk: "Moderado",
    device: "Sin Conexión",
    deviceModel: "BioWatch Pro X3",
    lastUpdate: "hace 1 h",
    enrolledDate: "2023-12-19",
    notes: "Dispositivo sin señal. Verificar carga de batería.",
  },
  {
    id: "PAC-01034",
    name: "Carmen Rivera",
    age: 48,
    gender: "F",
    condition: "Diabetes T2 + Nefropatía",
    phone: "555-034-1122",
    address: "Sur 8 Núm. 5, Iztacalco, CDMX",
    doctor: "Dr. Ramírez",
    bp: "138/90",
    hr: "80",
    glucose: "162",
    spo2: "96",
    weight: "75 kg",
    risk: "Moderado",
    device: "Conectado",
    deviceModel: "GlucoSense IoT",
    lastUpdate: "hace 8 min",
    enrolledDate: "2024-01-04",
    notes: "Glicemia elevada. Revisar dosis de insulina.",
  },
  {
    id: "PAC-01102",
    name: "Miguel Ángel Torres",
    age: 67,
    gender: "M",
    condition: "EPOC + HTA",
    phone: "555-102-3355",
    address: "Av. Hidalgo 450, Azcapotzalco, CDMX",
    doctor: "Dr. Ramírez",
    bp: "145/92",
    hr: "77",
    glucose: "106",
    spo2: "91",
    weight: "83 kg",
    risk: "Alto",
    device: "Conectado",
    deviceModel: "OxiMon Wearable",
    lastUpdate: "hace 15 min",
    enrolledDate: "2023-08-30",
    notes: "SpO2 en 91%. Vigilar oxigenación.",
  },
];

// ── Alertas ──────────────────────────────────────────────────────────────────
export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  alertType: string;
  reading: string;
  risk: string;
  severity: AlertSeverity;
  status: AlertStatus;
  time: string;
  timestamp: string;
  location: string;
  attendedBy?: string;
}

export const alerts: Alert[] = [
  {
    id: "ALT-2024-001",
    patientId: "PAC-00312",
    patientName: "Carlos Mendoza",
    patientAge: 58,
    alertType: "Pico de Presión Arterial",
    reading: "180/120 mmHg",
    risk: "Riesgo de Infarto Agudo al Miocardio",
    severity: "critical",
    status: "Activa",
    time: "Hace 4 min",
    timestamp: "2026-06-21 19:41",
    location: "Zona Norte · CDMX",
  },
  {
    id: "ALT-2024-002",
    patientId: "PAC-00589",
    patientName: "María González",
    patientAge: 65,
    alertType: "Hipoglucemia Severa",
    reading: "48 mg/dL",
    risk: "Riesgo de Coma Diabético",
    severity: "critical",
    status: "Activa",
    time: "Hace 11 min",
    timestamp: "2026-06-21 19:34",
    location: "Zona Sur · CDMX",
  },
  {
    id: "ALT-2024-003",
    patientId: "PAC-00741",
    patientName: "Roberto Sánchez",
    patientAge: 71,
    alertType: "Arritmia Detectada",
    reading: "FC: 142 bpm (irregular)",
    risk: "Fibrilación Auricular",
    severity: "high",
    status: "Activa",
    time: "Hace 23 min",
    timestamp: "2026-06-21 19:22",
    location: "Zona Este · CDMX",
  },
  {
    id: "ALT-2024-004",
    patientId: "PAC-01102",
    patientName: "Miguel Ángel Torres",
    patientAge: 67,
    alertType: "Desaturación de Oxígeno",
    reading: "SpO2: 91%",
    risk: "Hipoxia moderada",
    severity: "high",
    status: "Activa",
    time: "Hace 15 min",
    timestamp: "2026-06-21 19:30",
    location: "Zona Norte · CDMX",
  },
  {
    id: "ALT-2024-005",
    patientId: "PAC-00620",
    patientName: "Jorge Herrera",
    patientAge: 61,
    alertType: "Dispositivo Sin Conexión",
    reading: "Último reporte: hace 42 min",
    risk: "Sin monitoreo activo",
    severity: "medium",
    status: "Activa",
    time: "Hace 42 min",
    timestamp: "2026-06-21 19:03",
    location: "Zona Sur · CDMX",
  },
  {
    id: "ALT-2024-006",
    patientId: "PAC-00957",
    patientName: "Eduardo Vargas",
    patientAge: 55,
    alertType: "Dispositivo Sin Conexión",
    reading: "Último reporte: hace 1 h",
    risk: "Sin monitoreo activo",
    severity: "medium",
    status: "Descartada",
    time: "Hace 1 h",
    timestamp: "2026-06-21 18:45",
    location: "Zona Sur · CDMX",
    attendedBy: "Dr. Ramírez",
  },
  {
    id: "ALT-2024-007",
    patientId: "PAC-00445",
    patientName: "Laura Pérez",
    patientAge: 44,
    alertType: "Glucosa en Límite Superior",
    reading: "134 mg/dL",
    risk: "Hiperglucemia leve",
    severity: "medium",
    status: "Atendida",
    time: "Hace 2 h",
    timestamp: "2026-06-21 17:45",
    location: "Zona Centro · CDMX",
    attendedBy: "Dr. Ramírez",
  },
  {
    id: "ALT-2024-008",
    patientId: "PAC-01034",
    patientName: "Carmen Rivera",
    patientAge: 48,
    alertType: "Hiperglucemia",
    reading: "162 mg/dL",
    risk: "Control glucémico deficiente",
    severity: "high",
    status: "Atendida",
    time: "Hace 3 h",
    timestamp: "2026-06-21 16:45",
    location: "Zona Centro · CDMX",
    attendedBy: "Dr. Ramírez",
  },
];

// ── Reportes ─────────────────────────────────────────────────────────────────
export interface Report {
  id: string;
  title: string;
  type: "Semanal" | "Mensual" | "Específico" | "ML";
  generatedDate: string;
  period: string;
  patients: number;
  alerts: number;
  critical: number;
  avgRisk: string;
  status: "Listo" | "Generando" | "Programado";
  size: string;
}

export const reports: Report[] = [
  {
    id: "RPT-2024-048",
    title: "Reporte Semanal de Monitoreo",
    type: "Semanal",
    generatedDate: "2026-06-21",
    period: "14 jun – 21 jun 2026",
    patients: 1245,
    alerts: 23,
    critical: 5,
    avgRisk: "Moderado",
    status: "Listo",
    size: "2.4 MB",
  },
  {
    id: "RPT-2024-047",
    title: "Análisis Predictivo ML — Junio",
    type: "ML",
    generatedDate: "2026-06-15",
    period: "Junio 2026",
    patients: 1240,
    alerts: 89,
    critical: 14,
    avgRisk: "Bajo",
    status: "Listo",
    size: "5.1 MB",
  },
  {
    id: "RPT-2024-046",
    title: "Reporte Mensual — Mayo 2026",
    type: "Mensual",
    generatedDate: "2026-06-01",
    period: "Mayo 2026",
    patients: 1198,
    alerts: 112,
    critical: 21,
    avgRisk: "Moderado",
    status: "Listo",
    size: "8.7 MB",
  },
  {
    id: "RPT-2024-045",
    title: "Pacientes en Riesgo Alto — Q2",
    type: "Específico",
    generatedDate: "2026-06-10",
    period: "Abr – Jun 2026",
    patients: 149,
    alerts: 67,
    critical: 18,
    avgRisk: "Alto",
    status: "Listo",
    size: "3.2 MB",
  },
  {
    id: "RPT-2024-049",
    title: "Reporte Semanal — 22 jun",
    type: "Semanal",
    generatedDate: "2026-06-22",
    period: "22 jun – 28 jun 2026",
    patients: 1245,
    alerts: 0,
    critical: 0,
    avgRisk: "—",
    status: "Programado",
    size: "—",
  },
];

// ── Configuración ────────────────────────────────────────────────────────────
export const configData = {
  doctor: {
    name: "Dr. Luis Ramírez Ochoa",
    specialty: "Cardiólogo",
    institution: "IMSS — Hospital General de Zona No. 1",
    license: "CCEC-2301847",
    email: "l.ramirez@imss.gob.mx",
    phone: "555-800-0001 ext. 342",
  },
  thresholds: {
    bpSystolicHigh: 140,
    bpDiastolicHigh: 90,
    hrHigh: 100,
    hrLow: 50,
    glucoseHigh: 140,
    glucoseLow: 70,
    spo2Low: 94,
  },
  notifications: {
    email: true,
    sms: true,
    inApp: true,
    criticalOnly: false,
    dailySummary: true,
    weeklyReport: true,
  },
  iomt: {
    syncIntervalSec: 60,
    offlineAlertMinutes: 30,
    autoReconnect: true,
    encryptionEnabled: true,
    mlModelVersion: "SISP-ML v3.2.1",
    lastModelUpdate: "2026-06-01",
  },
};
