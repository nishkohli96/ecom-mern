import { Router, Request, Response } from 'express';
import {
  ApiRoutesConfig,
  CreateRazorpayOrder,
  RazorPayOrderSuccess
} from '@ecom-mern/shared';
import CheckoutService from './service';

const checkoutRouter = Router();
const checkoutService = new CheckoutService();

checkoutRouter.post(
  `/${ApiRoutesConfig.checkout.subRoutes.order}`,
  (req: Request<object, object, CreateRazorpayOrder>, res: Response) => {
    const createOrderData = req.body;
    return checkoutService.createNewOrder(res, createOrderData);
  }
);

checkoutRouter.put(
  `/${ApiRoutesConfig.checkout.subRoutes.order}`,
  (req: Request<object, object, RazorPayOrderSuccess>, res: Response) => {
    const updatedOrderData = req.body;
    return checkoutService.updateOrder(res, updatedOrderData);
  }
);

export { checkoutRouter };
