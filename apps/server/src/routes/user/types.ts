import { Types } from 'mongoose';
import { UserName, UserAddress } from '@ecom/mern-shared';
import { UserRole } from 'models/User';

export interface AddUser extends UserName {
  password: string;
  avatar: string;
  phone: string;
  role?: UserRole;
}

export interface User extends Omit<AddUser, 'role'> {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  razorpay_customer_id: string;
  role: UserRole;
}

export interface UserAddressSchema extends UserAddress {
  _id: Types.ObjectId;
}

export interface UserInfo extends User {
  _id: Types.ObjectId;
  addresses: UserAddressSchema[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UpdateUser extends UserName {
  phone?: string;
  avatar?: string;
  role?: UserRole;
}

export interface UserById {
  id: string;
}

export interface UserAddressDocument extends UserAddress {
  _id: Types.ObjectId;
}
