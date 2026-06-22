"use client";

import {
  FileBarChart2, Download, Calendar, Users,
  AlertTriangle, TrendingUp, Brain, Clock,
  CheckCircle2, Loader2, CalendarClock, FileSpreadsheet,
} from "lucide-react";
import { reports, patients, alerts, type Report } from "@/lib/data";
import { exportarExcel } from "@/lib/exportExcel";
import { useState } from "react";

const typeCfg: Record<Report["type"], { bg: string; color: string }> = {
  Semanal:   { bg: "#e3f0fb", color: "#1565c0" },
  Mensual:   { bg: "#f3e5f5", color: "#6a1b9a" },
  Específico:{ bg: "#fff8e1", color: "#f57f17" },
  ML:        { bg: "#e8f5e9", color: "#2e7d32" },
};

const statusCfg: Record<Report["status"], { icon: typeof CheckCircle2; color: string; bg: string }> = {
  Listo:      { icon: CheckCircle2,  color: "#2e7d32", bg: "#e8f5e9" },
  Generando:  { icon: Loader2,       color: "#1565c0", bg: "#e3f0fb" },
  Programado: { icon: CalendarClock, color: "#f57f17", bg: "#fff8e1" },
};

// Mini bar chart component
function MiniBar({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-1" style={{ height: 40 }}>
      {values.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm"
          style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.5 + (i / values.length) * 0.5 }} />
      ))}
    </div>
  );
}

// ── Toast de confirmación ─────────────────────────────────────────────────────
function Toast({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl animate-fade-in-up"
      style={{ background: "linear-gradient(135deg,#1b5e20,#2e7d32)", color: "white" }}
    >
      <FileSpreadsheet size={20} />
      <div>
        <p className="font-bold text-sm">¡Excel generado con éxito!</p>
        <p className="text-xs opacity-80">El archivo se descargó en tu equipo.</p>
      </div>
    </div>
  );
}

export default function ReportesPage() {
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState(false);

  const alertTrend   = [14, 21, 18, 29, 23, 17, 23];
  const patientTrend = [1180, 1195, 1208, 1220, 1235, 1240, 1245];
  const riskTrend    = [10, 13, 11, 15, 14, 12, 12];

  // KPIs rápidos para el banner
  const totalPacientes  = patients.length;
  const alertasActivas  = alerts.filter((a) => a.status === "Activa").length;
  const alertasCriticas = alerts.filter((a) => a.severity === "critical" && a.status === "Activa").length;

  function handleGenerarReporte() {
    setGenerating(true);
    // Pequeño delay visual para simular "generando"
    setTimeout(() => {
      exportarExcel();
      setGenerating(false);
      setToast(true);
      setTimeout(() => setToast(false), 4000);
    }, 1200);
  }

  function handleDescargar(reportId: string) {
    // Para reportes individuales también disparamos el mismo Excel
    // (en un sistema real cada uno sería un endpoint distinto)
    exportarExcel();
    setToast(true);
    setTimeout(() => setToast(false), 4000);
  }

  return (
    <div className="p-6 space-y-6">
      <Toast visible={toast} />

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--foreground)" }}>Reportes</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Historial de informes generados por el sistema SISP
          </p>
        </div>

        <button
          id="btn-generate-report"
          onClick={handleGenerarReporte}
          disabled={generating}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-70"
          style={{ background: "linear-gradient(135deg,#1565c0,#1e88e5)", boxShadow: "0 4px 14px rgba(21,101,192,0.35)" }}
        >
          {generating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generando…
            </>
          ) : (
            <>
              <FileSpreadsheet size={16} />
              Generar Excel
            </>
          )}
        </button>
      </div>

      {/* ── Banner rápido de datos exportados ── */}
      <div
        className="rounded-2xl p-5 grid grid-cols-3 gap-4"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}
      >
        {[
          { label: "Pacientes en reporte", value: totalPacientes, color: "#1565c0", icon: Users },
          { label: "Alertas activas",       value: alertasActivas,  color: "#e65100", icon: AlertTriangle },
          { label: "Alertas críticas",       value: alertasCriticas, color: "#c62828", icon: AlertTriangle },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-xl font-extrabold font-mono" style={{ color }}>{value}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Trend charts ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Alertas por Semana", values: alertTrend,   color: "#c62828", suffix: "alertas",   icon: AlertTriangle },
          { label: "Pacientes Activos",  values: patientTrend, color: "#1565c0", suffix: "pacientes",  icon: Users },
          { label: "Riesgo Alto (%)",    values: riskTrend,    color: "#e65100", suffix: "%",          icon: TrendingUp },
        ].map(({ label, values, color, suffix, icon: Icon }) => (
          <div key={label} className="rounded-2xl p-5"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Icon size={15} style={{ color }} />
              <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{label}</span>
            </div>
            <MiniBar values={values} color={color} />
            <div className="flex justify-between mt-2">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Últimas 7 semanas</span>
              <span className="text-xs font-bold" style={{ color }}>
                {values[values.length - 1]} {suffix}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── ML model note ── */}
      <div className="rounded-2xl p-5 flex items-center gap-4"
        style={{ background: "linear-gradient(135deg,#0d1b2e,#1a3a5c)", border: "1px solid #1e3a5c" }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(30,136,229,0.25)" }}>
          <Brain size={24} style={{ color: "#90caf9" }} />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold">Motor de Predicción ML — SISP-ML v3.2.1</p>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
            Modelo actualizado el 01 jun 2026 · Precisión global: <strong className="text-green-400">94.3%</strong> ·
            Recall para riesgo alto: <strong className="text-yellow-300">91.8%</strong>
          </p>
        </div>
        <button id="btn-view-ml-model"
          className="flex-shrink-0 text-xs font-semibold rounded-xl px-4 py-2"
          style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
          Ver detalles
        </button>
      </div>

      {/* ── Reports table ── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border-color)" }}>
          <h2 className="font-bold text-base" style={{ color: "var(--foreground)" }}>Historial de Reportes</h2>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: "#e3f0fb", color: "#1565c0" }}>
            {reports.length} reportes · exportable como Excel
          </span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
              {["ID", "Título", "Tipo", "Período", "Pacientes", "Alertas", "Riesgo Promedio", "Estado", "Tamaño", "Acción"].map(col => (
                <th key={col} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => {
              const tc = typeCfg[r.type];
              const sc = statusCfg[r.status];
              const StatusIcon = sc.icon;
              return (
                <tr key={r.id} id={`row-report-${r.id}`}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid var(--border-color)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#f8fafc"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>{r.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold" style={{ color: "var(--foreground)" }}>{r.title}</p>
                    <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--text-muted)" }}>
                      <Calendar size={10} /> {r.generatedDate}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-bold rounded-lg px-2 py-1" style={{ background: tc.bg, color: tc.color }}>
                      {r.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                      <Clock size={10} /> {r.period}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-semibold text-sm" style={{ color: "#1565c0" }}>{r.patients.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-semibold text-sm" style={{ color: r.alerts > 20 ? "#c62828" : "var(--foreground)" }}>
                      {r.alerts || "—"}
                    </span>
                    {r.critical > 0 && (
                      <span className="ml-1 text-xs rounded px-1.5 py-0.5 font-bold" style={{ background: "#ffebee", color: "#c62828" }}>
                        {r.critical} crit.
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{r.avgRisk}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-xs font-bold rounded-full px-2.5 py-1"
                      style={{ background: sc.bg, color: sc.color }}>
                      <StatusIcon size={11} className={r.status === "Generando" ? "animate-spin" : ""} />
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{r.size}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      id={`btn-download-${r.id}`}
                      disabled={r.status !== "Listo"}
                      onClick={() => r.status === "Listo" && handleDescargar(r.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all duration-150 hover:scale-105 active:scale-95"
                      style={{
                        background:  r.status === "Listo" ? "linear-gradient(135deg,#1565c0,#1e88e5)" : "#f5f5f5",
                        color:       r.status === "Listo" ? "white"                                   : "#bdbdbd",
                        cursor:      r.status === "Listo" ? "pointer"                                 : "not-allowed",
                        boxShadow:   r.status === "Listo" ? "0 2px 8px rgba(21,101,192,0.3)"         : "none",
                      }}
                    >
                      <Download size={12} />
                      {r.status === "Listo" ? "Excel" : "—"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
