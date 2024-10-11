import { Router, Request, Response } from 'express';
import {
  ApiRoutesConfig,
  AddToUserCart,
  CartProduct,
  GuestUserCart,
  UserCartInfo,
} from '@ecom/mern-shared';
import { validateAuthHeader, checkTokenMismatchInReqParams } from '@/utils';
import cartService from './service';
import * as CartTypes from './types';

const cartRouter = Router();

/**
 * Get user cart _id and products when he logs in.
 */
cartRouter.get(
  '',
  validateAuthHeader,
  // checkTokenMismatchInReqParams,
  (req: Request<{}, {}, {}, CartTypes.GetCartByUserId>, res: Response) => {
    const user_id = req.query.user_id;
    return cartService.getUserCartInfo(res, user_id);
  }
);

/**
 * Add products to user cart. If he doesn't have a cart_id assigned to him,
 * a new cart is created for him and that info is returned alongwith all the
 * products added to the cart. If cart_id exists, the document is updated.
 */
cartRouter.put(
  `/${ApiRoutesConfig.cart.subRoutes.add}`,
  validateAuthHeader,
  (req: Request<{}, {}, CartProduct, AddToUserCart>, res: Response) => {
    const products = req.body;
    const cartQueryParams = req.query;
    return cartService.addToCart(res, products, cartQueryParams);
  }
);

/**
 * Completely remove a product from user cart or update its
 * quantity as newProduct.quantity, ie when we change quantity
 * of a product in cart page
 */
cartRouter.put(
  `/${ApiRoutesConfig.cart.subRoutes.update}`,
  validateAuthHeader,
  (req: Request<{}, {}, CartProduct, AddToUserCart>, res: Response) => {
    const products = req.body;
    const cartQueryParams = req.query;
    return cartService.removeFromCart(res, products, cartQueryParams);
  }
);

/**
 * Get Details of products when user or guest lands on cart page.
 */
cartRouter.get(
  `/${ApiRoutesConfig.cart.subRoutes.products}`,
  (req: Request<{}, {}, {}, CartTypes.GetProductsInfoQuery>, res: Response) => {
    const productIds = req.query.productids;
    return cartService.fetchProductsInfo(res, productIds);
  }
);

export { cartRouter };
