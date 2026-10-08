import * as yup from "yup";

const validDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
};

const dateField = yup
  .string()
  .test(
    "valid-date",
    "Date invalide (AAAA-MM-JJ)",
    (value) => value === undefined || value === null || validDate(value),
  );

export const createTreatmentSchema = yup
  .object({
    patientId: yup.number().integer().positive().required(),
    label: yup.string().trim().min(2).max(255).required(),
    status: yup.string().oneOf(["ongoing", "completed"]).default("ongoing"),
    startDate: dateField.required(),
    endDate: dateField.nullable().optional(),
    observation: yup.string().trim().nullable().optional(),
  })
  .noUnknown(true)
  .test(
    "date-order",
    "La date de fin doit être >= à la date de début",
    (value) =>
      !value?.endDate || !value?.startDate || value.endDate >= value.startDate,
  );

export const updateTreatmentSchema = yup
  .object({
    label: yup.string().trim().min(2).max(255),
    status: yup.string().oneOf(["ongoing", "completed"]),
    startDate: dateField,
    endDate: dateField.nullable(),
    observation: yup.string().trim().nullable(),
  })
  .noUnknown(true);
