import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../services/useApi";
import { useAuth } from "./AuthContext";

const ConsultationContext = createContext();

const toDay = (value) => (value ? value.slice(0, 10) : null);

// Certaines routes renvoient un tableau direct, d'autres { data }
const listOf = (res) => (Array.isArray(res) ? res : res.data);
const itemOf = (res) => res.data ?? res;

// Le backend attend le montant sous forme de texte, avec au plus 2 décimales
const toAmountString = (amount) => Number(amount).toFixed(2);

function normalizePayment(payment) {
  return {
    id: payment.id,
    consultationId: payment.consultationId,
    amount: Number(payment.amount),
    paymentDate: toDay(payment.paymentDate),
    remark: payment.remark ?? "",
  };
}

const sortPayments = (list) =>
  [...list].sort(
    (a, b) => a.paymentDate.localeCompare(b.paymentDate) || a.id - b.id
  );

// L'API renvoie les dents sous la forme [{ dent: { id, number } }]
function normalizeSoin(soin) {
  return {
    id: soin.id,
    consultationId: soin.consultationId,
    typeSoinId: soin.typeSoinId,
    observation: soin.observation ?? "",
    dents: (soin.dents ?? []).map((d) => d.dent.number),
  };
}

// Le patient n'est pas porté par la consultation : il vient du rendez-vous
function normalizeConsultation(raw, soins, paiements) {
  return {
    id: raw.id,
    appointmentId: raw.appointmentId,
    treatmentId: raw.treatmentId,
    doctorId: raw.doctorId,
    doctor: raw.doctor ?? null,
    patientId: raw.appointment?.patientId,
    consultationDate: toDay(raw.consultationDate),
    compteRendu: raw.compteRendu ?? "",
    createdAt: raw.createdAt,
    soins,
    paiements,
  };
}

export function ConsultationProvider({ children }) {
  const api = useApi();
  const { status } = useAuth();

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status !== "authorized") {
      setConsultations([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // La liste des consultations ne contient pas les dents : on charge les soins à part
        const [consultationsRes, soinsRes] = await Promise.all([
          api("/api/consultations"),
          api("/api/soins"),
        ]);

        const soinsByConsultation = {};
        listOf(soinsRes)
          .map(normalizeSoin)
          .sort((a, b) => a.id - b.id)
          .forEach((soin) => {
            (soinsByConsultation[soin.consultationId] ??= []).push(soin);
          });

        const list = listOf(consultationsRes).map((raw) =>
          normalizeConsultation(
            raw,
            soinsByConsultation[raw.id] ?? [],
            sortPayments((raw.payments ?? []).map(normalizePayment))
          )
        );

        if (!cancelled) setConsultations(list);
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

  // Le backend n'a pas d'enregistrement groupé : consultation, puis soins, puis paiements.
  // Si une étape après la première échoue, la consultation existe déjà :
  // on renvoie la liste des échecs au lieu de lever une erreur.
  const addConsultation = async ({
    appointmentId,
    treatmentId,
    consultationDate,
    compteRendu,
    soins = [],
    paiements = [],
  }) => {
    const created = await api("/api/consultations", {
      method: "POST",
      body: JSON.stringify({
        appointmentId,
        treatmentId: treatmentId ?? null,
        consultationDate,
        compteRendu: compteRendu?.trim() || null,
      }),
    });
    const raw = itemOf(created);

    const failures = [];

    const soinResults = await Promise.allSettled(
      soins.map((soin) =>
        api("/api/soins", {
          method: "POST",
          body: JSON.stringify({
            consultationId: raw.id,
            typeSoinId: soin.typeSoinId,
            observation: soin.observation?.trim() || null,
            dentIds: soin.dentIds,
          }),
        })
      )
    );

    const savedSoins = [];
    soinResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        savedSoins.push(normalizeSoin(itemOf(result.value)));
      } else {
        failures.push(`soin n°${index + 1} : ${result.reason.message}`);
      }
    });

    const paymentResults = await Promise.allSettled(
      paiements.map((p) =>
        api("/api/payments", {
          method: "POST",
          body: JSON.stringify({
            consultationId: raw.id,
            paymentDate: p.paymentDate,
            amount: toAmountString(p.amount),
            remark: p.remark?.trim() || null,
          }),
        })
      )
    );

    const savedPayments = [];
    paymentResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        savedPayments.push(normalizePayment(itemOf(result.value)));
      } else {
        failures.push(`paiement n°${index + 1} : ${result.reason.message}`);
      }
    });

    const consultation = normalizeConsultation(
      raw,
      savedSoins,
      sortPayments(savedPayments)
    );

    setConsultations((prev) => [consultation, ...prev]);
    return { consultation, failures };
  };

  // Règlement différé du solde d'une consultation existante
  const addPayment = async (consultationId, { amount, paymentDate, remark }) => {
    const res = await api("/api/payments", {
      method: "POST",
      body: JSON.stringify({
        consultationId,
        paymentDate,
        amount: toAmountString(amount),
        remark: remark?.trim() || null,
      }),
    });

    const payment = normalizePayment(itemOf(res));

    setConsultations((prev) =>
      prev.map((c) =>
        c.id === consultationId
          ? { ...c, paiements: sortPayments([...c.paiements, payment]) }
          : c
      )
    );

    return payment;
  };

  return (
    <ConsultationContext.Provider
      value={{ consultations, loading, error, addConsultation, addPayment }}
    >
      {children}
    </ConsultationContext.Provider>
  );
}

export function useConsultations() {
  return useContext(ConsultationContext);
}