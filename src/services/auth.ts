import axios from 'axios';

//authentication leaving commented code here to use it with a proxy
/* 
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
 */
const API_BASE_URL = 'https://api.werate.io/api';
export const register = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/v1/register`,
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
      `${API_BASE_URL}/v2/login`,
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
      `${API_BASE_URL}/v1/check-mfa`,
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
