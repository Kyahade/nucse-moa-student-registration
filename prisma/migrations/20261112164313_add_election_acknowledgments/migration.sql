-- CreateTable
CREATE TABLE "ElectionAcknowledgment" (
    "id" SERIAL NOT NULL,
    "voterId" INTEGER NOT NULL,
    "electionId" INTEGER NOT NULL,
    "studentIdEntered" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElectionAcknowledgment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectionAcknowledgmentItem" (
    "id" SERIAL NOT NULL,
    "acknowledgmentId" INTEGER NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "documentVersion" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElectionAcknowledgmentItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ElectionAcknowledgment_electionId_idx" ON "ElectionAcknowledgment"("electionId");

-- CreateIndex
CREATE UNIQUE INDEX "ElectionAcknowledgment_voterId_electionId_key" ON "ElectionAcknowledgment"("voterId", "electionId");

-- CreateIndex
CREATE UNIQUE INDEX "ElectionAcknowledgmentItem_acknowledgmentId_sectionKey_key" ON "ElectionAcknowledgmentItem"("acknowledgmentId", "sectionKey");

-- AddForeignKey
ALTER TABLE "ElectionAcknowledgment" ADD CONSTRAINT "ElectionAcknowledgment_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Voter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionAcknowledgment" ADD CONSTRAINT "ElectionAcknowledgment_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionAcknowledgmentItem" ADD CONSTRAINT "ElectionAcknowledgmentItem_acknowledgmentId_fkey" FOREIGN KEY ("acknowledgmentId") REFERENCES "ElectionAcknowledgment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
