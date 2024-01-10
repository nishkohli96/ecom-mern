import { useState } from 'react';
import { batch } from 'react-redux';
import Grid from '@mui/material/Grid';
import {
  useAppSelector,
  useAppDispatch,
  useGetUserAddressesQuery,
  UserSelector,
  setToastMessage,
  setToastStatus,
  openToast,
} from 'redux-store';
import { Header4Text, Loading, StatusMessage, AddAddressButton } from 'shared';
import { AddressCard } from './components';

const AddressList = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(UserSelector);
  const {
    data: addressList,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetUserAddressesQuery(user?._id ?? '');

  if (isError) {
    batch(() => {
      dispatch(setToastMessage(JSON.stringify(error)));
      dispatch(setToastStatus('error'));
      dispatch(openToast());
    });
  }

  return (
    <Grid container sx={{ padding: { md: '0 2rem' } }}>
      <Grid
        item
        xs={9}
        sx={{
          display: 'flex',
          justifyContent: { xs: 'flex-start', md: 'center' },
        }}
      >
        <Header4Text>Your Saved Addresses</Header4Text>
      </Grid>
      <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <AddAddressButton text="Add" />
      </Grid>
      <Grid container item xs={12} spacing={2} sx={{ mt: '1.5rem ' }}>
        {isLoading || isFetching ? (
          <Loading />
        ) : addressList && addressList?.length > 0 ? (
          addressList?.map((address) => (
            <Grid item xs={12} sm={6} key={address._id}>
              <AddressCard address={address} user_id={user?._id ?? ''} />
            </Grid>
          ))
        ) : (
          <StatusMessage text="No saved addresses for your account" />
        )}
      </Grid>
    </Grid>
  );
};

export default AddressList;
