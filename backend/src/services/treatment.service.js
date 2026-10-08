import prisma from "../config/prisma.js";

const toDate = (value) =>
  value == null ? value : new Date(`${value}T00:00:00.000Z`);

export async function listTreatments() {
  return prisma.treatment.findMany({
    include: {
      patient: true,
    },
    orderBy: {
      startDate: "desc",
    },
  });
}

export async function getTreatment(id) {
  return prisma.treatment.findUnique({
    where: { id },
    include: {
      patient: true,
      consultations: true,
    },
  });
}

export async function getPatientTreatments(patientId) {
  return prisma.treatment.findMany({
    where: { patientId },
    orderBy: {
      startDate: "desc",
    },
  });
}

export async function createTreatment(data) {
  const patient = await prisma.patient.findUnique({
    where: { id: data.patientId },
  });

  if (!patient) {
    const error = new Error("Patient introuvable");
    error.status = 404;
    throw error;
  }

  return prisma.treatment.create({
    data: {
      patientId: data.patientId,
      label: data.label,
      status: data.status ?? "ongoing",
      startDate: toDate(data.startDate),
      endDate: toDate(data.endDate),
      observation: data.observation ?? null,
    },
  });
}

export async function updateTreatment(id, data) {
  const existing = await prisma.treatment.findUnique({
    where: { id },
  });

  if (!existing) {
    const error = new Error("Traitement introuvable");
    error.status = 404;
    throw error;
  }

  const updatedData = {
    ...data,
  };

  if (data.startDate !== undefined) {
    updatedData.startDate = toDate(data.startDate);
  }

  if (data.endDate !== undefined) {
    updatedData.endDate = toDate(data.endDate);
  }

  const startDate = updatedData.startDate ?? existing.startDate;
  const endDate =
    updatedData.endDate === undefined ? existing.endDate : updatedData.endDate;

  if (endDate && startDate && endDate < startDate) {
    const error = new Error(
      "La date de fin ne peut pas précéder la date de début",
    );
    error.status = 400;
    throw error;
  }

  return prisma.treatment.update({
    where: { id },
    data: updatedData,
  });
}
