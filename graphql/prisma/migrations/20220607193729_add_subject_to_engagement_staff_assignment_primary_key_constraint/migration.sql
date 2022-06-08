/*
  Warnings:

  - The primary key for the `EngagementStaffAssignment` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "EngagementStaffAssignment" DROP CONSTRAINT "EngagementStaffAssignment_pkey",
ADD CONSTRAINT "EngagementStaffAssignment_pkey" PRIMARY KEY ("userId", "engagementId", "role");
