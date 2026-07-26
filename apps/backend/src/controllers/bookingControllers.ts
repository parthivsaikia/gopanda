import type { Context } from "hono";

import { deepConvertBigIntToString } from "../utils/types/bigIntToString.js";
import {
  cancelBookingAction,
  getAllBookingsOfCustomerAction,
  getBookingByIdAction,
  getBookingRequestAction,
  initialBookingAction,
} from "../actions/bookingActions.js";
import {
  createOrderAction,
  getProviderPaymentIdAction,
  rzpRefundAction,
} from "../actions/paymentActions.js";
import { getTourByIdAction } from "../actions/tourActions.js";

export const createBookingController = async (c: Context) => {
  try {
    const customerId = c.get("user").id;
    console.log(customerId);
    const { tourId, peoples } = await c.req.json();
    console.log(peoples.peoples);
    const booking = await initialBookingAction({
      userId: String(customerId),
      persons: peoples.peoples,
      tourId,
    });
    const tour = await getTourByIdAction(tourId);
    const tourPrice = tour.price * 100;

    const numberOfPeople = peoples.peoples.length;
    const totalPrice = tourPrice * numberOfPeople;
    const order = await createOrderAction({
      amount: String(totalPrice),
      currency: "INR",
      id: String(booking.id),
    });
    console.log(order);
    return c.json({
      success: true,
      booking: deepConvertBigIntToString(booking),
      payment: deepConvertBigIntToString(order),
    });
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in creating a booking: ${error.message}`
        : `unknown error in creating a booking`;
    throw new Error(errorMsg);
  }
};

export const getAllBookingsController = async (c: Context) => {
  const customerId = c.get("user").id;
  if (!customerId) {
    return c.json({ error: "Customer Id not provided" });
  }
  try {
    const allBookings = await getAllBookingsOfCustomerAction(customerId);
    return c.json(deepConvertBigIntToString(allBookings));
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching all bookings: ${error.message}`
        : `unknown error in fetching all bookings`;
    throw new Error(errorMsg);
  }
};

export const getBookingByIdController = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const booking = await getBookingByIdAction(id);
    return c.json(deepConvertBigIntToString(booking));
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching booking by id: ${error.message}`
        : `unknown error in fetching booking by id`;
    throw new Error(errorMsg);
  }
};

export const cancelBookingController = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const booking = await getBookingByIdAction(id);
    const paymentId = booking?.paymentId;
    const response = await cancelBookingAction(id);
    return c.json(deepConvertBigIntToString(response));
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in cancelling tour: ${error.message}`
        : `unknown error in `;
    throw new Error(errorMsg);
  }
};

export const getBookingRequestController = async (c: Context) => {
  try {
    const agentId = c.get("user").id;
    const requests = await getBookingRequestAction({ agentId });
    return c.json(deepConvertBigIntToString(requests));
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in getting booking request: ${error.message}`
        : `unknown error in getting booking request`;
    throw new Error(errorMsg);
  }
};
