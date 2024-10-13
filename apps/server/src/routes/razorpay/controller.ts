import { Router, Request, Response } from 'express';
import {
  ApiRoutesConfig,
  CreateRazorpayOrder,
  UserProfileDetails
} from '@ecom-mern/shared';
import { validateAuthHeader, authenticateAdmin } from '@/utils';
import razorpayService from './service';
import * as RazorpayTypes from './types';

const razorpayRouter = Router();

/* -------- Customers -------- */
/* https://razorpay.com/docs/api/customers/ */
/* Get all customers */
razorpayRouter.get(
  `/${ApiRoutesConfig.razorpay.subRoutes.customers}`,
  validateAuthHeader,
  authenticateAdmin,
  (req: Request, res: Response) => {
    return razorpayService.getAllCustomers(res);
  }
);

/* Create a customer */
razorpayRouter.post(
  `/${ApiRoutesConfig.razorpay.subRoutes.customers}`,
  (req: Request<{}, {}, UserProfileDetails>, res: Response) => {
    const customerDetails = req.body;
    return razorpayService.createRzpCustomerHandler(res, customerDetails);
  }
);

/* Edit customer details */
razorpayRouter.put(
  `/${ApiRoutesConfig.razorpay.subRoutes.customers}/:customerId`,
  (
    req: Request<
      RazorpayTypes.CustomerIdParams,
      {},
      Omit<UserProfileDetails, 'avatar'>
    >,
    res: Response
  ) => {
    const customerId = req.params.customerId;
    const customerDetails = req.body;
    return razorpayService.editRzpCustomerHandler(
      res,
      customerId,
      customerDetails
    );
  }
);

/* Get customer details */
razorpayRouter.get(
  `/${ApiRoutesConfig.razorpay.subRoutes.customers}/:customerId`,
  validateAuthHeader,
  (req: Request, res: Response) => {
    const customerId = req.params.customerId;
    return razorpayService.getCustomerDetails(res, customerId);
  }
);

/* -------- Orders -------- */
/* https://razorpay.com/docs/api/orders/ */
/* Get all orders */
razorpayRouter.get(
  `/${ApiRoutesConfig.razorpay.subRoutes.orders}`,
  validateAuthHeader,
  authenticateAdmin,
  (req: Request, res: Response) => {
    return razorpayService.getAllOrders(res);
  }
);

/* Get order details by orderId */
razorpayRouter.get(
  `/${ApiRoutesConfig.razorpay.subRoutes.orders}/:orderId`,
  validateAuthHeader,
  authenticateAdmin,
  (req: Request<RazorpayTypes.OrderIdParams>, res: Response) => {
    const orderId = req.params.orderId;
    return razorpayService.getOrderDetails(res, orderId);
  }
);

/* Create new razorpay order */
razorpayRouter.post(
  `/${ApiRoutesConfig.razorpay.subRoutes.orders}`,
  (
    req: Request<{}, {}, Pick<CreateRazorpayOrder, 'amount'>>,
    res: Response
  ) => {
    const orderAmount = req.body.amount;
    return razorpayService.createOrderHandler(res, orderAmount);
  }
);

/* Fetch Payments for an order */
razorpayRouter.get(
  `/${ApiRoutesConfig.razorpay.subRoutes.orders}/:orderId/${ApiRoutesConfig.razorpay.subRoutes.payments.pathName}`,
  validateAuthHeader,
  authenticateAdmin,
  (req: Request<RazorpayTypes.OrderIdParams>, res: Response) => {
    const orderId = req.params.orderId;
    return razorpayService.getOrderPaymentDetails(res, orderId);
  }
);

/* Update Order Details, can only modify notes field only */
razorpayRouter.put(
  `/${ApiRoutesConfig.razorpay.subRoutes.orders}/:orderId`,
  validateAuthHeader,
  authenticateAdmin,
  (
    req: Request<
      RazorpayTypes.OrderIdParams,
      {},
      RazorpayTypes.UpdateRzpEntityNotes
    >,
    res: Response
  ) => {
    const orderId = req.params.orderId;
    const notesPayload = req.body;
    return razorpayService.updateOrderNotes(res, orderId, notesPayload);
  }
);

/* -------- Payments -------- */
/* https://razorpay.com/docs/api/payments/ */
/* Get all orders */
razorpayRouter.get(
  `/${ApiRoutesConfig.razorpay.subRoutes.payments.pathName}`,
  validateAuthHeader,
  authenticateAdmin,
  (req: Request, res: Response) => {
    return razorpayService.getAllPayments(res);
  }
);

/* Get payment details by paymentId */
razorpayRouter.get(
  `/${ApiRoutesConfig.razorpay.subRoutes.payments.pathName}/:paymentId`,
  validateAuthHeader,
  (req: Request<RazorpayTypes.PaymentIdParams>, res: Response) => {
    const paymentId = req.params.paymentId;
    return razorpayService.getPaymentDetails(res, paymentId);
  }
);

/* Capture payment */
razorpayRouter.post(
  `/${ApiRoutesConfig.razorpay.subRoutes.payments.pathName}/:paymentId/${ApiRoutesConfig.razorpay.subRoutes.payments.subRoutes.capture}`,
  validateAuthHeader,
  (
    req: Request<
      RazorpayTypes.PaymentIdParams,
      {},
      RazorpayTypes.PaymentDetails
    >,
    res: Response
  ) => {
    const paymentId = req.params.paymentId;
    const amount = req.body.amount;
    return razorpayService.capturePayment(res, paymentId, amount);
  }
);

/* Update Payment Details, can only modify notes field only */
razorpayRouter.put(
  `/${ApiRoutesConfig.razorpay.subRoutes.payments.pathName}/:paymentId`,
  validateAuthHeader,
  authenticateAdmin,
  (
    req: Request<
      RazorpayTypes.PaymentIdParams,
      {},
      RazorpayTypes.UpdateRzpEntityNotes
    >,
    res: Response
  ) => {
    const paymentId = req.params.paymentId;
    const notesPayload = req.body;
    return razorpayService.updatePaymentNotes(res, paymentId, notesPayload);
  }
);

/* Refund Payment */
razorpayRouter.post(
  `/${ApiRoutesConfig.razorpay.subRoutes.payments.pathName}/:paymentId/${ApiRoutesConfig.razorpay.subRoutes.payments.subRoutes.refund}`,
  validateAuthHeader,
  (
    req: Request<
      RazorpayTypes.PaymentIdParams,
      {},
      RazorpayTypes.PaymentRefund
    >,
    res: Response
  ) => {
    const paymentId = req.params.paymentId;
    const refundPayload = req.body;
    return razorpayService.refundPayment(res, paymentId, refundPayload);
  }
);

/* Get Refund details for a Payment */
razorpayRouter.get(
  `/${ApiRoutesConfig.razorpay.subRoutes.payments.pathName}/:paymentId/${ApiRoutesConfig.razorpay.subRoutes.refunds}/:refundId`,
  validateAuthHeader,
  (
    req: Request<RazorpayTypes.PaymentIdParams & RazorpayTypes.RefundIdParams>,
    res: Response
  ) => {
    const paymentId = req.params.paymentId;
    const refundId = req.params.refundId;
    return razorpayService.getRefundDetailsOfPayment(res, paymentId, refundId);
  }
);

/* -------- Refunds -------- */
/* https://razorpay.com/docs/api/refunds/ */
/* Get all refunds */
razorpayRouter.get(
  `/${ApiRoutesConfig.razorpay.subRoutes.refunds}`,
  validateAuthHeader,
  authenticateAdmin,
  (req: Request, res: Response) => {
    return razorpayService.getAllRefunds(res);
  }
);

/* Get refund details by refundId */
razorpayRouter.get(
  `/${ApiRoutesConfig.razorpay.subRoutes.refunds}/:refundId`,
  validateAuthHeader,
  (req: Request<RazorpayTypes.RefundIdParams>, res: Response) => {
    const refundId = req.params.refundId;
    return razorpayService.getRefundDetails(res, refundId);
  }
);

/* Update Refund Details, can only modify notes field only */
razorpayRouter.put(
  `/${ApiRoutesConfig.razorpay.subRoutes.refunds}/:refundId`,
  validateAuthHeader,
  (
    req: Request<
      RazorpayTypes.RefundIdParams,
      {},
      RazorpayTypes.UpdateRzpEntityNotes
    >,
    res: Response
  ) => {
    const refundId = req.params.refundId;
    const notesPayload = req.body;
    return razorpayService.updateRefundNotes(res, refundId, notesPayload);
  }
);

/* -------- Settlements -------- */
/* https://razorpay.com/docs/api/settlements/ */
/* Get all settlements */
razorpayRouter.get(
  `/${ApiRoutesConfig.razorpay.subRoutes.settlements}`,
  validateAuthHeader,
  authenticateAdmin,
  (req: Request, res: Response) => {
    return razorpayService.getAllSettlements(res);
  }
);

export { razorpayRouter };
