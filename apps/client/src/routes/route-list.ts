const RouteList = Object.freeze({
  account: {
    rootPath: '/account',
    subPaths: {
      address: 'address-list',
      orders: 'orders',
      orderDetails: 'order-details'
    }
  },
  advancedSearch: '/advanced-search',
  auth: {
    rootPath: '/auth',
    subPaths: {
      login: 'login',
      resetPswd: 'reset-password',
      signUp: 'sign-up',
      emailVerified: 'email-verified',
      verifyEmail: 'verify-email'
    }
  },
  cart: '/cart',
  checkout: {
    rootPath: '/checkout',
    subPaths: {
      success: 'success'
    }
  },
  grocery: '/grocery',
  profile: {
    rootPath: '/profile',
    subPaths: {
      changePswd: 'change-password'
    }
  },
  search: '/search'
});

export default RouteList;
