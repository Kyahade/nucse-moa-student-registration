-- AlterTable
ALTER TABLE "SystemSetting" ADD COLUMN     "registrationLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "registrationMessage" TEXT NOT NULL DEFAULT 'Student registration is currently closed. Please wait for an official announcement.';
