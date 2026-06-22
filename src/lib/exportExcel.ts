// ─── SISP · Exportador Excel ─────────────────────────────────────────────────
// Genera un archivo .xlsx con múltiples hojas a partir de los datos hardcodeados.

import * as XLSX from "xlsx";
import { patients, alerts, reports, configData } from "@/lib/data";

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
function sheetPacientes(): XLSX.WorkSheet {
  const rows = patients.map((p) => ({
    "ID Paciente": p.id,
    "Nombre": p.name,
    "Edad": p.age,
    "Género": p.gender === "M" ? "Masculino" : "Femenino",
    "Condición": p.condition,
    "Teléfono": p.phone,
    "Domicilio": p.address,
    "Médico": p.doctor,
    "Presión Arterial": p.bp,
    "FC (bpm)": p.hr,
    "Glucosa (mg/dL)": p.glucose,
    "SpO2 (%)": p.spo2,
    "Peso": p.weight,
    "Nivel de Riesgo": p.risk,
    "Dispositivo": p.device,
    "Modelo Dispositivo": p.deviceModel,
    "Última Actualización": p.lastUpdate,
    "Fecha Inscripción": p.enrolledDate,
    "Notas Clínicas": p.notes,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  autoWidth(ws);
  return ws;
}

// ── Hoja 2: Alertas ───────────────────────────────────────────────────────────
function sheetAlertas(): XLSX.WorkSheet {
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
function sheetReportes(): XLSX.WorkSheet {
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
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  autoWidth(ws);
  return ws;
}

// ── Hoja 4: Resumen KPI ───────────────────────────────────────────────────────
function sheetResumen(): XLSX.WorkSheet {
  const totalPacientes = patients.length;
  const conectados = patients.filter((p) => p.device === "Conectado").length;
  const riesgoAlto = patients.filter((p) => p.risk === "Alto").length;
  const riesgoModerado = patients.filter((p) => p.risk === "Moderado").length;
  const riesgoBajo = patients.filter((p) => p.risk === "Bajo").length;
  const alertasActivas = alerts.filter((a) => a.status === "Activa").length;
  const alertasCriticas = alerts.filter((a) => a.severity === "critical" && a.status === "Activa").length;
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
export function exportarExcel() {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, sheetResumen(), "Resumen");
  XLSX.utils.book_append_sheet(wb, sheetPacientes(), "Pacientes");
  XLSX.utils.book_append_sheet(wb, sheetAlertas(), "Alertas");
  XLSX.utils.book_append_sheet(wb, sheetReportes(), "Reportes");

  const fecha = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `SISP_Reporte_${fecha}.xlsx`);
}
