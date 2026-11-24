-- CreateTable
CREATE TABLE "CorDocument" (
    "id" SERIAL NOT NULL,
    "voterId" INTEGER NOT NULL,
    "blobUrl" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CorDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CorDocument_voterId_key" ON "CorDocument"("voterId");

-- AddForeignKey
ALTER TABLE "CorDocument" ADD CONSTRAINT "CorDocument_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Voter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
