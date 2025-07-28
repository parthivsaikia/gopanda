import axios from "axios";
import { apiBaseUrl } from "./config";

export const createOrder = async ({
  amount,
  currency,
}: {
  amount: string;
  currency: string;
}) => {
  try {
    const order = await axios.post(
      `${apiBaseUrl}/bookings/order`,
      {
        amount,
        currency,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return order.data;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in create order service: ${error.message}`
        : `unknown error in create order service`;
    throw new Error(errorMsg);
  }
};
