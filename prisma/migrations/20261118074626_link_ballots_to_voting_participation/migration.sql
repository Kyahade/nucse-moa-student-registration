/*
  Warnings:

  - A unique constraint covering the columns `[ballotId]` on the table `VotingParticipation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "VotingParticipation" ADD COLUMN     "ballotId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "VotingParticipation_ballotId_key" ON "VotingParticipation"("ballotId");

-- AddForeignKey
ALTER TABLE "VotingParticipation" ADD CONSTRAINT "VotingParticipation_ballotId_fkey" FOREIGN KEY ("ballotId") REFERENCES "Ballot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
