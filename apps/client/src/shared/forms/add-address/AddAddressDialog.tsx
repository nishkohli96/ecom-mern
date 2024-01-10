import { batch } from 'react-redux';
import { UserAddress, defaultCountryState } from '@ecom/mern-shared';
import {
  useAppSelector,
  useAppDispatch,
  useAddUserAddressMutation,
  UserSelector,
  setToastStatus,
  setToastMessage,
  openToast,
} from 'redux-store';
import AddAddressForm from './AddAddressForm';

interface AddAddressDialogProps {
  open: boolean;
  handleClose: () => void;
}

const AddAddressDialog = ({ open, handleClose }: AddAddressDialogProps) => {
  const user = useAppSelector(UserSelector);
  const dispatch = useAppDispatch();
  const [addUserAddress] = useAddUserAddressMutation();

  const initialValues: UserAddress = {
    recipientName: Boolean(user)
      ? `${user?.name.first} ${user?.name.last}`
      : '',
    recipientPhone: Boolean(user) ? `${user?.phone}` : '',
    houseNo: '',
    street: '',
    landmark: '',
    city: '',
    state: defaultCountryState,
    country: defaultCountryState,
    zipCode: '',
    isDefault: false,
  };

  const onFormSubmit = (formValues: UserAddress) => {
    addUserAddress({
      ...formValues,
      id: user?._id ?? '',
    })
      .unwrap()
      .then((resp) => {
        handleClose();
        batch(() => {
          dispatch(setToastMessage(resp));
          dispatch(setToastStatus('success'));
          dispatch(openToast());
        });
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
    <AddAddressForm
      open={open}
      handleClose={handleClose}
      title="Add New Address"
      initialValues={initialValues}
      onFormSubmit={onFormSubmit}
      actionBtnText="Add"
    />
  );
};

export default AddAddressDialog;
