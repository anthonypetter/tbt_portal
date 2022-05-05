import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

type AppEnv = "dev" | "staging";

async function main() {
  const env = process.env.APP_ENV as AppEnv | undefined;
  if (!env) {
    throw new Error("Unexpected null/undefiend value for APP_ENV");
  }

  const users = getUsers(env);

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log("Finished seeding.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function getUsers(env: string): Omit<User, "id">[] {
  if (env === "dev") {
    return [
      {
        email: "victor@tutored.live",
        cognitoSub: "aec9ea06-dee8-42da-9396-c82456858d1b",
        createdAt: new Date(),
        role: "ADMIN",
        accountStatus: "ACTIVE",
      },
    ];
  } else if (env === "staging") {
    return [
      {
        email: "victor@tutored.live",
        cognitoSub: "07155a34-6b7a-410d-9140-2af0b1877104",
        createdAt: new Date(),
        role: "ADMIN",
        accountStatus: "ACTIVE",
      },
      {
        email: "rafik@tutored.live",
        cognitoSub: "8b43e5b1-268f-4530-9b11-944e5578a369",
        createdAt: new Date(),
        role: "ADMIN",
        accountStatus: "ACTIVE",
      },
    ];
  } else {
    return [];
  }
}
