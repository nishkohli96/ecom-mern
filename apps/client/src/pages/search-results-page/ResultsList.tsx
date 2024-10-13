import { useNavigate } from 'react-router-dom';
import { useHits, UseHitsProps, Highlight } from 'react-instantsearch';
import type { Hit } from 'instantsearch.js';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AlgoliaConfig from 'constants/algolia-config';
import { Header5Text, Header6Text, GroceryItemHit } from 'shared';
import RouteList from 'routes/route-list';

const ResultsList = (props: UseHitsProps<GroceryItemHit>) => {
  const { hits, sendEvent } = useHits(props);
  const navigate = useNavigate();

  const handleClickOnHit = (hit: Hit<GroceryItemHit>) => {
    // sendEvent(
    //   AlgoliaConfig.ALGOLIA_EVENTS.click,
    //   hit,
    //   AlgoliaConfig.USER_EVENTS.product_click
    // );
    navigate(`${RouteList.grocery}/${hit.handle}`, {
      state: hit._id
    });
  };

  return (
    <Box>
      {hits.length > 0 ? (
        <Grid container>
          {hits.map((hit) => (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              key={hit.objectID}
              sx={{
                padding: '1rem',
                cursor: 'pointer',
                border: (theme) => `1px solid ${theme.palette.divider}`
              }}
              onClick={() => handleClickOnHit(hit)}
            >
              <div className="d-flex justify-content-center">
                <img
                  src={hit.image_url}
                  alt={hit.product_name}
                  style={{
                    width: '50%',
                    marginBottom: '1rem'
                  }}
                />
              </div>
              <Header5Text>
                <Highlight hit={hit} attribute="product_name" />
              </Header5Text>
              <Header6Text>
                <Highlight hit={hit} attribute="brand" />
              </Header6Text>
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className="col-12 d-flex justify-content-center ">
          <Header5Text>No Results Found...</Header5Text>
        </div>
      )}
    </Box>
  );
};

export default ResultsList;
