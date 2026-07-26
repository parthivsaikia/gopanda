import axios from "axios";
import { apiBaseUrl } from "./config";
import { loggedInUser } from "./loggedInUser";

export const cancelBooking = async (bookingId: string) => {
  const csrfToken = (await loggedInUser()).csrfToken;
  try {
    const response = await axios.post(
      `${apiBaseUrl}/bookings/cancel-booking/${bookingId}`,
      null,
      {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in cancelling booking: ${error.message}`
        : `unknown error in cancelling booking`;
    throw new Error(errorMsg);
  }
};
