/*
  Warnings:

  - A unique constraint covering the columns `[voterId]` on the table `Ballot` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Ballot" ADD COLUMN     "voterId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Ballot_voterId_key" ON "Ballot"("voterId");

-- AddForeignKey
ALTER TABLE "Ballot" ADD CONSTRAINT "Ballot_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Voter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
