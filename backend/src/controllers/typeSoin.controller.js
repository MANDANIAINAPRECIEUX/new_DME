import * as typeSoinService from "../services/typeSoin.service.js";

export async function createTypeSoin(req, res) {
  const typeSoin = await typeSoinService.createTypeSoin(req.validated.body);

  res.status(201).json({ data: typeSoin });
}

export async function listTypesSoins(req, res) {
  const typesSoins = await typeSoinService.listTypesSoins();

  res.status(200).json({ data: typesSoins });
}

export async function getTypeSoin(req, res) {
  const typeSoin = await typeSoinService.getTypeSoinById(
    Number(req.validated.params.id),
  );

  res.status(200).json({ data: typeSoin });
}
