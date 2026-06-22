"use client";

import { useState } from "react";
import {
  Users, Search, Filter, Wifi, WifiOff,
  Eye, Phone, ChevronRight, Heart, Activity,
  Droplets, Wind,
} from "lucide-react";
import { patients, type Patient, type RiskLevel } from "@/lib/data";

type FilterRisk = "Todos" | RiskLevel;
type FilterDevice = "Todos" | "Conectado" | "Sin Conexión";

const riskCfg = {
  Bajo: { bg: "#e8f5e9", color: "#2e7d32", dot: "#4caf50" },
  Moderado: { bg: "#fff8e1", color: "#f57f17", dot: "#ffca28" },
  Alto: { bg: "#ffebee", color: "#c62828", dot: "#ef5350" },
};

function RiskBadge({ level }: { level: RiskLevel }) {
  const c = riskCfg[level];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
      style={{ background: c.bg, color: c.color }}>
      <span className="rounded-full" style={{ width: 6, height: 6, background: c.dot }} />
      {level}
    </span>
  );
}

function DeviceBadge({ status }: { status: Patient["device"] }) {
  const on = status === "Conectado";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: on ? "#e3f0fb" : "#f5f5f5", color: on ? "#1565c0" : "#9e9e9e" }}>
      {on ? <Wifi size={11} /> : <WifiOff size={11} />}
      {status}
    </span>
  );
}

function StatVal({ val, unit, warn }: { val: string; unit?: string; warn: boolean }) {
  return (
    <span className="font-mono font-semibold text-sm"
      style={{ color: warn ? "var(--alert-red)" : "var(--foreground)" }}>
      {val}{unit && <span className="text-xs font-normal ml-0.5" style={{ color: "var(--text-muted)" }}>{unit}</span>}
    </span>
  );
}

// ── Patient detail modal ─────────────────────────────────────────────────────
function PatientModal({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const risk = riskCfg[patient.risk];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up"
        style={{ background: "var(--card-bg)" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 py-5 flex items-center gap-4"
          style={{ background: "linear-gradient(135deg, #0d1b2e, #1a3a5c)" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #42a5f5, #1565c0)" }}>
            {patient.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-lg leading-tight">{patient.name}</h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              {patient.id} · {patient.age} años · {patient.gender === "M" ? "Masculino" : "Femenino"}
            </p>
          </div>
          <button id="btn-close-modal" onClick={onClose}
            className="text-white rounded-lg px-3 py-1.5 text-xs font-medium"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            Cerrar ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "PA", val: patient.bp, unit: "mmHg", icon: Activity, warn: parseInt(patient.bp) > 140 },
              { label: "FC", val: patient.hr, unit: "bpm", icon: Heart, warn: parseInt(patient.hr) > 100 },
              { label: "Glucosa", val: patient.glucose, unit: "mg/dL", icon: Droplets, warn: parseInt(patient.glucose) < 70 || parseInt(patient.glucose) > 140 },
              { label: "SpO₂", val: patient.spo2, unit: "%", icon: Wind, warn: parseInt(patient.spo2) < 94 },
            ].map(({ label, val, unit, icon: Icon, warn }) => (
              <div key={label} className="rounded-xl p-3 text-center"
                style={{ background: warn ? "#fff5f5" : "#f8fafc", border: `1px solid ${warn ? "#ffcdd2" : "#e2e8f0"}` }}>
                <Icon size={16} className="mx-auto mb-1" style={{ color: warn ? "#c62828" : "#1565c0" }} />
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>
                <p className="font-bold text-sm mt-0.5" style={{ color: warn ? "#c62828" : "var(--foreground)" }}>{val}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{unit}</p>
              </div>
            ))}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Condición", val: patient.condition },
              { label: "Médico", val: patient.doctor },
              { label: "Teléfono", val: patient.phone },
              { label: "Peso", val: patient.weight },
              { label: "Dispositivo IoMT", val: patient.deviceModel },
              { label: "Inscripción", val: patient.enrolledDate },
            ].map(({ label, val }) => (
              <div key={label} className="rounded-xl p-3"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                <p className="font-semibold mt-0.5" style={{ color: "var(--foreground)" }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="rounded-xl p-3 text-sm" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Domicilio</p>
            <p className="font-semibold" style={{ color: "var(--foreground)" }}>{patient.address}</p>
          </div>

          {/* Notes */}
          <div className="rounded-xl p-3 text-sm"
            style={{ background: patient.risk === "Alto" ? "#fff5f5" : "#f0f9ff", border: `1px solid ${patient.risk === "Alto" ? "#ffcdd2" : "#bae6fd"}` }}>
            <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Notas clínicas</p>
            <p className="font-medium" style={{ color: patient.risk === "Alto" ? "#c62828" : "#0369a1" }}>{patient.notes}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button id={`btn-modal-call-${patient.id}`}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"
              style={{ background: "#e3f0fb", color: "#1565c0" }}>
              <Phone size={15} /> Llamar
            </button>
            <button id={`btn-modal-attend-${patient.id}`}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #1565c0, #1e88e5)" }}>
              <ChevronRight size={15} /> Ver Expediente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function PacientesPage() {
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState<FilterRisk>("Todos");
  const [filterDevice, setFilterDevice] = useState<FilterDevice>("Todos");
  const [selected, setSelected] = useState<Patient | null>(null);

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === "Todos" || p.risk === filterRisk;
    const matchDevice = filterDevice === "Todos" || p.device === filterDevice;
    return matchSearch && matchRisk && matchDevice;
  });

  const counts = {
    total: patients.length,
    alto: patients.filter(p => p.risk === "Alto").length,
    moderado: patients.filter(p => p.risk === "Moderado").length,
    bajo: patients.filter(p => p.risk === "Bajo").length,
    sinConexion: patients.filter(p => p.device === "Sin Conexión").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--foreground)" }}>
          Pacientes Monitoreados
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {counts.total} pacientes registrados en el sistema SISP
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Total", val: counts.total, color: "#1565c0", bg: "#e3f0fb" },
          { label: "Riesgo Alto", val: counts.alto, color: "#c62828", bg: "#ffebee" },
          { label: "Riesgo Moderado", val: counts.moderado, color: "#f57f17", bg: "#fff8e1" },
          { label: "Riesgo Bajo", val: counts.bajo, color: "#2e7d32", bg: "#e8f5e9" },
          { label: "Sin Conexión", val: counts.sinConexion, color: "#757575", bg: "#f5f5f5" },
        ].map(({ label, val, color, bg }) => (
          <div key={label} className="rounded-2xl p-4 text-center"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
            <p className="text-3xl font-extrabold" style={{ color }}>{val}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: "var(--text-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", flex: "1 1 220px", maxWidth: 300 }}>
          <Search size={15} style={{ color: "var(--text-muted)" }} />
          <input id="search-patients-page" type="text" placeholder="Buscar por nombre, ID o condición..."
            className="bg-transparent outline-none text-sm flex-1"
            style={{ color: "var(--foreground)" }}
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: "var(--text-muted)" }} />
          <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Riesgo:</span>
          {(["Todos", "Bajo", "Moderado", "Alto"] as FilterRisk[]).map(r => (
            <button key={r} id={`filter-risk-${r}`}
              onClick={() => setFilterRisk(r)}
              className="text-xs font-semibold rounded-lg px-3 py-1.5 transition-all"
              style={{
                background: filterRisk === r ? "var(--medical-blue)" : "#f1f5f9",
                color: filterRisk === r ? "white" : "var(--text-muted)",
              }}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Dispositivo:</span>
          {(["Todos", "Conectado", "Sin Conexión"] as FilterDevice[]).map(d => (
            <button key={d} id={`filter-device-${d.replace(" ", "-")}`}
              onClick={() => setFilterDevice(d)}
              className="text-xs font-semibold rounded-lg px-3 py-1.5 transition-all"
              style={{
                background: filterDevice === d ? "var(--medical-blue)" : "#f1f5f9",
                color: filterDevice === d ? "white" : "var(--text-muted)",
              }}>
              {d}
            </button>
          ))}
        </div>
        <p className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
          {filtered.length} resultados
        </p>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
              {["ID / Paciente", "Condición", "PA (mmHg)", "FC (bpm)", "Glucosa", "SpO₂", "Riesgo", "IoMT", "Acciones"].map(col => (
                <th key={col} className="px-4 py-3 text-left text-xs font-semibold"
                  style={{ color: "var(--text-muted)" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  <Users size={32} className="mx-auto mb-2 opacity-30" />
                  No se encontraron pacientes con los filtros aplicados.
                </td>
              </tr>
            ) : filtered.map((p, i) => (
              <tr key={p.id} id={`row-patient-${p.id}`}
                className="transition-colors duration-150 cursor-pointer"
                style={{ borderBottom: "1px solid var(--border-color)" }}
                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#f8fafc"}
                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                onClick={() => setSelected(p)}>
                <td className="px-4 py-3.5">
                  <p className="font-semibold leading-tight" style={{ color: "var(--foreground)" }}>{p.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{p.id} · {p.age} años · {p.lastUpdate}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs font-medium rounded-lg px-2 py-1"
                    style={{ background: "#f1f5f9", color: "var(--text-muted)" }}>{p.condition}</span>
                </td>
                <td className="px-4 py-3.5">
                  <StatVal val={p.bp} warn={parseInt(p.bp) > 140} />
                </td>
                <td className="px-4 py-3.5">
                  <StatVal val={p.hr} warn={parseInt(p.hr) > 100} />
                </td>
                <td className="px-4 py-3.5">
                  <StatVal val={p.glucose} unit="mg/dL" warn={parseInt(p.glucose) < 70 || parseInt(p.glucose) > 140} />
                </td>
                <td className="px-4 py-3.5">
                  <StatVal val={`${p.spo2}%`} warn={parseInt(p.spo2) < 94} />
                </td>
                <td className="px-4 py-3.5"><RiskBadge level={p.risk} /></td>
                <td className="px-4 py-3.5"><DeviceBadge status={p.device} /></td>
                <td className="px-4 py-3.5">
                  <button id={`btn-view-${p.id}`}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
                    style={{ background: "var(--medical-blue-pale)", color: "var(--medical-blue)" }}
                    onClick={e => { e.stopPropagation(); setSelected(p); }}>
                    <Eye size={12} /> Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && <PatientModal patient={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
