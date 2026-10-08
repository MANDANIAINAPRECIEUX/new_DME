import { listDents } from "../services/dent.service.js";

export async function list(req, res, next) {
  try {
    const dents = await listDents();
    return res.status(200).json(dents);
  } catch (error) {
    next(error);
  }
}
