import { ReactElement } from 'react';
import Paper from '@mui/material/Paper';

interface MuiPaperProps {
  children: ReactElement | ReactElement[];
}

export const MuiPaper = ({ children }: MuiPaperProps) => {
  return (
    <Paper sx={{ height: '100%', padding: { xs: '2rem 1rem', md: '1.5rem' } }}>
      {children}
    </Paper>
  );
};
