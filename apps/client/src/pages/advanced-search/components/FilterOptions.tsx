import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import AlgoliaConfig from 'constants/algolia-config';
import { FacetAttribute, FacetHit } from 'shared';

interface FilterOptionsProp {
  filterValues: FacetHit;
  attribute: FacetAttribute;
  facetFilters: string[];
  setFacetFilters: (filters: string[]) => void;
}

export const FilterOptions = ({
  filterValues,
  attribute,
  facetFilters,
  setFacetFilters,
}: FilterOptionsProp) => {
  const applyFilter = (filterVal: string, isSelected: boolean) => {
    if (!isSelected) {
      setFacetFilters([...facetFilters, `${attribute}:${filterVal}`]);
    } else {
      setFacetFilters(
        facetFilters.filter((el) => el !== `${attribute}:${filterVal}`)
      );
    }
  };

  return (
    <FormGroup>
      {Object.keys(filterValues).map((filterVal, index) => {
        const isSelected = facetFilters.some((filters) =>
          filters.includes(filterVal)
        );
        return (
          <FormControlLabel
            key={index}
            name={filterVal}
            control={
              <Checkbox
                value={filterVal}
                id={filterVal}
                checked={isSelected}
                onChange={() => applyFilter(filterVal, isSelected)}
              />
            }
            label={
              <>
                <span className="ais-RefinementList-labelText">
                  {filterVal}
                </span>
                <span className="ais-RefinementList-count">
                  <b>{` (${filterValues[filterVal]})`}</b>
                </span>
              </>
            }
          />
        );
      })}
    </FormGroup>
  );
};
