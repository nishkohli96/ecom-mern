import { Button, ButtonProps } from '@mui/material';
import Close from '@mui/icons-material/Close';

type PillProps = ButtonProps & {
  text: string;
  spacing?: string;
  hideCloseIcon?: boolean;
};

export const Pill = ({
  text,
  spacing,
  hideCloseIcon,
  ...btnProps
}: PillProps) => {
  return (
    <Button
      variant="contained"
      color="info"
      sx={{
        borderRadius: '1rem',
        opacity: 0.9,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        margin: spacing ?? '0.5rem 0',
        textTransform: 'none',
      }}
      endIcon={hideCloseIcon ? undefined : <Close />}
      {...btnProps}
    >
      {text}
    </Button>
  );
};
