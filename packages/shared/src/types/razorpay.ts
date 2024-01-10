import { CartProduct } from './cart';

export type CreateRazorpayOrder = {
  /* Amount in smallest currency unit */
  amount: number;
  customerId: string;
  deliveryAddressId: string;
  products: CartProduct[];
  /**
   * whether checking out from cart page or directly purchasing
   * an item from grocery page.
   */
  fromCart: boolean;
};

type RazorpayEntityNotes = Record<string, string | number | null>;

export type RazorPayOrder = {
  id: string;
  entity: 'order';
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: 'INR';
  receipt: string;
  offer_id: null;
  status: string;
  attempts: number;
  notes: RazorpayEntityNotes;
  created_at: number;
};

export type RazorPayOrderSuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type RazorpayOrderFailed = {
  error: {
    code: string;
    description: string;
    metadata: {
      payment_id: string;
    };
    reason: string;
    source: string;
    step: string;
  };
};

export type RazorpayModalDismissReason = undefined | 'timeout';

export type RazorpayCustomer = {
  id: string;
  entity: 'customer';
  name: string;
  email: string;
  contact: string;
  gstin: string | null;
  notes: RazorpayEntityNotes;
  created_at: number;
};
