import prismaInstance from "@repo/db";
import type { Context } from "hono";
import {
  convertBigIntToString,
  deepConvertBigIntToString,
} from "../utils/types/bigIntToString.js";
import type { DayPlan, Booking } from "@repo/types";
import {
  getAllToursAction,
  getTourByIdAction,
  getTourByPlacesAction,
  getToursByAgentAction,
} from "../actions/tourActions.js";

import dayjs from "dayjs";

interface Tour {
  startDate: Date;
  endDate: Date;
  dayPlan: {
    itineraries: {
      place: {
        name: string;
        photos: string[];
      } | null;
    }[];
  }[];
}

const calculateDays = (startDate: Date, endDate: Date) => {
  const date1 = dayjs(startDate);
  const date2 = dayjs(endDate);
  return date2.diff(date1, "day");
};

const shortenPlaceName = (placeName: string | undefined) => {
  if (!placeName) return "";
  const parts = placeName.split(", ");
  // Takes the first 2 parts (e.g., "Nag, Nag Tehsil") and discards the rest.
  return parts.slice(0, 2).join(", ");
};

export const generateTourTitle = (tour: Tour) => {
  // Use shortenPlaceName to process each place name first
  const places = tour.dayPlan
    .flatMap((day) => day.itineraries)
    .map((itinerary) => shortenPlaceName(itinerary.place?.name))
    .filter(Boolean); // Filter out any empty strings

  const uniquePlaces = [...new Set(places)];
  const duration = calculateDays(tour.startDate, tour.endDate);

  if (uniquePlaces.length === 0) {
    return `${duration}-Day Discovery Tour`; // Fallback for no places
  } else if (uniquePlaces.length === 1) {
    return `${duration}-Day ${uniquePlaces[0]} Tour`;
  } else if (uniquePlaces.length === 2) {
    return `${duration}-Day ${uniquePlaces.join(" & ")} Tour`;
  } else {
    // This title is also more descriptive
    return `${duration}-Day Tour of ${uniquePlaces[0]} & More`;
  }
};

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
    const fullTourData = await prismaInstance.offeredTour.findUnique({
      where: { id: newTour.id },
      include: {
        dayPlan: {
          include: {
            itineraries: {
              include: {
                place: true, // This is what your title function needs
              },
            },
          },
        },
      },
    });
    if (!fullTourData) {
      throw new Error("Failed to retrieve newly created tour.");
    }
    const generatedTitle = generateTourTitle(fullTourData); // Your existing function

    // 4. Update the tour with its new title
    const updatedTour = await prismaInstance.offeredTour.update({
      where: { id: newTour.id },
      data: {
        title: generatedTitle,
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

export const getToursByAgentId = async (c: Context) => {
  try {
    const agentId = c.get("user").id;
    const tours = await getToursByAgentAction(agentId);
    const serialisedTours = deepConvertBigIntToString(tours);
    return c.json({ tours: serialisedTours });
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching tour by agentId: ${error.message}`
        : `unknown error in fetching tour by agentId`;
    throw new Error(errorMsg);
  }
};
