import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useApi } from "../services/useApi";
import { useAuth } from "./AuthContext";

const DentContext = createContext();

export function DentProvider({ children }) {
  const api = useApi();
  const { status } = useAuth();

  const [dents, setDents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status !== "authorized") {
      setDents([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api("/api/dents");
        // Ce endpoint renvoie un tableau direct ; on accepte aussi { data }
        const list = Array.isArray(res) ? res : res.data;
        if (!cancelled) setDents(list);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [status, api]);

  // Numéro de dent ("16") → identifiant en base, attendu par l'API des soins (dentIds)
  const dentIdByNumber = useMemo(
    () => Object.fromEntries(dents.map((d) => [d.number, d.id])),
    [dents]
  );

  const toDentIds = (numbers) =>
    numbers.map((number) => dentIdByNumber[number]).filter(Boolean);

  return (
    <DentContext.Provider value={{ dents, loading, error, toDentIds }}>
      {children}
    </DentContext.Provider>
  );
}

export function useDents() {
  return useContext(DentContext);
}