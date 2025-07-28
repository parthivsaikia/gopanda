import { clsx, type ClassValue } from "clsx";
import { type } from "arktype";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateWithArktype(schema: any, data: any) {
  const validatedData = schema(data);
  if (validatedData instanceof type.errors) {
    return { success: false, errors: validatedData.summary };
  }
  return { success: true, errors: null };
}
export const validateDayPlanDetailed = (dayPlan: any[]) => {
  const errors: string[] = [];

  if (!dayPlan || dayPlan.length === 0) {
    errors.push("At least one day plan is required");
    return { isValid: false, errors };
  }

  dayPlan.forEach((day, dayIndex) => {
    if (!day.day || day.day <= 0) {
      errors.push(`Day ${dayIndex + 1}: Day number must be greater than 0`);
    }

    if (!day.itineraries || day.itineraries.length === 0) {
      errors.push(`Day ${dayIndex + 1}: At least one itinerary is required`);
    } else {
      day.itineraries.forEach((itinerary: any, itinIndex: number) => {
        if (!itinerary.title || itinerary.title.trim() === "") {
          errors.push(
            `Day ${dayIndex + 1}, Itinerary ${itinIndex + 1}: Title is required`,
          );
        }

        if (!itinerary.startTime) {
          errors.push(
            `Day ${dayIndex + 1}, Itinerary ${itinIndex + 1}: Start time is required`,
          );
        }

        if (!itinerary.endTime) {
          errors.push(
            `Day ${dayIndex + 1}, Itinerary ${itinIndex + 1}: End time is required`,
          );
        }

        if (
          itinerary.startTime &&
          itinerary.endTime &&
          itinerary.startTime >= itinerary.endTime
        ) {
          errors.push(
            `Day ${dayIndex + 1}, Itinerary ${itinIndex + 1}: End time must be after start time`,
          );
        }

        // Validate activities
        if (itinerary.activities && itinerary.activities.length > 0) {
          itinerary.activities.forEach((activity: any, actIndex: number) => {
            if (!activity.title || activity.title.trim() === "") {
              errors.push(
                `Day ${dayIndex + 1}, Itinerary ${itinIndex + 1}, Activity ${actIndex + 1}: Title is required`,
              );
            }
          });
        }

        // Validate place if provided
        if (itinerary.place) {
          if (itinerary.place.create) {
            const place = itinerary.place.create;
            if (!place.name || place.name.trim() === "") {
              errors.push(
                `Day ${dayIndex + 1}, Itinerary ${itinIndex + 1}: Place name is required`,
              );
            }
            if (typeof place.latitude !== "number") {
              errors.push(
                `Day ${dayIndex + 1}, Itinerary ${itinIndex + 1}: Valid latitude is required`,
              );
            }
            if (typeof place.longitude !== "number") {
              errors.push(
                `Day ${dayIndex + 1}, Itinerary ${itinIndex + 1}: Valid longitude is required`,
              );
            }
          } else if (itinerary.place.connect) {
            if (
              !itinerary.place.connect.id ||
              itinerary.place.connect.id <= 0
            ) {
              errors.push(
                `Day ${dayIndex + 1}, Itinerary ${itinIndex + 1}: Valid place ID is required`,
              );
            }
          }
        }
      });
    }
  });

  return { isValid: errors.length === 0, errors };
};
