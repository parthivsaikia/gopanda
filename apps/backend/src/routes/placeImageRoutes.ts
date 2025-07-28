import { Hono } from "hono";
import { imageUpload } from "../controllers/placeImageControllers.js";

const placeImageRouter = new Hono();

placeImageRouter.post("/", imageUpload);

export default placeImageRouter;
