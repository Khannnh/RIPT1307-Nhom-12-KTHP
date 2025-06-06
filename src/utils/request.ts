import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          message.error('You do not have permission to perform this action');
          break;
        case 404:
          message.error('Resource not found');
          break;
        case 500:
          message.error('Server error occurred');
          break;
        default:
          message.error(error.response.data.message || 'An error occurred');
      }
    } else {
      message.error('Network error occurred');
    }
    return Promise.reject(error);
  }
);

export { request };
