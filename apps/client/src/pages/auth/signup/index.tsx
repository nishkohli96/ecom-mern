import Grid from '@mui/material/Grid';
import { UserProfileDetails } from '@ecom-mern/shared';
import { Header5Text, CenterContent, FormContainer, ProfileForm } from 'shared';

const SignUpForm = () => {
  const initialValues: UserProfileDetails = {
    name: { first: '', last: '' },
    email: '',
    phone: '',
    avatar: ''
  };

  const onFormSubmit = (values: UserProfileDetails) => {};

  return (
    <CenterContent>
      <Header5Text>Create Your Account</Header5Text>
      <FormContainer>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ProfileForm
              initialValues={initialValues}
              onFormSubmit={onFormSubmit}
              actionBtnText="Sign Up"
            />
          </Grid>
        </Grid>
      </FormContainer>
    </CenterContent>
  );
};

export default SignUpForm;
