import * as appointmentService from "../services/appointment.service.js";

export async function createAppointment(req, res) {
  const appointment = await appointmentService.createAppointment(
    req.validated.body,
    req.doctor.id,
  );

  res.status(201).json({ data: appointment });
}

export async function listAppointments(req, res) {
  const result = await appointmentService.listAppointments(
    req.validated.query,
    req.doctor.id,
  );

  res.status(200).json(result);
}

export async function getAppointment(req, res) {
  const appointment = await appointmentService.updateAppointment(
    Number(req.validated.params.id),
    req.validated.body,
    req.doctor.id,
  );

  res.status(200).json({ data: appointment });
}

export async function updateAppointment(req, res) {
  const appointment = await appointmentService.updateAppointment(
    Number(req.validated.params.id),
    req.validated.body,
  );

  res.status(200).json({ data: appointment });
}

export async function cancelAppointment(req, res) {
  const appointment = await appointmentService.updateAppointment(
    Number(req.validated.params.id),
    { status: "cancelled" },
    req.doctor.id,
  );

  res.status(200).json({ data: appointment });
}
