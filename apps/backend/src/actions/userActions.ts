import prisma from "@repo/db";
import type { UserInputUserDTO } from "@repo/types";
export const createUser = async (data: UserInputUserDTO) => {
  try {
    const user = await prisma.user.create({
      data,
      omit: { password: true },
    });
    return user;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `Error in creating user: ${error.message}`
        : `Unknown error in creating user.`;
    throw new Error(errorMessage);
  }
};

export const getUser = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      omit: { password: true },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `Error in finding user ${username} : ${error.message}`
        : `Unknown error in finding user ${username}`;
    throw new Error(errorMessage);
  }
};
