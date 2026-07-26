import prismaInstance from "@repo/db";
import type { Persons, PrismaClient } from "@repo/types";
import type { BookingStatus } from "@repo/db";
import { Prisma } from "@repo/db";
import {
  createRefundAction,
  getPaymentById,
  rzpRefundAction,
} from "./paymentActions.js";
import { getTourByIdAction } from "./tourActions.js";
import { Decimal } from "../../../../packages/db/generated/prisma/runtime/library.js";

export const initialBookingAction = async ({
  userId,
  tourId,
  persons,
}: {
  userId: string;
  tourId: string;
  persons: Persons[];
}) => {
  const booking = await prismaInstance.booking.create({
    data: {
      customerId: BigInt(userId),
      tourId: BigInt(tourId),
      status: "Pending",
      persons: {
        create: persons.map((person) => {
          const name = person.name;
          const age = person.age;
          const proofUrl = person.proofUrl;
          return { name, age, proofUrl };
        }),
      },
    },
  });
  return booking;
};

export const updateBookingAction = async (
  tx: PrismaClient,
  status: BookingStatus,
  bookingId: bigint,
  paymentId?: bigint,
) => {
  try {
    console.log(status);
    console.log(bookingId);
    console.log(paymentId);
    const booking = await tx.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: status,
        paymentId,
      },
    });
    return booking;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in update booking action: ${error.message}`
        : `unknown error in update booking action`;
    throw new Error(errorMsg);
  }
};

export const getAllBookingsOfCustomerAction = async (customerId: bigint) => {
  if (!customerId) {
    throw new Error("Customer id not provided");
  }
  try {
    const allBookings = await prismaInstance.booking.findMany({
      where: {
        customerId: BigInt(customerId),
      },
    });
    return allBookings;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in get all bookings action: ${error.message}`
        : `unknown error in getting all bookings action`;
    throw new Error(errorMsg);
  }
};

export const getBookingByIdAction = async (bookingId: string) => {
  if (!bookingId) {
    throw new Error("Booking id not provided.");
  }
  try {
    const booking = await prismaInstance.booking.findUnique({
      where: {
        id: BigInt(bookingId),
      },
    });
    return booking;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching booking by id: ${error.message}`
        : `unknown error in fetching booking by id`;
    throw new Error(errorMsg);
  }
};

export const cancelBookingAction = async (bookingId: string) => {
  try {
    // Get booking with all related data
    const booking = await prismaInstance.booking.findUnique({
      where: { id: BigInt(bookingId) },
      include: {
        tour: true,
        payment: {
          include: {
            PaymentTransaction: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === "Cancelled") {
      throw new Error("Booking already cancelled");
    }

    // Check if tour exists and get start date
    if (!booking.tour) {
      throw new Error("Tour information not found");
    }

    const tourStartDate = new Date(booking.tour.startDate);

    // Case 1: No payment associated - just cancel the booking
    if (!booking.payment) {
      await prismaInstance.booking.update({
        where: { id: BigInt(bookingId) },
        data: {
          status: "Cancelled",
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        refundId: null,
        refundAmount: new Prisma.Decimal(0),
        message: "Booking cancelled (no payment to refund)",
      };
    }

    // Case 2: Payment failed - just cancel the booking
    if (booking.payment.status === "Failure") {
      await prismaInstance.booking.update({
        where: { id: BigInt(bookingId) },
        data: {
          status: "Cancelled",
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        refundId: null,
        refundAmount: new Prisma.Decimal(0),
        message: "Booking cancelled (payment had failed)",
      };
    }

    // Case 3: Successful payment - handle refund logic
    if (booking.payment.status !== "Success") {
      throw new Error(
        `Cannot cancel booking with payment status: ${booking.payment.status}`,
      );
    }

    // Calculate refund amount based on cancellation policy
    const hoursUntilTour =
      (tourStartDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    const refundableAmount =
      hoursUntilTour > 24 ? booking.payment.amount : new Prisma.Decimal(0);

    // Get the payment transaction (should only be one for a successful payment)
    const paymentTransaction = booking.payment.PaymentTransaction.find(
      (tx) => tx.provider === "Razorpay" || tx.provider === "Stripe",
    );

    if (!paymentTransaction && refundableAmount.gt(0)) {
      throw new Error("Payment transaction not found - cannot process refund");
    }

    // Execute cancellation in transaction
    const cancelBookingResult = await prismaInstance.$transaction(
      async (tx) => {
        // Update booking status
        await tx.booking.update({
          where: { id: BigInt(bookingId) },
          data: {
            status: "Cancelled",
            updatedAt: new Date(),
          },
        });

        // Create refund record
        const refund = await tx.refund.create({
          data: {
            amount: refundableAmount,
            reason: "Booking Cancelled",
            refundStatus: "Pending", // Always start as Pending, update later if needed
            providerRefundId: `temp_${Date.now()}`, // Temporary ID, will be updated
            paymentTransactionId: paymentTransaction!.id,
            metaData: {
              bookingId: bookingId,
              cancellationPolicy:
                hoursUntilTour > 24 ? "full_refund" : "no_refund",
              hoursUntilTour: Math.floor(hoursUntilTour),
              originalAmount: booking.payment!.amount.toString(),
              createdAt: new Date().toISOString(),
            },
          },
        });

        return {
          refund,
          paymentTransaction,
        };
      },
    );

    // Process external refund if amount > 0
    if (refundableAmount.gt(0) && paymentTransaction) {
      try {
        // Call external refund API
        const providerRefund = await rzpRefundAction({
          paymentId: paymentTransaction.providerPaymentId,
          amount: Number(refundableAmount),
        });

        // Update refund record with provider response
        await prismaInstance.refund.update({
          where: { id: cancelBookingResult.refund.id },
          data: {
            providerRefundId: providerRefund.id,
            refundStatus: "Completed",
            metaData: {
              ...(cancelBookingResult.refund.metaData as object),
              providerResponse: JSON.parse(JSON.stringify(providerRefund)),
              processedAt: new Date().toISOString(),
            },
          },
        });

        return {
          success: true,
          refundId: cancelBookingResult.refund.id,
          refundAmount: refundableAmount,
          message: "Booking cancelled with refund processed",
        };
      } catch (refundError) {
        // Mark refund as failed
        await prismaInstance.refund.update({
          where: { id: cancelBookingResult.refund.id },
          data: {
            refundStatus: "Failed",
            metaData: {
              ...(cancelBookingResult.refund.metaData as object),
              error:
                refundError instanceof Error
                  ? refundError.message
                  : "Unknown refund error",
              failedAt: new Date().toISOString(),
            },
          },
        });

        throw new Error(
          `Booking cancelled but refund failed: ${
            refundError instanceof Error ? refundError.message : "Unknown error"
          }`,
        );
      }
    }

    // For zero amount refunds, update status to Not_Required
    if (refundableAmount.eq(0)) {
      await prismaInstance.refund.update({
        where: { id: cancelBookingResult.refund.id },
        data: {
          refundStatus: "Not_Required",
          metaData: {
            ...(cancelBookingResult.refund.metaData as object),
            reason: "No refund due to cancellation policy",
            processedAt: new Date().toISOString(),
          },
        },
      });
    }

    return {
      success: true,
      refundId: cancelBookingResult.refund.id,
      refundAmount: refundableAmount,
      message: refundableAmount.gt(0)
        ? "Booking cancelled with refund"
        : "Booking cancelled (no refund due to cancellation policy)",
    };
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `Error cancelling booking: ${error.message}`
        : "Unknown error occurred while cancelling booking";

    console.error("Cancel booking error:", error);
    throw new Error(errorMsg);
  }
};

export const getBookingRequestAction = async ({
  agentId,
}: {
  agentId: bigint;
}) => {
  const requestedBookings = await prismaInstance.booking.findMany({
    where: {
      status: "Pending",
      tour: {
        agentId: BigInt(agentId),
      },
    },
    // We are replacing 'include' and 'omit' with 'select'
    select: {
      // --- Explicitly list the scalar fields you want ---
      // We are omitting id and customerId by simply not listing them.
      status: true,
      id: true,
      tourId: true,
      createdAt: true, // <-- The field in question
      updatedAt: true,
      paymentId: true,

      // --- Now, move everything from your 'include' block inside 'select' ---
      persons: {
        select: {
          name: true,
          age: true,
        },
      },
      customer: {
        select: { name: true },
      },
      tour: {
        select: { title: true },
      },
      _count: {
        select: { persons: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const requestedBookingsWithDate = requestedBookings.map((booking) => {
    return {
      ...booking,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  });
  return requestedBookingsWithDate;
};
