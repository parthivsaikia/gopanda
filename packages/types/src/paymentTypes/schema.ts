export interface BasePaymentMetaData {
  event: "payment.authorised" | "payment.captured" | "payment.failed";
  email: string;
  contact: string;
  providerCreatedAt: number;
}

export interface SuccessPaymentMetaData extends BasePaymentMetaData {
  event: "payment.captured";
  method: string;
  bank: string;
  acquirerData: {
    bankTransactionId: string;
  };
  fee?: string;
  tax?: string;
}

export interface FailedPaymentMetaData extends BasePaymentMetaData {
  event: "payment.failed";
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
  };
}

export type PaymentMetaData = SuccessPaymentMetaData | FailedPaymentMetaData;
