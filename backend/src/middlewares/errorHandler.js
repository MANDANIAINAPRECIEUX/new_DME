import AppError from "../utils/AppError.js";

export default function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "Le corps de la requête doit être un JSON valide.",
      },
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      error: {
        code: "PAYLOAD_TOO_LARGE",
        message: "Les données envoyées sont trop volumineuses.",
      },
    });
  }

  // Journaliser uniquement le type et le code de l’erreur.
  console.error("Erreur API :", {
  method: req.method,
  path: req.path,
  name: err.name,
  code: err.code,
  message: err.message,
});

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Une erreur interne est survenue.",
    },
  });
}