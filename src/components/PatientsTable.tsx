"use client";

import {
  Wifi,
  WifiOff,
  ChevronRight,
  ArrowUpDown,
  Eye,
} from "lucide-react";

type RiskLevel = "Bajo" | "Moderado" | "Alto";

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  bp: string;
  hr: string;
  glucose: string;
  risk: RiskLevel;
  device: "Conectado" | "Sin Conexión";
  lastUpdate: string;
}

const patients: Patient[] = [
  {
    id: "PAC-00101",
    name: "Ana Martínez",
    age: 52,
    condition: "Hipertensión",
    bp: "135/88",
    hr: "78",
    glucose: "102",
    risk: "Bajo",
    device: "Conectado",
    lastUpdate: "hace 1 min",
  },
  {
    id: "PAC-00312",
    name: "Carlos Mendoza",
    age: 58,
    condition: "Hipertensión + DM2",
    bp: "180/120",
    hr: "92",
    glucose: "178",
    risk: "Alto",
    device: "Conectado",
    lastUpdate: "hace 4 min",
  },
  {
    id: "PAC-00445",
    name: "Laura Pérez",
    age: 44,
    condition: "Diabetes T2",
    bp: "122/80",
    hr: "71",
    glucose: "134",
    risk: "Moderado",
    device: "Conectado",
    lastUpdate: "hace 3 min",
  },
  {
    id: "PAC-00589",
    name: "María González",
    age: 65,
    condition: "Diabetes T1",
    bp: "118/76",
    hr: "88",
    glucose: "48",
    risk: "Alto",
    device: "Conectado",
    lastUpdate: "hace 11 min",
  },
  {
    id: "PAC-00620",
    name: "Jorge Herrera",
    age: 61,
    condition: "Insuf. Cardíaca",
    bp: "128/84",
    hr: "66",
    glucose: "98",
    risk: "Moderado",
    device: "Sin Conexión",
    lastUpdate: "hace 42 min",
  },
  {
    id: "PAC-00741",
    name: "Roberto Sánchez",
    age: 71,
    condition: "Arritmia",
    bp: "142/90",
    hr: "142",
    glucose: "110",
    risk: "Alto",
    device: "Conectado",
    lastUpdate: "hace 23 min",
  },
  {
    id: "PAC-00803",
    name: "Patricia López",
    age: 39,
    condition: "Hipertensión leve",
    bp: "130/82",
    hr: "74",
    glucose: "95",
    risk: "Bajo",
    device: "Conectado",
    lastUpdate: "hace 6 min",
  },
  {
    id: "PAC-00957",
    name: "Eduardo Vargas",
    age: 55,
    condition: "Obesidad + HTA",
    bp: "148/96",
    hr: "84",
    glucose: "148",
    risk: "Moderado",
    device: "Sin Conexión",
    lastUpdate: "hace 1 h",
  },
];

const riskConfig: Record<
  RiskLevel,
  { bg: string; color: string; dot: string }
> = {
  Bajo: {
    bg: "#e8f5e9",
    color: "#2e7d32",
    dot: "#4caf50",
  },
  Moderado: {
    bg: "#fff8e1",
    color: "#f57f17",
    dot: "#ffca28",
  },
  Alto: {
    bg: "#ffebee",
    color: "#c62828",
    dot: "#ef5350",
  },
};

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

function DeviceBadge({ status }: { status: "Conectado" | "Sin Conexión" }) {
  const isConnected = status === "Conectado";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{
        background: isConnected ? "#e3f0fb" : "#f5f5f5",
        color: isConnected ? "#1565c0" : "#9e9e9e",
      }}
    >
      {isConnected ? <Wifi size={11} /> : <WifiOff size={11} />}
      {status}
    </span>
  );
}

export default function PatientsTable() {
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
      {/* Table header */}
      <div
        className="px-5 py-4 flex items-center justify-between border-b"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div>
          <h2 className="font-bold text-base" style={{ color: "var(--foreground)" }}>
            Pacientes Monitoreados
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {patients.length} pacientes activos · Datos en tiempo real via IoMT
          </p>
        </div>
        <button
          id="btn-view-all-patients"
          className="flex items-center gap-1 text-sm font-semibold rounded-xl px-4 py-2 transition-all"
          style={{
            background: "var(--medical-blue-pale)",
            color: "var(--medical-blue)",
          }}
        >
          Ver todos
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {[
                "ID / Paciente",
                "Condición",
                "PA (mmHg)",
                "FC (bpm)",
                "Glucosa (mg/dL)",
                "Nivel de Riesgo",
                "Dispositivo IoMT",
                "Acciones",
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-semibold text-xs whitespace-nowrap"
                  style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border-color)" }}
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
            {patients.map((patient, i) => {
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
                    animationDelay: `${i * 50}ms`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background =
                      isHighRisk
                        ? "rgba(198,40,40,0.05)"
                        : "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background =
                      isHighRisk
                        ? "rgba(198,40,40,0.02)"
                        : "transparent";
                  }}
                >
                  {/* ID + Name */}
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
                        {patient.id} · {patient.age} años · {patient.lastUpdate}
                      </p>
                    </div>
                  </td>

                  {/* Condition */}
                  <td className="px-4 py-3.5">
                    <span
                      className="text-xs font-medium rounded-lg px-2 py-1"
                      style={{
                        background: "#f1f5f9",
                        color: "var(--text-muted)",
                      }}
                    >
                      {patient.condition}
                    </span>
                  </td>

                  {/* BP */}
                  <td className="px-4 py-3.5">
                    <span
                      className="font-mono font-semibold text-sm"
                      style={{
                        color:
                          parseFloat(patient.bp) > 140
                            ? "var(--alert-red)"
                            : "var(--foreground)",
                      }}
                    >
                      {patient.bp}
                    </span>
                  </td>

                  {/* HR */}
                  <td className="px-4 py-3.5">
                    <span
                      className="font-mono font-semibold text-sm"
                      style={{
                        color:
                          parseInt(patient.hr) > 100
                            ? "var(--alert-orange)"
                            : "var(--foreground)",
                      }}
                    >
                      {patient.hr}
                    </span>
                  </td>

                  {/* Glucose */}
                  <td className="px-4 py-3.5">
                    <span
                      className="font-mono font-semibold text-sm"
                      style={{
                        color:
                          parseInt(patient.glucose) < 70 ||
                          parseInt(patient.glucose) > 140
                            ? "var(--alert-red)"
                            : "var(--foreground)",
                      }}
                    >
                      {patient.glucose}
                    </span>
                  </td>

                  {/* Risk */}
                  <td className="px-4 py-3.5">
                    <RiskBadge level={patient.risk} />
                  </td>

                  {/* Device */}
                  <td className="px-4 py-3.5">
                    <DeviceBadge status={patient.device} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <button
                      id={`btn-view-patient-${patient.id}`}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150"
                      style={{
                        background: "var(--medical-blue-pale)",
                        color: "var(--medical-blue)",
                      }}
                      title={`Ver expediente de ${patient.name}`}
                    >
                      <Eye size={12} />
                      Expediente
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table footer */}
      <div
        className="px-5 py-3 flex items-center justify-between border-t"
        style={{ borderColor: "var(--border-color)", background: "#f8fafc" }}
      >
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Mostrando <strong>{patients.length}</strong> de <strong>1,245</strong> pacientes
        </p>
        <div className="flex gap-2">
          {["Anterior", "1", "2", "3", "Siguiente"].map((label) => (
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
