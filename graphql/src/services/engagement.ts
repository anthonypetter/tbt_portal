import { Engagement, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma-client";
import {
  ChangeSet,
  EngagementStaffAssignmentInput,
} from "../utils/engagementStaffAssignments";
import { cohortWithBaseRelations } from "./cohort";

const TAKE_LIMIT = 100;

/**
 * Engagement Type with relations
 *
 * Read more here: https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety/operating-against-partial-structures-of-model-types#problem-using-variations-of-the-generated-model-type
 *
 * EngagementWithBaseRelations is referenced in codegen.yml
 */

export const engagementWithBaseRelations =
  Prisma.validator<Prisma.EngagementArgs>()({
    include: {
      staffAssignments: { include: { user: true } },
      organization: true,
    },
  });

export type EngagementWithBaseRelations = Prisma.EngagementGetPayload<
  typeof engagementWithBaseRelations
>;

/**
 * Gets an engagement by id
 */
async function getEngagement(id: number) {
  const engagement = await prisma.engagement.findFirst({
    where: { id },
    include: {
      ...engagementWithBaseRelations.include,
      cohorts: cohortWithBaseRelations,
    },
  });
  return engagement;
}

/**
 * Gets an organization's engagements
 */

async function getEngagements(organizationId: number) {
  const engagements = await prisma.engagement.findMany({
    take: TAKE_LIMIT,
    where: { organizationId },
    include: engagementWithBaseRelations.include,
    orderBy: [{ startDate: "desc" }],
  });

  return engagements;
}

async function getAllEngagements() {
  return prisma.engagement.findMany({
    take: TAKE_LIMIT,
    include: engagementWithBaseRelations.include,
    orderBy: [{ startDate: "desc" }],
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

/**
 * Gets engagement staff assignments
 */

async function getStaffAssignments(engagementId: number) {
  return prisma.engagementStaffAssignment.findMany({
    where: { engagementId },
    include: { user: true },
  });
}

/**
 * Gets engagements being mentored by a particular teacher (userId)
 */

type MentorEngagementsFilter = {
  endDate: Prisma.DateTimeNullableFilter;
};

async function getEngagementsAssignedToTeacher(
  userId: number,
  filter: MentorEngagementsFilter
) {
  return prisma.engagement.findMany({
    where: {
      AND: [
        { staffAssignments: { some: { userId } } },
        { endDate: filter.endDate },
      ],
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
  getStaffAssignments,
  getEngagementsAssignedToTeacher,
};
