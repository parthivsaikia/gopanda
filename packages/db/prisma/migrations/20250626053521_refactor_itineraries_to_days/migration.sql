/*
  Warnings:

  - You are about to drop the `itineraries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activites" DROP CONSTRAINT "activites_itineraryId_fkey";

-- DropForeignKey
ALTER TABLE "itineraries" DROP CONSTRAINT "itineraries_placeId_fkey";

-- DropForeignKey
ALTER TABLE "itineraries" DROP CONSTRAINT "itineraries_tourId_fkey";

-- DropTable
DROP TABLE "itineraries";

-- CreateTable
CREATE TABLE "itinerariy_blocks" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "dayPlanId" BIGINT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "placeId" BIGINT,
    "tourId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itinerariy_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "day_plans" (
    "id" BIGSERIAL NOT NULL,
    "day" INTEGER NOT NULL,
    "tourId" BIGINT NOT NULL,

    CONSTRAINT "day_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "itinerariy_blocks_dayPlanId_idx" ON "itinerariy_blocks"("dayPlanId");

-- CreateIndex
CREATE INDEX "day_plans_tourId_idx" ON "day_plans"("tourId");

-- AddForeignKey
ALTER TABLE "itinerariy_blocks" ADD CONSTRAINT "itinerariy_blocks_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerariy_blocks" ADD CONSTRAINT "itinerariy_blocks_dayPlanId_fkey" FOREIGN KEY ("dayPlanId") REFERENCES "day_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "day_plans" ADD CONSTRAINT "day_plans_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "offered_tours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activites" ADD CONSTRAINT "activites_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "itinerariy_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
