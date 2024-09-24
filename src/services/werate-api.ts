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

//authentication
const API_BASE_URL = 'https://mobile.werate.io/api';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
export const register = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      proxyUrl + `${API_BASE_URL}/v1/register`,
      { email, password },
      { headers: { ['Content-Type']: ['application/json'] } }
    );
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
  }
};

// Login function
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      proxyUrl + `${API_BASE_URL}/v2/login`,
      { email, password },
      { headers: { ['Content-Type']: ['application/json'] } }
    );

    const data = response.data;

    // Assuming you want to store the token in localStorage
    if (data.accessToken) {
      localStorage.setItem('token', data.accessToken);
    }

    return data;
  } catch (error) {
    console.error('Error during login:', error);
  }
};

// Check MFA function
export const checkMfa = async (preAuthToken: string, mfaCode: string) => {
  try {
    const response = await axios.post(
      proxyUrl + `${API_BASE_URL}/v1/check-mfa`,
      { code: mfaCode },
      {
        headers: {
          ['Content-Type']: ['application/json'],
          ['Authorization']: `Bearer ${preAuthToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error during MFA check:', error);
  }
};
