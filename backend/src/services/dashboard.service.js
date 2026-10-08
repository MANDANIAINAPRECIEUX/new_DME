import prisma from "../config/prisma.js";

// Date du jour selon le fuseau horaire belge.
function getToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Brussels",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

// Conversion exacte d'un montant en centimes.
function toCents(value) {
  const [euros, decimals = ""] = String(value).split(".");

  return BigInt(euros) * 100n + BigInt(decimals.padEnd(2, "0"));
}

function formatCents(value) {
  const negative = value < 0n;
  const absolute = negative ? -value : value;

  return (
    (negative ? "-" : "") +
    (absolute / 100n).toString() +
    "." +
    (absolute % 100n).toString().padStart(2, "0")
  );
}

export async function getDashboardSummary(doctorId) {
  const today = new Date(`${getToday()}T00:00:00.000Z`);

  const [
    totalPatients,
    appointmentsToday,
    upcomingAppointments,
    totalConsultations,
    ongoingTreatments,
    completedTreatments,
    payments,
  ] = await Promise.all([
    prisma.patient.count(),

    prisma.appointment.count({
      where: {
        doctorId,
        date: today,
        status: { not: "cancelled" },
      },
    }),

    prisma.appointment.count({
      where: {
        doctorId,
        date: { gt: today },
        status: "pending",
      },
    }),

    prisma.consultation.count({
      where: { doctorId },
    }),

    prisma.treatment.count({
      where: { status: "ongoing" },
    }),

    prisma.treatment.count({
      where: { status: "completed" },
    }),

    prisma.payment.findMany({
      where: {
        consultation: { doctorId },
      },
      select: { amount: true },
    }),
  ]);

  const totalReceivedCents = payments.reduce(
    (sum, payment) => sum + toCents(payment.amount),
    0n,
  );

  return {
    date: getToday(),

    patients: {
      total: totalPatients,
    },

    appointments: {
      today: appointmentsToday,
      upcoming: upcomingAppointments,
    },

    consultations: {
      total: totalConsultations,
    },

    treatments: {
      ongoing: ongoingTreatments,
      completed: completedTreatments,
    },

    payments: {
      count: payments.length,
      totalReceived: formatCents(totalReceivedCents),
      currency: "EUR",
    },
  };
}
