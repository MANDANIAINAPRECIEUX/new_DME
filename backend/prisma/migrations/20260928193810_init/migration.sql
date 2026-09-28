-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('pending', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "TreatmentStatus" AS ENUM ('ongoing', 'completed');

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthDate" DATE NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "photo" TEXT,
    "speciality" TEXT NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "time" VARCHAR(5) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'pending',
    "reason" TEXT,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treatment" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "status" "TreatmentStatus" NOT NULL DEFAULT 'ongoing',
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "observation" TEXT,

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "treatmentId" INTEGER,
    "doctorId" INTEGER NOT NULL,
    "consultationDate" DATE NOT NULL,
    "compteRendu" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeSoin" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "tarif" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "TypeSoin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Soin" (
    "id" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "typeSoinId" INTEGER NOT NULL,
    "observation" TEXT,

    CONSTRAINT "Soin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dent" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(2) NOT NULL,

    CONSTRAINT "Dent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoinDent" (
    "soinId" INTEGER NOT NULL,
    "dentId" INTEGER NOT NULL,

    CONSTRAINT "SoinDent_pkey" PRIMARY KEY ("soinId","dentId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "paymentDate" DATE NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Patient_lastName_firstName_idx" ON "Patient"("lastName", "firstName");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "Doctor"("email");

-- CreateIndex
CREATE INDEX "Appointment_patientId_date_idx" ON "Appointment"("patientId", "date");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_date_time_idx" ON "Appointment"("doctorId", "date", "time");

-- CreateIndex
CREATE INDEX "Treatment_patientId_status_idx" ON "Treatment"("patientId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Consultation_appointmentId_key" ON "Consultation"("appointmentId");

-- CreateIndex
CREATE INDEX "Consultation_treatmentId_consultationDate_idx" ON "Consultation"("treatmentId", "consultationDate");

-- CreateIndex
CREATE INDEX "Consultation_doctorId_consultationDate_idx" ON "Consultation"("doctorId", "consultationDate");

-- CreateIndex
CREATE INDEX "Soin_consultationId_idx" ON "Soin"("consultationId");

-- CreateIndex
CREATE INDEX "Soin_typeSoinId_idx" ON "Soin"("typeSoinId");

-- CreateIndex
CREATE UNIQUE INDEX "Dent_number_key" ON "Dent"("number");

-- CreateIndex
CREATE INDEX "SoinDent_dentId_idx" ON "SoinDent"("dentId");

-- CreateIndex
CREATE INDEX "Payment_consultationId_idx" ON "Payment"("consultationId");

-- CreateIndex
CREATE INDEX "Payment_paymentDate_idx" ON "Payment"("paymentDate");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Soin" ADD CONSTRAINT "Soin_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Soin" ADD CONSTRAINT "Soin_typeSoinId_fkey" FOREIGN KEY ("typeSoinId") REFERENCES "TypeSoin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoinDent" ADD CONSTRAINT "SoinDent_soinId_fkey" FOREIGN KEY ("soinId") REFERENCES "Soin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoinDent" ADD CONSTRAINT "SoinDent_dentId_fkey" FOREIGN KEY ("dentId") REFERENCES "Dent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
