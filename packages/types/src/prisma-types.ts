import type {
  Prisma as PrismaNamespaceFromDb, // The entire Prisma namespace
  User as UserTypeFromDb, // The User model type
  Session as SessionTypeFromDb,
  UserRole as UserRoleTypeFromDb,
  OfferedTour as OfferedTourTypeFromDb,
  DayPlan as DayPlanTypeFromDb,
  Booking as BookingTypeFromDb,
  BookingStatus as BookingStatusFromDb,
  PrismaClient as PrismaClientDb,
  PaymentStatus as PaymentStatusDb,
  Payment as PaymentDb,
  // ... import other re-exported model types from @repo/db
} from "@repo/db";

// Option 1: Re-export individual model types directly
// This allows consumers to do `import { User, Todo } from '@repo/types';`
export type User = UserTypeFromDb;
export type Session = SessionTypeFromDb;
export type UserRole = UserRoleTypeFromDb;
export type OfferedTour = OfferedTourTypeFromDb;
export type DayPlan = DayPlanTypeFromDb;
export type Booking = BookingTypeFromDb;
export type BookingStatus = BookingStatusFromDb;
export type PrismaClient = PrismaClientDb;
export type PaymentStatus = PaymentStatusDb;
export type Payment = PaymentDb;
