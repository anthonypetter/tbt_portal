/*
  Warnings:

  - You are about to drop the `CohortStaffAssignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EngagementStaffAssignments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CohortStaffAssignments" DROP CONSTRAINT "CohortStaffAssignments_cohortId_fkey";

-- DropForeignKey
ALTER TABLE "CohortStaffAssignments" DROP CONSTRAINT "CohortStaffAssignments_userId_fkey";

-- DropForeignKey
ALTER TABLE "EngagementStaffAssignments" DROP CONSTRAINT "EngagementStaffAssignments_engagementId_fkey";

-- DropForeignKey
ALTER TABLE "EngagementStaffAssignments" DROP CONSTRAINT "EngagementStaffAssignments_userId_fkey";

-- DropTable
DROP TABLE "CohortStaffAssignments";

-- DropTable
DROP TABLE "EngagementStaffAssignments";

-- CreateTable
CREATE TABLE "EngagementStaffAssignment" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "engagementId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "assignmentRole" "AssignmentRole" NOT NULL DEFAULT E'MENTOR_TEACHER',

    CONSTRAINT "EngagementStaffAssignment_pkey" PRIMARY KEY ("userId","engagementId")
);

-- CreateTable
CREATE TABLE "CohortStaffAssignment" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "cohortId" INTEGER NOT NULL,
    "assignmentRole" "AssignmentRole" NOT NULL DEFAULT E'GENERAL_TEACHER',

    CONSTRAINT "CohortStaffAssignment_pkey" PRIMARY KEY ("userId","cohortId")
);

-- AddForeignKey
ALTER TABLE "EngagementStaffAssignment" ADD CONSTRAINT "EngagementStaffAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngagementStaffAssignment" ADD CONSTRAINT "EngagementStaffAssignment_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "Engagement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CohortStaffAssignment" ADD CONSTRAINT "CohortStaffAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CohortStaffAssignment" ADD CONSTRAINT "CohortStaffAssignment_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
