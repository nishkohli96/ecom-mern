import { styled } from '@mui/material/styles';

export const RootContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  width: '100%',
}));

export const ContentContainer = styled('div')({
  width: '100%',
  padding: '2rem 1rem',
});

export const CenterContent = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
});

export const FormContainer = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  minWidth: 200,
  maxWidth: 600,
  borderRadius: 8,
  padding: '2rem 2rem 3rem 2rem',
}));
