import { Fragment } from 'react';
import { SearchResponse } from '@algolia/client-search';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AlgoliaConfig from 'constants/algolia-config';
import { GroceryItemHit } from 'shared';
import { FilterOptions } from './FilterOptions';

interface FilterAccordionsProps {
  searchResult: SearchResponse<GroceryItemHit>;
  facetFilters: string[];
  setFacetFilters: (filters: string[]) => void;
}

export const FilterAccordions = ({
  searchResult,
  facetFilters,
  setFacetFilters
}: FilterAccordionsProps) => {
  return (
    <Fragment>
      <Accordion expanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="categories-content"
          id="category-header"
        >
          Categories
        </AccordionSummary>
        <AccordionDetails>
          <FilterOptions
            filterValues={searchResult?.facets?.category ?? {}}
            attribute={AlgoliaConfig.FACET_ATTRIBUTES.category}
            facetFilters={facetFilters}
            setFacetFilters={setFacetFilters}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="categories-content"
          id="category-header"
        >
          Sub Categories
        </AccordionSummary>
        <AccordionDetails>
          <FilterOptions
            filterValues={searchResult?.facets?.sub_category ?? {}}
            attribute={AlgoliaConfig.FACET_ATTRIBUTES.sub_category}
            facetFilters={facetFilters}
            setFacetFilters={setFacetFilters}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="categories-content"
          id="category-header"
        >
          Brands
        </AccordionSummary>
        <AccordionDetails>
          <FilterOptions
            filterValues={searchResult?.facets?.brand ?? {}}
            attribute={AlgoliaConfig.FACET_ATTRIBUTES.brand}
            facetFilters={facetFilters}
            setFacetFilters={setFacetFilters}
          />
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
};
