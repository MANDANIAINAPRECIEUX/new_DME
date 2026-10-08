import { Router } from "express";
import requireDoctor from "../middlewares/requireDoctor.js";
import { list } from "../controllers/dent.controller.js";

const router = Router();

router.use(requireDoctor);

router.get("/", list);

export default router;
