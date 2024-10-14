import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Header5Text, Header6Text, GroceryItemHit } from 'shared';
import RouteList from 'routes/route-list';

interface GroceryListViewProps {
  hits: GroceryItemHit[];
}

const GroceryListView = ({ hits }: GroceryListViewProps) => {
  const navigate = useNavigate();

  const handleClickOnHit = (hit: GroceryItemHit) => {
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
              key={hit._id}
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
              <Header5Text>{hit.product_name}</Header5Text>
              <Header6Text>{hit.brand}</Header6Text>
              <Typography>₹{hit.discount_price.toFixed(2)}</Typography>
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

export default GroceryListView;
