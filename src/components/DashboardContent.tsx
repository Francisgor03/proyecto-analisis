"use client";

import {
  Users,
  AlertTriangle,
  ClipboardList,
  Activity,
  TrendingUp,
} from "lucide-react";
import KPICard from "@/components/KPICard";
import CriticalAlertsPanel from "@/components/CriticalAlertsPanel";
import PatientsTable from "@/components/PatientsTable";

// Mini sparkline bars (purely decorative, simulating vitals trend)
function SparkBar({
  values,
  color,
}: {
  values: number[];
  color: string;
}) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-0.5" style={{ height: 32 }}>
      {values.map((v, i) => (
        <div
          key={i}
          className="rounded-sm flex-1 transition-all"
          style={{
            height: `${(v / max) * 100}%`,
            background: color,
            opacity: 0.5 + (i / values.length) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

// Risk distribution mini donut (pure CSS)
function RiskDonut() {
  // 65% low, 23% moderate, 12% high  → conic-gradient
  return (
    <div className="flex items-center gap-4">
      <div
        className="rounded-full flex-shrink-0"
        style={{
          width: 80,
          height: 80,
          background:
            "conic-gradient(#c62828 0% 12%, #f57f17 12% 35%, #2e7d32 35% 100%)",
          borderRadius: "50%",
          position: "relative",
        }}
      >
        {/* Donut hole */}
        <div
          className="absolute inset-0 m-auto rounded-full"
          style={{
            width: 50,
            height: 50,
            background: "white",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#2e7d32" }} />
          <span style={{ color: "var(--text-muted)" }}>Bajo</span>
          <span className="ml-auto font-bold" style={{ color: "var(--foreground)" }}>65%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#f57f17" }} />
          <span style={{ color: "var(--text-muted)" }}>Moderado</span>
          <span className="ml-auto font-bold" style={{ color: "var(--foreground)" }}>23%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#c62828" }} />
          <span style={{ color: "var(--text-muted)" }}>Alto</span>
          <span className="ml-auto font-bold" style={{ color: "var(--foreground)" }}>12%</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-full">
      {/* ── Section: KPI Cards ── */}
      <section
        id="kpi-section"
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        <KPICard
          id="kpi-active-patients"
          title="Pacientes Activos"
          value="1,245"
          subtitle="Monitoreados en tiempo real"
          icon={Users}
          trend={{ value: "+8 esta semana", up: true }}
          accentColor="#1565c0"
          accentBg="#e3f0fb"
          delay={0}
        />
        <KPICard
          id="kpi-critical-alerts"
          title="Alertas Críticas Hoy"
          value={3}
          subtitle="Requieren atención inmediata"
          icon={AlertTriangle}
          trend={{ value: "+1 vs ayer", up: false }}
          accentColor="#c62828"
          accentBg="#ffebee"
          delay={80}
        />
        <KPICard
          id="kpi-pending-evals"
          title="Evaluaciones Pendientes"
          value={12}
          subtitle="Análisis de riesgo en cola"
          icon={ClipboardList}
          trend={{ value: "-3 vs ayer", up: true }}
          accentColor="#e65100"
          accentBg="#fff3e0"
          delay={160}
        />
        <KPICard
          id="kpi-active-devices"
          title="Dispositivos IoMT"
          value="1,198"
          subtitle="96.2% conectividad activa"
          icon={Activity}
          trend={{ value: "96.2% uptime", up: true }}
          accentColor="#2e7d32"
          accentBg="#e8f5e9"
          delay={240}
        />
      </section>

      {/* ── Section: Middle row (Alerts + Stats) ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 340px" }}>
        {/* Critical Alerts Panel */}
        <CriticalAlertsPanel />

        {/* Right column: Risk distribution + Vitals trend */}
        <div className="flex flex-col gap-4">
          {/* Risk Distribution */}
          <div
            className="rounded-2xl p-5 animate-fade-in-up"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              animationDelay: "200ms",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} style={{ color: "var(--medical-blue)" }} />
              <h3
                className="font-bold text-sm"
                style={{ color: "var(--foreground)" }}
              >
                Distribución de Riesgo
              </h3>
            </div>
            <RiskDonut />
            <p
              className="text-xs mt-3 pt-3 border-t"
              style={{ color: "var(--text-muted)", borderColor: "var(--border-color)" }}
            >
              Basado en modelo ML — Actualizado hoy 19:28 h
            </p>
          </div>

          {/* Vitals trend sparklines */}
          <div
            className="rounded-2xl p-5 animate-fade-in-up flex-1"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              animationDelay: "280ms",
            }}
          >
            <h3
              className="font-bold text-sm mb-4"
              style={{ color: "var(--foreground)" }}
            >
              Tendencia de Signos Vitales
              <span
                className="ml-2 text-xs font-normal"
                style={{ color: "var(--text-muted)" }}
              >
                últimas 6 h · promedio
              </span>
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Presión Arterial",
                  unit: "mmHg",
                  values: [132, 135, 138, 142, 145, 140],
                  color: "#1565c0",
                  current: "140",
                },
                {
                  label: "Frecuencia Cardíaca",
                  unit: "bpm",
                  values: [74, 76, 80, 84, 88, 82],
                  color: "#c62828",
                  current: "82",
                },
                {
                  label: "Glucosa Promedio",
                  unit: "mg/dL",
                  values: [108, 112, 118, 124, 130, 122],
                  color: "#e65100",
                  current: "122",
                },
              ].map(({ label, unit, values, color, current }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-xs font-bold font-mono"
                      style={{ color }}
                    >
                      {current} {unit}
                    </span>
                  </div>
                  <SparkBar values={values} color={color} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section: Patients Table ── */}
      <PatientsTable />
    </div>
  );
}
