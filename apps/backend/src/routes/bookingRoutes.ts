import { Hono } from "hono";
import { createOrder } from "../controllers/bookingControllers.js";

const bookingRouter = new Hono();

// TODO: add auth middlewares
bookingRouter.post("/order", createOrder);

export default bookingRouter;
