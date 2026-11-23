
import { prisma } from "../lib/prisma";

async function main() {
  const voterCount = await prisma.voter.count();

  console.log("Database connection successful!");
  console.log("Existing voter records:", voterCount);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

  