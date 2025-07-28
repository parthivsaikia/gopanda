import { type } from "arktype";
// 1. Define the two possible actions for a Place
const placeConnectSchema = type({
  connect: {
    id: "number.integer>0", // Prisma expects a number for the ID
  },
});
const placeCreateSchema = type({
  create: {
    name: "string>0",
    latitude: "number",
    longitude: "number",
    photos: "string[]", // URLs, not File objects
  },
});
export const activitySchema = type({ "id?": "string", title: "string>0" });
export const itinerarySchema = type({
  "id?": "string",
  title: "string>0",
  startTime: "string",
  endTime: "string",
  // This is the key: place is optional, and can be one of two shapes
  "place?": placeCreateSchema.or(placeConnectSchema),
  activities: activitySchema.array(),
});
export const dayPlanSchema = type({
  "id?": "string",
  day: "number>0",
  itineraries: itinerarySchema.array(),
});
// 2. Define the schema for the final API payload
export const TourPayloadSchema = type({
  maximumPeople: "number.integer > 0",
  minimumPeople: "number.integer>0",
  price: "number > 0", // Use string.numeric for decimal safety
  startDate: "string.date",
  endDate: "string.date",
  facilities: "string[] > 0",
  dayPlan: dayPlanSchema.array(),
});
// You can still add your custom validation rules
export const validatedTourPayloadSchema = TourPayloadSchema.narrow(
  (data, ctx) => {
    if (new Date(data.endDate) < new Date(data.startDate)) {
      return ctx.reject({
        path: ["endDate"],
        expected: "end date should be after start time",
      });
    }
    // You could add more complex validation here if needed
    return true;
  },
);
export const firstStepSchema = type({
  minimumPeople: "number.integer>0",
  price: "number > 0",
  startDate: "string.date",
});
