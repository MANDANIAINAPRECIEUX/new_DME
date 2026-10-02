export const consultations = [
  {
    id: 101,
    appointmentId: 1,
    treatmentId: 1,
    patientId: 1,
    doctorId: 1,
    consultationDate: "2026-08-18",
    compteRendu: "Contrôle de routine, patient asymptomatique depuis la dernière séance.",
    soins: [
      {
        id: 1,
        typeSoinId: 1,
        dents: ["16", "17"],
        observation: "Bon alignement observé, poursuite du traitement orthodontique.",
      },
    ],
    paiements: [
      { id: 1, amount: 30000, paymentDate: "2026-08-18", remark: "" },
    ],
    createdAt: "2026-08-18T08:30:00.000Z",
  },

  {
    id: 102,
    appointmentId: 5,
    treatmentId: 2,
    patientId: 5,
    doctorId: 1,
    consultationDate: "2026-08-19",
    compteRendu: "Soins dentaires réalisés avec succès.",
    soins: [
      {
        id: 2,
        typeSoinId: 2,
        dents: ["11", "21"],
        observation: "Aucune complication constatée.",
      },
    ],
    paiements: [
      { id: 2, amount: 80000, paymentDate: "2026-08-19", remark: "" },
    ],
    createdAt: "2026-08-19T11:30:00.000Z",
  },

  {
    id: 103,
    appointmentId: 4,
    treatmentId: 3,
    patientId: 4,
    doctorId: 2,
    consultationDate: "2026-08-19",
    compteRendu: "Consultation dentaire effectuée. Aucun problème particulier signalé.",
    soins: [
      {
        id: 3,
        typeSoinId: 3,
        dents: ["26"],
        observation: "État bucco-dentaire satisfaisant.",
      },
    ],
    paiements: [
      { id: 3, amount: 100000, paymentDate: "2026-08-19", remark: "" },
    ],
    createdAt: "2026-08-19T08:30:00.000Z",
  },
];