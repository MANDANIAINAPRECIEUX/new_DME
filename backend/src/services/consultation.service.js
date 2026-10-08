import prisma from "../config/prisma.js";

const toDate = (value) => new Date(`${value}T00:00:00.000Z`);

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const details = {
  appointment: {
    include: {
      patient: true,
    },
  },
  treatment: true,
  doctor: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  soins: true,
  payments: true,
};

async function checkTreatment(treatmentId, patientId) {
  if (treatmentId == null) return;

  const treatment = await prisma.treatment.findUnique({
    where: { id: treatmentId },
  });

  if (!treatment) {
    throw httpError(404, "Traitement introuvable");
  }

  if (treatment.patientId !== patientId) {
    throw httpError(400, "Le traitement appartient à un autre patient");
  }
}

export async function listConsultations(doctorId) {
  return prisma.consultation.findMany({
    where: { doctorId },
    include: details,
    orderBy: { consultationDate: "desc" },
  });
}

export async function getConsultation(id, doctorId) {
  return prisma.consultation.findFirst({
    where: { id, doctorId },
    include: details,
  });
}

export async function createConsultation(data, doctorId) {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: data.appointmentId,
      doctorId,
    },
  });

  if (!appointment) {
    throw httpError(404, "Rendez-vous introuvable");
  }

  if (appointment.status === "cancelled") {
    throw httpError(400, "Impossible de consulter un rendez-vous annulé");
  }

  const existing = await prisma.consultation.findUnique({
    where: { appointmentId: data.appointmentId },
  });

  if (existing) {
    throw httpError(409, "Une consultation existe déjà pour ce rendez-vous");
  }

  await checkTreatment(data.treatmentId, appointment.patientId);

  try {
    return await prisma.consultation.create({
      data: {
        appointmentId: data.appointmentId,
        doctorId,
        treatmentId: data.treatmentId ?? null,
        consultationDate: toDate(data.consultationDate),
        compteRendu: data.compteRendu ?? null,
      },
      include: details,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw httpError(409, "Une consultation existe déjà pour ce rendez-vous");
    }
    throw error;
  }
}

export async function updateConsultation(id, data, doctorId) {
  const existing = await prisma.consultation.findFirst({
    where: { id, doctorId },
    include: { appointment: true },
  });

  if (!existing) {
    throw httpError(404, "Consultation introuvable");
  }

  if (data.treatmentId !== undefined) {
    await checkTreatment(data.treatmentId, existing.appointment.patientId);
  }

  const updateData = { ...data };

  if (data.consultationDate !== undefined) {
    updateData.consultationDate = toDate(data.consultationDate);
  }

  return prisma.consultation.update({
    where: { id },
    data: updateData,
    include: details,
  });
}
