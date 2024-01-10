import { Button, ButtonProps } from '@mui/material';

interface MuiButtonProps extends ButtonProps {
  text: string;
}

export const MuiButton = ({ text, ...btnProps }: MuiButtonProps) => (
  <Button
    variant="contained"
    {...btnProps}
    sx={{ ...btnProps.sx, minWidth: 100 }}
  >
    {text}
  </Button>
);
