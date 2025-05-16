import { createMiddleware } from "hono/factory";
import { timingSafeEqual } from "node:crypto";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { COOKIE_NAME, DOMAIN, ORIGIN } from "../config/cookie-config.js";
import { validateSession } from "../auth/session-api.js";
import { Env, env } from "../config/env-config.js";
import type { Session } from "@repo/db";

export const authMiddleware = createMiddleware(async (c, next) => {
  const token = getCookie(c, COOKIE_NAME);
  if (!token) {
    console.warn("token in cookie not found.");
    return c.json({ error: "Unauthorized" }, 403);
  }
  const { user, session } = await validateSession(token);
  if (!user || !session) {
    deleteCookie(c, COOKIE_NAME, {
      path: "/",
      secure: env === Env.PROD,
      domain: DOMAIN,
    });
    return c.json({ error: "Unauthorized" }, 403);
  }
  if (Date.now() > session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    setCookie(c, COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      secure: env === Env.PROD,
      sameSite: "Lax",
      expires: session.expiresAt,
    });
  }
  c.set("user", user);
  c.set("session", session);
  await next();
});

export const csrfMiddleware = createMiddleware(async (c, next) => {
  try {
    if (c.req.method !== "GET") {
      const origin = c.req.header("Origin");
      if (origin === null || origin !== ORIGIN) {
        return c.json({ error: "Unauthorized" }, 403);
      }
    }
    const clientCsrfToken = c.req.header("X-CSRF-TOKEN");
    if (!clientCsrfToken) {
      console.warn("clientCsrf Token not found");
      return c.json({ error: "Unauthorized" }, 403);
    }
    const session = c.get("session") as Session;
    if (!session) {
      return c.json({ error: "Session not found" }, 403);
    }
    const csrfToken = session.csrfToken;
    if (!csrfToken) {
      console.warn("csrfToken in session not found.");
      return c.json({ error: "Unauthorized" }, 403);
    }
    let tokenMatch = false;
    if (clientCsrfToken && clientCsrfToken.length === csrfToken.length) {
      tokenMatch = timingSafeEqual(
        Buffer.from(clientCsrfToken, "utf8"),
        Buffer.from(csrfToken, "utf8"),
      );
    }
    if (!tokenMatch) {
      console.warn("csrfTokens doesn't match.");
      return c.json({ error: "Unauthorized" }, 403);
    }
    await next();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `error in csrf middleware: ${error.message}`
        : `unknown error in csrf middleware.`;
    throw new Error(errorMessage);
  }
});
