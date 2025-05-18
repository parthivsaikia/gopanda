import axios from "axios";
import { apiBaseUrl } from "./config";

export async function loggedInUser() {
  const response = await axios.get(`${apiBaseUrl}/auth/current-user`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
}
