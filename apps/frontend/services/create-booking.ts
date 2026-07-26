import axios from "axios";
import { apiBaseUrl } from "./config";
import { loggedInUser } from "./loggedInUser";
import type { Persons } from "@repo/types";

export const createBooking = async ({
  tourId,
  peoples,
}: {
  tourId: string;
  peoples: Persons;
}) => {
  const csrfToken = (await loggedInUser()).csrfToken;
  const response = await axios.post(
    `${apiBaseUrl}/bookings/create-booking`,
    {
      tourId,
      peoples,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken,
      },
      withCredentials: true,
    },
  );
  return response.data;
};
