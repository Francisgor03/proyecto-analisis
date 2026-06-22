// ─── SISP · Exportador Excel ─────────────────────────────────────────────────
// Genera un archivo .xlsx con múltiples hojas a partir de datos en vivo de Supabase.

import * as XLSX from "xlsx";
import type { PatientUI, AlertUI, ReportUI } from "@/lib/types";
import { configData } from "@/lib/data";

// ── Helpers ───────────────────────────────────────────────────────────────────
function autoWidth(ws: XLSX.WorkSheet) {
  const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
  const colWidths: number[] = [];
  data.forEach((row) => {
    (row as string[]).forEach((cell, ci) => {
      const len = cell ? String(cell).length + 2 : 10;
      if (!colWidths[ci] || colWidths[ci] < len) colWidths[ci] = len;
    });
  });
  ws["!cols"] = colWidths.map((w) => ({ wch: Math.min(w, 50) }));
}

// ── Hoja 1: Pacientes ─────────────────────────────────────────────────────────
function sheetPacientes(patients: PatientUI[]): XLSX.WorkSheet {
  const rows = patients.map((p) => ({
    "ID Paciente": p.id,
    "Nombre": p.name,
    "Edad": p.age,
    "Género": p.gender === "M" ? "Masculino" : "Femenino",
    "Condición": p.condition,
    "Teléfono": p.phone,
    "Domicilio": p.address,
    "Médico": p.doctor,
    "FC (bpm)": p.hr,
    "Glucosa (mg/dL)": p.glucose,
    "SpO2 (%)": p.spo2,
    "Temperatura (°C)": p.temperatura,
    "Presión Sistólica (mmHg)": p.presionSistolica,
    "Score General (/100)": p.scoreGeneral ?? "—",
    "Nivel de Riesgo": p.risk,
    "Dispositivo": p.device,
    "Modelo Dispositivo": p.deviceModel,
    "Última Actualización": p.lastUpdate,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  autoWidth(ws);
  return ws;
}

// ── Hoja 2: Alertas ───────────────────────────────────────────────────────────
function sheetAlertas(alerts: AlertUI[]): XLSX.WorkSheet {
  const rows = alerts.map((a) => ({
    "ID Alerta": a.id,
    "ID Paciente": a.patientId,
    "Paciente": a.patientName,
    "Edad": a.patientAge,
    "Tipo de Alerta": a.alertType,
    "Lectura": a.reading,
    "Riesgo Asociado": a.risk,
    "Severidad": a.severity === "critical" ? "Crítico" : a.severity === "high" ? "Alto" : "Medio",
    "Estado": a.status,
    "Tiempo": a.time,
    "Timestamp": a.timestamp,
    "Ubicación": a.location,
    "Atendida Por": a.attendedBy ?? "—",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  autoWidth(ws);
  return ws;
}

// ── Hoja 3: Reportes ──────────────────────────────────────────────────────────
function sheetReportes(reports: ReportUI[]): XLSX.WorkSheet {
  const rows = reports.map((r) => ({
    "ID Reporte": r.id,
    "Título": r.title,
    "Tipo": r.type,
    "Fecha Generación": r.generatedDate,
    "Período": r.period,
    "Pacientes": r.patients,
    "Total Alertas": r.alerts,
    "Alertas Críticas": r.critical,
    "Riesgo Promedio": r.avgRisk,
    "Estado": r.status,
    "Tamaño": r.size,
    "Descripción": r.description,
    "Doctor": r.doctor,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  autoWidth(ws);
  return ws;
}

// ── Hoja 4: Resumen KPI ───────────────────────────────────────────────────────
function sheetResumen(
  patients: PatientUI[],
  alerts: AlertUI[]
): XLSX.WorkSheet {
  const totalPacientes = patients.length;
  const conectados = patients.filter((p) => p.device === "Conectado").length;
  const riesgoAlto = patients.filter((p) => p.risk === "Alto").length;
  const riesgoModerado = patients.filter((p) => p.risk === "Moderado").length;
  const riesgoBajo = patients.filter((p) => p.risk === "Bajo").length;
  const alertasActivas = alerts.filter((a) => a.status === "Activa").length;
  const alertasCriticas = alerts.filter(
    (a) => a.severity === "critical" && a.status === "Activa"
  ).length;
  const alertasAtendidas = alerts.filter((a) => a.status === "Atendida").length;

  const rows = [
    { "Indicador": "Sistema", "Valor": "SISP — Sistema Inteligente de Salud Preventiva" },
    { "Indicador": "Médico Responsable", "Valor": configData.doctor.name },
    { "Indicador": "Especialidad", "Valor": configData.doctor.specialty },
    { "Indicador": "Institución", "Valor": configData.doctor.institution },
    { "Indicador": "Modelo ML", "Valor": configData.iomt.mlModelVersion },
    { "Indicador": "Precisión ML", "Valor": "94.3%" },
    { "Indicador": "—", "Valor": "—" },
    { "Indicador": "Total Pacientes Monitoreados", "Valor": totalPacientes },
    { "Indicador": "Dispositivos Conectados", "Valor": conectados },
    { "Indicador": "Dispositivos Sin Conexión", "Valor": totalPacientes - conectados },
    { "Indicador": "Pacientes Riesgo Alto", "Valor": riesgoAlto },
    { "Indicador": "Pacientes Riesgo Moderado", "Valor": riesgoModerado },
    { "Indicador": "Pacientes Riesgo Bajo", "Valor": riesgoBajo },
    { "Indicador": "—", "Valor": "—" },
    { "Indicador": "Alertas Activas", "Valor": alertasActivas },
    { "Indicador": "Alertas Críticas Activas", "Valor": alertasCriticas },
    { "Indicador": "Alertas Atendidas", "Valor": alertasAtendidas },
    { "Indicador": "—", "Valor": "—" },
    { "Indicador": "Fecha de Exportación", "Valor": new Date().toLocaleString("es-MX") },
  ];
  const ws = XLSX.utils.json_to_sheet(rows);
  autoWidth(ws);
  return ws;
}

// ── Exportador principal ──────────────────────────────────────────────────────
/**
 * Genera y descarga el Excel con datos en vivo de Supabase.
 * @param patients - Lista de pacientes obtenida con getPacientes()
 * @param alerts   - Lista de alertas obtenida con getAlertasCriticas()
 * @param reports  - Lista de reportes obtenida con getReportes()
 */
export function exportarExcel(
  patients: PatientUI[],
  alerts: AlertUI[],
  reports: ReportUI[]
) {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, sheetResumen(patients, alerts), "Resumen");
  XLSX.utils.book_append_sheet(wb, sheetPacientes(patients), "Pacientes");
  XLSX.utils.book_append_sheet(wb, sheetAlertas(alerts), "Alertas");
  XLSX.utils.book_append_sheet(wb, sheetReportes(reports), "Reportes");

  const fecha = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `SISP_Reporte_${fecha}.xlsx`);
}
