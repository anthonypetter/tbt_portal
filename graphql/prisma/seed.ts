import { Prisma, PrismaClient, User } from "@prisma/client";
import { fromJust } from "../src/utils/types";

const prisma = new PrismaClient();

type AppEnv = "dev" | "staging";

async function main() {
  const env = process.env.APP_ENV as AppEnv | undefined;
  if (!env) {
    throw new Error("Unexpected null/undefiend value for APP_ENV");
  }

  const users = await createUsers(env);
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
async function createUsers(env: string): Promise<User[]> {
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
      fullName: "Victor Merino Mentor",
      cognitoSub: "a5449f83-b175-42d2-bc0d-69ffbb039815",
      createdAt: new Date(),
      role: "MENTOR_TEACHER",
      accountStatus: "ACTIVE",
    },
    {
      email: "victor+tt@tutored.live",
      fullName: "Victor Merino Tutor",
      cognitoSub: "bfb7afbd-b5e4-4c8f-bb0f-9eba28d40882",
      createdAt: new Date(),
      role: "TUTOR_TEACHER",
      accountStatus: "ACTIVE",
    },
    {
      email: "victor+st@tutored.live",
      fullName: "Victor Merino Substitute",
      cognitoSub: "254598de-6867-4175-95f4-dcb03832ae3f",
      createdAt: new Date(),
      role: "TUTOR_TEACHER",
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
      return prisma.user.create({
        data: devUser,
      });
    })
  );

  console.log("[🌱 Seed] - Users created.");
  return results;
}

/**
 * Orgs
 */

async function createOrgs(users: User[]) {
  await createElPasoOrg(users);

  console.log("[🌱 Seed] - Organizations created.");
}

async function createElPasoOrg(users: User[]) {
  const startDate = new Date();
  const endDate = new Date(startDate.getTime());
  endDate.setFullYear(startDate.getFullYear() + 5);

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
      name: "El Paso ISD",
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
    prisma.engagementStaffAssignments.create({
      data: {
        engagement: { connect: { id: engagement.id } },
        user: { connect: { id: mentorTeacher.id } },
      },
    }),
    prisma.engagementStaffAssignments.create({
      data: {
        engagement: { connect: { id: engagement.id } },
        user: { connect: { id: substituteTeacher.id } },
      },
    }),
  ]);

  await Promise.all([
    prisma.cohortStaffAssignments.create({
      data: {
        cohort: { connect: { id: engagement.cohorts[0].id } },
        user: { connect: { id: tutorTeacher.id } },
      },
    }),
    prisma.cohortStaffAssignments.create({
      data: {
        cohort: { connect: { id: engagement.cohorts[1].id } },
        user: { connect: { id: substituteTeacher.id } },
      },
    }),
    prisma.cohortStaffAssignments.create({
      data: {
        cohort: { connect: { id: engagement.cohorts[2].id } },
        user: { connect: { id: tutorTeacher.id } },
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

  const startDate = new Date();

  return schools.map((school) => {
    const endDate = new Date(startDate.getTime());
    endDate.setMonth(startDate.getMonth() + Math.floor(Math.random() * 24) + 1);

    return {
      name: school.schoolName,
      startDate: startDate,
      endDate: endDate,
      cohorts: {
        create: [
          {
            createdAt: new Date(),
            name: `${school.abbreviation}-G6 Cohort`,
            grade: "6",
          },
          {
            createdAt: new Date(),
            name: `${school.abbreviation}-G7 Cohort`,
            grade: "7",
          },
          {
            createdAt: new Date(),
            name: `${school.abbreviation}-G8 Cohort`,
            grade: "8",
          },
        ],
      },
    };
  });
}
