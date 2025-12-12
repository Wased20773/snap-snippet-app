/*
  Warnings:

  - You are about to drop the column `userId` on the `BillingHistory` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Code` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[usersId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usersId` to the `BillingHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usersId` to the `Code` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usersId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BillingHistory" DROP CONSTRAINT "BillingHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "Code" DROP CONSTRAINT "Code_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropIndex
DROP INDEX "Subscription_userId_key";

-- AlterTable
ALTER TABLE "BillingHistory" DROP COLUMN "userId",
ADD COLUMN     "usersId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Code" DROP COLUMN "userId",
ADD COLUMN     "usersId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "userId",
ADD COLUMN     "usersId" UUID NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_usersId_key" ON "Subscription"("usersId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingHistory" ADD CONSTRAINT "BillingHistory_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Code" ADD CONSTRAINT "Code_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
