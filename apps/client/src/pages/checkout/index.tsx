import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { batch } from 'react-redux';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import RadioGroup from '@mui/material/RadioGroup';
import {
  useAppSelector,
  useAppDispatch,
  UserSelector,
  UserCartSelector,
  useGetUserAddressesQuery,
  useCreateOrderMutation,
  setToastMessage,
  setToastStatus,
  openToast,
  GuestUserData,
} from 'redux-store';
import {
  Header3Text,
  CenterContent,
  Loading,
  PurchaseDetails,
  PurchaseSummary,
} from 'shared';
import { AddressCard, AddAddressMessage, RazorpayCheckout } from './components';

const AddressSelectionPage = () => {
  const location = useLocation();
  const purchaseInfo = location.state as PurchaseDetails;
  const billAmount = Number(purchaseInfo?.cartTotal ?? 0) * 100;

  const dispatch = useAppDispatch();
  const user = useAppSelector(UserSelector);
  const userCart = useAppSelector(UserCartSelector);
  const {
    data: addressList,
    isLoading,
    isFetching,
  } = useGetUserAddressesQuery(user?._id ?? '');
  const [addrId, setAddrId] = useState<string>('');

  useEffect(() => {
    const defaultAddress = addressList?.find(addr => addr.isDefault);
    const defaultAddressId = defaultAddress?._id ?? '';
    setAddrId(defaultAddressId);
  }, [addressList]);

  const [createOrder] = useCreateOrderMutation();

  const [showRzp, setShowRzp] = useState<boolean>(false);
  const [rzpOrderId, setRzpOrderId] = useState<string>('');
  const [rzpCustomerId, setRzpCustomerId] = useState<string>('');

  const handleOrderPayment = () => {
    createOrder({
      amount: billAmount,
      customerId: user?._id ?? '',
      deliveryAddressId: addrId,
      products: purchaseInfo.products ?? userCart.products,
      fromCart: Boolean(purchaseInfo.fromCart),
    })
      .unwrap()
      .then(response => {
        setShowRzp(true);
        setRzpOrderId(response.orderId);
        setRzpCustomerId(response.razorpay_customer_id);
      })
      .catch(error => {
        batch(() => {
          dispatch(setToastMessage(error));
          dispatch(setToastStatus('error'));
          dispatch(openToast());
        });
      });
  };

  return (
    <Box>
      <CenterContent>
        <Header3Text>Select Delivery Address</Header3Text>
      </CenterContent>
      <Grid
        container
        sx={{ mt: '0.5rem' }}
        direction={{ xs: 'column-reverse', md: 'row' }}
        spacing={2}
      >
        <Grid item xs={12} md={8}>
          {isLoading || isFetching ? (
            <Loading />
          ) : addressList && addressList?.length > 0 ? (
            <FormControl>
              <RadioGroup
                aria-labelledby="delivery-address-selection"
                name="delivery-address-selection"
              >
                {addressList?.map(address => (
                  <AddressCard
                    address={address}
                    selectedAddress={addrId}
                    onAddressChange={setAddrId}
                    key={address._id}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ) : (
            <AddAddressMessage />
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <PurchaseSummary
            cartTotal={purchaseInfo.cartTotal}
            numItems={purchaseInfo.numItems}
            nextBtnText="Proceed for Payment"
            nextBtnOnClick={handleOrderPayment}
            disableBtn={!addressList?.length}
          />
        </Grid>
      </Grid>
      {showRzp && (
        <RazorpayCheckout
          amount={billAmount}
          customer={user ?? GuestUserData}
          orderId={rzpOrderId}
          rzpCustomerId={rzpCustomerId}
        />
      )}
    </Box>
  );
};

export default AddressSelectionPage;
