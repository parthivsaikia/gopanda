// packages/db/src/index.ts
import {
  PrismaClient as PrismaClientGenerated,
  Prisma as PrismaNamespaceGenerated, // The namespace containing all Prisma utility types, model types, etc.
  type User as PrismaUserGenerated, // Individually exporting the User model type
  type Session as PrismaSessionGenerated,
  type UserRole as PrismaUserRoleGenerated,
  type OfferedTour as PrismaOfferedTourGenerated,
  type DayPlan as PrismaDayPlanGenerated,
  type Booking as PrismaBookingGenerated,
  type BookingStatus as PrismaBookingStatusGenerated,
  type PaymentStatus as PrismaPaymentStatus,
  type Payment as PrismaPayment,
  // ... import other model types you want to explicitly re-export by name
} from "../generated/prisma/index.js"; // Your custom output path

const prismaInstance: PrismaClientGenerated = new PrismaClientGenerated({});

export {
  PrismaClientGenerated as PrismaClient, // Export the class type
  PrismaNamespaceGenerated as Prisma, // Export the entire Prisma namespace
  type PrismaUserGenerated as User, // Re-export the User model type under the name 'User'
  // ... re-export other model types
  type PrismaSessionGenerated as Session,
  type PrismaUserRoleGenerated as UserRole,
  type PrismaOfferedTourGenerated as OfferedTour,
  type PrismaDayPlanGenerated as DayPlan,
  type PrismaBookingGenerated as Booking,
  type PrismaBookingStatusGenerated as BookingStatus,
  type PrismaPaymentStatus as PaymentStatus,
  type PrismaPayment as Payment,
};
export default prismaInstance; // Export the runtime client instance
