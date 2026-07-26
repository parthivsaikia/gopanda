import axios from "axios";
import { apiBaseUrl } from "./config";

export const verifyPayment = async ({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/payment/verification`, {
      orderId,
      paymentId,
      signature,
    });
    return response.data;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in payment verification service: ${error.message}`
        : `unknown error in payment verification service`;
    throw new Error(errorMsg);
  }
};
