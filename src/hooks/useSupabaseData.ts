// ─── SISP · Hook genérico para fetch desde Supabase ──────────────────────────
"use client";

import { useState, useEffect, useCallback } from "react";

interface UseSupabaseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook genérico para cargar datos de Supabase.
 * @param fetcher - función async que retorna los datos
 * @param deps - dependencias para re-ejecutar el fetch (opcional)
 */
export function useSupabaseData<T>(
  fetcher: () => Promise<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[] = []
): UseSupabaseDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      console.error("[useSupabaseData] Error:", err);
      setError(
        err instanceof Error ? err.message : "Error desconocido al cargar datos."
      );
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
