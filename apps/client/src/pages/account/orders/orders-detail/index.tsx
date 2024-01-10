import { useLocation, Link } from 'react-router-dom';
import moment from 'moment';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { OrderStatus } from '@ecom/mern-shared';
import { useGetOrderDetailsQuery } from 'redux-store';
import { Loading } from 'shared';
import RouteList from 'routes/route-list';

const OrdersDetailPage = () => {
  const location = useLocation();
  const orderId = location.state;
  const paperPadding = '1.5rem 1rem';

  const { data: orderData, isLoading } = useGetOrderDetailsQuery(orderId);

  if (isLoading) {
    return <Loading />;
  }

  const orderStatus = orderData?.order_status;
  const isProcessing =
    orderStatus === OrderStatus.Processing ||
    orderStatus === OrderStatus.InTransit;
  const isDelivered = orderStatus === OrderStatus.Delivered;

  const HeadingText = ({ text }: { text: string }) => (
    <Typography
      variant="h6"
      sx={{ fontWeight: 'bold', color: (theme) => theme.palette.primary.main }}
    >
      {text}
    </Typography>
  );

  return (
    <Grid container spacing={1} direction={{ xs: 'column-reverse', md: 'row' }}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ padding: paperPadding }}>
          {orderData?.products?.map((prod, idx) => (
            <Grid container key={idx} sx={{ mb: '1.5rem' }}>
              <Grid
                container
                item
                xs={12}
                md={5}
                justifyContent="center"
                alignItems="center"
                sx={{ mb: { xs: '1.5rem', md: 0 } }}
              >
                <img src={prod.image_url} alt={prod.product_name} width="40%" />
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  <Link
                    to={`${RouteList.grocery}/${prod.handle}`}
                    state={prod._id}
                    aria-label={prod.product_name}
                  >
                    {prod.product_name}
                  </Link>{' '}
                  ({prod.quantity})
                </Typography>
                <Typography>{prod.brand}</Typography>
                <Typography>
                  ₹{prod.discount_price.toFixed(2)} x {prod.num_items}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Paper>
      </Grid>
      <Grid container item xs={12} md={4}>
        <Paper sx={{ padding: paperPadding }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <HeadingText text="Order Details" />
            </Grid>
            <Grid item xs={12}>
              <b>Order Id: </b>
              {orderData?._id}
            </Grid>
            <Grid item xs={12}>
              <b>Amount: </b>₹{' '}
              {((orderData?.payment?.amount ?? 0) / 100).toFixed(2)}
            </Grid>
            <Grid item xs={12}>
              <b>Order Placed: </b>
              {moment(orderData?.createdAt).format('DD MMM YYYY HH:MM ')}
            </Grid>
            <Grid item xs={12}>
              <HeadingText text="Shipping Address" />
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <b>{orderData?.deliveryAddress?.recipientName}</b>
                {` ( ${orderData?.deliveryAddress?.recipientPhone} )`}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                {`${orderData?.deliveryAddress?.houseNo}, ${orderData?.deliveryAddress?.street}, `}
                {Boolean(orderData?.deliveryAddress?.landmark) &&
                  `${orderData?.deliveryAddress?.landmark}, `}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                {`${
                  orderData?.deliveryAddress?.city
                }, ${orderData?.deliveryAddress?.state.name.toUpperCase()} - ${
                  orderData?.deliveryAddress?.zipCode
                }  `}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                {orderData?.deliveryAddress?.country.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  color: (theme) =>
                    isProcessing
                      ? theme.palette.warning.main
                      : isDelivered
                      ? theme.palette.success.main
                      : theme.palette.text.primary,
                }}
              >
                Your order is {orderData?.order_status?.toUpperCase()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button color="error" variant="contained">
                Cancel Order
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OrdersDetailPage;
