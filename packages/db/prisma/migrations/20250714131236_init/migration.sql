/*
  Warnings:

  - You are about to drop the `activites` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `maximumPeople` to the `offered_tours` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activites" DROP CONSTRAINT "activites_itineraryId_fkey";

-- AlterTable
ALTER TABLE "offered_tours" ADD COLUMN     "maximumPeople" INTEGER NOT NULL;

-- DropTable
DROP TABLE "activites";

-- CreateTable
CREATE TABLE "activities" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "itineraryId" BIGINT NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activities_itineraryId_idx" ON "activities"("itineraryId");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "itinerariy_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
