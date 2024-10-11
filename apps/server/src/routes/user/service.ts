import { Response } from 'express';
import bcrypt from 'bcrypt';
import { ValidationError } from 'yup';
import { ENV_VARS } from '@/app-constants';
import { UserModel, TokenModel } from '@/models';
import {
  printFormValidationErrors,
  UserPasswordChange,
  ConfirmPasswordType,
  PasswordChangeSchema,
  PasswordResetQueryParams,
  PasswordResetSchema,
  UserAddress,
} from '@ecom/mern-shared';
import { hashPassword, errorLogger } from '@/utils';
import { AddUserSchema, UpdateUserSchema } from './validation';
import * as UserTypes from './types';
import razorpayService from '../razorpay/service';

class UserService {
  secretKey = ENV_VARS.auth.jwt_secret;

  async fetchUsers(res: Response) {
    try {
      /**
       * To select specific fields use,
       *  .select(['name','_id'])
       * To exclude a field, prefix '-' with
       * the field name
       */
      const usersList = await UserModel.find({}).select(['-__v']);
      res.status(200).send(usersList);
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async getUserById(res: Response, id: string) {
    try {
      const userInfo = await UserModel.findOne({ _id: id }).select([
        'name',
        'email',
        'avatar',
        'phone',
        '-_id',
      ]);
      res.status(200).send(userInfo);
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async addUser(res: Response, userData: UserTypes.AddUser) {
    try {
      await AddUserSchema.validate(userData, {
        abortEarly: false,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res
          .status(400)
          .send(printFormValidationErrors(error.errors))
          .end();
      }
    }
    /* Check if user already exists */
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser)
      return res
        .status(400)
        .send('It seems you already have an account, please log in instead.');
    try {
      const razorpay_customer = await razorpayService.createRazorpayCustomer({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        avatar: userData.avatar,
      });
      const newUser = new UserModel({
        ...userData,
        razorpay_customer_id: razorpay_customer.id,
      });
      const savedUser = await newUser.save();
      res.status(200).send({ _id: savedUser._id });
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async changePassword(res: Response, userData: UserPasswordChange) {
    /* form validation */
    try {
      await PasswordChangeSchema.validate(userData, {
        abortEarly: false,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res
          .status(400)
          .send(printFormValidationErrors(error.errors))
          .end();
      }
    }
    const email = res?.locals?.user?.email ?? '';
    const { password, new_password } = userData;

    try {
      const user = await UserModel.findOne({ email }).select('password');
      if (!user) {
        return res.status(404).send('User email not found').end();
      }

      /* Check if user password is correct */
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).send('Incorrect password. Please try again.');
      }

      const newPassword = await hashPassword(new_password);
      await UserModel.findByIdAndUpdate(user._id, { password: newPassword });

      return res
        .status(200)
        .send('Your password has been successfully changed')
        .end();
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async resetPassword(
    res: Response,
    userMetaData: PasswordResetQueryParams,
    userData: ConfirmPasswordType
  ) {
    /* form validation */
    try {
      await PasswordResetSchema.validate(userData, {
        abortEarly: false,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res
          .status(400)
          .send(printFormValidationErrors(error.errors))
          .end();
      }
    }
    const { id } = userMetaData;
    let passwordResetToken = await TokenModel.findOne({
      userId: id,
    });

    if (!passwordResetToken) {
      return res
        .status(400)
        .send('Invalid or expired password reset token')
        .end();
    }

    try {
      const user = await UserModel.findOne({ _id: id });
      if (!user) {
        return res.status(404).send('User email not found').end();
      }
      const newPassword = await hashPassword(userData.new_password);
      await UserModel.findByIdAndUpdate({ _id: id }, { password: newPassword });
      await TokenModel.deleteOne({ userId: id });

      return res
        .status(200)
        .send('Your password has been successfully changed')
        .end();
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async updateUser(
    res: Response,
    id: string,
    updateData: UserTypes.UpdateUser
  ) {
    try {
      await UpdateUserSchema.validate(updateData, {
        abortEarly: false,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res
          .status(400)
          .send(printFormValidationErrors(error.errors))
          .end();
      }
    }
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
        upsert: true,
        new: true,
      }).select([
        'name',
        'email',
        'avatar',
        'phone',
        'razorpay_customer_id',
        '-_id',
      ]);

      /* Update razorpay customer details */
      await razorpayService.editRazorpayCustomerDetails(
        updatedUser.razorpay_customer_id,
        {
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
        }
      );

      res.status(200).send(updatedUser);
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async deleteUserById(res: Response, id: string) {
    try {
      const deletedUser = await UserModel.findByIdAndDelete({ _id: id });
      res.status(200).send(deletedUser);
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async getUserAddressList(res: Response, user_id: string) {
    try {
      const addressList = await UserModel.findOne({ _id: user_id }).select(
        'addresses'
      );
      res.status(200).send(addressList?.addresses);
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async addToUserAddressList(
    res: Response,
    user_id: string,
    addressDetails: UserAddress
  ) {
    try {
      const addressList = await UserModel.findOne({ _id: user_id }).select(
        'addresses'
      );
      await UserModel.updateOne(
        { _id: user_id },
        {
          $push: {
            addresses: {
              ...addressDetails,
              isDefault: addressList?.addresses.length === 0 ? true : false,
            },
          },
        }
      );
      return res.status(200).send('Address Added');
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async updateUserAddress(
    res: Response,
    user_id: string,
    updatedAddress: UserTypes.UserAddressDocument
  ) {
    const { _id, ...addressInfo } = updatedAddress;
    try {
      await UserModel.updateOne(
        {
          _id: user_id,
          'addresses._id': _id,
        },
        {
          // { <update operator>: { "<array>.$[]" : value } }
          $set: {
            'addresses.$.recipientName': addressInfo.recipientName,
            'addresses.$.recipientPhone': addressInfo.recipientPhone,
            'addresses.$.country': addressInfo.country,
            'addresses.$.state': addressInfo.state,
            'addresses.$.city': addressInfo.city,
            'addresses.$.houseNo': addressInfo.houseNo,
            'addresses.$.street': addressInfo.street,
            'addresses.$.landmark': addressInfo.landmark,
            'addresses.$.zipCode': addressInfo.zipCode,
            'addresses.$.isDefault': addressInfo.isDefault,
          },
        }
      );
      res.status(200).send('Address Updated');
    } catch (err: any) {
      errorLogger(res, err);
    }
  }

  async changeDefaultAddress(user_id: string, defaultAddressId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        /* Set the previous default address to false */
        await UserModel.updateOne(
          { _id: user_id, 'addresses.isDefault': true },
          {
            $set: {
              'addresses.$.isDefault': false,
            },
          }
        );
        /**
         * Commented code is applying changes to all
         * elements in an array of objects that (not) meet
         * a certain criteria
         */
        // await UserModel.updateOne(
        //   { _id: user_id },
        //   { $set: { 'addresses.$[ele].isDefault': false } },
        //   { arrayFilters: [{ "ele._id": { $ne: defaultAddressId }}] }
        // );
        await UserModel.updateOne(
          { _id: user_id, 'addresses._id': defaultAddressId },
          {
            $set: {
              'addresses.$.isDefault': true,
            },
          }
        );
        resolve('Default Address Changed');
      } catch (err: any) {
        reject(err);
      }
    });
  }

  setDefaultUserAddress(
    res: Response,
    user_id: string,
    defaultAddressId: string
  ) {
    this.changeDefaultAddress(user_id, defaultAddressId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        errorLogger(res, err);
      });
  }

  async deleteUserAddress(
    res: Response,
    user_id: string,
    delete_addressId: string
  ) {
    try {
      const userAddresses = await UserModel.findOne({
        _id: user_id,
        'addresses._id': delete_addressId,
      }).select('addresses');

      const defaultAddr = userAddresses?.addresses?.find(
        (addr) => addr.isDefault === true
      );
      if (defaultAddr?._id.toString() === delete_addressId) {
        return res
          .status(400)
          .send(
            'Cannot delete default address. Change your default address and then delete this address'
          );
      }
      await UserModel.updateOne(
        { _id: user_id, 'addresses._id': delete_addressId },
        { $pop: { addresses: 1 } }
      );
      res.status(200).send('Address Deleted');
    } catch (err: any) {
      errorLogger(res, err);
    }
  }
}

export default UserService;
