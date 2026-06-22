"use client";

import {
  FileBarChart2, Download, Calendar, Users,
  AlertTriangle, TrendingUp, Brain, Clock,
  CheckCircle2, Loader2, CalendarClock,
} from "lucide-react";
import { reports, type Report } from "@/lib/data";

const typeCfg: Record<Report["type"], { bg: string; color: string }> = {
  Semanal: { bg: "#e3f0fb", color: "#1565c0" },
  Mensual: { bg: "#f3e5f5", color: "#6a1b9a" },
  Específico: { bg: "#fff8e1", color: "#f57f17" },
  ML: { bg: "#e8f5e9", color: "#2e7d32" },
};

const statusCfg: Record<Report["status"], { icon: typeof CheckCircle2; color: string; bg: string }> = {
  Listo: { icon: CheckCircle2, color: "#2e7d32", bg: "#e8f5e9" },
  Generando: { icon: Loader2, color: "#1565c0", bg: "#e3f0fb" },
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

export default function ReportesPage() {
  const alertTrend = [14, 21, 18, 29, 23, 17, 23];
  const patientTrend = [1180, 1195, 1208, 1220, 1235, 1240, 1245];
  const riskTrend = [10, 13, 11, 15, 14, 12, 12];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--foreground)" }}>Reportes</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Historial de informes generados por el sistema SISP
          </p>
        </div>
        <button id="btn-generate-report"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg,#1565c0,#1e88e5)" }}>
          <FileBarChart2 size={16} /> Generar Reporte
        </button>
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Alertas por Semana", values: alertTrend, color: "#c62828", suffix: "alertas", icon: AlertTriangle },
          { label: "Pacientes Activos", values: patientTrend, color: "#1565c0", suffix: "pacientes", icon: Users },
          { label: "Riesgo Alto (%)", values: riskTrend, color: "#e65100", suffix: "%", icon: TrendingUp },
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

      {/* ML model note */}
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

      {/* Reports table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
          <h2 className="font-bold text-base" style={{ color: "var(--foreground)" }}>Historial de Reportes</h2>
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
            {reports.map((r, i) => {
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
                    <button id={`btn-download-${r.id}`}
                      disabled={r.status !== "Listo"}
                      className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all"
                      style={{
                        background: r.status === "Listo" ? "var(--medical-blue-pale)" : "#f5f5f5",
                        color: r.status === "Listo" ? "var(--medical-blue)" : "#bdbdbd",
                        cursor: r.status === "Listo" ? "pointer" : "not-allowed",
                      }}>
                      <Download size={12} />
                      {r.status === "Listo" ? "Descargar" : "—"}
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
