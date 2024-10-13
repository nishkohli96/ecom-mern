import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RouteList from 'routes/route-list';
import { AccountOption, AccountOptionObject } from './components';

const AccountPage = () => {
  const accountOptions: AccountOptionObject[] = [
    {
      title: 'Manage Orders',
      description: 'View or cancel Order, download invoice',
      to: RouteList.account.subPaths.orders,
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />
    },
    {
      title: 'Manage Addresses',
      description: 'View, add, edit or delete your addresses',
      to: RouteList.account.subPaths.address,
      icon: <LocationOnIcon sx={{ fontSize: 40 }} />
    }
  ];
  return (
    <Container>
      <Paper>
        <Grid container sx={{ padding: '1rem 1rem' }}>
          {accountOptions.map((acc, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <AccountOption {...acc} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default AccountPage;
