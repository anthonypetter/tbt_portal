/*
  Warnings:

  - You are about to drop the column `assignmentRole` on the `CohortStaffAssignment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AssignmentSubject" AS ENUM ('MATH', 'ELA', 'GENERAL');

-- AlterTable
ALTER TABLE "CohortStaffAssignment" DROP COLUMN "assignmentRole",
ADD COLUMN     "subject" "AssignmentSubject" NOT NULL DEFAULT E'GENERAL';
