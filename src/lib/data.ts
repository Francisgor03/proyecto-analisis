// ─── SISP · Tipos compartidos (sin datos hardcodeados) ───────────────────────
// Los datos reales vienen de Supabase — ver src/lib/queries.ts

// Re-exportamos los tipos de UI desde types.ts para compatibilidad
export type {
  RiskLevel,
  DeviceStatus,
  AlertSeverity,
  AlertStatus,
  PatientUI as Patient,
} from "./types";

// ── Interfaz Alert (usada por AlertsContext, TopBar, CriticalAlertsPanel) ────
export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  alertType: string;
  reading: string;
  risk: string;
  severity: "critical" | "high" | "medium";
  status: "Activa" | "Atendida" | "Descartada";
  time: string;
  timestamp: string;
  location: string;
  attendedBy?: string;
  doctorName?: string;
}

// ── Configuración estática ────────────────────────────────────────────────────
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
