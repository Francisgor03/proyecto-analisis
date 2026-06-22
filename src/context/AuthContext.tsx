"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// ── Credenciales hardcodeadas ─────────────────────────────────────────────────
export const USERS = [
  {
    id: "USR-001",
    username: "l.ramirez",
    password: "SISP@2026",
    name: "Dr. Luis Ramírez Ochoa",
    role: "Cardiólogo",
    institution: "IMSS — Hospital General de Zona No. 1",
    avatar: "LR",
  },
  {
    id: "USR-002",
    username: "admin",
    password: "admin123",
    name: "Administrador SISP",
    role: "Administrador del Sistema",
    institution: "SISP — Centro de Operaciones",
    avatar: "AD",
  },
];

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
  institution: string;
  avatar: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => ({ ok: false }),
  logout: () => {},
});

const SESSION_KEY = "sisp_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión desde sessionStorage al montar
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignorar errores de parse
    } finally {
      setIsLoading(false);
    }
  }, []);

  function login(username: string, password: string): { ok: boolean; error?: string } {
    const found = USERS.find(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password === password
    );
    if (!found) {
      return { ok: false, error: "Usuario o contraseña incorrectos." };
    }
    const authUser: AuthUser = {
      id: found.id,
      username: found.username,
      name: found.name,
      role: found.role,
      institution: found.institution,
      avatar: found.avatar,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return { ok: true };
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
    // Hard redirect: recarga completa de página, sin diálogos del browser
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
