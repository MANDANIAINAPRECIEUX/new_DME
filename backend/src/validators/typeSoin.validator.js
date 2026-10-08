import * as yup from "yup";

// Le tarif est défini à la création et reste fixe.
export const createTypeSoinSchema = yup
  .object({
    label: yup
      .string()
      .trim()
      .required("Libellé obligatoire.")
      .max(150, "Le libellé ne doit pas dépasser 150 caractères."),

    tarif: yup
      .number()
      .typeError("Le tarif doit être un nombre.")
      .required("Tarif obligatoire.")
      .min(0, "Le tarif ne peut pas être négatif.")
      .max(99999999.99, "Le tarif est trop élevé.")
      .test(
        "decimal-places",
        "Le tarif doit avoir au maximum deux décimales.",
        (value) =>
          value === undefined || Math.round(value * 100) / 100 === value,
      ),
  })
  .noUnknown(true, "Un champ envoyé n'est pas autorisé.")
  .required();

export const typeSoinIdSchema = yup
  .object({
    id: yup
      .string()
      .required("Identifiant obligatoire.")
      .matches(/^[1-9]\d*$/, "Identifiant invalide.")
      .test(
        "id-range",
        "Identifiant invalide.",
        (value) => Number(value) <= 2147483647,
      ),
  })
  .noUnknown(true, "Un paramètre envoyé n'est pas autorisé.");
