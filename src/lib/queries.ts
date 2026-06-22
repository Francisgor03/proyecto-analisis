// ─── SISP · Funciones de consulta a Supabase ─────────────────────────────────

import { supabase } from "./supabase";
import type {
  PatientUI,
  AlertUI,
  ReportUI,
  KPIsData,
  RiskLevel,
  AlertSeverity,
  AlertStatus,
  RiskDistribution,
} from "./types";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Calcula la edad a partir de una fecha de nacimiento ISO */
function calcAge(fechanacimiento: string): number {
  const birth = new Date(fechanacimiento);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/** Tiempo relativo legible */
function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Justo ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${Math.floor(hours / 24)} días`;
}

/** Mapea nivelriesgo de la BD → RiskLevel del frontend */
function mapRisk(nivelriesgo: string | null | undefined): RiskLevel {
  if (nivelriesgo === "Riesgo Alto") return "Alto";
  if (nivelriesgo === "Riesgo Medio") return "Moderado";
  return "Bajo";
}

/** Mapea prioridad de la BD → AlertSeverity del frontend */
function mapSeverity(prioridad: string): AlertSeverity {
  if (prioridad === "Critica") return "critical";
  if (prioridad === "Alta") return "high";
  return "medium";
}

/** Mapea estado de alertacritica → AlertStatus del frontend */
function mapAlertStatus(estado: string): AlertStatus {
  if (estado === "Pendiente" || estado === "En Revisión") return "Activa";
  if (estado === "Resuelta") return "Atendida";
  return "Descartada";
}

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * Obtiene pacientes con dispositivo, evaluación y signos vitales.
 * @param doctorFilter - si se pasa, solo retorna pacientes de ese doctor.
 *                       Si es null/undefined, retorna todos (admin).
 */
export async function getPacientes(doctorFilter?: string | null): Promise<PatientUI[]> {
  // 1. Pacientes + dispositivos + evaluaciones (via umbral)
  let query = supabase
    .from("paciente")
    .select(`
      idpaciente,
      nombres,
      apellidos,
      fechanacimiento,
      genero,
      telefono,
      direccion,
      condicion,
      doctor,
      notas_medicas,
      dispositivoiomt (
        iddispositivo,
        tipo,
        estado
      ),
      umbralpersonalizado (
        idumbral,
        evaluacionpredictiva (
          idevaluacion,
          nivelriesgo,
          fechaevaluacion,
          scoregeneral
        )
      )
    `)
    .order("idpaciente");

  // Filtrar por doctor si no es admin
  if (doctorFilter) {
    query = query.eq("doctor", doctorFilter);
  }
  const { data: pacientes, error } = await query;

  if (error || !pacientes) {
    console.error("[getPacientes] error:", error);
    return [];
  }

  // 2. Últimos signos vitales para todos los dispositivos
  const deviceIds: number[] = pacientes
    .flatMap((p: any) =>
      (p.dispositivoiomt || []).map((d: any) => d.iddispositivo)
    )
    .filter(Boolean);

  // Record<deviceId, Record<tipo, valor>>
  const vitalsByDevice: Record<number, Record<string, number>> = {};

  if (deviceIds.length > 0) {
    const { data: vitals } = await supabase
      .from("signovital")
      .select("iddispositivo, tipo, valor, fechahora")
      .in("iddispositivo", deviceIds)
      .order("fechahora", { ascending: false });

    for (const v of vitals || []) {
      if (!vitalsByDevice[v.iddispositivo]) {
        vitalsByDevice[v.iddispositivo] = {};
      }
      // Solo guardamos el primero encontrado (más reciente por el ORDER)
      if (vitalsByDevice[v.iddispositivo][v.tipo] === undefined) {
        vitalsByDevice[v.iddispositivo][v.tipo] = v.valor;
      }
    }
  }

  // 3. Mapear a PatientUI
  return pacientes.map((p: any) => {
    const device = (p.dispositivoiomt || [])[0];
    const deviceVitals: Record<string, number> = device
      ? vitalsByDevice[device.iddispositivo] || {}
      : {};

    // Obtener la evaluación más reciente del umbral
    const umbral = (p.umbralpersonalizado || [])[0];
    const evals: any[] = umbral?.evaluacionpredictiva || [];
    const latestEval = evals.sort(
      (a, b) =>
        new Date(b.fechaevaluacion).getTime() -
        new Date(a.fechaevaluacion).getTime()
    )[0];

    const lastUpdate = latestEval?.fechaevaluacion
      ? relativeTime(latestEval.fechaevaluacion)
      : "Sin datos";

    const deviceStatus: PatientUI["device"] = device
      ? device.estado === "Activo"
        ? "Conectado"
        : device.estado === "Mantenimiento"
        ? "Mantenimiento"
        : "Sin Conexión"
      : "Sin Conexión";

    return {
      idpaciente: p.idpaciente,
      id: `PAC-${String(p.idpaciente).padStart(5, "0")}`,
      name: `${p.nombres} ${p.apellidos}`,
      age: calcAge(p.fechanacimiento),
      gender: (p.genero as "M" | "F") || "M",
      condition: p.condicion || "—",
      phone: p.telefono || "—",
      address: p.direccion || "—",
      doctor: p.doctor || "—",
      hr: deviceVitals["Ritmo Cardíaco"] != null
        ? String(Math.round(deviceVitals["Ritmo Cardíaco"]))
        : "—",
      spo2: deviceVitals["SpO2"] != null
        ? String(Math.round(deviceVitals["SpO2"]))
        : "—",
      glucose: deviceVitals["Glucosa"] != null
        ? String(Math.round(deviceVitals["Glucosa"]))
        : "—",
      temperatura: deviceVitals["Temperatura"] != null
        ? deviceVitals["Temperatura"].toFixed(1)
        : "—",
      presionSistolica: deviceVitals["Presión Sistólica"] != null
        ? String(Math.round(deviceVitals["Presión Sistólica"]))
        : "—",
      risk: mapRisk(latestEval?.nivelriesgo),
      device: deviceStatus,
      deviceModel: device?.tipo || "Sin dispositivo",
      lastUpdate,
      scoreGeneral: latestEval?.scoregeneral ?? null,
      notasMedicas: p.notas_medicas || "",
    };
  });
}

/**
 * Obtiene alertas críticas con datos del paciente y médico.
 * @param doctorFilter - si se pasa, solo retorna alertas de pacientes de ese doctor.
 */
export async function getAlertasCriticas(doctorFilter?: string | null): Promise<AlertUI[]> {
  const { data, error } = await supabase
    .from("alertacritica")
    .select(`
      idalerta,
      prioridad,
      estado,
      fechageneracion,
      alerttype,
      reading,
      riesgo,
      personalmedico (
        nombres
      ),
      evaluacionpredictiva (
        nivelriesgo,
        umbralpersonalizado (
          paciente (
            idpaciente,
            nombres,
            apellidos,
            fechanacimiento,
            doctor
          )
        )
      )
    `)
    .order("fechageneracion", { ascending: false });

  if (error || !data) {
    console.error("[getAlertasCriticas] error:", error);
    return [];
  }

  // Filtrar por doctor si no es admin
  const filtered = doctorFilter
    ? data.filter((a: any) => {
        const pac = a.evaluacionpredictiva?.umbralpersonalizado?.paciente;
        return pac?.doctor === doctorFilter;
      })
    : data;

  return filtered.map((a: any) => {
    const eval_ = a.evaluacionpredictiva;
    const umbral = eval_?.umbralpersonalizado;
    const pac = umbral?.paciente;

    const patientName = pac
      ? `${pac.nombres} ${pac.apellidos}`
      : "Paciente desconocido";
    const patientAge = pac ? calcAge(pac.fechanacimiento) : 0;
    const patientId = pac
      ? `PAC-${String(pac.idpaciente).padStart(5, "0")}`
      : "—";
    const doctorName: string = a.personalmedico?.nombres || "";

    return {
      id: `ALT-${String(a.idalerta).padStart(4, "0")}`,
      patientId,
      patientName,
      patientAge,
      alertType: a.alerttype || a.prioridad || "Alerta Clínica",
      reading: a.reading || "—",
      risk: a.riesgo || eval_?.nivelriesgo || "—",
      severity: mapSeverity(a.prioridad),
      status: mapAlertStatus(a.estado),
      time: relativeTime(a.fechageneracion),
      timestamp: a.fechageneracion,
      location: "Lima, Perú",
      attendedBy:
        a.estado === "Resuelta" ? doctorName : undefined,
      doctorName,
    };
  });
}

/**
 * Obtiene todos los reportes epidemiológicos con datos del médico.
 */
export async function getReportes(): Promise<ReportUI[]> {
  const { data, error } = await supabase
    .from("reporteepidemiologico")
    .select(`
      idreporte,
      fechageneracion,
      descripcion,
      titulo,
      tipo,
      periodo,
      totalpacientes,
      totalalertas,
      totalcriticos,
      riesgopromedio,
      estado,
      tamano,
      personalmedico (nombres)
    `)
    .order("fechageneracion", { ascending: false });

  if (error || !data) {
    console.error("[getReportes] error:", error);
    return [];
  }

  return data.map((r: any) => ({
    id: `RPT-${String(r.idreporte).padStart(4, "0")}`,
    title: r.titulo || r.descripcion?.substring(0, 60) || "Reporte",
    type: r.tipo || "Específico",
    generatedDate: r.fechageneracion?.split("T")[0] || "",
    period: r.periodo || "—",
    patients: r.totalpacientes || 0,
    alerts: r.totalalertas || 0,
    critical: r.totalcriticos || 0,
    avgRisk: r.riesgopromedio || "—",
    status: r.estado || "Listo",
    size: r.tamano || "—",
    description: r.descripcion || "",
    doctor: (r.personalmedico as any)?.nombres || "",
  }));
}

/**
 * Obtiene métricas agregadas para el Dashboard.
 * Usa Promise.all para paralelizar los COUNT.
 */
export async function getKPIs(doctorFilter?: string | null): Promise<KPIsData> {
  let patientIds: number[] = [];
  if (doctorFilter) {
    const { data: patients } = await supabase
      .from("paciente")
      .select("idpaciente")
      .eq("doctor", doctorFilter);
    patientIds = (patients || []).map((p) => p.idpaciente);
  }

  // Ahora corremos las consultas paralelizadas
  let queryPatients = supabase.from("paciente").select("*", { count: "exact", head: true });
  if (doctorFilter) {
    queryPatients = queryPatients.eq("doctor", doctorFilter);
  }

  let queryDevices = supabase.from("dispositivoiomt").select("*", { count: "exact", head: true }).eq("estado", "Activo");
  if (doctorFilter) {
    if (patientIds.length > 0) {
      queryDevices = queryDevices.in("idpaciente", patientIds);
    } else {
      queryDevices = queryDevices.in("idpaciente", [-1]); 
    }
  }

  let queryEvals = supabase.from("evaluacionpredictiva").select("*, umbralpersonalizado!inner(idpaciente)", { count: "exact", head: true }).neq("nivelriesgo", "Normal");
  if (doctorFilter) {
    if (patientIds.length > 0) {
      queryEvals = queryEvals.in("umbralpersonalizado.idpaciente", patientIds);
    } else {
      queryEvals = queryEvals.in("umbralpersonalizado.idpaciente", [-1]);
    }
  }

  let queryAlerts = supabase.from("alertacritica").select("*, evaluacionpredictiva!inner(umbralpersonalizado!inner(idpaciente))", { count: "exact", head: true }).in("estado", ["Pendiente", "En Revisión"]);
  if (doctorFilter) {
    if (patientIds.length > 0) {
      queryAlerts = queryAlerts.in("evaluacionpredictiva.umbralpersonalizado.idpaciente", patientIds);
    } else {
      queryAlerts = queryAlerts.in("evaluacionpredictiva.umbralpersonalizado.idpaciente", [-1]);
    }
  }

  const [
    { count: totalPacientes },
    { count: dispositivosActivos },
    { count: evaluacionesPendientes },
    { count: alertasActivas },
  ] = await Promise.all([
    queryPatients,
    queryDevices,
    queryEvals,
    queryAlerts,
  ]);

  return {
    totalPacientes: totalPacientes ?? 0,
    dispositivosActivos: dispositivosActivos ?? 0,
    evaluacionesPendientes: evaluacionesPendientes ?? 0,
    alertasActivas: alertasActivas ?? 0,
    alertasCriticas: alertasActivas ?? 0,
  };
}

/**
 * Distribución de riesgo para el donut del Dashboard.
 */
export async function getRiskDistribution(doctorFilter?: string | null): Promise<RiskDistribution> {
  let query = supabase
    .from("evaluacionpredictiva")
    .select("nivelriesgo, umbralpersonalizado!inner(idpaciente)");

  if (doctorFilter) {
    const { data: patients } = await supabase
      .from("paciente")
      .select("idpaciente")
      .eq("doctor", doctorFilter);
    const patientIds = (patients || []).map((p) => p.idpaciente);
    if (patientIds.length === 0) {
      return { bajo: 0, moderado: 0, alto: 0 };
    }
    query = query.in("umbralpersonalizado.idpaciente", patientIds);
  }

  const { data, error } = await query;
  if (error || !data) return { bajo: 0, moderado: 0, alto: 0 };

  const total = data.length || 1;
  const alto = data.filter((e: any) => e.nivelriesgo === "Riesgo Alto").length;
  const moderado = data.filter((e: any) => e.nivelriesgo === "Riesgo Medio").length;
  const bajo = data.length - alto - moderado;

  return { bajo, moderado, alto };
}

/**
 * Signos vitales recientes agrupados por tipo para las sparklines.
 * Retorna los últimos N registros de cada tipo.
 */
export async function getSignosVitalesRecientes(doctorFilter?: string | null): Promise<
  Record<string, number[]>
> {
  let query = supabase
    .from("signovital")
    .select("tipo, valor, fechahora");

  if (doctorFilter) {
    const { data: patients } = await supabase
      .from("paciente")
      .select("idpaciente, dispositivoiomt(iddispositivo)")
      .eq("doctor", doctorFilter);
    
    const deviceIds = (patients || [])
      .flatMap((p: any) => (p.dispositivoiomt || []).map((d: any) => d.iddispositivo))
      .filter(Boolean);

    if (deviceIds.length === 0) {
      return {};
    }
    query = query.in("iddispositivo", deviceIds);
  }

  const { data, error } = await query
    .order("fechahora", { ascending: false })
    .limit(60);

  if (error || !data) return {};

  const grouped: Record<string, { valor: number; fechahora: string }[]> = {};
  for (const v of data) {
    if (!grouped[v.tipo]) grouped[v.tipo] = [];
    if (grouped[v.tipo].length < 6) grouped[v.tipo].push(v);
  }

  const result: Record<string, number[]> = {};
  for (const tipo of Object.keys(grouped)) {
    result[tipo] = grouped[tipo].reverse().map((v) => v.valor);
  }
  return result;
}

/**
 * Obtiene un paciente específico por su ID de base de datos.
 */
export async function getPacienteById(idpaciente: number): Promise<PatientUI | null> {
  const { data: p, error } = await supabase
    .from("paciente")
    .select(`
      idpaciente,
      nombres,
      apellidos,
      fechanacimiento,
      genero,
      telefono,
      direccion,
      condicion,
      doctor,
      notas_medicas,
      dispositivoiomt (
        iddispositivo,
        tipo,
        estado
      ),
      umbralpersonalizado (
        idumbral,
        evaluacionpredictiva (
          idevaluacion,
          nivelriesgo,
          fechaevaluacion,
          scoregeneral
        )
      )
    `)
    .eq("idpaciente", idpaciente)
    .single();

  if (error || !p) {
    console.error("[getPacienteById] error o no encontrado:", error);
    return null;
  }

  // Cargar signos vitales recientes para este paciente
  const device = (p.dispositivoiomt || [])[0];
  const deviceVitals: Record<string, number> = {};

  if (device) {
    const { data: vitals } = await supabase
      .from("signovital")
      .select("tipo, valor, fechahora")
      .eq("iddispositivo", device.iddispositivo)
      .order("fechahora", { ascending: false });

    for (const v of vitals || []) {
      if (deviceVitals[v.tipo] === undefined) {
        deviceVitals[v.tipo] = v.valor;
      }
    }
  }

  const umbral = (p.umbralpersonalizado || [])[0];
  const evals: any[] = umbral?.evaluacionpredictiva || [];
  const latestEval = evals.sort(
    (a, b) =>
      new Date(b.fechaevaluacion).getTime() -
      new Date(a.fechaevaluacion).getTime()
  )[0];

  const lastUpdate = latestEval?.fechaevaluacion
    ? relativeTime(latestEval.fechaevaluacion)
    : "Sin datos";

  const deviceStatus: PatientUI["device"] = device
    ? device.estado === "Activo"
      ? "Conectado"
      : device.estado === "Mantenimiento"
      ? "Mantenimiento"
      : "Sin Conexión"
    : "Sin Conexión";

  return {
    idpaciente: p.idpaciente,
    id: `PAC-${String(p.idpaciente).padStart(5, "0")}`,
    name: `${p.nombres} ${p.apellidos}`,
    age: calcAge(p.fechanacimiento),
    gender: (p.genero as "M" | "F") || "M",
    condition: p.condicion || "—",
    phone: p.telefono || "—",
    address: p.direccion || "—",
    doctor: p.doctor || "—",
    hr: deviceVitals["Ritmo Cardíaco"] != null
      ? String(Math.round(deviceVitals["Ritmo Cardíaco"]))
      : "—",
    spo2: deviceVitals["SpO2"] != null
      ? String(Math.round(deviceVitals["SpO2"]))
      : "—",
    glucose: deviceVitals["Glucosa"] != null
      ? String(Math.round(deviceVitals["Glucosa"]))
      : "—",
    temperatura: deviceVitals["Temperatura"] != null
      ? deviceVitals["Temperatura"].toFixed(1)
      : "—",
    presionSistolica: deviceVitals["Presión Sistólica"] != null
      ? String(Math.round(deviceVitals["Presión Sistólica"]))
      : "—",
    risk: mapRisk(latestEval?.nivelriesgo),
    device: deviceStatus,
    deviceModel: device?.tipo || "Sin dispositivo",
    lastUpdate,
    scoreGeneral: latestEval?.scoregeneral ?? null,
    notasMedicas: p.notas_medicas || "",
  };
}

/**
 * Obtiene el historial completo de signos vitales de un paciente.
 */
export async function getHistorialSignosVitales(
  idpaciente: number
): Promise<{ tipo: string; valor: number; fechahora: string }[]> {
  const { data: devices } = await supabase
    .from("dispositivoiomt")
    .select("iddispositivo")
    .eq("idpaciente", idpaciente);

  const deviceIds = (devices || []).map((d) => d.iddispositivo);
  if (deviceIds.length === 0) return [];

  const { data, error } = await supabase
    .from("signovital")
    .select("tipo, valor, fechahora")
    .in("iddispositivo", deviceIds)
    .order("fechahora", { ascending: true });

  if (error || !data) {
    console.error("[getHistorialSignosVitales] error:", error);
    return [];
  }

  return data.map((d: any) => ({
    tipo: d.tipo,
    valor: Number(d.valor),
    fechahora: d.fechahora,
  }));
}

/**
 * Obtiene el historial completo de evaluaciones predictivas de un paciente.
 */
export async function getHistorialEvaluaciones(
  idpaciente: number
): Promise<
  {
    idevaluacion: number;
    nivelriesgo: string;
    fechaevaluacion: string;
    scoregeneral: number | null;
  }[]
> {
  const { data: thresholds } = await supabase
    .from("umbralpersonalizado")
    .select("idumbral")
    .eq("idpaciente", idpaciente);

  const thresholdIds = (thresholds || []).map((t) => t.idumbral);
  if (thresholdIds.length === 0) return [];

  const { data, error } = await supabase
    .from("evaluacionpredictiva")
    .select("idevaluacion, nivelriesgo, fechaevaluacion, scoregeneral")
    .in("idumbral", thresholdIds)
    .order("fechaevaluacion", { ascending: false });

  if (error || !data) {
    console.error("[getHistorialEvaluaciones] error:", error);
    return [];
  }

  return data.map((e: any) => ({
    idevaluacion: e.idevaluacion,
    nivelriesgo: e.nivelriesgo,
    fechaevaluacion: e.fechaevaluacion,
    scoregeneral: e.scoregeneral != null ? Number(e.scoregeneral) : null,
  }));
}

/**
 * Actualiza las notas médicas de un paciente.
 */
export async function updateNotasMedicas(
  idpaciente: number,
  notas: string
): Promise<boolean> {
  const { error } = await supabase
    .from("paciente")
    .update({ notas_medicas: notas })
    .eq("idpaciente", idpaciente);

  if (error) {
    console.error("[updateNotasMedicas] error:", error);
    return false;
  }
  return true;
}
