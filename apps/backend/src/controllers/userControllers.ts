import { userExists } from "../actions/userActions.js";
import type { Context } from "hono";

export async function userCheck(c: Context) {
  try {
    const { username, email, mobileNumber } = await c.req.json();
    const doesUserExists = await userExists(username, email, mobileNumber);
    return c.json({ exists: doesUserExists });
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in checking if userExists: ${error.message}`
        : `unknown error in checking if user exists`;
    throw new Error(errorMsg);
  }
}
