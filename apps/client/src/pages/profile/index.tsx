import { batch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { UserProfileDetails } from '@ecom-mern/shared';
import {
  useAppSelector,
  useAppDispatch,
  useUpdateUserDetailsMutation,
  UserSelector,
  setUser,
  setToastMessage,
  setToastStatus,
  openToast,
} from 'redux-store';
import {
  Header5Text,
  CenterContent,
  StatusMessage,
  LinkText,
  FormContainer,
  ProfileForm,
} from 'shared';
import RouteList from 'routes/route-list';

const UserProfilePage = () => {
  const user = useAppSelector(UserSelector);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userUpdate] = useUpdateUserDetailsMutation();

  if (!user) {
    return <StatusMessage text="no user data" />;
  }
  const { _id, ...userData } = user;

  const onFormSubmit = (formData: UserProfileDetails) => {
    userUpdate({
      _id,
      ...formData,
    })
      .unwrap()
      .then((payload) => {
        batch(() => {
          dispatch(setUser({ _id, ...payload }));
          dispatch(setToastMessage('User Details Updated'));
          dispatch(setToastStatus('success'));
          dispatch(openToast());
        });
        navigate('/');
      })
      .catch((err) =>
        batch(() => {
          dispatch(setToastMessage(err));
          dispatch(setToastStatus('error'));
          dispatch(openToast());
        })
      );
  };

  return (
    <CenterContent>
      <Header5Text>My Profile</Header5Text>
      <FormContainer>
        <Grid container spacing={3}>
          <Grid container item xs={12}>
            <ProfileForm
              initialValues={userData}
              onFormSubmit={onFormSubmit}
              actionBtnText="Update"
            />
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={12} md={4}>
              <Link
                to={RouteList.profile.subPaths.changePswd}
                aria-label="Change user password"
              >
                <LinkText>Change Password</LinkText>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </FormContainer>
    </CenterContent>
  );
};

export default UserProfilePage;
