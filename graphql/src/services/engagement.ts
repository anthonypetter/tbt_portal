import { prisma } from "../lib/prisma-client";
import { Engagement } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import {
  ChangeSet,
  EngagementStaffAssignmentInput,
} from "../utils/engagementStaffAssignments";
import { cohortWithBaseRelations } from "./cohort";

const TAKE_LIMIT = 100;

/**
 * Gets an engagement by id
 */
async function getEngagement(id: number) {
  const engagement = await prisma.engagement.findFirst({
    where: { id },
    include: {
      staffAssignments: { include: { user: true } },
      cohorts: cohortWithBaseRelations,
      organization: true,
    },
  });
  return engagement;
}

/**
 * Gets an organization's engagements
 */

async function getEngagements(organizationId: number) {
  const engagements = await prisma.engagement.findMany({
    take: 100,
    where: { organizationId },
    include: { staffAssignments: { include: { user: true } } },
    orderBy: [{ name: "asc" }],
  });

  return engagements;
}

async function getAllEngagements() {
  return prisma.engagement.findMany({
    take: TAKE_LIMIT,
    include: { staffAssignments: { include: { user: true } } },
    orderBy: [{ name: "asc" }],
  });
}

/**
 * Adds an engagement
 */

type AddEngagementInput = {
  name: string;
  organizationId: number;
  startDate?: Date;
  endDate?: Date;
  staff: EngagementStaffAssignmentInput[];
};

async function addEngagement({
  name,
  organizationId,
  startDate,
  endDate,
  staff,
}: AddEngagementInput) {
  const newAssignments = staff.map((teacher) => ({
    createdAt: new Date(),
    userId: teacher.userId,
    role: teacher.role,
  }));

  return prisma.engagement.create({
    data: {
      name,
      organizationId,
      startDate,
      endDate,
      staffAssignments:
        newAssignments.length > 0
          ? { createMany: { data: newAssignments } }
          : undefined,
    },
  });
}

/**
 * Deletes an engagement
 */

async function deleteEngagement(id: number): Promise<Engagement> {
  const engagement = await prisma.engagement.delete({
    where: { id },
  });
  return engagement;
}

/**
 * Edits an engagement
 */

type EditInput = {
  id: number;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  staffChangeSet?: ChangeSet;
};

async function editEngagement({
  id,
  name,
  startDate,
  endDate,
  staffChangeSet,
}: EditInput): Promise<Engagement> {
  let staffAssignments: Prisma.EngagementUpdateInput["staffAssignments"];

  if (staffChangeSet) {
    const newAssignments = staffChangeSet.additions.map((teacher) => ({
      createdAt: new Date(),
      userId: teacher.userId,
      role: teacher.role,
    }));

    const createMany =
      newAssignments.length > 0 ? { data: newAssignments } : undefined;

    const deleteMany = staffChangeSet.removals.map((teacher) => ({
      userId: teacher.userId,
      engagementId: id,
      role: teacher.role,
    }));

    if (createMany || deleteMany.length > 0) {
      staffAssignments = {
        ...(createMany ? { createMany } : {}),
        ...(deleteMany ? { deleteMany } : {}),
      };
    }
  }

  return prisma.engagement.update({
    where: { id },
    data: {
      name,
      startDate,
      endDate,
      staffAssignments,
    },
  });
}

export const EngagementService = {
  getEngagement,
  getEngagements,
  addEngagement,
  deleteEngagement,
  editEngagement,
  getAllEngagements,
};
