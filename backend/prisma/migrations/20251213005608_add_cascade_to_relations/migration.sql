-- DropForeignKey
ALTER TABLE "billing_history" DROP CONSTRAINT "billing_history_usersId_fkey";

-- DropForeignKey
ALTER TABLE "code" DROP CONSTRAINT "code_usersId_fkey";

-- DropForeignKey
ALTER TABLE "refactor" DROP CONSTRAINT "refactor_codeId_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_usersId_fkey";

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_history" ADD CONSTRAINT "billing_history_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code" ADD CONSTRAINT "code_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refactor" ADD CONSTRAINT "refactor_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "code"("id") ON DELETE CASCADE ON UPDATE CASCADE;
