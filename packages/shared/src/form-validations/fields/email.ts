import { string } from 'yup';
import { fieldReqdMsg } from '../utils';

const emailReqdMsg = fieldReqdMsg('your registered email id');
const emailErrorMsg = 'Please enter a valid email id';
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9_]+\.[a-zA-Z]{2,3}$/gm;

export const emailValidation = {
  email: string()
    .required(emailReqdMsg)
    .email(emailErrorMsg)
    .matches(emailRegex, emailErrorMsg)
};
