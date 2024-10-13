import { batch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import {
  UserAddress,
  CountryStateInfo,
  defaultCountryState,
  fallbackCountryState
} from '@ecom-mern/shared';
import {
  useAppDispatch,
  useGetAllCountriesQuery,
  useLazyGetStatesByCountryQuery,
  useLazyGetCitiesByStatesOfCountryQuery,
  setToastMessage,
  setToastStatus,
  openToast
} from 'redux-store';
import {
  RHFCheckbox,
  CityAutocomplete,
  CountryStateAutocomplete,
  FullscreenDialog,
  RHFTextField,
  MuiButton,
  PhoneInput
} from 'shared';
import { AddressFormSchema } from './schema';

interface AddAddressFormProps {
  open: boolean;
  handleClose: (state: boolean) => void;
  title: string;
  initialValues: UserAddress;
  onFormSubmit: (formData: UserAddress) => void;
  actionBtnText: string;
}

const AddAddressForm = ({
  open,
  handleClose,
  title,
  initialValues,
  onFormSubmit,
  actionBtnText
}: AddAddressFormProps) => {
  const dispatch = useAppDispatch();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(AddressFormSchema)
  });

  const {
    data: countriesList,
    isLoading: countriesLoading,
    isFetching: countriesFetching,
    isSuccess: countriesFetchSuccess,
    isError: countriesFetchError
  } = useGetAllCountriesQuery();

  if (countriesFetchError) {
    batch(() => {
      dispatch(setToastMessage('Unable to fetch countries'));
      dispatch(setToastStatus('error'));
      dispatch(openToast());
    });
  }

  const countryOptions = countriesList?.length
    ? countriesList.map((country) => ({
        name: country.name,
        iso2: country.iso2
      }))
    : countriesFetchSuccess
      ? [fallbackCountryState]
      : [defaultCountryState];

  const [
    fetchStates,
    {
      data: statesList,
      isLoading: statesLoading,
      isFetching: statesFetching,
      isSuccess: statesFetchSuccess,
      isError: statesFetchError
    }
  ] = useLazyGetStatesByCountryQuery();

  if (statesFetchError) {
    batch(() => {
      dispatch(setToastMessage('Unable to fetch states for selected country'));
      dispatch(setToastStatus('error'));
      dispatch(openToast());
    });
  }

  const statesOptions = statesList?.length
    ? statesList.map((state) => ({
        name: state.name,
        iso2: state.iso2
      }))
    : statesFetchSuccess
      ? [fallbackCountryState]
      : [defaultCountryState];

  const [
    fetchCities,
    {
      data: citiesList,
      isLoading: citiesLoading,
      isFetching: citiesFetching,
      isSuccess: citiesFetchSuccess,
      isError: citiesFetchError
    }
  ] = useLazyGetCitiesByStatesOfCountryQuery();

  const cityOptions = citiesList?.length
    ? citiesList.map((city) => city.name)
    : citiesFetchSuccess
      ? ['N/A']
      : [];

  if (citiesFetchError) {
    batch(() => {
      dispatch(setToastMessage('Unable to cities states for selected state'));
      dispatch(setToastStatus('error'));
      dispatch(openToast());
    });
  }

  const setPhoneValue = (value: string) =>
    setValue('recipientPhone', value, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true
    });

  const fetchStatesList = (selectedCountry: CountryStateInfo) => {
    const ciso = selectedCountry.iso2;
    setValue('country', selectedCountry);
    setValue('state', defaultCountryState);
    setValue('city', '');
    fetchStates(ciso);
  };

  const fetchCityList = (stateSelected: CountryStateInfo) => {
    setValue('state', stateSelected);
    setValue('city', '');
    const siso = stateSelected.iso2;
    fetchCities({
      country_iso: getValues('country.iso2'),
      state_iso: siso
    });
  };

  const setCity = (citySelected: string) => {
    setValue('city', citySelected);
  };

  const submitForm = (formValues: UserAddress) => {
    reset(initialValues);
    onFormSubmit(formValues);
  };

  return (
    <FullscreenDialog open={open} handleClose={handleClose} title={title}>
      <Grid
        container
        sx={{ padding: { xs: '2rem 1rem', sm: '2rem', lg: '2rem 3rem' } }}
      >
        <form onSubmit={handleSubmit(submitForm)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <RHFTextField
                name="recipientName"
                register={register}
                errorMsg={errors?.recipientName?.message}
                label="Recipient Fullname"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <PhoneInput
                value={getValues('recipientPhone')}
                onChange={setPhoneValue}
                errorMsg={errors?.recipientPhone?.message}
              />
            </Grid>
            <Grid container item xs={12} spacing={2} sx={{ marginTop: '1rem' }}>
              <Grid item xs={12} sm={6} md={4}>
                <CountryStateAutocomplete
                  name="country"
                  value={getValues('country')}
                  options={countryOptions}
                  isLoading={countriesLoading || countriesFetching}
                  errorMsg={errors?.country?.name?.message}
                  handleOptionSelection={fetchStatesList}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <CountryStateAutocomplete
                  name="state"
                  value={getValues('state')}
                  options={statesOptions}
                  isLoading={statesLoading || statesFetching}
                  errorMsg={errors?.state?.name?.message}
                  handleOptionSelection={fetchCityList}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <CityAutocomplete
                  name="city"
                  value={getValues('city')}
                  options={cityOptions}
                  isLoading={citiesLoading || citiesFetching}
                  errorMsg={errors?.city?.message}
                  handleOptionSelection={setCity}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <RHFTextField
                  name="houseNo"
                  register={register}
                  errorMsg={errors?.houseNo?.message}
                  label="Flat, House no., Building, Company, Apartment"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <RHFTextField
                  name="street"
                  register={register}
                  errorMsg={errors?.street?.message}
                  label="Area, Street, Sector, Village"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <RHFTextField
                  name="landmark"
                  register={register}
                  errorMsg={errors?.landmark?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <RHFTextField
                  name="zipCode"
                  register={register}
                  errorMsg={errors?.zipCode?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <RHFCheckbox name="isDefault" control={control} />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <MuiButton text={actionBtnText} type="submit" />
            </Grid>
          </Grid>
        </form>
      </Grid>
    </FullscreenDialog>
  );
};

export default AddAddressForm;
