import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { batch } from 'react-redux';
import {
  ApiRoutesConfig,
  AddToUserCart,
  CartProduct,
  GroceryItem,
  GuestUserCart
} from '@ecom-mern/shared';
import {
  setUserCartInfo,
  setToastMessage,
  setToastStatus,
  openToast,
  defaultUserCartValue
} from 'redux-store';
import AppConfig from 'constants/app-config';

type AddUserCartProduct = { product: CartProduct } & AddToUserCart;

export const cartApi = createApi({
  reducerPath: 'cartApi',
  tagTypes: ['CartProductsUser', 'CartDetailsUser'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${AppConfig.api_endpoint}/${ApiRoutesConfig.cart.pathName}`
  }),
  endpoints: (builder) => ({
    /**
     * Get user cart_id and product ids alongwith quantities
     * when they login.
     */
    getUserCartInfo: builder.query<GuestUserCart, string>({
      query: (payload) => `?user_id=${payload}`,
      providesTags: ['CartProductsUser'],
      /** Refetch if args change */
      forceRefetch() {
        return true;
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: userCartData } = await queryFulfilled;
          if (userCartData) {
            dispatch(setUserCartInfo(userCartData ?? defaultUserCartValue));
          }
        } catch (err) {
          batch(() => {
            dispatch(setToastStatus('error'));
            dispatch(setToastMessage(JSON.stringify(err)));
            dispatch(openToast());
          });
        }
      },
      transformErrorResponse: (response) => response.data
    }),
    /** Get full info of cart products when on cart page */
    getCartProducts: builder.query<GroceryItem[], string>({
      query: (payload) =>
        `/${ApiRoutesConfig.cart.subRoutes.products}?productids=${payload}`,
      providesTags: ['CartDetailsUser']
    }),
    upsertProductsToCart: builder.mutation<GuestUserCart, AddUserCartProduct>({
      query: (payload) => {
        const { user_id, cart_id, product } = payload;
        let queryURL = `/${ApiRoutesConfig.cart.subRoutes.add}?user_id=${user_id}`;
        if (cart_id) {
          queryURL += `&cart_id=${cart_id}`;
        }
        return {
          url: queryURL,
          method: 'PUT',
          body: product
        };
      },
      /**
       * As soon as I add a product to cart, it asks the api to fetch
       * user cart details again.
       */
      invalidatesTags: ['CartProductsUser'],
      transformErrorResponse: (response) => response.data
    }),
    updateOrRemoveProduct: builder.mutation<GuestUserCart, AddUserCartProduct>({
      query: ({ user_id, cart_id, product }) => ({
        url: `/${ApiRoutesConfig.cart.subRoutes.update}?user_id=${user_id}&cart_id=${cart_id}`,
        method: 'PUT',
        body: product
      }),
      invalidatesTags: ['CartProductsUser', 'CartDetailsUser'],
      transformErrorResponse: (response) => response.data
    })
  })
});

export const {
  useGetUserCartInfoQuery,
  useGetCartProductsQuery,
  useUpsertProductsToCartMutation,
  useUpdateOrRemoveProductMutation
} = cartApi;
