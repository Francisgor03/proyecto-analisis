"use client";

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
  const { activeCount } = useSimulatedAlerts();

  // Calculate dynamic alerts count
  const activeAlertsCount = activeCount;

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
    </aside>
  );
}
