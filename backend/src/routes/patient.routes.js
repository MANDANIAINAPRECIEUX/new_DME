import { Router } from "express";
import requireDoctor from "../middlewares/requireDoctor.js";
import validate from "../middlewares/validate.js";
import {
  createPatientSchema,
  listPatientsSchema,
  patientIdSchema,
} from "../validators/patient.validator.js";
import {
  createPatient,
  listPatients,
  getPatient,
} from "../controllers/patient.controller.js";

const router = Router();

// Toutes les routes patients nécessitent un docteur autorisé.
router.use(requireDoctor);

router.post("/", validate(createPatientSchema), createPatient);

router.get("/", validate(listPatientsSchema, "query"), listPatients);

router.get("/:id", validate(patientIdSchema, "params"), getPatient);

export default router;