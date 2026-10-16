import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../services/useApi";
import { useAuth } from "./AuthContext";

const AppointmentContext = createContext();

// 100 = maximum autorisé par appointment.validator.js
const PAGE_SIZE = 100;

// RG07 : le serveur ne passe pas encore le rendez-vous à "completed"
// quand une consultation est créée : on le déduit de la consultation liée.
function normalizeAppointment(appointment) {
  return appointment.consultation && appointment.status === "pending"
    ? { ...appointment, status: "completed" }
    : appointment;
}

function sortAppointments(list) {
  return [...list].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.time.localeCompare(b.time) ||
      a.id - b.id
  );
}

// Le backend refuse les champs inconnus : on n'envoie ni doctorId ni status
// (le docteur connecté et le statut "pending" sont imposés par le serveur).
function toAppointmentPayload(formData) {
  return {
    patientId: Number(formData.patientId),
    date: formData.date,
    time: formData.time,
    reason: formData.reason?.trim() || null,
  };
}

async function fetchAllAppointments(api) {
  const all = [];
  let page = 1;
  let totalPages = 1;

  do {
    const res = await api(`/api/appointments?page=${page}&limit=${PAGE_SIZE}`);
    all.push(...res.data);
    totalPages = res.pagination.totalPages;
    page += 1;
  } while (page <= totalPages);

  return all;
}

export function AppointmentProvider({ children }) {
  const api = useApi();
  const { status } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status !== "authorized") {
      setAppointments([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const all = await fetchAllAppointments(api);
        if (!cancelled) setAppointments(all.map(normalizeAppointment));
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

  const replaceInState = (updated) => {
    const next = normalizeAppointment(updated);
    setAppointments((prev) =>
      sortAppointments(prev.map((a) => (a.id === next.id ? next : a)))
    );
  };

  const addAppointment = async (formData) => {
    const res = await api("/api/appointments", {
      method: "POST",
      body: JSON.stringify(toAppointmentPayload(formData)),
    });

    setAppointments((prev) => sortAppointments([...prev, normalizeAppointment(res.data)]));
    return res.data;
  };

  const updateAppointment = async (id, formData) => {
    const res = await api(`/api/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(toAppointmentPayload(formData)),
    });

    replaceInState(res.data);
    return res.data;
  };

  const cancelAppointment = async (id) => {
    const res = await api(`/api/appointments/${id}/cancel`, { method: "POST" });

    replaceInState(res.data);
    return res.data;
  };

  // TEMPORAIRE : les consultations sont encore simulées, et le backend refuse
  // le statut "completed" par PATCH (réservé à la création d'une consultation).
  // Cette fonction ne modifie que l'affichage local. À supprimer quand les
  // consultations seront branchées sur l'API.
  const patchAppointmentLocally = (id, changes) =>
    setAppointments((prev) =>
      prev.map((a) => (a.id === Number(id) ? { ...a, ...changes } : a))
    );

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        error,
        addAppointment,
        updateAppointment,
        cancelAppointment,
        patchAppointmentLocally,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  return useContext(AppointmentContext);
}