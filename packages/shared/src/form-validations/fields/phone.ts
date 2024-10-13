import { string } from 'yup';
import { fieldReqdMsg } from '../utils';

const phoneReqdMsg = fieldReqdMsg('your phone number');

export const phoneValidation = {
  phone: string().required(phoneReqdMsg).min(10)
};
