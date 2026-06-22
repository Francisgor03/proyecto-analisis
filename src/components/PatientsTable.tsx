"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wifi,
  WifiOff,
  Wrench,
  ChevronRight,
  ArrowUpDown,
  Eye,
  RefreshCw,
} from "lucide-react";
import { getPacientes } from "@/lib/queries";
import type { PatientUI, RiskLevel, DeviceStatus } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

// ── Configuraciones de estilo ─────────────────────────────────────────────────

const riskConfig: Record<RiskLevel, { bg: string; color: string; dot: string }> = {
  Bajo:     { bg: "#e8f5e9", color: "#2e7d32",  dot: "#4caf50" },
  Moderado: { bg: "#fff8e1", color: "#f57f17",  dot: "#ffca28" },
  Alto:     { bg: "#ffebee", color: "#c62828",  dot: "#ef5350" },
};

// ── Subcomponentes ────────────────────────────────────────────────────────────

function RiskBadge({ level }: { level: RiskLevel }) {
  const cfg = riskConfig[level];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span
        className="rounded-full flex-shrink-0"
        style={{ width: 6, height: 6, background: cfg.dot }}
      />
      {level}
    </span>
  );
}

function DeviceBadge({ status }: { status: DeviceStatus }) {
  const isConnected = status === "Conectado";
  const isMaintenance = status === "Mantenimiento";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{
        background: isConnected ? "#e3f0fb" : isMaintenance ? "#fff8e1" : "#f5f5f5",
        color:      isConnected ? "#1565c0" : isMaintenance ? "#f57f17" : "#9e9e9e",
      }}
    >
      {isConnected ? (
        <Wifi size={11} />
      ) : isMaintenance ? (
        <Wrench size={11} />
      ) : (
        <WifiOff size={11} />
      )}
      {status}
    </span>
  );
}

function VitalCell({
  value,
  unit,
  warnIf,
}: {
  value: string;
  unit?: string;
  warnIf?: (v: number) => boolean;
}) {
  const num = parseFloat(value);
  const isWarning = !isNaN(num) && warnIf ? warnIf(num) : false;
  return (
    <span
      className="font-mono font-semibold text-sm"
      style={{
        color: isWarning
          ? "var(--alert-red)"
          : value === "—"
          ? "var(--text-muted)"
          : "var(--foreground)",
      }}
    >
      {value === "—" ? "—" : `${value}${unit ? ` ${unit}` : ""}`}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div
            className="rounded animate-pulse"
            style={{
              height: i === 0 ? 36 : 20,
              width: i === 8 ? 80 : "80%",
              background: "#f1f5f9",
            }}
          />
        </td>
      ))}
    </tr>
  );
}

// ── Barra de puntaje general ──────────────────────────────────────────────────
function ScoreBar({ score }: { score: number | null }) {
  if (score === null) {
    return <span className="text-xs" style={{ color: "var(--text-muted)" }}>—</span>;
  }

  const color =
    score >= 80 ? "#2e7d32" :
    score >= 60 ? "#f57f17" :
    "#c62828";

  const bg =
    score >= 80 ? "#e8f5e9" :
    score >= 60 ? "#fff8e1" :
    "#ffebee";

  return (
    <div className="flex flex-col gap-1" style={{ minWidth: 80 }}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold font-mono" style={{ color }}>
          {score.toFixed(1)}
        </span>
        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>/100</span>
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: 6, background: "#f1f5f9" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function PatientsTable() {
  const [patients, setPatients] = useState<PatientUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  async function loadPatients() {
    setLoading(true);
    setError(null);
    try {
      const data = await getPacientes(user?.doctorFilter);
      setPatients(data);
    } catch (err) {
      console.error("[PatientsTable] Error:", err);
      setError("No se pudo conectar a la base de datos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, [user]);

  const columns = [
    "ID / Paciente",
    "Condición",
    "FC (bpm)",
    "SpO₂ (%)",
    "Glucosa (mg/dL)",
    "Nivel de Riesgo",
    "Score General",
    "Dispositivo IoMT",
    "Acciones",
  ];

  return (
    <section
      id="patients-table"
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between border-b"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div>
          <h2 className="font-bold text-base" style={{ color: "var(--foreground)" }}>
            Pacientes Monitoreados
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {loading
              ? "Cargando desde Supabase..."
              : error
              ? "Error de conexión"
              : `${patients.length} pacientes · Datos en tiempo real via IoMT`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-refresh-patients"
            onClick={loadPatients}
            disabled={loading}
            className="flex items-center justify-center rounded-xl transition-all duration-200"
            style={{
              width: 36,
              height: 36,
              background: "#f1f5f9",
              color: "var(--text-muted)",
            }}
            title="Recargar datos"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <Link
            id="btn-view-all-patients"
            href="/pacientes"
            className="flex items-center gap-1 text-sm font-semibold rounded-xl px-4 py-2 transition-all cursor-pointer"
            style={{
              background: "var(--medical-blue-pale)",
              color: "var(--medical-blue)",
            }}
          >
            Ver todos
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="px-5 py-4 text-sm text-red-600 bg-red-50 border-b border-red-100">
          ⚠ {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-semibold text-xs whitespace-nowrap"
                  style={{
                    color: "var(--text-muted)",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  <span className="flex items-center gap-1">
                    {col}
                    {col !== "Acciones" && (
                      <ArrowUpDown size={11} style={{ opacity: 0.4 }} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : patients.length === 0 && !error ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  No hay pacientes registrados.
                </td>
              </tr>
            ) : (
              patients.map((patient, i) => {
                const isHighRisk = patient.risk === "Alto";
                return (
                  <tr
                    key={patient.id}
                    id={`row-${patient.id}`}
                    className="transition-colors duration-150"
                    style={{
                      background: isHighRisk
                        ? "rgba(198,40,40,0.02)"
                        : "transparent",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        isHighRisk ? "rgba(198,40,40,0.05)" : "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        isHighRisk ? "rgba(198,40,40,0.02)" : "transparent";
                    }}
                  >
                    {/* ID + Nombre */}
                    <td className="px-4 py-3.5">
                      <div>
                        <p
                          className="font-semibold leading-tight"
                          style={{ color: "var(--foreground)" }}
                        >
                          {patient.name}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {patient.id} · {patient.age} años · {patient.gender === "M" ? "Masculino" : "Femenino"}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-muted)", opacity: 0.7 }}
                        >
                          {patient.lastUpdate}
                        </p>
                      </div>
                    </td>

                    {/* Condición */}
                    <td className="px-4 py-3.5">
                      <span
                        className="text-xs font-medium rounded-lg px-2 py-1"
                        style={{ background: "#f1f5f9", color: "var(--text-muted)" }}
                      >
                        {patient.condition}
                      </span>
                    </td>

                    {/* FC */}
                    <td className="px-4 py-3.5">
                      <VitalCell
                        value={patient.hr}
                        warnIf={(v) => v > 100 || v < 50}
                      />
                    </td>

                    {/* SpO2 */}
                    <td className="px-4 py-3.5">
                      <VitalCell
                        value={patient.spo2}
                        warnIf={(v) => v < 94}
                      />
                    </td>

                    {/* Glucosa */}
                    <td className="px-4 py-3.5">
                      <VitalCell
                        value={patient.glucose}
                        warnIf={(v) => v < 70 || v > 140}
                      />
                    </td>

                    {/* Riesgo */}
                    <td className="px-4 py-3.5">
                      <RiskBadge level={patient.risk} />
                    </td>

                    {/* Score General */}
                    <td className="px-4 py-3.5">
                      <ScoreBar score={patient.scoreGeneral} />
                    </td>

                    {/* Dispositivo */}
                    <td className="px-4 py-3.5">
                      <div>
                        <DeviceBadge status={patient.device} />
                        <p
                          className="text-xs mt-1"
                          style={{ color: "var(--text-muted)", opacity: 0.8 }}
                        >
                          {patient.deviceModel}
                        </p>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3.5">
                      <Link
                        id={`btn-view-patient-${patient.id}`}
                        href={`/pacientes/${patient.idpaciente}`}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer"
                        style={{
                          background: "var(--medical-blue-pale)",
                          color: "var(--medical-blue)",
                        }}
                        title={`Ver expediente de ${patient.name}`}
                      >
                        <Eye size={12} />
                        Expediente
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 flex items-center justify-between border-t"
        style={{ borderColor: "var(--border-color)", background: "#f8fafc" }}
      >
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Mostrando{" "}
          <strong>{loading ? "…" : patients.length}</strong> pacientes
          {" · "}
          <span style={{ color: "var(--medical-blue)" }}>Supabase en vivo</span>
        </p>
        <div className="flex gap-2">
          {["Anterior", "1", "Siguiente"].map((label) => (
            <button
              key={label}
              id={`btn-page-${label}`}
              className="text-xs rounded-lg px-3 py-1.5 font-medium transition-all"
              style={{
                background: label === "1" ? "var(--medical-blue)" : "#f1f5f9",
                color: label === "1" ? "white" : "var(--text-muted)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
