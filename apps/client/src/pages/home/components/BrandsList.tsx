import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRefinementList } from 'react-instantsearch';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import AlgoliaConfig from 'constants/algolia-config';
import RouteList from 'routes/route-list';
import { Pill, StatusMessage } from 'shared';

export const BrandsList = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<string>('');

  const { items, searchForItems } = useRefinementList({
    attribute: AlgoliaConfig.FACET_ATTRIBUTES.brand,
    limit: AlgoliaConfig.CONFIG.hitsPerPage.brands_list
  });

  const handleInputChange = (value: string) => {
    setInputValue(value);
    searchForItems(value);
  };

  return (
    <Fragment>
      <TextField
        value={inputValue}
        placeholder="Search for brands"
        fullWidth
        style={{ margin: '10px 0px' }}
        inputProps={{ style: { padding: '8px 12px', borderRadius: 4 } }}
        InputProps={{
          ...(Boolean(inputValue) && {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear input value"
                  onClick={() => handleInputChange('')}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          })
        }}
        onChange={(e) => handleInputChange(e.currentTarget.value)}
      />
      <Box sx={{ marginTop: '1rem' }}>
        {items.length > 0 ? (
          items.map((brand, index) => (
            <Pill
              key={index}
              text={`${brand.label} (${brand.count})`}
              spacing=" 0 3rem 1.5rem 0"
              onClick={() =>
                navigate(`${RouteList.advancedSearch}`, {
                  state: `${AlgoliaConfig.FACET_ATTRIBUTES.brand}:${brand.label}`
                })
              }
              hideCloseIcon
            />
          ))
        ) : (
          <StatusMessage text="No result found" />
        )}
      </Box>
    </Fragment>
  );
};
