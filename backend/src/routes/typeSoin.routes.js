import { Router } from "express";
import requireDoctor from "../middlewares/requireDoctor.js";
import validate from "../middlewares/validate.js";
import {
  createTypeSoinSchema,
  typeSoinIdSchema,
} from "../validators/typeSoin.validator.js";
import {
  createTypeSoin,
  listTypesSoins,
  getTypeSoin,
} from "../controllers/typeSoin.controller.js";

const router = Router();

router.use(requireDoctor);

router.post("/", validate(createTypeSoinSchema), createTypeSoin);
router.get("/", listTypesSoins);
router.get("/:id", validate(typeSoinIdSchema, "params"), getTypeSoin);

export default router;
