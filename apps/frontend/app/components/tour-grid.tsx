import type { Booking } from "@repo/types";
import TourCard from "./tourDisplayCard";
import dayjs from "dayjs";

interface Tour {
  id: bigint;
  startDate: Date;
  endDate: Date;
  maximumPeople: number;
  minimumPeople: number;
  price: number;
  bookings: Booking[];
  dayPlan: {
    itineraries: {
      place: {
        name: string;
        photos: string[];
      } | null;
    }[];
  }[];
  averageRating: number;
  reviewCount: number;
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

export const generateTourTitle = (
  tour: Omit<
    Tour,
    | "id"
    | "maximumPeople"
    | "minimumPeople"
    | "price"
    | "averageRating"
    | "reviewCount"
    | "bookings"
  >,
) => {
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
export default function TourGrid({
  tours,
  role,

  show,
}: {
  tours: Tour[];
  role: string;
  show: boolean;
}) {
  return (
    <div className="grid grid-cols-5 gap-4 my-8 p-4 mx-auto ">
      {tours.map((tour) => {
        // Extract all photos from the tour
        const allPhotos = tour.dayPlan
          .flatMap((day) => day.itineraries)
          .flatMap((itinerary) => itinerary.place?.photos || []);

        // Get the first photo as the main image
        const mainImageUrl = allPhotos[0] || "/hero-image.jpg";

        return (
          <TourCard
            role={role}
            show={show}
            key={tour.id.toString()}
            title={generateTourTitle(tour)}
            price={tour.price}
            startDate={dayjs(tour.startDate).format("D MMM")}
            endDate={dayjs(tour.endDate).format("D MMM")}
            id={tour.id.toString()}
            imageUrl={mainImageUrl}
            rating={tour.averageRating}
            spotsLeft={tour.maximumPeople - tour.bookings.length}
          />
        );
      })}
    </div>
  );
}
