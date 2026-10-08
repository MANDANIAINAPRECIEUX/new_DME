import { Router } from "express";

import requireDoctor from "../middlewares/requireDoctor.js";

import {
  list,
  getById,
  listByConsultation,
  create,
  update,
} from "../controllers/soin.controller.js";

const router = Router();

router.use(requireDoctor);

router.get("/", list);

router.get("/consultation/:id", listByConsultation);

router.get("/:id", getById);

router.post("/", create);

router.patch("/:id", update);

export default router;
