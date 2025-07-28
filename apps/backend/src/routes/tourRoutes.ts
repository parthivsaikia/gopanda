import { Hono } from "hono";
import { arktypeValidator } from "@hono/arktype-validator";
import {
  createTourController,
  getAllTours,
  getTourById,
  getToursByPlace,
} from "../controllers/tourControllers.js";
import {
  authMiddleware,
  csrfMiddleware,
  isAgentMiddleware,
} from "../utils/middlewares.js";
import { TourPayloadSchema } from "@repo/types";

const tourRouter = new Hono();

tourRouter.post(
  "/",
  authMiddleware,
  csrfMiddleware,
  isAgentMiddleware,
  arktypeValidator("json", TourPayloadSchema),
  createTourController,
);

tourRouter.post("/byPlace", getToursByPlace);
tourRouter.get("/", getAllTours);
tourRouter.get("/:id", getTourById);
export default tourRouter;
