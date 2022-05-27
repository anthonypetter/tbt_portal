import { prisma } from "../lib/prisma-client";
import type { Prisma } from "@prisma/client";
import { ChangeSet, StaffAssignmentInput } from "../utils/staffAssignments";

/**
 * Gets a cohort
 * @param cohortId cohortId
 * @returns Prisma Cohort
 */
async function getCohort(cohortId: number) {
  return prisma.cohort.findFirst({
    where: { id: cohortId },
    include: { staffAssignments: { include: { user: true } } },
  });
}

/**
 * Gets cohorts for a given engagementId
 * @param engagementId engagementId
 * @returns cohorts associated with Engagement
 */

async function getCohorts(engagementId: number) {
  return prisma.cohort.findMany({
    take: 100,
    where: { engagementId },
    include: { staffAssignments: { include: { user: true } } },
    orderBy: [{ name: "asc" }],
  });
}

/**
 * Gets all cohorts associates with an org
 * @param orgId organizationId
 * @returns All cohorts associated with the given orgId
 */

async function getCohortsForOrg(orgId: number) {
  return prisma.cohort.findMany({
    take: 100,
    where: { engagement: { organizationId: orgId } },
  });
}

/**
 * Updates a cohort.
 * @param input EditInput
 * @returns the updated cohort
 */

type EditInput = {
  id: number;
  name?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  grade?: string | null;
  hostKey?: string | null;
  meetingRoom?: string | null;
  staffChangeSet?: ChangeSet;
};

async function editCohort({
  id,
  name,
  startDate,
  endDate,
  grade,
  hostKey,
  meetingRoom,
  staffChangeSet,
}: EditInput) {
  let staffAssignments: Prisma.CohortUpdateInput["staffAssignments"];

  if (staffChangeSet) {
    const newAssignments = staffChangeSet.additions.map((teacher) => ({
      createdAt: new Date(),
      userId: teacher.userId,
      assignmentRole: teacher.assignmentRole,
    }));

    const createMany =
      newAssignments.length > 0 ? { data: newAssignments } : undefined;

    const updateMany = staffChangeSet.updates.map((teacher) => ({
      where: { userId: teacher.userId },
      data: { assignmentRole: teacher.assignmentRole },
    }));

    const deleteMany = staffChangeSet.removals.map((teacher) => ({
      userId: teacher.userId,
      cohortId: id,
    }));

    if (createMany || updateMany.length > 0 || deleteMany.length > 0) {
      staffAssignments = {
        ...(createMany ? { createMany } : {}),
        ...(updateMany ? { updateMany } : {}),
        ...(deleteMany ? { deleteMany } : {}),
      };
    }
  }

  return prisma.cohort.update({
    where: { id },
    data: {
      name,
      startDate,
      endDate,
      grade,
      hostKey,
      meetingRoom,
      staffAssignments,
    },
  });
}

/**
 * Deletes a cohort
 */

async function deleteCohort(id: number) {
  return prisma.cohort.delete({
    where: { id },
  });
}

/**
 * Adds a cohort
 */

type AddCohortInput = {
  name: string;
  engagementId: number;
  startDate?: Date;
  endDate?: Date;
  grade?: string | null;
  hostKey?: string | null;
  meetingRoom?: string | null;
  staff: StaffAssignmentInput[];
};

async function addCohort({
  name,
  engagementId,
  startDate,
  endDate,
  grade,
  hostKey,
  meetingRoom,
  staff,
}: AddCohortInput) {
  const newAssignments = staff.map((teacher) => ({
    createdAt: new Date(),
    userId: teacher.userId,
    assignmentRole: teacher.assignmentRole,
  }));

  return prisma.cohort.create({
    data: {
      name,
      engagementId,
      startDate,
      endDate,
      grade,
      hostKey,
      meetingRoom,
      staffAssignments:
        newAssignments.length > 0
          ? { createMany: { data: newAssignments } }
          : undefined,
    },
  });
}

export const CohortService = {
  getCohort,
  getCohorts,
  getCohortsForOrg,
  editCohort,
  deleteCohort,
  addCohort,
};
