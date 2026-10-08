import { Router } from "express";
import requireDoctor from "../middlewares/requireDoctor.js";
import validate from "../middlewares/validate.js";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  appointmentIdSchema,
  listAppointmentsSchema,
} from "../validators/appointment.validator.js";
import {
  createAppointment,
  listAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
} from "../controllers/appointment.controller.js";

const router = Router();

router.use(requireDoctor);

router.post("/", validate(createAppointmentSchema), createAppointment);

router.get("/", validate(listAppointmentsSchema, "query"), listAppointments);

router.get("/:id", validate(appointmentIdSchema, "params"), getAppointment);

router.patch(
  "/:id",
  validate(appointmentIdSchema, "params"),
  validate(updateAppointmentSchema),
  updateAppointment,
);

router.post(
  "/:id/cancel",
  validate(appointmentIdSchema, "params"),
  cancelAppointment,
);

export default router;
