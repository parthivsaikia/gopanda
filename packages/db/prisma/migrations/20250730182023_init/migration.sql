-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('Razorpay', 'Stripe');

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'Pending';

-- CreateTable
CREATE TABLE "payment_transaction" (
    "id" BIGSERIAL NOT NULL,
    "provide" "PaymentProvider" NOT NULL,
    "providerPaymentId" TEXT NOT NULL,
    "providerOrderId" TEXT NOT NULL,
    "metaData" JSONB,
    "paymentId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_transaction_providerPaymentId_key" ON "payment_transaction"("providerPaymentId");

-- AddForeignKey
ALTER TABLE "payment_transaction" ADD CONSTRAINT "payment_transaction_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
