import * as yup from "yup";

function validDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

function integerId() {
  return yup
    .number()
    .typeError("L'identifiant doit être un nombre.")
    .integer("Identifiant invalide.")
    .min(1)
    .max(2147483647);
}

function dateField() {
  return yup
    .string()
    .test(
      "valid-date",
      "Une date valide au format YYYY-MM-DD est attendue.",
      (value) => value === undefined || validDate(value),
    );
}

function timeField() {
  return yup
    .string()
    .matches(
      /^([01]\d|2[0-3]):00$/,
      "L'heure doit être entière, au format HH:00.",
    );
}

function queryInteger(maximum) {
  return yup
    .string()
    .matches(/^[1-9]\d*$/, "Un entier positif est attendu.")
    .test(
      "maximum",
      "Valeur trop élevée.",
      (value) => value === undefined || Number(value) <= maximum,
    )
    .optional();
}

export const createAppointmentSchema = yup
  .object({
    patientId: integerId().required("Patient obligatoire."),

    // Sans doctorId, le docteur connecté est utilisé.
    doctorId: integerId().optional(),

    date: dateField().required("Date obligatoire."),
    time: timeField().required("Heure obligatoire."),
    reason: yup.string().trim().max(500).nullable().optional(),

    // Accepté mais ignoré : le service force toujours pending.
    status: yup.mixed().nullable().optional(),
  })
  .noUnknown(true, "Un champ envoyé n'est pas autorisé.")
  .required();

export const updateAppointmentSchema = yup
  .object({
    patientId: integerId().optional(),
    doctorId: integerId().optional(),
    date: dateField().optional(),
    time: timeField().optional(),
    reason: yup.string().trim().max(500).nullable().optional(),

    status: yup
      .string()
      .oneOf(
        ["pending", "cancelled"],
        "Le statut completed est réservé aux consultations.",
      )
      .optional(),
  })
  .noUnknown(true, "Un champ envoyé n'est pas autorisé.")
  .required()
  .test("non-empty", "Envoyez au moins un champ à modifier.", (value) =>
    Boolean(value && Object.keys(value).length > 0),
  );

export const appointmentIdSchema = yup
  .object({
    id: queryInteger(2147483647).required(),
  })
  .noUnknown();

export const listAppointmentsSchema = yup
  .object({
    page: queryInteger(100000),
    limit: queryInteger(100),
    patientId: queryInteger(2147483647),
    doctorId: queryInteger(2147483647),
    date: dateField().optional(),
    status: yup
      .string()
      .oneOf(["pending", "completed", "cancelled"])
      .optional(),
  })
  .noUnknown(true, "Un paramètre de recherche n'est pas autorisé.");
