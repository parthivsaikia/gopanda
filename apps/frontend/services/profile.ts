import { apiBaseUrl } from "./config";
import axios from "axios";
import { loggedInUser } from "./loggedInUser";

export async function getProfile() {
  const response = await loggedInUser();
  const id = response.userId;
  const user = await axios.get(`${apiBaseUrl}/profile/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return user.data;
}
