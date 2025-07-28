import prismaInstance from "@repo/db";
import type { Context } from "hono";
import {
  convertBigIntToString,
  deepConvertBigIntToString,
} from "../utils/types/bigIntToString.js";
import type { DayPlan } from "@repo/types";
import {
  getAllToursAction,
  getTourByIdAction,
  getTourByPlacesAction,
} from "../actions/tourActions.js";

export const createTourController = async (c: Context) => {
  const body = await c.req.json();
  console.log(body.dayPlan);
  try {
    const agentId = c.get("user").id;
    if (!agentId) {
      return c.json({ error: "User not logged in" });
    }
    const newTour = await prismaInstance.offeredTour.create({
      data: {
        maximumPeople: body.maximumPeople,
        minimumPeople: body.minimumPeople,
        price: body.price,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        facilities: body.facilities,
        agent: {
          connect: {
            id: agentId,
          },
        },
        dayPlan: {
          create: body.dayPlan.map((dayPlanItem: DayPlan) => ({
            day: dayPlanItem.day,
            itineraries: {
              create: dayPlanItem.itineraries.map((itinerary) => ({
                title: itinerary.title,
                startTime: itinerary.startTime,
                endTime: itinerary.endTime,
                place: itinerary.place,
                activities: {
                  create: itinerary.activities.map((activity) => ({
                    title: activity.title,
                  })),
                },
              })),
            },
          })),
        },
      },
    });
    return c.json(
      {
        success: true,
        tourDetails: { tourId: String(newTour.id) },
        message: "Tour Created Successfully",
      },
      201,
    );
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in creating tour ${error.message}`
        : `unknown error in creating tour`;
    throw new Error(errorMsg);
  }
};

export async function getToursByPlace(c: Context) {
  try {
    const body = await c.req.json();
    console.log("body: ", body);
    if (typeof body.place !== "string") {
      console.log(body.place);
      throw new Error("Place name must be a string");
    }
    const tours = await getTourByPlacesAction(
      body.place,
      body.date,
      Number(body.persons),
    );
    const serializedTours = tours.map((tour) =>
      deepConvertBigIntToString(tour),
    );
    return c.json(
      { tours: serializedTours, count: serializedTours.length },
      200,
    );
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching tour by place: ${error.message}`
        : `unknown error in fetching tour by place`;
    throw new Error(errorMsg);
  }
}
export async function getAllTours(c: Context) {
  try {
    const tours = await getAllToursAction();
    const serializedTours = tours.map((tour) =>
      deepConvertBigIntToString(tour),
    );
    return c.json(serializedTours, 200);
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching all tours: ${error.message}`
        : `unknown error in fetching all tours`;
    throw new Error(errorMsg);
  }
}

export async function getTourById(c: Context) {
  try {
    const { id } = c.req.param();
    const tour = await getTourByIdAction(id);
    const serializedTour = deepConvertBigIntToString(tour);
    return c.json(serializedTour, 200);
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching tour by id: ${error.message}`
        : `unknown error in fetching tour by id`;
    throw new Error(errorMsg);
  }
}
