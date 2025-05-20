/*id            BigInt      @id @default(autoincrement())
  minimumPeople Int
  price         Decimal
  itineraries   Itinerary[]
  facilities    String[] //different facilities to be stored as different strings
  agent         User        @relation(fields: [agentId], references: [id])
  agentId       BigInt
  bookings      Booking[]
  WishList      WishList[]
  startDate     DateTime
  endDate       DateTime
  reviews       Review[]
*/
import prismaInstance from "@repo/db";
import { createTourDTOSchema } from "@repo/types";
import type { Context } from "hono";
import { type } from "arktype";
import { convertBigIntToString } from "../utils/types/bigIntToString.js";
export const createTourController = async (c: Context) => {
  try {
    const { minimumPeople, price, startDate, endDate } = await c.req.json();

    const agentId = c.get("user").id;
    const tourData = {
      minimumPeople: Number(minimumPeople),
      price: Number(price),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      agentId: BigInt(agentId),
    };
    const validatedData = createTourDTOSchema(tourData);
    if (validatedData instanceof type.errors) {
      throw new Error(validatedData.summary);
    } else {
      const tour = await prismaInstance.offeredTour.create({
        data: {
          minimumPeople,
          price,
          startDate,
          endDate,
          agentId,
        },
      });
      return c.json(convertBigIntToString(tour));
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error at creating tour: ${error.message}`
        : `unknown error at creating tour.`;
    throw new Error(errorMsg);
  }
};
