import { UserProfileDetails, UserAddress } from '@ecom/mern-shared';

export interface UserLoginInfo extends UserProfileDetails {
  _id: string;
}

export interface UserAddressInfo extends UserAddress {
  _id: string;
}
