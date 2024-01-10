import { Schema, model } from 'mongoose';
import { GroceryCartProduct } from 'routes/cart/types';

/**
 * Check out this cart helper library.
 * https://commercejs.com/docs
 */
export const GroceryPurchase = new Schema<GroceryCartProduct>(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'grocery',
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { _id: false }
);

const CartSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    /*  Can also be written as [GroceryPurchase] */
    products: {
      type: [GroceryPurchase],
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'lastModifiedOn' },
  }
);

/**
 * The 3rd arg in model function is the custom name for
 * collection, so that mongo doesn't pluralize the
 * 1st arg name.
 */
const CartModel = model('cart', CartSchema, 'cart');

export default CartModel;
