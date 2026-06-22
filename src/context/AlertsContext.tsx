"use client";

import React, { createContext, useState, useEffect, useRef } from "react";
import { Alert } from "@/lib/data";
import { getAlertasCriticas, getPacientes } from "@/lib/queries";
import type { PatientUI } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

interface AlertsContextType {
  alerts: Alert[];
  criticalCount: number;
  activeCount: number;
  isLoading: boolean;
  attendAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
}

export const AlertsContext = createContext<AlertsContextType>({
  alerts: [],
  criticalCount: 0,
  activeCount: 0,
  isLoading: true,
  attendAlert: () => {},
  dismissAlert: () => {},
});

// Pool de escenarios clínicos para la simulación en tiempo real
const clinicalAlertPool = [
  {
    alertType: "Pico de Presión Arterial",
    reading: "185/125 mmHg",
    risk: "Riesgo de Infarto Agudo al Miocardio",
    severity: "critical" as const,
  },
  {
    alertType: "Arritmia Detectada",
    reading: "FC: 145 bpm (irregular)",
    risk: "Fibrilación Auricular Activa",
    severity: "critical" as const,
  },
  {
    alertType: "Caída de SpO2",
    reading: "SpO2: 87%",
    risk: "Riesgo de Hipoxia Severa",
    severity: "critical" as const,
  },
  {
    alertType: "Taquicardia Ventricular",
    reading: "FC: 160 bpm",
    risk: "Riesgo de Paro Cardiorrespiratorio",
    severity: "critical" as const,
  },
  {
    alertType: "Hipoglucemia Severa",
    reading: "42 mg/dL",
    risk: "Riesgo de Coma Diabético",
    severity: "critical" as const,
  },
  {
    alertType: "Crisis Hipertensiva",
    reading: "190/115 mmHg",
    risk: "Riesgo de Accidente Cerebrovascular",
    severity: "critical" as const,
  },
];

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Pool de pacientes de Supabase para la simulación
  const patientPoolRef = useRef<PatientUI[]>([]);
  const { user } = useAuth();
  const doctorFilter = user?.doctorFilter;

  // ── Carga inicial desde Supabase ──────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        // Cargar alertas y pacientes en paralelo, filtrados por doctor
        const [alertasDB, pacientesDB] = await Promise.all([
          getAlertasCriticas(doctorFilter),
          getPacientes(doctorFilter),
        ]);

        if (!mounted) return;

        // Convertir AlertUI → Alert (formato compatible con todos los componentes)
        const mapped: Alert[] = alertasDB.map((a) => ({
          id: a.id,
          patientId: a.patientId,
          patientName: a.patientName,
          patientAge: a.patientAge,
          alertType: a.alertType,
          reading: a.reading,
          risk: a.risk,
          severity: a.severity,
          status: a.status,
          time: a.time,
          timestamp: a.timestamp,
          location: a.location,
          attendedBy: a.attendedBy,
          doctorName: a.doctorName,
        }));

        setAlerts(mapped);
        patientPoolRef.current = pacientesDB;
      } catch (err) {
        console.error("[AlertsProvider] Error cargando datos:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadInitialData();
    return () => { mounted = false; };
  }, [doctorFilter]);

  // ── Simulación: genera nuevas alertas cada 1.30 min (después de 3 s inicial) ──
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setAlerts((prevAlerts) => {
          const pool = patientPoolRef.current;
          if (pool.length === 0) return prevAlerts;

          const randomPatient = pool[Math.floor(Math.random() * pool.length)];
          const scenario =
            clinicalAlertPool[
              Math.floor(Math.random() * clinicalAlertPool.length)
            ];

          const newAlertId = `ALT-SIM-${Date.now()}`;
          const now = new Date();
          const pad = (n: number) => n.toString().padStart(2, "0");
          const timestampString = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

          const newAlert: Alert = {
            id: newAlertId,
            patientId: randomPatient.id,
            patientName: randomPatient.name,
            patientAge: randomPatient.age,
            alertType: scenario.alertType,
            reading: scenario.reading,
            risk: scenario.risk,
            severity: scenario.severity,
            status: "Activa",
            time: "Justo ahora",
            timestamp: timestampString,
            location: "Lima, Perú",
          };

          // Máximo 50 alertas en memoria
          return [newAlert, ...prevAlerts.slice(0, 49)];
        });
      }, 90000);

      return () => clearInterval(interval);
    }, 3000);

    return () => clearTimeout(delayTimer);
  }, []);

  // ── Actualización periódica de tiempos relativos ──────────────────────────
  useEffect(() => {
    const updateTimeInterval = setInterval(() => {
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) => {
          if (alert.time === "Justo ahora") {
            return { ...alert, time: "Hace 1 min" };
          }
          if (alert.time.startsWith("Hace ")) {
            const match = alert.time.match(/Hace (\d+) min/);
            if (match) {
              const minutes = parseInt(match[1]) + 1;
              return { ...alert, time: `Hace ${minutes} min` };
            }
          }
          return alert;
        })
      );
    }, 60000);

    return () => clearInterval(updateTimeInterval);
  }, []);

  // ── Acciones ──────────────────────────────────────────────────────────────
  const criticalCount = alerts.filter(
    (a) => a.severity === "critical" && a.status === "Activa"
  ).length;

  const activeCount = alerts.filter((a) => a.status === "Activa").length;

  const attendAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "Atendida" as const, attendedBy: "Dr. Ramírez" }
          : a
      )
    );
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "Descartada" as const, attendedBy: "Dr. Ramírez" }
          : a
      )
    );
  };

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        criticalCount,
        activeCount,
        isLoading,
        attendAlert,
        dismissAlert,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}
