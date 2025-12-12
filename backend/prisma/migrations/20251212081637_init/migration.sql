/*
  Warnings:

  - You are about to drop the `BillingHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Code` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Refactor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BillingHistory" DROP CONSTRAINT "BillingHistory_usersId_fkey";

-- DropForeignKey
ALTER TABLE "Code" DROP CONSTRAINT "Code_usersId_fkey";

-- DropForeignKey
ALTER TABLE "Refactor" DROP CONSTRAINT "Refactor_codeId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_usersId_fkey";

-- DropTable
DROP TABLE "BillingHistory";

-- DropTable
DROP TABLE "Code";

-- DropTable
DROP TABLE "Refactor";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" UUID NOT NULL,
    "usersId" UUID NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'free',
    "dailyScanLimit" INTEGER,
    "scansUsedToday" INTEGER NOT NULL DEFAULT 0,
    "lastResetDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "renewal_date" TIMESTAMP(3),
    "stripe_subscription_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_history" (
    "id" UUID NOT NULL,
    "usersId" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeEventId" TEXT,
    "eventType" TEXT,

    CONSTRAINT "billing_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code" (
    "id" UUID NOT NULL,
    "usersId" UUID NOT NULL,
    "codeInput" TEXT NOT NULL,
    "codeOutput" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refactor" (
    "id" UUID NOT NULL,
    "codeId" UUID NOT NULL,
    "refactoredCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refactor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_usersId_key" ON "subscription"("usersId");

-- CreateIndex
CREATE UNIQUE INDEX "billing_history_stripeEventId_key" ON "billing_history"("stripeEventId");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_history" ADD CONSTRAINT "billing_history_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code" ADD CONSTRAINT "code_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refactor" ADD CONSTRAINT "refactor_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "code"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
