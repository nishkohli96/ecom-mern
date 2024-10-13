import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

interface RHFCheckboxProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
}

export function RHFCheckbox<T extends FieldValues>({
  name,
  control
}: RHFCheckboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={<Checkbox color="secondary" {...field} />}
          label="Set as Default Address"
        />
      )}
    />
  );
}
