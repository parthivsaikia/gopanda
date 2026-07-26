import { Hono } from "hono";
import {
  cancelBookingController,
  createBookingController,
  getAllBookingsController,
  getBookingByIdController,
  getBookingRequestController,
} from "../controllers/bookingControllers.js";
import { authMiddleware } from "../../dist/utils/middlewares.js";
import { csrfMiddleware, isAgentMiddleware } from "../utils/middlewares.js";
const bookingRouter = new Hono();

// TODO: add auth middlewares

bookingRouter.post(
  "/create-booking",
  authMiddleware,
  csrfMiddleware,
  createBookingController,
);

bookingRouter.get("/get-bookings", authMiddleware, getAllBookingsController);
bookingRouter.get(
  "/get-bookings/:id",
  authMiddleware,
  getBookingByIdController,
);

bookingRouter.post(
  "/cancel-booking/:id",
  authMiddleware,
  csrfMiddleware,
  cancelBookingController,
);

bookingRouter.get(
  "agent/pending-bookings",
  authMiddleware,
  isAgentMiddleware,
  getBookingRequestController,
);

export default bookingRouter;
