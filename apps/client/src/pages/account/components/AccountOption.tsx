import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export type AccountOptionObject = {
  title: string;
  description: string;
  to: string;
  icon: ReactElement;
};

export const AccountOption = (props: AccountOptionObject) => {
  return (
    <Link to={props.to} aria-label={props.title} className="grid-link">
      <Box sx={{ padding: '0.25rem 0.5rem' }}>
        <Grid
          container
          sx={{
            borderRadius: '8px',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            padding: '0.5rem 0.25rem'
          }}
        >
          <Grid
            item
            xs={3}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {props.icon}
          </Grid>
          <Grid container item xs={9}>
            <Grid item xs={12} sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              {props.title}
            </Grid>
            <Grid item xs={12} sx={{ fontSize: '0.8rem' }}>
              {props.description}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Link>
  );
};
