import { Fragment } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { CountryStateInfo, defaultCountryState } from '@ecom/mern-shared';

type CountryStateAutocompleteProps = {
  name: string;
  value: CountryStateInfo;
  options: CountryStateInfo[];
  isLoading: boolean;
  errorMsg?: string;
  handleOptionSelection: (value: CountryStateInfo) => void;
};

export function CountryStateAutocomplete({
  name,
  value,
  options,
  isLoading,
  errorMsg,
  handleOptionSelection,
}: CountryStateAutocompleteProps) {
  return (
    <Autocomplete
      id={`${name}-select`}
      options={options}
      autoHighlight
      value={!isLoading ? value : defaultCountryState}
      loading={isLoading}
      disableClearable={isLoading}
      getOptionLabel={option => option.name}
      onChange={(e, val) => handleOptionSelection(val ?? defaultCountryState)}
      isOptionEqualToValue={(option, value) => option.iso2 === value.iso2}
      renderInput={params => (
        <TextField
          {...params}
          label={`Select ${name}`}
          disabled={isLoading}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {isLoading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
          error={Boolean(errorMsg)}
          helperText={errorMsg}
        />
      )}
    />
  );
}
