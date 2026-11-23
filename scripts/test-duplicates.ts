
import { prisma } from "../lib/prisma";

async function main() {
  const existing = await prisma.voter.findFirst({
    where: {
      studentId: { not: null },
    },
    select: {
      studentId: true,
    },
  });

  if (!existing?.studentId) {
    console.log("No existing student ID found.");
    return;
  }

  const duplicate = await prisma.voter.findUnique({
    where: {
      studentId: existing.studentId,
    },
  });

  console.log(
    duplicate
      ? "PASS: Existing student ID was detected as duplicate."
      : "FAIL: Duplicate student ID was not detected."
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
