import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";

// Ce module partage une seule instance Prisma entre les routes.
// L'adaptateur PostgreSQL utilise l'adresse définie dans .env.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("La variable DATABASE_URL est manquante.");
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

export default prisma;