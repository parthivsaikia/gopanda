import type { Context, Next } from "hono";
import prismaInstance from "@repo/db";
import { convertBigIntToString } from "../utils/types/bigIntToString.js";

export const getProfile = async (c: Context) => {
  try {
    const id = BigInt(c.req.param("id"));
    const user = await prismaInstance.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return c.json(convertBigIntToString(user));
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching profile: ${error.message}`
        : `unknown error in fetching profile`;
    throw new Error(errorMsg);
  }
};
