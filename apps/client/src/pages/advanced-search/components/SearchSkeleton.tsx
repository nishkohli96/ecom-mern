import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

export const SearchSkeleton = () => (
  <Grid container spacing={3} sx={{ height: '80vh' }}>
    <Grid item xs={4}>
      <Skeleton variant="rectangular" animation="wave" height={'100%'} />
    </Grid>
    <Grid item xs={8}>
      <Skeleton variant="rectangular" animation="wave" height={'100%'} />
    </Grid>
  </Grid>
);
