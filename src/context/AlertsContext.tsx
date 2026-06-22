"use client";

import React, { createContext, useState, useEffect } from "react";
import { Alert, patients } from "@/lib/data";

interface AlertsContextType {
  alerts: Alert[];
  criticalCount: number;
  activeCount: number;
  attendAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
}

export const AlertsContext = createContext<AlertsContextType>({
  alerts: [],
  criticalCount: 0,
  activeCount: 0,
  attendAlert: () => {},
  dismissAlert: () => {},
});

// Alarm / scenario pools for randomized generation
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
  }
];

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const initialAlerts: Alert[] = [
    {
      id: "ALT-2026-001",
      patientId: "PAC-00312",
      patientName: "Carlos Mendoza",
      patientAge: 58,
      alertType: "Pico de Presión Arterial",
      reading: "180/120 mmHg",
      risk: "Riesgo de Infarto Agudo al Miocardio",
      severity: "critical",
      status: "Activa",
      time: "Hace 4 min",
      timestamp: "2026-06-21 19:41",
      location: "Zona Norte · CDMX",
    },
    {
      id: "ALT-2026-002",
      patientId: "PAC-00589",
      patientName: "María González",
      patientAge: 65,
      alertType: "Hipoglucemia Severa",
      reading: "48 mg/dL",
      risk: "Riesgo de Coma Diabético",
      severity: "critical",
      status: "Activa",
      time: "Hace 11 min",
      timestamp: "2026-06-21 19:34",
      location: "Zona Sur · CDMX",
    },
  ];

  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  // 3s Initial delay, then an 8s interval to generate critical alerts
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setAlerts((prevAlerts) => {
          // Select a random patient from the database
          const randomPatient = patients[Math.floor(Math.random() * patients.length)];
          const scenario = clinicalAlertPool[Math.floor(Math.random() * clinicalAlertPool.length)];
          
          const newAlertId = `ALT-2026-${Math.floor(100 + Math.random() * 900)}`;
          
          const now = new Date();
          const pad = (n: number) => n.toString().padStart(2, '0');
          const timeString = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
          const timestampString = `2026-06-21 ${timeString}`;
          
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
            location: randomPatient.address.includes("·") ? randomPatient.address.split(",")[1]?.trim() || "Zona Centro · CDMX" : "Zona Centro · CDMX",
          };

          // Limit pool size to keep it clean (e.g. max 50 alerts)
          return [newAlert, ...prevAlerts.slice(0, 49)];
        });
      }, 20000);

      return () => clearInterval(interval);
    }, 3000);

    return () => clearTimeout(delayTimer);
  }, []);

  // Periodically update the relative times (e.g., "Justo ahora" -> "Hace 1 min")
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

  const criticalCount = alerts.filter(
    (a) => a.severity === "critical" && a.status === "Activa"
  ).length;

  const activeCount = alerts.filter((a) => a.status === "Activa").length;

  const attendAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "Atendida" as const,
              attendedBy: "Dr. Ramírez",
            }
          : a
      )
    );
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "Descartada" as const,
              attendedBy: "Dr. Ramírez",
            }
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
        attendAlert,
        dismissAlert,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}
