/*
  Warnings:

  - You are about to drop the column `eventType` on the `billing_history` table. All the data in the column will be lost.
  - You are about to drop the column `stripeEventId` on the `billing_history` table. All the data in the column will be lost.
  - You are about to drop the column `codeInput` on the `code` table. All the data in the column will be lost.
  - You are about to drop the column `codeOutput` on the `code` table. All the data in the column will be lost.
  - You are about to drop the column `refactoredCode` on the `refactor` table. All the data in the column will be lost.
  - You are about to drop the column `dailyScanLimit` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `lastResetDate` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `scansUsedToday` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `hashedPassword` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripe_eventId]` on the table `billing_history` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code_input` to the `code` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code_output` to the `code` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refactored_code` to the `refactor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashed_password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "billing_history_stripeEventId_key";

-- AlterTable
ALTER TABLE "billing_history" DROP COLUMN "eventType",
DROP COLUMN "stripeEventId",
ADD COLUMN     "event_type" TEXT,
ADD COLUMN     "stripe_eventId" TEXT;

-- AlterTable
ALTER TABLE "code" DROP COLUMN "codeInput",
DROP COLUMN "codeOutput",
ADD COLUMN     "code_input" TEXT NOT NULL,
ADD COLUMN     "code_output" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "refactor" DROP COLUMN "refactoredCode",
ADD COLUMN     "refactored_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "dailyScanLimit",
DROP COLUMN "lastResetDate",
DROP COLUMN "scansUsedToday",
ADD COLUMN     "daily_scan_limit" INTEGER,
ADD COLUMN     "last_reset_date" TIMESTAMP(3),
ADD COLUMN     "scans_used_today" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "hashedPassword",
ADD COLUMN     "hashed_password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "billing_history_stripe_eventId_key" ON "billing_history"("stripe_eventId");
