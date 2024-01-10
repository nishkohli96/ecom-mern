import { Modify } from '.';

export interface CartProduct {
  product_id: string;
  quantity: number;
}

export interface GuestUserCart {
  cart_id?: string | null;
  products: CartProduct[];
}

export interface AddToUserCart {
  user_id: string;
  cart_id?: string;
}

export interface UserCartInfo
  extends Modify<
    GuestUserCart,
    {
      cart_id: string;
    }
  > {
  createdAt: Date | string;
  lastModifiedOn: Date | string;
}
