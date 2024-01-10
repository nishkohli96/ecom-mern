import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import SearchFilters from './SearchFilters';
import ResultsList from './ResultsList';
import { CurrentRefinementsWidget, PaginationWidget } from './widgets';

const SearchResultsPage = () => (
  <Grid container spacing={2}>
    <Grid
      item
      md={4}
      lg={3}
      sx={{
        display: { xs: 'none', md: 'block' },
      }}
    >
      <CurrentRefinementsWidget />
      <SearchFilters />
    </Grid>
    <Grid item xs={12} md={8} lg={9}>
      <Paper sx={{ padding: { xs: '1rem', sm: '2rem' } }}>
        <Typography
          sx={{
            marginBottom: '1rem',
            color: (theme) => theme.palette.warning.main,
          }}
        >
          <sup>*</sup> This page uses algolia widgets that are controlled by
          instantsearch.
        </Typography>
        <ResultsList />
        <PaginationWidget />
      </Paper>
    </Grid>
  </Grid>
);

export default SearchResultsPage;
