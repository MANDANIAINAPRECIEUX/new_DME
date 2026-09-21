export const treatments = [
  {
    id: 1,
    patientId: 1,
    label: "Traitement orthodontique",
    status: "ongoing",
    startDate: "2026-06-01",
  },

  {
    id: 2,
    patientId: 5,
    label: "Soins dentaires",
    status: "completed",
    startDate: "2026-08-19",
    dateFin: "2026-08-19", // ≥ startDate et ≥ dernière séance (consultation 102)
  },

  {
    id: 3,
    patientId: 4,
    label: "Consultation dentaire",
    status: "completed",
    startDate: "2026-08-19",
    dateFin: "2026-08-19", // ≥ startDate et ≥ dernière séance (consultation 103)
  },
];