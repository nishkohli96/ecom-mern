import { object, string, ObjectSchema } from 'yup';
import { UserPasswordChange, ConfirmPasswordType } from 'types';
import { fieldReqdMsg } from '../utils';

const pswdReqdMsg = fieldReqdMsg('your password');
export const pswdRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm;

const pswdRegexErrMsg = (fieldName: string) =>
  `${fieldName} must be of 8 chars, include uppercase, lowercase, number and a spl char`;
const pswdMatchText = 'Passwords do not match';

export const passwordValidation = {
  password: string()
    .required(pswdReqdMsg)
    .matches(pswdRegex, pswdRegexErrMsg('Password')),
};

export const passwordOptionalValidation = {
  password: string()
    .optional()
    .min(8)
    .matches(pswdRegex, pswdRegexErrMsg('Password')),
};

export const PasswordResetSchema: ObjectSchema<ConfirmPasswordType> =
  object().shape({
    new_password: string()
      .required(pswdReqdMsg)
      .matches(pswdRegex, pswdRegexErrMsg('New Password')),
    confirm_password: string()
      .required('Re-enter the same password as above')
      .matches(pswdRegex, pswdRegexErrMsg('Confirm Password'))
      .test('isEqual', pswdMatchText, (value, context) => {
        if (context.parent.new_password === value) return true;
        return false;
      }),
  });

export const PasswordChangeSchema: ObjectSchema<UserPasswordChange> =
  object().shape({
    ...passwordValidation,
    new_password: string()
      .required(pswdReqdMsg)
      .matches(pswdRegex, pswdRegexErrMsg('New Password')),
    confirm_password: string()
      .required('Re-enter the same password as above')
      .matches(pswdRegex, pswdRegexErrMsg('Confirm Password'))
      .test('isEqual', pswdMatchText, (value, context) => {
        if (context.parent.new_password === value) return true;
        return false;
      }),
  });
