"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// ── Credenciales hardcodeadas ─────────────────────────────────────────────────
// doctorFilter: nombre exacto tal como aparece en paciente.doctor de Supabase.
//               null = cuenta admin, ve TODOS los pacientes.
export const USERS = [
  {
    id: "USR-001",
    username: "c.monzon",
    password: "SISP@2026",
    name: "Dr. Carlos Monzón",
    role: "Cardiólogo",
    institution: "Hospital General de Lima",
    avatar: "CM",
    doctorFilter: "Dr. Carlos Monzón",
  },
  {
    id: "USR-002",
    username: "j.vega",
    password: "SISP@2026",
    name: "Dr. Julio Vega",
    role: "Neumólogo",
    institution: "Hospital General de Lima",
    avatar: "JV",
    doctorFilter: "Dr. Julio Vega",
  },
  {
    id: "USR-003",
    username: "e.silva",
    password: "SISP@2026",
    name: "Dra. Elena Silva",
    role: "Medicina Interna",
    institution: "Hospital General de Lima",
    avatar: "ES",
    doctorFilter: "Dra. Elena Silva",
  },
  {
    id: "USR-004",
    username: "m.torres",
    password: "SISP@2026",
    name: "Dr. Martín Torres",
    role: "Cuidados Intensivos",
    institution: "Hospital General de Lima",
    avatar: "MT",
    doctorFilter: "Dr. Martín Torres",
  },
  {
    id: "USR-ADMIN",
    username: "admin",
    password: "admin123",
    name: "Administrador SISP",
    role: "Administrador del Sistema",
    institution: "SISP — Centro de Operaciones",
    avatar: "AD",
    doctorFilter: null, // ve todos los pacientes
  },
];

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
  institution: string;
  avatar: string;
  /** Nombre del doctor en paciente.doctor. null = admin (ve todos). */
  doctorFilter: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  /** true si la cuenta no tiene restricción de doctor (admin) */
  isAdmin: boolean;
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
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
      doctorFilter: found.doctorFilter,
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

  const isAdmin = user?.doctorFilter === null;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
