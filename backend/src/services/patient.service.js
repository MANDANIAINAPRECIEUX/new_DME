import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";

// Retourner la date de naissance au format YYYY-MM-DD.
function formatPatient(patient) {
  return {
    ...patient,
    birthDate: patient.birthDate.toISOString().slice(0, 10),
  };
}

// Créer un patient avec les données déjà validées.
export async function createPatient(data) {
  const patient = await prisma.patient.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      birthDate: new Date(`${data.birthDate}T00:00:00.000Z`),
      phone: data.phone,
      address: data.address ?? null,
    },
  });

  return formatPatient(patient);
}

// Rechercher les patients et paginer les résultats.
export async function listPatients(query) {
  const page = Number(query.page ?? "1");
  const limit = Number(query.limit ?? "20");
  const where = {};

  if (query.gender) {
    where.gender = query.gender;
  }

  if (query.search) {
    const search = query.search.replace(/[\\%_]/g, "\\$&");

    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ];
  }

  const [patients, total] = await prisma.$transaction(
    [
      prisma.patient.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }, { id: "asc" }],
      }),
      prisma.patient.count({ where }),
    ],
    { isolationLevel: "RepeatableRead" },
  );

  return {
    data: patients.map(formatPatient),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Retrouver un patient par son identifiant.
export async function getPatientById(id) {
  const patient = await prisma.patient.findUnique({
    where: { id },
  });

  if (!patient) {
    throw new AppError(404, "PATIENT_NOT_FOUND", "Patient introuvable.");
  }

  return formatPatient(patient);
}

// Modifier uniquement les champs envoyés et autorisés.
export async function updatePatient(id, data) {
  const changes = {};

  for (const field of ["firstName", "lastName", "gender", "phone", "address"]) {
    if (Object.hasOwn(data, field)) {
      changes[field] = data[field];
    }
  }

  if (Object.hasOwn(data, "birthDate")) {
    changes.birthDate = new Date(`${data.birthDate}T00:00:00.000Z`);
  }

  try {
    const patient = await prisma.patient.update({
      where: { id },
      data: changes,
    });

    return formatPatient(patient);
  } catch (error) {
    if (error.code === "P2025") {
      throw new AppError(404, "PATIENT_NOT_FOUND", "Patient introuvable.");
    }

    throw error;
  }
}
