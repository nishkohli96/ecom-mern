import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Autocomplete as MUIAutocomplete,
  Box,
  CircularProgress,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AlgoliaConfig from 'constants/algolia-config';
import RouteList from 'routes/route-list';
import { GroceryItemHit } from 'shared';
import { fetchAlgoliaData } from './algolia.service';
import { StyledTextField } from './StyledTextField';

export const GroceryAutocomplete = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState<string>('');
  const [value, setValue] = useState<GroceryItemHit | null>(null);
  const [options, setOptions] = useState<GroceryItemHit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const minCharInput = AlgoliaConfig.CONFIG.search.minCharInput;
  const canSearch = inputValue.length >= minCharInput;

  useEffect(() => {
    /**
     *  Implementation of a debounce function, ie this
     *  function will only call once in every 500 ms.
     */
    const fetchProducts = setTimeout(async () => {
      if (Boolean(inputValue) && canSearch) {
        setLoading(true);
        const searchResult = await fetchAlgoliaData(inputValue);
        setOptions(searchResult?.hits ?? []);
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(fetchProducts);
  }, [inputValue]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <MUIAutocomplete
      id="search-grocery"
      fullWidth
      open={open && canSearch}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={value}
      filterOptions={(x) => x}
      noOptionsText={
        inputValue ? 'No Results Found' : 'Type something to fetch results...'
      }
      onChange={(event: any, newValue: GroceryItemHit | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        navigate(`${RouteList.grocery}/${newValue?.handle}`);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      getOptionLabel={(option) => option.product_name}
      isOptionEqualToValue={(option, value) =>
        option.product_name === value.product_name
      }
      options={options}
      loading={loading}
      sx={{
        minWidth: 200,
        '& .MuiOutlinedInput-root': {
          paddingRight: '15px!important'
        }
      }}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{
            ':not(:last-child)': {
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`
            }
          }}
          {...props}
        >
          {option.product_name}
        </Box>
      )}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          value={inputValue}
          fullWidth
          variant="outlined"
          placeholder="Search for products...."
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading && <CircularProgress color="inherit" size={20} />}
                {Boolean(inputValue) && !loading && (
                  <IconButton
                    onClick={() => {
                      setInputValue('');
                      setValue(null);
                      setOpen(false);
                    }}
                    sx={{ padding: 0 }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Fragment>
            )
          }}
        />
      )}
    />
  );
};
