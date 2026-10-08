import { Router } from "express";
import requireDoctor from "../middlewares/requireDoctor.js";

import {
  list,
  getById,
  create,
  update,
} from "../controllers/consultation.controller.js";

const router = Router();

router.use(requireDoctor);

router.get("/", list);
router.get("/:id", getById);
router.post("/", create);
router.patch("/:id", update);

export default router;
