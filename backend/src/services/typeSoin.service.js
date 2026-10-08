import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";

// Prisma stocke le tarif en Decimal ; l'API renvoie un nombre.
function formatTypeSoin(typeSoin) {
  return {
    ...typeSoin,
    tarif: Number(typeSoin.tarif),
  };
}

export async function createTypeSoin(data) {
  const typeSoin = await prisma.typeSoin.create({
    data: {
      label: data.label,
      tarif: data.tarif,
    },
  });

  return formatTypeSoin(typeSoin);
}

export async function listTypesSoins() {
  const typesSoins = await prisma.typeSoin.findMany({
    orderBy: [{ label: "asc" }, { id: "asc" }],
  });

  return typesSoins.map(formatTypeSoin);
}

export async function getTypeSoinById(id) {
  const typeSoin = await prisma.typeSoin.findUnique({
    where: { id },
  });

  if (!typeSoin) {
    throw new AppError(404, "TYPE_SOIN_NOT_FOUND", "Type de soin introuvable.");
  }

  return formatTypeSoin(typeSoin);
}
