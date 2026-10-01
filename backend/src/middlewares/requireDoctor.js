import { getAuth } from "@clerk/express";
import prisma from "../config/prisma.js";

// À placer après clerkMiddleware(), sur chaque route métier protégée.
export default async function requireDoctor(req, res, next) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Connexion requise." },
    });
  }

  // L'identité vient exclusivement de la session vérifiée par Clerk.
  // Aucun rattachement automatique par email et aucune création à la connexion.
  const doctor = await prisma.doctor.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      clerkUserId: true,
      firstName: true,
      lastName: true,
      email: true,
      photo: true,
      speciality: true,
    },
  });

  if (!doctor) {
    return res.status(403).json({
      error: {
        code: "DOCTOR_ACCESS_REQUIRED",
        message: "Ce compte n'est pas autorisé à accéder au cabinet.",
      },
    });
  }

  req.doctor = doctor;
  next();
}
