export const consultations = [
  {
    id: 1,
    appointmentId: 3,
    patientId: 3,
    doctorId: 1,

    reason: "Détartrage",

    observations:
      "Présence de tartre sur les faces linguales des incisives inférieures.",

    diagnosis:
      "Accumulation de tartre sans complication particulière.",

    notes:
      "Conseil donné au patient concernant l'hygiène bucco-dentaire.",

    acts: [
      {
        tooth: "31",
        act: "Détartrage",
        treatment: "Prévention"
      },
      {
        tooth: "41",
        act: "Détartrage",
        treatment: "Prévention"
      }
    ]
  }
];