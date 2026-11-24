-- CreateEnum
CREATE TYPE "PositionType" AS ENUM ('EXECUTIVE', 'LEGISLATIVE');

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "programId" INTEGER,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "type" "PositionType" NOT NULL DEFAULT 'EXECUTIVE';

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;
