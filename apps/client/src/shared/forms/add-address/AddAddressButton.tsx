import { Fragment, useState } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import AddAddressDialog from './AddAddressDialog';

type AddAddressButtonProps = {
  text: string;
};

export const AddAddressButton = ({ text }: AddAddressButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleOpenDialog = () => setDialogOpen(true);

  return (
    <Fragment>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenDialog}
      >
        {text}
      </Button>
      {dialogOpen && (
        <AddAddressDialog
          open={dialogOpen}
          handleClose={() => setDialogOpen(false)}
        />
      )}
    </Fragment>
  );
};
