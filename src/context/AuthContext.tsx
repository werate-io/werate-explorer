import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { login, register } from '@/services/auth';
import { LoginResponse, RegisterResponse } from '@/types/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  signUp: (email: string, password: string) => Promise<RegisterResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = getCookie('authToken');
    if (token) {
      setIsLoggedIn(!!token);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const data: LoginResponse = await login(email, password);
    if (data.accessToken) {
      setCookie('authToken', data.accessToken, { path: '/' });
      setIsLoggedIn(true);
    } else {
      throw new Error('Login failed');
    }
  };

  const signOut = () => {
    deleteCookie('authToken');
    setIsLoggedIn(false);
  };

  const signUp = async (email: string, password: string): Promise<RegisterResponse> => {
    const data: RegisterResponse = await register(email, password);
    if (data.success) {
      setIsLoggedIn(true);
      return data;
    } else {
      throw new Error('Registration failed');
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
