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
import { useSimulatedAlerts } from "@/hooks/useSimulatedAlerts";
import { Alert } from "@/lib/data";
import Link from "next/link";

interface AlertCardProps {
  alert: Alert;
  index: number;
  onAttend: (id: string) => void;
  onDismiss: (id: string) => void;
}

function AlertCard({ alert, index, onAttend, onDismiss }: AlertCardProps) {
  const isCritical = alert.severity === "critical";

  return (
    <div
      id={`alert-card-${alert.id}`}
      className="rounded-xl p-4 animate-fade-in-down relative overflow-hidden transition-all duration-300"
      style={{
        background: isCritical
          ? "linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%)"
          : "linear-gradient(135deg, #fff8f0 0%, #fff4e8 100%)",
        border: `1px solid ${isCritical ? "#ffcdd2" : "#ffe0b2"}`,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
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
            <Siren size={17} className="text-white animate-bounce" style={{ animationDuration: "2s" }} />
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
                {alert.patientId} · {alert.patientAge} años · {alert.location}
              </p>
            </div>
            <button
              id={`btn-dismiss-${alert.id}`}
              onClick={() => onDismiss(alert.id)}
              className="rounded-full p-1 hover:bg-slate-100 transition-colors"
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
                className="flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all duration-150 hover:bg-[#d0e5f7]"
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
                onClick={() => onAttend(alert.id)}
                className="flex items-center gap-1 text-xs font-bold rounded-lg px-3 py-1.5 text-white transition-all duration-150 hover:opacity-90 shadow-sm"
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
  const { alerts, attendAlert, dismissAlert } = useSimulatedAlerts();

  // Filter only active critical alerts to show in the side panel
  const activeAlerts = alerts.filter((a) => a.status === "Activa");

  return (
    <section
      id="critical-alerts-panel"
      className="rounded-2xl overflow-hidden flex flex-col h-full"
      style={{
        background: "var(--card-bg)",
        border: "1px solid #ffcdd2",
        boxShadow:
          "0 4px 16px rgba(198,40,40,0.06), 0 1px 4px rgba(198,40,40,0.03)",
      }}
    >
      {/* Panel header */}
      <div
        className="px-5 py-4 flex items-center justify-between flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #c62828 0%, #b71c1c 100%)",
        }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <AlertTriangle size={18} className="text-white" />
          <span className="text-white font-bold text-sm">
            Monitoreo Clínico
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-extrabold"
            style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
          >
            {activeAlerts.length}
          </span>
          
          {/* Pulse Monitoring Badge requested by user */}
          <span
            className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold bg-[#e8f5e9]/90 text-[#2e7d32] border border-[#2e7d32]/20"
          >
            <span
              className="inline-block rounded-full w-1.5 h-1.5 bg-[#4caf50] animate-pulse"
            />
            MONITOREANDO
          </span>
        </div>

        <Link
          id="btn-view-all-alerts"
          href="/alertas"
          className="flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all bg-white/20 text-white hover:bg-white/30"
        >
          Ver todas
          <ChevronRight size={12} />
        </Link>
      </div>

      {/* Alert cards container */}
      <div className="p-4 space-y-3 overflow-y-auto max-h-[500px] flex-1">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-10 px-4">
            <p className="text-sm font-semibold text-slate-400">
              No hay alertas críticas activas en este momento.
            </p>
            <p className="text-xs text-slate-300 mt-1">
              El sistema continúa monitoreando señales IoMT...
            </p>
          </div>
        ) : (
          activeAlerts.map((alert, i) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              index={i}
              onAttend={attendAlert}
              onDismiss={dismissAlert}
            />
          ))
        )}
      </div>
    </section>
  );
}
