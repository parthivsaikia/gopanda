import type { Route } from "./+types/create-tour";
import { type } from "arktype";
import createTour from "services/create-tour";
import { redirect } from "react-router";
import TourCreateForm from "~/components/tour-create-form";
import { validatedTourPayloadSchema, type DayPlan } from "@repo/types";
import axios from "axios";
import { apiBaseUrl } from "services/config";
import { loggedInUser } from "services/loggedInUser";
import { getProfile } from "services/profile";

export async function clientAction({ request }: Route.ClientActionArgs) {
  try {
    const data = await request.json();
    console.log(data);
    const startDate = new Date(data.startDate);
    data.dayPlan.forEach((day: DayPlan) => {
      const currentDayDate = new Date(startDate);
      currentDayDate.setDate(startDate.getDate() + (day.day - 1));
      day.itineraries.forEach((itinerary) => {
        const [startHour, startMinute] = itinerary.startTime.split(":");
        const isoStartTime = new Date(currentDayDate);
        isoStartTime.setHours(Number(startHour), Number(startMinute), 0, 0);

        const [endHour, endMinute] = itinerary.endTime.split(":");
        const isoEndTime = new Date(currentDayDate);
        isoEndTime.setHours(Number(endHour), Number(endMinute), 0, 0);

        // Replace the time-only string with the full ISO string
        itinerary.startTime = isoStartTime.toISOString();
        itinerary.endTime = isoEndTime.toISOString();
      });
    });
    const response = await createTour(data);
    console.log(response);
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in new tour: ${error.message}`
        : `unknown error in new tour`;
    throw new Error(errorMsg);
  }
}

export async function clientLoader() {
  const user = await getProfile();
  if (user.role !== "TravelAgent") {
    return redirect("/");
  }
}

export default function CreateTour({ actionData }: Route.ComponentProps) {
  return (
    <div>
      {actionData && <p>{actionData}</p>}
      <h1>Create new tour</h1>
      <TourCreateForm />
    </div>
  );
}
