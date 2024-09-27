import { ReactElement } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

type ConfirmationDialogProps = {
  open: boolean;
  handleClose: () => void;
  title: string;
  confirmBtnText?: string;
  onConfirm: () => void;
  cancelBtnText?: string;
  dialogContent: ReactElement;
};

export const ConfirmationDialog = ({
  open,
  handleClose,
  title,
  confirmBtnText = 'Ok',
  onConfirm,
  cancelBtnText = 'Close',
  dialogContent,
}: ConfirmationDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        {dialogContent}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {cancelBtnText}
        </Button>
        <Button onClick={handleConfirm} autoFocus>
          {confirmBtnText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
