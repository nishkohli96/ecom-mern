import { object, ObjectSchema } from 'yup';
import {
  emailValidation,
  passwordValidation,
  VerifyUserEmail,
} from '@ecom-mern/shared';

export const EmailSchema: ObjectSchema<VerifyUserEmail> = object().shape({
  ...emailValidation,
});

export const PasswordResetSchema = object().shape({
  ...passwordValidation,
});
