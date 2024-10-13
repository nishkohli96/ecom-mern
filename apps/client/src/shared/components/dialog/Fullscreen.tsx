import { ReactElement, Ref, forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface FullscreenDialogProps {
  open: boolean;
  handleClose: (openState: boolean) => void;
  title: string;
  showActionButton?: boolean;
  actionBtnText?: string;
  children: ReactElement;
}

export const FullscreenDialog = ({
  open,
  handleClose,
  title,
  showActionButton,
  actionBtnText,
  children
}: FullscreenDialogProps) => {
  const handleDialogClose = () => {
    handleClose(false);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleDialogClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative', borderRadius: 0 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleDialogClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          {showActionButton && (
            <Button autoFocus color="inherit" onClick={handleDialogClose}>
              {actionBtnText}
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  );
};
