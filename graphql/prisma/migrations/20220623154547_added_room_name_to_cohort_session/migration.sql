/*
  Warnings:

  - Added the required column `roomName` to the `CohortSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CohortSession" ADD COLUMN     "roomName" TEXT NOT NULL;
