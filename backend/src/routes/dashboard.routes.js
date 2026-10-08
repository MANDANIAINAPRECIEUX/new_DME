import { Router } from "express";

import requireDoctor from "../middlewares/requireDoctor.js";

import { summary } from "../controllers/dashboard.controller.js";

const router = Router();

router.use(requireDoctor);

router.get("/summary", summary);

export default router;
