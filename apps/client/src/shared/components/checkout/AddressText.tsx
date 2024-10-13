import Grid from '@mui/material/Grid';
import { UserAddress } from '@ecom-mern/shared';

export type DeliveryAddress = Pick<
  UserAddress,
  'houseNo' | 'street' | 'landmark' | 'city' | 'state' | 'zipCode' | 'country'
>;

type AddressTextProps = {
  addressDetails: DeliveryAddress;
  maxWidth?: boolean;
};

export const AddressText = ({ addressDetails, maxWidth }: AddressTextProps) => (
  <Grid container maxWidth={maxWidth ? 300 : 'auto'}>
    <Grid item xs={12}>
      {`${addressDetails.houseNo}, ${addressDetails.street}`}
      {Boolean(addressDetails.landmark) && `, ${addressDetails.landmark}`}
    </Grid>
    <Grid item xs={12}>
      {`${addressDetails.city}, ${addressDetails.state.name} - ${addressDetails.zipCode}`}
    </Grid>
    <Grid item xs={12}>
      {addressDetails.country.name}
    </Grid>
  </Grid>
);
