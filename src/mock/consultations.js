export const consultations = [
  {
    id: 101,
    appointmentId: 1,
    treatmentId: 1,
    patientId: 1,
    doctorId: 1,
    reason: "Contrôle orthodontique",

    compteRendu:
      "Contrôle de routine, patient asymptomatique depuis la dernière séance.",

    observation:
      "Poursuite du traitement orthodontique, bon alignement observé.",

    soins: [
      {
        id: 1,
        typeSoinId: 1,
        dents: ["16", "17"],
      },
    ],

    createdAt: "2026-08-18T08:30:00.000Z",
  },

  {
    id: 102,
    appointmentId: 5,
    treatmentId: 2,
    patientId: 5,
    doctorId: 1,
    reason: "Soins dentaires",

    compteRendu:
      "Soins dentaires réalisés avec succès.",

    observation:
      "Aucune complication constatée. Suivi recommandé.",

    soins: [
      {
        id: 2,
        typeSoinId: 2,
        dents: ["11", "21"],
      },
    ],

    createdAt: "2026-08-19T11:30:00.000Z",
  },

  {
    id: 103,
    appointmentId: 4,
    treatmentId: 3,
    patientId: 4,
    doctorId: 2,
    reason: "Consultation dentaire",

    compteRendu:
      "Consultation dentaire effectuée. Aucun problème particulier signalé.",

    observation:
      "État bucco-dentaire satisfaisant. Contrôle recommandé.",

    soins: [
      {
        id: 3,
        typeSoinId: 3,
        dents: ["26"],
      },
    ],

    createdAt: "2026-08-19T08:30:00.000Z",
  },
];