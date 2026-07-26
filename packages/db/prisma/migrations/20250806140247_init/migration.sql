/*
  Warnings:

  - You are about to drop the column `provide` on the `payment_transaction` table. All the data in the column will be lost.
  - Added the required column `provider` to the `payment_transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment_transaction" DROP COLUMN "provide",
ADD COLUMN     "provider" "PaymentProvider" NOT NULL;
