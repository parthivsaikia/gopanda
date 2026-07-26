/*
  Warnings:

  - You are about to drop the column `bookingId` on the `payments` table. All the data in the column will be lost.
  - Added the required column `paymentId` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `amount` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('Pending', 'Completed', 'Failed');

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_bookingId_fkey";

-- DropIndex
DROP INDEX "payments_bookingId_key";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "paymentId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "payment_transaction" ALTER COLUMN "provider" SET DEFAULT 'Razorpay';

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "bookingId",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "amount",
ADD COLUMN     "amount" MONEY NOT NULL;

-- CreateTable
CREATE TABLE "refunds" (
    "id" BIGSERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "reason" TEXT,
    "refundStatus" "RefundStatus" NOT NULL DEFAULT 'Pending',
    "providerRefundId" TEXT NOT NULL,
    "paymentTransactionId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metaData" JSONB,

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refunds_providerRefundId_key" ON "refunds"("providerRefundId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES "payment_transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
