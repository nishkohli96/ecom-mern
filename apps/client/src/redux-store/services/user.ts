import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AppConfig from 'constants/app-config';
import {
  ApiRoutesConfig,
  UserPasswordChange,
  UserProfileDetails,
  UserAddress,
  VerifyUserEmail,
  PasswordResetQueryParams,
  ConfirmPasswordType,
  SetDefaultAddress
} from '@ecom-mern/shared';
import { UserLoginInfo, UserAddressInfo } from 'shared/types';

type UserResetPassword = PasswordResetQueryParams & ConfirmPasswordType;
type UserId = { id: string };

export const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['User', 'UserAddress'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${AppConfig.api_endpoint}/${ApiRoutesConfig.user.pathName}`
  }),
  endpoints: (builder) => ({
    getUserDetails: builder.query<UserLoginInfo, string>({
      query: (payload) => `/${payload}`,
      providesTags: ['User']
    }),
    updateUserDetails: builder.mutation<UserProfileDetails, UserLoginInfo>({
      query: ({ _id, ...userInfo }) => ({
        url: `/${ApiRoutesConfig.user.subRoutes.update}/${_id}`,
        method: 'PUT',
        body: userInfo
      }),
      transformErrorResponse: (response) => response.data,
      /**
       *  invalidatingTags means that the next time
       *  "getUserDetails" is called, it will refetch the
       *  result instead of serving data from the cache.
       */
      invalidatesTags: ['User']
    }),
    changePassword: builder.mutation<string, UserPasswordChange>({
      query: (payload) => ({
        url: `/${ApiRoutesConfig.user.subRoutes.changePswd}`,
        method: 'PUT',
        body: payload,
        responseHandler: (response) => response.text()
      }),
      transformErrorResponse: (response) => response.data
    }),
    resetUserPassword: builder.mutation<string, UserResetPassword>({
      query: ({ token, id, new_password, confirm_password }) => ({
        url: `/${ApiRoutesConfig.user.subRoutes.resetPswd}?token=${token}&id=${id}`,
        method: 'PUT',
        body: {
          new_password,
          confirm_password
        },
        responseHandler: (response) => response.text()
      }),
      transformErrorResponse: (response) => response.data
    }),
    getUserAddresses: builder.query<UserAddressInfo[], string>({
      query: (payload) =>
        `/${payload}/${ApiRoutesConfig.user.subRoutes.address}`,
      providesTags: (result, error, arg) => [{ type: 'UserAddress', id: arg }],
      transformErrorResponse: (response) => response.data
    }),
    addUserAddress: builder.mutation<string, UserAddress & UserId>({
      query: ({ id, ...addressDetails }) => ({
        url: `/${id}/${ApiRoutesConfig.user.subRoutes.address}`,
        method: 'POST',
        body: addressDetails,
        responseHandler: (response) => response.text()
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'UserAddress', id: arg.id }
      ],
      transformErrorResponse: (response) => response.data
    }),
    updateUserAddress: builder.mutation<string, UserAddressInfo & UserId>({
      query: ({ id, ...addressDetails }) => ({
        url: `/${id}/${ApiRoutesConfig.user.subRoutes.address}`,
        method: 'PUT',
        body: addressDetails,
        responseHandler: (response) => response.text()
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'UserAddress', id: arg.id }
      ],
      transformErrorResponse: (response) => response.data
    }),
    setDefaultAddress: builder.mutation<string, SetDefaultAddress & UserId>({
      query: ({ id, address_id }) => ({
        url: `${id}/${ApiRoutesConfig.user.subRoutes.defaultAddr}`,
        method: 'PUT',
        body: { address_id },
        responseHandler: (response) => response.text()
      }),
      transformErrorResponse: (response) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'UserAddress', id: arg.id }
      ]
    }),
    deleteAddress: builder.mutation<string, SetDefaultAddress & UserId>({
      query: ({ id, address_id }) => ({
        url: `${id}/${ApiRoutesConfig.user.subRoutes.address}`,
        method: 'DELETE',
        body: { address_id },
        responseHandler: (response) => response.text()
      }),
      transformErrorResponse: (response) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'UserAddress', id: arg.id }
      ]
    })
  })
});

export const {
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
  useChangePasswordMutation,
  useResetUserPasswordMutation,
  useGetUserAddressesQuery,
  useAddUserAddressMutation,
  useUpdateUserAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation
} = userApi;
