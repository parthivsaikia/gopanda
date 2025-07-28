import { Hono } from "hono";
import { userCheck } from "../controllers/userControllers.js";

const userRouter = new Hono();

userRouter.post("/exists", userCheck);

export default userRouter;
