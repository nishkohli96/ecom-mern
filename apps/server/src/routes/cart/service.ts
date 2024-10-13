import { Response } from 'express';
import { Types } from 'mongoose';
import { CartModel, GroceryModel } from '@/models';
import { AddToUserCart, CartProduct, UserCartInfo } from '@ecom-mern/shared';
import {
  errorLogger,
  rearrangeCartProducts,
  addProductToCart,
  removeProductFromCart
} from '@/utils';
import * as CartTypes from './types';

class CartService {
  async getUserCartInfo(res: Response, user_id: string) {
    try {
      const cartInfo = await CartModel.findOne({
        user_id: new Types.ObjectId(user_id)
      }).select(['_id', 'products']);

      if (!cartInfo) {
        return res.status(200).send(null).end();
      }

      return res
        .status(200)
        .send({
          cart_id: cartInfo?._id,
          products: cartInfo?.products
        })
        .end();
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async getUserCart(res: Response, cartQueryParams: CartTypes.GetCartProducts) {
    let matchParams = {};
    if (cartQueryParams.cart_id && cartQueryParams.user_id) {
      /**
       * To match mongodb object id with their equivalent string
       * value, either cast to mongodb object id or compare by
       * match-expr as done below in the lookup pipeline.
       */
      const cart_id = new Types.ObjectId(cartQueryParams.cart_id);
      const user_id = new Types.ObjectId(cartQueryParams.user_id);
      matchParams = { _id: cart_id, user_id };
    }

    try {
      const userCartDetails = await CartModel.aggregate([
        { $match: matchParams },
        { $unwind: '$products' },
        {
          $lookup: {
            from: 'groceries',
            let: {
              pid: '$products.product_id',
              pquantity: '$products.quantity'
            },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$pid'] } } },
              {
                $project: {
                  _id: 1,
                  product_name: 1,
                  handle: 1,
                  image_url: 1,
                  brand: 1,
                  category: 1,
                  sub_category: 1,
                  price: 1,
                  discount_price: 1,
                  inStock: 1,
                  quantity: 1,
                  num_products: '$$pquantity'
                }
              }
            ],
            as: 'productsDetail'
          }
        },
        {
          $project: {
            products: '$productsDetail'
          }
        }
      ]);
      return res.status(200).send(userCartDetails);
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async addToCart(
    res: Response,
    product: CartProduct,
    cartQueryParams: AddToUserCart
  ) {
    const { user_id, cart_id } = cartQueryParams;
    if (!user_id) {
      return res.status(400).send('user_id is required').end();
    }
    try {
      /**
       * Generate new cart doc for that user, add product
       * to it and then return that document.
       */
      if (!cart_id) {
        const cartInfo = await new CartModel({
          user_id,
          products: [product]
        }).save();
        return res
          .status(200)
          .send({
            user_id,
            cart_id: cartInfo._id,
            products: cartInfo.products
          })
          .end();
      }

      /* Update products in existing cart */
      const exisitingCart = await CartModel.findOne({
        _id: new Types.ObjectId(cart_id),
        user_id: new Types.ObjectId(user_id)
      });
      /* Convert products from mongoose to JS object */
      const existingProducts =
        exisitingCart?.products.map((prod) => prod.toObject()) ?? [];
      const exisitingCartProducts = existingProducts.map((prod) => ({
        ...prod,
        product_id: prod.product_id.toString()
      }));
      const updatedProducts = addProductToCart(exisitingCartProducts, product);
      const updatedCart = await CartModel.findByIdAndUpdate(
        {
          _id: exisitingCart?._id,
          user_id: exisitingCart?.user_id
        },
        { products: updatedProducts },
        {
          new: true
        }
      );
      return res
        .status(200)
        .send({
          user_id,
          cart_id,
          products: updatedCart?.products ?? []
        })
        .end();
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async removeFromCart(
    res: Response,
    product: CartProduct,
    cartQueryParams: AddToUserCart
  ) {
    const { user_id, cart_id } = cartQueryParams;
    if (!user_id || !cart_id) {
      return res.status(400).send('both user_id & cart_id are required').end();
    }
    try {
      const exisitingCart = await CartModel.findOne({
        _id: new Types.ObjectId(cart_id),
        user_id: new Types.ObjectId(user_id)
      });
      /* Convert products from mongoose to JS object */
      const existingProducts =
        exisitingCart?.products.map((prod) => prod.toObject()) ?? [];
      const exisitingCartProducts = existingProducts.map((prod) => ({
        ...prod,
        product_id: prod.product_id.toString()
      }));
      const updatedProducts = removeProductFromCart(
        exisitingCartProducts,
        product
      );
      const updatedCart = await CartModel.findByIdAndUpdate(
        {
          _id: exisitingCart?._id,
          user_id: exisitingCart?.user_id
        },
        { products: updatedProducts },
        {
          new: true
        }
      );
      return res
        .status(200)
        .send({
          user_id,
          cart_id,
          products: updatedCart?.products ?? []
        })
        .end();
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async fetchProductsInfo(res: Response, productIds: string) {
    /* Handling case for empty cart */
    if (!productIds) {
      return res.status(200).send([]).end();
    }

    const objIds = productIds
      .split(',')
      .map((prodId) => new Types.ObjectId(prodId));

    const productsData = await GroceryModel.find({
      _id: { $in: objIds }
    }).select([
      '_id',
      'product_name',
      'handle',
      'image_url',
      'brand',
      'category',
      'sub_category',
      'price',
      'discount_price',
      'inStock',
      'quantity'
    ]);

    const orderedCartData = rearrangeCartProducts(
      productsData,
      productIds.split(',')
    );
    res.status(200).send(orderedCartData).end();
  }

  async clearUserCart(userId: Types.ObjectId | string) {
    try {
      await CartModel.updateOne(
        { user_id: userId },
        { $set: { products: [] } }
      );
    } catch (err) {
      console.log(err);
    }
  }
}

export default new CartService();
