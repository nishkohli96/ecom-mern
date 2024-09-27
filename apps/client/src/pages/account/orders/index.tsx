import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {
  useAppSelector,
  useGetOrdersListQuery,
  UserSelector,
} from 'redux-store';
import { Header4Text, Loading, StatusMessage } from 'shared';
import { OrderCard } from './components';

const OrdersList = () => {
  const user = useAppSelector(UserSelector);
  const { data: ordersList, isLoading } = useGetOrdersListQuery(
    user?._id ?? ''
  );
  return (
    <Container>
      <Header4Text>Your Orders</Header4Text>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid container sx={{ mt: '1.5rem' }}>
          {ordersList && ordersList.length > 0 ? (
            ordersList?.map(order => <OrderCard key={order._id} {...order} />)
          ) : (
            <StatusMessage text="No orders placed..." />
          )}
        </Grid>
      )}
    </Container>
  );
};

export default OrdersList;
