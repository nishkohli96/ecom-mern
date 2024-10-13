import { UserAddress } from './address';
import { CartProduct } from './cart';
import { GroceryItem } from './grocery';

export enum OrderStatus {
  Created = 'created',
  Cancelled = 'cancelled',
  Processing = 'processing',
  InTransit = 'in-transit',
  Delivered = 'delivered'
}

export enum PaymentStatus {
  Pending = 'pending',
  Failed = 'failed',
  Paid = 'paid',
  Refunded = 'refunded'
}

export type Payment = {
  amount: number;
  currency: string;
};

export interface PurchaseOrderInfo {
  _id: string;
  payment: Payment;
  products: CartProduct[];
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_id: string;
  razorpay_order_id: string;
  fromCart: boolean;
}

export interface PurchaseOrder extends PurchaseOrderInfo {
  customerId: string;
  deliveryAddressId: string;
}

export type CreateOrderResponse = {
  orderId: string;
  razorpay_customer_id: string;
};

export type OrdersListItem = {
  _id: string;
  createdAt: string;
  order_status: OrderStatus;
  payment_status: Payment;
  payment: Payment;
  products: Array<Pick<GroceryItem, 'product_name' | 'image_url'>>;
};

export type CompleteOrdersDetail = {
  _id: string;
  createdAt: string;
  order_status: OrderStatus;
  payment_status: Payment;
  payment: Payment;
  razorpay_order_id: string;
  deliveryAddress: Omit<UserAddress, 'isDefault'>;
  products: Array<
    Pick<
      GroceryItem,
      | '_id'
      | 'product_name'
      | 'brand'
      | 'image_url'
      | 'discount_price'
      | 'quantity'
      | 'handle'
    > & { num_items: number }
  >;
};
