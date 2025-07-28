import { getToursById } from "services/get-tours";
import type { Route } from "./+types/tour-details-route";
import TourDetails from "~/components/tourImageGallery";
import BookNowSection from "~/components/bookingButton";
import { generateTourTitle } from "~/components/tour-grid";

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  try {
    const tourId = params.id;
    const tour = await getToursById(tourId);
    console.log(tour);
    return tour;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in client loader of tour details page: ${error.message}`
        : `unknown error in client loader of tour details page`;
    throw new Error(errorMsg);
  }
}

export default function TourDetailsPage({ loaderData }: Route.ComponentProps) {
  const tourId = loaderData.id;
  const photos = loaderData.dayPlan
    .flatMap((day: any) => day.itineraries)
    .flatMap((itineraries: any) => itineraries.place)
    .flatMap((place: any) => place.photos);
  const tourName = generateTourTitle(loaderData).split(" ")[1];
  return (
    <div>
      <h1>You are visiting tour with tourID </h1>
      <TourDetails images={photos} />
      <BookNowSection
        tourId={tourId}
        price={Number(loaderData.price)}
        startDate={loaderData.startDate}
        endDate={loaderData.endDate}
        tourName={tourName}
      />
    </div>
  );
}

// dayPlan[0].itineraries[0].place.photos
// dayPlan -> array
// itineraries -> array
// place !-> array
// photos -> array
// [[itineraries1, itineraries2], [itineraries3, itineraries4], [itineraries5, itineraries6]]
