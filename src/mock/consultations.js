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
        typeSoin: "Détartrage",
        dents: ["16", "17"],
      },
    ],
    createdAt: "2026-08-18T08:30:00.000Z",
  },

  {
    id: 102,
    appointmentId: 5,
    treatmentId: 1,
    patientId: 1,
    doctorId: 1,
    reason: "Suivi orthodontique",
    compteRendu:
      "Évolution favorable du traitement. Aucun problème particulier signalé.",
    observation:
      "Alignement satisfaisant. Ajustement de l'appareil effectué.",
    soins: [
      {
        id: 2,
        typeSoin: "Ajustement orthodontique",
        dents: ["11", "21"],
      },
    ],
    createdAt: "2026-08-22T09:30:00.000Z",
  },

  {
    id: 103,
    appointmentId: 7,
    treatmentId: 2,
    patientId: 1,
    doctorId: 1,
    reason: "Traitement de la carie sur molaire",
    compteRendu:
      "Carie molaire traitée avec succès. Contrôle final effectué.",
    observation:
      "Aucune douleur signalée. Restauration stable.",
    soins: [
      {
        id: 3,
        typeSoin: "Obturation",
        dents: ["26"],
      },
    ],
    createdAt: "2026-07-05T10:00:00.000Z",
  },

  {
    id: 104,
    appointmentId: 6,
    treatmentId: 3,
    patientId: 2,
    doctorId: 1,
    reason: "Détartrage",
    compteRendu:
      "Détartrage réalisé et contrôle de l'état gingival.",
    observation:
      "Inflammation gingivale légère. Suivi parodontal recommandé.",
    soins: [
      {
        id: 4,
        typeSoin: "Détartrage",
        dents: ["14", "15", "24", "25"],
      },
    ],
    createdAt: "2026-08-25T10:00:00.000Z",
  },
];