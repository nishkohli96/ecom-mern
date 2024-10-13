import { Fragment } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

type CityAutocompleteProps = {
  name: string;
  value: string;
  options: string[];
  isLoading: boolean;
  errorMsg?: string;
  handleOptionSelection: (value: string) => void;
};

export function CityAutocomplete({
  name,
  value,
  options,
  isLoading,
  errorMsg,
  handleOptionSelection
}: CityAutocompleteProps) {
  return (
    <Autocomplete
      id={`${name}-select`}
      options={options}
      autoHighlight
      value={!isLoading ? value : ''}
      loading={isLoading}
      disableClearable={isLoading}
      getOptionLabel={(option) => option}
      isOptionEqualToValue={(option, value) => option === value}
      onChange={(e, val) => handleOptionSelection(val ?? '')}
      renderInput={(params) => (
        <TextField
          {...params}
          label={`Select ${name}`}
          disabled={isLoading}
          error={Boolean(errorMsg)}
          helperText={errorMsg}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {isLoading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </Fragment>
            )
          }}
        />
      )}
    />
  );
}
