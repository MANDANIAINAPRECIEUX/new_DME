import * as yup from "yup";

// Vérifier le format, la réalité de la date et l'absence de date future.
function validBirthDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    value <= new Date().toISOString().slice(0, 10)
  );
}

export const createPatientSchema = yup
  .object({
    firstName: yup.string().trim().required("Prénom obligatoire.").max(100),
    lastName: yup.string().trim().required("Nom obligatoire.").max(100),

    gender: yup
      .string()
      .oneOf(["M", "F"], "Le sexe doit être M ou F.")
      .required("Sexe obligatoire."),

    birthDate: yup
      .string()
      .required("Date de naissance obligatoire.")
      .test(
        "birth-date",
        "La date de naissance doit être valide, au format YYYY-MM-DD, et non future.",
        validBirthDate,
      ),

    phone: yup.string().trim().required("Téléphone obligatoire.").max(30),
    address: yup.string().trim().max(500).nullable().optional(),
  })
  .noUnknown(true, "Un champ envoyé n'est pas autorisé.")
  .required();

export const patientIdSchema = yup
  .object({
    id: yup
      .string()
      .required()
      .matches(/^[1-9]\d*$/, "Identifiant invalide.")
      .test(
        "id-range",
        "Identifiant invalide.",
        (value) => Number(value) <= 2147483647,
      ),
  })
  .noUnknown();

function positiveInteger(maximum) {
  return yup
    .string()
    .matches(/^[1-9]\d*$/, "Un entier positif est attendu.")
    .test(
      "maximum",
      `La valeur ne doit pas dépasser ${maximum}.`,
      (value) => value === undefined || Number(value) <= maximum,
    )
    .optional();
}

export const listPatientsSchema = yup
  .object({
    page: positiveInteger(100000),
    limit: positiveInteger(100),
    search: yup.string().trim().max(100).optional(),
    gender: yup.string().oneOf(["M", "F"]).optional(),
  })
  .noUnknown(true, "Un paramètre de recherche n'est pas autorisé.");

// Les champs sont facultatifs, mais valides lorsqu'ils sont envoyés.
export const updatePatientSchema = yup
  .object({
    firstName: yup.string().trim().min(1).max(100).optional(),
    lastName: yup.string().trim().min(1).max(100).optional(),
    gender: yup.string().oneOf(["M", "F"]).optional(),

    birthDate: yup
      .string()
      .optional()
      .test(
        "birth-date",
        "La date de naissance doit être valide, au format YYYY-MM-DD, et non future.",
        (value) => value === undefined || validBirthDate(value),
      ),

    phone: yup.string().trim().min(1).max(30).optional(),
    address: yup.string().trim().max(500).nullable().optional(),
  })
  .noUnknown(true, "Un champ envoyé n'est pas autorisé.")
  .required()
  .test("non-empty", "Envoyez au moins un champ à modifier.", (value) =>
    Boolean(value && Object.keys(value).length > 0),
  );
