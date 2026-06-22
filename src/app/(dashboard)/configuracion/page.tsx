"use client";

import { useState } from "react";
import {
  User, Shield, Bell, Cpu, Activity,
  Save, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { configData } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";

function SectionCard({ title, icon: Icon, children }: { title: string; icon: typeof User; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div className="px-5 py-4 border-b flex items-center gap-2"
        style={{ borderColor: "var(--border-color)", background: "#f8fafc" }}>
        <Icon size={16} style={{ color: "var(--medical-blue)" }} />
        <h2 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function FieldRow({ label, value, editable = false }: { label: string; value: string; editable?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b"
      style={{ borderColor: "var(--border-color)" }}>
      <span className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</span>
      {editable ? (
        <input defaultValue={value}
          className="text-sm font-semibold text-right rounded-lg px-3 py-1 outline-none border transition-all"
          style={{ color: "var(--foreground)", borderColor: "var(--border-color)", background: "#f8fafc", minWidth: 220 }} />
      ) : (
        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{value}</span>
      )}
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange, id }: {
  label: string; desc?: string; checked: boolean; onChange: () => void; id: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b"
      style={{ borderColor: "var(--border-color)" }}>
      <div>
        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{label}</p>
        {desc && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>}
      </div>
      <button id={id} onClick={onChange}
        className="relative rounded-full transition-all duration-200"
        style={{ width: 44, height: 24, background: checked ? "var(--medical-blue)" : "#e2e8f0", flexShrink: 0 }}>
        <span className="absolute top-1 rounded-full bg-white transition-all duration-200"
          style={{ width: 16, height: 16, left: checked ? 24 : 4 }} />
      </button>
    </div>
  );
}

function ThresholdRow({ label, value, unit, onChange, id, warnHigh }: {
  label: string; value: number; unit: string; onChange: (v: number) => void; id: string; warnHigh?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b"
      style={{ borderColor: "var(--border-color)" }}>
      <span className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</span>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(value - 1)} id={`${id}-dec`}
          className="w-7 h-7 rounded-lg font-bold text-sm transition-colors"
          style={{ background: "#f1f5f9", color: "var(--text-muted)" }}>−</button>
        <span className="font-mono font-bold text-sm w-16 text-center"
          style={{ color: warnHigh ? "var(--alert-red)" : "var(--medical-blue)" }}>
          {value} {unit}
        </span>
        <button onClick={() => onChange(value + 1)} id={`${id}-inc`}
          className="w-7 h-7 rounded-lg font-bold text-sm transition-colors"
          style={{ background: "#f1f5f9", color: "var(--text-muted)" }}>+</button>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ConfiguracionPage() {
  const { user } = useAuth();
  const [notif, setNotif] = useState(configData.notifications);
  const [thresh, setThresh] = useState(configData.thresholds);
  const [saved, setSaved] = useState(false);

  function toggleNotif(key: keyof typeof notif) {
    setNotif(prev => ({ ...prev, [key]: !prev[key] }));
  }
  function updateThresh(key: keyof typeof thresh, val: number) {
    setThresh(prev => ({ ...prev, [key]: val }));
  }
  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const { iomt } = configData;

  // Dynamic doctor info from user context
  const doctorName = user?.name || "Administrador SISP";
  const doctorSpecialty = user?.role || "Administrador del Sistema";
  const doctorInstitution = user?.institution || "SISP — Centro de Operaciones";
  
  let doctorEmail = "admin@sisp.gob.pe";
  let doctorPhone = "555-800-0000";
  let doctorLicense = "CCEC-0000000";

  if (user?.username === "c.monzon") {
    doctorEmail = "c.monzon@sisp.gob.pe";
    doctorPhone = "555-800-0001 ext. 101";
    doctorLicense = "CCEC-2301847";
  } else if (user?.username === "j.vega") {
    doctorEmail = "j.vega@sisp.gob.pe";
    doctorPhone = "555-800-0002 ext. 102";
    doctorLicense = "CCEC-2458921";
  } else if (user?.username === "e.silva") {
    doctorEmail = "e.silva@sisp.gob.pe";
    doctorPhone = "555-800-0003 ext. 103";
    doctorLicense = "CCEC-2598371";
  } else if (user?.username === "m.torres") {
    doctorEmail = "m.torres@sisp.gob.pe";
    doctorPhone = "555-800-0004 ext. 104";
    doctorLicense = "CCEC-2674910";
  }

  const doctor = {
    name: doctorName,
    specialty: doctorSpecialty,
    institution: doctorInstitution,
    license: doctorLicense,
    email: doctorEmail,
    phone: doctorPhone,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--foreground)" }}>Configuración</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Preferencias del sistema, umbrales clínicos y parámetros IoMT
          </p>
        </div>
        <button id="btn-save-config" onClick={handleSave}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all"
          style={{ background: saved ? "linear-gradient(135deg,#2e7d32,#4caf50)" : "linear-gradient(135deg,#1565c0,#1e88e5)" }}>
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? "¡Guardado!" : "Guardar cambios"}
        </button>
      </div>

      {saved && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-2 text-sm animate-fade-in-up"
          style={{ background: "#e8f5e9", border: "1px solid #a5d6a7" }}>
          <CheckCircle2 size={15} style={{ color: "#2e7d32" }} />
          <span style={{ color: "#2e7d32" }}>Configuración guardada correctamente (sesión local).</span>
        </div>
      )}

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Perfil del médico */}
        <SectionCard title="Perfil del Médico" icon={User}>
          <FieldRow label="Nombre completo" value={doctor.name} editable />
          <FieldRow label="Especialidad" value={doctor.specialty} editable />
          <FieldRow label="Institución" value={doctor.institution} editable />
          <FieldRow label="Cédula Profesional" value={doctor.license} />
          <FieldRow label="Correo electrónico" value={doctor.email} editable />
          <FieldRow label="Teléfono / Ext." value={doctor.phone} editable />
        </SectionCard>

        {/* Notificaciones */}
        <SectionCard title="Notificaciones" icon={Bell}>
          <ToggleRow id="toggle-email" label="Notificaciones por Correo"
            desc="Recibe alertas en tu email institucional"
            checked={notif.email} onChange={() => toggleNotif("email")} />
          <ToggleRow id="toggle-sms" label="Notificaciones por SMS"
            desc="Mensajes de texto para alertas críticas"
            checked={notif.sms} onChange={() => toggleNotif("sms")} />
          <ToggleRow id="toggle-inapp" label="Notificaciones en App"
            desc="Alertas visuales en el panel"
            checked={notif.inApp} onChange={() => toggleNotif("inApp")} />
          <ToggleRow id="toggle-critical-only" label="Solo Alertas Críticas"
            desc="Filtrar notificaciones de baja severidad"
            checked={notif.criticalOnly} onChange={() => toggleNotif("criticalOnly")} />
          <ToggleRow id="toggle-daily" label="Resumen Diario"
            desc="Email con resumen al final del día"
            checked={notif.dailySummary} onChange={() => toggleNotif("dailySummary")} />
          <ToggleRow id="toggle-weekly" label="Reporte Semanal Automático"
            desc="Generación automática cada lunes"
            checked={notif.weeklyReport} onChange={() => toggleNotif("weeklyReport")} />
        </SectionCard>

        {/* Umbrales clínicos */}
        <SectionCard title="Umbrales de Alerta Clínica" icon={AlertTriangle}>
          <p className="text-xs mb-4 rounded-lg px-3 py-2"
            style={{ background: "#fff8e1", color: "#f57f17", border: "1px solid #ffe082" }}>
            Modifica los valores que disparan alertas automáticas del sistema ML.
          </p>
          <ThresholdRow id="thresh-bp-sys" label="PA Sistólica máxima"
            value={thresh.bpSystolicHigh} unit="mmHg"
            onChange={v => updateThresh("bpSystolicHigh", v)} warnHigh={thresh.bpSystolicHigh > 150} />
          <ThresholdRow id="thresh-bp-dia" label="PA Diastólica máxima"
            value={thresh.bpDiastolicHigh} unit="mmHg"
            onChange={v => updateThresh("bpDiastolicHigh", v)} />
          <ThresholdRow id="thresh-hr-high" label="Frecuencia Cardíaca máxima"
            value={thresh.hrHigh} unit="bpm"
            onChange={v => updateThresh("hrHigh", v)} />
          <ThresholdRow id="thresh-hr-low" label="Frecuencia Cardíaca mínima"
            value={thresh.hrLow} unit="bpm"
            onChange={v => updateThresh("hrLow", v)} />
          <ThresholdRow id="thresh-glu-high" label="Glucosa máxima"
            value={thresh.glucoseHigh} unit="mg/dL"
            onChange={v => updateThresh("glucoseHigh", v)} />
          <ThresholdRow id="thresh-glu-low" label="Glucosa mínima"
            value={thresh.glucoseLow} unit="mg/dL"
            onChange={v => updateThresh("glucoseLow", v)} />
          <ThresholdRow id="thresh-spo2" label="SpO₂ mínima"
            value={thresh.spo2Low} unit="%"
            onChange={v => updateThresh("spo2Low", v)} warnHigh={thresh.spo2Low < 90} />
        </SectionCard>

        {/* IoMT */}
        <SectionCard title="Parámetros IoMT & ML" icon={Cpu}>
          <FieldRow label="Intervalo de sincronización" value={`${iomt.syncIntervalSec} segundos`} />
          <FieldRow label="Alerta de dispositivo offline tras" value={`${iomt.offlineAlertMinutes} minutos`} />
          <FieldRow label="Versión del Modelo ML" value={iomt.mlModelVersion} />
          <FieldRow label="Última actualización del modelo" value={iomt.lastModelUpdate} />
          <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "var(--border-color)" }}>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>Reconexión automática</span>
            <span className="text-xs font-bold rounded-full px-2.5 py-1"
              style={{ background: iomt.autoReconnect ? "#e8f5e9" : "#ffebee", color: iomt.autoReconnect ? "#2e7d32" : "#c62828" }}>
              {iomt.autoReconnect ? "ACTIVADO" : "DESACTIVADO"}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>Cifrado de datos IoMT</span>
            <span className="text-xs font-bold rounded-full px-2.5 py-1"
              style={{ background: "#e8f5e9", color: "#2e7d32" }}>
              <Shield size={10} className="inline mr-1" />AES-256 ACTIVO
            </span>
          </div>
          {/* System status */}
          <div className="mt-4 rounded-xl p-4"
            style={{ background: "linear-gradient(135deg,#0d1b2e,#1a3a5c)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={14} style={{ color: "#90caf9" }} />
              <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.8)" }}>
                Estado del Sistema
              </span>
            </div>
            {[
              { label: "Motor ML", val: "Operativo", ok: true },
              { label: "Red IoMT", val: "96.2% uptime", ok: true },
              { label: "Base de Datos", val: "Hardcoded (dev)", ok: true },
              { label: "API Gateway", val: "Simulada", ok: true },
            ].map(({ label, val, ok }) => (
              <div key={label} className="flex justify-between items-center py-1.5">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</span>
                <span className="text-xs font-semibold" style={{ color: ok ? "#4caf50" : "#ef5350" }}>● {val}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
