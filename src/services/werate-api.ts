import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const instance = axios.create({
  baseURL: 'https://api.werate.io'
});

const getBearerToken = () => {
  const accessToken = localStorage.getItem('token');
  // TODO add error handling
  return `Bearer ${accessToken}`;
};

const getBaseHeaders = () => {
  return {
    'Content-Type': 'application/json',
    Authorization: getBearerToken()
  };
};
const baseHeaders = getBaseHeaders();

export const postData = async (backend_api: string, data?: string) => {
  try {
    const response = await instance.post(backend_api, data, {
      headers: baseHeaders
    });
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
  }
};

export const getData = async (backend_api: string, params?: Record<string, any>) => {
  try {
    const response = await instance.get(backend_api, {
      headers: baseHeaders,
      params
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw to allow caller to handle
  }
};
