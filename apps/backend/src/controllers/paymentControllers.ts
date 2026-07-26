import {
  createOrderAction,
  fetchOrder,
  paymentFailedAction,
  validateWebhook,
  verifyPaymentAction,
} from "../actions/paymentActions.js";
import { deepConvertBigIntToString } from "../utils/types/bigIntToString.js";
import { paymentSuccessfulAction } from "../actions/paymentActions.js";

import type { Context } from "hono";
import { rzpWebhookSecret } from "../config/config.js";

export const createOrder = async (c: Context) => {
  try {
    const { amount, currency, bookingId } = await c.req.json();
    let numAmount = amount;
    const order = await createOrderAction({
      amount: numAmount,
      currency: "INR",
      id: "",
    });
    return c.json(deepConvertBigIntToString(order));
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in creating order controller: ${error.message}`
        : `unknown error in creating order in controller `;
    throw new Error(errorMsg);
  }
};

export const verifyPaymentController = async (c: Context) => {
  try {
    const { orderId, signature, paymentId } = await c.req.json();
    const verified = verifyPaymentAction({
      order_id: orderId,
      signature,
      payment_id: paymentId,
    });
    return c.json({ payment_verfied: verified });
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in verifying payment: ${error.message}`
        : `unknown error in verifying payment`;
    throw new Error(errorMsg);
  }
};

export const handleWebhookController = async (c: Context) => {
  try {
    console.log("webhook endpoint");
    const webhookSecret = rzpWebhookSecret;
    if (!webhookSecret) {
      throw new Error("Webhook secret not provided.");
    }
    const signature = c.req.header("x-razorpay-signature");
    if (!signature) {
      console.log("failed");
      return c.json({ error: "Signature missing" }, 400);
    }
    const webHookBody = await c.req.text();
    const validated = validateWebhook({
      webHookBody: webHookBody,
      webHookSignature: signature,
      webHookSecret: webhookSecret,
    });
    if (!validated) {
      console.log("validation failed");
      return c.json({ error: "Webhook not validated" });
    }
    const jsonWebHookBody = JSON.parse(webHookBody);
    const event = jsonWebHookBody.event;
    const orderId = jsonWebHookBody.payload.payment.entity.order_id;
    const order = await fetchOrder({ orderId });
    const bookingId = BigInt(order.receipt.replace("booking_", ""));
    const method = jsonWebHookBody.payload.payment.entity.method;
    const currency = jsonWebHookBody.payload.payment.entity.currency;
    const amount = jsonWebHookBody.payload.payment.entity.amount / 100;
    const paymentId = jsonWebHookBody.payload.payment.entity.id;
    const bank = jsonWebHookBody.payload.payment.entity.bank;
    const email = jsonWebHookBody.payload.payment.entity.email;
    const contact = jsonWebHookBody.payload.payment.entity.contact;
    const acquirerData = jsonWebHookBody.payload.payment.entity.acquirer_data;
    const providerCreatedAt = jsonWebHookBody.payload.payment.entity.created_at;
    switch (event) {
      case "payment.authorized":
        console.log(jsonWebHookBody);
        break;
      case "payment.captured":
        await paymentSuccessfulAction({
          bookingId,
          method,
          currency,
          amount,
          providerOrderId: orderId,
          providerPaymentId: paymentId,
          metaData: {
            event: "payment.captured",
            method,
            bank,
            acquirerData,
            email,
            contact,
            providerCreatedAt,
          },
        });
        break;
      case "payment.failed":
        await paymentFailedAction({
          bookingId,
          method,
          currency,
          amount,
          providerOrderId: orderId,
          providerPaymentId: paymentId,
          metaData: {
            event: "payment.failed",
            error: {
              description:
                jsonWebHookBody.payload.payment.entity.error_description,
              reason: jsonWebHookBody.payload.payment.entity.error_reason,
              step: jsonWebHookBody.payload.payment.entity.error_step,
              source: jsonWebHookBody.payload.payment.entity.error_source,
              code: jsonWebHookBody.payload.payment.entity.error_code,
            },
            email,
            contact,
            providerCreatedAt,
          },
          failureReason: jsonWebHookBody.payload.payment.entity.error_reason,
        });
        break;
    }

    return c.json({ body: c.body });
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in handling webhook by me: ${error.message}`
        : `unknown error in handling webhook`;
    throw new Error(errorMsg);
  }
};
