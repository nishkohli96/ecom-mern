import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import { UserProfileDetails } from '@ecom-mern/shared';
import { RHFTextField, MuiButton, PhoneInput } from 'shared';
import ProfileFormSchema from './schema';

interface ProfileFormProps {
  initialValues: UserProfileDetails;
  onFormSubmit: (formData: UserProfileDetails) => void;
  actionBtnText: string;
}

export const ProfileForm = ({
  initialValues,
  onFormSubmit,
  actionBtnText
}: ProfileFormProps) => {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(ProfileFormSchema)
  });

  const setPhoneValue = (value: string) =>
    setValue('phone', value, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true
    });

  /* https://www.npmjs.com/package/react-beforeunload */
  const beforeunload = (event: BeforeUnloadEvent) => {
    if (isDirty) {
      /* doesn't work, so this event handler doesn't do anything */
      event.preventDefault();
      /* Included for legacy support, e.g. Chrome/Edge < 119 */
      event.returnValue = true;
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', beforeunload);
    return () => {
      window.removeEventListener('beforeunload', beforeunload);
    };
  }, [isDirty]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <img
            src={initialValues.avatar}
            alt={`pic of ${initialValues.name.first} ${initialValues.name.last}`}
          />
        </Grid>
        <Grid item xs={6}>
          <RHFTextField name="email" register={register} disabled />
        </Grid>
        <Grid item xs={6}>
          <RHFTextField
            name="name.first"
            register={register}
            label="First Name"
            errorMsg={errors?.name?.first?.message}
          />
        </Grid>
        <Grid item xs={6}>
          <RHFTextField
            name="name.last"
            register={register}
            label="Last Name"
            errorMsg={errors?.name?.last?.message}
          />
        </Grid>
        <Grid item xs={6}>
          <PhoneInput
            value={getValues('phone')}
            onChange={setPhoneValue}
            errorMsg={errors?.phone?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <MuiButton text={actionBtnText} type="submit" disabled={!isDirty} />
        </Grid>
      </Grid>
    </form>
  );
};
