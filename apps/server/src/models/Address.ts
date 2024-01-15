import { Schema, model } from 'mongoose';
import { UserAddress } from '@ecom/mern-shared';
import UserModel from './User';

export interface UserAddressDetails extends UserAddress {
  user_id: Schema.Types.ObjectId;
}

const Address_Country_State = new Schema(
  {
    name: { type: String, required: true, min: 2 },
    iso2: { type: String, required: true, min: 2 },
  },
  { _id: false }
);

const AddressSchema = new Schema<UserAddressDetails>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: UserModel, required: true },
    recipientName: { type: String, required: true, minLength: 2 },
    recipientPhone: { type: String, required: true, minLength: 5 },
    houseNo: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String, required: false, default: null },
    city: { type: String, required: true, minLength: 2 },
    state: { type: Address_Country_State, required: true },
    country: { type: Address_Country_State, required: true },
    zipCode: { type: String, required: true, minLength: 5 },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AddressModel = model('address', AddressSchema);

export default AddressModel;
