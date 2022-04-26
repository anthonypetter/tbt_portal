import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const victor = await prisma.user.upsert({
    where: { email: "victor@tutored.live" },
    update: {},
    create: {
      email: "victor@tutored.live",
      cognitoSub: "cognitoSub1",
      createdAt: new Date(),
    },
  });

  const rafik = await prisma.user.upsert({
    where: { email: "rafik@tutored.live" },
    update: {},
    create: {
      email: "rafik@tutored.live",
      cognitoSub: "cognitoSub2",
      createdAt: new Date(),
    },
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
