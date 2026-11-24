/*
  Warnings:

  - You are about to drop the column `voterId` on the `Ballot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ballot" DROP CONSTRAINT "Ballot_voterId_fkey";

-- DropIndex
DROP INDEX "Ballot_voterId_key";

-- AlterTable
ALTER TABLE "Ballot" DROP COLUMN "voterId";
