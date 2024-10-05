import axios, { AxiosInstance } from 'axios';
import * as dotenv from 'dotenv';
import { getCookie } from 'cookies-next';
dotenv.config({ path: '.env' });

const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

const getBearerToken = (): string => {
  const accessToken = getCookie('authToken');
  return `Bearer ${accessToken}`;
};

instance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = getBearerToken();
    config.headers.set('Content-Type', 'application/json');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
