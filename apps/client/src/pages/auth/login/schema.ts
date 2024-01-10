import { object, ObjectSchema } from 'yup';
import {
  emailValidation,
  passwordValidation,
  UserLogin,
} from '@ecom/mern-shared';

const LoginFormSchema: ObjectSchema<UserLogin> = object()
  .shape({
    ...emailValidation,
    ...passwordValidation,
  })
  .required();

export default LoginFormSchema;
