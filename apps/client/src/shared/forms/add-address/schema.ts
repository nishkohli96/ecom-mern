import { object, ObjectSchema } from 'yup';
import { UserAddress, addressValidation } from '@ecom-mern/shared';

export const AddressFormSchema: ObjectSchema<UserAddress> = object()
  .shape({
    ...addressValidation,
  })
  .required();
