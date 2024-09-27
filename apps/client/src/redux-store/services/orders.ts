import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AppConfig from 'constants/app-config';
import {
  ApiRoutesConfig,
  OrdersListItem,
  CompleteOrdersDetail,
} from '@ecom/mern-shared';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${AppConfig.api_endpoint}/${ApiRoutesConfig.orders.pathName}`,
  }),
  endpoints: builder => ({
    getOrdersList: builder.query<OrdersListItem[], string>({
      query: payload => ({
        url: `?customer_id=${payload}`,
      }),
      transformErrorResponse: response => response.data,
    }),
    getOrderDetails: builder.query<CompleteOrdersDetail, string>({
      query: payload => ({
        url: `/${payload}`,
      }),
      transformErrorResponse: response => response.data,
    }),
  }),
});

export const { useGetOrdersListQuery, useGetOrderDetailsQuery } = ordersApi;
