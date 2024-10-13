import { string } from 'yup';

const avatarReqdMsg = 'Please upload your profile picture';

export const avatarValidation = {
  avatar: string().required(avatarReqdMsg).url()
};

export const avatarOptionalValidation = {
  avatar: string().optional().url()
};
