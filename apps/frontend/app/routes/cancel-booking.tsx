import { cancelBooking } from "services/cancel-booking";
import type { Route } from "./+types/cancel-booking";
export const clientAction = async ({
  request,
  params,
}: Route.ClientActionArgs) => {
  const { id } = params;
  if (!id) {
    throw new Error("booking id not provided");
  }
  try {
    const cancelBookingResult = await cancelBooking(id);
    console.log(cancelBookingResult);
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in cancelling booking: ${error.message}`
        : `unknown error in cancelling booking`;
    throw new Error(errorMsg);
  }
};
