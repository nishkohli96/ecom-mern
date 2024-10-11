import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { batch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { VerifyUserEmail } from '@ecom-mern/shared';
import {
  useAppDispatch,
  useInitiatePasswordResetMutation,
  openToast,
  setToastMessage,
  setToastStatus,
} from 'redux-store';
import { FormPage, RHFTextField, MuiButton } from 'shared';
import RouteList from 'routes/route-list';
import { EmailSchema } from './schema';

const VerifyEmailPage = () => {
  const initialValues: VerifyUserEmail = {
    email: '',
  };

  const [initiatePasswordReset] = useInitiatePasswordResetMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyUserEmail>({
    defaultValues: initialValues,
    resolver: yupResolver(EmailSchema),
  });

  const onFormSubmit = (formData: VerifyUserEmail) => {
    initiatePasswordReset(formData)
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
    <FormPage formTitle="Recover your password">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <RHFTextField
          name="email"
          register={register}
          placeholder="Enter registered email"
          errorMsg={errors?.email?.message}
        />
        <MuiButton text="Next" type="submit" sx={{ marginTop: '1.5rem' }} />
      </form>
    </FormPage>
  );
};

export default VerifyEmailPage;
