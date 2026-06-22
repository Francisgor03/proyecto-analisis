"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  FileBarChart2,
  Settings,
  Activity,
  ChevronRight,
  Cpu,
  LogOut,
  MoreHorizontal,
} from "lucide-react";
import { useSimulatedAlerts } from "@/hooks/useSimulatedAlerts";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Pacientes",
    href: "/pacientes",
    icon: Users,
  },
  {
    label: "Alertas",
    href: "/alertas",
    icon: AlertTriangle,
    badge: 3,
  },
  {
    label: "Reportes",
    href: "/reportes",
    icon: FileBarChart2,
  },
  {
    label: "Configuración",
    href: "/configuracion",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { activeCount } = useSimulatedAlerts();

  // Calculate dynamic alerts count
  const activeAlertsCount = activeCount;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside
      id="sidebar-nav"
      className="flex flex-col h-full"
      style={{ background: "var(--sidebar-bg)", width: "260px", minWidth: "260px" }}
    >
      {/* Logo / Brand */}
      <div
        className="flex items-center gap-3 px-6 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 40,
            height: 40,
            background: "linear-gradient(135deg, #1e88e5 0%, #0d47a1 100%)",
          }}
        >
          <Activity size={20} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-tight">SISP</p>
          <p className="text-xs leading-tight" style={{ color: "rgba(255,255,255,0.5)" }}>
            Salud Preventiva
          </p>
        </div>
      </div>

      {/* Space spacer after header */}
      <div className="h-4" />

      {/* Nav label */}
      <p
        className="uppercase text-xs font-semibold tracking-widest px-6 mb-2"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        Menú Principal
      </p>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const isActive = pathname === href;
          const currentBadge = label === "Alertas" ? activeAlertsCount : badge;
          return (
            <Link
              key={href}
              href={href}
              id={`nav-${label.toLowerCase().replace(/\s/g, "-")}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(30,136,229,0.3) 0%, rgba(13,71,161,0.2) 100%)"
                  : "transparent",
                color: isActive ? "#90caf9" : "rgba(255,255,255,0.6)",
                borderLeft: isActive ? "3px solid #1e88e5" : "3px solid transparent",
              }}
            >
              <Icon
                size={18}
                className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{ color: isActive ? "#90caf9" : "rgba(255,255,255,0.55)" }}
              />
              <span className="text-sm font-medium flex-1">{label}</span>
              {currentBadge && currentBadge > 0 && (
                <span
                  className="text-xs font-bold rounded-full px-2 py-0.5 leading-none"
                  style={{ background: "#c62828", color: "white" }}
                >
                  {currentBadge}
                </span>
              )}
              {isActive && (
                <ChevronRight size={14} style={{ color: "#90caf9" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* IoMT status */}
      <div
        className="mx-4 mb-4 rounded-xl px-4 py-3"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Cpu size={14} style={{ color: "#4caf50" }} />
          <p className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
            Red IoMT
          </p>
          <span
            className="ml-auto text-xs font-bold"
            style={{ color: "#4caf50" }}
          >
            ACTIVA
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            <span>Dispositivos conectados</span>
            <span className="font-semibold" style={{ color: "#90caf9" }}>
              1,198 / 1,245
            </span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: "rgba(255,255,255,0.1)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: "96%", background: "linear-gradient(90deg, #1e88e5, #4caf50)" }}
            />
          </div>
        </div>
      </div>

      {/* User Info (moved to bottom) + Logout Popover */}
      <div className="relative mx-4 mb-4 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div
          className="rounded-xl px-3 py-2 flex items-center gap-3"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #42a5f5, #1565c0)",
            }}
          >
            DR
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">Dr. Ramírez</p>
            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
              Cardiólogo · IMSS
            </p>
          </div>
          
          {/* More options button */}
          <button
            id="btn-user-options"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.08)] text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
            title="Opciones de usuario"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Popover / Dropdown Menu */}
        {showUserMenu && (
          <div
            ref={menuRef}
            className="absolute bottom-full left-0 right-0 mb-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
            style={{ animation: "fadeInUp 0.15s ease-out" }}
          >
            <button
              id="btn-logout-popover"
              onClick={() => {
                setShowUserMenu(false);
                alert("Cerrando sesión..."); // simulated logout action
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors text-left cursor-pointer font-medium"
            >
              <LogOut size={15} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
