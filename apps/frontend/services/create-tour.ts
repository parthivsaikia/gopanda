import type { frontendCreateTourDTO } from "@repo/types";
import axios from "axios";
import { apiBaseUrl } from "./config";
import { loggedInUser } from "./loggedInUser";

export default async function createTour(tourData: frontendCreateTourDTO) {
  const csrfToken = (await loggedInUser()).csrfToken;
  const response = await axios.post(`${apiBaseUrl}/tour/new-tour`, tourData, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
    },
    withCredentials: true,
  });
}
