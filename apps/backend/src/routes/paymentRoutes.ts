import { Hono } from "hono";
import {
  createOrder,
  handleWebhookController,
  verifyPaymentController,
} from "../controllers/paymentControllers.js";

const paymentRouter = new Hono();

paymentRouter.post("/order", createOrder);
paymentRouter.post("/verification", verifyPaymentController);
paymentRouter.post("/webhook", handleWebhookController);

export default paymentRouter;
