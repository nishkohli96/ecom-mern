import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  ContentContainer,
  ErrorBoundary,
  Navbar,
  StatusMessage,
  Toast,
} from 'shared';
import {
  useAppSelector,
  useAppDispatch,
  ToastSelector,
  UserSelector,
  closeToast,
} from 'redux-store';
import RouteGuard from './RouteGuard';
import RouteList from './route-list';

import Homepage from 'pages/home';
import SignUpForm from 'pages/auth/signup';
import LoginForm from 'pages/auth/login';
import CartPage from 'pages/cart';
import Page404 from 'pages/Page404';

const VerifyEmailPage = lazy(() => import('pages/auth/verify-email'));
const ResetPswdPage = lazy(() => import('pages/auth/reset-pswd'));
const EmailVerifySuccessPage = lazy(
  () => import('pages/auth/email-verify-success')
);

const SearchResultsPage = lazy(() => import('pages/search-results-page'));
const AdvancedSearchPage = lazy(() => import('pages/advanced-search'));
const GroceryItemPage = lazy(() => import('pages/grocery-item'));

const UserProfilePage = lazy(() => import('pages/profile'));
const ChangePswdPage = lazy(() => import('pages/profile/change-pswd'));

const AccountPage = lazy(() => import('pages/account'));
const OrdersList = lazy(() => import('pages/account/orders'));
const OrdersDetailPage = lazy(
  () => import('pages/account/orders/orders-detail')
);
const AddressList = lazy(() => import('pages/account/manage-address'));

const CheckoutPage = lazy(() => import('pages/checkout'));
const OrderPlacedPage = lazy(() => import('pages/checkout/order-placed'));

const Routing = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(UserSelector);
  const { open, status, message } = useAppSelector(ToastSelector);

  return (
    <BrowserRouter>
      <Navbar />
      <ContentContainer>
        {/* <ErrorBoundary fallback={<StatusMessage text="Something went wrong" />}> */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          {/* Search & Grocery Page */}
          <Route path={RouteList.search} element={<SearchResultsPage />} />
          <Route
            path={RouteList.advancedSearch}
            element={<AdvancedSearchPage />}
          />
          <Route
            path={`${RouteList.grocery}/:item`}
            element={<GroceryItemPage />}
          />
          {/* Guest Routes */}
          <Route element={<RouteGuard isAllowed={!user} />}>
            <Route path={RouteList.auth.rootPath}>
              <Route
                path={RouteList.auth.subPaths.login}
                element={<LoginForm />}
              />
              <Route
                path={RouteList.auth.subPaths.signUp}
                element={<SignUpForm />}
              />
              <Route
                path={RouteList.auth.subPaths.resetPswd}
                element={<ResetPswdPage />}
              />
              <Route
                path={RouteList.auth.subPaths.emailVerified}
                element={<EmailVerifySuccessPage />}
              />
              <Route
                path={RouteList.auth.subPaths.verifyEmail}
                element={<VerifyEmailPage />}
              />
            </Route>
          </Route>

          {/* Logged user Routes */}
          <Route element={<RouteGuard isAllowed={Boolean(user)} />}>
            {/* Account */}
            <Route path={RouteList.account.rootPath}>
              <Route index element={<AccountPage />} />
              <Route
                path={RouteList.account.subPaths.address}
                element={<AddressList />}
              />
              <Route
                path={RouteList.account.subPaths.orders}
                element={<OrdersList />}
              />
              <Route
                path={RouteList.account.subPaths.orderDetails}
                element={<OrdersDetailPage />}
              />
            </Route>
            {/* Profile */}
            <Route path={RouteList.profile.rootPath}>
              <Route index element={<UserProfilePage />} />
              <Route
                path={RouteList.profile.subPaths.changePswd}
                element={<ChangePswdPage />}
              />
            </Route>
            {/* Cart & Checkout */}
            <Route path={RouteList.cart} element={<CartPage />} />
            <Route path={RouteList.checkout.rootPath}>
              <Route path="" element={<CheckoutPage />} />
              <Route
                path={RouteList.checkout.subPaths.success}
                element={<OrderPlacedPage />}
              />
            </Route>
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<Page404 />} />
        </Routes>
        {/* </ErrorBoundary> */}
      </ContentContainer>
      <Toast
        open={open}
        severity={status}
        message={message}
        handleClose={() => dispatch(closeToast())}
      />
    </BrowserRouter>
  );
};

export default Routing;
