import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../services/useApi";
import { useAuth } from "./AuthContext";

const PatientContext = createContext();

// À ajuster selon la limite maximale autorisée par patient.validator.js
const PAGE_SIZE = 100;

function sortPatients(list) {
  return [...list].sort(
    (a, b) =>
      a.lastName.localeCompare(b.lastName, "fr") ||
      a.firstName.localeCompare(b.firstName, "fr") ||
      a.id - b.id
  );
}

// Le backend n'accepte que ces champs (pas d'email)
function toPatientPayload(formData, { isUpdate = false } = {}) {
  const payload = {
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    gender: formData.gender,
    birthDate: formData.birthDate,
    phone: formData.phone.trim(),
  };

  const address = formData.address?.trim();
  if (address) {
    payload.address = address;
  } else if (isUpdate) {
    payload.address = null; // permet d'effacer l'adresse existante
  }

  return payload;
}

async function fetchAllPatients(api) {
  const all = [];
  let page = 1;
  let totalPages = 1;

  do {
    const res = await api(`/api/patients?page=${page}&limit=${PAGE_SIZE}`);
    all.push(...res.data);
    totalPages = res.pagination.totalPages;
    page += 1;
  } while (page <= totalPages);

  return all;
}

export function PatientProvider({ children }) {
  const api = useApi();
  const { status } = useAuth();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ne charger qu'une fois le docteur authentifié et autorisé
    if (status !== "authorized") {
      setPatients([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const all = await fetchAllPatients(api);
        if (!cancelled) setPatients(all);
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

  const addPatient = async (formData) => {
    const res = await api("/api/patients", {
      method: "POST",
      body: JSON.stringify(toPatientPayload(formData)),
    });

    setPatients((prev) => sortPatients([...prev, res.data]));
    return res.data;
  };

  const updatePatient = async (id, formData) => {
    const res = await api(`/api/patients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(toPatientPayload(formData, { isUpdate: true })),
    });

    setPatients((prev) =>
      sortPatients(prev.map((p) => (p.id === res.data.id ? res.data : p)))
    );
    return res.data;
  };

  return (
    <PatientContext.Provider
      value={{ patients, loading, error, addPatient, updatePatient }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  return useContext(PatientContext);
}