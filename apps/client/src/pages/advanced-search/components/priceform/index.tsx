import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { RHFTextField, MuiButton } from 'shared';
import AlgoliaConfig from 'constants/algolia-config';
import { LoginFormSchema, PriceFormSchema } from './schema';

interface PriceFormProps {
  setNumericFilters: (filters: string[]) => void;
}

export const PriceForm = ({ setNumericFilters }: PriceFormProps) => {
  const initialValues: PriceFormSchema = {
    min: '',
    max: '',
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(LoginFormSchema),
  });

  const onFormSubmit = (formValues: PriceFormSchema) => {
    let numericFilters: string[] = [];
    if (Boolean(formValues.min)) {
      numericFilters = [
        ...numericFilters,
        `${AlgoliaConfig.FACET_ATTRIBUTES.defaultPrice}>=${Number(
          formValues.min
        )}`,
      ];
    }
    if (Boolean(formValues.max)) {
      numericFilters = [
        ...numericFilters,
        `${AlgoliaConfig.FACET_ATTRIBUTES.defaultPrice}<${Number(
          formValues.max
        )}`,
      ];
    }
    setNumericFilters(numericFilters);
  };

  return (
    <Paper sx={{ padding: { xs: '2rem 1rem', md: '1.5rem' } }}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <RHFTextField
              name="min"
              register={register}
              label="Minimum Price"
              errorMsg={errors?.min?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <RHFTextField
              name="max"
              register={register}
              label="Maximum Price"
              errorMsg={errors?.max?.message}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: '0.5rem' }}>
            <MuiButton type="submit" text="Apply" />
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
