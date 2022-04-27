import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const victor = await prisma.user.upsert({
    where: { email: "victor@tutored.live" },
    update: {},
    create: {
      email: "victor@tutored.live",
      cognitoSub: "d3a77801-7d1d-41cb-8a54-097e588a3c2a",
      createdAt: new Date(),
      isGlobalAdmin: true,
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
