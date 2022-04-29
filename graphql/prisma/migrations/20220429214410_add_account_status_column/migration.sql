-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'DISABLED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountStatus" "AccountStatus" NOT NULL DEFAULT E'PENDING';
