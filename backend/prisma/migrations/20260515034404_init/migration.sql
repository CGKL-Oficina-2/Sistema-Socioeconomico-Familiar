-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VOLUNTARIO');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VOLUNTARIO',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "responsible" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socioeconomic_forms" (
    "id" SERIAL NOT NULL,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "responsibleName" TEXT,
    "cpf" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "schoolId" INTEGER,
    "familyIncome" DOUBLE PRECISION NOT NULL,
    "residents" INTEGER NOT NULL,
    "internetAccess" BOOLEAN NOT NULL DEFAULT false,
    "computerAccess" BOOLEAN NOT NULL DEFAULT false,
    "govAssistance" BOOLEAN NOT NULL DEFAULT false,
    "govAssistanceType" TEXT,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "socioeconomic_forms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "socioeconomic_forms" ADD CONSTRAINT "socioeconomic_forms_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;
