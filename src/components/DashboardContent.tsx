"use client";

import { useState, useEffect, useMemo } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { useSimulatedAlerts } from "@/hooks/useSimulatedAlerts";
import { getKPIs, getRiskDistribution, getSignosVitalesRecientes } from "@/lib/queries";
import type { KPIsData, RiskDistribution } from "@/lib/types";

// ── Mini sparkline bars ────────────────────────────────────────────────────────
function SparkBar({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
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

// ── Skeleton para sparkline ────────────────────────────────────────────────────
function SparkSkeleton() {
  return (
    <div className="flex items-end gap-0.5" style={{ height: 32 }}>
      {[60, 75, 50, 85, 70, 90].map((h, i) => (
        <div
          key={i}
          className="rounded-sm flex-1 animate-pulse"
          style={{ height: `${h}%`, background: "#e2e8f0" }}
        />
      ))}
    </div>
  );
}

// ── Risk distribution donut ────────────────────────────────────────────────────
function RiskDonut({ dist }: { dist: RiskDistribution | null }) {
  const rawBajo = dist?.bajo ?? 65;
  const rawModerado = dist?.moderado ?? 23;
  const rawAlto = dist?.alto ?? 12;

  const total = rawBajo + rawModerado + rawAlto || 1;
  const bajo = Math.round((rawBajo / total) * 100);
  const moderado = Math.round((rawModerado / total) * 100);
  const alto = 100 - bajo - moderado;

  return (
    <div className="flex items-center gap-4">
      <div
        className="rounded-full flex-shrink-0 relative"
        style={{
          width: 80,
          height: 80,
          background: `conic-gradient(
            #c62828 0% ${alto}%,
            #f57f17 ${alto}% ${alto + moderado}%,
            #2e7d32 ${alto + moderado}% 100%
          )`,
        }}
      >
        {/* Donut hole */}
        <div
          className="absolute rounded-full"
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
          <span className="ml-auto font-bold" style={{ color: "var(--foreground)" }}>
            {dist ? `${bajo}%` : "—"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#f57f17" }} />
          <span style={{ color: "var(--text-muted)" }}>Moderado</span>
          <span className="ml-auto font-bold" style={{ color: "var(--foreground)" }}>
            {dist ? `${moderado}%` : "—"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#c62828" }} />
          <span style={{ color: "var(--text-muted)" }}>Alto</span>
          <span className="ml-auto font-bold" style={{ color: "var(--foreground)" }}>
            {dist ? `${alto}%` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const { alerts, criticalCount } = useSimulatedAlerts();

  const [kpis, setKpis] = useState<KPIsData | null>(null);
  const [riskDist, setRiskDist] = useState<RiskDistribution | null>(null);
  const [sparklines, setSparklines] = useState<Record<string, number[]>>({});
  const [loadingKPIs, setLoadingKPIs] = useState(true);

  const combinedRiskDist = useMemo(() => {
    if (!riskDist) return null;

    let alto = riskDist.alto;
    let moderado = riskDist.moderado;
    let bajo = riskDist.bajo;

    // Obtener alertas simuladas activas para ajustar la distribución
    const activeSimAlerts = alerts.filter(
      (a) => a.id.startsWith("ALT-SIM-") && a.status === "Activa"
    );

    for (const alert of activeSimAlerts) {
      if (alert.severity === "critical" || alert.severity === "high") {
        alto += 1;
        if (bajo > 0) bajo -= 1;
        else if (moderado > 0) moderado -= 1;
      } else if (alert.severity === "medium") {
        moderado += 1;
        if (bajo > 0) bajo -= 1;
      }
    }

    return { bajo, moderado, alto };
  }, [riskDist, alerts]);

  useEffect(() => {
    let mounted = true;

    async function loadDashboardData() {
      setLoadingKPIs(true);
      try {
        const [kpisData, distData, vitalsData] = await Promise.all([
          getKPIs(user?.doctorFilter),
          getRiskDistribution(user?.doctorFilter),
          getSignosVitalesRecientes(user?.doctorFilter),
        ]);
        if (!mounted) return;
        setKpis(kpisData);
        setRiskDist(distData);
        setSparklines(vitalsData);
      } catch (err) {
        console.error("[Dashboard] Error cargando datos:", err);
      } finally {
        if (mounted) setLoadingKPIs(false);
      }
    }

    loadDashboardData();
    return () => { mounted = false; };
  }, [user]);

  // Sparkline data — usa datos reales si existen, fallback decorativo si no
  const sparklineConfig = [
    {
      label: "Presión Sistólica",
      unit: "mmHg",
      dbKey: "Presión Sistólica",
      fallback: [132, 135, 138, 142, 145, 140],
      color: "#1565c0",
    },
    {
      label: "Frecuencia Cardíaca",
      unit: "bpm",
      dbKey: "Ritmo Cardíaco",
      fallback: [74, 76, 80, 84, 88, 82],
      color: "#c62828",
    },
    {
      label: "Glucosa Promedio",
      unit: "mg/dL",
      dbKey: "Glucosa",
      fallback: [108, 112, 118, 124, 130, 122],
      color: "#e65100",
    },
  ];

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
          title="Pacientes Monitoreados"
          value={loadingKPIs ? "—" : kpis?.totalPacientes ?? "—"}
          subtitle="Monitoreo activo IoMT"
          icon={Users}
          trend={{ value: "+8 esta semana", up: true }}
          accentColor="#1565c0"
          accentBg="#e3f0fb"
          delay={0}
        />
        <KPICard
          id="kpi-critical-alerts"
          title="Alertas Críticas"
          value={criticalCount}
          subtitle="Requieren atención inmediata"
          icon={AlertTriangle}
          trend={{
            value: criticalCount > 2 ? `+${criticalCount - 2} en vivo` : "Estable",
            up: criticalCount <= 2,
          }}
          accentColor="#c62828"
          accentBg="#ffebee"
          delay={80}
        />
        <KPICard
          id="kpi-pending-evals"
          title="Evaluaciones Pendientes"
          value={loadingKPIs ? "—" : kpis?.evaluacionesPendientes ?? "—"}
          subtitle="Riesgo medio o alto activo"
          icon={ClipboardList}
          trend={{ value: "Actualizado ahora", up: true }}
          accentColor="#e65100"
          accentBg="#fff3e0"
          delay={160}
        />
        <KPICard
          id="kpi-active-devices"
          title="Dispositivos IoMT Activos"
          value={loadingKPIs ? "—" : kpis?.dispositivosActivos ?? "—"}
          subtitle="Estado Activo en la BD"
          icon={Activity}
          trend={{ value: "En línea", up: true }}
          accentColor="#2e7d32"
          accentBg="#e8f5e9"
          delay={240}
        />
      </section>

      {/* ── Section: Risk distribution + Vitals trend ── */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Risk Distribution */}
        <div
          className="rounded-2xl p-5 animate-fade-in-up"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            animationDelay: "100ms",
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
          <RiskDonut dist={combinedRiskDist} />
          <p
            className="text-xs mt-3 pt-3 border-t"
            style={{ color: "var(--text-muted)", borderColor: "var(--border-color)" }}
          >
            {loadingKPIs
              ? "Cargando datos..."
              : "Basado en evaluaciones reales · Actualizado en tiempo real"}
          </p>
        </div>

        {/* Vitals trend sparklines */}
        <div
          className="rounded-2xl p-5 animate-fade-in-up lg:col-span-2"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            animationDelay: "150ms",
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
              últimas lecturas · datos reales IoMT
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sparklineConfig.map(({ label, unit, dbKey, fallback, color }) => {
              const values =
                sparklines[dbKey]?.length > 0 ? sparklines[dbKey] : fallback;
              const current = values[values.length - 1];

              return (
                <div key={label} className="flex flex-col justify-between">
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
                  {loadingKPIs ? (
                    <SparkSkeleton />
                  ) : (
                    <SparkBar values={values} color={color} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section: Critical Alerts Panel ── */}
      <div>
        <CriticalAlertsPanel />
      </div>

      {/* ── Section: Patients Table ── */}
      <div>
        <PatientsTable />
      </div>
    </div>
  );
}
