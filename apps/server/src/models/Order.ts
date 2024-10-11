import { Schema, model } from 'mongoose';
import { GroceryPurchase } from './Cart';
import { OrderStatus, PaymentStatus } from '@ecom/mern-shared';
import { PurchaseDetails } from '@/routes/checkout/types';

const PaymentSchema = new Schema(
  {
    amount: Number,
    currency: {
      type: String,
      default: 'INR',
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<PurchaseDetails>(
  {
    _id: Schema.Types.UUID,
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    payment: PaymentSchema,
    products: [GroceryPurchase],
    deliveryAddressId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    order_status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    payment_status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Pending,
    },
    razorpay_order_id: {
      type: String,
    },
    payment_id: {
      type: String,
    },
    fromCart: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = model('order', OrderSchema);

export default OrderModel;
