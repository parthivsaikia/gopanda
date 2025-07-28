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
export async function userExists(
  username?: string,
  email?: string,
  mobileNumber?: string,
) {
  try {
    const whereCondition: { OR: Array<Record<string, { equals: string }>> } = {
      OR: [],
    };
    if (username) {
      whereCondition.OR.push({ username: { equals: username } });
    }
    if (email) {
      whereCondition.OR.push({ email: { equals: email } });
    }
    if (mobileNumber) {
      whereCondition.OR.push({ mobileNumber: { equals: mobileNumber } });
    }
    const person = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
      },
    });
    return person.length > 0;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching users in userExists function: ${error.message}`
        : `unknown error in userExists function`;
    throw new Error(errorMsg);
  }
}
