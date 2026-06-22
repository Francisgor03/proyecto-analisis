"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; up: boolean };
  accentColor: string;
  accentBg: string;
  delay?: number;
}

export default function KPICard({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor,
  accentBg,
  delay = 0,
}: KPICardProps) {
  return (
    <div
      id={id}
      className="rounded-2xl p-5 flex flex-col gap-3 animate-fade-in-up"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        animationDelay: `${delay}ms`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between">
        <div
          className="rounded-xl flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            background: accentBg,
          }}
        >
          <Icon size={22} style={{ color: accentColor }} />
        </div>
        {trend && (
          <span
            className="flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-1"
            style={{
              background: trend.up ? "#e8f5e9" : "#fce4ec",
              color: trend.up ? "#2e7d32" : "#c62828",
            }}
          >
            {trend.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <p
          className="text-3xl font-extrabold leading-none"
          style={{ color: accentColor }}
        >
          {value}
        </p>
        <p
          className="text-sm font-semibold mt-1"
          style={{ color: "var(--foreground)" }}
        >
          {title}
        </p>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
