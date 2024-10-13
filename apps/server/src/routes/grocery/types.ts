import { Types } from 'mongoose';
import { Modify } from '@ecom-mern/shared';

export interface GetGroceryParams {
  page?: number;
  num_entries?: number;
}

export interface AddGroceryItem {
  product_name: string;
  brand: string;
  price: number;
  discount_price?: number;
  image_url: string;
  quantity: string;
  category: string;
  sub_category?: string;
  inStock?: number;
}

export interface Grocery
  extends Modify<
    AddGroceryItem,
    {
      sub_category: string | null;
      discount_price: number;
      inStock: number;
    }
  > {
  _id: Types.ObjectId;
  sku: number;
  handle: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UpdateGroceryItem {
  product_name?: string;
  handle?: string;
  brand?: string;
  price?: number;
  discount_price?: number;
  image_url?: string;
  quantity?: string;
  category?: string;
  sub_category?: string;
  inStock?: number;
}

export interface GroceryById {
  id: string;
}

export interface GroceryBySku {
  sku: number;
}
