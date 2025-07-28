import { type } from "arktype";
import type { Session, User } from "@repo/db";
import type { Context, Next } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import prisma from "@repo/db";
import { comparePassword, hashPassword } from "../actions/bcryptActions.js";
import { createUser, getUser, userExists } from "../actions/userActions.js";
import {
  createSession,
  generateSessionToken,
  invalidateAllSessions,
  invalidateSession,
} from "../auth/session-api.js";
import { COOKIE_NAME, DOMAIN } from "../config/cookie-config.js";
import { Env, env } from "../config/env-config.js";
import { LoginInputUserDTOSchema, UserInputUserDTOSchema } from "@repo/types";

export const signup = async (c: Context, next: Next) => {
  const {
    username,
    name,
    password,
    mobileNumber,
    email,
    role,
    state,
    country,
  } = await c.req.json();
  try {
    const userCreateData = UserInputUserDTOSchema({
      name,
      username,
      password,
      mobileNumber,
      email,
      state,
      country,
      role,
    });
    if (userCreateData instanceof type.errors) {
      throw new Error(userCreateData.summary);
    }
    const existingUser = await userExists(userCreateData.username);
    if (existingUser) {
      console.log("User already exist");
      return c.json({ error: "User already exists" }, 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({
      ...userCreateData,
      password: passwordHash,
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
    const userLoginData = LoginInputUserDTOSchema({ username, password });
    if (userLoginData instanceof type.errors) {
      throw new Error(userLoginData.summary);
    }
    const user = await prisma.user.findUnique({
      where: { username: userLoginData.username },
    });
    if (!user) {
      console.log("user not found");
      return c.json({ error: "Invalid Credentials" }, 401);
    }
    const passwordValid = await comparePassword(
      userLoginData.password,
      user.password,
    );
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
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error at login: ${error.message}`
        : `unknown error at login`;
    throw new Error(errorMsg);
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

export const loggedInUser = async (c: Context) => {
  try {
    const user = c.get("user");
    const session = c.get("session");
    if (user && session) {
      return c.json({
        userId: String(user.id),
        csrfToken: session.csrfToken,
      });
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error at fetching loggedInUser: ${error.message}`
        : `unknown error at fetching logged in user`;
    throw new Error(errorMsg);
  }
};
