import type { LoginInputUserDTO } from "@repo/types";
import axios from "axios";
import { apiBaseUrl } from "./config";
export const login = async (loginData: LoginInputUserDTO) => {
  const response = await axios.post(`${apiBaseUrl}/auth/login`);
  return response.data;
};
