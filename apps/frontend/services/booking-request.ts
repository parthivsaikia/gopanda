import axios from "axios";
import { apiBaseUrl } from "./config";

export const getBookingRequests = async () => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/bookings/agent/pending-bookings`,
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching booking requests: ${error.message}`
        : `unknown error in fetching booking requests`;
    throw new Error(errorMsg);
  }
};
