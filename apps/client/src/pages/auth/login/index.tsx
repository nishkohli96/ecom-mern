import { batch } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import { UserLogin } from '@ecom/mern-shared';
import {
  useAppDispatch,
  useUserLoginMutation,
  setUser,
  openToast,
  setToastMessage,
  setToastStatus,
} from 'redux-store';
import {
  FormPage,
  LinkText,
  MuiButton,
  RHFTextField,
  RHFPasswordField,
} from 'shared';
import RouteList from 'routes/route-list';
import LoginFormSchema from './schema';

const LoginForm = () => {
  const initialValues: UserLogin = {
    email: '',
    password: '',
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectUrl = location.state as string;
  const [userLogin] = useUserLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLogin>({
    defaultValues: initialValues,
    resolver: yupResolver(LoginFormSchema),
  });

  const onSubmit: SubmitHandler<UserLogin> = async formData => {
    userLogin(formData)
      .unwrap()
      .then(payload => {
        dispatch(setUser(payload));
        redirectUrl ? navigate(redirectUrl) : navigate(-1);
      })
      .catch(err =>
        batch(() => {
          dispatch(setToastMessage(err));
          dispatch(setToastStatus('error'));
          dispatch(openToast());
        }));
  };

  return (
    <FormPage formTitle="Sign in to your account">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <RHFTextField
              name="email"
              register={register}
              errorMsg={errors?.['email']?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <RHFPasswordField
              name="password"
              register={register}
              errorMsg={errors?.['password']?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Link
              to={`${RouteList.auth.rootPath}/${RouteList.auth.subPaths.verifyEmail}`}
              aria-label="Forgot Password Link"
            >
              <LinkText>Forgot Password</LinkText>
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Link
              to={`${RouteList.auth.rootPath}/${RouteList.auth.subPaths.signUp}`}
              aria-label="Sign up Link"
            >
              <LinkText>New User ? Sign Up</LinkText>
            </Link>
          </Grid>
          <Grid item xs={12}>
            <MuiButton text="Login" type="submit" disabled={isSubmitting} />
          </Grid>
        </Grid>
      </form>
    </FormPage>
  );
};

export default LoginForm;
