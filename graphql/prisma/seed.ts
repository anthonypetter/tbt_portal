import { AssignmentRole, Prisma, PrismaClient, User } from "@prisma/client";
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
      fullName: "Neil deGrasse Tyson",
      cognitoSub: "dbb5906f-f4ca-4aad-ab54-b316962c4636",
      createdAt: new Date(),
      role: "TUTOR_TEACHER",
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

const EP_SEED_ORG_NAME = "El Paso ISD";

async function createOrgs(users: User[]) {
  const epOrg = await prisma.organization.findFirst({
    where: { name: EP_SEED_ORG_NAME },
  });

  if (epOrg) {
    console.log("[🌱 Seed] - Found existing org. Skipping org seed.");
    return;
  }

  await createElPasoOrg(users);
  console.log("[🌱 Seed] - Organizations created.");
}

async function createElPasoOrg(users: User[]) {
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
      name: EP_SEED_ORG_NAME,
      location: "Texas",
      description: "Org for all schools in El Paso, TX.",
      district: "El Paso ISD",
      createdAt: new Date(),
      engagements: {
        create: createSchoolEngagements(),
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
        assignmentRole: AssignmentRole.MENTOR_TEACHER,
      },
    }),
    prisma.engagementStaffAssignment.create({
      data: {
        engagement: { connect: { id: engagement.id } },
        user: { connect: { id: substituteTeacher.id } },
        assignmentRole: AssignmentRole.SUBSTITUTE_TEACHER,
      },
    }),
  ]);

  await Promise.all([
    prisma.cohortStaffAssignment.create({
      data: {
        cohort: { connect: { id: engagement.cohorts[0].id } },
        user: { connect: { id: tutorTeacher.id } },
        assignmentRole: AssignmentRole.GENERAL_TEACHER,
      },
    }),
    prisma.cohortStaffAssignment.create({
      data: {
        cohort: { connect: { id: engagement.cohorts[1].id } },
        user: { connect: { id: substituteTeacher.id } },
        assignmentRole: AssignmentRole.GENERAL_TEACHER,
      },
    }),
    prisma.cohortStaffAssignment.create({
      data: {
        cohort: { connect: { id: engagement.cohorts[2].id } },
        user: { connect: { id: tutorTeacher.id } },
        assignmentRole: AssignmentRole.GENERAL_TEACHER,
      },
    }),
  ]);
}

function createSchoolEngagements() {
  const schools = [
    { schoolName: "Socorro Middle School", abbreviation: "SMS" },
    { schoolName: "Sanchez Middle School", abbreviation: "San" },
    { schoolName: "El Paso Middle School", abbreviation: "EP Mid" },
    { schoolName: "Montwood Middle School", abbreviation: "Mtw Mid" },
    { schoolName: "Rojas Elementary School", abbreviation: "Roj El" },
    { schoolName: "Hilley Elementary School", abbreviation: "Hil" },
    { schoolName: "Belair High School", abbreviation: "Bel" },
    { schoolName: "Coronado High School", abbreviation: "Cor" },
    { schoolName: "Don Haskins", abbreviation: "DH" },
    { schoolName: "Chapin High School", abbreviation: "Chap" },
    { schoolName: "Coach Archie Duran", abbreviation: "CAD" },
    { schoolName: "Coldwell Elementary", abbreviation: "CE" },
  ];

  return schools.map((school) => {
    return {
      name: school.schoolName,
      startDate: new Date(),
      endDate: add(new Date(), { days: 60 }),
      cohorts: {
        create: [
          {
            createdAt: new Date(),
            name: `${school.abbreviation}-G6 Cohort`,
            grade: "6",
            startDate: new Date(),
            endDate: add(new Date(), { days: 7 }),
          },
          {
            createdAt: new Date(),
            name: `${school.abbreviation}-G7 Cohort`,
            grade: "7",
            startDate: new Date(),
            endDate: add(new Date(), { days: 14 }),
          },
          {
            createdAt: new Date(),
            name: `${school.abbreviation}-G8 Cohort`,
            grade: "8",
            startDate: new Date(),
            endDate: add(new Date(), { days: 30 }),
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
