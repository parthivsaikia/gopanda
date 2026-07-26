import { serve } from "@hono/node-server";
import { authenticateWebSocketConnection } from "./utils/middlewares.js";
import userRouter from "./routes/userRoutes.js";
import placeImageRouter from "./routes/placeImageRoutes.js";
import type { Context } from "hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import "./utils/types/honoContextType";
import authRouter from "./routes/authRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import { logger } from "hono/logger";
import tourRouter from "./routes/tourRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import { createNodeWebSocket } from "@hono/node-ws";
import { authMiddleware } from "../dist/utils/middlewares.js";
import type { WSContext } from "hono/ws";
import type { Booking } from "@repo/types";
import { deepConvertBigIntToString } from "../dist/utils/types/bigIntToString.js";

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.use(logger());
app.use(
  "*",

  cors({
    origin: [
      "http://localhost:5173", // <<< YOUR FRONTEND ORIGIN
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

app.get("/", (c: Context) => {
  return c.json({ hi: "mom" });
});

app.route("/auth", authRouter);
app.route("/payment", paymentRouter);
app.route("/profile", profileRouter);
app.route("/bookings", bookingRouter);
app.route("/tours", tourRouter);
app.route("/placeImage", placeImageRouter);
app.route("/users", userRouter);

const onlineUsersMap = new Map<bigint, WSContext<unknown>>();

app.get(
  "/bookingRequest",
  upgradeWebSocket(async (c) => {
    let user, session;

    try {
      const auth = await authenticateWebSocketConnection(c);
      user = auth.user;
      session = auth.session;
    } catch (error) {
      console.log("WebSocket auth failed:", error);
      return {
        onOpen: (_, ws) => {
          ws.close(1008, "Unauthorized");
        },
      };
    }

    const userId = user.id;

    return {
      onOpen: (_, ws) => {
        onlineUsersMap.set(userId, ws);
        console.log("Agent has joined:", userId);
        console.log("Map now contains:", Array.from(onlineUsersMap.keys()));
      },
      onMessage: (event, ws) => {
        console.log(`Message from user ${userId}:`, event.data);
        ws.send("Hello from server!");
      },
      onClose: () => {
        onlineUsersMap.delete(userId);
        console.log("Agent disconnected:", userId);
        console.log("Map now contains:", Array.from(onlineUsersMap.keys()));
      },
    };
  }),
);
app.get(
  "/test-ws",
  upgradeWebSocket((c) => {
    return {
      onOpen: (_, ws) => {
        console.log("TEST: WebSocket opened");
        ws.send("Test connection successful");
      },
      onMessage: (event, ws) => {
        console.log("TEST: Received:", event.data);
      },
      onClose: () => {
        console.log("TEST: WebSocket closed");
      },
    };
  }),
);

export const sendBookingRequest = ({
  agentId,
  booking,
}: {
  agentId: bigint;
  booking: Booking;
}) => {
  try {
    const agentConnection = onlineUsersMap.get(agentId);

    console.log("Attempting to send booking request to agent:", agentId);
    console.log("Agent connection exists:", !!agentConnection);

    if (agentConnection) {
      console.log("Agent connection ready state:", agentConnection.readyState);

      // WSContext readyState values:
      // 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED
      if (agentConnection.readyState === 1) {
        console.log("Agent is online, sending booking request");
        agentConnection.send(
          JSON.stringify({
            type: "new_booking",
            payload: deepConvertBigIntToString(booking),
          }),
        );
      } else {
        console.log(
          "Agent is offline (readyState:",
          agentConnection.readyState,
          ")",
        );
      }
    } else {
      console.log("Agent connection not found in map");
      console.log("Online users:", Array.from(onlineUsersMap.keys()));
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in sending booking request through websocket: ${error.message}`
        : `unknown error in sending booking reqeust through websocket`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
};
const server = serve({
  fetch: app.fetch,
  port: 3000,
});

injectWebSocket(server);

console.log("Server with WebSocket support is running on port 3000");
