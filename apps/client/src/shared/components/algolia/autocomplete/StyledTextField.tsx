import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

/**
 * Refer this csb
 * https://codesandbox.io/s/blue-wave-o3qrfz?file=/demo.tsx:4394-4409
 */
export const StyledTextField = styled(TextField)(({ theme }) => ({
  color: '#fff',
  background: 'rgba(255, 255, 255, 0.15)',
  borderRadius: '8px',
  width: '100%',
  maxWidth: 500,
  '& input': {
    color: '#fff !important',
    padding: '0px !important',
    '& input:focus': {
      padding: '0px !important'
    }
  },
  '& fieldset': {
    borderWidth: '0px',
    '& fieldset:hover, & fieldset:focus, & fieldset:active': {
      borderWidth: '0px'
    },
    '& .MuiInputBase-input': {
      padding: theme.spacing(2, 1, 1, 2),
      transition: theme.transitions.create('width'),
      color: '#fff',
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch'
        }
      }
    }
  }
}));
