import { Hono } from "hono";
import {
  loggedInUser,
  login,
  logout,
  logoutAll,
  signup,
} from "../controllers/authControllers.js";
import { authMiddleware, csrfMiddleware } from "../utils/middlewares.js";

const authRouter = new Hono();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, csrfMiddleware, logout);
authRouter.post("/logout-all", authMiddleware, csrfMiddleware, logoutAll);
authRouter.get("/current-user", authMiddleware, loggedInUser);

export default authRouter;
