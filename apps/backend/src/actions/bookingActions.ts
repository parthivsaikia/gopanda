import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";
import { rzpKeyId, rzpKeySecret } from "../config/config.js";

export const createOrderAction = async ({
  amount,
  currency,
}: {
  amount: string;
  currency: string;
}) => {
  try {
    const rzpInstance = new Razorpay({
      key_id: rzpKeyId,
      key_secret: rzpKeySecret,
    });
    const orderData = await rzpInstance.orders.create({
      amount: Number(amount),
      currency: currency,
      receipt: uuidv4(),
    });
    return orderData;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in creating razorpay order: ${error.message}`
        : `unknown error in creating razorpay order`;
    throw new Error(errorMsg);
  }
};
