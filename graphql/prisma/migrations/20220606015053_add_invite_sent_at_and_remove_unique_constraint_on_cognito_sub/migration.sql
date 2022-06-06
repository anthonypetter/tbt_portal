-- DropIndex
DROP INDEX "User_cognitoSub_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "inviteSentAt" TIMESTAMP(3),
ALTER COLUMN "cognitoSub" DROP NOT NULL;
