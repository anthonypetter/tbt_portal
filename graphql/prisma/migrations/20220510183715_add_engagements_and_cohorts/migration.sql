/*
  Warnings:

  - You are about to drop the `OrganizationMembership` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrganizationMembership" DROP CONSTRAINT "OrganizationMembership_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationMembership" DROP CONSTRAINT "OrganizationMembership_userId_fkey";

-- DropTable
DROP TABLE "OrganizationMembership";

-- CreateTable
CREATE TABLE "Engagement" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "Engagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngagementStaffAssignments" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "engagementId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "EngagementStaffAssignments_pkey" PRIMARY KEY ("userId","engagementId")
);

-- CreateTable
CREATE TABLE "Cohort" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "engagementId" INTEGER NOT NULL,
    "grade" TEXT,
    "meetingRoom" TEXT,
    "hostKey" TEXT,
    "exempt" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Cohort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CohortStaffAssignments" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "cohortId" INTEGER NOT NULL,

    CONSTRAINT "CohortStaffAssignments_pkey" PRIMARY KEY ("userId","cohortId")
);

-- CreateTable
CREATE TABLE "CohortSession" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recording" TEXT,
    "cohortId" INTEGER NOT NULL,

    CONSTRAINT "CohortSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngagementStaffAssignments" ADD CONSTRAINT "EngagementStaffAssignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngagementStaffAssignments" ADD CONSTRAINT "EngagementStaffAssignments_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "Engagement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cohort" ADD CONSTRAINT "Cohort_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "Engagement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CohortStaffAssignments" ADD CONSTRAINT "CohortStaffAssignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CohortStaffAssignments" ADD CONSTRAINT "CohortStaffAssignments_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CohortSession" ADD CONSTRAINT "CohortSession_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
