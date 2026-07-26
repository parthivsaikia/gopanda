/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_paymentId_fkey";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "paymentId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_paymentId_key" ON "bookings"("paymentId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
