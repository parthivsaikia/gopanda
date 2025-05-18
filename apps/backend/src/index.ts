import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import "./utils/types/honoContextType";
import authRouter from "./routes/authRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
const app = new Hono();

app.use(
  "*",
  cors({
    origin: [
      "http://localhost:5173", // <<< YOUR FRONTEND ORIGIN
      // Add any other origins you need to allow, like your production frontend URL
      // 'https://your-production-frontend.com'
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Ensure OPTIONS and POST are here
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-CSRF-TOKEN",
    ], // Add headers your frontend sends
    credentials: true, // IMPORTANT if your frontend sends cookies or Authorization header.
    // If true, 'origin' CANNOT be '*'
    maxAge: 86400, // Optional: How long preflight requests can be cached (seconds)
  }),
);
app.get("/", (c) => {
  return c.json({
    hi: "mom",
  });
});

app.route("/auth", authRouter);
app.route("/profile", profileRouter);

serve({
  fetch: app.fetch,
  port: 3000,
});
