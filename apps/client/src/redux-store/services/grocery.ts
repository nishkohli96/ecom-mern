import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AppConfig from 'constants/app-config';
import {
  ApiRoutesConfig,
  GroceryItem,
  GroceryCategorization,
} from '@ecom/mern-shared';

export const groceryApi = createApi({
  reducerPath: 'groceryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${AppConfig.api_endpoint}/${ApiRoutesConfig.grocery.pathName}`,
  }),
  tagTypes: ['GroceryList', 'GroceryItem'],
  endpoints: (builder) => ({
    /* Fetch random records to show in homepage carousel */
    getGroceries: builder.query<GroceryItem[], void>({
      query: () => `/${ApiRoutesConfig.grocery.subRoutes.randomRecords}`,
    }),
    /* Get product detail by objectId */
    getGroceryItem: builder.query<GroceryItem, string>({
      query: (itemId) =>
        `/${ApiRoutesConfig.grocery.subRoutes.productById}/${itemId}`,
      providesTags: ['GroceryItem'],
    }),
    /* Get product details by sku */
    getGroceryItemBySku: builder.query<GroceryItem, number>({
      query: (itemId) =>
        `/${ApiRoutesConfig.grocery.subRoutes.productInfo}/${itemId}`,
      providesTags: ['GroceryItem'],
    }),
    /* get brands, categories and sub-categories */
    getGroceryCategorization: builder.query<GroceryCategorization, void>({
      query: () => `/${ApiRoutesConfig.grocery.subRoutes.categorization}`,
    }),
  }),
});

export const {
  useGetGroceriesQuery,
  useGetGroceryItemQuery,
  useGetGroceryItemBySkuQuery,
  useGetGroceryCategorizationQuery,
} = groceryApi;
