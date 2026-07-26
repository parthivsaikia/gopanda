import { getBookingById } from "services/get-bookings";
import { getToursById } from "services/get-tours";
import { generateTourTitle } from "~/components/tour-grid";
import type { Route } from "./+types/booking-details";
import BookingCard from "~/components/bookingCard";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
export const clientLoader = async ({
  request,
  params,
}: Route.ClientLoaderArgs) => {
  try {
    const { id } = params;
    const booking = await getBookingById(id);
    const tourId = booking.tourId;
    const status = booking.status;
    const tour = await getToursById(String(tourId));
    const dayPlan = tour.dayPlan;
    const photo = dayPlan[0].itineraries[0].place.photos[0];
    const title = generateTourTitle(tour);
    const price = tour.price;
    const startDate = tour.startDate;
    const endDate = tour.endDate;

    return { id, status, photo, title, price, startDate, tourId, endDate };
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in booking details loader: ${error.message}`
        : `unknown error in booking details loader`;
    throw new Error(errorMsg);
  }
};

const BookingDetails = ({ loaderData }: Route.ComponentProps) => {
  const { id, startDate, endDate, status, photo, price, title, tourId } =
    loaderData;
  const fetcher = useFetcher();
  return (
    <div>
      <BookingCard
        imgUrl={photo}
        startDate={startDate}
        endDate={endDate}
        tourPrice={price}
        tourName={title}
        tourStatus={status}
        url={`/tour-details/${tourId}`}
      />
      <fetcher.Form method="post" action={`/cancel-booking/${id}`}>
        <Button type="submit">Cancel Booking</Button>
      </fetcher.Form>
    </div>
  );
};

export default BookingDetails;
