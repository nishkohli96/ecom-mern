import { batch } from 'react-redux';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Paper,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { GroceryItem } from '@ecom/mern-shared';
import {
  useAppDispatch,
  openToast,
  setToastMessage,
  setToastStatus,
  addProductToGuestCart,
  removeProductFromGuestCart,
  useUpdateOrRemoveProductMutation,
} from 'redux-store';
import AlgoliaConfig from 'constants/algolia-config';
import {
  Header5Text,
  Header6Text,
  PrimaryText,
  PriceCompare,
  QuantitySelector,
} from 'shared';
import RouteList from 'routes/route-list';

interface GroceryCardProps {
  grocery: GroceryItem;
  quantity: number;
  user_id: string;
  cart_id: string;
}

const CartGroceryCard = ({
  user_id,
  cart_id,
  grocery,
  quantity,
}: GroceryCardProps) => {
  const dispatch = useAppDispatch();
  const [updateCartProduct] = useUpdateOrRemoveProductMutation();

  const copyGroceryLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}${RouteList.grocery}/${grocery.handle}`
    );
    batch(() => {
      dispatch(setToastMessage('Product link copied to clipbaord '));
      dispatch(setToastStatus('success'));
      dispatch(openToast());
    });
  };

  const removeProductFromCart = () => {
    // dispatch(removeProductFromGuestCart(grocery._id));
    updateCartProduct({
      user_id,
      cart_id,
      product: {
        product_id: grocery._id,
        quantity,
      },
    });
  };

  const onQuantityChanged = (e: SelectChangeEvent) => {
    updateCartProduct({
      user_id,
      cart_id,
      product: {
        product_id: grocery._id,
        quantity: Number(e.target.value),
      },
    });
    // dispatch(
    //   addProductToGuestCart({
    //     product: {
    //       product_id: grocery._id,
    //       quantity: Number(e.target.value),
    //     },
    //     update: true,
    //   })
    // );
  };

  return (
    <Paper sx={{ padding: { xs: '1rem', lg: '2rem' }, marginBottom: '1rem' }}>
      <Grid container spacing={1}>
        <Grid item xs={12} lg={5}>
          <img
            src={grocery.image_url}
            alt={grocery.product_name}
            width={'60%'}
          />
        </Grid>
        <Grid container item xs={12} lg={7}>
          <Grid item xs={12}>
            <Header5Text>
              {grocery.product_name}
            </Header5Text>
            <Header6Text>
              {grocery.brand}
            </Header6Text>
            <PrimaryText>
              {grocery.quantity}
            </PrimaryText>
          </Grid>
          <PriceCompare
            discount_price={grocery?.discount_price}
            price={grocery.price}
          />
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <QuantitySelector
              quantity={quantity}
              inStock={grocery.inStock}
              onQuantityChanged={onQuantityChanged}
              isOnCartCard
            />
            <Box
              sx={{
                display: 'flex',
                width: 'fit-content',
                marginLeft: '1rem',
              }}
            >
              <Divider orientation="vertical" flexItem />
              <Tooltip title="Copy product link">
                <IconButton onClick={copyGroceryLink}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <Divider orientation="vertical" flexItem />
              <Tooltip title="Remove product from cart">
                <IconButton onClick={removeProductFromCart}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CartGroceryCard;
