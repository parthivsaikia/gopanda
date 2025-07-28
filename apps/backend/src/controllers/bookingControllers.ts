import { createOrderAction } from "../actions/bookingActions.js";
import type { Context } from "hono";
import { deepConvertBigIntToString } from "../utils/types/bigIntToString.js";

export const createOrder = async (c: Context) => {
  try {
    const { amount, currency } = await c.req.json();
    let numAmount = amount;
    const order = await createOrderAction({ amount: numAmount, currency });
    return c.json(deepConvertBigIntToString(order));
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in creating order controller: ${error.message}`
        : `unknown error in creating order in controller `;
    throw new Error(errorMsg);
  }
};
