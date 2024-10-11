import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { batch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import { PasswordResetSchema, ConfirmPasswordType } from '@ecom-mern/shared';
import {
  useAppDispatch,
  openToast,
  setToastMessage,
  setToastStatus,
  useResetUserPasswordMutation,
} from 'redux-store';
import { FormPage, RHFPasswordField, MuiButton } from 'shared';
import RouteList from 'routes/route-list';

const ResetPswdPage = () => {
  const initialValues: ConfirmPasswordType = {
    new_password: '',
    confirm_password: '',
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const id = searchParams.get('id') ?? '';
  const [resetUserPassword] = useResetUserPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmPasswordType>({
    defaultValues: initialValues,
    resolver: yupResolver(PasswordResetSchema),
  });

  const onFormSubmit = (formData: ConfirmPasswordType) => {
    resetUserPassword({ id, token, ...formData })
      .unwrap()
      .then((response) => {
        batch(() => {
          dispatch(setToastMessage(response));
          dispatch(setToastStatus('success'));
          dispatch(openToast());
        });
        navigate(RouteList.auth.subPaths.login);
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
    <FormPage formTitle="Generate new Password">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RHFPasswordField
              name="new_password"
              register={register}
              label="New Password"
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
            <MuiButton text="Submit" type="submit" />
          </Grid>
        </Grid>
      </form>
    </FormPage>
  );
};

export default ResetPswdPage;
