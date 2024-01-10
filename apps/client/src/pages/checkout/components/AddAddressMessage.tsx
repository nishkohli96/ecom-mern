import { Fragment } from 'react';
import Box from '@mui/material/Box';
import { StatusMessage, AddAddressButton } from 'shared';

export const AddAddressMessage = () => {
  return (
    <Fragment>
      <StatusMessage text="No saved addresses for your account" />
      <Box sx={{ mt: '1rem', display: 'flex', justifyContent: 'center' }}>
        <AddAddressButton text="Add New Address" />
      </Box>
    </Fragment>
  );
};
