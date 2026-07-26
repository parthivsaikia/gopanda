-- DropForeignKey
ALTER TABLE "refunds" DROP CONSTRAINT "refunds_paymentTransactionId_fkey";

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES "payment_transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
