-- CreateTable
CREATE TABLE "VotingParticipation" (
    "id" SERIAL NOT NULL,
    "voterId" INTEGER NOT NULL,
    "electionId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "VotingParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VotingParticipation_electionId_idx" ON "VotingParticipation"("electionId");

-- CreateIndex
CREATE INDEX "VotingParticipation_voterId_idx" ON "VotingParticipation"("voterId");

-- CreateIndex
CREATE UNIQUE INDEX "VotingParticipation_voterId_electionId_key" ON "VotingParticipation"("voterId", "electionId");

-- AddForeignKey
ALTER TABLE "VotingParticipation" ADD CONSTRAINT "VotingParticipation_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Voter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotingParticipation" ADD CONSTRAINT "VotingParticipation_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;
