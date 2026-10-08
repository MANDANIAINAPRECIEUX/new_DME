import { getDashboardSummary } from "../services/dashboard.service.js";

export async function summary(req, res, next) {
  try {
    const result = await getDashboardSummary(req.doctor.id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
