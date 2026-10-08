import prisma from "../config/prisma.js";

export async function listDents() {
  return prisma.dent.findMany({
    select: {
      id: true,
      number: true,
    },
    orderBy: {
      number: "asc",
    },
  });
}
