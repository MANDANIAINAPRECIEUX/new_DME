import "dotenv/config";
import { createHash } from "node:crypto";
import prisma from "../src/config/prisma.js";

const url = new URL(process.env.DATABASE_URL ?? "");
const clerkUserId = process.env.TEST_CLERK_USER_ID;

if (
  !["127.0.0.1", "localhost"].includes(url.hostname) ||
  url.pathname !== "/new_dme_test"
) {
  throw new Error("Sécurité : base de test obligatoire.");
}

if (!clerkUserId?.startsWith("user_")) {
  throw new Error("Identifiant Clerk invalide.");
}

try {
  const suffix = createHash("sha256")
    .update(clerkUserId)
    .digest("hex")
    .slice(0, 16);

  const doctor = await prisma.doctor.upsert({
    where: { clerkUserId },
    update: {},
    create: {
      clerkUserId,
      firstName: "Docteur",
      lastName: "Test",
      email: `doctor-test-${suffix}@example.invalid`,
      speciality: "Odontologie",
    },
  });

  console.log("Médecin de test prêt.");
  console.log("ID médecin :", doctor.id);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
