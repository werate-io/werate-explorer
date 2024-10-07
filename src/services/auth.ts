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
    return response.data;
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return {
      statusCode: err.response.status,
      error: err.response.data.error
    };
  }
}
