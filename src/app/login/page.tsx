"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Eye, EyeOff, LogIn, Loader2, ShieldCheck,
  Activity, Heart, Cpu, Lock, User,
} from "lucide-react";

// Animated background ECG line (purely decorative SVG)
function EcgLine() {
  return (
    <svg
      viewBox="0 0 1200 80"
      className="absolute bottom-0 left-0 w-full opacity-10"
      preserveAspectRatio="none"
      style={{ height: 80 }}
    >
      <polyline
        points="0,40 120,40 150,10 180,70 210,10 240,70 260,40 380,40 410,10 440,70 470,10 500,70 520,40 640,40 670,10 700,70 730,10 760,70 780,40 900,40 930,10 960,70 990,10 1020,70 1040,40 1200,40"
        fill="none"
        stroke="#4caf50"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Floating stat badge
function FloatBadge({ icon: Icon, label, value, delay = 0, position }: {
  icon: typeof Activity; label: string; value: string; delay?: number;
  position: React.CSSProperties;
}) {
  return (
    <div
      className="hidden lg:flex items-center gap-2 rounded-2xl px-4 py-2.5 shadow-xl animate-fade-in-up"
      style={{
        position: "absolute",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(12px)",
        animationDelay: `${delay}ms`,
        zIndex: 10,
        ...position,
      }}
    >
      <Icon size={16} style={{ color: "#4caf50" }} />
      <div>
        <p className="text-white font-bold text-sm leading-none">{value}</p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      setError("Por favor ingresa usuario y contraseña.");
      return;
    }
    setLoading(true);
    setError("");

    // Simular latencia de red
    await new Promise((r) => setTimeout(r, 900));

    const result = login(username, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error ?? "Error desconocido.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0f1e" }}>
      {/* ── Left panel: branding ─────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{
          width: "52%",
          background: "linear-gradient(145deg, #0d1b2e 0%, #0a1628 40%, #0f2744 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(21,101,192,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(21,101,192,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{ background: "rgba(21,101,192,0.12)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full"
          style={{ background: "rgba(46,125,50,0.1)", filter: "blur(60px)" }} />

        {/* ECG line */}
        <EcgLine />

        {/* Floating badges — each with explicit position */}
        <FloatBadge icon={Heart}    label="Pacientes activos"    value="1,245" delay={200} position={{ top: "16%",    right: "6%"  }} />
        <FloatBadge icon={Activity} label="Alertas monitoreadas" value="23"    delay={400} position={{ top: "58%",    right: "6%"  }} />
        <FloatBadge icon={Cpu}      label="Precisión ML"         value="94.3%" delay={600} position={{ bottom: "12%", right: "6%"  }} />

        {/* Main content */}
        <div className="relative z-10 flex flex-col justify-center flex-1 px-14">
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#1565c0,#1e88e5)" }}>
              <Activity size={20} className="text-white" />
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight">SISP</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight"
            style={{ color: "white", letterSpacing: "-0.03em" }}>
            Sistema Inteligente<br />
            <span style={{
              background: "linear-gradient(90deg, #42a5f5, #4caf50)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              de Salud Preventiva
            </span>
          </h1>

          <p className="mt-4 text-base leading-relaxed max-w-md"
            style={{ color: "rgba(255,255,255,0.5)" }}>
            Monitoreo clínico IoMT en tiempo real con predicción de riesgo cardiovascular basada en Machine Learning.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-3">
            {[
              { icon: ShieldCheck, text: "Datos cifrados de extremo a extremo" },
              { icon: Activity,    text: "Monitoreo continuo de signos vitales" },
              { icon: Cpu,        text: "Predicción ML con 94.3% de precisión" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(66,165,245,0.15)" }}>
                  <Icon size={14} style={{ color: "#42a5f5" }} />
                </div>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 px-14 pb-8">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © 2026 SISP · IMSS · Versión 3.2.1 · Todos los derechos reservados
          </p>
        </div>
      </div>

      {/* ── Right panel: login form ──────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-6 py-10"
        style={{ background: "#080d18" }}>
        <div className="w-full max-w-md animate-fade-in-up">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#1565c0,#1e88e5)" }}>
              <Activity size={18} className="text-white" />
            </div>
            <span className="text-white font-extrabold text-lg">SISP</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-white" style={{ letterSpacing: "-0.02em" }}>
              Acceso al sistema
            </h2>
            <p className="mt-1.5 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Ingresa tus credenciales institucionales para continuar.
            </p>
          </div>

          {/* Form card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
            }}
          >
            <form onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <div className="mb-5">
                <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <User size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
                  </div>
                  <input
                    id="input-username"
                    ref={usernameRef}
                    type="text"
                    autoComplete="username"
                    placeholder="ej. l.ramirez"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(""); }}
                    className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#1e88e5"; e.currentTarget.style.background = "rgba(30,136,229,0.08)"; }}
                    onBlur={e  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Contraseña
                  </label>
                  <Lock size={11} style={{ color: "rgba(255,255,255,0.25)" }} />
                </div>
                <div className="relative">
                  <input
                    id="input-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="w-full rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#1e88e5"; e.currentTarget.style.background = "rgba(30,136,229,0.08)"; }}
                    onBlur={e  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div
                  className="mb-5 flex items-center gap-2 rounded-xl px-4 py-3 text-sm animate-fade-in-up"
                  style={{ background: "rgba(198,40,40,0.15)", border: "1px solid rgba(198,40,40,0.3)", color: "#ef9a9a" }}
                >
                  <ShieldCheck size={14} />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                id="btn-login-submit"
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-200 ${shake ? "animate-bounce" : ""}`}
                style={{
                  background: loading
                    ? "rgba(21,101,192,0.5)"
                    : "linear-gradient(135deg, #1565c0, #1e88e5)",
                  boxShadow: loading ? "none" : "0 6px 20px rgba(21,101,192,0.4)",
                  cursor: loading ? "not-allowed" : "pointer",
                  transform: loading ? "none" : undefined,
                }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(21,101,192,0.55)"; }}
                onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(21,101,192,0.4)"; }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Verificando credenciales…
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Iniciar sesión
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            © 2026 SISP · Sistema protegido · Solo personal autorizado
          </p>
        </div>
      </div>
    </div>
  );
}
