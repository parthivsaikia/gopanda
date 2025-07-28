import axios from "axios";
import { apiBaseUrl } from "./config";

export default async function userExists(
  username?: string,
  email?: string,
  mobileNumber?: string,
) {
  try {
    const response = await axios.post(`${apiBaseUrl}/users/exists`, {
      username,
      email,
      mobileNumber,
    });
    return response.data;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching users in userExists function: ${error.message}`
        : `unknown error in userExists function`;
    throw new Error(errorMsg);
  }
}
