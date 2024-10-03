import axios from 'axios';
import * as dotenv from 'dotenv';
import { getCookie } from 'cookies-next';

dotenv.config({ path: '.env' });

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

const getBearerToken = (): string => {
  const accessToken = getCookie('authToken'); // Use cookies instead of localStorage
  // TODO add error handling
  return `Bearer ${accessToken}`;
};

const getBaseHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  Authorization: getBearerToken()
});

const baseHeaders = getBaseHeaders();

export const postData = async <T>(backendApi: string, data?: unknown): Promise<T> => {
  try {
    const response = await instance.post(backendApi, data, {
      headers: baseHeaders
    });
    return response.data as T;
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
      params: params
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
