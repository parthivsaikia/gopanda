import { Hono } from "hono";
import { createTourController } from "../controllers/tourControllers.js";
import {
  authMiddleware,
  csrfMiddleware,
  isAgentMiddleware,
} from "../utils/middlewares.js";

const tourRouter = new Hono();

tourRouter.post(
  "/new-tour",
  authMiddleware,
  csrfMiddleware,
  isAgentMiddleware,
  createTourController,
);

export default tourRouter;
