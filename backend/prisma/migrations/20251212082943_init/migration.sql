/*
  Warnings:

  - The primary key for the `billing_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `billing_history` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `code` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `code` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `refactor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `refactor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `usersId` on the `billing_history` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `usersId` on the `code` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `codeId` on the `refactor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `usersId` on the `subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "billing_history" DROP CONSTRAINT "billing_history_usersId_fkey";

-- DropForeignKey
ALTER TABLE "code" DROP CONSTRAINT "code_usersId_fkey";

-- DropForeignKey
ALTER TABLE "refactor" DROP CONSTRAINT "refactor_codeId_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_usersId_fkey";

-- AlterTable
ALTER TABLE "billing_history" DROP CONSTRAINT "billing_history_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "usersId",
ADD COLUMN     "usersId" INTEGER NOT NULL,
ADD CONSTRAINT "billing_history_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "code" DROP CONSTRAINT "code_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "usersId",
ADD COLUMN     "usersId" INTEGER NOT NULL,
ADD CONSTRAINT "code_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "refactor" DROP CONSTRAINT "refactor_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "codeId",
ADD COLUMN     "codeId" INTEGER NOT NULL,
ADD CONSTRAINT "refactor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "usersId",
ADD COLUMN     "usersId" INTEGER NOT NULL,
ALTER COLUMN "daily_scan_limit" SET DEFAULT 10,
ADD CONSTRAINT "subscription_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_usersId_key" ON "subscription"("usersId");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_history" ADD CONSTRAINT "billing_history_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code" ADD CONSTRAINT "code_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refactor" ADD CONSTRAINT "refactor_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "code"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
