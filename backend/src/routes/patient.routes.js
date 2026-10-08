import { Router } from "express";
import requireDoctor from "../middlewares/requireDoctor.js";
import validate from "../middlewares/validate.js";
import {
  createPatientSchema,
  listPatientsSchema,
  updatePatientSchema,
  patientIdSchema,
} from "../validators/patient.validator.js";
import {
  createPatient,
  listPatients,
  updatePatient,
  getPatient,
} from "../controllers/patient.controller.js";

const router = Router();

// Toutes les routes patients nécessitent un docteur autorisé.
router.use(requireDoctor);

router.post("/", validate(createPatientSchema), createPatient);

router.get("/", validate(listPatientsSchema, "query"), listPatients);

router.get("/:id", validate(patientIdSchema, "params"), getPatient);
router.patch(
  "/:id",
  validate(patientIdSchema, "params"),
  validate(updatePatientSchema),
  updatePatient,
);

export default router;
