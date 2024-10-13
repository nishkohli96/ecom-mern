import { RazorPayOrder } from '@ecom-mern/shared';

export type CustomerIdParams = {
  customerId: string;
};

export type OrderIdParams = {
  orderId: string;
};

export type CreateOrderResponse = RazorPayOrder & { orderId: string };

export type UpdateRzpEntityNotes = Record<string, string | number | null>;

export type PaymentIdParams = {
  paymentId: string;
};

export interface PaymentDetails {
  amount: number;
}

/* Full refund if amount param isn't passed, else partial refund */
export interface PaymentRefund {
  amount?: number;
}

export type RefundIdParams = {
  refundId: string;
};
