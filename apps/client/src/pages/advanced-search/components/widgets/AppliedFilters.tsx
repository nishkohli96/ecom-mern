import { ReactElement, Fragment } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Header5Text, Pill } from 'shared';
import { categorizeFacets } from 'utils';

interface AppliedFiltersProps {
  filters: string[];
  numericFilters: string[];
  setNewFilters: (newFilters: string[]) => void;
  setNumericFilters: (numericFilters: string[]) => void;
}

export const AppliedFilters = ({
  filters,
  numericFilters,
  setNewFilters,
  setNumericFilters
}: AppliedFiltersProps): ReactElement => {
  if (filters.length === 0 && numericFilters.length === 0) {
    return <></>;
  }

  const appliedFilters = categorizeFacets(filters);

  const removeFilter = (filterName: string) => {
    setNewFilters(filters.filter((el) => !el.includes(filterName)));
  };

  return (
    <Paper sx={{ padding: '1.5rem 1rem', marginBottom: '1rem ' }}>
      <Header5Text>Filters Applied</Header5Text>
      {Object.keys(appliedFilters).map((filter, idx) => {
        return (
          <Fragment key={idx}>
            {appliedFilters[filter].length > 0 ? (
              <Box sx={{ marginBottom: '0.5rem' }}>
                <Typography color="primary">{filter.toUpperCase()}</Typography>
                {appliedFilters[filter].map((filterName, idx2) => (
                  <Pill
                    key={idx2}
                    text={filterName}
                    onClick={() => removeFilter(filterName)}
                  />
                ))}
              </Box>
            ) : (
              <></>
            )}
          </Fragment>
        );
      })}
      {numericFilters.length > 0 ? (
        <Box sx={{ marginBottom: '0.5rem' }}>
          {numericFilters.map((num, idx) => {
            const isMin = num.includes('>=');
            const priceValue = num.replace(/([a-zA-Z><=_ ])/g, '');
            return (
              <Pill
                key={idx}
                text={`Price ${isMin ? '>=' : '<'} ${priceValue}`}
                onClick={() =>
                  setNumericFilters(
                    numericFilters.filter((filter) => filter !== num)
                  )
                }
              />
            );
          })}
        </Box>
      ) : (
        <></>
      )}
      <Button
        color="secondary"
        variant="outlined"
        sx={{ marginTop: '0.5rem' }}
        onClick={() => {
          setNewFilters([]);
          setNumericFilters([]);
        }}
      >
        Clear All Filters
      </Button>
    </Paper>
  );
};
