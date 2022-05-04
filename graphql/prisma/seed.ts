import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const victor = await prisma.user.upsert({
    where: { email: "victor@tutored.live" },
    update: {},
    create: {
      email: "victor@tutored.live",
      cognitoSub: "07155a34-6b7a-410d-9140-2af0b1877104",
      createdAt: new Date(),
      role: "ADMIN",
      accountStatus: "ACTIVE",
    },
  });

  const rafik = await prisma.user.upsert({
    where: { email: "rafik@tutored.live" },
    update: {},
    create: {
      email: "rafik@tutored.live",
      cognitoSub: "8b43e5b1-268f-4530-9b11-944e5578a369",
      createdAt: new Date(),
      role: "ADMIN",
      accountStatus: "ACTIVE",
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
