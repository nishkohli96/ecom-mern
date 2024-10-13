import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'redux-store';
import { UserLoginInfo } from 'shared/types';
import { CartProduct, GuestUserCart } from '@ecom-mern/shared';
import { addProductToCart, removeProductFromCart } from 'utils';

interface UserIntialState {
  userInfo: UserLoginInfo | null;
  guest_cart: GuestUserCart;
  user_cart: GuestUserCart;
}

interface ModifyCartProduct {
  update?: boolean;
  product: CartProduct;
}

export const defaultUserCartValue: GuestUserCart = {
  cart_id: null,
  products: []
};

export const GuestUserData: UserLoginInfo = {
  _id: '',
  email: '',
  phone: '',
  name: { first: '', last: '' },
  avatar: ''
};

const initialState: UserIntialState = {
  userInfo: null,
  guest_cart: {
    products: []
  },
  user_cart: defaultUserCartValue
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserLoginInfo | null>) => {
      state.userInfo = action.payload;
    },
    setUserCartInfo: (state, action: PayloadAction<GuestUserCart>) => {
      state.user_cart = action.payload;
    },
    setUserCartProducts: (state, action: PayloadAction<CartProduct[] | []>) => {
      state.user_cart = {
        ...state.user_cart,
        products: action.payload
      };
    },
    addProductToGuestCart: (
      state,
      action: PayloadAction<ModifyCartProduct>
    ) => {
      state.guest_cart = {
        ...state.guest_cart,
        products: addProductToCart(
          state.guest_cart.products,
          action.payload.product,
          action.payload.update
        )
      };
    },
    removeProductFromGuestCart: (state, action: PayloadAction<string>) => {
      state.guest_cart = {
        ...state.guest_cart,
        products: removeProductFromCart(
          state.guest_cart.products,
          action.payload
        )
      };
    },
    addProductToUserCart: (state, action: PayloadAction<CartProduct>) => {
      state.guest_cart = {
        ...state.guest_cart,
        products: addProductToCart(state.guest_cart.products, action.payload)
      };
    },
    removeProductFromUserCart: (state, action: PayloadAction<string>) => {
      state.user_cart = {
        ...state.user_cart,
        products: removeProductFromCart(
          state.user_cart.products,
          action.payload
        )
      };
    }
  }
});

/* Actions */
export const {
  setUser,
  setUserCartInfo,
  setUserCartProducts,
  addProductToGuestCart,
  removeProductFromGuestCart,
  addProductToUserCart,
  removeProductFromUserCart
} = userSlice.actions;

/* Selectors */
export const UserSelector = (state: RootState) => state.appData.user.userInfo;
export const UserCartSelector = (state: RootState) =>
  state.appData.user.user_cart;
export const GuestCartSelector = (state: RootState) =>
  state.appData.user.guest_cart;
