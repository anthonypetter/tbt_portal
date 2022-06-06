import { prisma } from "../lib/prisma-client";
import { AccountStatus, Prisma } from "@prisma/client";
import {
  ChangeSet,
  CohortStaffAssignmentInput,
} from "../utils/cohortStaffAssignments";
import { AssignmentSubject } from "../schema/__generated__/graphql";
import flatten from "lodash/flatten";
import compact from "lodash/compact";
import uniqBy from "lodash/uniqBy";
import { extractSchedules } from "../utils/schedules";

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
      subject: teacher.subject,
    }));

    const createMany =
      newAssignments.length > 0 ? { data: newAssignments } : undefined;

    const updateMany = staffChangeSet.updates.map((teacher) => ({
      where: { userId: teacher.userId },
      data: { subject: teacher.subject },
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
  staff: CohortStaffAssignmentInput[];
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
    subject: teacher.subject,
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

/**
 * CSV
 */

type CsvCohortStaff = {
  subject: AssignmentSubject;
  teacher: { fullName: string; email: string };
};

export type CsvCohortInput = {
  cohortName: string;
  grade: string;

  monday: SubjectScheduleInput[];
  tuesday: SubjectScheduleInput[];
  wednesday: SubjectScheduleInput[];
  thursday: SubjectScheduleInput[];
  friday: SubjectScheduleInput[];
  saturday: SubjectScheduleInput[];
  sunday: SubjectScheduleInput[];

  staffAssignments: CsvCohortStaff[];
};

export type SubjectScheduleInput = {
  subject: AssignmentSubject;
  startTime: string;
  endTime: string;
  timeZone: string;
};

async function saveCsvCohortsData(
  engagementId: number,
  inputCohorts: CsvCohortInput[]
) {
  const allStaff: CsvCohortStaff[][] = [];
  const cohorts = inputCohorts.map((cohort) => {
    allStaff.push(cohort.staffAssignments);
    return {
      name: cohort.cohortName,
      engagementId,
      grade: cohort.grade,
      staffAssignments: cohort.staffAssignments,
      schedules: extractSchedules(cohort),
    };
  });

  /**
   * Find unrecognized teacher emails and create users for them.
   */
  const uniqueTeachers = uniqBy(
    flatten(allStaff).map((s) => s.teacher),
    (t) => t.email
  );

  const existingTeachers = await prisma.user.findMany({
    where: {
      OR: uniqueTeachers.map((t) => ({ email: t.email })),
    },
  });

  const newTeachers = uniqueTeachers.filter(
    (teacher) => !existingTeachers.map((t) => t.email).includes(teacher.email)
  );

  const { count: newTeacherCount } = await prisma.user.createMany({
    data: newTeachers.map((newTeacher) => {
      return {
        email: newTeacher.email,
        fullName: newTeacher.fullName,
        accountStatus: AccountStatus.PENDING,
        inviteSentAt: null,
      };
    }),
    skipDuplicates: true,
  });

  /**
   * Create cohorts, staff, and schedules
   *
   * Since
   *  - cohorts come with multiple staff assignments and schedules
   *  - cohorts don't exist yet (no cohortId is available)
   *  - prisma's createMany does not support accessing relations
   *
   * We will loop through each cohort and use prisma's `create` to
   * individually create a cohort and relations.
   */

  const createdTeachers = await prisma.user.findMany({
    where: {
      OR: uniqueTeachers.map((t) => ({ email: t.email })),
    },
  });

  const cohortsCreated = await Promise.all(
    cohorts.map((cohort) => {
      const staffAssignments = compact(
        cohort.staffAssignments.map((sa) => {
          const teacher = createdTeachers.find(
            (t) => t.email == sa.teacher.email
          );
          if (!teacher) {
            return undefined;
          }

          return {
            subject: sa.subject,
            userId: teacher.id,
          };
        })
      );

      return prisma.cohort.create({
        data: {
          name: cohort.name,
          grade: cohort.grade,
          engagementId: cohort.engagementId,
          staffAssignments: {
            createMany: { data: staffAssignments },
          },
          cohortSchedule: {
            createMany: { data: cohort.schedules },
          },
        },
      });
    })
  );

  return {
    newTeacherCount,
    newCohortCount: cohortsCreated.length,
  };
}

export const CohortService = {
  getCohort,
  getCohorts,
  getCohortsForOrg,
  editCohort,
  deleteCohort,
  addCohort,
  saveCsvCohortsData,
};
