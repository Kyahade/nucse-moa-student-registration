-- CreateEnum
CREATE TYPE "PositionScope" AS ENUM ('UNIVERSITY', 'SCHOOL', 'COURSE');

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "collegeId" INTEGER,
ADD COLUMN     "scope" "PositionScope" NOT NULL DEFAULT 'UNIVERSITY';

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE SET NULL ON UPDATE CASCADE;
