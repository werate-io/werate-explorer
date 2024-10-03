import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const instance = axios.create({
  baseURL: 'http://localhost:8080'
});

// const getBearerToken = (): string => {
//   const accessToken = getCookie('authToken'); // Use cookies instead of localStorage
//   // TODO add error handling
//   return `Bearer ${accessToken}`;
// };

const getBaseHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json'
  // Authorization: getBearerToken()
});

const baseHeaders = getBaseHeaders();

export const postData = async <T>(backendApi: string, data?: object): Promise<T> => {
  try {
    const response = await instance.post(backendApi, data, {
      headers: baseHeaders
    });
    return response as T;
  } catch (error) {
    console.error('Error posting data:', error);
    throw new Error('Failed to post data');
  }
};

export const getData = async <T>(
  backendApi: string,
  params?: Record<string, unknown>
): Promise<T> => {
  try {
    const response = await instance.get<T>(backendApi, {
      headers: baseHeaders,
      params
    });

    return response as T;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
