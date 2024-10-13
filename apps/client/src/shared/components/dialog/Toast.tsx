import { ReactNode, forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

interface ToastProps {
  open: boolean;
  handleClose: () => void;
  message: ReactNode;
  severity: AlertColor;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  }
);

export const Toast = ({ open, handleClose, message, severity }: ToastProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {typeof message === 'object' ? JSON.stringify(message) : message}
      </Alert>
    </Snackbar>
  );
};
