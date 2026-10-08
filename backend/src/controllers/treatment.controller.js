import { ValidationError } from "yup";

import {
  createTreatmentSchema,
  updateTreatmentSchema,
} from "../validators/treatment.validator.js";

import {
  listTreatments,
  getTreatment,
  getPatientTreatments,
  createTreatment,
  updateTreatment,
} from "../services/treatment.service.js";

const parseId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const sendError = (error, res, next) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: {
        message: "Données invalides",
        details: error.errors,
      },
    });
  }

  if (error.status) {
    return res.status(error.status).json({
      error: { message: error.message },
    });
  }

  next(error);
};

export async function list(req, res, next) {
  try {
    const result = await listTreatments();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: { message: "Identifiant invalide" },
      });
    }

    const treatment = await getTreatment(id);

    if (!treatment) {
      return res.status(404).json({
        error: { message: "Traitement introuvable" },
      });
    }

    return res.status(200).json(treatment);
  } catch (error) {
    next(error);
  }
}

export async function listByPatient(req, res, next) {
  try {
    const patientId = parseId(req.params.patientId);

    if (!patientId) {
      return res.status(400).json({
        error: { message: "Identifiant patient invalide" },
      });
    }

    const result = await getPatientTreatments(patientId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const data = await createTreatmentSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const result = await createTreatment(data);
    return res.status(201).json(result);
  } catch (error) {
    return sendError(error, res, next);
  }
}

export async function update(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: { message: "Identifiant invalide" },
      });
    }

    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body) ||
      Object.keys(req.body).length === 0
    ) {
      return res.status(400).json({
        error: { message: "Aucune donnée à modifier" },
      });
    }

    const data = await updateTreatmentSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        error: { message: "Aucun champ autorisé à modifier" },
      });
    }

    const result = await updateTreatment(id, data);
    return res.status(200).json(result);
  } catch (error) {
    return sendError(error, res, next);
  }
}
