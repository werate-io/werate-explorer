import axios from 'axios';
import { setCookie, deleteCookie } from 'cookies-next'; // Add cookies-next package to handle cookies
import { getUserId } from './userService'; // Import the getUserProfile function
import { useUserStore } from '@/zustand/store'; // Import the user store
import { postData } from './werate-api';
import { LoginResponse, RegisterResponse } from '@/types/user';

const TOKEN_COOKIE_NAME = 'authToken'; // Define the token cookie name

// Registration function
export const register = async (email: string, password: string) => {
  try {
    console.log('Registering user:', email, password);
    const response = await postData<RegisterResponse>(`/api/v1/register`, { email, password });
    return response;
  } catch (error) {
    console.error('Error during registration:', error);
  }
};

// Login function (now storing token in cookies)
export const login = async (email: string, password: string) => {
  try {
    const response = await postData<LoginResponse>(`/api/v2/login`, { email, password });
    if (response.accessToken) {
      setCookie(TOKEN_COOKIE_NAME, response.accessToken, {
        maxAge: 60 * 60 * 24 * 7, // Cookie expiration (1 week, customize as needed)
        path: '/', // Make cookie available across the whole app
        secure: true // Set secure in production
      });

      // Fetch and store the user profile
      const profile = await getUserId();
      const setProfile = useUserStore.getState().setProfile; // Get the setProfile function
      setProfile(profile); // Store the profile in Zustand
    }
    return response;
  } catch (error) {
    console.error('Error during login:', error);
  }
};

// Check MFA function (still using token from cookie)
export const checkMfa = async (preAuthToken: string, mfaCode: string) => {
  try {
    const response = await axios.post(
      `/api/v1/check-mfa`,
      { code: mfaCode },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${preAuthToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error during MFA check:', error);
  }
};

// Logout function (to remove the cookie)
export const logout = () => {
  deleteCookie(TOKEN_COOKIE_NAME, { path: '/' });
  console.log('Logged out, token removed from cookies');
};

/* Proxy with Heroku (commented part updated) */
/* const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
export const register = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      proxyUrl + `${API_BASE_URL}/v1/register`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      proxyUrl + `${API_BASE_URL}/v2/login`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const data = response.data;

    // Store token in cookies for proxy login
    if (data.accessToken) {
      setCookie(TOKEN_COOKIE_NAME, data.accessToken, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      });
      setCookie('email', email, {
        // Add email to cookies
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      });
    }

    return data;
  } catch (error) {
    console.error('Error during login:', error);
  }
};

export const checkMfa = async (preAuthToken: string, mfaCode: string) => {
  try {
    const response = await axios.post(
      proxyUrl + `${API_BASE_URL}/v1/check-mfa`,
      { code: mfaCode },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${preAuthToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error during MFA check:', error);
  }
}; */
