import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../services/useApi";
import { useAuth } from "./AuthContext";

const TreatmentContext = createContext();

const toDay = (value) => (value ? value.slice(0, 10) : null);

// Le patient est déjà dans PatientContext : on ne le garde pas ici
function normalizeTreatment({ patient: _patient, ...treatment }) {
  return {
    ...treatment,
    startDate: toDay(treatment.startDate),
    endDate: toDay(treatment.endDate),
  };
}

function sortTreatments(list) {
  return [...list].sort(
    (a, b) => b.startDate.localeCompare(a.startDate) || b.id - a.id
  );
}

export function TreatmentProvider({ children }) {
  const api = useApi();
  const { status } = useAuth();

  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status !== "authorized") {
      setTreatments([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api("/api/treatments");
        const list = Array.isArray(res) ? res : res.data;
        if (!cancelled) setTreatments(sortTreatments(list.map(normalizeTreatment)));
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

  // Crée un traitement "ongoing" ; startDate (AAAA-MM-JJ) est obligatoire côté API
  const addTreatment = async ({ patientId, label, startDate }) => {
    const res = await api("/api/treatments", {
      method: "POST",
      body: JSON.stringify({
        patientId: Number(patientId),
        label: label.trim(),
        startDate,
      }),
    });

    const created = normalizeTreatment(res.data ?? res);
    setTreatments((prev) => sortTreatments([...prev, created]));
    return created;
  };

  const patchTreatment = async (id, changes) => {
    const res = await api(`/api/treatments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    });

    const updated = normalizeTreatment(res.data ?? res);
    setTreatments((prev) =>
      sortTreatments(prev.map((t) => (t.id === updated.id ? updated : t)))
    );
    return updated;
  };

  // La base exige : completed ⇒ endDate renseignée
  const completeTreatment = (id, endDate) =>
    patchTreatment(id, { status: "completed", endDate });

  // ... et ongoing ⇒ endDate vide (RG08 : réouverture)
  const reopenTreatment = (id) =>
    patchTreatment(id, { status: "ongoing", endDate: null });

  return (
    <TreatmentContext.Provider
      value={{
        treatments,
        loading,
        error,
        addTreatment,
        completeTreatment,
        reopenTreatment,
      }}
    >
      {children}
    </TreatmentContext.Provider>
  );
}

export function useTreatments() {
  return useContext(TreatmentContext);
}