import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({path: '.env'});

export const postData = async (backend_api: string, data?: string) => {
  try {
    const response = await axios.post(
      `http://localhost:8080${backend_api}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if(response.data.success)
      {
        return response.data.success
      }
    else{
      return response.data.message
    }
  } catch (error) {
    console.error('Error posting data:', error);
  }

};

export const getData = async (backend_api: string, params?: object) => {
  try {
    const response = await axios.get(
      `http://localhost:8080${backend_api}`,
      {
        params,  // Pass params here instead of data
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      return response.data.success;
    } else {
      return response.data.message;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};