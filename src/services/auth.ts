import instance from './werate-api';
import { LoginResponse, RegisterResponse, MfaResponse } from '@/types/auth';
interface ErrorResponse {
  response: {
    status: number;
    data: {
      error: {
        message: string;
        code: number;
      };
    };
  };
}
export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const result = await instance.post<LoginResponse>('/api/v2/login', { email, password });

    // Store the accessToken and refreshToken in cookies
    const accessToken = result.data.accessToken;
    const refreshToken = result.data.refreshToken;

    // Set access token cookie
    const expirationDate = result.data.accessExpirationDate
      ? new Date(result.data.accessExpirationDate)
      : new Date(); // {{ edit_1 }}
    document.cookie = `accessToken=${accessToken}; path=/; expires=${expirationDate.toUTCString()}; Secure; HttpOnly`; // {{ edit_2 }}

    // Set refresh token cookie
    document.cookie = `refreshToken=${refreshToken}; path=/; expires=${new Date(result.data.refreshExpirationDate || Date.now()).toUTCString()}; Secure; HttpOnly`; // {{ edit_3 }}

    return result.data;
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return {
      statusCode: err.response.status,
      error: err.response.data.error
    };
  }
}

export async function register(email: string, password: string): Promise<RegisterResponse> {
  try {
    const response = await instance.post<RegisterResponse>('/api/v1/register', { email, password });
    return response.data;
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return {
      statusCode: err.response.status,
      error: err.response.data.error
    };
  }
}

export async function checkMfa(preAuthToken: string, mfaCode: string): Promise<MfaResponse> {
  try {
    const response = await instance.post<MfaResponse>('/api/v1/check-mfa', {
      preAuthToken,
      mfaCode
    });

    // Set preAuthToken cookie
    document.cookie = `preAuthToken=${preAuthToken}; path=/; Secure; HttpOnly`; // {{ edit_1 }}

    return response.data;
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return {
      statusCode: err.response.status,
      error: err.response.data.error
    };
  }
}
