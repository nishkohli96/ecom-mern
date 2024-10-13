import { ReactElement } from 'react';
import {
  useCurrentRefinements,
  useClearRefinements
} from 'react-instantsearch';
import { Button, Box, IconButton, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Header5Text, Header6Text, Pill } from 'shared';

/**
 *  Items from useCurrentRefinements will be a nested
 *  array of attributes say brand or category which
 *  would have the brand or category filters list in
 *  the "refinementItem.refinements" array.
 */

const CurrentRefinementsWidget = (): ReactElement => {
  const { items, refine: currentRefine } = useCurrentRefinements();
  const { refine: clearRefine } = useClearRefinements();

  if (items.length === 0) {
    return <></>;
  }

  return (
    <Paper sx={{ padding: '1.5rem 1rem', marginBottom: '1rem ' }}>
      <Header5Text>Filters Applied</Header5Text>
      {items.map((refinementItem) => {
        return (
          <Box key={refinementItem.attribute} sx={{ marginBottom: '0.5rem' }}>
            <Typography color="secondary">
              {refinementItem.attribute.toUpperCase()}
            </Typography>
            {refinementItem.refinements.map((ri) => (
              <Pill
                key={ri.label}
                text={ri.label}
                onClick={() => currentRefine(ri)}
              />
            ))}
          </Box>
        );
      })}
      <Button
        color="secondary"
        variant="outlined"
        sx={{ marginTop: '0.5rem' }}
        onClick={clearRefine}
      >
        Clear All Filters
      </Button>
    </Paper>
  );
};

export default CurrentRefinementsWidget;
