import * as yup from "yup";

const dentIdsSchema = yup
  .array()
  .of(yup.number().integer().positive().required())
  .test(
    "unique-dents",
    "Une dent ne peut pas être indiquée plusieurs fois",
    (value) => !value || new Set(value).size === value.length,
  );

export const createSoinSchema = yup
  .object({
    consultationId: yup.number().integer().positive().required(),

    typeSoinId: yup.number().integer().positive().required(),

    observation: yup.string().trim().nullable().optional(),

    dentIds: dentIdsSchema.default([]),
  })
  .required()
  .noUnknown(true);

export const updateSoinSchema = yup
  .object({
    typeSoinId: yup.number().integer().positive(),

    observation: yup.string().trim().nullable(),

    dentIds: dentIdsSchema,
  })
  .required()
  .noUnknown(true);
