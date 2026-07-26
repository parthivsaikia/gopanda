import { getToursById } from "services/get-tours";
import type { Route } from "./+types/agent-tour";
import { ImageGalleryWithOneImage } from "~/components/tourImageGallery";
import AgentTourDetails from "~/components/agent-tourdetails";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const { id } = params;
  const tour = await getToursById(id);
  const photo = tour.dayPlan[0].itineraries[0].place.photos[0];
  console.log("tour ->", tour);

  return { tour, photo };
};

export default function AgentTour({ loaderData }: Route.ComponentProps) {
  const { tour, photo } = loaderData;
  return (
    <div>
      <ImageGalleryWithOneImage image={photo} />
      <AgentTourDetails
        minimumPeople={tour.minimumPeople}
        maxPeople={tour.maximumPeople}
        price={tour.price}
        startDate={tour.startDate}
        endDate={tour.endDate}
      />
    </div>
  );
}
