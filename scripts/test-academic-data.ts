
import { prisma } from "../lib/prisma";

async function main() {
  const colleges = await prisma.college.findMany({
    include: {
      programs: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  for (const college of colleges) {
    console.log(`\n${college.name}`);

    for (const program of college.programs) {
      console.log(`  - ${program.name}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
