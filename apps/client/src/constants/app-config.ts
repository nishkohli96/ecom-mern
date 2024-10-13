import { ApiRoutesConfig } from '@ecom-mern/shared';

const AppConfig = Object.freeze({
  api_endpoint: `http://localhost:3000${ApiRoutesConfig.apiPrefix}`,
  geo_api: 'https://api.countrystatecity.in/v1/countries',
  razorpay: {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID ?? '',
    scriptURL: 'https://checkout.razorpay.com/v1/checkout.js'
  }
});

export default AppConfig;
