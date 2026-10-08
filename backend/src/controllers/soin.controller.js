import { ValidationError } from "yup";

import {
  createSoinSchema,
  updateSoinSchema,
} from "../validators/soin.validator.js";

import {
  listSoins,
  getSoin,
  getSoinsByConsultation,
  createSoin,
  updateSoin,
} from "../services/soin.service.js";

const parseId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const handleError = (error, res, next) => {
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

  return next(error);
};

export async function list(req, res, next) {
  try {
    const result = await listSoins(req.doctor.id);
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

    const result = await getSoin(id, req.doctor.id);

    if (!result) {
      return res.status(404).json({
        error: { message: "Soin introuvable" },
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function listByConsultation(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: {
          message: "Identifiant de consultation invalide",
        },
      });
    }

    const result = await getSoinsByConsultation(id, req.doctor.id);

    return res.status(200).json(result);
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function create(req, res, next) {
  try {
    const data = await createSoinSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const result = await createSoin(data, req.doctor.id);

    return res.status(201).json(result);
  } catch (error) {
    handleError(error, res, next);
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

    const data = await updateSoinSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        error: {
          message: "Aucune donnée à modifier",
        },
      });
    }

    const result = await updateSoin(id, data, req.doctor.id);

    return res.status(200).json(result);
  } catch (error) {
    handleError(error, res, next);
  }
}
