/*
  Warnings:

  - You are about to drop the `CohortSchedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CohortSchedule" DROP CONSTRAINT "CohortSchedule_cohortId_fkey";

-- DropTable
DROP TABLE "CohortSchedule";

-- DropEnum
DROP TYPE "Weekday";
