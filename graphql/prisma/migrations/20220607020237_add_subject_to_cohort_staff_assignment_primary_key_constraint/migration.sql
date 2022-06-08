/*
  Warnings:

  - The primary key for the `CohortStaffAssignment` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CohortStaffAssignment" DROP CONSTRAINT "CohortStaffAssignment_pkey",
ADD CONSTRAINT "CohortStaffAssignment_pkey" PRIMARY KEY ("userId", "cohortId", "subject");
