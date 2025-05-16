import type { User, Session } from "@repo/types";
import prisma from "@repo/db";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

export const generateSessionToken = (): string => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
};

export const generateCsrfToken = (): string => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
};

export const createSession = async (
  token: string,
  userId: bigint,
): Promise<Session> => {
  const csrfToken = generateCsrfToken();
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    csrfToken: csrfToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await prisma.session.create({
    data: session,
  });
  return session;
};

export const validateSession = async (
  token: string,
): Promise<SessionValidationResult> => {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: {
        omit: { password: true },
      },
    },
  });
  if (result === null) {
    return { session: null, user: null };
  }

  const { user, ...session } = result;
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });

    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 15);
    await prisma.session.update({
      where: { id: session.id },
      data: {
        expiresAt: session.expiresAt,
      },
    });
  }
  return { session, user };
};

export const invalidateSession = async (sessionId: string): Promise<void> => {
  await prisma.session.delete({
    where: {
      id: sessionId,
    },
  });
};

export const invalidateAllSessions = async (userId: bigint): Promise<void> => {
  await prisma.session.deleteMany({
    where: {
      userId,
    },
  });
};

export type SessionValidationResult =
  | { session: null; user: null }
  | { session: Session; user: Omit<User, "password"> };
