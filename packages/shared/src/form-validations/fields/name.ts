import { object, string } from 'yup';
import { minCharMsg, fieldReqdMsg } from '../utils';

const minLen_fName = 2;
const minLen_lName = 2;

const nameValidationError = 'Please enter a valid name';
export const nameRegex = /^[a-zA-Z]{1}[a-zA-Z ,.'-]+$/;

export const nameValidation = {
  name: object().shape({
    first: string()
      .required(fieldReqdMsg('your first name'))
      .min(minLen_fName, minCharMsg('First Name', minLen_fName))
      .matches(nameRegex, nameValidationError),
    last: string()
      .required(fieldReqdMsg('your last name'))
      .min(minLen_lName, minCharMsg('Last Name', minLen_lName))
      .matches(nameRegex, nameValidationError),
  }),
};
