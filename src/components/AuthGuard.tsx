"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Activity, Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Pantalla de carga mientras se restaura la sesión
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "#080d18" }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#1565c0,#1e88e5)" }}
        >
          <Activity size={24} className="text-white" />
        </div>
        <Loader2 size={20} className="animate-spin" style={{ color: "#1e88e5" }} />
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          Verificando sesión…
        </p>
      </div>
    );
  }

  // No autenticado: no renderizar nada mientras redirige
  if (!user) return null;

  return <>{children}</>;
}
