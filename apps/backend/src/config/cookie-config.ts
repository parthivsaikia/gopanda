import { Env, env } from "./env-config.js";

export const COOKIE_NAME = "session";

export const DOMAIN = env === Env.PROD ? "yourdomain.com" : undefined;
export const ORIGIN =
  env === Env.PROD ? "https://yourdomain.com" : "http://localhost:5173";
