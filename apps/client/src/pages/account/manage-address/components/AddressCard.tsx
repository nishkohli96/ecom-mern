import { useState } from 'react';
import { batch } from 'react-redux';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserAddress } from '@ecom/mern-shared';
import {
  useAppDispatch,
  useUpdateUserAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
  setToastMessage,
  setToastStatus,
  openToast,
} from 'redux-store';
import {
  AddressText,
  MuiPaper,
  UserAddressInfo,
  ConfirmationDialog,
} from 'shared';
import { UpdateAddressForm } from './UpdateAddressForm';

type AddressCardProps = {
  address: UserAddressInfo;
  user_id: string;
};

export const AddressCard = ({ address, user_id }: AddressCardProps) => {
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [openDefAddrConfirm, setOpenDefAddrConfirm] = useState<boolean>(false);
  const [openDeleteAddrConfirm, setOpenDeleteAddrConfirm]
    = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const [updateAddress] = useUpdateUserAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const { _id, recipientName, recipientPhone, isDefault, ...addressDetails }
    = address;

  const onAddressEdit = (formValues: UserAddress) => {
    updateAddress({
      id: user_id,
      _id,
      ...formValues,
    })
      .unwrap()
      .then(resp => {
        batch(() => {
          dispatch(setToastMessage(resp));
          dispatch(setToastStatus('success'));
          dispatch(openToast());
        });
        setOpenForm(false);
      })
      .catch(err =>
        batch(() => {
          dispatch(setToastMessage(err));
          dispatch(setToastStatus('error'));
          dispatch(openToast());
        }));
  };

  const handleDefaultAddressChange = () => {
    setDefaultAddress({ id: user_id, address_id: address._id })
      .unwrap()
      .then(resp => {
        batch(() => {
          dispatch(setToastMessage(resp));
          dispatch(setToastStatus('success'));
          dispatch(openToast());
        });
      })
      .catch(err =>
        batch(() => {
          dispatch(setToastMessage(err));
          dispatch(setToastStatus('error'));
          dispatch(openToast());
        }));
  };

  const handleAddressDeletion = () => {
    deleteAddress({ id: user_id, address_id: address._id })
      .unwrap()
      .then(resp => {
        batch(() => {
          dispatch(setToastMessage(resp));
          dispatch(setToastStatus('success'));
          dispatch(openToast());
        });
      })
      .catch(err =>
        batch(() => {
          dispatch(setToastMessage(err));
          dispatch(setToastStatus('error'));
          dispatch(openToast());
        }));
  };

  return (
    <MuiPaper>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <b>
            {recipientName}
          </b>
        </Grid>
        <Grid item xs={12}>
          <AddressText addressDetails={addressDetails} />
        </Grid>
        <Grid item xs={12}>
          Phone number:
          {' '}
          {recipientPhone}
        </Grid>
        <Grid container item xs={12} spacing={1} sx={{ mt: { md: '0.5rem' } }}>
          <Grid item xs={12} lg={6}>
            {isDefault ? (
              <Button disabled sx={{ pl: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    color: theme => theme.palette.warning.main,
                  }}
                >
                  Default Delivery Address
                </Typography>
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => setOpenDefAddrConfirm(true)}
              >
                Set as Default
              </Button>
            )}
          </Grid>
          <Grid
            container
            item
            xs={12}
            lg={6}
            sx={{ display: 'flex', justifyContent: { lg: 'flex-end' } }}
          >
            <Button
              variant="outlined"
              endIcon={<EditIcon />}
              onClick={() => setOpenForm(true)}
              sx={{ mr: '1rem' }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              endIcon={<DeleteIcon />}
              onClick={() => setOpenDeleteAddrConfirm(true)}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {openDefAddrConfirm && (
            <ConfirmationDialog
              open={openDefAddrConfirm}
              confirmBtnText="Yes"
              cancelBtnText="No"
              title="Change Default Address ?"
              dialogContent={
                <AddressText addressDetails={addressDetails} maxWidth />
              }
              handleClose={() => setOpenDefAddrConfirm(false)}
              onConfirm={() => handleDefaultAddressChange()}
            />
          )}
          {openDeleteAddrConfirm && (
            <ConfirmationDialog
              open={openDeleteAddrConfirm}
              confirmBtnText="Yes"
              cancelBtnText="No"
              title="Delete this Address ?"
              dialogContent={
                <AddressText addressDetails={addressDetails} maxWidth />
              }
              handleClose={() => setOpenDeleteAddrConfirm(false)}
              onConfirm={() => handleAddressDeletion()}
            />
          )}
          {openForm && (
            <UpdateAddressForm
              open={openForm}
              handleClose={() => setOpenForm(false)}
              title="Edit Address"
              onFormSubmit={onAddressEdit}
              actionBtnText="Update"
              initialValues={{
                recipientName,
                recipientPhone,
                isDefault,
                ...addressDetails,
              }}
            />
          )}
        </Grid>
      </Grid>
    </MuiPaper>
  );
};
