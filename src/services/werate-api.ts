import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const instance = axios.create({
  baseURL: 'https://api.werate.io'
});

const getBearerToken = () => {
  if (typeof localStorage === 'undefined') {
    console.error('localStorage is not available');
    return null; // or handle accordingly
  }

  const accessToken = localStorage.getItem('token');
  // TODO add error handling
  return `Bearer ${accessToken}`;
};

const getBaseHeaders = () => {
  return {
    ['Content-Type']: 'application/json',
    ['Authorization']: getBearerToken()
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
