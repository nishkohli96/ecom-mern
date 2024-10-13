import { MouseEvent, useState } from 'react';
import { UseFormRegister, Path, FieldValues } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export type FormInputProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  errorMsg?: string;
} & Omit<TextFieldProps, 'name'>;

export function RHFTextField<T extends FieldValues>(props: FormInputProps<T>) {
  const { name, register, errorMsg, ...rest } = props;
  const isError = Boolean(errorMsg);
  const fieldLabel = name.charAt(0).toUpperCase() + name.slice(1, name.length);

  return (
    <TextField
      {...(register && register(name))}
      name={name}
      autoComplete={name}
      label={fieldLabel}
      {...rest}
      error={isError}
      helperText={errorMsg}
      fullWidth
    />
  );
}

export function RHFPasswordField<T extends FieldValues>(
  props: FormInputProps<T>
) {
  const { name, register, errorMsg, ...rest } = props;
  const isError = Boolean(errorMsg);
  const fieldLabel = name.charAt(0).toUpperCase() + name.slice(1, name.length);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <TextField
      {...(register && register(name))}
      label={fieldLabel}
      {...rest}
      error={isError}
      helperText={errorMsg}
      fullWidth
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
}
