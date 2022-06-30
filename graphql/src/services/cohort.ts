import { AssignmentSubject } from "@generated/graphql";
import { prisma } from "@lib/prisma-client";
import { AccountStatus, CohortEvent, Prisma } from "@prisma/client";
import {
  ChangeSet,
  CohortStaffAssignmentInput,
} from "@utils/cohortStaffAssignments";
import { Time } from "@utils/dateTime";
import { calculateRecurringEvents } from "@utils/recurrence";
import { extractSchedules } from "@utils/schedules";
import utcToZonedTime from "date-fns-tz/utcToZonedTime";
import compareAsc from "date-fns/compareAsc";
import endOfWeek from "date-fns/endOfWeek";
import startOfWeek from "date-fns/startOfWeek";
import compact from "lodash/compact";
import flatten from "lodash/flatten";
import uniqBy from "lodash/uniqBy";
import { rrulestr } from "rrule";

const TAKE_LIMIT = 100;

async function getAllCohorts() {
  return prisma.cohort.findMany({
    take: TAKE_LIMIT,
    orderBy: [{ startDate: "desc" }],
  });
}

/**
 * Cohort Type with relations
 *
 * Read more here: https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety/operating-against-partial-structures-of-model-types#problem-using-variations-of-the-generated-model-type
 *
 * CohortWithBaseRelations is referenced in codegen.yml
 */

export const cohortWithBaseRelations = Prisma.validator<Prisma.CohortArgs>()({
  include: {
    staffAssignments: { include: { user: true } },
  },
});

export type CohortWithBaseRelations = Prisma.CohortGetPayload<
  typeof cohortWithBaseRelations
>;

/**
 * Gets a cohort
 */

async function getCohort(cohortId: number) {
  return prisma.cohort.findFirst({
    where: { id: cohortId },
    include: cohortWithBaseRelations.include,
  });
}

/**
 * Gets cohorts for a given engagementId
 */

async function getCohortsForEngagement(engagementId: number) {
  return prisma.cohort.findMany({
    take: 100,
    where: { engagementId },
    include: cohortWithBaseRelations.include,
    orderBy: [{ name: "asc" }],
  });
}

/**
 * Gets all cohorts associates with an org
 */

async function getCohortsForOrg(orgId: number) {
  return prisma.cohort.findMany({
    take: 100,
    where: { engagement: { organizationId: orgId } },
    include: cohortWithBaseRelations.include,
  });
}

/**
 * Updates a cohort.
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

    const deleteMany = staffChangeSet.removals.map((teacher) => ({
      userId: teacher.userId,
      cohortId: id,
      subject: teacher.subject,
    }));

    if (createMany || deleteMany.length > 0) {
      staffAssignments = {
        ...(createMany ? { createMany } : {}),
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
  cohortStartDate: Date;
  cohortEndDate: Date;

  staffAssignments: CsvCohortStaff[];
};

export type SubjectScheduleInput = {
  subject: AssignmentSubject;
  startTime: Time;
  endTime: Time;
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
      startDate: cohort.cohortStartDate,
      endDate: cohort.cohortEndDate,
      events: calculateRecurringEvents({
        startDate: cohort.cohortStartDate,
        endDate: cohort.cohortEndDate,
        schedules: extractSchedules(cohort),
      }),
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
   *  - cohorts come with multiple staff assignments and recurring events
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
            (t) => t.email === sa.teacher.email
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
          startDate: cohort.startDate,
          endDate: cohort.endDate,
          staffAssignments: {
            createMany: { data: staffAssignments },
          },
          events: {
            createMany: { data: cohort.events },
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

/**
 * Gets cohort staff assignments
 */

async function getStaffAssignments(cohortId: number) {
  return prisma.cohortStaffAssignment.findMany({
    where: { cohortId },
    include: { user: true },
  });
}

/**
 * Gets all cohorts where a particular teacher (userId) has been assigned
 * and where the provided filters are satisfied.
 */

type TeacherCohortsFilter = {
  endDate: Prisma.DateTimeNullableFilter;
};

async function getCohortsAssignedToTeacher(
  userId: number,
  filter: TeacherCohortsFilter
) {
  return prisma.cohort.findMany({
    where: {
      AND: [
        { staffAssignments: { some: { userId } } },
        { endDate: filter.endDate },
      ],
    },
  });
}

async function getCohortEventsForCurrentWeek(cohortId: number) {
  const recurringEvents = await prisma.cohortEvent.findMany({
    where: { cohortId },
  });

  return generateCurrentWeekInstances(recurringEvents);
}

function generateCurrentWeekInstances(recurringEvents: CohortEvent[]) {
  if (recurringEvents.length === 0) {
    return [];
  }

  /**
   * The start of the week is Sunday.
   *
   * Of course, we know people in NY experience the start
   * of the week 3 hours earlier than people in California. Sunday morning
   * 1:00 AM in NY is still Saturday night 10:00 PM in California.
   *
   * So who gets to decide when the start of the week is?
   * The answer is the user should. If we saved the timezone on a per user basis (for
   * example, as a user setting), we'd be able to calculate a user's start of the
   * week based on their timezone.  We're not doing that yet so that's not an option
   * right now.
   *
   * As a backup, we're going to pick the cohort's timezone.  This means that
   * whenever it's the new week for the students in a cohort, it's the new week
   * for everyone participating in the cohort. Since the transition happens between
   * saturday and sunday around midnight, I think we can live with this for now.
   *
   * For information about "floating" times,
   * read https://github.com/jakubroztocil/rrule#important-use-utc-dates
   *
   */

  const timeZone = recurringEvents[0].timeZone;
  const todayServer = new Date();
  const todayZoned = utcToZonedTime(todayServer, timeZone);

  const startOfWeekDateTime = startOfWeek(todayZoned);
  const endOfWeekDateTime = endOfWeek(todayZoned);

  const startOfWeekFloating = new Date(
    Date.UTC(
      startOfWeekDateTime.getFullYear(),
      startOfWeekDateTime.getMonth(),
      startOfWeekDateTime.getDate(),
      0,
      0
    )
  );

  const endOfWeekFloating = new Date(
    Date.UTC(
      endOfWeekDateTime.getFullYear(),
      endOfWeekDateTime.getMonth(),
      endOfWeekDateTime.getDate(),
      23,
      59,
      59
    )
  );

  return recurringEvents
    .flatMap((rEvent) => {
      const rRule = rrulestr(rEvent.recurrenceRule);
      return rRule
        .between(startOfWeekFloating, endOfWeekFloating)
        .map((dateInstance) => {
          return {
            startFloatingDateTime: dateInstance,
            durationMinutes: rEvent.durationMinutes,
            timeZone: rEvent.timeZone,
            subject: rEvent.subject,
          };
        });
    })
    .sort((a, b) =>
      compareAsc(a.startFloatingDateTime, b.startFloatingDateTime)
    );
}

export const CohortService = {
  getAllCohorts,
  getCohort,
  getCohortsForEngagement,
  getCohortsForOrg,
  editCohort,
  deleteCohort,
  addCohort,
  saveCsvCohortsData,
  getStaffAssignments,
  getCohortEventsForCurrentWeek,
  getCohortsAssignedToTeacher,
};
