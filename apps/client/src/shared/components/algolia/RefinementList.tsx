import { ReactElement, useState } from 'react';
import { useRefinementList } from 'react-instantsearch';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import { PrimaryText } from 'shared';
import AlgoliaConfig from 'constants/algolia-config';

interface RefinementListCustomProps {
  attribute: string;
  searchPlaceholder?: string;
}

export const RefinementList = ({
  attribute,
  searchPlaceholder
}: RefinementListCustomProps): ReactElement => {
  const [inputValue, setInputValue] = useState<string>('');
  const { items, refine, searchForItems } = useRefinementList({
    attribute,
    limit: AlgoliaConfig.CONFIG.hitsPerPage.brand_categories
  });

  const handleInputChange = (value: string) => {
    setInputValue(value);
    searchForItems(value);
  };

  return (
    <div className="ais-RefinementList">
      <TextField
        value={inputValue}
        placeholder={searchPlaceholder ?? `Search for ${attribute}`}
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
          <FormGroup>
            {items.map((item) => (
              <FormControlLabel
                key={item.value}
                control={
                  <Checkbox
                    value={item.value}
                    checked={item.isRefined}
                    onChange={() => refine(item.value)}
                  />
                }
                label={
                  <>
                    <span className="ais-RefinementList-labelText">
                      {item.label}
                    </span>
                    <span className="ais-RefinementList-count">
                      <b>{` (${item.count})`}</b>
                    </span>
                  </>
                }
              />
            ))}
          </FormGroup>
        ) : (
          <PrimaryText>
            No
            {attribute} found for current search...{' '}
          </PrimaryText>
        )}
      </Box>
    </div>
  );
};
