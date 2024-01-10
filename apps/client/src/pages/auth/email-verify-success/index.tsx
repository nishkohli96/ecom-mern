import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import RouteList from 'routes/route-list';
import { StatusMessage } from 'shared';

const EmailVerifySuccessPage = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <StatusMessage text="Congratulations! Your email has been verified." />
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Link to={RouteList.auth.subPaths.login} aria-label="Link to login">
          Sign in
        </Link>
      </Grid>
    </Grid>
  );
};

export default EmailVerifySuccessPage;
