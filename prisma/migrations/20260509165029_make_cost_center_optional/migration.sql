-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_costCenterId_fkey";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "costCenterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
