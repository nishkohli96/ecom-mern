/**
 * Defining all routes here, so that any change done
 * in pathname, shall be automatically applied across
 * both client and server.
 */

export const ApiRoutesConfig = Object.freeze({
  apiPrefix: '/api',
  auth: {
    pathName: 'auth',
    subRoutes: {
      checkLogin: 'authenticated',
      login: 'login',
      logout: 'logout',
      refreshToken: 'refresh-token',
      resetPassword: 'reset-password',
      verifyEmail: 'verify-email',
      findAccount: 'find-account'
    }
  },
  cart: {
    pathName: 'cart',
    subRoutes: {
      add: 'add-product',
      update: 'update-product',
      products: 'products'
    }
  },
  checkout: {
    pathName: 'checkout',
    subRoutes: {
      order: 'create-order'
    }
  },
  grocery: {
    pathName: 'grocery',
    subRoutes: {
      availability: 'availability',
      categorization: 'categorization',
      productById: 'product-id',
      productInfo: 'product-info',
      randomRecords: 'random-records'
    }
  },
  orders: {
    pathName: 'orders'
  },
  razorpay: {
    pathName: 'razorpay',
    subRoutes: {
      orders: 'orders',
      customers: 'customers',
      payments: {
        pathName: 'payments',
        subRoutes: {
          capture: 'capture',
          refund: 'refund'
        }
      },
      refunds: 'refunds',
      settlements: 'settlements'
    }
  },
  user: {
    pathName: 'user',
    subRoutes: {
      address: 'address',
      changePswd: 'change-password',
      defaultAddr: 'default-address',
      resetPswd: 'reset-password',
      update: 'update'
    }
  }
});
