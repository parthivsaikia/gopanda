import { getAllBookings } from "services/get-bookings";
import { generateTourTitle } from "~/components/tour-grid";
import type { Route } from "./+types/customer-bookings";
import BookingCard from "~/components/bookingCard";
import { getToursById } from "services/get-tours";
import type { Booking } from "@repo/types";

export const clientLoader = async () => {
  const bookings = await getAllBookings();
  const bookingCardDetails = await Promise.all(
    bookings.map(async (booking: Booking) => {
      const bookingId = booking.id;
      const tourId = booking.tourId;
      const status = booking.status;
      const tour = await getToursById(String(tourId));
      const dayPlan = tour.dayPlan;
      const photo = dayPlan[0].itineraries[0].place.photos[0];
      const title = generateTourTitle(tour);
      const price = tour.price;
      const startDate = tour.startDate;
      const endDate = tour.endDate;
      return { status, photo, title, price, startDate, endDate, bookingId };
    }),
  );
  console.log("bookingCardDetails ->", bookingCardDetails);
  return bookingCardDetails;
};

export default function AllBookings({ loaderData }: Route.ComponentProps) {
  const bookingCardDetails = loaderData;
  return (
    <div>
      {bookingCardDetails.map((details: any) => (
        <BookingCard
          key={details.bookingId}
          tourName={details.title}
          tourPrice={details.price}
          startDate={details.startDate}
          endDate={details.endDate}
          tourStatus={details.status}
          imgUrl={details.photo}
          url={`/customer-bookings/${details.bookingId}`}
        />
      ))}
    </div>
  );
}
