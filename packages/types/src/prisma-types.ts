import type {
  Prisma as PrismaNamespaceFromDb, // The entire Prisma namespace
  User as UserTypeFromDb, // The User model type
  Session as SessionTypeFromDb,
  UserRole as UserRoleTypeFromDb,
  OfferedTour as OfferedTourTypeFromDb,
  DayPlan as DayPlanTypeFromDb,
  // ... import other re-exported model types from @repo/db
} from "@repo/db";

// Option 1: Re-export individual model types directly
// This allows consumers to do `import { User, Todo } from '@repo/types';`
export type User = UserTypeFromDb;
export type Session = SessionTypeFromDb;
export type UserRole = UserRoleTypeFromDb;
export type OfferedTour = OfferedTourTypeFromDb;
export type DayPlan = DayPlanTypeFromDb;
