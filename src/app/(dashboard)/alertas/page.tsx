"use client";

import { useState } from "react";
import {
  AlertTriangle, CheckCircle2, XCircle, Clock,
  Phone, Heart, ChevronRight, Siren, Info,
} from "lucide-react";
import { type Alert, type AlertSeverity, type AlertStatus } from "@/lib/data";
import { useSimulatedAlerts } from "@/hooks/useSimulatedAlerts";

type FilterStatus = "Todos" | AlertStatus;
type FilterSeverity = "Todos" | AlertSeverity;

const severityCfg: Record<AlertSeverity, { label: string; bg: string; color: string; headerBg: string }> = {
  critical: { label: "Crítico", bg: "#ffebee", color: "#c62828", headerBg: "linear-gradient(135deg,#c62828,#b71c1c)" },
  high: { label: "Alto", bg: "#fff3e0", color: "#e65100", headerBg: "linear-gradient(135deg,#e65100,#bf360c)" },
  medium: { label: "Medio", bg: "#fff8e1", color: "#f57f17", headerBg: "linear-gradient(135deg,#f57f17,#e65100)" },
};

const statusCfg: Record<AlertStatus, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  Activa: { icon: AlertTriangle, color: "#c62828", bg: "#ffebee" },
  Atendida: { icon: CheckCircle2, color: "#2e7d32", bg: "#e8f5e9" },
  Descartada: { icon: XCircle, color: "#757575", bg: "#f5f5f5" },
};

function AlertCard({ alert, onAttend }: { alert: Alert; onAttend: (id: string) => void }) {
  const sev = severityCfg[alert.severity];
  const sta = statusCfg[alert.status];
  const StatusIcon = sta.icon;
  const isActive = alert.status === "Activa";

  return (
    <div id={`alert-card-${alert.id}`}
      className="rounded-2xl overflow-hidden animate-fade-in-up"
      style={{ background: "var(--card-bg)", border: `1px solid ${isActive ? (alert.severity === "critical" ? "#ffcdd2" : "#ffe0b2") : "var(--border-color)"}`, boxShadow: isActive ? "0 2px 12px rgba(198,40,40,0.08)" : "none" }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ background: isActive ? sev.headerBg : "#f8fafc" }}>
        <div className="flex items-center gap-2">
          <Siren size={15} className={isActive ? "text-white" : ""} style={{ color: isActive ? undefined : sev.color }} />
          <span className="font-bold text-sm" style={{ color: isActive ? "white" : sev.color }}>
            {sev.label.toUpperCase()} — {alert.alertType}
          </span>
          <span className="text-xs rounded-full px-2 py-0.5 font-bold"
            style={{ background: "rgba(255,255,255,0.2)", color: isActive ? "white" : sev.color }}>
            {alert.id}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
          style={{ background: sta.bg, color: sta.color }}>
          <StatusIcon size={11} />
          {alert.status}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-bold text-base" style={{ color: "var(--foreground)" }}>{alert.patientName}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {alert.patientId} · {alert.patientAge} años · {alert.location}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-mono font-bold text-lg"
              style={{ color: alert.severity === "critical" ? "#c62828" : "#e65100" }}>
              {alert.reading}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Lectura</p>
          </div>
        </div>

        <div className="rounded-xl px-3 py-2 text-sm font-semibold"
          style={{ background: sev.bg, color: sev.color }}>
          ⚠ {alert.risk}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="flex items-center gap-1"><Clock size={11} /> {alert.time}</span>
            <span>·</span>
            <span>{alert.timestamp}</span>
            {alert.attendedBy && (
              <>
                <span>·</span>
                <span className="font-medium" style={{ color: "var(--medical-blue)" }}>
                  Atendido por {alert.attendedBy}
                </span>
              </>
            )}
          </div>
          {isActive && (
            <div className="flex gap-2">
              <button id={`btn-call-alert-${alert.id}`}
                className="flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5"
                style={{ background: "#e3f0fb", color: "#1565c0" }}>
                <Phone size={11} /> Llamar
              </button>
              <button id={`btn-attend-alert-${alert.id}`}
                onClick={() => onAttend(alert.id)}
                className="flex items-center gap-1 text-xs font-bold rounded-lg px-3 py-1.5 text-white"
                style={{ background: "linear-gradient(135deg,#c62828,#ef5350)" }}>
                <Heart size={11} /> Atender <ChevronRight size={11} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AlertasPage() {
  const { alerts, attendAlert } = useSimulatedAlerts();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("Todos");
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>("Todos");

  function handleAttend(id: string) {
    attendAlert(id);
  }

  const filtered = alerts.filter(a => {
    const matchStatus = filterStatus === "Todos" || a.status === filterStatus;
    const matchSev = filterSeverity === "Todos" || a.severity === filterSeverity;
    return matchStatus && matchSev;
  });

  const counts = {
    active: alerts.filter(a => a.status === "Activa").length,
    critical: alerts.filter(a => a.severity === "critical" && a.status === "Activa").length,
    attended: alerts.filter(a => a.status === "Atendida").length,
    dismissed: alerts.filter(a => a.status === "Descartada").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--foreground)" }}>
          Centro de Alertas
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Gestión centralizada de alertas generadas por IoMT y el motor de predicción ML
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Activas", val: counts.active, color: "#c62828", bg: "#ffebee" },
          { label: "Críticas Activas", val: counts.critical, color: "#b71c1c", bg: "#ffcdd2" },
          { label: "Atendidas Hoy", val: counts.attended, color: "#2e7d32", bg: "#e8f5e9" },
          { label: "Descartadas", val: counts.dismissed, color: "#757575", bg: "#f5f5f5" },
        ].map(({ label, val, color, bg }) => (
          <div key={label} className="rounded-2xl p-4 text-center"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
            <p className="text-3xl font-extrabold" style={{ color }}>{val}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: "var(--text-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="rounded-xl px-4 py-3 flex items-center gap-2 text-sm"
        style={{ background: "#e3f0fb", border: "1px solid #90caf9" }}>
        <Info size={15} style={{ color: "#1565c0", flexShrink: 0 }} />
        <span style={{ color: "#1565c0" }}>
          Al presionar <strong>Atender</strong>, la alerta se marcará como atendida. Los cambios se mantienen durante la sesión.
        </span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Estado:</span>
          {(["Todos", "Activa", "Atendida", "Descartada"] as FilterStatus[]).map(s => (
            <button key={s} id={`filter-status-${s}`}
              onClick={() => setFilterStatus(s)}
              className="text-xs font-semibold rounded-lg px-3 py-1.5 transition-all"
              style={{ background: filterStatus === s ? "var(--medical-blue)" : "#f1f5f9", color: filterStatus === s ? "white" : "var(--text-muted)" }}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Severidad:</span>
          {(["Todos", "critical", "high", "medium"] as FilterSeverity[]).map(s => (
            <button key={s} id={`filter-sev-${s}`}
              onClick={() => setFilterSeverity(s)}
              className="text-xs font-semibold rounded-lg px-3 py-1.5 transition-all capitalize"
              style={{ background: filterSeverity === s ? "var(--medical-blue)" : "#f1f5f9", color: filterSeverity === s ? "white" : "var(--text-muted)" }}>
              {s === "critical" ? "Crítico" : s === "high" ? "Alto" : s === "medium" ? "Medio" : s}
            </button>
          ))}
        </div>
        <p className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>{filtered.length} alertas</p>
      </div>

      {/* Alert list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl p-12 text-center"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
            <CheckCircle2 size={40} className="mx-auto mb-3 opacity-30" style={{ color: "#2e7d32" }} />
            <p className="font-semibold" style={{ color: "var(--text-muted)" }}>No hay alertas con los filtros aplicados.</p>
          </div>
        ) : filtered.map(a => (
          <AlertCard key={a.id} alert={a} onAttend={handleAttend} />
        ))}
      </div>
    </div>
  );
}
