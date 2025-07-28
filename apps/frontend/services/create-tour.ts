import { type TourFormData } from "@repo/types";
import axios from "axios";
import { apiBaseUrl } from "./config";
import { loggedInUser } from "./loggedInUser";

export default async function createTour(tourData: TourFormData) {
  const csrfToken = (await loggedInUser()).csrfToken;
  const response = await axios.post(`${apiBaseUrl}/tours`, tourData, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
    },
    withCredentials: true,
  });
  return response.data;
}
