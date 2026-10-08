import prisma from "../config/prisma.js";

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const details = {
  consultation: {
    select: {
      id: true,
      appointmentId: true,
      consultationDate: true,
    },
  },
  typeSoin: true,
  dents: {
    include: {
      dent: true,
    },
  },
};

async function checkConsultation(id, doctorId) {
  const consultation = await prisma.consultation.findFirst({
    where: {
      id,
      doctorId,
    },
  });

  if (!consultation) {
    throw httpError(404, "Consultation introuvable");
  }

  return consultation;
}

async function checkTypeSoin(id) {
  const typeSoin = await prisma.typeSoin.findUnique({
    where: { id },
  });

  if (!typeSoin) {
    throw httpError(404, "Type de soin introuvable");
  }

  return typeSoin;
}

async function checkDents(dentIds) {
  if (!dentIds || dentIds.length === 0) {
    return;
  }

  const dents = await prisma.dent.findMany({
    where: {
      id: { in: dentIds },
    },
  });

  if (dents.length !== new Set(dentIds).size) {
    throw httpError(400, "Une ou plusieurs dents sont inexistantes");
  }
}

export async function listSoins(doctorId) {
  return prisma.soin.findMany({
    where: {
      consultation: { doctorId },
    },
    include: details,
    orderBy: { id: "desc" },
  });
}

export async function getSoin(id, doctorId) {
  return prisma.soin.findFirst({
    where: {
      id,
      consultation: { doctorId },
    },
    include: details,
  });
}

export async function getSoinsByConsultation(consultationId, doctorId) {
  await checkConsultation(consultationId, doctorId);

  return prisma.soin.findMany({
    where: { consultationId },
    include: details,
    orderBy: { id: "asc" },
  });
}

export async function createSoin(data, doctorId) {
  await checkConsultation(data.consultationId, doctorId);

  await checkTypeSoin(data.typeSoinId);
  await checkDents(data.dentIds);

  return prisma.soin.create({
    data: {
      consultationId: data.consultationId,
      typeSoinId: data.typeSoinId,
      observation: data.observation ?? null,

      dents: {
        create: (data.dentIds ?? []).map((dentId) => ({
          dent: {
            connect: { id: dentId },
          },
        })),
      },
    },
    include: details,
  });
}

export async function updateSoin(id, data, doctorId) {
  const existing = await prisma.soin.findFirst({
    where: {
      id,
      consultation: { doctorId },
    },
  });

  if (!existing) {
    throw httpError(404, "Soin introuvable");
  }

  if (data.typeSoinId !== undefined) {
    await checkTypeSoin(data.typeSoinId);
  }

  if (data.dentIds !== undefined) {
    await checkDents(data.dentIds);
  }

  const updateData = {};

  if (data.typeSoinId !== undefined) {
    updateData.typeSoinId = data.typeSoinId;
  }

  if (data.observation !== undefined) {
    updateData.observation = data.observation;
  }

  if (data.dentIds !== undefined) {
    updateData.dents = {
      deleteMany: {},
      create: data.dentIds.map((dentId) => ({
        dent: {
          connect: { id: dentId },
        },
      })),
    };
  }

  return prisma.soin.update({
    where: { id },
    data: updateData,
    include: details,
  });
}
