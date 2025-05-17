import type { UserInputUserDTO } from "@repo/types";
import { apiBaseUrl } from "./config";
import axios from "axios";

export const login = async (data: UserInputUserDTO) => {
  const response = await axios.post(`${apiBaseUrl}/auth/signup`, data, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};
