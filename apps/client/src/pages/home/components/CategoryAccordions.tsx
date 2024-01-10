import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GroceryCategorization } from '@ecom/mern-shared';
import AlgoliaConfig from 'constants/algolia-config';
import RouteList from 'routes/route-list';

export const CategoryAccordions = ({
  categories,
}: Pick<GroceryCategorization, 'categories'>) => {
  const navigate = useNavigate();
  return (
    <Fragment>
      {categories.map((category, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                fontSize: '1.25rem',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() =>
                navigate(`${RouteList.advancedSearch}`, {
                  state: `${AlgoliaConfig.FACET_ATTRIBUTES.category}:${category.name}`,
                })
              }
            >
              {category.name} <b>({category.num_products})</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {category.sub_categories.map((subCategory, idx2) => (
              <Typography
                key={idx2}
                onClick={() =>
                  navigate(`${RouteList.advancedSearch}`, {
                    state: `${AlgoliaConfig.FACET_ATTRIBUTES.sub_category}:${subCategory.name}`,
                  })
                }
                sx={{
                  marginLeft: '1rem',
                  marginBottom: '0.75rem',
                  '&:hover': { cursor: 'pointer', textDecoration: 'underline' },
                }}
              >
                {subCategory.name} <b>({subCategory.num_products})</b>
              </Typography>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Fragment>
  );
};
