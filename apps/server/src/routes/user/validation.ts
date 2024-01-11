import { object, string, ObjectSchema } from 'yup';
import {
  avatarValidation,
  avatarOptionalValidation,
  emailValidation,
  nameValidation,
  phoneValidation,
  passwordValidation,
  passwordOptionalValidation,
} from '@ecom/mern-shared';
import { UserRole } from 'models/User';
import * as UserTypes from './types';

const BasicUserInfoSchema = {
  ...nameValidation,
  ...emailValidation,
  ...phoneValidation,
  ...avatarValidation,
  role: string().optional().oneOf(Object.values(UserRole)),
};

export const AddUserSchema: ObjectSchema<UserTypes.AddUser> = object()
  .shape({
    ...BasicUserInfoSchema,
    ...passwordValidation,
  })
  .required();

export const UpdateUserSchema: ObjectSchema<UserTypes.UpdateUser> = object()
  .shape({
    ...BasicUserInfoSchema,
    ...avatarOptionalValidation,
    ...passwordOptionalValidation,
  })
  .required();
