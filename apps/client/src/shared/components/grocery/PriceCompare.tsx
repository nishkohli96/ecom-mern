import { Grid, Typography } from '@mui/material';

interface PriceCompareProps {
  discount_price?: number;
  price: number;
}

const PriceCompare = ({ price, discount_price }: PriceCompareProps) => {
  const isDiscounted = discount_price ? discount_price !== price : false;
  return (
    <Grid
      container
      item
      xs={12}
      alignItems="center"
      sx={{ marginBottom: '0.5rem' }}
    >
      {isDiscounted && (
        <Grid item sx={{ marginRight: '1rem' }}>
          <Typography
            variant="h6"
            sx={{ color: (theme) => theme.palette.success.main }}
          >{`₹${discount_price?.toFixed(2)}`}</Typography>
        </Grid>
      )}
      <Grid item>
        <span
          style={{
            textDecoration: isDiscounted ? 'line-through' : 'none'
          }}
        >
          ₹{price?.toFixed(2)}
        </span>
      </Grid>
    </Grid>
  );
};

export default PriceCompare;
