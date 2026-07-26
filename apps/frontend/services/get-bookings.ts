import axios from "axios";
import { apiBaseUrl } from "./config";

export const getAllBookings = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/bookings/get-bookings`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching bookings: ${error.message}`
        : `unknown error in fetching bookings`;
    throw new Error(errorMsg);
  }
};

export const getBookingById = async (bookingId: string) => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/bookings/get-bookings/${bookingId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in get booking service: ${error.message}`
        : `unknown error in get booking service`;
    throw new Error(errorMsg);
  }
};
