import axios from 'axios';
import * as dotenv from 'dotenv';
import { getCookie } from 'cookies-next';

dotenv.config({ path: '.env' });

const instance = axios.create({ baseURL: process.env.API_PREFIX });

const getBearerToken = (): string => {
  const accessToken = getCookie('authToken');
  // TODO add error handling
  return `Bearer ${accessToken}`;
};

export const postData = async <T>(backendApi: string, data?: object): Promise<T> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: getBearerToken()
    };
    const response = await instance.post(backendApi, data, headers);
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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: getBearerToken()
    };
    const response = await instance.get<T>(backendApi, { ...headers, ...params });

    return response as T;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
