import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { batch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import { PasswordChangeSchema, UserPasswordChange } from '@ecom-mern/shared';
import {
  useAppDispatch,
  useChangePasswordMutation,
  openToast,
  setToastMessage,
  setToastStatus,
} from 'redux-store';
import { FormPage, RHFPasswordField, MuiButton } from 'shared';

const ChangePswdPage = () => {
  const [changeUserPassword] = useChangePasswordMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues: UserPasswordChange = {
    password: '',
    new_password: '',
    confirm_password: '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserPasswordChange>({
    defaultValues: initialValues,
    resolver: yupResolver(PasswordChangeSchema),
  });

  const onFormSubmit = (formData: UserPasswordChange) => {
    changeUserPassword(formData)
      .unwrap()
      .then((response) => {
        batch(() => {
          dispatch(setToastMessage(response));
          dispatch(setToastStatus('success'));
          dispatch(openToast());
        });
        navigate('/profile');
      })
      .catch((error) => {
        batch(() => {
          dispatch(setToastMessage(error));
          dispatch(setToastStatus('error'));
          dispatch(openToast());
        });
      });
  };

  return (
    <FormPage>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RHFPasswordField
              name="password"
              label="Current Password"
              register={register}
              errorMsg={errors?.password?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <RHFPasswordField
              name="new_password"
              label="New Password"
              register={register}
              placeholder="Enter new password"
              errorMsg={errors?.new_password?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <RHFPasswordField
              name="confirm_password"
              label="Retype Password"
              register={register}
              placeholder="Re-enter new password"
              errorMsg={errors?.confirm_password?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiButton text="Change Password" type="submit" />
          </Grid>
        </Grid>
      </form>
    </FormPage>
  );
};

export default ChangePswdPage;
