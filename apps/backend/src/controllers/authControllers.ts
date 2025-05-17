import { type } from "arktype";
import type { Session, User } from "@repo/db";
import type { Context, Next } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import prisma from "@repo/db";
import { comparePassword, hashPassword } from "../actions/bcryptActions.js";
import { createUser, getUser } from "../actions/userActions.js";
import {
  createSession,
  generateSessionToken,
  invalidateAllSessions,
  invalidateSession,
} from "../auth/session-api.js";
import { COOKIE_NAME, DOMAIN } from "../config/cookie-config.js";
import { Env, env } from "../config/env-config.js";
import type { LoginInputUserDTO, UserInputUserDTO } from "@repo/types";
import { LoginInputUserDTOSchema, UserInputUserDTOSchema } from "@repo/types";

export const signup = async (c: Context, next: Next) => {
  const {
    name,
    username,
    password,
    state,
    country,
    mobileNumber,
    email,
    role,
  } = await c.req.json();
  const data = UserInputUserDTOSchema({
    name,
    username,
    password,
    email,
    mobileNumber,
    state,
    country,
    role,
  });
  try {
    const existingUser = await getUser(username);
    if (existingUser) {
      return c.json({ error: "User already exists" }, 409);
    }
    if (data instanceof type.errors) {
      return c.json({ error: data.summary }, 500);
    }
    const passwordHash = await hashPassword(password);
    const user = await createUser({
      username,
      password: passwordHash,
      name,
      state,
      country,
      email,
      role,
      mobileNumber,
    });
    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    setCookie(c, COOKIE_NAME, token, {
      httpOnly: true,
      secure: env === Env.PROD,
      sameSite: "Lax",
      path: "/",
      expires: session.expiresAt,
    });
    return c.json(
      {
        success: true,
        id: user.id.toString(),
        username: user.username,
        role: user.role,
        csrfToken: session.csrfToken,
      },
      201,
    );
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error at signup: ${error.message}`
        : `unknown error at signup`;
    throw new Error(errorMsg);
  }
};

export const login = async (c: Context, next: Next) => {
  try {
    const { username, password } = await c.req.json();
    const loginData = LoginInputUserDTOSchema({
      username,
      password,
    });
    if (loginData instanceof type.errors) {
      return c.json({ error: loginData.summary });
    }
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return c.json({ error: "Invalid Credentials" }, 401);
    }
    const passwordValid = await comparePassword(password, user.password);
    if (!passwordValid) {
      return c.json({ error: "Invalid Credentials" }, 401);
    }
    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    setCookie(c, COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      secure: env === Env.PROD,
      sameSite: "Lax",
      expires: session.expiresAt,
    });
    return c.json({
      success: true,
      id: user.id.toString(),
      username: user.username,
      csrfToken: session.csrfToken,
    });
  } catch (error) {
    await next();
  }
};

export const logout = async (c: Context, next: Next) => {
  try {
    const session = c.get("session") as Session;
    if (session) {
      await invalidateSession(session.id);
      deleteCookie(c, COOKIE_NAME, {
        path: "/",
        domain: DOMAIN,
        secure: env === Env.PROD,
      });
    }
    return c.json({ success: true });
  } catch (error) {
    await next();
  }
};

export const logoutAll = async (c: Context, next: Next) => {
  try {
    const user = c.get("user");
    if (user) {
      await invalidateAllSessions(user.id);
      deleteCookie(c, COOKIE_NAME, {
        path: "/",
        secure: env === Env.PROD,
        domain: DOMAIN,
      });
    }
    return c.json({ success: true });
  } catch (error) {
    await next();
  }
};
