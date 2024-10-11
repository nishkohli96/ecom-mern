import { Response } from 'express';
import {
  CreateRazorpayOrder,
  CreateOrderResponse,
  OrderStatus,
  PaymentStatus,
  RazorPayOrderSuccess,
} from '@ecom-mern/shared';
import { OrderModel, UserModel } from '@/models';
import { errorLogger } from '@/utils';
import cartService from '@/routes/cart/service';
import groceryService from '@/routes/grocery/service';
import razorpayService from '../razorpay/service';

class CheckoutService {
  async createNewOrder(res: Response, createOrderData: CreateRazorpayOrder) {
    try {
      const { amount, ...otherOrderData } = createOrderData;
      const { orderId, id } = await razorpayService.createNewRazorpayOrder(
        amount
      );

      const customerInfo = await UserModel.findOne({
        _id: otherOrderData.customerId,
      });

      const newOrder = new OrderModel({
        _id: orderId,
        razorpay_order_id: id,
        ...otherOrderData,
        payment: { amount, currency: 'INR' },
        order_status: OrderStatus.Created,
        payment_status: PaymentStatus.Pending,
      });
      await newOrder.save();
      const createOrderInfo: CreateOrderResponse = {
        orderId: id,
        razorpay_customer_id: customerInfo?.razorpay_customer_id ?? '',
      };
      res.status(200).send(createOrderInfo);
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async updateOrder(res: Response, updatedOrderData: RazorPayOrderSuccess) {
    try {
      const { razorpay_order_id, razorpay_payment_id } = updatedOrderData;
      const orderInfo = await OrderModel.findOne({ razorpay_order_id });
      await OrderModel.updateOne(
        { razorpay_order_id },
        {
          $set: {
            payment_id: razorpay_payment_id,
            order_status: OrderStatus.Processing,
            payment_status: PaymentStatus.Paid,
          },
        }
      );
      await groceryService.updateStockAfterPurchase(orderInfo?.products ?? []);
      if (orderInfo?.fromCart) {
        cartService.clearUserCart(orderInfo?.customerId ?? '');
      }
      res.status(200).send('Order Placed');
    } catch (err) {
      errorLogger(res, err);
    }
  }
}

export default CheckoutService;
