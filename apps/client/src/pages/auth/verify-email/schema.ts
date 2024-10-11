import { object, ObjectSchema } from 'yup';
import { emailValidation, VerifyUserEmail } from '@ecom-mern/shared';

export const EmailSchema: ObjectSchema<VerifyUserEmail> = object().shape({
  ...emailValidation,
});
