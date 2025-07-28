import BookingForm from "~/components/bookingform";
import type { Route } from "./+types/booking";
import { getToursById } from "services/get-tours";
import { createOrder } from "services/create-order";

export const clientAction = async ({
  request,
  params,
}: Route.ClientActionArgs) => {
  try {
    const id = params.tourId;
    const tour = await getToursById(id);
    const formData = await request.formData();
    const jsonData = formData.get("data") as string;
    const data = JSON.parse(jsonData);
    const order = await createOrder({
      amount: String(data.peoples.length * tour.price),
      currency: "INR",
    });
    console.log(order);
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in doing something: ${error.message}`
        : `unknown error in doing something`;
    throw new Error(errorMsg);
  }
};

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  try {
    const tourId = params.tourId;
    const tour = await getToursById(tourId);
    return tour;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching tour details in booking form: ${error.message}`
        : `unknown error in fetching tour details in booking form`;
    throw new Error(errorMsg);
  }
};

export default function BookingPage({ loaderData }: Route.ComponentProps) {
  let tour = loaderData;
  return (
    <div>
      <BookingForm tourPrice={tour.price} tourId={tour.id} />
    </div>
  );
}
