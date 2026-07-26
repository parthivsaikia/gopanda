import Razorpay from "razorpay";
import {
  validatePaymentVerification,
  validateWebhookSignature,
} from "razorpay/dist/utils/razorpay-utils.js";
import type { PrismaClient } from "@repo/types";
import { v4 as uuidv4 } from "uuid";
import { rzpKeyId, rzpKeySecret } from "../config/config.js";
import prismaInstance from "@repo/db";
import type { PaymentStatus, Prisma } from "@repo/db";
import type { PaymentMetaData } from "@repo/types";
import { updateBookingAction } from "./bookingActions.js";
import type { RefundStatus } from "../../../../packages/db/generated/prisma/index.js";
import { sendBookingRequest } from "../index.js";
import { getTourByIdAction } from "./tourActions.js";

export const initialiseRzpInstance = () => {
  const rzpInstance = new Razorpay({
    key_id: rzpKeyId,
    key_secret: rzpKeySecret,
  });
  return rzpInstance;
};

export const createOrderAction = async ({
  amount,
  currency,
  id,
}: {
  amount: string;
  currency: string;
  id: string;
}) => {
  try {
    const rzpInstance = initialiseRzpInstance();
    const orderData = await rzpInstance.orders.create({
      amount: Number(amount),
      currency: currency,
      receipt: `booking_${id}` || uuidv4(),
    });
    return orderData;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in creating razorpay order: ${error.message}`
        : `unknown error in creating razorpay order`;
    throw new Error(errorMsg);
  }
};

export const verifyPaymentAction = ({
  order_id,
  payment_id,
  signature,
}: {
  order_id: string;
  payment_id: string;
  signature: string;
}) => {
  const verified = validatePaymentVerification(
    {
      order_id,
      payment_id: payment_id,
    },
    signature,
    rzpKeySecret as string,
  );
  return verified;
};

export const validateWebhook = ({
  webHookBody,
  webHookSignature,
  webHookSecret,
}: {
  webHookBody: any;
  webHookSignature: string;
  webHookSecret: string;
}) => {
  try {
    if (!webHookSecret || !webHookBody || !webHookSignature) {
      console.log(webHookBody, webHookSignature, webHookSecret);
      console.log("something not present");
      throw new Error(
        "Webhook signature or webhook secret or webhook body is missing.",
      );
    }
    const validated = validateWebhookSignature(
      webHookBody,
      webHookSignature,
      webHookSecret,
    );
    return validated;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in validating webhook: ${error.message}`
        : `unknown error in validating webhook`;
    throw new Error(errorMsg);
  }
};

export const createPaymentAction = async ({
  method,
  status,
  currency,
  failureReason,
  amount,
  metaData,
  providerOrderId,
  providerPaymentId,
}: {
  method: string;
  status: PaymentStatus;
  currency: string;
  failureReason: string;
  amount: number;
  bookingId: bigint;
  providerPaymentId: string;
  providerOrderId: string;
  metaData: PaymentMetaData;
}) => {
  const payment = await prismaInstance.payment.create({
    data: {
      method,
      status,
      currency,
      failureReason,
      amount,
      transactionId: `TXN-${uuidv4()}`,
      PaymentTransaction: {
        create: {
          metaData: metaData as unknown as Prisma.InputJsonValue,
          providerPaymentId: providerPaymentId,
          providerOrderId: providerOrderId,
        },
      },
    },
  });
  console.log("Payment created successfully");
  return payment;
};

export const paymentSuccessfulAction = async (paymentData: {
  bookingId: bigint;
  method: string;
  currency: string;
  amount: number;
  metaData: PaymentMetaData;
  providerPaymentId: string;
  providerOrderId: string;
}) => {
  const {
    bookingId,
    method,
    currency,
    amount,
    metaData,
    providerPaymentId,
    providerOrderId,
  } = paymentData;
  try {
    const payment = await createPaymentAction({
      bookingId,
      metaData,
      method,
      status: "Success",
      amount,
      providerOrderId,
      providerPaymentId,
      failureReason: "",
      currency,
    });
    const booking = await updateBookingAction(
      prismaInstance,
      "Pending",
      bookingId,
      payment.id,
    );
    const tour = await getTourByIdAction(booking.tourId);
    const agentId = tour.agentId;
    if (!agentId) {
      throw new Error("agentId not found");
    }
    sendBookingRequest({ agentId, booking });
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in payment successful action: ${error.message}`
        : `unknown error in payment succesful action`;
    throw new Error(errorMsg);
  }
};

export const paymentFailedAction = async (paymentData: {
  bookingId: bigint;
  method: string;
  currency: string;
  amount: number;
  metaData: PaymentMetaData;
  providerPaymentId: string;
  providerOrderId: string;
  failureReason: string;
}) => {
  try {
    const {
      bookingId,
      method,
      currency,
      amount,
      metaData,
      providerPaymentId,
      providerOrderId,
      failureReason,
    } = paymentData;
    const payment = await createPaymentAction({
      bookingId,
      metaData,
      method,
      status: "Failure",
      amount,
      providerOrderId,
      providerPaymentId,
      failureReason,
      currency,
    });
    const booking = await updateBookingAction(
      prismaInstance,
      "Pending",
      bookingId,
      payment.id,
    );
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in payment failure action: ${error.message}`
        : `unknown error in failure action`;
    throw new Error(errorMsg);
  }
};

export const fetchOrder = async ({ orderId }: { orderId: string }) => {
  try {
    const rzpInstance = initialiseRzpInstance();
    const order = await rzpInstance.orders.fetch(orderId);
    return order;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching order: ${error.message}`
        : `unknown error in fetching order`;
    throw new Error(errorMsg);
  }
};

export const rzpRefundAction = async ({
  paymentId,
  amount,
}: {
  paymentId: string;
  amount: number;
}) => {
  try {
    const rzpInstance = initialiseRzpInstance();
    const refund = await rzpInstance.payments.refund(paymentId, {
      amount: amount,
      speed: "normal",
    });
    return refund;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in refund action: ${error.message}`
        : `unknown error in refund action`;
    throw new Error(errorMsg);
  }
};

export const createRefundAction = async ({
  tx,
  reason,
  status,
  amount,
  paymentTransactionId,
  bookingId,
}: {
  tx: PrismaClient;
  reason: string;
  status: RefundStatus;
  amount: Prisma.Decimal;
  paymentTransactionId: string;
  bookingId: string | bigint;
}) => {
  const refund = await tx.refund.create({
    data: {
      amount,
      reason,
      refundStatus: status,
      providerRefundId: `providerRI-pending-${Date.now()}`,
      paymentTransactionId: BigInt(paymentTransactionId),
      metaData: {
        bookingId: bookingId.toString(),
        cancelledAt: new Date().toISOString(),
      },
    },
  });
  return refund;
};

export const getProviderPaymentIdAction = async (paymentId: string) => {
  try {
    const providerPaymentId = await prismaInstance.paymentTransaction.findMany({
      where: {
        paymentId: BigInt(paymentId),
      },
      select: {
        providerPaymentId: true,
      },
    });
    return providerPaymentId;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching providerPaymentId: ${error.message}`
        : `unknown error in fetching providerPaymentId`;
    throw new Error(errorMsg);
  }
};

export const getPaymentById = async (
  tx: PrismaClient,
  paymentId: bigint | string,
) => {
  paymentId = BigInt(paymentId);
  try {
    const payment = await tx.payment.findUnique({
      where: {
        id: paymentId,
      },
    });
    return payment;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching payment: ${error.message}`
        : `unknown error in fetching payment`;
    throw new Error(errorMsg);
  }
};
