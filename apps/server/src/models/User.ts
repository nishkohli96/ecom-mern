import { Schema, model } from 'mongoose';
import {
  emailRegex,
  pswdRegex,
  nameRegex,
  UserAddress
} from '@ecom-mern/shared';
import { UserInfo } from '@/routes/user/types';
import { hashPassword } from '@/utils';

export enum UserRole {
  Admin = 'ADMIN',
  Customer = 'CUSTOMER'
}

const nameValidation = {
  type: String,
  min: 2,
  required: true,
  match: nameRegex
};

const PersonName = new Schema(
  {
    first: nameValidation,
    last: nameValidation
  },
  { _id: false }
);

const Address_Country_State = new Schema(
  {
    name: { type: String, required: true, min: 2 },
    iso2: { type: String, required: true, min: 2 }
  },
  { _id: false }
);

const AddressSchema = new Schema<UserAddress>(
  {
    recipientName: { type: String, required: true, minLength: 2 },
    recipientPhone: { type: String, required: true, minLength: 5 },
    houseNo: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String, required: false, default: null },
    city: { type: String, required: true, minLength: 2 },
    state: { type: Address_Country_State, required: true },
    country: { type: Address_Country_State, required: true },
    zipCode: { type: String, required: true, minLength: 5 },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const UserSchema = new Schema<UserInfo>(
  {
    name: {
      type: PersonName,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: emailRegex
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      select: false,
      match: pswdRegex
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    phone: { type: String, required: true, minLength: 10 },
    isPhoneVerified: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: 'https://randomuser.me/api/portraits/thumb/men/75.jpg'
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Customer
    },
    addresses: {
      type: [AddressSchema],
      default: []
    },
    razorpay_customer_id: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    methods: {
      fullName() {
        return this.name.first + ' ' + this.name.last;
      }
    }
  }
);

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  user.password = await hashPassword(user.password);
  next();
});

const UserModel = model('user', UserSchema);

export default UserModel;
