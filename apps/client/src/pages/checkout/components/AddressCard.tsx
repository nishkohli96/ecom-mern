import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { UserAddressInfo } from 'shared';

type AddressCardProps = {
  address: UserAddressInfo;
  selectedAddress: string;
  onAddressChange: (newAddrId: string) => void;
};

export const AddressCard = ({
  address,
  selectedAddress,
  onAddressChange,
}: AddressCardProps) => {
  const { _id, recipientName, recipientPhone, isDefault, ...addressDetails } =
    address;
  const isSelected = Boolean(selectedAddress)
    ? _id == selectedAddress
    : isDefault;

  /**
   *  Set opacity for hex colors -
   *  https://stackoverflow.com/questions/7015302/css-hexadecimal-rgba
   */

  return (
    <Paper
      sx={{
        marginBottom: '1rem',
        padding: '1rem',
        ...(isSelected && {
          backgroundColor: (theme) => `${theme.palette.warning.main}BF`,
        }),
      }}
    >
      <FormControlLabel
        value={_id}
        control={
          <Radio
            checked={isSelected}
            onChange={(e) => onAddressChange(e.target.value)}
          />
        }
        label={
          <Grid container spacing={1} sx={{ paddingLeft: '1rem' }}>
            <Grid item xs={12}>
              <b>{recipientName}</b>
            </Grid>
            <Grid item xs={12}>
              {`${addressDetails.houseNo}, ${addressDetails.street}, `}
              {Boolean(addressDetails.landmark) &&
                `${addressDetails.landmark}, `}
              {`${
                addressDetails.city
              }, ${addressDetails.state.name.toUpperCase()}, `}
              {`${addressDetails.zipCode}, ${addressDetails.country.name}`}
            </Grid>
            <Grid item xs={12}>
              Phone number: {recipientPhone}
            </Grid>
          </Grid>
        }
      />
    </Paper>
  );
};
