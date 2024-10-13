import { useState } from 'react';
import { useAppSelector, useGetGroceryItemBySkuQuery } from 'redux-store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Loading,
  CenterContent,
  Header2Text,
  Header3Text,
  Header5Text,
  QuantitySelector
} from 'shared';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  useAppDispatch,
  UserSelector,
  UserCartSelector,
  addProductToGuestCart,
  useUpsertProductsToCartMutation
} from 'redux-store';
import AlgoliaConfig from 'constants/algolia-config';
import { addProductToCart } from 'utils';
import RouteList from 'routes/route-list';

const buttonSx = {
  width: '100%',
  minWidth: 150,
  maxWidth: 300,
  margin: '1rem 0'
};

const GroceryItemPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /* Extract product sku to fetch details */
  const pathArr = location.pathname.split('-');
  const productHandle = pathArr[pathArr.length - 1];

  const user = useAppSelector(UserSelector);
  const userCart = useAppSelector(UserCartSelector);

  const [upsertProductsToCart] = useUpsertProductsToCartMutation();

  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading } = useGetGroceryItemBySkuQuery(
    Number(productHandle)
  );
  const isTablet = useMediaQuery('(min-width:600px)');
  const isDiscounted = data?.discount_price !== data?.price;

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
  }

  const handleChange = (event: SelectChangeEvent) => {
    setQuantity(Number(event.target.value));
  };

  const handleAddProductToCart = () => {
    if (user) {
      upsertProductsToCart({
        user_id: user?._id ?? '',
        cart_id: userCart.cart_id ?? '',
        product: {
          product_id: data?._id ?? '',
          quantity: Number(quantity)
        }
      });
    } else {
      navigate(`${RouteList.auth.rootPath}/${RouteList.auth.subPaths.login}`, {
        state: location.pathname
      });
    }
    // dispatch(
    //   addProductToGuestCart({
    //     product: {
    //       product_id: data?._id ?? '',
    //       quantity: Number(quantity),
    //     },
    //   })
    // );
  };

  const buyProduct = () => {
    if (user) {
      navigate(`${RouteList.checkout.rootPath}`, {
        state: {
          numItems: Number(quantity),
          cartTotal: (Number(quantity) * (data?.discount_price ?? 1)).toFixed(
            2
          ),
          products: [
            {
              product_id: data?._id ?? '',
              quantity: Number(quantity)
            }
          ]
        }
      });
    } else {
      navigate(`${RouteList.auth.rootPath}/${RouteList.auth.subPaths.login}`, {
        state: location.pathname
      });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} role="presentation" onClick={handleClick}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link
            to={RouteList.advancedSearch}
            state={`${AlgoliaConfig.FACET_ATTRIBUTES.category}:${data?.category}`}
            aria-label={data?.category}
          >
            {data?.category}
          </Link>
          {data?.sub_category && (
            <Link
              to={RouteList.advancedSearch}
              state={`${AlgoliaConfig.FACET_ATTRIBUTES.sub_category}:${data?.sub_category}`}
              aria-label={data?.sub_category}
            >
              {data?.sub_category}
            </Link>
          )}
          <Typography color="text.primary">{data?.product_name}</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12} md={6}>
        <CenterContent>
          <img
            src={data?.image_url}
            alt={data?.product_name}
            width={isTablet ? 450 : '50%'}
          />
        </CenterContent>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ padding: '2rem 0rem 1rem 1rem' }}>
          <Header2Text>{data?.product_name}</Header2Text>
          <Header3Text>{data?.brand}</Header3Text>
          <Header5Text>
            {isDiscounted && (
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  color: (theme) => theme.palette.success.main
                }}
              >{`₹${data?.discount_price?.toFixed(2)}   `}</Typography>
            )}
            <span
              style={{ textDecoration: isDiscounted ? 'line-through' : 'none' }}
            >
              ₹{data?.price?.toFixed(2)}
            </span>
          </Header5Text>
          {data?.inStock && data.inStock > 0 ? (
            <Box>
              <Box sx={{ marginTop: '2rem', marginBottom: '1rem' }}>
                <QuantitySelector
                  quantity={quantity}
                  inStock={data?.inStock ?? 1}
                  onQuantityChanged={handleChange}
                />
              </Box>
              <Box>
                <Button
                  color="warning"
                  variant="contained"
                  sx={buttonSx}
                  onClick={buyProduct}
                >
                  Buy
                </Button>
              </Box>
              <Box>
                <Button
                  color="secondary"
                  variant="contained"
                  sx={buttonSx}
                  onClick={handleAddProductToCart}
                >
                  Add To Cart
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ marginTop: '3rem', marginBottom: '1rem' }}>
              <Typography
                variant="h5"
                sx={{ color: (theme) => theme.palette.warning.main }}
              >
                Oops!! This product is out of stock...
              </Typography>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default GroceryItemPage;
