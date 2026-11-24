/*
  Warnings:

  - A unique constraint covering the columns `[ballotId,positionId]` on the table `BallotSelection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "BallotSelection" DROP CONSTRAINT "BallotSelection_candidateId_fkey";

-- AlterTable
ALTER TABLE "BallotSelection" ADD COLUMN     "abstained" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "candidateId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BallotSelection_ballotId_positionId_key" ON "BallotSelection"("ballotId", "positionId");

-- AddForeignKey
ALTER TABLE "BallotSelection" ADD CONSTRAINT "BallotSelection_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
