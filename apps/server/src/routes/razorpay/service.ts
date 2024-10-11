import { Response } from 'express';
import { randomUUID } from 'crypto';
import Razorpay from 'razorpay';
import {
  UserProfileDetails,
  RazorpayCustomer,
  RazorPayOrder,
} from '@ecom-mern/shared';
import { ENV_VARS } from '@/app-constants/env_vars';
import { errorLogger } from '@/utils';
import * as RazorpayTypes from './types';

class RazorpayService {
  razorpayInstance = new Razorpay({
    key_id: ENV_VARS.razorpay.key_id,
    key_secret: ENV_VARS.razorpay.secret,
  });

  /* -------- Customers -------- */
  async getAllCustomers(res: Response) {
    try {
      const customersList = await this.razorpayInstance.customers.all();
      return res.send(customersList).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async createRazorpayCustomer(
    user: UserProfileDetails
  ): Promise<RazorpayCustomer> {
    const newRzpCustomer = (await this.razorpayInstance.customers.create({
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      contact: user.phone,
      notes: {
        avatar: user.avatar,
      },
    })) as RazorpayCustomer;
    return newRzpCustomer;
  }

  async createRzpCustomerHandler(
    res: Response,
    customerDetails: UserProfileDetails
  ) {
    try {
      const razorpayCustomer = await this.createRazorpayCustomer(
        customerDetails
      );
      return res.send(razorpayCustomer).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async editRazorpayCustomerDetails(
    customerId: string,
    user: Omit<UserProfileDetails, 'avatar'>
  ): Promise<RazorpayCustomer> {
    const updatedRzpCustomer = (await this.razorpayInstance.customers.edit(
      customerId,
      {
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        contact: user.phone,
      }
    )) as RazorpayCustomer;
    return updatedRzpCustomer;
  }

  async editRzpCustomerHandler(
    res: Response,
    customerId: string,
    customerDetails: Omit<UserProfileDetails, 'avatar'>
  ) {
    try {
      const updatedRzpCustomer = await this.editRazorpayCustomerDetails(
        customerId,
        customerDetails
      );
      return res.send(updatedRzpCustomer).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async getCustomerDetails(res: Response, customerId: string) {
    try {
      const customerDetails = await this.razorpayInstance.customers.fetch(
        customerId
      );
      return res.send(customerDetails).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  /* -------- Orders -------- */
  async getAllOrders(res: Response) {
    try {
      const ordersList = await this.razorpayInstance.orders.all();
      return res.send(ordersList).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async getOrderDetails(res: Response, orderId: string) {
    try {
      const ordersDetails = await this.razorpayInstance.orders.fetch(orderId);
      return res.send(ordersDetails).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async createNewRazorpayOrder(
    amount: number
  ): Promise<RazorpayTypes.CreateOrderResponse> {
    const orderId = randomUUID();
    const options = {
      amount,
      currency: 'INR',
      receipt: orderId,
    };
    const orderData = (await this.razorpayInstance.orders.create(
      options
    )) as RazorPayOrder;
    return { ...orderData, orderId };
  }

  async createOrderHandler(res: Response, amount: number) {
    try {
      const newRzpOrder = await this.createNewRazorpayOrder(amount);
      return res.send(newRzpOrder).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async getOrderPaymentDetails(res: Response, orderId: string) {
    try {
      const ordersDetails = await this.razorpayInstance.orders.fetchPayments(
        orderId
      );
      return res.send(ordersDetails).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async updateOrderNotes(
    res: Response,
    orderId: string,
    notesPayload: RazorpayTypes.UpdateRzpEntityNotes
  ) {
    try {
      const updatedOrdersDetails = await this.razorpayInstance.orders.edit(
        orderId,
        {
          notes: notesPayload,
        }
      );
      return res.send(updatedOrdersDetails).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  /* -------- Payments -------- */
  async getAllPayments(res: Response) {
    try {
      const paymentsList = await this.razorpayInstance.payments.all();
      return res.send(paymentsList).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async getPaymentDetails(res: Response, paymentId: string) {
    try {
      /** Amount must be equal to the number specified in orders object,
       * else it will throw an error
       */
      const paymentInfo = await this.razorpayInstance.payments.fetch(paymentId);
      return res.send(paymentInfo).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async capturePayment(res: Response, paymentId: string, amount: number) {
    try {
      /** Amount must be equal to the number specified in orders object,
       * else it will throw an error
       */
      const paymentInfo = await this.razorpayInstance.payments.capture(
        paymentId,
        amount,
        'INR'
      );
      return res.send(paymentInfo).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async updatePaymentNotes(
    res: Response,
    paymentId: string,
    notesPayload: RazorpayTypes.UpdateRzpEntityNotes
  ) {
    try {
      const updatedPaymentDetails = await this.razorpayInstance.payments.edit(
        paymentId,
        {
          notes: notesPayload,
        }
      );
      return res.send(updatedPaymentDetails).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async refundPayment(
    res: Response,
    paymentId: string,
    refundPayload: RazorpayTypes.PaymentRefund
  ) {
    try {
      const updatedPaymentDetails = await this.razorpayInstance.payments.refund(
        paymentId,
        {
          ...refundPayload,
          /* speed: 'optimum' for faster refund */
          speed: 'normal',
        }
      );
      return res.send(updatedPaymentDetails).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async getRefundDetailsOfPayment(
    res: Response,
    paymentId: string,
    refundId: string
  ) {
    try {
      const refundDetails = await this.razorpayInstance.payments.fetchRefund(
        paymentId,
        refundId
      );
      return res.send(refundDetails).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  /* -------- Refunds -------- */
  async getAllRefunds(res: Response) {
    try {
      const refundsList = await this.razorpayInstance.refunds.all();
      return res.send(refundsList).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async getRefundDetails(res: Response, refundId: string) {
    try {
      const refundInfo = await this.razorpayInstance.refunds.fetch(refundId);
      return res.send(refundInfo).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  async updateRefundNotes(
    res: Response,
    refundId: string,
    notesPayload: RazorpayTypes.UpdateRzpEntityNotes
  ) {
    try {
      const updatedRefundDetails = await this.razorpayInstance.refunds.edit(
        refundId,
        {
          notes: notesPayload,
        }
      );
      return res.send(updatedRefundDetails).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }

  /* -------- Settlements -------- */
  async getAllSettlements(res: Response) {
    try {
      const settlementsList = await this.razorpayInstance.settlements.all();
      return res.send(settlementsList).end();
    } catch (err) {
      errorLogger(res, err);
    }
  }
}

export default new RazorpayService();
