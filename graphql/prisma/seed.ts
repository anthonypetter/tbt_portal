import {
  AssignmentRole,
  AssignmentSubject,
  Prisma,
  PrismaClient,
  User,
} from "@prisma/client";
import { add } from "date-fns";

const prisma = new PrismaClient();

type AppEnv = "dev" | "staging";

async function main() {
  const env = process.env.APP_ENV as AppEnv | undefined;
  if (!env) {
    throw new Error("Unexpected null/undefiend value for APP_ENV");
  }

  const users = await upsertUsers(env);
  await createOrgs(users);

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
    },
    {
      email: "victor+mt@tutored.live",
      fullName: "Albert Einsten",
      cognitoSub: "a5449f83-b175-42d2-bc0d-69ffbb039815",
      createdAt: new Date(),
      role: "MENTOR_TEACHER",
      accountStatus: "ACTIVE",
    },
    {
      email: "victor+tt@tutored.live",
      fullName: "Neil deGrasse Tyson",
      cognitoSub: "bfb7afbd-b5e4-4c8f-bb0f-9eba28d40882",
      createdAt: new Date(),
      role: "TUTOR_TEACHER",
      accountStatus: "ACTIVE",
    },
    {
      email: "victor+st@tutored.live",
      fullName: "Brian Greene",
      cognitoSub: "254598de-6867-4175-95f4-dcb03832ae3f",
      createdAt: new Date(),
      role: "TUTOR_TEACHER",
      accountStatus: "ACTIVE",
    },
    {
      email: "scottk@tutored.live",
      fullName: "Scott Kuecker",
      cognitoSub: "24bd72ed-8872-4a14-bca4-ea6b5e218d51",
      createdAt: new Date(),
      role: "ADMIN",
      accountStatus: "ACTIVE",
    },
    {
      email: "kyle@tutored.live",
      fullName: "Kyle Geib",
      cognitoSub: "e33903e4-81b4-459d-a715-2bd69ea9381b",
      createdAt: new Date(),
      role: "ADMIN",
      accountStatus: "ACTIVE",
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
    },
    {
      email: "victor+mt@tutored.live",
      fullName: "Albert Einsten",
      cognitoSub: "dbb5906f-f4ca-4aad-ab54-b316962c4636",
      createdAt: new Date(),
      role: "MENTOR_TEACHER",
      accountStatus: "ACTIVE",
    },
    {
      email: "victor+tt@tutored.live",
      fullName: "Neil deGrasse Tyson",
      cognitoSub: "ed0001be-ad78-4aba-8851-033433e08796",
      createdAt: new Date(),
      role: "TUTOR_TEACHER",
      accountStatus: "ACTIVE",
    },
    {
      email: "victor+st@tutored.live",
      fullName: "Brian Greene",
      cognitoSub: "785f1e83-8095-47e2-99a0-ac36fef00cfb",
      createdAt: new Date(),
      role: "TUTOR_TEACHER",
      accountStatus: "ACTIVE",
    },
    {
      email: "rafik@tutored.live",
      fullName: "Rafik Robeal",
      cognitoSub: "8b43e5b1-268f-4530-9b11-944e5578a369",
      createdAt: new Date(),
      role: "ADMIN",
      accountStatus: "ACTIVE",
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
