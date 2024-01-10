import { styled } from '@mui/material/styles';

export const PrimaryText = styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  marginBottom: '1rem',
}));

export const Header1Text = styled('h1')(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const Header2Text = styled('h2')(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const Header3Text = styled('h3')(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const Header4Text = styled('h4')(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const Header5Text = styled('h5')(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const Header6Text = styled('h6')(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const LinkText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    fontWeight: 'bolder',
  },
}));
