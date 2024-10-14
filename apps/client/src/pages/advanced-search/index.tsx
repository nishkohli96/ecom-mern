import { ChangeEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import AlgoliaConfig from 'constants/algolia-config';
import { MuiPaper, GroceryListView } from 'shared';
import { useGrocerySearch } from 'hooks';
import {
  AppliedFilters,
  FilterAccordions,
  SearchSkeleton,
  PriceForm,
  PaginationWidget
} from './components';

const AdvancedSearchPage = () => {
  const location = useLocation();
  const [inputValue, setInputValue] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [facetFilters, setFacetFilters] = useState<string[]>(
    location.state ? [location.state] : []
  );
  const [numericFilters, setNumericFilters] = useState<string[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const { isFetching, searchResult } = useGrocerySearch(
    inputValue,
    AlgoliaConfig.CONFIG.hitsPerPage.products,
    currentPage,
    facetFilters,
    numericFilters
  );

  // if (isFetching) {
  //   return <SearchSkeleton />;
  // }

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <AppliedFilters
          filters={facetFilters}
          numericFilters={numericFilters}
          setNewFilters={setFacetFilters}
          setNumericFilters={setNumericFilters}
        />
        <PriceForm setNumericFilters={setNumericFilters} />
        <FilterAccordions
          searchResult={searchResult}
          facetFilters={facetFilters}
          setFacetFilters={setFacetFilters}
        />
      </Grid>
      <Grid item xs={8}>
        <MuiPaper>
          <TextField
            value={inputValue}
            fullWidth
            placeholder="Search for product, brand or category"
            InputProps={{
              startAdornment: (
                <Box
                  sx={{
                    marginRight: '0.5rem',
                    borderRadius: '50%',
                    background: (theme) => theme.palette.error.main
                  }}
                >
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </Box>
              ),
              endAdornment: (
                <IconButton>
                  <ClearIcon />
                </IconButton>
              )
            }}
            onChange={handleInputChange}
          />
          <Typography
            variant="h6"
            sx={{
              color: (theme) => theme.palette.success.main,
              margin: '1rem 0'
            }}
          >
            Showing {searchResult.nbHits} products for your search...
          </Typography>
          <GroceryListView hits={searchResult.hits} />
          <PaginationWidget
            currentPage={currentPage}
            nbPages={searchResult.nbPages}
            onPageChange={setCurrentPage}
          />
        </MuiPaper>
      </Grid>
    </Grid>
  );
};

export default AdvancedSearchPage;
