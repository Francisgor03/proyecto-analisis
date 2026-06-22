"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, RefreshCw, AlertTriangle, X, ExternalLink, LogOut } from "lucide-react";
import { useSimulatedAlerts } from "@/hooks/useSimulatedAlerts";
import { useAuth } from "@/context/AuthContext";

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { alerts } = useSimulatedAlerts();
  const { user, logout } = useAuth();

  // Filter only active alerts
  const activeAlerts = alerts.filter((alert) => alert.status === "Activa");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      id="topbar"
      className="flex items-center justify-between px-6 py-4 border-b relative"
      style={{
        background: "white",
        borderColor: "var(--border-color)",
        height: 64,
        zIndex: 40,
      }}
    >
      {/* Left: page title + breadcrumb */}
      <div>
        <h1 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>
          Dashboard Principal
        </h1>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Sistema Inteligente de Salud Preventiva · Última actualización: hace 2 min
        </p>
      </div>

      {/* Right: refresh + bell (interactive) */}
      <div className="flex items-center gap-3">
        {/* Refresh */}
        <button
          id="btn-refresh"
          className="flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer"
          style={{
            width: 38,
            height: 38,
            background: "#f1f5f9",
            color: "var(--text-muted)",
          }}
          title="Actualizar datos"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--medical-blue-pale)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--medical-blue)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
          }}
        >
          <RefreshCw size={16} />
        </button>

        {/* Bell container for dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="btn-alerts-bell"
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer"
            style={{
              width: 38,
              height: 38,
              background: activeAlerts.length > 0 ? "#fff3f3" : "#f1f5f9",
              color: activeAlerts.length > 0 ? "var(--alert-red)" : "var(--text-muted)",
            }}
            title="Ver alertas"
          >
            <Bell size={17} className={activeAlerts.length > 0 ? "animate-pulse" : ""} />
            {activeAlerts.length > 0 && (
              <span
                className="absolute -top-1 -right-1 text-xs font-bold rounded-full flex items-center justify-center animate-bounce"
                style={{
                  width: 18,
                  height: 18,
                  background: "var(--alert-red)",
                  color: "white",
                  fontSize: 10,
                }}
              >
                {activeAlerts.length}
              </span>
            )}
          </button>

          {/* Alerts Dropdown Panel */}
          {isOpen && (
            <div
              className="absolute right-0 mt-2 w-88 bg-white rounded-2xl shadow-2xl border overflow-hidden transition-all duration-200 scale-100 opacity-100"
              style={{
                borderColor: "var(--border-color)",
                transformOrigin: "top right",
                zIndex: 100,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-500" />
                  <span className="font-semibold text-sm text-slate-800">Alertas Activas</span>
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {activeAlerts.length}
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Alerts List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {activeAlerts.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500">
                    No hay alertas activas en este momento.
                  </div>
                ) : (
                  activeAlerts.map((alert) => {
                    const isCritical = alert.severity === "critical";
                    const isHigh = alert.severity === "high";
                    const borderLeftColor = isCritical ? "var(--alert-red)" : isHigh ? "#ff9800" : "#2196f3";
                    
                    return (
                      <Link
                        key={alert.id}
                        href="/alertas"
                        onClick={() => setIsOpen(false)}
                        className="block p-4 hover:bg-slate-50 transition-colors border-l-4"
                        style={{ borderLeftColor }}
                      >
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p className="font-semibold text-xs text-slate-800 truncate">
                            {alert.patientName}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {alert.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium truncate">
                          {alert.alertType}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {alert.reading}
                          </span>
                          <span 
                            className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                            style={{
                              background: isCritical ? "#ffebee" : isHigh ? "#fff3e0" : "#e3f2fd",
                              color: isCritical ? "#c62828" : isHigh ? "#e65100" : "#1565c0"
                            }}
                          >
                            {alert.severity === "critical" ? "Crítico" : alert.severity === "high" ? "Alto" : "Medio"}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="border-t bg-slate-50 p-2 text-center" style={{ borderColor: "var(--border-color)" }}>
                <Link
                  href="/alertas"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors w-full py-1.5"
                >
                  Ver todas las alertas <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ background: "var(--border-color)" }} />

        {/* User avatar + logout */}
        {user && (
          <div className="flex items-center gap-2">
            {/* Avatar chip */}
            <div className="flex items-center gap-2.5 rounded-xl px-3 py-1.5"
              style={{ background: "#f1f5f9" }}>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#1565c0,#1e88e5)" }}
              >
                {user.avatar}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold leading-none" style={{ color: "var(--foreground)" }}>
                  {user.name}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {user.role}
                </p>
              </div>
            </div>

            {/* Logout button */}
            <button
              id="btn-logout"
              onClick={logout}
              title="Cerrar sesión"
              className="flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer"
              style={{ width: 38, height: 38, background: "#f1f5f9", color: "var(--text-muted)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#ffebee";
                (e.currentTarget as HTMLButtonElement).style.color = "#c62828";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

