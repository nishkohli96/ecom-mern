import axios from 'axios';
import { readCookie } from 'utils/cookie-helper';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 1000,
  headers: {
    'X-Custom-Header': 'foobar',
    'Access-Control-Allow-Origin': '*',
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    const userToken = readCookie('userToken');
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
