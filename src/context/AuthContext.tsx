import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { login, register } from '@/services/auth';
import { LoginResponse, RegisterResponse } from '@/types/auth';
import { useWallet } from '@solana/wallet-adapter-react'; // Import the wallet context

interface AuthContextType {
  isLoggedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  signUp: (email: string, password: string) => Promise<RegisterResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { disconnect } = useWallet(); // Access the wallet disconnect function
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

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

      // Set a timer to log out the user after 1 hour
      const timer = setTimeout(() => {
        signOut();
      }, 3600000); // 1 hour in milliseconds
      setLogoutTimer(timer);
    } else {
      throw new Error('Login failed');
    }
  };

  const signOut = () => {
    deleteCookie('authToken');
    setIsLoggedIn(false);
    if (logoutTimer) {
      clearTimeout(logoutTimer); // Clear the timer if it exists
    }
    disconnect(); // Disconnect the wallet
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
