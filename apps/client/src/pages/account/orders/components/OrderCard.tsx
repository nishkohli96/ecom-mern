import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DownloadIcon from '@mui/icons-material/Download';
import { OrdersListItem } from '@ecom-mern/shared';
import RouteList from 'routes/route-list';

type OrderCardProps = { key: string } & OrdersListItem;

export const OrderCard = (props: OrderCardProps) => {
  const cardRadius = '0.5rem';
  const navigate = useNavigate();

  const handleNavigateToOrderDetailsPage = () => {
    navigate(
      `${RouteList.account.rootPath}/${RouteList.account.subPaths.orderDetails}`,
      {
        state: props._id
      }
    );
  };

  return (
    <Grid
      container
      sx={{
        mb: '2rem',
        width: '100%',
        borderRadius: cardRadius,
        border: (theme) => `1px solid ${theme.palette.divider}`
      }}
    >
      <Grid
        container
        item
        xs={12}
        sx={{
          padding: '1rem',
          borderTopRightRadius: cardRadius,
          borderTopLeftRadius: cardRadius,
          background: (theme) => theme.palette.background.paper
        }}
      >
        <Grid item xs={12} md={6}>
          Order #<Typography variant="h6">{props._id}</Typography>
        </Grid>
        <Grid item xs={5} md={2}>
          Total
          <Typography variant="h6">
            ₹ {(props.payment.amount / 100).toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={7} md={4}>
          Order Placed
          <Typography variant="h6">
            {moment(props.createdAt).format('DD MMM YYYY HH:MM ')}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          padding: '1rem',
          borderBottomLeftRadius: cardRadius,
          borderBottomRightRadius: cardRadius
        }}
      >
        <Grid container item xs={12} md={8} sx={{ mb: { xs: '1rem', md: 0 } }}>
          {props.products.map((prod, idx) => (
            <Grid container key={idx} sx={{ mb: cardRadius }}>
              <Grid
                container
                item
                xs={4}
                justifyContent="center"
                alignItems="center"
              >
                <img src={prod.image_url} alt={prod.product_name} width="40%" />
              </Grid>
              <Grid container item xs={8} alignItems="center">
                {prod.product_name}
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid container item xs={12} md={4} justifyContent="center">
          <Button
            color="warning"
            variant="contained"
            sx={{ textTransform: 'none', mr: '1rem', height: 40 }}
            onClick={handleNavigateToOrderDetailsPage}
          >
            View Order
          </Button>
          <Button
            color="warning"
            variant="contained"
            sx={{ textTransform: 'none', height: 40 }}
            startIcon={<DownloadIcon />}
          >
            Invoice
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
