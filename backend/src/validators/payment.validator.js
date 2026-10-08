import * as yup from "yup";

const isValidDate = (value) => {
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
  .strict(true)
  .test(
    "valid-date",
    "Date invalide (AAAA-MM-JJ)",
    (value) => value === undefined || isValidDate(value),
  );

const amountSchema = yup
  .string()
  .strict(true)
  .matches(
    /^(?:0|[1-9]\d{0,7})(?:\.\d{1,2})?$/,
    "Montant invalide (exemple : 45.50)",
  )
  .test(
    "positive",
    "Le montant doit être supérieur à zéro",
    (value) => value === undefined || Number(value) > 0,
  );

export const createPaymentSchema = yup
  .object({
    consultationId: yup.number().integer().positive().required(),

    paymentDate: dateSchema.required(),

    amount: amountSchema.required(),

    remark: yup.string().trim().max(1000).nullable().optional(),
  })
  .required()
  .noUnknown(true);

export const updatePaymentSchema = yup
  .object({
    paymentDate: dateSchema,

    amount: amountSchema,

    remark: yup.string().trim().max(1000).nullable(),
  })
  .required()
  .noUnknown(true);
