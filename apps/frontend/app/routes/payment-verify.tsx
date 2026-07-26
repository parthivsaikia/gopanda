import type { Route } from "./+types/payment-verify";
import { verifyPayment } from "services/payment-verification";
export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  try {
    const { signature, orderId, paymentId } = await request.json();
    const verified = await verifyPayment({
      orderId,
      paymentId,
      signature,
    });
    console.log(verified);
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in verifying payment clientAction: ${error.message}`
        : `unknown error in verifying payment clientAction`;
    throw new Error(errorMsg);
  }
};
