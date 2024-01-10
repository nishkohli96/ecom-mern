import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {
  useAppSelector,
  UserSelector,
  UserCartSelector,
  GuestCartSelector,
  useGetCartProductsQuery,
} from 'redux-store';
import { Header3Text, Loading, StatusMessage } from 'shared';
import { CartGroceryCard, CartTotal } from './components';

const CartPage = () => {
  const user = useAppSelector(UserSelector);
  const userCart = useAppSelector(user ? UserCartSelector : GuestCartSelector);
  const cartProductIds = userCart.products
    .map((prod) => prod.product_id)
    .join(',');

  const {
    data: cartGroceries,
    isLoading,
    isFetching,
  } = useGetCartProductsQuery(cartProductIds);

  if (isLoading || isFetching) {
    return <Loading />;
  }

  if (userCart.products.length === 0) {
    return <StatusMessage text="Looks like your cart is empty :(" />;
  }

  return (
    <Box>
      <Header3Text>
        {user ? `${user.name.first}'s` : 'Your'} Shopping Cart
      </Header3Text>
      <Grid
        container
        sx={{ mt: '0.5rem' }}
        direction={{ xs: 'column-reverse', md: 'row' }}
        spacing={2}
      >
        <Grid item xs={12} md={8}>
          {cartGroceries?.map((cg, idx) => (
            <CartGroceryCard
              grocery={cg}
              quantity={userCart.products[idx].quantity}
              user_id={user?._id ?? ''}
              cart_id={userCart.cart_id ?? ''}
              key={idx}
            />
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <CartTotal
            productsInfo={cartGroceries ?? []}
            cartData={userCart.products}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;
