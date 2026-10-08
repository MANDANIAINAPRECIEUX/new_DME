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

const dateSchema = yup
  .string()
  .test(
    "valid-date",
    "Date invalide (AAAA-MM-JJ)",
    (value) => value === undefined || validDate(value),
  );

export const createConsultationSchema = yup
  .object({
    appointmentId: yup.number().integer().positive().required(),

    treatmentId: yup.number().integer().positive().nullable().optional(),

    consultationDate: dateSchema.required(),

    compteRendu: yup.string().trim().nullable().optional(),
  })
  .required()
  .noUnknown(true);

export const updateConsultationSchema = yup
  .object({
    treatmentId: yup.number().integer().positive().nullable(),

    consultationDate: dateSchema,

    compteRendu: yup.string().trim().nullable(),
  })
  .required()
  .noUnknown(true);

export const consultationIdSchema = yup
  .object({
    id: yup.number().integer().positive().required(),
  })
  .required();
