import { ValidationError } from "yup";
import AppError from "../utils/AppError.js";

export default function validate(schema, source = "body") {
  return async (req, res, next) => {
    try {
      const data = await schema.validate(req[source], {
        abortEarly: false,
        strict: true,
      });

      // Conserver les données validées sans modifier req.query.
      req.validated ??= {};
      req.validated[source] = data;

      next();
    } catch (error) {
      if (!(error instanceof ValidationError)) {
        return next(error);
      }

      const errors = error.inner.length ? error.inner : [error];

      return next(
        new AppError(
          400,
          "VALIDATION_ERROR",
          "Les données envoyées sont invalides.",
          errors.map((item) => ({
            field: item.path || source,
            message: item.message,
          }))
        )
      );
    }
  };
}