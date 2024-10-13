import { Schema } from 'mongoose';
import { CartProduct } from '@ecom-mern/shared';

export interface GroceryCartProduct extends Omit<CartProduct, 'product_id'> {
  product_id: Schema.Types.ObjectId;
}

/**
 * Both user_id & card_id would be there when fetching users
 * cart, else none if fetching cart info as a guest user.
 */
export interface GetCartProducts {
  user_id?: string;
  cart_id?: string;
}

export interface GetProductsInfoQuery {
  productids: string;
}

export interface GetCartByUserId {
  user_id: string;
}
