import { Hono } from "hono";
import {
  loggedInUser,
  login,
  logout,
  logoutAll,
  signup,
} from "../controllers/authControllers.js";
import { authMiddleware, csrfMiddleware } from "../utils/middlewares.js";
import { arktypeValidator } from "@hono/arktype-validator";
import { LoginInputUserDTOSchema, UserInputUserDTOSchema } from "@repo/types";

const authRouter = new Hono();

authRouter.post(
  "/signup",
  arktypeValidator("json", UserInputUserDTOSchema),
  signup,
);
authRouter.post(
  "/login",
  arktypeValidator("json", LoginInputUserDTOSchema),
  login,
);
authRouter.post("/logout", authMiddleware, csrfMiddleware, logout);
authRouter.post("/logout-all", authMiddleware, csrfMiddleware, logoutAll);
authRouter.get("/current-user", authMiddleware, loggedInUser);

export default authRouter;
