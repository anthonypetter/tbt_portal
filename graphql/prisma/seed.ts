import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const victor = await prisma.user.upsert({
    where: { email: "victor@tutored.live" },
    update: {},
    create: {
      email: "victor@tutored.live",
      cognitoSub: "cognitoSub",
      createdAt: new Date(),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
