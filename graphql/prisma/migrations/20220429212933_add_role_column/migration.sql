/*
  Warnings:

  - You are about to drop the column `isGlobalAdmin` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'mentor_teacher', 'tutor_teacher');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isGlobalAdmin",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT E'tutor_teacher';
