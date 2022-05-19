import { prisma } from "../lib/prisma-client";
import { Engagement } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { ChangeSet } from "../utils/staffAssignments";

/**
 * Gets an engagement by id
 */
async function getEngagement(id: number) {
  const engagement = await prisma.engagement.findFirst({
    where: { id },
    include: { staffAssignments: true },
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
  });

  return engagements;
}

/**
 * Adds an engagement
 */

type AddEngagementInput = {
  name: string;
  organizationId: number;
};

async function addEngagement({
  name,
  organizationId,
}: AddEngagementInput): Promise<Engagement> {
  const engagement = await prisma.engagement.create({
    data: { name, organizationId },
  });

  return engagement;
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
      engagementId: id,
    }));

    if (createMany || updateMany.length > 0 || deleteMany.length > 0) {
      staffAssignments = {
        ...(createMany ? { createMany } : {}),
        ...(updateMany ? { updateMany } : {}),
        ...(deleteMany ? { deleteMany } : {}),
      };
    }
  }

  const engagement = await prisma.engagement.update({
    where: { id },
    data: {
      name,
      startDate,
      endDate,
      staffAssignments,
    },
  });

  return engagement;
}

export const EngagementService = {
  getEngagement,
  getEngagements,
  addEngagement,
  deleteEngagement,
  editEngagement,
};
