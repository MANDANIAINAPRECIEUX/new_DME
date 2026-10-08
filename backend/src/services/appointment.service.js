import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";

const appointmentInclude = {
  patient: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
    },
  },
  doctor: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  consultation: {
    select: { id: true },
  },
};

function toDate(value) {
  return new Date(`${value}T00:00:00.000Z`);
}

function formatAppointment(appointment) {
  return {
    ...appointment,
    date: appointment.date.toISOString().slice(0, 10),
  };
}

// Réessayer les conflits entre transactions concurrentes.
// L'index unique PostgreSQL protège aussi les créneaux.
async function writeTransaction(operation) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: "Serializable",
      });
    } catch (error) {
      if (error.code === "P2034") {
        continue;
      }

      if (error.code === "P2002") {
        throw new AppError(
          409,
          "APPOINTMENT_SLOT_UNAVAILABLE",
          "Ce créneau est déjà occupé pour ce docteur.",
        );
      }

      if (error.code === "P2003") {
        throw new AppError(
          409,
          "APPOINTMENT_REFERENCE_CONFLICT",
          "Le patient ou le docteur associé n'est plus disponible.",
        );
      }

      throw error;
    }
  }

  throw new AppError(
    409,
    "CONCURRENT_MODIFICATION",
    "Une modification simultanée a eu lieu. Réessayez.",
  );
}

async function checkReferences(tx, patientId, doctorId) {
  const patient = await tx.patient.findUnique({
    where: { id: patientId },
    select: { id: true },
  });

  if (!patient) {
    throw new AppError(404, "PATIENT_NOT_FOUND", "Patient introuvable.");
  }

  const doctor = await tx.doctor.findUnique({
    where: { id: doctorId },
    select: { id: true },
  });

  if (!doctor) {
    throw new AppError(404, "DOCTOR_NOT_FOUND", "Docteur introuvable.");
  }
}

async function checkSlot(tx, data, excludedId) {
  // Un rendez-vous annulé ne réserve pas le créneau.
  if (data.status === "cancelled") {
    return;
  }

  const occupied = await tx.appointment.findFirst({
    where: {
      doctorId: data.doctorId,
      date: data.date,
      time: data.time,
      status: { not: "cancelled" },
      ...(excludedId !== undefined && {
        id: { not: excludedId },
      }),
    },
    select: { id: true },
  });

  if (occupied) {
    throw new AppError(
      409,
      "APPOINTMENT_SLOT_UNAVAILABLE",
      "Ce créneau est déjà occupé pour ce docteur.",
    );
  }
}

export async function createAppointment(data, connectedDoctorId) {
  return writeTransaction(async (tx) => {
    const values = {
      patientId: data.patientId,

      doctorId: connectedDoctorId,

      date: toDate(data.date),
      time: data.time,
      reason: data.reason ?? null,

      // Ne jamais reprendre le statut envoyé par le client.
      status: "pending",
    };

    await checkReferences(tx, values.patientId, values.doctorId);
    await checkSlot(tx, values);

    const appointment = await tx.appointment.create({
      data: values,
      include: appointmentInclude,
    });

    return formatAppointment(appointment);
  });
}

export async function listAppointments(query, connectedDoctorId) {
  const page = Number(query.page ?? "1");
  const limit = Number(query.limit ?? "20");
  const where = { doctorId: connectedDoctorId };

  if (query.patientId) {
    where.patientId = Number(query.patientId);
  }

  // if (query.doctorId) {
  //   where.doctorId = Number(query.doctorId);
  // }

  if (query.date) {
    where.date = toDate(query.date);
  }

  if (query.status) {
    where.status = query.status;
  }

  const [appointments, total] = await prisma.$transaction(
    [
      prisma.appointment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ date: "asc" }, { time: "asc" }, { id: "asc" }],
        include: appointmentInclude,
      }),
      prisma.appointment.count({ where }),
    ],
    { isolationLevel: "RepeatableRead" },
  );

  return {
    data: appointments.map(formatAppointment),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAppointmentById(id, connectedDoctorId) {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id,
      doctorId: connectedDoctorId,
    },
    include: appointmentInclude,
  });

  if (!appointment) {
    throw new AppError(
      404,
      "APPOINTMENT_NOT_FOUND",
      "Rendez-vous introuvable.",
    );
  }

  return formatAppointment(appointment);
}

export async function updateAppointment(id, data, connectedDoctorI) {
  return writeTransaction(async (tx) => {
    const current = await tx.appointment.findUnique({
      where: {
        id,
        doctorId: connectedDoctorId,
      },
      include: {
        consultation: {
          select: { id: true },
        },
      },
    });

    if (!current) {
      throw new AppError(
        404,
        "APPOINTMENT_NOT_FOUND",
        "Rendez-vous introuvable.",
      );
    }

    if (current.consultation || current.status === "completed") {
      throw new AppError(
        409,
        "APPOINTMENT_LOCKED",
        "Un rendez-vous réalisé ne peut plus être modifié.",
      );
    }

    if (data.doctorId !== undefined && data.doctorId !== connectedDoctorId) {
      throw new AppError(
        403,
        "DOCTOR_ACCESS_REQUIRED",
        "Vous ne pouvez pas transférer ce rendez-vous à un autre médecin.",
      );
    }

    const changes = {};

    for (const field of ["patientId", "time", "reason", "status"]) {
      if (Object.hasOwn(data, field)) {
        changes[field] = data[field];
      }
    }

    if (Object.hasOwn(data, "date")) {
      changes.date = toDate(data.date);
    }

    const nextValues = {
      patientId: current.patientId,
      doctorId: current.doctorId,
      date: current.date,
      time: current.time,
      status: current.status,
      ...changes,
    };

    await checkReferences(tx, nextValues.patientId, nextValues.doctorId);

    await checkSlot(tx, nextValues, id);

    const appointment = await tx.appointment.update({
      where: { id },
      data: changes,
      include: appointmentInclude,
    });

    return formatAppointment(appointment);
  });
}
