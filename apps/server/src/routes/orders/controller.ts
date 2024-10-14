import { Router, Request, Response } from 'express';
import { GetCustomerQuery } from '@ecom-mern/shared';
import { validateAuthHeader, checkTokenMismatchInReqQuery } from '@/utils';
import orderService from './service';
import * as OrderTypes from './types';

const orderRouter = Router();

/* Get customer orders */
orderRouter.get(
  '/',
  validateAuthHeader,
  checkTokenMismatchInReqQuery,
  (req: Request<object, object, object, GetCustomerQuery>, res: Response) => {
    const customerId = req.query.customer_id;
    return orderService.getCustomerOrdersList(res, customerId);
  }
);

/* Get order details by id */
orderRouter.get(
  '/:order_id',
  (req: Request<OrderTypes.GetOrderInfo>, res: Response) => {
    const orderId = req.params.order_id;
    return orderService.getOrderDetails(res, orderId);
  }
);

/* Get order details by id */
orderRouter.get(
  '/:order_id/invoice',
  (req: Request<OrderTypes.GetOrderInfo>, res: Response) => {
    const orderId = req.params.order_id;
    return orderService.downloadOrderInvoice(res, orderId);
  }
);

export { orderRouter };
