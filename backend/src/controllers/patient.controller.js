import * as patientService from "../services/patient.service.js";

export async function createPatient(req, res) {
  const patient = await patientService.createPatient(req.validated.body);

  res.status(201).json({ data: patient });
}

export async function listPatients(req, res) {
  const result = await patientService.listPatients(req.validated.query);

  res.status(200).json(result);
}

export async function getPatient(req, res) {
  const id = Number(req.validated.params.id);
  const patient = await patientService.getPatientById(id);

  res.status(200).json({ data: patient });
}