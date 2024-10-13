import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AppConfig from 'constants/app-config';
import {
  ApiRoutesConfig,
  CreateRazorpayOrder,
  RazorPayOrderSuccess,
  CreateOrderResponse
} from '@ecom-mern/shared';

export const checkoutApi = createApi({
  reducerPath: 'checkoutApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${AppConfig.api_endpoint}/${ApiRoutesConfig.checkout.pathName}`
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, CreateRazorpayOrder>({
      query: (payload) => ({
        url: `/${ApiRoutesConfig.checkout.subRoutes.order}`,
        method: 'POST',
        body: payload
      }),
      transformErrorResponse: (response) => response.data
    }),
    updateOrderStatus: builder.mutation<string, RazorPayOrderSuccess>({
      query: (payload) => ({
        url: `/${ApiRoutesConfig.checkout.subRoutes.order}`,
        method: 'PUT',
        body: payload,
        responseHandler: (response) => response.text()
      }),
      transformErrorResponse: (response) => response.data
    })
  })
});

export const { useCreateOrderMutation, useUpdateOrderStatusMutation } =
  checkoutApi;
