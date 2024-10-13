import { string, object, boolean } from 'yup';
import { fieldReqdMsg, fieldSelectMsg } from '../utils';

export const addressValidation = {
  recipientName: string().required(fieldReqdMsg('recipient name')).min(2),
  recipientPhone: string()
    .required(fieldReqdMsg('recipient phone number'))
    .min(3),
  houseNo: string().required(fieldReqdMsg('your house number')),
  street: string().required(fieldReqdMsg('your street name')),
  landmark: string().default(''),
  city: string().required(fieldSelectMsg('your city')),
  state: object().shape({
    name: string().required(fieldSelectMsg('your state')).min(2),
    iso2: string().required().min(2)
  }),
  country: object().shape({
    name: string().required(fieldSelectMsg('your country')).min(2),
    iso2: string().required().min(2)
  }),
  zipCode: string().required(fieldReqdMsg('your pin code')).min(5),
  isDefault: boolean().required().default(false)
};
