import { Router } from "express";

import  requireDoctor  from "../middlewares/requireDoctor.js";

import {
  list,
  getById,
  listByPatient,
  create,
  update,
} from "../controllers/treatment.controller.js";

const router = Router();

router.use(requireDoctor);

router.get("/", list);
router.get("/patient/:patientId", listByPatient);
router.get("/:id", getById);
router.post("/", create);
router.patch("/:id", update);

export default router;
