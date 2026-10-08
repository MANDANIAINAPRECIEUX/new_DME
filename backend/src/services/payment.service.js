import prisma from "../config/prisma.js";

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const toDate = (value) => new Date(`${value}T00:00:00.000Z`);

// Conversion exacte d'un montant décimal en centimes.
const toCents = (value) => {
  const [euros, cents = ""] = String(value).split(".");
  return BigInt(euros) * 100n + BigInt(cents.padEnd(2, "0"));
};

const formatCents = (value) => {
  const negative = value < 0n;
  const absolute = negative ? -value : value;

  const euros = absolute / 100n;
  const cents = String(absolute % 100n).padStart(2, "0");

  return `${negative ? "-" : ""}${euros}.${cents}`;
};

const paymentDetails = {
  consultation: {
    select: {
      id: true,
      consultationDate: true,
      doctorId: true,
      appointment: {
        select: {
          patientId: true,
          patient: true,
        },
      },
    },
  },
};

async function checkConsultation(id, doctorId) {
  const consultation = await prisma.consultation.findFirst({
    where: { id, doctorId },
  });

  if (!consultation) {
    throw httpError(404, "Consultation introuvable");
  }

  return consultation;
}

export async function listPayments(doctorId) {
  return prisma.payment.findMany({
    where: {
      consultation: { doctorId },
    },
    include: paymentDetails,
    orderBy: [{ paymentDate: "desc" }, { id: "desc" }],
  });
}

export async function getPayment(id, doctorId) {
  return prisma.payment.findFirst({
    where: {
      id,
      consultation: { doctorId },
    },
    include: paymentDetails,
  });
}

export async function getConsultationPayments(consultationId, doctorId) {
  await checkConsultation(consultationId, doctorId);

  const [payments, soins] = await Promise.all([
    prisma.payment.findMany({
      where: { consultationId },
      orderBy: [{ paymentDate: "asc" }, { id: "asc" }],
    }),
    prisma.soin.findMany({
      where: { consultationId },
      include: {
        typeSoin: {
          select: {
            id: true,
            label: true,
            tarif: true,
          },
        },
      },
    }),
  ]);

  const totalSoins = soins.reduce(
    (sum, soin) => sum + toCents(soin.typeSoin.tarif),
    0n,
  );

  const totalPaid = payments.reduce(
    (sum, payment) => sum + toCents(payment.amount),
    0n,
  );

  return {
    consultationId,
    soins,
    payments,
    totalSoins: formatCents(totalSoins),
    totalPaid: formatCents(totalPaid),
    balance: formatCents(totalSoins - totalPaid),
  };
}

export async function createPayment(data, doctorId) {
  await checkConsultation(data.consultationId, doctorId);

  return prisma.payment.create({
    data: {
      consultationId: data.consultationId,
      paymentDate: toDate(data.paymentDate),
      amount: data.amount,
      remark: data.remark ?? null,
    },
    include: paymentDetails,
  });
}

export async function updatePayment(id, data, doctorId) {
  const existing = await prisma.payment.findFirst({
    where: {
      id,
      consultation: { doctorId },
    },
  });

  if (!existing) {
    throw httpError(404, "Paiement introuvable");
  }

  const updateData = { ...data };

  if (data.paymentDate !== undefined) {
    updateData.paymentDate = toDate(data.paymentDate);
  }

  return prisma.payment.update({
    where: { id },
    data: updateData,
    include: paymentDetails,
  });
}
