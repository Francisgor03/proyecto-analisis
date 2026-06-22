// ─── SISP · Tipos de Base de Datos (Supabase) ────────────────────────────────
// Los nombres de tablas y columnas están en minúsculas porque PostgreSQL
// normaliza los identificadores sin comillas a lowercase.

// ── Tablas de la BD ──────────────────────────────────────────────────────────

export interface DbPaciente {
  idpaciente: number;
  nombres: string;
  apellidos: string;
  fechanacimiento: string;
  genero: "M" | "F";
  telefono: string | null;
  direccion: string | null;
  condicion: string | null;
  doctor: string | null;
}

export interface DbPersonalMedico {
  idpersonal: number;
  nombres: string;
  especialidad: string;
}

export interface DbDispositivoIoMT {
  iddispositivo: number;
  idpaciente: number;
  tipo: string;
  estado: "Activo" | "Inactivo" | "Mantenimiento";
}

export interface DbUmbralPersonalizado {
  idumbral: number;
  idpaciente: number;
  valorminimo: number;
  valormaximo: number;
}

export interface DbEvaluacionPredictiva {
  idevaluacion: number;
  idumbral: number;
  nivelriesgo: "Normal" | "Riesgo Medio" | "Riesgo Alto";
  fechaevaluacion: string;
  /** Puntaje de salud general 0–100 (mayor = mejor salud) */
  scoregeneral: number | null;
}

export interface DbSignoVital {
  idsigno: number;
  iddispositivo: number;
  idevaluacion: number;
  tipo: string;
  valor: number;
  fechahora: string;
}

export interface DbAlertaCritica {
  idalerta: number;
  idevaluacion: number;
  idpersonal: number;
  prioridad: "Critica" | "Alta" | "Media" | "Baja";
  estado: "Pendiente" | "En Revisión" | "Resuelta";
  fechageneracion: string;
  alerttype: string | null;
  reading: string | null;
  riesgo: string | null;
}

export interface DbReporteEpidemiologico {
  idreporte: number;
  idpersonal: number;
  fechageneracion: string;
  descripcion: string;
  titulo: string | null;
  tipo: string | null;
  periodo: string | null;
  totalpacientes: number | null;
  totalalertas: number | null;
  totalcriticos: number | null;
  riesgopromedio: string | null;
  estado: string | null;
  tamano: string | null;
}

// ── Tipos de UI ───────────────────────────────────────────────────────────────

export type RiskLevel = "Bajo" | "Moderado" | "Alto";
export type DeviceStatus = "Conectado" | "Sin Conexión" | "Mantenimiento";
export type AlertSeverity = "critical" | "high" | "medium";
export type AlertStatus = "Activa" | "Atendida" | "Descartada";

export interface PatientUI {
  idpaciente: number;
  id: string;
  name: string;
  age: number;
  gender: "M" | "F";
  condition: string;
  phone: string;
  address: string;
  doctor: string;
  /** Ritmo Cardíaco en bpm */
  hr: string;
  /** Saturación de oxígeno % */
  spo2: string;
  /** Glucosa mg/dL */
  glucose: string;
  /** Temperatura °C */
  temperatura: string;
  /** Presión Sistólica mmHg */
  presionSistolica: string;
  risk: RiskLevel;
  device: DeviceStatus;
  deviceModel: string;
  lastUpdate: string;
  /** Puntaje de salud general 0–100 (mayor = mejor). null si no hay evaluación. */
  scoreGeneral: number | null;
  notasMedicas?: string;
}

export interface AlertUI {
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
  doctorName?: string;
}

export interface ReportUI {
  id: string;
  title: string;
  type: string;
  generatedDate: string;
  period: string;
  patients: number;
  alerts: number;
  critical: number;
  avgRisk: string;
  status: string;
  size: string;
  description: string;
  doctor: string;
}

export interface KPIsData {
  totalPacientes: number;
  dispositivosActivos: number;
  evaluacionesPendientes: number;
  alertasActivas: number;
  alertasCriticas: number;
}

export interface RiskDistribution {
  bajo: number;
  moderado: number;
  alto: number;
}
