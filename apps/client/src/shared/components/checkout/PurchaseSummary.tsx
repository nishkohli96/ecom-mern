import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { CartProduct } from '@ecom-mern/shared';
import { useAppSelector, UserSelector } from 'redux-store';
import { Header4Text, Header5Text } from 'shared';
import RouteList from 'routes/route-list';

export type PurchaseDetails = {
  cartTotal: string;
  numItems: number;
  products?: CartProduct[];
  fromCart?: boolean;
};

type PurchaseSummaryProps = {
  cartTotal?: string;
  numItems?: number;
  nextBtnText: string;
  nextBtnOnClick?: () => void;
  nextBtnNavigateTo?: string;
  navigateData?: PurchaseDetails;
  disableBtn?: boolean;
};

export const PurchaseSummary = ({
  cartTotal,
  numItems,
  nextBtnText,
  nextBtnOnClick,
  nextBtnNavigateTo,
  navigateData,
  disableBtn,
}: PurchaseSummaryProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector(UserSelector);

  const cart_total = location.state?.cartTotal ?? cartTotal ?? 0;
  const num_items_in_cart = location.state?.numItems ?? numItems ?? 0;

  const handleNextBtnClick = () => {
    if (user) {
      nextBtnOnClick
        ? nextBtnOnClick()
        : navigate(nextBtnNavigateTo ?? '/', { state: navigateData });
    } else {
      navigate(`${RouteList.auth.rootPath}/${RouteList.auth.subPaths.login}`, {
        state: navigateData,
      });
    }
  };

  return (
    <Paper sx={{ padding: { xs: '1rem', lg: '2rem' } }}>
      <Header5Text>SubTotal ({num_items_in_cart} items)</Header5Text>
      <Header4Text>₹{cart_total}</Header4Text>
      <Button
        sx={{ margin: '1rem 0' }}
        fullWidth
        color="warning"
        variant="contained"
        disabled={disableBtn}
        onClick={handleNextBtnClick}
      >
        {nextBtnText}
      </Button>
    </Paper>
  );
};
