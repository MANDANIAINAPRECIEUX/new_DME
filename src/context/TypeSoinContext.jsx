import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../services/useApi";
import { useAuth } from "./AuthContext";

const TypeSoinContext = createContext();

function sortTypesSoins(list) {
  return [...list].sort(
    (a, b) => a.label.localeCompare(b.label, "fr") || a.id - b.id
  );
}

export function TypeSoinProvider({ children }) {
  const api = useApi();
  const { status } = useAuth();

  const [typesSoins, setTypesSoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status !== "authorized") {
      setTypesSoins([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api("/api/types-soins");
        if (!cancelled) setTypesSoins(res.data);
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

  // Le backend exige un tarif de type nombre et un libellé déjà nettoyé
  const addTypeSoin = async (label, tarif) => {
    const res = await api("/api/types-soins", {
      method: "POST",
      body: JSON.stringify({ label: label.trim(), tarif: Number(tarif) }),
    });

    setTypesSoins((prev) => sortTypesSoins([...prev, res.data]));
    return res.data;
  };

  return (
    <TypeSoinContext.Provider value={{ typesSoins, loading, error, addTypeSoin }}>
      {children}
    </TypeSoinContext.Provider>
  );
}

export function useTypesSoins() {
  return useContext(TypeSoinContext);
}