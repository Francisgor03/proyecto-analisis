"use client";

import { useContext } from "react";
import { AlertsContext } from "@/context/AlertsContext";

export function useSimulatedAlerts() {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error("useSimulatedAlerts must be used within an AlertsProvider");
  }
  return context;
}
