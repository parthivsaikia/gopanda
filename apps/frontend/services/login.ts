import type { LoginInputUserDTO } from "@repo/types";
import axios from "axios";
import { apiBaseUrl } from "./config";

export const login = async (data: LoginInputUserDTO) => {
  const response = await axios.post(`${apiBaseUrl}/auth/login`, data, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};
