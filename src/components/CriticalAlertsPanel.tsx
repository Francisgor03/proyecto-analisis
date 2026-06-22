"use client";

import {
  AlertTriangle,
  Heart,
  Phone,
  Clock,
  ChevronRight,
  Siren,
  X,
} from "lucide-react";
import { useState } from "react";

interface CriticalAlert {
  id: string;
  patientName: string;
  patientId: string;
  age: number;
  alertType: string;
  reading: string;
  risk: string;
  riskLevel: "critical" | "high";
  time: string;
  location: string;
}

const criticalAlerts: CriticalAlert[] = [
  {
    id: "ALT-2024-001",
    patientName: "Carlos Mendoza",
    patientId: "PAC-00312",
    age: 58,
    alertType: "Pico de Presión Arterial",
    reading: "180/120 mmHg",
    risk: "Riesgo de Infarto Agudo al Miocardio",
    riskLevel: "critical",
    time: "Hace 4 min",
    location: "Zona Norte · CDMX",
  },
  {
    id: "ALT-2024-002",
    patientName: "María González",
    patientId: "PAC-00589",
    age: 65,
    alertType: "Hipoglucemia Severa",
    reading: "48 mg/dL",
    risk: "Riesgo de Coma Diabético",
    riskLevel: "critical",
    time: "Hace 11 min",
    location: "Zona Sur · CDMX",
  },
  {
    id: "ALT-2024-003",
    patientName: "Roberto Sánchez",
    patientId: "PAC-00741",
    age: 71,
    alertType: "Arritmia Detectada",
    reading: "FC: 142 bpm (irregular)",
    risk: "Fibrilación Auricular",
    riskLevel: "high",
    time: "Hace 23 min",
    location: "Zona Este · CDMX",
  },
];

function AlertCard({ alert, index }: { alert: CriticalAlert; index: number }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const isCritical = alert.riskLevel === "critical";

  return (
    <div
      id={`alert-card-${alert.id}`}
      className="rounded-xl p-4 animate-fade-in-up relative overflow-hidden"
      style={{
        background: isCritical
          ? "linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%)"
          : "linear-gradient(135deg, #fff8f0 0%, #fff4e8 100%)",
        border: `1px solid ${isCritical ? "#ffcdd2" : "#ffe0b2"}`,
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Left accent stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{
          background: isCritical
            ? "linear-gradient(180deg, #c62828, #ef5350)"
            : "linear-gradient(180deg, #e65100, #ff7043)",
        }}
      />

      <div className="pl-3 flex items-start gap-3">
        {/* Icon with pulse */}
        <div className="relative flex-shrink-0 mt-0.5">
          <div
            className="rounded-full flex items-center justify-center relative"
            style={{
              width: 36,
              height: 36,
              background: isCritical ? "#c62828" : "#e65100",
            }}
          >
            <Siren size={17} className="text-white" />
          </div>
          {/* Pulse ring */}
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: isCritical
                ? "rgba(198,40,40,0.25)"
                : "rgba(230,81,0,0.25)",
              animation: "pulse-ring 1.8s ease-out infinite",
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p
                className="text-sm font-bold leading-tight"
                style={{ color: isCritical ? "#b71c1c" : "#bf360c" }}
              >
                {alert.patientName}
              </p>
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {alert.patientId} · {alert.age} años · {alert.location}
              </p>
            </div>
            <button
              id={`btn-dismiss-${alert.id}`}
              onClick={() => setDismissed(true)}
              className="rounded-full p-1 transition-colors"
              style={{ color: "var(--text-muted)" }}
              title="Descartar alerta"
            >
              <X size={14} />
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold"
              style={{
                background: isCritical ? "#c62828" : "#e65100",
                color: "white",
              }}
            >
              <AlertTriangle size={11} />
              {alert.alertType}
            </span>
            <span
              className="text-xs font-mono font-bold rounded-lg px-2 py-1"
              style={{ background: "rgba(0,0,0,0.07)", color: "var(--foreground)" }}
            >
              {alert.reading}
            </span>
          </div>

          <p
            className="text-xs mt-2 font-semibold"
            style={{ color: isCritical ? "#c62828" : "#e65100" }}
          >
            ⚠ {alert.risk}
          </p>

          <div className="flex items-center gap-3 mt-3">
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <Clock size={11} />
              {alert.time}
            </span>
            <span className="text-xs" style={{ color: "var(--border-color)" }}>
              ·
            </span>
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              {alert.id}
            </span>

            <div className="ml-auto flex gap-2">
              <button
                id={`btn-call-${alert.id}`}
                className="flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all duration-150"
                style={{
                  background: "#e3f0fb",
                  color: "var(--medical-blue)",
                }}
              >
                <Phone size={11} />
                Llamar
              </button>
              <button
                id={`btn-attend-${alert.id}`}
                className="flex items-center gap-1 text-xs font-bold rounded-lg px-3 py-1.5 text-white transition-all duration-150"
                style={{
                  background: isCritical
                    ? "linear-gradient(135deg, #c62828, #ef5350)"
                    : "linear-gradient(135deg, #e65100, #ff7043)",
                }}
              >
                <Heart size={11} />
                Atender
                <ChevronRight size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CriticalAlertsPanel() {
  return (
    <section
      id="critical-alerts-panel"
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--card-bg)",
        border: "1px solid #ffcdd2",
        boxShadow:
          "0 4px 16px rgba(198,40,40,0.1), 0 1px 4px rgba(198,40,40,0.05)",
      }}
    >
      {/* Panel header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, #c62828 0%, #b71c1c 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-white" />
          <span className="text-white font-bold text-sm">
            Alertas Críticas — Prioridad Alta
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-extrabold"
            style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
          >
            3
          </span>
          {/* Live indicator */}
          <span
            className="ml-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
            style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
          >
            <span
              className="inline-block rounded-full live-dot"
              style={{ width: 6, height: 6, background: "#ffca28" }}
            />
            EN VIVO
          </span>
        </div>
        <button
          id="btn-view-all-alerts"
          className="flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all"
          style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
        >
          Ver todas
          <ChevronRight size={12} />
        </button>
      </div>

      {/* Alert cards */}
      <div className="p-4 space-y-3">
        {criticalAlerts.map((alert, i) => (
          <AlertCard key={alert.id} alert={alert} index={i} />
        ))}
      </div>
    </section>
  );
}
