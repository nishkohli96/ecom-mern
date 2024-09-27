import { Fragment, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RefinementList } from 'shared';
import AlgoliaConfig from 'constants/algolia-config';

const SearchFilters = () => {
  const [expandCategory, setExpandCategory] = useState(true);
  const [expandSubCategory, setExpandSubCategory] = useState(true);
  const [expandBrand, setExpandBrand] = useState(true);

  const handleCategoryCollapse = () =>
    setExpandCategory(expanded => !expanded);
  const handleSubCategoryCollapse = () =>
    setExpandSubCategory(expanded => !expanded);
  const handleBrandCollapse = () => setExpandBrand(expanded => !expanded);

  return (
    <Fragment>
      <Accordion expanded={expandCategory} onChange={handleCategoryCollapse}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="categories-content"
          id="category-header"
        >
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RefinementList
            attribute={AlgoliaConfig.FACET_ATTRIBUTES.category}
            searchPlaceholder="Search by category..."
          />
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandSubCategory}
        onChange={handleSubCategoryCollapse}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="sub-category-content"
          id="sub-category-header"
        >
          <Typography>Sub Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RefinementList
            attribute={AlgoliaConfig.FACET_ATTRIBUTES.sub_category}
            searchPlaceholder="Search by sub-category..."
          />
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandBrand} onChange={handleBrandCollapse}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="brands-list"
          id="brands-header"
        >
          <Typography>Brands</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RefinementList attribute={AlgoliaConfig.FACET_ATTRIBUTES.brand} />
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
};

export default SearchFilters;
