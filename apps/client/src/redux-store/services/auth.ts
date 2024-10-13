import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { batch } from 'react-redux';
import AppConfig from 'constants/app-config';
import { ApiRoutesConfig, UserLogin, VerifyUserEmail } from '@ecom-mern/shared';
import { UserLoginInfo } from 'shared/types';
import {
  openToast,
  setToastMessage,
  setToastStatus,
  setUser,
  setUserCartInfo,
  defaultUserCartValue
} from 'redux-store';
import { cartApi } from './cart';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${AppConfig.api_endpoint}/${ApiRoutesConfig.auth.pathName}`
  }),
  endpoints: (builder) => ({
    userLogin: builder.mutation<UserLoginInfo, UserLogin>({
      query: (payload) => ({
        url: `/${ApiRoutesConfig.auth.subRoutes.login}`,
        method: 'POST',
        body: payload
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: userData } = await queryFulfilled;
          /**
           * As soon as I get userData, I fetch this cart details
           * from the cart api.
           */
          dispatch(cartApi.endpoints.getUserCartInfo.initiate(userData._id));
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
    checkLogin: builder.query<string, void>({
      query: () => `/${ApiRoutesConfig.auth.subRoutes.checkLogin}`,
      transformResponse: (response: any) => {
        console.log('trs', response);
        return response;
      },
      transformErrorResponse: (response: { status: string | number }) =>
        response.status,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('data: ', data);
        } catch (err) {
          batch(() => {
            dispatch(setUser(null));
            dispatch(setUserCartInfo(defaultUserCartValue));
          });
        }
      }
    }),
    userLogout: builder.mutation<string, void>({
      query: () => ({
        url: `/${ApiRoutesConfig.auth.subRoutes.logout}`,
        method: 'DELETE',
        // headers: {'jwt': '132324'},
        /**
         * I'm returning a string message as response. By
         * default the success response is parsed as JSON,
         * so to parse as text, transform the response as
         * text.
         * https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#parsing-a-response
         */
        responseHandler: (response) => response.text()
      }),
      transformErrorResponse: (response) => response.data
    }),
    initiatePasswordReset: builder.mutation<string, VerifyUserEmail>({
      query: (payload) => ({
        url: `/${ApiRoutesConfig.auth.subRoutes.findAccount}`,
        method: 'POST',
        body: payload,
        responseHandler: (response) => response.text()
      }),
      transformErrorResponse: (response) => response.data
    })
  })
});

export const {
  useUserLoginMutation,
  useCheckLoginQuery,
  useUserLogoutMutation,
  useInitiatePasswordResetMutation
} = authApi;
