import { object, ObjectSchema } from 'yup';
import {
  emailValidation,
  avatarValidation,
  nameValidation,
  phoneValidation,
  UserProfileDetails,
} from '@ecom-mern/shared';

const ProfileFormSchema: ObjectSchema<UserProfileDetails> = object()
  .shape({
    ...emailValidation,
    ...avatarValidation,
    ...nameValidation,
    ...phoneValidation,
  })
  .required();

export default ProfileFormSchema;
