import {
  AssignmentRole,
  AssignmentSubject,
  EventType,
  MeetingType,
  Prisma,
  PrismaClient,
  User,
  Weekday,
} from "@prisma/client";
import { add } from "date-fns";
import { ByWeekday, RRule } from "rrule";

const prisma = new PrismaClient();

type AppEnv = "dev" | "staging";

async function main() {
  const env = process.env.APP_ENV as AppEnv | undefined;
  if (!env) {
    throw new Error("Unexpected null/undefiend value for APP_ENV");
  }

  const users = await upsertUsers(env);
  await createOrgs(users);
  await createVictorsTestOrg(users);

  console.log("[🌱 Seed] - Finished seeding.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * Users
 */
async function upsertUsers(env: string): Promise<User[]> {
  const devUsers: Prisma.UserCreateManyInput[] = [
    {
      email: "victor@tutored.live",
      fullName: "Victor Merino",
      cognitoSub: "aec9ea06-dee8-42da-9396-c82456858d1b",
      createdAt: new Date(),
      role: "ADMIN",
      accountStatus: "ACTIVE",
      inviteSentAt: new Date(),
    },
    {
      email: "victor+mt@tutored.live",
      fullName: "Albert Einsten",
      cognitoSub: "a5449f83-b175-42d2-bc0d-69ffbb039815",
      createdAt: new Date(),
      role: "MENTOR_TEACHER",
      accountStatus: "ACTIVE",
      inviteSentAt: new Date(),
    },
    {
      email: "victor+tt@tutored.live",
      fullName: "Neil deGrasse Tyson",
      cognitoSub: "bfb7afbd-b5e4-4c8f-bb0f-9eba28d40882",
      createdAt: new Date(),
      role: "TUTOR_TEACHER",
      accountStatus: "ACTIVE",
      inviteSentAt: new Date(),
    },
    {
      email: "victor+st@tutored.live",
      fullName: "Brian Greene",
      cognitoSub: "254598de-6867-4175-95f4-dcb03832ae3f",
      createdAt: new Date(),
      role: "TUTOR_TEACHER",
      accountStatus: "ACTIVE",
      inviteSentAt: new Date(),
    },
    {
      email: "scottk@tutored.live",
      fullName: "Scott Kuecker",
      cognitoSub: "24bd72ed-8872-4a14-bca4-ea6b5e218d51",
      createdAt: new Date(),
      role: "ADMIN",
      accountStatus: "ACTIVE",
      inviteSentAt: new Date(),
    },
    {
      email: "kyle@tutored.live",
      fullName: "Kyle Geib",
      cognitoSub: "e33903e4-81b4-459d-a715-2bd69ea9381b",
      createdAt: new Date(),
      role: "ADMIN",
      accountStatus: "ACTIVE",
      inviteSentAt: new Date(),
    },
  ];

  const stagingUsers: Prisma.UserCreateManyInput[] = [
    {
      email: "victor@tutored.live",
      fullName: "Victor Merino",
      cognitoSub: "07155a34-6b7a-410d-9140-2af0b1877104",
      createdAt: new Date(),
      role: "ADMIN",
      accountStatus: "ACTIVE",
      inviteSentAt: new Date(),
    },
    {
      email: "victor+mt@tutored.live",
      fullName: "Albert Einsten",
      cognitoSub: "dbb5906f-f4ca-4aad-ab54-b316962c4636",
      createdAt: new Date(),
      role: "MENTOR_TEACHER",
      accountStatus: "ACTIVE",
      inviteSentAt: new Date(),
    },
    {
      email: "victor+tt@tutored.live",
      fullName: "Neil deGrasse Tyson",
      cognitoSub: "ed0001be-ad78-4aba-8851-033433e08796",
      createdAt: new Date(),
      role: "TUTOR_TEACHER",
      accountStatus: "ACTIVE",
      inviteSentAt: new Date(),
    },
    {
      email: "victor+st@tutored.live",
      fullName: "Brian Greene",
      cognitoSub: "785f1e83-8095-47e2-99a0-ac36fef00cfb",
      createdAt: new Date(),
      role: "TUTOR_TEACHER",
      accountStatus: "ACTIVE",
      inviteSentAt: new Date(),
    },
    {
      email: "rafik@tutored.live",
      fullName: "Rafik Robeal",
      cognitoSub: "8b43e5b1-268f-4530-9b11-944e5578a369",
      createdAt: new Date(),
      role: "ADMIN",
      accountStatus: "ACTIVE",
      inviteSentAt: new Date(),
    },
  ];

  const users = env === "dev" ? devUsers : stagingUsers;

  const results = await Promise.all(
    users.map((devUser) => {
      return prisma.user.upsert({
        where: { email: devUser.email },
        create: devUser,
        update: devUser,
      });
    })
  );

  console.log("[🌱 Seed] - Users upserted.");
  return results;
}

/**
 * Orgs
 */

const ORGANIZATIONS = [
  {
    name: "NYC",
    description: "New York City department of Education",
    engagementAbbvr: "NYC",
    state: "New York",
  },
  {
    name: "LAUSD",
    description: "Los Angeles Unified school district",
    engagementAbbvr: "LAUSD",
    state: "California",
  },
  {
    name: "PR",
    description: "Puerto Rico Department of Education",
    engagementAbbvr: "PR",
    state: "Puerto Rico",
  },
  {
    name: "CPS",
    description: "Chicago Public Schools",
    engagementAbbvr: "CPS",
    state: "Illinois",
  },
  {
    name: "MDCPS",
    description: "Miami-Dade County Public Schools",
    engagementAbbvr: "MDCPS",
    state: "Florida",
  },
  {
    name: "CCSD",
    description: "Clark County School District",
    engagementAbbvr: "CCSD",
    state: "Nevada",
  },
  {
    name: "BCPS",
    description: "Broward County Public Schools",
    engagementAbbvr: "BCPS",
    state: "Florida",
  },
  {
    name: "HISD",
    description: "Houston Independent School District",
    engagementAbbvr: "HISD",
    state: "Texas",
  },
  {
    name: "HCPS",
    description: "Hillsborough County Public Schools",
    engagementAbbvr: "HCPS",
    state: "Florida",
  },
  {
    name: "HDE",
    description: "Hawaii Department of Education",
    engagementAbbvr: "HDE",
    state: "Hawaii",
  },
  {
    name: "OCPS",
    description: "Orange County Public Schools",
    engagementAbbvr: "OCPS",
    state: "Florida",
  },
  {
    name: "SDPBC",
    description: "School District of Palm Beach County",
    engagementAbbvr: "SDPBC",
    state: "Florida",
  },
  {
    name: "FCPS",
    description: "Fairfax County Public Schools",
    engagementAbbvr: "FCPS",
    state: "Virginia",
  },
  {
    name: "SDP",
    description: "School District of Philadelphia",
    engagementAbbvr: "SDP",
    state: "Pennsylvania",
  },
  {
    name: "GCPS",
    description: "Gwinnett County Public Schools",
    engagementAbbvr: "GCPS",
    state: "Georgia",
  },
  {
    name: "EPISD",
    description: "El Paso Independent School District",
    engagementAbbvr: "EPISD",
    state: "Texas",
  },
];

async function createOrgs(users: User[]) {
  const nycOrg = await prisma.organization.findFirst({
    where: { name: "NYC" },
  });

  if (nycOrg) {
    console.log("[🌱 Seed] - Found existing orgs. Skipping org seed.");
    return;
  }

  await Promise.all(ORGANIZATIONS.map((org) => createOrg(users, org)));

  console.log("[🌱 Seed] - Organizations created.");
}

async function createOrg(users: User[], org: typeof ORGANIZATIONS[number]) {
  const mentorTeacher = fromJust(
    users.find((u) => u.email === "victor+mt@tutored.live")
  );
  const substituteTeacher = fromJust(
    users.find((u) => u.email === "victor+st@tutored.live")
  );
  const tutorTeacher = fromJust(
    users.find((u) => u.email === "victor+tt@tutored.live")
  );

  const newOrg = await prisma.organization.create({
    data: {
      name: org.name,
      location: org.state,
      description: org.description,
      district: org.name,
      createdAt: new Date(),
      engagements: {
        create: createSchoolEngagements(org.engagementAbbvr),
      },
    },
    include: {
      engagements: { include: { cohorts: true } },
    },
  });

  // Staff Engagement & Cohorts
  const engagement = newOrg.engagements[0];

  await Promise.all([
    prisma.engagementStaffAssignment.create({
      data: {
        engagement: { connect: { id: engagement.id } },
        user: { connect: { id: mentorTeacher.id } },
        role: AssignmentRole.MENTOR_TEACHER,
      },
    }),
    prisma.engagementStaffAssignment.create({
      data: {
        engagement: { connect: { id: engagement.id } },
        user: { connect: { id: substituteTeacher.id } },
        role: AssignmentRole.SUBSTITUTE_TEACHER,
      },
    }),
  ]);

  await Promise.all([
    prisma.cohortStaffAssignment.create({
      data: {
        cohort: { connect: { id: engagement.cohorts[0].id } },
        user: { connect: { id: tutorTeacher.id } },
        subject: AssignmentSubject.MATH,
      },
    }),
    prisma.cohortStaffAssignment.create({
      data: {
        cohort: { connect: { id: engagement.cohorts[1].id } },
        user: { connect: { id: substituteTeacher.id } },
        subject: AssignmentSubject.ELA,
      },
    }),
    prisma.cohortStaffAssignment.create({
      data: {
        cohort: { connect: { id: engagement.cohorts[2].id } },
        user: { connect: { id: tutorTeacher.id } },
        subject: AssignmentSubject.GENERAL,
      },
    }),
  ]);
}

function createSchoolEngagements(engAbbr: string) {
  const engagements = [...Array(15).keys()].map((index: number) => ({
    name: `${engAbbr}-${index + 1}`,
    cohortAbbvr: `${engAbbr}-${index + 1}-Cohort`,
  }));

  return engagements.map((eng: { name: string; cohortAbbvr: string }) => {
    return {
      name: eng.name,
      startDate: new Date(),
      endDate: add(new Date(), { days: getRandomInt(60) }),
      cohorts: {
        create: [
          {
            createdAt: new Date(),
            name: `${eng.cohortAbbvr}-K`,
            grade: "K",
            startDate: new Date(),
            endDate: add(new Date(), { days: getRandomInt(60) }),
          },
          {
            createdAt: new Date(),
            name: `${eng.cohortAbbvr}-1`,
            grade: "1",
            startDate: new Date(),
            endDate: add(new Date(), { days: getRandomInt(60) }),
          },
          {
            createdAt: new Date(),
            name: `${eng.cohortAbbvr}-2`,
            grade: "2",
            startDate: new Date(),
            endDate: add(new Date(), { days: getRandomInt(60) }),
          },
          {
            createdAt: new Date(),
            name: `${eng.cohortAbbvr}-3`,
            grade: "3",
            startDate: new Date(),
            endDate: add(new Date(), { days: getRandomInt(60) }),
          },
        ],
      },
    };
  });
}

export function fromJust<T>(t: T | null | undefined, nameForError?: string): T {
  if (t === null || t === undefined) {
    const errorString = `Unexpected undefined/null value${
      nameForError == null ? "" : `: ${nameForError}`
    }`;

    throw new Error(errorString);
  }

  return t;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max) + 1;
}

async function createVictorsTestOrg(users: User[]) {
  const mentorTeacher = fromJust(
    users.find((u) => u.email === "victor+mt@tutored.live")
  );
  const substituteTeacher = fromJust(
    users.find((u) => u.email === "victor+st@tutored.live")
  );
  const mathTeacher = fromJust(
    users.find((u) => u.email === "victor@tutored.live")
  );
  const elaTeacher = fromJust(
    users.find((u) => u.email === "victor+tt@tutored.live")
  );
  const testOrg = await prisma.organization.create({
    data: {
      name: "Victor's org",
      description: "This is Victor's test organization.",
      engagements: {
        create: {
          name: "Victor's test engagement",
          startDate: new Date(),
          endDate: add(new Date(), { days: 60 }),
          staffAssignments: {
            createMany: {
              data: [
                {
                  userId: mentorTeacher.id,
                  role: AssignmentRole.MENTOR_TEACHER,
                },
                {
                  userId: substituteTeacher.id,
                  role: AssignmentRole.SUBSTITUTE_TEACHER,
                },
              ],
            },
          },
        },
      },
    },
    include: {
      engagements: {
        include: { staffAssignments: { include: { user: true } } },
      },
    },
  });

  const cohortStartDate = new Date(Date.UTC(2022, 5, 15));
  const cohortEndDate = new Date(Date.UTC(2022, 11, 21, 23, 59, 59));

  await prisma.cohort.create({
    data: {
      name: "Victor's Cohort 1",
      engagementId: testOrg.engagements[0].id,
      startDate: cohortStartDate,
      endDate: cohortEndDate,
      grade: "1",
      staffAssignments: {
        createMany: {
          data: [
            { userId: mathTeacher.id, subject: AssignmentSubject.MATH },
            { userId: elaTeacher.id, subject: AssignmentSubject.ELA },
            {
              userId: substituteTeacher.id,
              subject: AssignmentSubject.GENERAL,
            },
          ],
        },
      },
      schedule: {
        createMany: {
          data: [
            // AssignmentSubject.ELA
            {
              weekday: Weekday.TUESDAY,
              subject: AssignmentSubject.ELA,
              startTime: "08:30",
              endTime: "09:45",
              timeZone: "America/Los_Angeles",
            },
            {
              weekday: Weekday.THURSDAY,
              subject: AssignmentSubject.ELA,
              startTime: "08:30",
              endTime: "09:45",
              timeZone: "America/Los_Angeles",
            },

            // AssignmentSubject.MATH
            {
              weekday: Weekday.TUESDAY,
              subject: AssignmentSubject.MATH,
              startTime: "10:00",
              endTime: "11:10",
              timeZone: "America/Los_Angeles",
            },
            {
              weekday: Weekday.THURSDAY,
              subject: AssignmentSubject.MATH,
              startTime: "15:00",
              endTime: "16:15",
              timeZone: "America/Los_Angeles",
            },

            //General
            {
              weekday: Weekday.MONDAY,
              subject: AssignmentSubject.GENERAL,
              startTime: "13:00",
              endTime: "14:07",
              timeZone: "America/Los_Angeles",
            },
            {
              weekday: Weekday.WEDNESDAY,
              subject: AssignmentSubject.GENERAL,
              startTime: "13:00",
              endTime: "14:07",
              timeZone: "America/Los_Angeles",
            },
            {
              weekday: Weekday.FRIDAY,
              subject: AssignmentSubject.GENERAL,
              startTime: "13:00",
              endTime: "14:07",
              timeZone: "America/Los_Angeles",
            },
          ],
        },
      },
      events: {
        createMany: {
          data: [
            makeRecurringEvent({
              cohortStartDate,
              cohortEndDate,
              startTime: { hour: 8, minute: 30 },
              durationMinutes: 75,
              subject: AssignmentSubject.ELA,
              byWeekday: [RRule.TU, RRule.TH],
              timeZone: "America/Los_Angeles",
            }),

            makeRecurringEvent({
              cohortStartDate,
              cohortEndDate,
              startTime: { hour: 10, minute: 0 },
              durationMinutes: 60,
              subject: AssignmentSubject.MATH,
              byWeekday: [RRule.TU],
              timeZone: "America/Los_Angeles",
            }),

            makeRecurringEvent({
              cohortStartDate,
              cohortEndDate,
              startTime: { hour: 15, minute: 0 },
              durationMinutes: 75,
              subject: AssignmentSubject.MATH,
              byWeekday: [RRule.TH],
              timeZone: "America/Los_Angeles",
            }),

            makeRecurringEvent({
              cohortStartDate,
              cohortEndDate,
              startTime: { hour: 13, minute: 0 },
              durationMinutes: 67,
              subject: AssignmentSubject.GENERAL,
              byWeekday: [RRule.MO, RRule.WE, RRule.FR],
              timeZone: "America/Los_Angeles",
            }),
          ],
        },
      },
    },
  });

  console.log("[🌱 Seed] - Victor's test org created.");
}

type Time = {
  hour: number;
  minute: number;
};
function makeRecurringEvent({
  cohortStartDate,
  cohortEndDate,
  startTime,
  durationMinutes,
  subject,
  byWeekday,
  timeZone,
}: {
  cohortStartDate: Date;
  cohortEndDate: Date;
  startTime: Time;
  durationMinutes: number;
  subject: AssignmentSubject;
  byWeekday: ByWeekday[];
  timeZone: string;
}) {
  const startDateTime = new Date(
    Date.UTC(
      cohortStartDate.getUTCFullYear(),
      cohortStartDate.getUTCMonth(),
      cohortStartDate.getUTCDate(),
      startTime.hour,
      startTime.minute
    )
  );

  const endDateTime = new Date(
    Date.UTC(
      cohortEndDate.getUTCFullYear(),
      cohortEndDate.getUTCMonth(),
      cohortEndDate.getUTCDate(),
      23,
      59
    )
  );

  return {
    eventType: EventType.RECURRING,
    meetingType: MeetingType.STUDENT_SESSION,
    subject,

    startDateTime,
    timeZone,
    durationMinutes,

    recurrenceRule: new RRule({
      freq: RRule.DAILY,
      byweekday: byWeekday,
      dtstart: startDateTime,
      until: endDateTime,
    }).toString(),
  };
}
