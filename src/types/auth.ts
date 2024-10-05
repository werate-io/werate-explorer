export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  accessExpirationDate?: string;
  refreshExpirationDate?: string;
  preAuthToken?: string;
  error?: {
    message: string;
    code: number;
  };
  statusCode?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success?: boolean;
  error?: {
    message: string;
    code: number;
  };
  statusCode?: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface MfaResponse {
  success?: boolean;
  error?: {
    message: string;
    code: number;
  };
  statusCode?: number;
}
