import { Hono } from "hono";
import { authMiddleware } from "../utils/middlewares.js";
import { getProfile } from "../controllers/profileControllers.js";

const profileRouter = new Hono();
profileRouter.get("/:id", authMiddleware, getProfile);

export default profileRouter;
