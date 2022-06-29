-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('RECURRING');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('STUDENT_SESSION', 'PARENT_CONFERENCE', 'ADHOC');

-- CreateTable
CREATE TABLE "CohortEvent" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventType" "EventType" NOT NULL,
    "meetingType" "MeetingType" NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "timeZone" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "recurrenceRule" TEXT NOT NULL,
    "cohortId" INTEGER NOT NULL,

    CONSTRAINT "CohortEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CohortEvent" ADD CONSTRAINT "CohortEvent_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
