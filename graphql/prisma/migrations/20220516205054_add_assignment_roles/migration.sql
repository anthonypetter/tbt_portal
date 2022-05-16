-- CreateEnum
CREATE TYPE "AssignmentRole" AS ENUM ('MENTOR_TEACHER', 'SUBSTITUTE_TEACHER', 'GENERAL_TEACHER');

-- AlterTable
ALTER TABLE "CohortStaffAssignments" ADD COLUMN     "assignmentRole" "AssignmentRole" NOT NULL DEFAULT E'GENERAL_TEACHER';

-- AlterTable
ALTER TABLE "EngagementStaffAssignments" ADD COLUMN     "assignmentRole" "AssignmentRole" NOT NULL DEFAULT E'MENTOR_TEACHER';
